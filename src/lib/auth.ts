import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"

import { auth, db } from "@/lib/firebase"

export const userRoles = ["Staff", "Student", "Admin", "Parent"] as const
export type UserRole = (typeof userRoles)[number]
export type SelfAssignableRole = Exclude<UserRole, "Admin">

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  role: UserRole
}

/** Thrown when Auth succeeds but the Firestore profile document is missing. */
export class IncompleteProfileError extends Error {
  readonly uid: string
  readonly email: string

  constructor(uid: string, email: string) {
    super(
      "Your account exists but profile setup was never completed. Finish signup or contact an administrator."
    )
    this.name = "IncompleteProfileError"
    this.uid = uid
    this.email = email
  }
}

function isUserRole(role: unknown): role is UserRole {
  return (userRoles as readonly unknown[]).includes(role)
}

async function saveUserProfile(
  user: User,
  displayName: string,
  role: SelfAssignableRole
): Promise<void> {
  await updateProfile(user, { displayName })
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    displayName,
    role,
    createdAt: serverTimestamp(),
  })
}

async function signOutAfterFailure(originalError: unknown): Promise<void> {
  try {
    await signOut(auth)
  } catch (signOutError) {
    throw new AggregateError(
      [originalError, signOutError],
      "The account could not be verified and the session could not be closed. Please try again.",
      { cause: signOutError }
    )
  }
}

/**
 * Create a new account + Firestore profile.
 * If the email is already registered, throws a clear email-already-in-use error
 * (no silent sign-in attempt that can produce a confusing wrong-password message).
 */
export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string,
  role: SelfAssignableRole
): Promise<User> {
  let user: User

  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    user = credential.user
  } catch (error) {
    // Do not attempt password recovery here — it turns email-already-in-use
    // into "incorrect password" and confuses users.
    throw error
  }

  try {
    await saveUserProfile(user, displayName, role)
  } catch (profileError) {
    // Best-effort cleanup so the user can retry signup with the same email.
    try {
      await deleteUser(user)
    } catch (cleanupError) {
      throw new AggregateError(
        [profileError, cleanupError],
        "Your account was created, but profile setup failed. Delete the user in Firebase Authentication (or use Sign in if the password is correct) and try again.",
        { cause: cleanupError }
      )
    }

    throw profileError
  }

  return user
}

/**
 * Complete profile for an Auth user that has no Firestore document yet.
 * Call this after a successful sign-in that raised IncompleteProfileError,
 * while the user is still signed in.
 */
export async function completeIncompleteProfile(
  displayName: string,
  role: SelfAssignableRole
): Promise<UserProfile> {
  const user = auth.currentUser
  if (!user || !user.email) {
    throw new Error("You must be signed in to complete your profile.")
  }

  await saveUserProfile(user, displayName, role)

  const profile = await getUserProfile(user.uid)
  if (!profile) {
    throw new Error("Profile was written but could not be read back. Check Firestore rules.")
  }
  return profile
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const profileSnapshot = await getDoc(doc(db, "users", uid))
  if (!profileSnapshot.exists()) return null

  const data = profileSnapshot.data()
  if (
    data.uid !== uid ||
    typeof data.email !== "string" ||
    typeof data.displayName !== "string" ||
    !isUserRole(data.role)
  ) {
    return null
  }

  return {
    uid,
    email: data.email,
    displayName: data.displayName,
    role: data.role,
  }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserProfile> {
  const { user } = await signInWithEmailAndPassword(auth, email, password)

  let profile: UserProfile | null
  try {
    profile = await getUserProfile(user.uid)
  } catch (error) {
    await signOutAfterFailure(error)
    throw error
  }

  if (profile) return profile

  // Keep the session so the UI can offer "complete profile" without another password entry.
  throw new IncompleteProfileError(user.uid, user.email ?? email)
}

export async function signOutUser(): Promise<void> {
  await signOut(auth)
}

function findFirebaseError(error: unknown): FirebaseError | null {
  if (error instanceof FirebaseError) return error

  if (error instanceof AggregateError) {
    for (const nestedError of error.errors) {
      const firebaseError = findFirebaseError(nestedError)
      if (firebaseError) return firebaseError
    }
  }

  if (error instanceof Error && error.cause !== undefined) {
    return findFirebaseError(error.cause)
  }

  return null
}

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof IncompleteProfileError) {
    return error.message
  }

  const firebaseError = findFirebaseError(error)
  if (firebaseError) {
    switch (firebaseError.code) {
      case "auth/email-already-in-use":
        return "An account already exists for this email. Sign in instead."
      case "auth/invalid-credential":
      case "auth/invalid-login-credentials":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "The email or password is incorrect."
      case "auth/invalid-email":
        return "Enter a valid email address."
      case "auth/weak-password":
        return "Choose a stronger password with at least 8 characters."
      case "auth/too-many-requests":
        return "Too many attempts. Please wait and try again."
      case "auth/operation-not-allowed":
        return "Email and password sign-in is not enabled for this Firebase project."
      case "auth/unauthorized-domain":
        return "This website domain is not authorized in Firebase Authentication settings."
      case "auth/invalid-api-key":
      case "auth/app-not-authorized":
      case "auth/configuration-not-found":
        return "Firebase Authentication is not configured correctly. Verify the Firebase web app settings."
      case "auth/network-request-failed":
      case "unavailable":
      case "deadline-exceeded":
        return "Could not connect to Firebase. Check your internet connection and try again."
      case "auth/timeout":
        return "The connection to Firebase timed out. Please try again."
      case "auth/user-disabled":
        return "This account has been disabled. Contact your administrator."
      case "permission-denied":
        return "Your profile could not be saved or read. Deploy the Firestore security rules from this repository (firebase deploy --only firestore:rules)."
      case "unauthenticated":
        return "Your Firebase session expired. Sign in again."
      case "failed-precondition":
        return "Firestore is not ready. Create the database and deploy the Firestore security rules."
      case "resource-exhausted":
        return "Firebase is temporarily rate-limiting requests. Please try again shortly."
      default:
        return "Authentication failed. Please try again."
    }
  }

  if (error instanceof Error) return error.message
  return "Authentication failed. Please try again."
}

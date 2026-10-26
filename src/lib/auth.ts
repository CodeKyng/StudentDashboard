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

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string,
  role: SelfAssignableRole
): Promise<User> {
  let user: User
  let isRecoveringAccount = false

  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    user = credential.user
  } catch (error) {
    if (
      !(error instanceof FirebaseError) ||
      error.code !== "auth/email-already-in-use"
    ) {
      throw error
    }

    const credential = await signInWithEmailAndPassword(auth, email, password)
    user = credential.user
    isRecoveringAccount = true

    let existingProfile: UserProfile | null
    try {
      existingProfile = await getUserProfile(user.uid)
    } catch (profileError) {
      await signOutAfterFailure(profileError)
      throw profileError
    }

    if (existingProfile) {
      await signOutAfterFailure(error)
      throw error
    }
  }

  try {
    await saveUserProfile(user, displayName, role)
  } catch (profileError) {
    if (isRecoveringAccount) {
      await signOutAfterFailure(profileError)
      throw profileError
    }

    try {
      await deleteUser(user)
    } catch (cleanupError) {
      throw new AggregateError(
        [profileError, cleanupError],
        "Your account was created, but profile setup failed. Retry signup with the same details after the connection is restored.",
        { cause: cleanupError }
      )
    }

    throw profileError
  }

  return user
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

  await signOutAfterFailure(
    new Error(
      "This account does not have a valid profile. Please contact your administrator."
    )
  )
  throw new Error(
    "This account does not have a valid profile. Please contact your administrator."
  )
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
        return "Your profile could not be accessed. Verify that Firestore is enabled and its security rules are deployed."
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

import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  type ActionCodeSettings,
  type User,
} from "firebase/auth"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"

import type { UserProfile } from "@/lib/auth"
import { auth, db } from "@/lib/firebase"

const EMAIL_FOR_LINK_KEY = "unijos_parent_email_for_link"

export function storeEmailForLink(email: string) {
  window.localStorage.setItem(EMAIL_FOR_LINK_KEY, email.trim().toLowerCase())
}

export function readEmailForLink(): string {
  return (window.localStorage.getItem(EMAIL_FOR_LINK_KEY) ?? "").trim().toLowerCase()
}

export function clearEmailForLink() {
  window.localStorage.removeItem(EMAIL_FOR_LINK_KEY)
}

export function parentActionCodeSettings(continueUrl: string): ActionCodeSettings {
  return {
    url: continueUrl,
    handleCodeInApp: true,
  }
}

/** Send a passwordless sign-in link to the guardian email. */
export async function sendParentMagicLink(
  email: string,
  continueUrl: string
): Promise<void> {
  const normalized = email.trim().toLowerCase()
  if (!normalized.includes("@")) {
    throw new Error("Enter a valid guardian email address.")
  }
  storeEmailForLink(normalized)
  await sendSignInLinkToEmail(
    auth,
    normalized,
    parentActionCodeSettings(continueUrl)
  )
}

export function isParentEmailLink(url = window.location.href): boolean {
  return isSignInWithEmailLink(auth, url)
}

/**
 * Complete passwordless sign-in from the email link URL.
 * Creates a Parent profile in Firestore on first use.
 */
export async function completeParentEmailLink(input: {
  email?: string
  url?: string
  displayName?: string
}): Promise<{ user: User; profile: UserProfile }> {
  const url = input.url ?? window.location.href
  if (!isSignInWithEmailLink(auth, url)) {
    throw new Error("This is not a valid sign-in link.")
  }

  const email =
    (input.email ?? readEmailForLink()).trim().toLowerCase() ||
    window.prompt("Confirm your email to open the guardian portal")?.trim().toLowerCase() ||
    ""

  if (!email.includes("@")) {
    throw new Error("Email is required to complete the magic link sign-in.")
  }

  const credential = await signInWithEmailLink(auth, email, url)
  const user = credential.user
  clearEmailForLink()

  const profile = await ensureParentProfile(
    user,
    input.displayName || user.displayName || email.split("@")[0] || "Guardian"
  )

  return { user, profile }
}

async function ensureParentProfile(
  user: User,
  displayName: string
): Promise<UserProfile> {
  const ref = doc(db, "users", user.uid)
  const snap = await getDoc(ref)

  if (snap.exists()) {
    const data = snap.data()
    const role = data.role
    if (role !== "Parent") {
      // Existing non-parent account with this email cannot become guardian here
      throw new Error(
        "This email is already registered as a non-parent account. Use a different guardian email."
      )
    }
    return {
      uid: user.uid,
      email: typeof data.email === "string" ? data.email : user.email ?? "",
      displayName:
        typeof data.displayName === "string"
          ? data.displayName
          : displayName,
      role: "Parent",
    }
  }

  const email = user.email ?? ""
  await setDoc(ref, {
    uid: user.uid,
    email,
    displayName: displayName.trim() || "Guardian",
    role: "Parent",
    createdAt: serverTimestamp(),
  })

  return {
    uid: user.uid,
    email,
    displayName: displayName.trim() || "Guardian",
    role: "Parent",
  }
}

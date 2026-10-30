import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"

import { db } from "@/lib/firebase"

export type InviteStatus = "pending" | "accepted" | "revoked"

export interface ParentInvite {
  id: string
  studentUid: string
  studentName: string
  guardianEmail: string
  status: InviteStatus
  createdAt?: unknown
  expiresAt: string
  acceptedByUid?: string
}

export interface ParentLink {
  id: string
  parentUid: string
  parentEmail: string
  parentName: string
  studentUid: string
  studentName: string
  createdAt?: unknown
  sourceInviteId: string
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function linkId(parentUid: string, studentUid: string): string {
  return `${parentUid}_${studentUid}`
}

function randomToken(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "")
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`
}

export function inviteJoinUrl(token: string, origin = window.location.origin): string {
  return `${origin}/parent/join?token=${encodeURIComponent(token)}`
}

export async function createParentInvite(input: {
  studentUid: string
  studentName: string
  guardianEmail: string
  validDays?: number
}): Promise<{ invite: ParentInvite; joinUrl: string }> {
  const guardianEmail = normalizeEmail(input.guardianEmail)
  if (!guardianEmail || !guardianEmail.includes("@")) {
    throw new Error("Enter a valid guardian email address.")
  }

  const days = input.validDays ?? 14
  const expires = new Date()
  expires.setDate(expires.getDate() + days)

  const id = randomToken()
  const payload = {
    studentUid: input.studentUid,
    studentName: input.studentName.trim() || "Student",
    guardianEmail,
    status: "pending" as const,
    createdAt: serverTimestamp(),
    expiresAt: expires.toISOString(),
  }

  await setDoc(doc(db, "parentInvites", id), payload)

  const invite: ParentInvite = {
    id,
    ...payload,
  }

  return { invite, joinUrl: inviteJoinUrl(id) }
}

export async function getParentInvite(token: string): Promise<ParentInvite | null> {
  const snap = await getDoc(doc(db, "parentInvites", token))
  if (!snap.exists()) return null
  const data = snap.data()
  return {
    id: snap.id,
    studentUid: asString(data.studentUid),
    studentName: asString(data.studentName, "Student"),
    guardianEmail: asString(data.guardianEmail),
    status: (asString(data.status, "pending") as InviteStatus) || "pending",
    expiresAt: asString(data.expiresAt),
    acceptedByUid: asString(data.acceptedByUid) || undefined,
  }
}

export function inviteIsUsable(invite: ParentInvite): { ok: true } | { ok: false; reason: string } {
  if (invite.status === "revoked") {
    return { ok: false, reason: "This invite was revoked by the student." }
  }
  if (invite.expiresAt) {
    const exp = Date.parse(invite.expiresAt)
    if (Number.isFinite(exp) && exp < Date.now()) {
      return { ok: false, reason: "This invite link has expired. Ask the student for a new one." }
    }
  }
  return { ok: true }
}

export async function listStudentInvites(studentUid: string): Promise<ParentInvite[]> {
  const snapshot = await getDocs(
    query(collection(db, "parentInvites"), where("studentUid", "==", studentUid))
  )
  const items: ParentInvite[] = []
  snapshot.forEach((item) => {
    const data = item.data()
    items.push({
      id: item.id,
      studentUid: asString(data.studentUid),
      studentName: asString(data.studentName),
      guardianEmail: asString(data.guardianEmail),
      status: (asString(data.status, "pending") as InviteStatus) || "pending",
      expiresAt: asString(data.expiresAt),
      acceptedByUid: asString(data.acceptedByUid) || undefined,
    })
  })
  return items.sort((a, b) => a.guardianEmail.localeCompare(b.guardianEmail))
}

export async function revokeParentInvite(token: string, studentUid: string): Promise<void> {
  const invite = await getParentInvite(token)
  if (!invite || invite.studentUid !== studentUid) {
    throw new Error("Invite not found.")
  }
  await updateDoc(doc(db, "parentInvites", token), {
    status: "revoked",
    updatedAt: serverTimestamp(),
  })
}

export async function acceptParentInvite(input: {
  token: string
  parentUid: string
  parentEmail: string
  parentName: string
}): Promise<ParentLink> {
  const invite = await getParentInvite(input.token)
  if (!invite) throw new Error("Invite link is invalid or has been removed.")

  const usable = inviteIsUsable(invite)
  if (!usable.ok) throw new Error(usable.reason)

  const parentEmail = normalizeEmail(input.parentEmail)
  if (parentEmail !== invite.guardianEmail) {
    throw new Error(
      `This invite was sent to ${invite.guardianEmail}. Sign in with that email to accept.`
    )
  }

  const id = linkId(input.parentUid, invite.studentUid)
  const existing = await getDoc(doc(db, "parentLinks", id))
  if (existing.exists()) {
    if (invite.status === "pending") {
      await updateDoc(doc(db, "parentInvites", invite.id), {
        status: "accepted",
        acceptedByUid: input.parentUid,
        updatedAt: serverTimestamp(),
      })
    }
    const data = existing.data()
    return {
      id,
      parentUid: asString(data.parentUid),
      parentEmail: asString(data.parentEmail),
      parentName: asString(data.parentName),
      studentUid: asString(data.studentUid),
      studentName: asString(data.studentName),
      sourceInviteId: asString(data.sourceInviteId),
    }
  }

  const link: Omit<ParentLink, "id"> = {
    parentUid: input.parentUid,
    parentEmail,
    parentName: input.parentName.trim() || "Parent",
    studentUid: invite.studentUid,
    studentName: invite.studentName,
    sourceInviteId: invite.id,
  }

  await setDoc(doc(db, "parentLinks", id), {
    ...link,
    createdAt: serverTimestamp(),
  })

  await updateDoc(doc(db, "parentInvites", invite.id), {
    status: "accepted",
    acceptedByUid: input.parentUid,
    updatedAt: serverTimestamp(),
  })

  return { id, ...link }
}

export async function listChildrenForParent(parentUid: string): Promise<ParentLink[]> {
  const snapshot = await getDocs(
    query(collection(db, "parentLinks"), where("parentUid", "==", parentUid))
  )
  const items: ParentLink[] = []
  snapshot.forEach((item) => {
    const data = item.data()
    items.push({
      id: item.id,
      parentUid: asString(data.parentUid),
      parentEmail: asString(data.parentEmail),
      parentName: asString(data.parentName),
      studentUid: asString(data.studentUid),
      studentName: asString(data.studentName),
      sourceInviteId: asString(data.sourceInviteId),
    })
  })
  return items.sort((a, b) => a.studentName.localeCompare(b.studentName))
}

export async function listGuardiansForStudent(studentUid: string): Promise<ParentLink[]> {
  const snapshot = await getDocs(
    query(collection(db, "parentLinks"), where("studentUid", "==", studentUid))
  )
  const items: ParentLink[] = []
  snapshot.forEach((item) => {
    const data = item.data()
    items.push({
      id: item.id,
      parentUid: asString(data.parentUid),
      parentEmail: asString(data.parentEmail),
      parentName: asString(data.parentName),
      studentUid: asString(data.studentUid),
      studentName: asString(data.studentName),
      sourceInviteId: asString(data.sourceInviteId),
    })
  })
  return items.sort((a, b) => a.parentName.localeCompare(b.parentName))
}

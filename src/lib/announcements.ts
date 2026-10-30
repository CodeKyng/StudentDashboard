import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore"

import { db } from "@/lib/firebase"

export interface InstitutionAnnouncement {
  id: string
  title: string
  description: string
  source: string
  badge: string
  dateCreated: string
  pinned?: boolean
  audience?: "all" | "students" | "staff"
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

function asBool(value: unknown): boolean {
  return value === true
}

export async function listAnnouncements(): Promise<InstitutionAnnouncement[]> {
  const snap = await getDocs(
    query(collection(db, "announcements"), orderBy("dateCreated", "desc"))
  )
  const items: InstitutionAnnouncement[] = []
  snap.forEach((item) => {
    const data = item.data()
    items.push({
      id: item.id,
      title: asString(data.title),
      description: asString(data.description),
      source: asString(data.source, "University of Jos"),
      badge: asString(data.badge, "General"),
      dateCreated: asString(data.dateCreated),
      pinned: asBool(data.pinned),
      audience:
        data.audience === "students" || data.audience === "staff"
          ? data.audience
          : "all",
    })
  })
  return items.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return b.dateCreated.localeCompare(a.dateCreated)
  })
}

export async function saveAnnouncement(
  input: Omit<InstitutionAnnouncement, "id"> & { id?: string }
): Promise<string> {
  const title = input.title.trim()
  if (!title) throw new Error("Title is required.")
  const id = input.id || crypto.randomUUID()
  const dateCreated =
    input.dateCreated?.trim() || new Date().toISOString().slice(0, 10)
  await setDoc(
    doc(db, "announcements", id),
    {
      title,
      description: input.description.trim(),
      source: input.source.trim() || "University of Jos",
      badge: input.badge.trim() || "General",
      dateCreated,
      pinned: Boolean(input.pinned),
      audience: input.audience || "all",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
  return id
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await deleteDoc(doc(db, "announcements", id))
}

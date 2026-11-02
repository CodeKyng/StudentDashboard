import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore"

import { getDashboardData } from "@/lib/dashboard-data"
import { db } from "@/lib/firebase"
import { isSchoolFeesPaid } from "@/lib/student-data"

export type TranscriptType = "Official" | "Student copy" | "Electronic"
export type TranscriptDelivery = "Pickup" | "Email" | "Courier"
export type TranscriptStatus =
  | "Pending"
  | "Processing"
  | "Ready"
  | "Collected"
  | "Rejected"

export interface TranscriptRequestRecord {
  id: string
  studentUid: string
  studentName: string
  studentEmail: string
  matricNumber?: string
  faculty?: string
  department?: string
  level?: string
  session?: string
  type: TranscriptType
  delivery: TranscriptDelivery
  purpose: string
  status: TranscriptStatus
  notes?: string
  adminNote?: string
  createdAt: string
  updatedAt?: string
}

export interface TranscriptClearanceItem {
  id: string
  label: string
  ok: boolean
  detail: string
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

function mapDoc(
  id: string,
  data: Record<string, unknown>
): TranscriptRequestRecord {
  const status = asString(data.status, "Pending") as TranscriptStatus
  return {
    id,
    studentUid: asString(data.studentUid),
    studentName: asString(data.studentName, "Student"),
    studentEmail: asString(data.studentEmail),
    matricNumber: asString(data.matricNumber) || undefined,
    faculty: asString(data.faculty) || undefined,
    department: asString(data.department) || undefined,
    level: asString(data.level) || undefined,
    session: asString(data.session) || undefined,
    type: (asString(data.type, "Official") as TranscriptType) || "Official",
    delivery:
      (asString(data.delivery, "Pickup") as TranscriptDelivery) || "Pickup",
    purpose: asString(data.purpose),
    status: ["Pending", "Processing", "Ready", "Collected", "Rejected"].includes(
      status
    )
      ? status
      : "Pending",
    notes: asString(data.notes) || undefined,
    adminNote: asString(data.adminNote) || undefined,
    createdAt: asString(data.createdAt),
    updatedAt: asString(data.updatedAt) || undefined,
  }
}

/** Eligibility checklist before a student can request a transcript. */
export async function getTranscriptClearance(input: {
  uid: string
  matricNumber?: string
}): Promise<{ items: TranscriptClearanceItem[]; ready: boolean }> {
  const data = await getDashboardData(input.uid)
  const feesPaid = isSchoolFeesPaid(data)
  const hasMatric = Boolean(input.matricNumber?.trim())
  const hasResults = (data.results?.length ?? 0) > 0
  const resultsPublished = data.resultsPublished === true

  const items: TranscriptClearanceItem[] = [
    {
      id: "matric",
      label: "Matriculation number",
      ok: hasMatric,
      detail: hasMatric
        ? input.matricNumber!.trim()
        : "Admin must assign your matric number",
    },
    {
      id: "fees",
      label: "School fees",
      ok: feesPaid,
      detail: feesPaid ? "Paid / cleared" : "Pay school fees before requesting",
    },
    {
      id: "results",
      label: "Academic results on file",
      ok: hasResults,
      detail: hasResults
        ? `${data.results.length} course result(s)`
        : "No results yet — staff must enter CA/Exam",
    },
    {
      id: "published",
      label: "Results published",
      ok: resultsPublished || hasResults,
      detail: resultsPublished
        ? "Official results published"
        : hasResults
          ? "Scores on file (publication optional)"
          : "Waiting for results",
    },
  ]

  // Required: matric + fees + at least one result
  const ready = hasMatric && feesPaid && hasResults
  return { items, ready }
}

export async function listTranscriptRequests(options?: {
  studentUid?: string
}): Promise<TranscriptRequestRecord[]> {
  const base = collection(db, "transcriptRequests")
  const q = options?.studentUid
    ? query(
        base,
        where("studentUid", "==", options.studentUid),
        orderBy("createdAt", "desc")
      )
    : query(base, orderBy("createdAt", "desc"))

  try {
    const snap = await getDocs(q)
    const items: TranscriptRequestRecord[] = []
    snap.forEach((item) => items.push(mapDoc(item.id, item.data())))
    return items
  } catch {
    // Fallback without composite index: client-side filter/sort
    const snap = await getDocs(collection(db, "transcriptRequests"))
    let items: TranscriptRequestRecord[] = []
    snap.forEach((item) => items.push(mapDoc(item.id, item.data())))
    if (options?.studentUid) {
      items = items.filter((r) => r.studentUid === options.studentUid)
    }
    return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
}

export async function submitTranscriptRequest(input: {
  studentUid: string
  studentName: string
  studentEmail: string
  matricNumber?: string
  faculty?: string
  department?: string
  level?: string
  session?: string
  type: TranscriptType
  delivery: TranscriptDelivery
  purpose: string
  notes?: string
}): Promise<TranscriptRequestRecord> {
  const clearance = await getTranscriptClearance({
    uid: input.studentUid,
    matricNumber: input.matricNumber,
  })
  if (!clearance.ready) {
    throw new Error(
      "Clearance incomplete. Complete matric, fees, and results before requesting."
    )
  }

  const purpose = input.purpose.trim()
  if (!purpose) throw new Error("State the purpose of the transcript request.")

  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()
  const record: TranscriptRequestRecord = {
    id,
    studentUid: input.studentUid,
    studentName: input.studentName,
    studentEmail: input.studentEmail,
    matricNumber: input.matricNumber,
    faculty: input.faculty,
    department: input.department,
    level: input.level,
    session: input.session,
    type: input.type,
    delivery: input.delivery,
    purpose,
    status: "Pending",
    notes: input.notes?.trim() || undefined,
    createdAt,
  }

  await setDoc(doc(db, "transcriptRequests", id), {
    ...record,
    createdAt,
    updatedAt: serverTimestamp(),
  })

  // Mirror latest request onto student dashboard for quick display
  const data = await getDashboardData(input.studentUid)
  await setDoc(
    doc(db, "dashboardData", input.studentUid),
    {
      ...data,
      previousTranscriptRequest: {
        date: createdAt.slice(0, 10),
        type: input.type,
        status: "Pending",
        info: [
          { label: "Delivery", value: input.delivery },
          { label: "Purpose", value: purpose },
          { label: "Matric", value: input.matricNumber || "—" },
        ],
      },
      transcriptRequestMeta: [
        { label: "Type", value: input.type },
        { label: "Delivery", value: input.delivery },
        { label: "Status", value: "Pending" },
        { label: "Submitted", value: createdAt.slice(0, 10) },
      ],
    },
    { merge: true }
  )

  return record
}

export async function updateTranscriptRequestStatus(input: {
  id: string
  status: TranscriptStatus
  adminNote?: string
  existing: TranscriptRequestRecord
}): Promise<void> {
  const updatedAt = new Date().toISOString()
  await setDoc(
    doc(db, "transcriptRequests", input.id),
    {
      status: input.status,
      adminNote: input.adminNote?.trim() || input.existing.adminNote || "",
      updatedAt,
      serverUpdatedAt: serverTimestamp(),
    },
    { merge: true }
  )

  // Keep student dashboard mirror in sync
  const data = await getDashboardData(input.existing.studentUid)
  await setDoc(
    doc(db, "dashboardData", input.existing.studentUid),
    {
      ...data,
      previousTranscriptRequest: {
        date: input.existing.createdAt.slice(0, 10),
        type: input.existing.type,
        status: input.status,
        info: [
          { label: "Delivery", value: input.existing.delivery },
          { label: "Purpose", value: input.existing.purpose },
          { label: "Matric", value: input.existing.matricNumber || "—" },
          ...(input.adminNote
            ? [{ label: "Admin note", value: input.adminNote }]
            : []),
        ],
      },
      transcriptRequestMeta: [
        { label: "Type", value: input.existing.type },
        { label: "Delivery", value: input.existing.delivery },
        { label: "Status", value: input.status },
        { label: "Submitted", value: input.existing.createdAt.slice(0, 10) },
      ],
    },
    { merge: true }
  )
}

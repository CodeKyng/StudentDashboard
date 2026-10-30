import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"

import type { UserProfile } from "@/lib/auth"
import {
  getDashboardData,
  type DashboardData,
  type DashboardCourse,
  type PaymentRecord,
} from "@/lib/dashboard-data"
import { db } from "@/lib/firebase"
import { computeCgpa, withAutoGrades } from "@/lib/grades"

/** Placement / identity fields stored on the users document by admin. */
export interface StudentIdentity {
  matricNumber?: string
  facultyId?: string
  facultyName?: string
  departmentId?: string
  departmentName?: string
  level?: string
  session?: string
}

export interface StudentView {
  profile: UserProfile
  identity: StudentIdentity
  data: DashboardData
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

export async function getStudentIdentity(uid: string): Promise<StudentIdentity> {
  const snap = await getDoc(doc(db, "users", uid))
  if (!snap.exists()) return {}
  const data = snap.data()
  return {
    matricNumber: asString(data.matricNumber),
    facultyId: asString(data.facultyId),
    facultyName: asString(data.facultyName),
    departmentId: asString(data.departmentId),
    departmentName: asString(data.departmentName),
    level: asString(data.level),
    session: asString(data.session),
  }
}

export async function loadStudentView(
  profile: UserProfile
): Promise<StudentView> {
  const [identity, raw] = await Promise.all([
    getStudentIdentity(profile.uid),
    getDashboardData(profile.uid),
  ])

  const results = withAutoGrades(raw.results)
  const data: DashboardData = {
    ...raw,
    results,
    cgpa: computeCgpa(results) ?? raw.cgpa,
    faculty: identity.facultyName || raw.faculty,
    department: identity.departmentName || raw.department,
    level: identity.level || raw.level,
    session: identity.session || raw.session,
    currencyCode: raw.currencyCode || "NGN",
  }

  return { profile, identity, data }
}

export async function saveRegisteredCourses(
  uid: string,
  courses: DashboardCourse[]
): Promise<void> {
  const current = await getDashboardData(uid)
  await setDoc(
    doc(db, "dashboardData", uid),
    {
      ...current,
      courses,
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    },
    { merge: true }
  )
}

export async function startFeePaymentPlaceholder(
  uid: string,
  input: {
    session: string
    level: string
    amount: number
  }
): Promise<PaymentRecord> {
  const current = await getDashboardData(uid)
  const rrr = `MOCK${Date.now().toString().slice(-10)}`
  const record: PaymentRecord = {
    session: input.session || current.session || "—",
    level: input.level || current.level || "—",
    date: new Date().toISOString().slice(0, 10),
    rrr,
    status: "Pending",
  }
  const paymentRecords = [record, ...(current.paymentRecords ?? [])]
  await setDoc(
    doc(db, "dashboardData", uid),
    {
      ...current,
      paymentRecords,
      feeStatus: "Payment pending",
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    },
    { merge: true }
  )
  return record
}

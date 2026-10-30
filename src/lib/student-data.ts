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
import type { InstitutionCourse } from "@/lib/institution-data"
import {
  enrollStudentInCourse,
  listCourseEnrollments,
  removeCourseEnrollment,
} from "@/lib/staff-assignments"

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

function courseKey(code: string) {
  return code.trim().toUpperCase()
}

function statusIsPaid(status: string | undefined): boolean {
  if (!status) return false
  const s = status.trim().toLowerCase()
  return s === "paid" || s === "cleared" || s === "complete" || s === "completed"
}

/** True when feeStatus or any payment record indicates school fees are paid. */
export function isSchoolFeesPaid(data: DashboardData): boolean {
  if (statusIsPaid(data.feeStatus)) return true
  return (data.paymentRecords ?? []).some((r) => statusIsPaid(r.status))
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

/**
 * Student self-registration: only allowed after school fees are paid.
 * Saves courses and publishes courseEnrollments for staff rosters.
 */
export async function saveRegisteredCourses(
  uid: string,
  courses: DashboardCourse[],
  meta?: {
    displayName?: string
    email?: string
    matricNumber?: string
    institutionCourses?: InstitutionCourse[]
  }
): Promise<void> {
  const current = await getDashboardData(uid)

  if (!isSchoolFeesPaid(current)) {
    throw new Error(
      "School fees must be paid before you can register courses. Open School fees to complete payment."
    )
  }

  const catalog = meta?.institutionCourses ?? []

  let results = [...current.results]
  let attendanceCourses = [...current.attendanceCourses]

  for (const course of courses) {
    const code = courseKey(course.code)
    const inst = catalog.find((c) => courseKey(c.code) === code)
    if (!results.some((r) => courseKey(r.code) === code)) {
      results.push({
        code: course.code,
        course: course.title,
        units: inst?.units || 3,
        ca: 0,
        exam: 0,
        grade: "F",
      })
    }
    if (!attendanceCourses.some((a) => courseKey(a.coursecode) === code)) {
      attendanceCourses.push({
        coursecode: course.code,
        progress: 0,
        percentage: 0,
      })
    }
  }

  const registeredCodes = new Set(courses.map((c) => courseKey(c.code)))
  results = results.filter((r) => registeredCodes.has(courseKey(r.code)))
  attendanceCourses = attendanceCourses.filter((a) =>
    registeredCodes.has(courseKey(a.coursecode))
  )

  const graded = withAutoGrades(results)

  await setDoc(
    doc(db, "dashboardData", uid),
    {
      ...current,
      courses,
      results: graded,
      attendanceCourses,
      cgpa: computeCgpa(graded),
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    },
    { merge: true }
  )

  const existing = await listCourseEnrollments()
  const mine = existing.filter((e) => e.studentUid === uid)
  const mineCodes = new Set(mine.map((e) => courseKey(e.courseCode)))
  const nextCodes = new Set(courses.map((c) => courseKey(c.code)))

  for (const e of mine) {
    if (!nextCodes.has(courseKey(e.courseCode))) {
      await removeCourseEnrollment(e.id)
    }
  }

  for (const course of courses) {
    const code = courseKey(course.code)
    if (mineCodes.has(code) && nextCodes.has(code)) continue
    const inst =
      catalog.find((c) => courseKey(c.code) === code) ??
      ({
        id: code,
        code: course.code,
        title: course.title,
        description: course.description || "",
        units: 3,
        level: "",
        semester: "",
        departmentId: "",
        departmentName: "",
        facultyId: "",
        facultyName: "",
        prerequisites: [],
      } satisfies InstitutionCourse)

    await enrollStudentInCourse({
      studentUid: uid,
      studentName: meta?.displayName || "Student",
      studentEmail: meta?.email || "",
      matricNumber: meta?.matricNumber,
      course: inst,
    })
  }
}

/**
 * Placeholder payment: marks fees Paid so registration can unlock in testing.
 * Replace with real gateway callback later.
 */
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
    status: "Paid",
  }
  const paymentRecords = [record, ...(current.paymentRecords ?? [])]
  await setDoc(
    doc(db, "dashboardData", uid),
    {
      ...current,
      paymentRecords,
      feeStatus: "Paid",
      feesDue: 0,
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    },
    { merge: true }
  )
  return record
}

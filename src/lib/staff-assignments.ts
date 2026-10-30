import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore"

import { db } from "@/lib/firebase"
import type { InstitutionCourse } from "@/lib/institution-data"

export interface StaffCourseAssignment {
  id: string
  staffUid: string
  staffName: string
  staffEmail: string
  courseId: string
  courseCode: string
  courseTitle: string
  units: number
  level: string
  semester: string
  departmentName: string
}

export interface CourseEnrollment {
  id: string
  studentUid: string
  studentName: string
  studentEmail: string
  matricNumber?: string
  courseId: string
  courseCode: string
  courseTitle: string
  units: number
}

function assignmentId(staffUid: string, courseCode: string) {
  return `${staffUid}_${courseCode.trim().toUpperCase().replace(/\s+/g, "-")}`
}

function enrollmentId(studentUid: string, courseCode: string) {
  return `${studentUid}_${courseCode.trim().toUpperCase().replace(/\s+/g, "-")}`
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

export async function listStaffAssignments(
  staffUid?: string
): Promise<StaffCourseAssignment[]> {
  const snap = staffUid
    ? await getDocs(
        query(
          collection(db, "staffAssignments"),
          where("staffUid", "==", staffUid)
        )
      )
    : await getDocs(collection(db, "staffAssignments"))

  const items: StaffCourseAssignment[] = []
  snap.forEach((item) => {
    const data = item.data()
    items.push({
      id: item.id,
      staffUid: asString(data.staffUid),
      staffName: asString(data.staffName),
      staffEmail: asString(data.staffEmail),
      courseId: asString(data.courseId),
      courseCode: asString(data.courseCode),
      courseTitle: asString(data.courseTitle),
      units: asNumber(data.units),
      level: asString(data.level),
      semester: asString(data.semester),
      departmentName: asString(data.departmentName),
    })
  })
  return items.sort((a, b) =>
    a.courseCode.localeCompare(b.courseCode) ||
    a.staffName.localeCompare(b.staffName)
  )
}

export async function assignCourseToStaff(params: {
  staffUid: string
  staffName: string
  staffEmail: string
  course: InstitutionCourse
}): Promise<void> {
  const { staffUid, staffName, staffEmail, course } = params
  const id = assignmentId(staffUid, course.code)
  await setDoc(
    doc(db, "staffAssignments", id),
    {
      staffUid,
      staffName: staffName.trim(),
      staffEmail: staffEmail.trim(),
      courseId: course.id,
      courseCode: course.code.trim().toUpperCase(),
      courseTitle: course.title.trim(),
      units: course.units || 0,
      level: course.level || "",
      semester: course.semester || "",
      departmentName: course.departmentName || "",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export async function removeStaffAssignment(id: string): Promise<void> {
  await deleteDoc(doc(db, "staffAssignments", id))
}

export async function listCourseEnrollments(
  courseCode?: string
): Promise<CourseEnrollment[]> {
  const snap = courseCode
    ? await getDocs(
        query(
          collection(db, "courseEnrollments"),
          where("courseCode", "==", courseCode.trim().toUpperCase())
        )
      )
    : await getDocs(collection(db, "courseEnrollments"))

  const items: CourseEnrollment[] = []
  snap.forEach((item) => {
    const data = item.data()
    items.push({
      id: item.id,
      studentUid: asString(data.studentUid),
      studentName: asString(data.studentName),
      studentEmail: asString(data.studentEmail),
      matricNumber: asString(data.matricNumber) || undefined,
      courseId: asString(data.courseId),
      courseCode: asString(data.courseCode),
      courseTitle: asString(data.courseTitle),
      units: asNumber(data.units),
    })
  })
  return items.sort((a, b) => a.studentName.localeCompare(b.studentName))
}

export async function enrollStudentInCourse(params: {
  studentUid: string
  studentName: string
  studentEmail: string
  matricNumber?: string
  course: InstitutionCourse
}): Promise<void> {
  const { studentUid, studentName, studentEmail, matricNumber, course } =
    params
  const id = enrollmentId(studentUid, course.code)
  await setDoc(
    doc(db, "courseEnrollments", id),
    {
      studentUid,
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim(),
      matricNumber: matricNumber?.trim().toUpperCase() || "",
      courseId: course.id,
      courseCode: course.code.trim().toUpperCase(),
      courseTitle: course.title.trim(),
      units: course.units || 0,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export async function removeCourseEnrollment(id: string): Promise<void> {
  await deleteDoc(doc(db, "courseEnrollments", id))
}

/** Map assignment rows to InstitutionCourse-shaped objects for the staff portal. */
export function assignmentsAsCourses(
  assignments: StaffCourseAssignment[]
): InstitutionCourse[] {
  const seen = new Set<string>()
  const courses: InstitutionCourse[] = []
  for (const a of assignments) {
    const key = a.courseCode.toUpperCase()
    if (seen.has(key)) continue
    seen.add(key)
    courses.push({
      id: a.courseId || key,
      code: a.courseCode,
      title: a.courseTitle,
      description: "",
      units: a.units,
      level: a.level,
      semester: a.semester,
      departmentId: "",
      departmentName: a.departmentName,
      facultyId: "",
      facultyName: "",
      prerequisites: [],
    })
  }
  return courses.sort((x, y) => x.code.localeCompare(y.code))
}

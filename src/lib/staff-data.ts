import { doc, getDoc } from "firebase/firestore"

import { listDirectory, saveStudentDashboard } from "@/lib/admin-data"
import type { UserProfile } from "@/lib/auth"
import {
  getDashboardData,
  type AssignmentEntry,
  type AttendanceCourse,
  type DashboardData,
  type ExamEntry,
  type SemesterResult,
} from "@/lib/dashboard-data"
import { db } from "@/lib/firebase"
import { computeCgpa, withAutoGrades } from "@/lib/grades"
import {
  listInstitutionCourses,
  type InstitutionCourse,
  type StudentDirectoryEntry,
  listStudentsWithMatric,
} from "@/lib/institution-data"
import {
  assignmentsAsCourses,
  listCourseEnrollments,
  listStaffAssignments,
} from "@/lib/staff-assignments"

export interface StaffRosterRow {
  uid: string
  displayName: string
  email: string
  matricNumber?: string
  level?: string
  departmentName?: string
  attendancePercentage: number
  attendanceProgress: number
  units: number
  ca: number
  exam: number
  grade: string
  courseTitle: string
}

function courseKey(code: string) {
  return code.trim().toUpperCase()
}

function matchesCourse(code: string, rowCode: string | undefined): boolean {
  if (!rowCode) return false
  return courseKey(rowCode) === courseKey(code)
}

/**
 * Courses assigned to this staff member by Admin (Staff Manager).
 * Admins with no personal assignments still see the full catalog for support.
 */
export async function listStaffCourses(
  staffUid: string,
  role?: string
): Promise<InstitutionCourse[]> {
  const assignments = await listStaffAssignments(staffUid)
  if (assignments.length > 0) {
    return assignmentsAsCourses(assignments)
  }
  // Admin without explicit assignments can browse the full catalog
  if (role === "Admin") {
    return listInstitutionCourses()
  }
  return []
}

export async function listStaffStudents(): Promise<StudentDirectoryEntry[]> {
  const all = await listStudentsWithMatric()
  return all.filter((s) => s.role === "Student")
}

export async function listStaffDirectory(): Promise<UserProfile[]> {
  const users = await listDirectory()
  return users.filter((u) => u.role === "Student")
}

/**
 * Roster = students enrolled on the course (Admin Staff Manager),
 * merged with any existing scores/attendance on their dashboard.
 */
export async function loadCourseRoster(
  courseCode: string,
  course?: InstitutionCourse
): Promise<StaffRosterRow[]> {
  const code = courseKey(courseCode)
  if (!code) return []

  const enrollments = await listCourseEnrollments(code)
  const students = await listStaffStudents()
  const byUid = new Map(students.map((s) => [s.uid, s]))

  // Prefer official enrollments; fall back to dashboard scan if none yet
  const baseUids =
    enrollments.length > 0
      ? enrollments.map((e) => e.studentUid)
      : students.map((s) => s.uid)

  const rows: StaffRosterRow[] = []

  await Promise.all(
    baseUids.map(async (uid) => {
      const enrollment = enrollments.find((e) => e.studentUid === uid)
      const student = byUid.get(uid)
      const displayName =
        enrollment?.studentName || student?.displayName || "Student"
      const email = enrollment?.studentEmail || student?.email || ""
      const matricNumber =
        enrollment?.matricNumber || student?.matricNumber

      try {
        const data = await getDashboardData(uid)
        const result = data.results.find((r) => matchesCourse(code, r.code))
        const attendance = data.attendanceCourses.find((a) =>
          matchesCourse(code, a.coursecode)
        )

        // If no enrollments collection yet, only include students who already
        // have this course on their record.
        if (enrollments.length === 0 && !result && !attendance) return

        const units =
          result?.units ?? enrollment?.units ?? course?.units ?? 3
        const ca = result?.ca ?? 0
        const exam = result?.exam ?? 0
        const total = ca + exam
        const grade =
          result?.grade ||
          (total >= 70
            ? "A"
            : total >= 60
              ? "B"
              : total >= 50
                ? "C"
                : total >= 45
                  ? "D"
                  : total >= 40
                    ? "E"
                    : "F")

        rows.push({
          uid,
          displayName,
          email,
          matricNumber,
          level: student?.level,
          departmentName: student?.departmentName,
          attendancePercentage: attendance?.percentage ?? 0,
          attendanceProgress: attendance?.progress ?? 0,
          units,
          ca,
          exam,
          grade,
          courseTitle:
            result?.course ||
            enrollment?.courseTitle ||
            course?.title ||
            code,
        })
      } catch {
        if (enrollment) {
          rows.push({
            uid,
            displayName,
            email,
            matricNumber,
            level: student?.level,
            departmentName: student?.departmentName,
            attendancePercentage: 0,
            attendanceProgress: 0,
            units: enrollment.units || course?.units || 3,
            ca: 0,
            exam: 0,
            grade: "F",
            courseTitle: enrollment.courseTitle || course?.title || code,
          })
        }
      }
    })
  )

  return rows.sort((a, b) => a.displayName.localeCompare(b.displayName))
}

export async function ensureStudentOnCourse(
  studentUid: string,
  course: InstitutionCourse
): Promise<void> {
  const data = await getDashboardData(studentUid)
  const code = courseKey(course.code)
  let results = [...data.results]
  let attendanceCourses = [...data.attendanceCourses]
  let courses = [...data.courses]

  if (!results.some((r) => matchesCourse(code, r.code))) {
    results.push({
      code: course.code,
      course: course.title,
      units: course.units || 3,
      ca: 0,
      exam: 0,
      grade: "F",
    })
  }

  if (!attendanceCourses.some((a) => matchesCourse(code, a.coursecode))) {
    attendanceCourses.push({
      coursecode: course.code,
      progress: 0,
      percentage: 0,
    })
  }

  if (!courses.some((c) => matchesCourse(code, c.code))) {
    courses.push({
      code: course.code,
      title: course.title,
      description: course.description || "",
      progress: 0,
    })
  }

  const graded = withAutoGrades(results)
  await saveStudentDashboard(studentUid, {
    ...data,
    results: graded,
    attendanceCourses,
    courses,
    cgpa: computeCgpa(graded),
  })
}

export async function saveAttendanceForCourse(
  courseCode: string,
  updates: Array<{
    uid: string
    percentage: number
    progress?: number
  }>
): Promise<void> {
  const code = courseKey(courseCode)
  await Promise.all(
    updates.map(async ({ uid, percentage, progress }) => {
      const data = await getDashboardData(uid)
      let attendanceCourses = [...data.attendanceCourses]
      const idx = attendanceCourses.findIndex((a) =>
        matchesCourse(code, a.coursecode)
      )
      const row: AttendanceCourse = {
        coursecode: courseCode,
        progress: progress ?? 0,
        percentage: Number(percentage) || 0,
      }
      if (idx >= 0) attendanceCourses[idx] = row
      else attendanceCourses.push(row)

      const overall =
        attendanceCourses.length > 0
          ? Math.round(
              attendanceCourses.reduce((s, a) => s + (a.percentage || 0), 0) /
                attendanceCourses.length
            )
          : undefined

      await saveStudentDashboard(uid, {
        ...data,
        attendanceCourses,
        attendancePercentage: overall,
      })
    })
  )
}

export async function saveScoresForCourse(
  courseCode: string,
  courseTitle: string,
  updates: Array<{
    uid: string
    units: number
    ca: number
    exam: number
  }>
): Promise<void> {
  const code = courseKey(courseCode)
  await Promise.all(
    updates.map(async ({ uid, units, ca, exam }) => {
      const data = await getDashboardData(uid)
      let results = [...data.results]
      const idx = results.findIndex((r) => matchesCourse(code, r.code))
      const row: SemesterResult = {
        code: courseCode,
        course: courseTitle,
        units: Number(units) || 0,
        ca: Number(ca) || 0,
        exam: Number(exam) || 0,
        grade: "F",
      }
      if (idx >= 0) results[idx] = { ...results[idx], ...row }
      else results.push(row)

      const graded = withAutoGrades(results)
      await saveStudentDashboard(uid, {
        ...data,
        results: graded,
        cgpa: computeCgpa(graded),
      })
    })
  )
}

export async function saveAssignmentsForStudents(
  courseCode: string,
  assignment: Omit<AssignmentEntry, "course"> & { course?: string },
  studentUids: string[],
  mode: "upsert" | "append" = "append"
): Promise<void> {
  const title = assignment.title.trim()
  await Promise.all(
    studentUids.map(async (uid) => {
      const data = await getDashboardData(uid)
      let assignments = [...data.assignments]
      const entry: AssignmentEntry = {
        course: courseCode,
        title,
        dueDate: assignment.dueDate,
        status: assignment.status,
        score: assignment.score,
      }
      if (mode === "upsert") {
        const idx = assignments.findIndex(
          (a) =>
            matchesCourse(courseCode, a.course) &&
            a.title.trim().toLowerCase() === title.toLowerCase()
        )
        if (idx >= 0) assignments[idx] = entry
        else assignments.push(entry)
      } else {
        assignments.push(entry)
      }
      await saveStudentDashboard(uid, { ...data, assignments })
    })
  )
}

export async function saveExamForStudents(
  exam: ExamEntry,
  studentUids: string[],
  mode: "upsert" | "append" = "upsert"
): Promise<void> {
  const course = exam.course
  await Promise.all(
    studentUids.map(async (uid) => {
      const data = await getDashboardData(uid)
      let exams = [...data.exams]
      const entry: ExamEntry = { ...exam }
      if (mode === "upsert") {
        const idx = exams.findIndex((e) => matchesCourse(course, e.course))
        if (idx >= 0) exams[idx] = entry
        else exams.push(entry)
      } else {
        exams.push(entry)
      }
      await saveStudentDashboard(uid, { ...data, exams })
    })
  )
}

export async function hasDashboard(uid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, "dashboardData", uid))
  return snap.exists()
}

export type { InstitutionCourse, StudentDirectoryEntry, DashboardData }

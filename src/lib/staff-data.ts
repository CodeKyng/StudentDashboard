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

export interface StaffRosterRow {
  uid: string
  displayName: string
  email: string
  matricNumber?: string
  level?: string
  departmentName?: string
  /** Attendance % for this course */
  attendancePercentage: number
  attendanceProgress: number
  /** Scores for this course */
  units: number
  ca: number
  exam: number
  grade: string
  courseTitle: string
}

function courseKey(code: string) {
  return code.trim().toUpperCase()
}

function matchesCourse(
  code: string,
  rowCode: string | undefined
): boolean {
  if (!rowCode) return false
  return courseKey(rowCode) === courseKey(code)
}

export async function listStaffCourses(): Promise<InstitutionCourse[]> {
  return listInstitutionCourses()
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
 * Build a roster for a course by scanning student dashboardData for matching
 * results / attendance rows. Students without the course are omitted unless
 * later added via ensureStudentOnCourse.
 */
export async function loadCourseRoster(
  courseCode: string,
  course?: InstitutionCourse
): Promise<StaffRosterRow[]> {
  const code = courseKey(courseCode)
  if (!code) return []

  const students = await listStaffStudents()
  const rows: StaffRosterRow[] = []

  await Promise.all(
    students.map(async (student) => {
      try {
        const data = await getDashboardData(student.uid)
        const result = data.results.find((r) => matchesCourse(code, r.code))
        const attendance = data.attendanceCourses.find((a) =>
          matchesCourse(code, a.coursecode)
        )
        if (!result && !attendance) return

        const units = result?.units ?? course?.units ?? 3
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
          uid: student.uid,
          displayName: student.displayName,
          email: student.email,
          matricNumber: student.matricNumber,
          level: student.level,
          departmentName: student.departmentName,
          attendancePercentage: attendance?.percentage ?? 0,
          attendanceProgress: attendance?.progress ?? 0,
          units,
          ca,
          exam,
          grade,
          courseTitle:
            result?.course || course?.title || code,
        })
      } catch {
        // Skip students whose dashboard cannot be read
      }
    })
  )

  return rows.sort((a, b) => a.displayName.localeCompare(b.displayName))
}

/** Ensure a student has results + attendance rows for the course, then return refreshed roster row. */
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

      // Overall attendance = average of course percentages when present
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

/** Quick check that dashboardData doc exists (optional). */
export async function hasDashboard(uid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, "dashboardData", uid))
  return snap.exists()
}

export type { InstitutionCourse, StudentDirectoryEntry, DashboardData }

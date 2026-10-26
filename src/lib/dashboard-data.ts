import { doc, getDoc } from "firebase/firestore"

import { db } from "@/lib/firebase"

export interface DashboardCourse {
  code: string
  title: string
  description: string
  progress: number
}

export interface AttendanceCourse {
  coursecode: string
  progress: number
  percentage: number
}

export interface Course {
  code: string
  department: string
  departmentName: string
  name: string
  description: string
  prerequisites: string[]
  units: number
  semester: string
}

export interface ExamEntry {
  course: string
  date: string
  time: string
  hall: string
  seatNo: string
}

export type AssignmentStatus = "Submitted" | "Overdue" | "Pending"

export interface AssignmentEntry {
  course: string
  title: string
  dueDate: string
  status: AssignmentStatus
  score: string
}

export interface SemesterResult {
  code: string
  course: string
  units: number
  ca: number
  exam: number
  grade: string
}

export interface GpaHistory {
  firstLevelFirstSemester: number
  firstLevelSecondSemester: number
  secondLevelFirstSemester: number
  secondLevelSecondSemester: number
  thirdLevelFirstSemester: number
  thirdLevelSecondSemester: number
  fourthLevelFirstSemester: number
  fourthLevelSecondSemester: number
}

export interface Announcement {
  id: string
  source: string
  dateCreated: string
  title: string
  description: string
  badge: string
}

export interface DashboardEvent {
  title: string
  description: string
}

export interface PaymentRecord {
  session: string
  level: string
  date: string
  rrr: string
  status: string
}

export interface FeeItem {
  name: string
  amount: number
}

export interface LabeledValue {
  label: string
  value: string
}

export interface ScholarshipEntry {
  title: string
  description: string
  status: string
}

export interface LibraryResource {
  title: string
  author: string
  category: string
  url: string
}

export interface DashboardData {
  currentSemester?: string
  session?: string
  level?: string
  faculty?: string
  department?: string
  currencyCode?: string
  cgpa?: number
  previousCgpa?: number
  attendancePercentage?: number
  warningPercentage?: number
  feeStatus?: string
  registrationEligible?: boolean
  schoolFeeAmount?: number
  feesDue?: number
  feeItems: FeeItem[]
  paymentRecords: PaymentRecord[]
  scholarships: ScholarshipEntry[]
  libraryResources: LibraryResource[]
  hostelAssignment?: {
    hostel: string
    room: string
    session: string
    status: string
  }
  courses: DashboardCourse[]
  attendanceCourses: AttendanceCourse[]
  courseCatalog: Course[]
  exams: ExamEntry[]
  assignments: AssignmentEntry[]
  results: SemesterResult[]
  gpaHistory?: GpaHistory
  announcements: Announcement[]
  events: DashboardEvent[]
  unreadAnnouncementCount?: number
  transcriptClearance?: {
    title: string
    description: string
    date: string
  }
  transcriptRequestMeta: LabeledValue[]
  previousTranscriptRequest?: {
    date: string
    type: string
    status: string
    info: LabeledValue[]
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function requiredString(record: Record<string, unknown>, key: string): string {
  const value = record[key]
  if (typeof value !== "string") {
    throw new Error(`Firebase dashboard data has an invalid "${key}" field.`)
  }
  return value
}

function requiredNumber(record: Record<string, unknown>, key: string): number {
  const value = record[key]
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Firebase dashboard data has an invalid "${key}" field.`)
  }
  return value
}

function optionalString(
  record: Record<string, unknown>,
  key: string
): string | undefined {
  const value = record[key]
  if (value === undefined) return undefined
  if (typeof value !== "string") {
    throw new Error(`Firebase dashboard data has an invalid "${key}" field.`)
  }
  return value
}

function optionalNumber(
  record: Record<string, unknown>,
  key: string
): number | undefined {
  const value = record[key]
  if (value === undefined) return undefined
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Firebase dashboard data has an invalid "${key}" field.`)
  }
  return value
}

function optionalBoolean(
  record: Record<string, unknown>,
  key: string
): boolean | undefined {
  const value = record[key]
  if (value === undefined) return undefined
  if (typeof value !== "boolean") {
    throw new Error(`Firebase dashboard data has an invalid "${key}" field.`)
  }
  return value
}

function records(
  value: unknown,
  field: string,
  parse: (record: Record<string, unknown>) => unknown
): unknown[] {
  if (value === undefined) return []
  if (!Array.isArray(value)) {
    throw new Error(`Firebase dashboard data has an invalid "${field}" list.`)
  }

  return value.map((item) => {
    if (!isRecord(item)) {
      throw new Error(`Firebase dashboard data has an invalid "${field}" item.`)
    }
    return parse(item)
  })
}

function labeledValues(value: unknown, field: string): LabeledValue[] {
  return records(value, field, (item) => ({
    label: requiredString(item, "label"),
    value: requiredString(item, "value"),
  })) as LabeledValue[]
}

function parseDashboardData(value: unknown): DashboardData {
  if (!isRecord(value)) {
    throw new Error("Firebase dashboard data must be a document.")
  }

  const gpaValue = value.gpaHistory
  let gpaHistory: GpaHistory | undefined
  if (gpaValue !== undefined) {
    if (!isRecord(gpaValue)) {
      throw new Error("Firebase dashboard data has an invalid GPA history.")
    }
    gpaHistory = {
      firstLevelFirstSemester: requiredNumber(
        gpaValue,
        "firstLevelFirstSemester"
      ),
      firstLevelSecondSemester: requiredNumber(
        gpaValue,
        "firstLevelSecondSemester"
      ),
      secondLevelFirstSemester: requiredNumber(
        gpaValue,
        "secondLevelFirstSemester"
      ),
      secondLevelSecondSemester: requiredNumber(
        gpaValue,
        "secondLevelSecondSemester"
      ),
      thirdLevelFirstSemester: requiredNumber(
        gpaValue,
        "thirdLevelFirstSemester"
      ),
      thirdLevelSecondSemester: requiredNumber(
        gpaValue,
        "thirdLevelSecondSemester"
      ),
      fourthLevelFirstSemester: requiredNumber(
        gpaValue,
        "fourthLevelFirstSemester"
      ),
      fourthLevelSecondSemester: requiredNumber(
        gpaValue,
        "fourthLevelSecondSemester"
      ),
    }
  }

  let transcriptClearance: DashboardData["transcriptClearance"]
  if (value.transcriptClearance !== undefined) {
    if (!isRecord(value.transcriptClearance)) {
      throw new Error("Firebase dashboard data has an invalid clearance.")
    }
    transcriptClearance = {
      title: requiredString(value.transcriptClearance, "title"),
      description: requiredString(value.transcriptClearance, "description"),
      date: requiredString(value.transcriptClearance, "date"),
    }
  }

  let previousTranscriptRequest: DashboardData["previousTranscriptRequest"]
  if (value.previousTranscriptRequest !== undefined) {
    if (!isRecord(value.previousTranscriptRequest)) {
      throw new Error(
        "Firebase dashboard data has an invalid transcript request."
      )
    }
    previousTranscriptRequest = {
      date: requiredString(value.previousTranscriptRequest, "date"),
      type: requiredString(value.previousTranscriptRequest, "type"),
      status: requiredString(value.previousTranscriptRequest, "status"),
      info: labeledValues(
        value.previousTranscriptRequest.info,
        "transcript info"
      ),
    }
  }

  const feeItems = records(value.feeItems, "feeItems", (item) => ({
    name: requiredString(item, "name"),
    amount: requiredNumber(item, "amount"),
  })) as FeeItem[]

  const paymentRecords = records(
    value.paymentRecords,
    "paymentRecords",
    (item) => ({
      session: requiredString(item, "session"),
      level: requiredString(item, "level"),
      date: requiredString(item, "date"),
      rrr: requiredString(item, "rrr"),
      status: requiredString(item, "status"),
    })
  ) as PaymentRecord[]

  const scholarships = records(value.scholarships, "scholarships", (item) => ({
    title: requiredString(item, "title"),
    description: requiredString(item, "description"),
    status: requiredString(item, "status"),
  })) as ScholarshipEntry[]

  const libraryResources = records(
    value.libraryResources,
    "libraryResources",
    (item) => ({
      title: requiredString(item, "title"),
      author: requiredString(item, "author"),
      category: requiredString(item, "category"),
      url: requiredString(item, "url"),
    })
  ) as LibraryResource[]

  let hostelAssignment: DashboardData["hostelAssignment"]
  if (value.hostelAssignment !== undefined) {
    if (!isRecord(value.hostelAssignment)) {
      throw new Error(
        "Firebase dashboard data has an invalid hostel assignment."
      )
    }
    hostelAssignment = {
      hostel: requiredString(value.hostelAssignment, "hostel"),
      room: requiredString(value.hostelAssignment, "room"),
      session: requiredString(value.hostelAssignment, "session"),
      status: requiredString(value.hostelAssignment, "status"),
    }
  }

  const courses = records(value.courses, "courses", (item) => ({
    code: requiredString(item, "code"),
    title: requiredString(item, "title"),
    description: requiredString(item, "description"),
    progress: requiredNumber(item, "progress"),
  })) as DashboardCourse[]

  const attendanceCourses = records(
    value.attendanceCourses,
    "attendanceCourses",
    (item) => ({
      coursecode: requiredString(item, "coursecode"),
      progress: requiredNumber(item, "progress"),
      percentage: requiredNumber(item, "percentage"),
    })
  ) as AttendanceCourse[]

  const courseCatalog = records(
    value.courseCatalog,
    "courseCatalog",
    (item) => {
      if (
        !Array.isArray(item.prerequisites) ||
        !item.prerequisites.every((entry) => typeof entry === "string")
      ) {
        throw new Error(
          "Firebase dashboard data has invalid course prerequisites."
        )
      }
      return {
        code: requiredString(item, "code"),
        department: requiredString(item, "department"),
        departmentName: requiredString(item, "departmentName"),
        name: requiredString(item, "name"),
        description: requiredString(item, "description"),
        prerequisites: item.prerequisites,
        units: requiredNumber(item, "units"),
        semester: requiredString(item, "semester"),
      }
    }
  ) as Course[]

  const exams = records(value.exams, "exams", (item) => ({
    course: requiredString(item, "course"),
    date: requiredString(item, "date"),
    time: requiredString(item, "time"),
    hall: requiredString(item, "hall"),
    seatNo: requiredString(item, "seatNo"),
  })) as ExamEntry[]

  const assignments = records(value.assignments, "assignments", (item) => {
    const status = requiredString(item, "status")
    if (
      status !== "Submitted" &&
      status !== "Overdue" &&
      status !== "Pending"
    ) {
      throw new Error(
        "Firebase dashboard data has an invalid assignment status."
      )
    }
    return {
      course: requiredString(item, "course"),
      title: requiredString(item, "title"),
      dueDate: requiredString(item, "dueDate"),
      status,
      score: requiredString(item, "score"),
    }
  }) as AssignmentEntry[]

  const results = records(value.results, "results", (item) => ({
    code: requiredString(item, "code"),
    course: requiredString(item, "course"),
    units: requiredNumber(item, "units"),
    ca: requiredNumber(item, "ca"),
    exam: requiredNumber(item, "exam"),
    grade: requiredString(item, "grade"),
  })) as SemesterResult[]

  const announcements = records(
    value.announcements,
    "announcements",
    (item) => ({
      id: requiredString(item, "id"),
      source: requiredString(item, "source"),
      dateCreated: requiredString(item, "dateCreated"),
      title: requiredString(item, "title"),
      description: requiredString(item, "description"),
      badge: requiredString(item, "badge"),
    })
  ) as Announcement[]

  const events = records(value.events, "events", (item) => ({
    title: requiredString(item, "title"),
    description: requiredString(item, "description"),
  })) as DashboardEvent[]

  const unreadAnnouncementCount = optionalNumber(
    value,
    "unreadAnnouncementCount"
  )
  if (
    unreadAnnouncementCount !== undefined &&
    (!Number.isInteger(unreadAnnouncementCount) || unreadAnnouncementCount < 0)
  ) {
    throw new Error(
      'Firebase dashboard data has an invalid "unreadAnnouncementCount" field.'
    )
  }

  return {
    currentSemester: optionalString(value, "currentSemester"),
    session: optionalString(value, "session"),
    level: optionalString(value, "level"),
    faculty: optionalString(value, "faculty"),
    department: optionalString(value, "department"),
    currencyCode: optionalString(value, "currencyCode"),
    cgpa: optionalNumber(value, "cgpa"),
    previousCgpa: optionalNumber(value, "previousCgpa"),
    attendancePercentage: optionalNumber(value, "attendancePercentage"),
    warningPercentage: optionalNumber(value, "warningPercentage"),
    feeStatus: optionalString(value, "feeStatus"),
    registrationEligible: optionalBoolean(value, "registrationEligible"),
    schoolFeeAmount: optionalNumber(value, "schoolFeeAmount"),
    feesDue: optionalNumber(value, "feesDue"),
    feeItems,
    paymentRecords,
    scholarships,
    libraryResources,
    hostelAssignment,
    courses,
    attendanceCourses,
    courseCatalog,
    exams,
    assignments,
    results,
    gpaHistory,
    announcements,
    events,
    unreadAnnouncementCount,
    transcriptClearance,
    transcriptRequestMeta: labeledValues(
      value.transcriptRequestMeta,
      "transcriptRequestMeta"
    ),
    previousTranscriptRequest,
  }
}

export async function getDashboardData(uid: string): Promise<DashboardData> {
  const snapshot = await getDoc(doc(db, "dashboardData", uid))
  return parseDashboardData(snapshot.exists() ? snapshot.data() : {})
}

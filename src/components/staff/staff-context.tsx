import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useSearchParams } from "react-router-dom"
import { toast } from "sonner"

import { getAuthErrorMessage } from "@/lib/auth"
import {
  ensureStudentOnCourse,
  listStaffCourses,
  listStaffStudents,
  loadCourseRoster,
  type InstitutionCourse,
  type StaffRosterRow,
  type StudentDirectoryEntry,
} from "@/lib/staff-data"

type LoadStatus = "idle" | "loading" | "ready" | "error"

interface StaffContextValue {
  courses: InstitutionCourse[]
  coursesStatus: LoadStatus
  coursesError: string
  students: StudentDirectoryEntry[]
  studentsStatus: LoadStatus
  selectedCourseCode: string
  selectedCourse: InstitutionCourse | null
  selectCourse: (code: string) => void
  roster: StaffRosterRow[]
  rosterStatus: LoadStatus
  rosterError: string
  refreshRoster: () => Promise<void>
  addStudentToCourse: (uid: string) => Promise<void>
  adding: boolean
}

const StaffContext = createContext<StaffContextValue | null>(null)

export function StaffProvider({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [courses, setCourses] = useState<InstitutionCourse[]>([])
  const [coursesStatus, setCoursesStatus] = useState<LoadStatus>("loading")
  const [coursesError, setCoursesError] = useState("")
  const [students, setStudents] = useState<StudentDirectoryEntry[]>([])
  const [studentsStatus, setStudentsStatus] = useState<LoadStatus>("loading")
  const [roster, setRoster] = useState<StaffRosterRow[]>([])
  const [rosterStatus, setRosterStatus] = useState<LoadStatus>("idle")
  const [rosterError, setRosterError] = useState("")
  const [adding, setAdding] = useState(false)

  const selectedCourseCode = searchParams.get("course") ?? ""
  const selectedCourse =
    courses.find(
      (c) => c.code.toUpperCase() === selectedCourseCode.toUpperCase()
    ) ?? null

  useEffect(() => {
    let active = true
    setCoursesStatus("loading")
    listStaffCourses()
      .then((items) => {
        if (!active) return
        setCourses(items)
        setCoursesStatus("ready")
      })
      .catch((error: unknown) => {
        if (!active) return
        setCoursesError(getAuthErrorMessage(error))
        setCoursesStatus("error")
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true
    setStudentsStatus("loading")
    listStaffStudents()
      .then((items) => {
        if (!active) return
        setStudents(items)
        setStudentsStatus("ready")
      })
      .catch(() => {
        if (!active) return
        setStudentsStatus("error")
      })
    return () => {
      active = false
    }
  }, [])

  const refreshRoster = useCallback(async () => {
    if (!selectedCourseCode) {
      setRoster([])
      setRosterStatus("idle")
      setRosterError("")
      return
    }
    setRosterStatus("loading")
    setRosterError("")
    try {
      const course =
        courses.find(
          (c) => c.code.toUpperCase() === selectedCourseCode.toUpperCase()
        ) ?? undefined
      const rows = await loadCourseRoster(selectedCourseCode, course)
      setRoster(rows)
      setRosterStatus("ready")
    } catch (error) {
      setRoster([])
      setRosterError(getAuthErrorMessage(error))
      setRosterStatus("error")
    }
  }, [selectedCourseCode, courses])

  useEffect(() => {
    void refreshRoster()
  }, [refreshRoster])

  const selectCourse = useCallback(
    (code: string) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current)
        if (code) next.set("course", code)
        else next.delete("course")
        return next
      })
    },
    [setSearchParams]
  )

  const addStudentToCourse = useCallback(
    async (uid: string) => {
      if (!selectedCourse) {
        toast.error("Select a course first.")
        return
      }
      setAdding(true)
      try {
        await ensureStudentOnCourse(uid, selectedCourse)
        toast.success("Student added to course roster.")
        await refreshRoster()
      } catch (error) {
        toast.error(getAuthErrorMessage(error))
      } finally {
        setAdding(false)
      }
    },
    [selectedCourse, refreshRoster]
  )

  const value = useMemo(
    () => ({
      courses,
      coursesStatus,
      coursesError,
      students,
      studentsStatus,
      selectedCourseCode,
      selectedCourse,
      selectCourse,
      roster,
      rosterStatus,
      rosterError,
      refreshRoster,
      addStudentToCourse,
      adding,
    }),
    [
      courses,
      coursesStatus,
      coursesError,
      students,
      studentsStatus,
      selectedCourseCode,
      selectedCourse,
      selectCourse,
      roster,
      rosterStatus,
      rosterError,
      refreshRoster,
      addStudentToCourse,
      adding,
    ]
  )

  return (
    <StaffContext.Provider value={value}>{children}</StaffContext.Provider>
  )
}

export function useStaff() {
  const context = useContext(StaffContext)
  if (!context) {
    throw new Error("Staff tools are only available inside the staff workspace.")
  }
  return context
}

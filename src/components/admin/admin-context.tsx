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

import { getAuthErrorMessage, type UserProfile } from "@/lib/auth"
import { listDirectory, saveStudentDashboard } from "@/lib/admin-data"
import {
  getDashboardData,
  type DashboardData,
} from "@/lib/dashboard-data"

type LoadStatus = "loading" | "ready" | "error"
type RecordStatus = "idle" | "loading" | "ready" | "error"

interface AdminContextValue {
  users: UserProfile[]
  directoryStatus: LoadStatus
  directoryError: string
  refreshDirectory: () => Promise<void>
  selectedUid: string
  selectedProfile: UserProfile | null
  selectStudent: (uid: string) => void
  draft: DashboardData | null
  recordStatus: RecordStatus
  recordError: string
  dirty: boolean
  saving: boolean
  patch: (partial: Partial<DashboardData>) => void
  save: () => Promise<void>
}

const AdminContext = createContext<AdminContextValue | null>(null)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [directoryStatus, setDirectoryStatus] = useState<LoadStatus>("loading")
  const [directoryError, setDirectoryError] = useState("")
  const [draft, setDraft] = useState<DashboardData | null>(null)
  const [recordStatus, setRecordStatus] = useState<RecordStatus>("idle")
  const [recordError, setRecordError] = useState("")
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)

  const selectedUid = searchParams.get("student") ?? ""
  const selectedProfile =
    users.find((user) => user.uid === selectedUid) ?? null

  const refreshDirectory = useCallback(async () => {
    setDirectoryStatus("loading")
    setDirectoryError("")
    try {
      setUsers(await listDirectory())
      setDirectoryStatus("ready")
    } catch (error) {
      setDirectoryError(getAuthErrorMessage(error))
      setDirectoryStatus("error")
    }
  }, [])

  useEffect(() => {
    void refreshDirectory()
  }, [refreshDirectory])

  useEffect(() => {
    if (!selectedUid) {
      setDraft(null)
      setRecordStatus("idle")
      setRecordError("")
      setDirty(false)
      return
    }

    let active = true
    setRecordStatus("loading")
    setRecordError("")
    setDirty(false)

    getDashboardData(selectedUid)
      .then((data) => {
        if (!active) return
        setDraft(data)
        setRecordStatus("ready")
      })
      .catch((error: unknown) => {
        if (!active) return
        setDraft(null)
        setRecordError(getAuthErrorMessage(error))
        setRecordStatus("error")
      })

    return () => {
      active = false
    }
  }, [selectedUid])

  const selectStudent = useCallback(
    (uid: string) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current)
        if (uid) next.set("student", uid)
        else next.delete("student")
        return next
      })
    },
    [setSearchParams]
  )

  const patch = useCallback((partial: Partial<DashboardData>) => {
    setDraft((current) => (current ? { ...current, ...partial } : current))
    setDirty(true)
  }, [])

  const save = useCallback(async () => {
    if (!draft || !selectedUid) return
    setSaving(true)
    try {
      await saveStudentDashboard(selectedUid, draft)
      setDirty(false)
      toast.success("Student record saved.")
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }, [draft, selectedUid])

  const value = useMemo(
    () => ({
      users,
      directoryStatus,
      directoryError,
      refreshDirectory,
      selectedUid,
      selectedProfile,
      selectStudent,
      draft,
      recordStatus,
      recordError,
      dirty,
      saving,
      patch,
      save,
    }),
    [
      users,
      directoryStatus,
      directoryError,
      refreshDirectory,
      selectedUid,
      selectedProfile,
      selectStudent,
      draft,
      recordStatus,
      recordError,
      dirty,
      saving,
      patch,
      save,
    ]
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdminRecord() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("Admin tools are only available inside the admin workspace.")
  }
  return context
}

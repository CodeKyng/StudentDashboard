import { useCallback, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { IdCard, Pencil, RefreshCw, Search } from "lucide-react"
import { toast } from "sonner"

import { useAdminRecord } from "@/components/admin/admin-context"
import { getAuthErrorMessage } from "@/lib/auth"
import {
  assignStudentIdentity,
  listDepartments,
  listFaculties,
  listStudentsWithMatric,
  type Department,
  type Faculty,
  type StudentDirectoryEntry,
} from "@/lib/institution-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function AdminStudents() {
  const { selectStudent, refreshDirectory } = useAdminRecord()
  const [students, setStudents] = useState<StudentDirectoryEntry[]>([])
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("Student")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<StudentDirectoryEntry | null>(null)
  const [matric, setMatric] = useState("")
  const [facultyId, setFacultyId] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [level, setLevel] = useState("")
  const [session, setSession] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [s, f, d] = await Promise.all([
        listStudentsWithMatric(),
        listFaculties(),
        listDepartments(),
      ])
      setStudents(s)
      setFaculties(f)
      setDepartments(d)
      await refreshDirectory()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [refreshDirectory])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return students.filter((s) => {
      if (roleFilter && s.role !== roleFilter) return false
      if (!q) return true
      return (
        s.displayName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.matricNumber?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [students, query, roleFilter])

  const deptsForFaculty = useMemo(() => {
    if (!facultyId) return departments
    return departments.filter((d) => d.facultyId === facultyId)
  }, [departments, facultyId])

  function openAssign(student: StudentDirectoryEntry) {
    setEditing(student)
    setMatric(student.matricNumber ?? "")
    setFacultyId(student.facultyId ?? "")
    setDepartmentId(student.departmentId ?? "")
    setLevel(student.level ?? "")
    setSession(student.session ?? "")
    setOpen(true)
  }

  function onFacultyPick(id: string) {
    setFacultyId(id)
    const first = departments.find((d) => d.facultyId === id)
    setDepartmentId(first?.id ?? "")
  }

  async function handleSave() {
    if (!editing) return
    if (!matric.trim()) {
      toast.error("Matric number is required.")
      return
    }
    const faculty = faculties.find((f) => f.id === facultyId)
    const department = departments.find((d) => d.id === departmentId)
    setSaving(true)
    try {
      await assignStudentIdentity(editing.uid, {
        matricNumber: matric,
        facultyId: facultyId || undefined,
        facultyName: faculty?.name,
        departmentId: departmentId || undefined,
        departmentName: department?.name,
        level: level || undefined,
        session: session || undefined,
      })
      toast.success(`Matric ${matric.trim().toUpperCase()} assigned.`)
      setOpen(false)
      await load()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const withoutMatric = students.filter(
    (s) => s.role === "Student" && !s.matricNumber
  ).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground">
            Assign matric numbers and place students in faculties and departments.
            Then open a record to edit academics and fees.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={() => void load()} disabled={loading}>
          <RefreshCw className="size-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total accounts</CardDescription>
            <CardTitle className="text-3xl">{loading ? "—" : students.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Students</CardDescription>
            <CardTitle className="text-3xl">
              {loading ? "—" : students.filter((s) => s.role === "Student").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Awaiting matric</CardDescription>
            <CardTitle className="text-3xl text-amber-600">
              {loading ? "—" : withoutMatric}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IdCard className="size-4" />
              Directory & matric assignment
            </CardTitle>
            <CardDescription>
              Search by name, email, or matric. Assign numbers and academic placement.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="w-full pl-8 sm:w-56"
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filter by role"
            >
              <option value="">All roles</option>
              <option value="Student">Students</option>
              <option value="Staff">Staff</option>
              <option value="Admin">Admin</option>
              <option value="Parent">Parent</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Matric</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="w-44">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Loading directory…
                    </TableCell>
                  </TableRow>
                )}
                {!loading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No matching users.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell className="font-medium">{user.displayName}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      {user.matricNumber ? (
                        <span className="font-mono text-sm font-semibold">{user.matricNumber}</span>
                      ) : (
                        <span className="text-xs text-amber-600">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.departmentName || "—"}</TableCell>
                    <TableCell>{user.level || "—"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.role === "Student" && (
                          <Button type="button" size="sm" variant="secondary" onClick={() => openAssign(user)}>
                            <Pencil className="size-3.5" />
                            Matric
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          asChild
                          onClick={() => selectStudent(user.uid)}
                        >
                          <Link to={`/admin/profile?student=${encodeURIComponent(user.uid)}`}>
                            Record
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign matric & placement</DialogTitle>
            <DialogDescription>
              {editing ? `${editing.displayName} · ${editing.email}` : "Student"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="matric">Matric number</Label>
              <Input
                id="matric"
                placeholder="e.g. UJ/2024/NS/0123"
                value={matric}
                onChange={(e) => setMatric(e.target.value.toUpperCase())}
                className="font-mono"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="st-faculty">Faculty</Label>
                <select
                  id="st-faculty"
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                  value={facultyId}
                  onChange={(e) => onFacultyPick(e.target.value)}
                >
                  <option value="">Select faculty</option>
                  {faculties.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="st-dept">Department</Label>
                <select
                  id="st-dept"
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                >
                  <option value="">Select department</option>
                  {deptsForFaculty.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="st-level">Level</Label>
                <Input id="st-level" placeholder="e.g. 100" value={level} onChange={(e) => setLevel(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="st-session">Session</Label>
                <Input id="st-session" placeholder="e.g. 2024/2025" value={session} onChange={(e) => setSession(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="button" disabled={saving} onClick={() => void handleSave()}>
              {saving ? "Saving…" : "Save assignment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

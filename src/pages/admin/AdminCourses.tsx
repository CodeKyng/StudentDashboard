import { useCallback, useEffect, useMemo, useState } from "react"
import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { RecordGate } from "@/components/admin/RecordGate"
import { RecordTable } from "@/components/admin/RecordTable"
import { useAdminRecord } from "@/components/admin/admin-context"
import { getAuthErrorMessage } from "@/lib/auth"
import {
  deleteInstitutionCourse,
  listDepartments,
  listFaculties,
  listInstitutionCourses,
  saveInstitutionCourse,
  type Department,
  type Faculty,
  type InstitutionCourse,
} from "@/lib/institution-data"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const emptyCourse: InstitutionCourse = {
  id: "",
  code: "",
  title: "",
  description: "",
  units: 3,
  level: "100",
  semester: "First",
  departmentId: "",
  departmentName: "",
  facultyId: "",
  facultyName: "",
  prerequisites: [],
}

export default function AdminCourses() {
  const { patch } = useAdminRecord()
  const [courses, setCourses] = useState<InstitutionCourse[]>([])
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<InstitutionCourse>(emptyCourse)
  const [filterDept, setFilterDept] = useState("")
  const [prereqText, setPrereqText] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [c, f, d] = await Promise.all([
        listInstitutionCourses(),
        listFaculties(),
        listDepartments(),
      ])
      setCourses(c)
      setFaculties(f)
      setDepartments(d)
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    if (!filterDept) return courses
    return courses.filter((c) => c.departmentId === filterDept)
  }, [courses, filterDept])

  const departmentsForFaculty = useMemo(() => {
    if (!form.facultyId) return departments
    return departments.filter((d) => d.facultyId === form.facultyId)
  }, [departments, form.facultyId])

  function openCreate() {
    const firstDept = departments[0]
    setForm({
      ...emptyCourse,
      departmentId: firstDept?.id ?? "",
      departmentName: firstDept?.name ?? "",
      facultyId: firstDept?.facultyId ?? "",
      facultyName: firstDept?.facultyName ?? "",
    })
    setPrereqText("")
    setOpen(true)
  }

  function openEdit(course: InstitutionCourse) {
    setForm({ ...course })
    setPrereqText(course.prerequisites.join(", "))
    setOpen(true)
  }

  function onFacultyChange(facultyId: string) {
    const faculty = faculties.find((f) => f.id === facultyId)
    const depts = departments.filter((d) => d.facultyId === facultyId)
    const first = depts[0]
    setForm((f) => ({
      ...f,
      facultyId,
      facultyName: faculty?.name ?? "",
      departmentId: first?.id ?? "",
      departmentName: first?.name ?? "",
    }))
  }

  function onDepartmentChange(departmentId: string) {
    const dept = departments.find((d) => d.id === departmentId)
    setForm((f) => ({
      ...f,
      departmentId,
      departmentName: dept?.name ?? "",
      facultyId: dept?.facultyId ?? f.facultyId,
      facultyName: dept?.facultyName ?? f.facultyName,
    }))
  }

  async function handleSave() {
    if (!form.code.trim() || !form.title.trim()) {
      toast.error("Course code and title are required.")
      return
    }
    if (!form.units || form.units < 1) {
      toast.error("Credit units must be at least 1.")
      return
    }
    if (!form.departmentId) {
      toast.error("Select a department.")
      return
    }
    setSaving(true)
    try {
      await saveInstitutionCourse({
        ...form,
        prerequisites: prereqText
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
      })
      toast.success(form.id ? "Course updated." : "Course created.")
      setOpen(false)
      await load()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, code: string) {
    if (!window.confirm(`Delete course ${code}? This cannot be undone.`)) return
    try {
      await deleteInstitutionCourse(id)
      toast.success("Course deleted.")
      await load()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
        <p className="text-sm text-muted-foreground">
          Maintain the university course catalog (code, title, description,
          credit units) and edit a selected student&apos;s enrolled courses.
        </p>
      </div>

      <Tabs defaultValue="catalog" className="space-y-4">
        <TabsList>
          <TabsTrigger value="catalog">Course catalog</TabsTrigger>
          <TabsTrigger value="student">Student enrolled courses</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <select
              className="h-9 max-w-xs rounded-lg border border-input bg-background px-3 text-sm"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              aria-label="Filter by department"
            >
              <option value="">All departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
            <Button type="button" onClick={openCreate} disabled={departments.length === 0}>
              <Plus className="size-4" />
              New course
            </Button>
          </div>

          {departments.length === 0 && !loading && (
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40">
              <CardContent className="pt-6 text-sm">
                Create faculties and departments first, then add courses with credit units and descriptions.
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="size-4" />
                Institutional catalog
              </CardTitle>
              <CardDescription>
                {loading
                  ? "Loading…"
                  : `${filtered.length} course${filtered.length === 1 ? "" : "s"} · units = credit load`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead className="min-w-[180px]">Description</TableHead>
                      <TableHead className="w-28">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          Loading courses…
                        </TableCell>
                      </TableRow>
                    )}
                    {!loading && filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          No courses in the catalog yet.
                        </TableCell>
                      </TableRow>
                    )}
                    {filtered.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-mono text-sm font-medium">{course.code}</TableCell>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>
                          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-sm font-semibold text-primary">
                            {course.units}u
                          </span>
                        </TableCell>
                        <TableCell>{course.level || "—"}</TableCell>
                        <TableCell>{course.semester || "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{course.departmentName || "—"}</TableCell>
                        <TableCell className="max-w-[220px] truncate text-muted-foreground">
                          {course.description || "—"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button type="button" size="icon" variant="ghost" aria-label={`Edit ${course.code}`} onClick={() => openEdit(course)}>
                              <Pencil className="size-4" />
                            </Button>
                            <Button type="button" size="icon" variant="ghost" aria-label={`Delete ${course.code}`} onClick={() => void handleDelete(course.id, course.code)}>
                              <Trash2 className="size-4 text-destructive" />
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
        </TabsContent>

        <TabsContent value="student" className="space-y-4">
          <RecordGate>
            {(draft) => (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Enrolled courses</CardTitle>
                    <CardDescription>
                      Courses shown on the selected student&apos;s dashboard overview.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecordTable
                      rows={draft.courses}
                      emptyLabel="No enrolled courses yet."
                      createRow={() => ({
                        code: "",
                        title: "",
                        description: "",
                        progress: 0,
                      })}
                      onChange={(next) => patch({ courses: next })}
                      columns={[
                        { key: "code", label: "Code", minWidth: "100px" },
                        { key: "title", label: "Title", minWidth: "160px" },
                        { key: "description", label: "Description", minWidth: "220px" },
                        { key: "progress", label: "Progress", kind: "number", minWidth: "90px" },
                      ]}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </RecordGate>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit course" : "Create course"}</DialogTitle>
            <DialogDescription>
              Define code, title, description, and credit units (load). Link to a department.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="course-code">Code</Label>
                <Input
                  id="course-code"
                  placeholder="e.g. CSC101"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="course-units">Credit units</Label>
                <Input
                  id="course-units"
                  type="number"
                  min={1}
                  max={12}
                  value={form.units}
                  onChange={(e) => setForm((f) => ({ ...f, units: Number(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course-title">Title</Label>
              <Input
                id="course-title"
                placeholder="e.g. Introduction to Computing"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course-desc">Description</Label>
              <Textarea
                id="course-desc"
                placeholder="Course synopsis / learning outcomes"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="course-faculty">Faculty</Label>
                <select
                  id="course-faculty"
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                  value={form.facultyId}
                  onChange={(e) => onFacultyChange(e.target.value)}
                >
                  <option value="">Select faculty</option>
                  {faculties.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="course-dept">Department</Label>
                <select
                  id="course-dept"
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                  value={form.departmentId}
                  onChange={(e) => onDepartmentChange(e.target.value)}
                >
                  <option value="">Select department</option>
                  {departmentsForFaculty.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="course-level">Level</Label>
                <Input
                  id="course-level"
                  placeholder="e.g. 100"
                  value={form.level}
                  onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="course-semester">Semester</Label>
                <select
                  id="course-semester"
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                  value={form.semester}
                  onChange={(e) => setForm((f) => ({ ...f, semester: e.target.value }))}
                >
                  <option value="First">First</option>
                  <option value="Second">Second</option>
                  <option value="Either">Either</option>
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course-prereq">Prerequisites (comma-separated)</Label>
              <Input
                id="course-prereq"
                placeholder="e.g. MTH101, PHY101"
                value={prereqText}
                onChange={(e) => setPrereqText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="button" disabled={saving} onClick={() => void handleSave()}>
              {saving ? "Saving…" : form.id ? "Save changes" : "Create course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

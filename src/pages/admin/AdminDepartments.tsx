import { useCallback, useEffect, useMemo, useState } from "react"
import { Building, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { getAuthErrorMessage } from "@/lib/auth"
import {
  deleteDepartment,
  listDepartments,
  listFaculties,
  saveDepartment,
  type Department,
  type Faculty,
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

const emptyForm: Department = {
  id: "",
  name: "",
  code: "",
  facultyId: "",
  facultyName: "",
  description: "",
}

export default function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Department>(emptyForm)
  const [filterFaculty, setFilterFaculty] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [deps, facs] = await Promise.all([listDepartments(), listFaculties()])
      setDepartments(deps)
      setFaculties(facs)
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
    if (!filterFaculty) return departments
    return departments.filter((d) => d.facultyId === filterFaculty)
  }, [departments, filterFaculty])

  function openCreate() {
    setForm({
      ...emptyForm,
      facultyId: filterFaculty || faculties[0]?.id || "",
      facultyName:
        faculties.find((f) => f.id === (filterFaculty || faculties[0]?.id))?.name || "",
    })
    setOpen(true)
  }

  function openEdit(department: Department) {
    setForm({ ...department })
    setOpen(true)
  }

  function onFacultyChange(facultyId: string) {
    const faculty = faculties.find((f) => f.id === facultyId)
    setForm((f) => ({ ...f, facultyId, facultyName: faculty?.name ?? "" }))
  }

  async function handleSave() {
    if (!form.name.trim() || !form.code.trim()) {
      toast.error("Department name and code are required.")
      return
    }
    if (!form.facultyId) {
      toast.error("Select a parent faculty.")
      return
    }
    setSaving(true)
    try {
      await saveDepartment(form)
      toast.success(form.id ? "Department updated." : "Department created.")
      setOpen(false)
      await load()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete department "${name}"? This cannot be undone.`)) return
    try {
      await deleteDepartment(id)
      toast.success("Department deleted.")
      await load()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
          <p className="text-sm text-muted-foreground">
            Create departments under a faculty. Students and courses are placed in departments.
          </p>
        </div>
        <Button type="button" onClick={openCreate} disabled={faculties.length === 0}>
          <Plus className="size-4" />
          New department
        </Button>
      </div>

      {faculties.length === 0 && !loading && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40">
          <CardContent className="pt-6 text-sm">
            Create at least one faculty first, then return here to add departments.
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building className="size-4" />
              Department directory
            </CardTitle>
            <CardDescription>
              {loading ? "Loading…" : `${filtered.length} department${filtered.length === 1 ? "" : "s"}`}
            </CardDescription>
          </div>
          <select
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
            value={filterFaculty}
            onChange={(e) => setFilterFaculty(e.target.value)}
            aria-label="Filter by faculty"
          >
            <option value="">All faculties</option>
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-28">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Loading departments…
                    </TableCell>
                  </TableRow>
                )}
                {!loading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No departments yet.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-mono text-sm font-medium">{department.code}</TableCell>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell className="text-muted-foreground">{department.facultyName || "—"}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {department.description || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button type="button" size="icon" variant="ghost" aria-label={`Edit ${department.name}`} onClick={() => openEdit(department)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button type="button" size="icon" variant="ghost" aria-label={`Delete ${department.name}`} onClick={() => void handleDelete(department.id, department.name)}>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit department" : "Create department"}</DialogTitle>
            <DialogDescription>
              Each department belongs to one faculty (e.g. Computer Science under Natural Sciences).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="dept-faculty">Faculty</Label>
              <select
                id="dept-faculty"
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                value={form.facultyId}
                onChange={(e) => onFacultyChange(e.target.value)}
              >
                <option value="">Select faculty</option>
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dept-code">Code</Label>
              <Input id="dept-code" placeholder="e.g. CSC" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dept-name">Name</Label>
              <Input id="dept-name" placeholder="e.g. Computer Science" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dept-desc">Description</Label>
              <Textarea id="dept-desc" placeholder="Optional short description" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="button" disabled={saving} onClick={() => void handleSave()}>
              {saving ? "Saving…" : form.id ? "Save changes" : "Create department"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

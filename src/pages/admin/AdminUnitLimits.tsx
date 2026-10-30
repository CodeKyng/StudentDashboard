import { useCallback, useEffect, useMemo, useState } from "react"
import { Gauge, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { getAuthErrorMessage } from "@/lib/auth"
import {
  listDepartments,
  listFaculties,
  type Department,
  type Faculty,
} from "@/lib/institution-data"
import {
  deleteUnitLimit,
  listUnitLimits,
  saveUnitLimit,
  type UnitLimit,
} from "@/lib/unit-limits"
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

const LEVELS = ["100", "200", "300", "400", "500", "600"]

const empty: Omit<UnitLimit, "id"> = {
  facultyId: "",
  facultyName: "",
  departmentId: "",
  departmentName: "",
  level: "100",
  maxUnits: 18,
}

export default function AdminUnitLimits() {
  const [limits, setLimits] = useState<UnitLimit[]>([])
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(empty)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [l, f, d] = await Promise.all([
        listUnitLimits(),
        listFaculties(),
        listDepartments(),
      ])
      setLimits(l)
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

  const deptsForFaculty = useMemo(() => {
    if (!form.facultyId) return departments
    return departments.filter((d) => d.facultyId === form.facultyId)
  }, [departments, form.facultyId])

  function openCreate() {
    const firstDept = departments[0]
    setEditingId(null)
    setForm({
      ...empty,
      facultyId: firstDept?.facultyId ?? "",
      facultyName: firstDept?.facultyName ?? "",
      departmentId: firstDept?.id ?? "",
      departmentName: firstDept?.name ?? "",
    })
    setOpen(true)
  }

  function openEdit(row: UnitLimit) {
    setEditingId(row.id)
    setForm({
      facultyId: row.facultyId,
      facultyName: row.facultyName,
      departmentId: row.departmentId,
      departmentName: row.departmentName,
      level: row.level,
      maxUnits: row.maxUnits,
    })
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
    if (!form.departmentId || !form.level.trim()) {
      toast.error("Department and level are required.")
      return
    }
    setSaving(true)
    try {
      await saveUnitLimit({
        ...form,
        id: editingId ?? undefined,
      })
      toast.success(editingId ? "Unit limit updated." : "Unit limit saved.")
      setOpen(false)
      await load()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this unit limit?")) return
    try {
      await deleteUnitLimit(id)
      toast.success("Unit limit removed.")
      await load()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Unit limits</h1>
          <p className="text-sm text-muted-foreground">
            Set maximum credit units a student may register per semester for each
            faculty → department → level combination.
          </p>
        </div>
        <Button type="button" onClick={openCreate} disabled={departments.length === 0}>
          <Plus className="size-4" />
          New limit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="size-4" />
            Registration unit caps
          </CardTitle>
          <CardDescription>
            {loading
              ? "Loading…"
              : `${limits.length} rule${limits.length === 1 ? "" : "s"} · default 18 units if unset`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Max units</TableHead>
                  <TableHead className="w-28">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Loading…
                    </TableCell>
                  </TableRow>
                )}
                {!loading && limits.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No limits yet. Students default to 18 units until you add rules.
                    </TableCell>
                  </TableRow>
                )}
                {limits.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.facultyName || "—"}</TableCell>
                    <TableCell className="font-medium">{row.departmentName}</TableCell>
                    <TableCell>{row.level}</TableCell>
                    <TableCell>
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-sm font-semibold text-primary">
                        {row.maxUnits}u
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          aria-label="Edit"
                          onClick={() => openEdit(row)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          aria-label="Delete"
                          onClick={() => void handleDelete(row.id)}
                        >
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit unit limit" : "New unit limit"}</DialogTitle>
            <DialogDescription>
              Faculty + department + level → maximum credit units per registration.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="ul-faculty">Faculty</Label>
              <select
                id="ul-faculty"
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                value={form.facultyId}
                onChange={(e) => onFacultyChange(e.target.value)}
              >
                <option value="">Select faculty</option>
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ul-dept">Department</Label>
              <select
                id="ul-dept"
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                value={form.departmentId}
                onChange={(e) => onDepartmentChange(e.target.value)}
              >
                <option value="">Select department</option>
                {deptsForFaculty.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ul-level">Level</Label>
              <select
                id="ul-level"
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                value={form.level}
                onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
              >
                {LEVELS.map((lv) => (
                  <option key={lv} value={lv}>
                    {lv}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ul-max">Max units</Label>
              <Input
                id="ul-max"
                type="number"
                min={1}
                max={30}
                value={form.maxUnits}
                onChange={(e) =>
                  setForm((f) => ({ ...f, maxUnits: Number(e.target.value) || 0 }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" disabled={saving} onClick={() => void handleSave()}>
              {saving ? "Saving…" : "Save limit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

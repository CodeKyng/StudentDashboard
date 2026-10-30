import { useCallback, useEffect, useState } from "react"
import { Building2, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { getAuthErrorMessage } from "@/lib/auth"
import {
  deleteFaculty,
  listFaculties,
  saveFaculty,
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

const emptyForm: Faculty = { id: "", name: "", code: "", description: "" }

export default function AdminFaculties() {
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Faculty>(emptyForm)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setFaculties(await listFaculties())
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  function openCreate() {
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(faculty: Faculty) {
    setForm({ ...faculty })
    setOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.code.trim()) {
      toast.error("Faculty name and code are required.")
      return
    }
    setSaving(true)
    try {
      await saveFaculty(form)
      toast.success(form.id ? "Faculty updated." : "Faculty created.")
      setOpen(false)
      await load()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete faculty "${name}"? This cannot be undone.`)) return
    try {
      await deleteFaculty(id)
      toast.success("Faculty deleted.")
      await load()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Faculties</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage university faculties. Departments and courses attach to these.
          </p>
        </div>
        <Button type="button" onClick={openCreate}>
          <Plus className="size-4" />
          New faculty
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="size-4" />
            Faculty directory
          </CardTitle>
          <CardDescription>
            {loading ? "Loading…" : `${faculties.length} facult${faculties.length === 1 ? "y" : "ies"}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-28">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Loading faculties…
                    </TableCell>
                  </TableRow>
                )}
                {!loading && faculties.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No faculties yet. Create the first one to structure the university.
                    </TableCell>
                  </TableRow>
                )}
                {faculties.map((faculty) => (
                  <TableRow key={faculty.id}>
                    <TableCell className="font-mono text-sm font-medium">{faculty.code}</TableCell>
                    <TableCell className="font-medium">{faculty.name}</TableCell>
                    <TableCell className="max-w-md truncate text-muted-foreground">
                      {faculty.description || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button type="button" size="icon" variant="ghost" aria-label={`Edit ${faculty.name}`} onClick={() => openEdit(faculty)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button type="button" size="icon" variant="ghost" aria-label={`Delete ${faculty.name}`} onClick={() => void handleDelete(faculty.id, faculty.name)}>
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
            <DialogTitle>{form.id ? "Edit faculty" : "Create faculty"}</DialogTitle>
            <DialogDescription>
              Faculties group related departments (e.g. Natural Sciences, Education).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="faculty-code">Code</Label>
              <Input id="faculty-code" placeholder="e.g. FNS" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="faculty-name">Name</Label>
              <Input id="faculty-name" placeholder="e.g. Faculty of Natural Sciences" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="faculty-desc">Description</Label>
              <Textarea id="faculty-desc" placeholder="Optional short description" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="button" disabled={saving} onClick={() => void handleSave()}>
              {saving ? "Saving…" : form.id ? "Save changes" : "Create faculty"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

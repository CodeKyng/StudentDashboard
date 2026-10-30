import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Loader2, Megaphone, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { getAuthErrorMessage } from "@/lib/auth"
import {
  deleteAnnouncement,
  listAnnouncements,
  saveAnnouncement,
  type InstitutionAnnouncement,
} from "@/lib/announcements"

const emptyForm = {
  title: "",
  description: "",
  source: "University of Jos",
  badge: "General",
  dateCreated: new Date().toISOString().slice(0, 10),
  pinned: false,
}

export default function AdminAnnouncements() {
  const [items, setItems] = useState<InstitutionAnnouncement[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await listAnnouncements())
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  function startCreate() {
    setEditingId(null)
    setForm({
      ...emptyForm,
      dateCreated: new Date().toISOString().slice(0, 10),
    })
  }

  function startEdit(item: InstitutionAnnouncement) {
    setEditingId(item.id)
    setForm({
      title: item.title,
      description: item.description,
      source: item.source,
      badge: item.badge,
      dateCreated: item.dateCreated,
      pinned: Boolean(item.pinned),
    })
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await saveAnnouncement({
        id: editingId || undefined,
        ...form,
        audience: "all",
      })
      toast.success(editingId ? "Announcement updated." : "Announcement published.")
      startCreate()
      await load()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this announcement?")) return
    try {
      await deleteAnnouncement(id)
      toast.success("Deleted.")
      if (editingId === id) startCreate()
      await load()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Announcements</h1>
        <p className="text-sm text-muted-foreground">
          Publish institution-wide notices. Every signed-in student sees them on
          the Announcements page and dashboard.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="size-5" />
                Published notices
              </CardTitle>
              <CardDescription>
                Newest first. Pin important items to keep them on top.
              </CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={startCreate}>
              <Plus className="size-4" />
              New
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading…
              </p>
            ) : items.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No announcements yet. Create one on the right.
              </p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{item.badge}</Badge>
                      {item.pinned ? <Badge>Pinned</Badge> : null}
                      <span className="text-xs text-muted-foreground">
                        {item.source} · {item.dateCreated}
                      </span>
                    </div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => void handleDelete(item.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit announcement" : "New announcement"}</CardTitle>
            <CardDescription>
              Visible to all students after you save.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => void handleSave(e)}>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Registration deadline"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Body</Label>
                <Textarea
                  id="description"
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Full notice text…"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    value={form.source}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, source: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="badge">Badge</Label>
                  <Input
                    id="badge"
                    value={form.badge}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, badge: e.target.value }))
                    }
                    placeholder="General / Urgent / Academic"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.dateCreated}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, dateCreated: e.target.value }))
                  }
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="size-4 accent-cyan-700"
                  checked={form.pinned}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, pinned: e.target.checked }))
                  }
                />
                Pin to top
              </label>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Saving…
                    </>
                  ) : editingId ? (
                    "Update"
                  ) : (
                    "Publish"
                  )}
                </Button>
                {editingId ? (
                  <Button type="button" variant="outline" onClick={startCreate}>
                    Cancel
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { RecordGate } from "@/components/admin/RecordGate"
import { NumberField } from "@/components/admin/Fields"
import { RecordTable } from "@/components/admin/RecordTable"
import { useAdminRecord } from "@/components/admin/admin-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminAnnouncements() {
  const { patch } = useAdminRecord()

  return (
    <RecordGate>
      {(draft) => (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>Notices shown to the selected student.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-w-xs">
                <NumberField
                  label="Unread count"
                  value={draft.unreadAnnouncementCount}
                  onChange={(value) => patch({ unreadAnnouncementCount: value })}
                />
              </div>
              <RecordTable
                rows={draft.announcements}
                emptyLabel="No announcements."
                createRow={() => ({
                  id: crypto.randomUUID(),
                  source: "",
                  dateCreated: new Date().toISOString().slice(0, 10),
                  title: "",
                  description: "",
                  badge: "",
                })}
                onChange={(announcements) => patch({ announcements })}
                columns={[
                  { key: "title", label: "Title", minWidth: "160px" },
                  { key: "source", label: "Source", minWidth: "120px" },
                  { key: "dateCreated", label: "Date", minWidth: "120px" },
                  { key: "badge", label: "Badge", minWidth: "100px" },
                  { key: "description", label: "Description", minWidth: "220px" },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
              <CardDescription>Upcoming events on the student dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecordTable
                rows={draft.events}
                emptyLabel="No events."
                createRow={() => ({ title: "", description: "" })}
                onChange={(events) => patch({ events })}
                columns={[
                  { key: "title", label: "Title", minWidth: "160px" },
                  { key: "description", label: "Description", minWidth: "240px" },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </RecordGate>
  )
}

import { RecordGate } from "@/components/admin/RecordGate"
import { TextField } from "@/components/admin/Fields"
import { useAdminRecord } from "@/components/admin/admin-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminHostel() {
  const { patch } = useAdminRecord()

  return (
    <RecordGate>
      {(draft) => (
        <Card>
          <CardHeader>
            <CardTitle>Hostel assignment</CardTitle>
            <CardDescription>Accommodation details for the selected student.</CardDescription>
          </CardHeader>
          <CardContent className="grid max-w-2xl gap-4 sm:grid-cols-2">
            <TextField
              label="Hostel"
              value={draft.hostelAssignment?.hostel ?? ""}
              onChange={(value) =>
                patch({
                  hostelAssignment: {
                    hostel: value,
                    room: draft.hostelAssignment?.room ?? "",
                    session: draft.hostelAssignment?.session ?? "",
                    status: draft.hostelAssignment?.status ?? "",
                  },
                })
              }
            />
            <TextField
              label="Room"
              value={draft.hostelAssignment?.room ?? ""}
              onChange={(value) =>
                patch({
                  hostelAssignment: {
                    hostel: draft.hostelAssignment?.hostel ?? "",
                    room: value,
                    session: draft.hostelAssignment?.session ?? "",
                    status: draft.hostelAssignment?.status ?? "",
                  },
                })
              }
            />
            <TextField
              label="Session"
              value={draft.hostelAssignment?.session ?? ""}
              onChange={(value) =>
                patch({
                  hostelAssignment: {
                    hostel: draft.hostelAssignment?.hostel ?? "",
                    room: draft.hostelAssignment?.room ?? "",
                    session: value,
                    status: draft.hostelAssignment?.status ?? "",
                  },
                })
              }
            />
            <TextField
              label="Status"
              value={draft.hostelAssignment?.status ?? ""}
              onChange={(value) =>
                patch({
                  hostelAssignment: {
                    hostel: draft.hostelAssignment?.hostel ?? "",
                    room: draft.hostelAssignment?.room ?? "",
                    session: draft.hostelAssignment?.session ?? "",
                    status: value,
                  },
                })
              }
            />
          </CardContent>
        </Card>
      )}
    </RecordGate>
  )
}

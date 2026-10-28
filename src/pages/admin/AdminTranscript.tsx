import { RecordGate } from "@/components/admin/RecordGate"
import { TextField, AreaField } from "@/components/admin/Fields"
import { RecordTable } from "@/components/admin/RecordTable"
import { useAdminRecord } from "@/components/admin/admin-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminTranscript() {
  const { patch } = useAdminRecord()

  return (
    <RecordGate>
      {(draft) => (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clearance</CardTitle>
              <CardDescription>Transcript clearance status for the student.</CardDescription>
            </CardHeader>
            <CardContent className="grid max-w-2xl gap-4">
              <TextField
                label="Title"
                value={draft.transcriptClearance?.title ?? ""}
                onChange={(value) =>
                  patch({
                    transcriptClearance: {
                      title: value,
                      description: draft.transcriptClearance?.description ?? "",
                      date: draft.transcriptClearance?.date ?? "",
                    },
                  })
                }
              />
              <AreaField
                label="Description"
                value={draft.transcriptClearance?.description ?? ""}
                onChange={(value) =>
                  patch({
                    transcriptClearance: {
                      title: draft.transcriptClearance?.title ?? "",
                      description: value,
                      date: draft.transcriptClearance?.date ?? "",
                    },
                  })
                }
              />
              <TextField
                label="Date"
                value={draft.transcriptClearance?.date ?? ""}
                onChange={(value) =>
                  patch({
                    transcriptClearance: {
                      title: draft.transcriptClearance?.title ?? "",
                      description: draft.transcriptClearance?.description ?? "",
                      date: value,
                    },
                  })
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request metadata</CardTitle>
              <CardDescription>Key/value pairs shown on the transcript page.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecordTable
                rows={draft.transcriptRequestMeta}
                emptyLabel="No metadata rows."
                createRow={() => ({ label: "", value: "" })}
                onChange={(transcriptRequestMeta) => patch({ transcriptRequestMeta })}
                columns={[
                  { key: "label", label: "Label", minWidth: "160px" },
                  { key: "value", label: "Value", minWidth: "200px" },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </RecordGate>
  )
}

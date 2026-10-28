import { RecordGate } from "@/components/admin/RecordGate"
import { RecordTable } from "@/components/admin/RecordTable"
import { useAdminRecord } from "@/components/admin/admin-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const statuses = ["Pending", "Submitted", "Overdue"] as const

export default function AdminAssignments() {
  const { patch } = useAdminRecord()

  return (
    <RecordGate>
      {(draft) => (
        <Card>
          <CardHeader>
            <CardTitle>Assignments</CardTitle>
            <CardDescription>Track assignment status and scores.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecordTable
              rows={draft.assignments}
              emptyLabel="No assignments yet."
              createRow={() => ({
                course: "",
                title: "",
                dueDate: "",
                status: "Pending" as const,
                score: "",
              })}
              onChange={(assignments) => patch({ assignments })}
              columns={[
                { key: "course", label: "Course", minWidth: "120px" },
                { key: "title", label: "Title", minWidth: "160px" },
                { key: "dueDate", label: "Due date", minWidth: "120px" },
                {
                  key: "status",
                  label: "Status",
                  kind: "select",
                  options: statuses,
                  minWidth: "130px",
                },
                { key: "score", label: "Score", minWidth: "90px" },
              ]}
            />
          </CardContent>
        </Card>
      )}
    </RecordGate>
  )
}

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

export default function AdminExams() {
  const { patch } = useAdminRecord()

  return (
    <RecordGate>
      {(draft) => (
        <Card>
          <CardHeader>
            <CardTitle>Exam schedule</CardTitle>
            <CardDescription>Upcoming exams for the selected student.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecordTable
              rows={draft.exams}
              emptyLabel="No exams scheduled."
              createRow={() => ({
                course: "",
                date: "",
                time: "",
                hall: "",
                seatNo: "",
              })}
              onChange={(exams) => patch({ exams })}
              columns={[
                { key: "course", label: "Course", minWidth: "140px" },
                { key: "date", label: "Date", minWidth: "120px" },
                { key: "time", label: "Time", minWidth: "100px" },
                { key: "hall", label: "Hall", minWidth: "120px" },
                { key: "seatNo", label: "Seat", minWidth: "90px" },
              ]}
            />
          </CardContent>
        </Card>
      )}
    </RecordGate>
  )
}

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

export default function AdminAttendance() {
  const { patch } = useAdminRecord()

  return (
    <RecordGate>
      {(draft) => (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance summary</CardTitle>
              <CardDescription>Overall percentages for the student dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="grid max-w-xl gap-4 sm:grid-cols-2">
              <NumberField
                label="Overall attendance %"
                value={draft.attendancePercentage}
                onChange={(value) => patch({ attendancePercentage: value })}
              />
              <NumberField
                label="Warning threshold %"
                value={draft.warningPercentage}
                onChange={(value) => patch({ warningPercentage: value })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Per-course attendance</CardTitle>
              <CardDescription>Individual course attendance records.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecordTable
                rows={draft.attendanceCourses}
                emptyLabel="No attendance rows yet."
                createRow={() => ({
                  coursecode: "",
                  progress: 0,
                  percentage: 0,
                })}
                onChange={(attendanceCourses) => patch({ attendanceCourses })}
                columns={[
                  { key: "coursecode", label: "Course code", minWidth: "120px" },
                  { key: "progress", label: "Progress", kind: "number", minWidth: "100px" },
                  {
                    key: "percentage",
                    label: "Percentage",
                    kind: "number",
                    minWidth: "110px",
                  },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </RecordGate>
  )
}

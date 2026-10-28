import { RecordGate } from "@/components/admin/RecordGate"
import { TextField, NumberField } from "@/components/admin/Fields"
import { useAdminRecord } from "@/components/admin/admin-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel } from "@/components/ui/field"

export default function AdminProfile() {
  const { patch } = useAdminRecord()

  return (
    <RecordGate>
      {(draft) => (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Academic identity</CardTitle>
              <CardDescription>Session, level, and faculty details.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Current semester"
                value={draft.currentSemester ?? ""}
                onChange={(value) => patch({ currentSemester: value || undefined })}
              />
              <TextField
                label="Session"
                value={draft.session ?? ""}
                onChange={(value) => patch({ session: value || undefined })}
              />
              <TextField
                label="Level"
                value={draft.level ?? ""}
                onChange={(value) => patch({ level: value || undefined })}
              />
              <TextField
                label="Faculty"
                value={draft.faculty ?? ""}
                onChange={(value) => patch({ faculty: value || undefined })}
              />
              <TextField
                label="Department"
                value={draft.department ?? ""}
                onChange={(value) => patch({ department: value || undefined })}
              />
              <TextField
                label="Currency code"
                value={draft.currencyCode ?? ""}
                onChange={(value) => patch({ currencyCode: value || undefined })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance & fees</CardTitle>
              <CardDescription>Summary metrics shown on the student dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="CGPA"
                value={draft.cgpa}
                onChange={(value) => patch({ cgpa: value })}
              />
              <NumberField
                label="Previous CGPA"
                value={draft.previousCgpa}
                onChange={(value) => patch({ previousCgpa: value })}
              />
              <NumberField
                label="Attendance %"
                value={draft.attendancePercentage}
                onChange={(value) => patch({ attendancePercentage: value })}
              />
              <NumberField
                label="Warning threshold %"
                value={draft.warningPercentage}
                onChange={(value) => patch({ warningPercentage: value })}
              />
              <TextField
                label="Fee status"
                value={draft.feeStatus ?? ""}
                onChange={(value) => patch({ feeStatus: value || undefined })}
              />
              <NumberField
                label="School fee amount"
                value={draft.schoolFeeAmount}
                onChange={(value) => patch({ schoolFeeAmount: value })}
              />
              <NumberField
                label="Fees due"
                value={draft.feesDue}
                onChange={(value) => patch({ feesDue: value })}
              />
              <Field className="flex flex-row items-center gap-2 space-y-0 pt-6">
                <Checkbox
                  checked={Boolean(draft.registrationEligible)}
                  onCheckedChange={(checked) =>
                    patch({ registrationEligible: checked === true })
                  }
                />
                <FieldLabel>Registration eligible</FieldLabel>
              </Field>
            </CardContent>
          </Card>
        </div>
      )}
    </RecordGate>
  )
}

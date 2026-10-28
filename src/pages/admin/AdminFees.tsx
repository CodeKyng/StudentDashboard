import { RecordGate } from "@/components/admin/RecordGate"
import { NumberField, TextField } from "@/components/admin/Fields"
import { RecordTable } from "@/components/admin/RecordTable"
import { useAdminRecord } from "@/components/admin/admin-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminFees() {
  const { patch } = useAdminRecord()

  return (
    <RecordGate>
      {(draft) => (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fee summary</CardTitle>
              <CardDescription>Overall fee status and amounts.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              <TextField
                label="Currency code"
                value={draft.currencyCode ?? ""}
                onChange={(value) => patch({ currencyCode: value || undefined })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fee line items</CardTitle>
              <CardDescription>Breakdown shown on the student fees page.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecordTable
                rows={draft.feeItems}
                emptyLabel="No fee items."
                createRow={() => ({ name: "", amount: 0 })}
                onChange={(feeItems) => patch({ feeItems })}
                columns={[
                  { key: "name", label: "Item", minWidth: "180px" },
                  { key: "amount", label: "Amount", kind: "number", minWidth: "120px" },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scholarships</CardTitle>
              <CardDescription>Scholarship and aid entries.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecordTable
                rows={draft.scholarships}
                emptyLabel="No scholarships."
                createRow={() => ({ title: "", description: "", status: "" })}
                onChange={(scholarships) => patch({ scholarships })}
                columns={[
                  { key: "title", label: "Title", minWidth: "160px" },
                  { key: "description", label: "Description", minWidth: "220px" },
                  { key: "status", label: "Status", minWidth: "120px" },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </RecordGate>
  )
}

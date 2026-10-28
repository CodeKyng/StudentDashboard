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

export default function AdminReceipts() {
  const { patch } = useAdminRecord()

  return (
    <RecordGate>
      {(draft) => (
        <Card>
          <CardHeader>
            <CardTitle>Payment records</CardTitle>
            <CardDescription>Receipts and payment history for the student.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecordTable
              rows={draft.paymentRecords}
              emptyLabel="No payment records."
              createRow={() => ({
                session: "",
                level: "",
                date: "",
                rrr: "",
                status: "",
              })}
              onChange={(paymentRecords) => patch({ paymentRecords })}
              columns={[
                { key: "session", label: "Session", minWidth: "120px" },
                { key: "level", label: "Level", minWidth: "100px" },
                { key: "date", label: "Date", minWidth: "120px" },
                { key: "rrr", label: "RRR", minWidth: "140px" },
                { key: "status", label: "Status", minWidth: "120px" },
              ]}
            />
          </CardContent>
        </Card>
      )}
    </RecordGate>
  )
}

import { useState } from "react"
import { toast } from "sonner"
import { CreditCard, Loader2, ShieldAlert } from "lucide-react"

import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { useDashboardContext } from "@/components/Auth/dashboard-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAuthErrorMessage } from "@/lib/auth"
import { startFeePaymentPlaceholder } from "@/lib/student-data"

function FeesDashboard() {
  const { data, identity, profile, setData, refresh } = useDashboardContext()
  const [paying, setPaying] = useState(false)
  const [lastRrr, setLastRrr] = useState<string | null>(null)

  const formatCurrency = (amount: number | undefined) =>
    amount === undefined
      ? "—"
      : new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: data.currencyCode || "NGN",
          maximumFractionDigits: 2,
        }).format(amount)

  const amountDue = data.feesDue ?? data.schoolFeeAmount
  const canPay =
    amountDue !== undefined &&
    amountDue > 0 &&
    data.feeStatus !== "Paid"

  async function handlePayPlaceholder() {
    setPaying(true)
    setLastRrr(null)
    try {
      const record = await startFeePaymentPlaceholder(profile.uid, {
        session: identity.session || data.session || "",
        level: identity.level || data.level || "",
        amount: amountDue ?? 0,
      })
      setLastRrr(record.rrr)
      setData((prev) => ({
        ...prev,
        paymentRecords: [record, ...prev.paymentRecords],
        feeStatus: "Payment pending",
      }))
      toast.success("Payment initiated (placeholder). RRR generated.")
      await refresh()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setPaying(false)
    }
  }

  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <TopBar title="School fees" />
          </div>
        </header>
        <main className="grid gap-4 p-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-2">
                <CreditCard className="size-5" />
                Payment due
                {data.feeStatus && <Badge>{data.feeStatus}</Badge>}
              </CardTitle>
              <CardDescription>
                {identity.matricNumber
                  ? `Matric ${identity.matricNumber}`
                  : "Matric not assigned yet"}{" "}
                · {identity.session || data.session || "Session —"} ·{" "}
                {identity.level || data.level || "Level —"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-start gap-1 rounded-3xl bg-muted p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Amount due
                </p>
                <h1 className="text-3xl font-bold">{formatCurrency(amountDue)}</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {identity.facultyName || data.faculty || "Faculty —"}
                  {(identity.departmentName || data.department)
                    ? ` · ${identity.departmentName || data.department}`
                    : ""}
                </p>
              </div>
              {data.feeItems.length ? (
                data.feeItems.map((fee) => (
                  <div key={fee.name}>
                    <div className="my-6 flex items-center justify-between gap-4">
                      <p>{fee.name}</p>
                      <p>{formatCurrency(fee.amount)}</p>
                    </div>
                    <Separator />
                  </div>
                ))
              ) : (
                <p className="mt-6 text-sm text-muted-foreground">
                  No fee line items yet. Admin can set them on the student
                  fees record.
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-3">
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
                <ShieldAlert className="mt-0.5 size-4 shrink-0" />
                <p>
                  <strong>Payment placeholder.</strong> No live gateway yet
                  (Remita / Paystack can be wired later). Tapping pay creates a{" "}
                  <em>Pending</em> record with a mock RRR for testing the flow.
                </p>
              </div>
              <Button
                type="button"
                size="lg"
                disabled={!canPay || paying}
                onClick={() => void handlePayPlaceholder()}
              >
                {paying ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Starting payment…
                  </>
                ) : (
                  <>
                    <CreditCard className="size-4" />
                    Pay school fees (placeholder)
                  </>
                )}
              </Button>
              {lastRrr && (
                <p className="text-center font-mono text-sm text-muted-foreground">
                  Mock RRR: {lastRrr}
                </p>
              )}
              {!canPay && (
                <p className="text-center text-xs text-muted-foreground">
                  {data.feeStatus === "Paid"
                    ? "Fees marked as paid."
                    : "No amount due is set for this student yet."}
                </p>
              )}
            </CardFooter>
          </Card>

          <div className="grid content-start gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment history</CardTitle>
                <CardDescription>
                  Transactions from Firebase (including placeholder attempts).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>RRR</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.paymentRecords.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No payment records yet.
                        </TableCell>
                      </TableRow>
                    )}
                    {data.paymentRecords.map((record) => (
                      <TableRow key={`${record.rrr}-${record.date}`}>
                        <TableCell>{record.session}</TableCell>
                        <TableCell>{record.level}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {record.rrr}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              record.status === "Paid"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default FeesDashboard

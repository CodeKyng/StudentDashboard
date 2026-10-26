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
import { CreditCard } from "lucide-react"

function FeesDashboard() {
  const { data } = useDashboardContext()
  const formatCurrency = (amount: number | undefined) =>
    amount === undefined
      ? "Not provided"
      : new Intl.NumberFormat(
          "en-NG",
          data.currencyCode
            ? {
                style: "currency",
                currency: data.currencyCode,
                maximumFractionDigits: 2,
              }
            : { maximumFractionDigits: 2 }
        ).format(amount)

  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <TopBar />
          </div>
        </header>
        <main className="grid gap-4 p-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-2">
                <CreditCard />
                Payment Due
                {data.feeStatus && <Badge>{data.feeStatus}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-start gap-1 rounded-3xl bg-muted p-4">
                <h1 className="text-3xl font-bold">
                  {formatCurrency(data.feesDue)}
                </h1>
                <p className="mt-4">
                  {data.session ?? "Session not provided"}
                  <br />
                  {data.level ?? "Level not provided"}
                  {data.faculty ? ` · ${data.faculty}` : ""}
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
                  No fee breakdown is available in Firebase.
                </p>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Payment processing is not connected yet.
              </p>
            </CardFooter>
          </Card>
          <div className="grid content-start gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  Fee transactions and their current status.
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
                          No payment records are available in Firebase.
                        </TableCell>
                      </TableRow>
                    )}
                    {data.paymentRecords.map((record) => (
                      <TableRow key={`${record.rrr}-${record.date}`}>
                        <TableCell>{record.session}</TableCell>
                        <TableCell>{record.level}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.rrr}</TableCell>
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
            <Card>
              <CardHeader>
                <CardTitle>Scholarships</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.scholarships.length ? (
                  data.scholarships.map((scholarship) => (
                    <div key={scholarship.title}>
                      <h3 className="font-medium">{scholarship.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {scholarship.description}
                      </p>
                      <Badge variant="outline">{scholarship.status}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No scholarship records are available in Firebase.
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button disabled>
                  Scholarship applications are unavailable
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default FeesDashboard

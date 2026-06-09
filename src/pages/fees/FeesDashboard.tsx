import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CreditCard, Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

// const feesSummary = [
//   {
//     label: "Total Paid",
//     amount: "₦112,500",
//     description: "Payments completed this academic year",
//   },
//   {
//     label: "Total Due",
//     amount: "₦37,500",
//     description: "Remaining fee balance",
//   },
//   {
//     label: "Last Payment",
//     amount: "₦45,000",
//     description: "Received on May 15, 2026",
//   },
// ]

const paymentRecords = [
  {
    session: "2025/2026",
    level: "100",
    date: "2026-01-12",
    rrr: "12345678901",
    status: "Paid",
  },
  {
    session: "2025/2026",
    level: "200",
    date: "2026-05-24",
    rrr: "98765432109",
    status: "Unpaid",
  },
  {
    session: "2024/2025",
    level: "100",
    date: "2025-11-08",
    rrr: "45678912300",
    status: "Paid",
  },
]

const session = "2025/2026 Academic Session"
const level = "Level 100"
const faculty = "Faculty of Engineering"

function FeesDashboard() {
  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <TopBar />
          </div>
        </header>

        <main className="p-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex gap-2">
                  <CreditCard />
                  Payment Due <Badge />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-start gap-1 rounded-3xl bg-muted p-4">
                  <h1 className="text-3xl font-bold">₦245,000</h1>
                  <p className="mt-4">
                    {session} . <br />
                    {level} . {faculty}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <p>Tuition Fee</p>
                  <p>₦180,000</p>
                </div>
                <Separator className="my-6" />
                <div className="mt-6 flex items-center justify-between gap-4">
                  <p>Development Fee</p>
                  <p>₦30,000</p>
                </div>
                <Separator className="my-6" />
                <div className="mt-6 flex items-center justify-between gap-4">
                  <p>Library Fee</p>
                  <p>₦10,000</p>
                </div>
                <Separator className="my-6" />
                <div className="mt-6 flex items-center justify-between gap-4">
                  <p>Laboratory Fee</p>
                  <p>₦15,000</p>
                </div>
                <Separator className="my-6" />
                <div className="mt-6 flex items-center justify-between gap-4">
                  <p>Sports Levy</p>
                  <p>₦5,000</p>
                </div>
                <Separator className="my-6" />
                <div className="mt-6 flex items-center justify-between gap-4">
                  <p>Total</p>
                  <p>₦245,000</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-center gap-4">
                <Button className="p-6">
                  <CreditCard />
                  Generate Remita <br /> RRR & PAY
                </Button>
                <Button className="p-4">Download Invoice</Button>
              </CardFooter>
            </Card>
            <div className="w-full">
              <Card className="w-full rounded-3xl border border-border bg-background p-6 shadow-sm">
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    Recent fee transactions and their current status.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <Table className="w-auto">
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
                      {paymentRecords.map((record) => (
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
                <CardContent>
                    <p>No active scholarships. Apply for Bursaries below!</p>
                </CardContent>
                <CardFooter>
                    <Button><Plus />Apply for Scholarship</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default FeesDashboard

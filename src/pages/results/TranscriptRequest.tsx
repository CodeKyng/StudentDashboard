import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Check, CheckCheck, Plus, Speaker } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const title = "Library Clearance"
const description = "Cleared - No outstanding books"
const date = "24/June/2026"

const transcriptRequestMeta = [
  {
    label: "Transcript type",
    value: "Official Academic Transcript",
  },
  {
    label: "Delivery method",
    value: "Email copy or campus pickup",
  },
  {
    label: "Estimated processing",
    value: "5-10 working days",
  },
  {
    label: "Request fee",
    value: "₦3,000",
  },
]

const previousRequestInfo = [
  {
    label: "Request ID",
    value: "TR-2026-0984",
  },
  {
    label: "Status",
    value: "Collected at campus registry",
  },
  {
    label: "Collection point",
    value: "Registrar's Office, Block A",
  },
  {
    label: "Follow-up",
    value: "Allow 24 hours for email delivery confirmation.",
  },
]

function TranscriptRequest() {
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
            <Card className="flex w-full flex-col items-center justify-center">
              <CardHeader className="flex items-center gap-2">
                <Speaker />
                Request Transcript
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <p className="max-w-xl text-center text-sm text-slate-600">
                  Complete all clearance steps before submitting your transcript
                  request. Processing takes 5-10 working days. Make sure your
                  financial, library, and departmental clearances are up to date
                  for faster approval.
                </p>
                <Separator className="my-6 w-full" />
                <div className="flex w-full flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <Check className="mt-1 text-green-600" />
                    <div className="flex flex-col">
                      <span className="font-medium">{title}</span>
                      <span className="text-sm text-slate-600">
                        {description}
                      </span>
                    </div>
                    <CheckCheck className="ml-auto text-green-600" />
                  </div>
                  <div className="grid w-full gap-2 sm:grid-cols-2">
                    {transcriptRequestMeta.map((item) => (
                      <div key={item.label}>
                        <p className="text-xs tracking-[0.2em] text-slate-500 uppercase">
                          {item.label}
                        </p>
                        <p className="font-medium">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex w-full flex-col items-center justify-center gap-3">
                <Button>
                  <Plus />
                  Submit Transcript Request
                </Button>
                <p className="text-xs text-slate-500">
                  Note: Choose the pickup option during request submission if
                  you need a printed copy.
                </p>
              </CardFooter>
            </Card>
            <Card className="w-full">
              <CardHeader>Previous Request</CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold">
                    Transcript request summary
                  </h4>
                  <p className="text-sm text-slate-600">
                    Submitted {date} · Official copy
                  </p>
                </div>
                <div className="grid gap-2 text-sm text-slate-700">
                  {previousRequestInfo.map((item) => (
                    <p key={item.label}>
                      <span className="font-medium">{item.label}:</span>{" "}
                      {item.value}
                    </p>
                  ))}
                </div>
                <Badge>Collected</Badge>
              </CardContent>
              <CardFooter className="text-sm text-slate-600">
                For enquiries: <br />
                <a
                  className="text-blue-600 underline"
                  href="mailto:registry@unijos.edu.ng"
                >
                  registry@unijos.edu.ng
                </a>
              </CardFooter>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default TranscriptRequest

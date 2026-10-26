import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Check, CheckCheck, Plus, Speaker } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDashboardContext } from "@/components/Auth/dashboard-context"

function TranscriptRequest() {
  const { data } = useDashboardContext()

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
                  request. Make sure your financial, library, and departmental
                  clearances are up to date.
                </p>
                <Separator className="my-6 w-full" />
                <div className="flex w-full flex-col gap-4">
                  {data.transcriptClearance ? (
                    <div className="flex items-start gap-3">
                      <Check className="mt-1 text-green-600" />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {data.transcriptClearance.title}
                        </span>
                        <span className="text-sm text-slate-600">
                          {data.transcriptClearance.description}
                        </span>
                        <span className="text-sm text-slate-600">
                          {data.transcriptClearance.date}
                        </span>
                      </div>
                      <CheckCheck className="ml-auto text-green-600" />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Clearance information is not available in Firebase.
                    </p>
                  )}
                  <div className="grid w-full gap-2 sm:grid-cols-2">
                    {data.transcriptRequestMeta.map((item) => (
                      <div key={item.label}>
                        <p className="text-xs tracking-[0.2em] text-slate-500 uppercase">
                          {item.label}
                        </p>
                        <p className="font-medium">{item.value}</p>
                      </div>
                    ))}
                    {data.transcriptRequestMeta.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Transcript request details are not available in
                        Firebase.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex w-full flex-col items-center justify-center gap-3">
                <Button disabled>
                  <Plus />
                  Transcript requests are unavailable
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
                {data.previousTranscriptRequest ? (
                  <>
                    <div>
                      <h4 className="text-lg font-semibold">
                        Transcript request summary
                      </h4>
                      <p className="text-sm text-slate-600">
                        Submitted {data.previousTranscriptRequest.date} ·{" "}
                        {data.previousTranscriptRequest.type}
                      </p>
                    </div>
                    <div className="grid gap-2 text-sm text-slate-700">
                      {data.previousTranscriptRequest.info.map((item) => (
                        <p key={item.label}>
                          <span className="font-medium">{item.label}:</span>{" "}
                          {item.value}
                        </p>
                      ))}
                    </div>
                    <Badge>{data.previousTranscriptRequest.status}</Badge>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No previous transcript request is available in Firebase.
                  </p>
                )}
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

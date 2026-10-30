import { useCallback, useEffect, useState, type FormEvent } from "react"
import { Copy, Link2, Mail, Trash2, UserPlus } from "lucide-react"
import { toast } from "sonner"

import { useDashboardContext } from "@/components/Auth/dashboard-context"
import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getAuthErrorMessage } from "@/lib/auth"
import { sendParentMagicLink } from "@/lib/parent-auth"
import {
  createParentInvite,
  inviteJoinUrl,
  listGuardiansForStudent,
  listStudentInvites,
  revokeParentInvite,
  type ParentInvite,
  type ParentLink,
} from "@/lib/parent-invites"

export default function GuardiansPage() {
  const { profile } = useDashboardContext()
  const [email, setEmail] = useState("")
  const [invites, setInvites] = useState<ParentInvite[]>([])
  const [links, setLinks] = useState<ParentLink[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [lastUrl, setLastUrl] = useState("")
  const [lastEmail, setLastEmail] = useState("")

  const load = useCallback(async () => {
    if (profile.role !== "Student") {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const [inv, gu] = await Promise.all([
        listStudentInvites(profile.uid),
        listGuardiansForStudent(profile.uid),
      ])
      setInvites(inv)
      setLinks(gu)
    } catch (err) {
      toast.error(getAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [profile.role, profile.uid])

  useEffect(() => {
    void load()
  }, [load])

  async function handleInvite(event: FormEvent) {
    event.preventDefault()
    setSending(true)
    setLastUrl("")
    setLastEmail("")
    try {
      const { invite, joinUrl } = await createParentInvite({
        studentUid: profile.uid,
        studentName: profile.displayName,
        guardianEmail: email,
      })

      // Passwordless: Firebase emails a sign-in link that opens the join URL
      try {
        await sendParentMagicLink(invite.guardianEmail, joinUrl)
        toast.success(`Sign-in link emailed to ${invite.guardianEmail}`)
      } catch (mailErr) {
        // Invite still created — student can share the URL manually
        toast.message(
          `Invite created. Email send failed (${getAuthErrorMessage(mailErr)}). Copy the link below and share it.`
        )
      }

      setLastUrl(joinUrl)
      setLastEmail(invite.guardianEmail)
      setEmail("")
      await load()
    } catch (err) {
      toast.error(getAuthErrorMessage(err))
    } finally {
      setSending(false)
    }
  }

  async function resendMagic(invite: ParentInvite) {
    try {
      await sendParentMagicLink(invite.guardianEmail, inviteJoinUrl(invite.id))
      toast.success(`Sign-in link resent to ${invite.guardianEmail}`)
    } catch (err) {
      toast.error(getAuthErrorMessage(err))
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Invite link copied.")
    } catch {
      toast.error("Could not copy. Select the link manually.")
    }
  }

  async function handleRevoke(id: string) {
    try {
      await revokeParentInvite(id, profile.uid)
      toast.success("Invite revoked.")
      await load()
    } catch (err) {
      toast.error(getAuthErrorMessage(err))
    }
  }

  if (profile.role !== "Student") {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">
          Only students can invite guardians.
        </p>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center border-b">
          <TopBar title="Guardians" />
        </header>
        <div className="space-y-6 p-4 md:p-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Parent / guardian invites
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter a guardian email. We send them a passwordless sign-in link
              (no account password). When they open the email link they see your
              academic details only.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="size-4" />
                Invite a guardian
              </CardTitle>
              <CardDescription>
                Passwordless email link · valid 14 days · locked to this email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="flex flex-col gap-3 sm:flex-row sm:items-end"
                onSubmit={handleInvite}
              >
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="guardian-email">Guardian email</Label>
                  <Input
                    id="guardian-email"
                    type="email"
                    required
                    placeholder="parent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={sending}>
                  <Mail className="size-4" />
                  {sending ? "Sending…" : "Send sign-in link"}
                </Button>
              </form>
              {lastUrl && (
                <div className="mt-4 space-y-2 rounded-lg border bg-muted/40 p-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Email sent to {lastEmail}. Backup link (optional share):
                  </p>
                  <p className="break-all font-mono text-sm">{lastUrl}</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => void copyUrl(lastUrl)}
                  >
                    <Copy className="size-3.5" />
                    Copy link
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="size-4" />
                Linked guardians
              </CardTitle>
              <CardDescription>
                {loading
                  ? "Loading…"
                  : `${links.length} linked · ${invites.length} invite(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {links.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          className="text-center text-muted-foreground"
                        >
                          No guardians linked yet.
                        </TableCell>
                      </TableRow>
                    )}
                    {links.map((g) => (
                      <TableRow key={g.id}>
                        <TableCell className="font-medium">
                          {g.parentName}
                        </TableCell>
                        <TableCell>{g.parentEmail}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Pending / past invites</h3>
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead className="w-48">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invites.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center text-muted-foreground"
                          >
                            No invites yet.
                          </TableCell>
                        </TableRow>
                      )}
                      {invites.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-mono text-sm">
                            {inv.guardianEmail}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{inv.status}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {inv.expiresAt
                              ? new Date(inv.expiresAt).toLocaleDateString()
                              : "—"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {inv.status === "pending" && (
                                <>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => void resendMagic(inv)}
                                  >
                                    <Mail className="size-3.5" />
                                    Resend
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      void copyUrl(inviteJoinUrl(inv.id))
                                    }
                                  >
                                    <Copy className="size-3.5" />
                                    Copy
                                  </Button>
                                  <Button
                                    type="button"\tableofcontents type="icon"
                                    variant="ghost"
                                    aria-label="Revoke"
                                    onClick={() => void handleRevoke(inv.id)}
                                  >
                                    <Trash2 className="size-4 text-destructive" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

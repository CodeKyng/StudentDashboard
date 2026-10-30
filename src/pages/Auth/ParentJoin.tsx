import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getAuthErrorMessage } from "@/lib/auth"
import {
  completeParentEmailLink,
  isParentEmailLink,
  sendParentMagicLink,
  storeEmailForLink,
} from "@/lib/parent-auth"
import {
  acceptParentInvite,
  getParentInvite,
  inviteIsUsable,
  inviteJoinUrl,
  type ParentInvite,
} from "@/lib/parent-invites"

export default function ParentJoinPage() {
  const [params] = useSearchParams()
  const token = (params.get("token") ?? "").trim()
  const navigate = useNavigate()

  const [invite, setInvite] = useState<ParentInvite | null>(null)
  const [loadError, setLoadError] = useState("")
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)
  const [statusMsg, setStatusMsg] = useState("")
  const [linkSent, setLinkSent] = useState(false)

  const loadInvite = useCallback(async () => {
    if (!token) {
      setLoadError("This page needs a valid invite link from a student.")
      setLoading(false)
      return
    }
    setLoading(true)
    setLoadError("")
    try {
      const data = await getParentInvite(token)
      if (!data) {
        setLoadError("Invite not found. Ask the student to send a new link.")
        setInvite(null)
        return
      }
      const usable = inviteIsUsable(data)
      if (!usable.ok && data.status !== "accepted") {
        setLoadError(usable.reason)
        setInvite(data)
        return
      }
      setInvite(data)
    } catch (err) {
      setLoadError(getAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    void loadInvite()
  }, [loadInvite])

  /** Complete Firebase email-link sign-in when arriving from the magic email. */
  useEffect(() => {
    if (!token || loading || !invite) return
    if (!isParentEmailLink()) return

    let active = true
    async function finishFromEmail() {
      setWorking(true)
      setStatusMsg("Signing you in…")
      try {
        storeEmailForLink(invite!.guardianEmail)
        const { profile } = await completeParentEmailLink({
          email: invite!.guardianEmail,
          displayName: "Guardian",
        })
        if (!active) return
        setStatusMsg("Linking to student…")
        await acceptParentInvite({
          token,
          parentUid: profile.uid,
          parentEmail: profile.email,
          parentName: profile.displayName,
        })
        if (!active) return
        toast.success(`Connected to ${invite!.studentName}`)
        navigate("/parent", { replace: true })
      } catch (err) {
        if (!active) return
        setLoadError(getAuthErrorMessage(err))
        setWorking(false)
        setStatusMsg("")
      }
    }
    void finishFromEmail()
    return () => {
      active = false
    }
  }, [token, loading, invite, navigate])

  async function handleSendMagicLink() {
    if (!invite) return
    setWorking(true)
    setLoadError("")
    setStatusMsg("")
    try {
      const continueUrl = inviteJoinUrl(token)
      await sendParentMagicLink(invite.guardianEmail, continueUrl)
      setLinkSent(true)
      toast.success(`Sign-in link sent to ${invite.guardianEmail}`)
    } catch (err) {
      setLoadError(getAuthErrorMessage(err))
    } finally {
      setWorking(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Checking invite…</p>
      </div>
    )
  }

  if (loadError && !invite) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid invite</CardTitle>
            <CardDescription>{loadError}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link to="/">Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Guardian access</CardTitle>
          <CardDescription>
            {invite
              ? `Invited by ${invite.studentName} · ${invite.guardianEmail}`
              : "Student invite"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadError && (
            <p className="text-sm text-destructive" role="alert">
              {loadError}
            </p>
          )}

          {working && statusMsg && (
            <p className="text-sm text-muted-foreground">{statusMsg}</p>
          )}

          {invite && !working && (
            <>
              <p className="text-sm text-muted-foreground">
                No password needed. Open the magic link in the email sent to{" "}
                <span className="font-medium text-foreground">
                  {invite.guardianEmail}
                </span>{" "}
                to view this student&apos;s academic details.
              </p>

              {linkSent ? (
                <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                  <p className="font-medium">Check your inbox</p>
                  <p className="mt-1 text-muted-foreground">
                    We sent a sign-in link to {invite.guardianEmail}. Open it on
                    this device to enter the guardian portal. The link expires
                    with the invite.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-3"
                    disabled={working}
                    onClick={() => void handleSendMagicLink()}
                  >
                    Resend link
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  className="w-full"
                  disabled={working || Boolean(loadError)}
                  onClick={() => void handleSendMagicLink()}
                >
                  Email me a sign-in link
                </Button>
              )}

              <p className="text-xs text-muted-foreground">
                If the student already sent the Firebase email from their
                Guardians page, open that message instead — no extra step needed.
              </p>
            </>
          )}

          <p className="text-center text-sm text-muted-foreground">
            <Link to="/" className="underline underline-offset-4">
              Home
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

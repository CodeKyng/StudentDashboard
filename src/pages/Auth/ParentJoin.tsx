import { useCallback, useEffect, useState, type FormEvent } from "react"
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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  getAuthErrorMessage,
  getUserProfile,
  registerWithEmail,
  signInWithEmail,
} from "@/lib/auth"
import { auth } from "@/lib/firebase"
import {
  acceptParentInvite,
  getParentInvite,
  inviteIsUsable,
  type ParentInvite,
} from "@/lib/parent-invites"

type Mode = "register" | "sign-in"

export default function ParentJoinPage() {
  const [params] = useSearchParams()
  const token = (params.get("token") ?? "").trim()
  const navigate = useNavigate()

  const [invite, setInvite] = useState<ParentInvite | null>(null)
  const [loadError, setLoadError] = useState("")
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<Mode>("register")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

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
      if (!usable.ok) {
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

  async function finishLink(
    parentUid: string,
    parentEmail: string,
    parentName: string
  ) {
    await acceptParentInvite({
      token,
      parentUid,
      parentEmail,
      parentName,
    })
    toast.success(`Linked to ${invite?.studentName ?? "student"}.`)
    navigate("/parent", { replace: true })
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!invite) return
    setError("")
    const formData = new FormData(event.currentTarget)
    const displayName = String(formData.get("name")).trim()
    const email = String(formData.get("email")).trim().toLowerCase()
    const password = String(formData.get("password"))
    const confirmPassword = String(formData.get("confirm-password"))

    if (!displayName) {
      setError("Enter your full name.")
      return
    }
    if (email !== invite.guardianEmail) {
      setError(`Use the invited email: ${invite.guardianEmail}`)
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setSubmitting(true)
    try {
      const user = await registerWithEmail(email, password, displayName, "Parent")
      await finishLink(user.uid, email, displayName)
    } catch (err) {
      const message = getAuthErrorMessage(err)
      if (message.toLowerCase().includes("already exists")) {
        setMode("sign-in")
        setError(
          "An account already exists for this email. Sign in to link this student — a new account will not be created."
        )
      } else {
        setError(message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!invite) return
    setError("")
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email")).trim().toLowerCase()
    const password = String(formData.get("password"))

    if (email !== invite.guardianEmail) {
      setError(`Sign in with the invited email: ${invite.guardianEmail}`)
      return
    }

    setSubmitting(true)
    try {
      const profile = await signInWithEmail(email, password)
      if (profile.role !== "Parent") {
        setError(
          "This email belongs to a non-parent account. Use the guardian email from the invite, or contact support."
        )
        return
      }
      await finishLink(profile.uid, profile.email, profile.displayName)
    } catch (err) {
      setError(getAuthErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleAcceptWhileSignedIn() {
    if (!invite) return
    const user = auth.currentUser
    if (!user?.email) {
      setError("Sign in first, then accept this invite.")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      const profile = await getUserProfile(user.uid)
      if (!profile || profile.role !== "Parent") {
        setError("Only a Parent account can accept this invite.")
        return
      }
      await finishLink(profile.uid, profile.email, profile.displayName)
    } catch (err) {
      setError(getAuthErrorMessage(err))
    } finally {
      setSubmitting(false)
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
              <Link to="/login">Go to sign in</Link>
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
          <CardTitle>Parent / guardian access</CardTitle>
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

          {invite && !loadError && (
            <>
              <p className="text-sm text-muted-foreground">
                Parents cannot self-register on the public signup page. This
                link ties your account to this student. If you already have a
                parent account, sign in — you will be linked without creating a
                second account.
              </p>

              {auth.currentUser?.email?.toLowerCase() ===
                invite.guardianEmail && (
                <Button
                  type="button"
                  className="w-full"
                  disabled={submitting}
                  onClick={() => void handleAcceptWhileSignedIn()}
                >
                  {submitting ? "Linking…" : "Accept invite with current session"}
                </Button>
              )}

              <div className="flex gap-2 text-sm">
                <button
                  type="button"
                  className={
                    mode === "register"
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground underline-offset-4 hover:underline"
                  }
                  onClick={() => {
                    setMode("register")
                    setError("")
                  }}
                >
                  Create parent account
                </button>
                <span className="text-muted-foreground">·</span>
                <button
                  type="button"
                  className={
                    mode === "sign-in"
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground underline-offset-4 hover:underline"
                  }
                  onClick={() => {
                    setMode("sign-in")
                    setError("")
                  }}
                >
                  Sign in to link
                </button>
              </div>

              {mode === "register" ? (
                <form className="flex flex-col gap-4" onSubmit={handleRegister}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="name">Full name</FieldLabel>
                      <Input id="name" name="name" required autoComplete="name" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        defaultValue={invite.guardianEmail}
                        readOnly
                        className="bg-muted"
                      />
                      <FieldDescription>
                        Locked to the email the student invited.
                      </FieldDescription>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        minLength={8}
                        autoComplete="new-password"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="confirm-password">
                        Confirm password
                      </FieldLabel>
                      <Input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        required
                        minLength={8}
                        autoComplete="new-password"
                      />
                    </Field>
                  </FieldGroup>
                  {error && (
                    <p className="text-sm text-destructive" role="alert">
                      {error}
                    </p>
                  )}
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Creating…" : "Create account & link"}
                  </Button>
                </form>
              ) : (
                <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="email-in">Email</FieldLabel>
                      <Input
                        id="email-in"
                        name="email"
                        type="email"
                        required
                        defaultValue={invite.guardianEmail}
                        readOnly
                        className="bg-muted"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="password-in">Password</FieldLabel>
                      <Input
                        id="password-in"
                        name="password"
                        type="password"
                        required
                        autoComplete="current-password"
                      />
                    </Field>
                  </FieldGroup>
                  {error && (
                    <p className="text-sm text-destructive" role="alert">
                      {error}
                    </p>
                  )}
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Linking…" : "Sign in & link student"}
                  </Button>
                </form>
              )}
            </>
          )}

          <p className="text-center text-sm text-muted-foreground">
            <Link to="/login" className="underline underline-offset-4">
              Regular sign in
            </Link>
            {" · "}
            <Link to="/" className="underline underline-offset-4">
              Home
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

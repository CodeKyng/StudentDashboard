import { useState, type FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  IncompleteProfileError,
  completeIncompleteProfile,
  getAuthErrorMessage,
  signInWithEmail,
  signOutUser,
  type SelfAssignableRole,
} from "@/lib/auth"
import { homePathForRole, pathForRole } from "@/lib/roles"
import { cn } from "@/lib/utils"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [needsProfile, setNeedsProfile] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [role, setRole] = useState<SelfAssignableRole>("Student")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email")).trim()
    const password = String(formData.get("password"))

    try {
      const profile = await signInWithEmail(email, password)
      const from = location.state?.from?.pathname
      navigate(pathForRole(profile.role, typeof from === "string" ? from : undefined), {
        replace: true,
      })
    } catch (submitError) {
      if (submitError instanceof IncompleteProfileError) {
        setNeedsProfile(true)
        setError("")
        setDisplayName("")
      } else {
        setError(getAuthErrorMessage(submitError))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCompleteProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    const name = displayName.trim()
    if (!name) {
      setError("Enter your full name to finish setup.")
      return
    }

    setIsSubmitting(true)
    try {
      const profile = await completeIncompleteProfile(name, role)
      navigate(homePathForRole(profile.role), { replace: true })
    } catch (completeError) {
      setError(getAuthErrorMessage(completeError))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCancelComplete() {
    setIsSubmitting(true)
    try {
      await signOutUser()
    } finally {
      setNeedsProfile(false)
      setError("")
      setIsSubmitting(false)
    }
  }

  if (needsProfile) {
    return (
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={handleCompleteProfile}
        {...props}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Finish account setup</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Your login worked, but the profile document is missing. Complete
              the fields below to continue.
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="complete-name">Full Name</FieldLabel>
            <Input
              id="complete-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              type="text"
              placeholder="John Doe"
              required
              autoComplete="name"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="complete-role">Account type</FieldLabel>
            <select
              id="complete-role"
              value={role}
              onChange={(event) => {
                const value = event.target.value
                if (
                  value === "Staff" ||
                  value === "Student" ||
                  value === "Parent"
                ) {
                  setRole(value)
                }
              }}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="Student">Student</option>
              <option value="Staff">Staff</option>
              <option value="Parent">Parent</option>
            </select>
          </Field>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Field className="gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving profile..." : "Complete setup"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={handleCancelComplete}
            >
              Cancel and sign out
            </Button>
          </Field>
        </FieldGroup>
      </form>
    )
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            autoComplete="email"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </Field>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}

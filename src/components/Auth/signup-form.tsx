import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getAuthErrorMessage, registerWithEmail } from "@/lib/auth"
import { homePathForRole } from "@/lib/roles"
import { cn } from "@/lib/utils"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    const formData = new FormData(event.currentTarget)
    const displayName = String(formData.get("name")).trim()
    const email = String(formData.get("email")).trim()
    const password = String(formData.get("password"))
    const confirmPassword = String(formData.get("confirm-password"))

    if (!displayName) {
      setError("Enter your full name.")
      return
    }

    if (password.length < 8) {
      setError("Your password must be at least 8 characters long.")
      return
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.")
      return
    }

    setIsSubmitting(true)
    try {
      // Public signup is always Student. Admin promotes to Staff/Admin later.
      // Parent accounts are invite-only via student guardian links.
      await registerWithEmail(email, password, displayName, "Student")
      navigate(homePathForRole("Student"), { replace: true })
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Sign up as a student. Staff and admin access are assigned by the
            university administration.
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
            autoComplete="name"
            className="bg-background"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            autoComplete="email"
            className="bg-background"
          />
          <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email with
            anyone else.
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
            className="bg-background"
          />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="bg-background"
          />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        <FieldDescription className="rounded-lg border bg-muted/40 px-3 py-2 text-left text-xs">
          Parent / guardian accounts are invite-only: a student must send a
          guardian link. Staff and Admin roles are granted by an administrator
          after signup.
        </FieldDescription>
        {error && (
          <div className="space-y-1" role="alert">
            <p className="text-sm text-destructive">{error}</p>
            {error.includes("already exists") && (
              <p className="text-sm text-muted-foreground">
                <Link to="/login" className="underline underline-offset-4">
                  Go to Sign in
                </Link>
              </p>
            )}
          </div>
        )}
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
          <FieldDescription className="px-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="underline underline-offset-4">
              Sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}

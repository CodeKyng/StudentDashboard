import type { UserRole } from "@/lib/auth"

export function isOperator(role: UserRole) {
  return role === "Admin" || role === "Staff"
}

export function homePathForRole(role: UserRole) {
  return isOperator(role) ? "/admin" : "/dashboard"
}

export function pathForRole(role: UserRole, requested?: string) {
  const home = homePathForRole(role)
  if (!requested || !requested.startsWith("/")) return home
  if (requested.startsWith("/admin")) return isOperator(role) ? requested : home
  if (isOperator(role)) return home
  return requested
}

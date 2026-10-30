import type { UserRole } from "@/lib/auth"

export function isOperator(role: UserRole) {
  return role === "Admin" || role === "Staff"
}

export function homePathForRole(role: UserRole) {
  if (role === "Admin") return "/admin"
  if (role === "Staff") return "/staff"
  if (role === "Parent") return "/parent"
  return "/dashboard"
}

export function pathForRole(role: UserRole, requested?: string) {
  const home = homePathForRole(role)
  if (!requested || !requested.startsWith("/")) return home
  if (requested.startsWith("/admin")) {
    // Staff may still open admin tools; Admin stays on admin
    return isOperator(role) ? requested : home
  }
  if (requested.startsWith("/staff")) {
    return isOperator(role) ? requested : home
  }
  if (requested.startsWith("/parent")) return role === "Parent" ? requested : home
  if (isOperator(role)) return home
  if (role === "Parent") return home
  return requested
}

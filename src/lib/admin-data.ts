import { collection, doc, getDocs, setDoc } from "firebase/firestore"

import type { UserProfile, UserRole } from "@/lib/auth"
import { userRoles } from "@/lib/auth"
import type { DashboardData } from "@/lib/dashboard-data"
import { db } from "@/lib/firebase"

function isUserRole(role: unknown): role is UserRole {
  return (userRoles as readonly unknown[]).includes(role)
}

export async function listDirectory(): Promise<UserProfile[]> {
  const snapshot = await getDocs(collection(db, "users"))
  const users: UserProfile[] = []

  snapshot.forEach((item) => {
    const data = item.data()
    if (
      typeof data.email !== "string" ||
      typeof data.displayName !== "string" ||
      !isUserRole(data.role)
    ) {
      return
    }

    users.push({
      uid: item.id,
      email: data.email,
      displayName: data.displayName,
      role: data.role,
    })
  })

  return users.sort((left, right) =>
    left.displayName.localeCompare(right.displayName)
  )
}

function containsBadNumber(value: unknown): boolean {
  if (typeof value === "number") return !Number.isFinite(value)
  if (Array.isArray(value)) return value.some(containsBadNumber)
  if (typeof value === "object" && value !== null) {
    return Object.values(value).some(containsBadNumber)
  }
  return false
}

export async function saveStudentDashboard(
  uid: string,
  data: DashboardData
): Promise<void> {
  if (containsBadNumber(data)) {
    throw new Error("Enter valid numbers before saving this record.")
  }

  await setDoc(
    doc(db, "dashboardData", uid),
    JSON.parse(JSON.stringify(data)) as Record<string, unknown>
  )
}

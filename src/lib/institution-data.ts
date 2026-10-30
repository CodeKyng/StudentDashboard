import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore"

import type { UserRole } from "@/lib/auth"
import { db } from "@/lib/firebase"

export interface Faculty {
  id: string
  name: string
  code: string
  description: string
}

export interface Department {
  id: string
  name: string
  code: string
  facultyId: string
  facultyName: string
  description: string
}

export interface InstitutionCourse {
  id: string
  code: string
  title: string
  description: string
  units: number
  level: string
  semester: string
  departmentId: string
  departmentName: string
  facultyId: string
  facultyName: string
  prerequisites: string[]
}

export interface StudentDirectoryEntry {
  uid: string
  email: string
  displayName: string
  role: string
  matricNumber?: string
  facultyId?: string
  facultyName?: string
  departmentId?: string
  departmentName?: string
  level?: string
  session?: string
}

/** Roles an Admin may assign from the directory (Parent stays invite-only). */
export const assignableRoles = ["Student", "Staff", "Admin"] as const
export type AssignableRole = (typeof assignableRoles)[number]

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === "string")
}

export async function listFaculties(): Promise<Faculty[]> {
  const snapshot = await getDocs(collection(db, "faculties"))
  const items: Faculty[] = []
  snapshot.forEach((item) => {
    const data = item.data()
    items.push({
      id: item.id,
      name: asString(data.name),
      code: asString(data.code),
      description: asString(data.description),
    })
  })
  return items.sort((a, b) => a.name.localeCompare(b.name))
}

export async function saveFaculty(faculty: Faculty): Promise<void> {
  const id = faculty.id || faculty.code.trim().toUpperCase().replace(/\s+/g, "-")
  if (!id) throw new Error("Faculty needs a code or id.")
  await setDoc(
    doc(db, "faculties", id),
    {
      name: faculty.name.trim(),
      code: faculty.code.trim().toUpperCase(),
      description: faculty.description.trim(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export async function deleteFaculty(id: string): Promise<void> {
  await deleteDoc(doc(db, "faculties", id))
}

export async function listDepartments(): Promise<Department[]> {
  const snapshot = await getDocs(collection(db, "departments"))
  const items: Department[] = []
  snapshot.forEach((item) => {
    const data = item.data()
    items.push({
      id: item.id,
      name: asString(data.name),
      code: asString(data.code),
      facultyId: asString(data.facultyId),
      facultyName: asString(data.facultyName),
      description: asString(data.description),
    })
  })
  return items.sort((a, b) => a.name.localeCompare(b.name))
}

export async function saveDepartment(department: Department): Promise<void> {
  const id =
    department.id ||
    department.code.trim().toUpperCase().replace(/\s+/g, "-")
  if (!id) throw new Error("Department needs a code or id.")
  await setDoc(
    doc(db, "departments", id),
    {
      name: department.name.trim(),
      code: department.code.trim().toUpperCase(),
      facultyId: department.facultyId,
      facultyName: department.facultyName.trim(),
      description: department.description.trim(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export async function deleteDepartment(id: string): Promise<void> {
  await deleteDoc(doc(db, "departments", id))
}

export async function listInstitutionCourses(): Promise<InstitutionCourse[]> {
  const snapshot = await getDocs(collection(db, "courses"))
  const items: InstitutionCourse[] = []
  snapshot.forEach((item) => {
    const data = item.data()
    items.push({
      id: item.id,
      code: asString(data.code),
      title: asString(data.title),
      description: asString(data.description),
      units: asNumber(data.units),
      level: asString(data.level),
      semester: asString(data.semester),
      departmentId: asString(data.departmentId),
      departmentName: asString(data.departmentName),
      facultyId: asString(data.facultyId),
      facultyName: asString(data.facultyName),
      prerequisites: asStringArray(data.prerequisites),
    })
  })
  return items.sort((a, b) => a.code.localeCompare(b.code))
}

export async function saveInstitutionCourse(
  course: InstitutionCourse
): Promise<void> {
  const id =
    course.id || course.code.trim().toUpperCase().replace(/\s+/g, "-")
  if (!id) throw new Error("Course needs a code or id.")
  if (!course.units || course.units < 1) {
    throw new Error("Course credit units must be at least 1.")
  }
  await setDoc(
    doc(db, "courses", id),
    {
      code: course.code.trim().toUpperCase(),
      title: course.title.trim(),
      description: course.description.trim(),
      units: Number(course.units) || 0,
      level: course.level.trim(),
      semester: course.semester.trim(),
      departmentId: course.departmentId,
      departmentName: course.departmentName.trim(),
      facultyId: course.facultyId,
      facultyName: course.facultyName.trim(),
      prerequisites: course.prerequisites,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export async function deleteInstitutionCourse(id: string): Promise<void> {
  await deleteDoc(doc(db, "courses", id))
}

export async function listStudentsWithMatric(): Promise<StudentDirectoryEntry[]> {
  const snapshot = await getDocs(collection(db, "users"))
  const items: StudentDirectoryEntry[] = []
  snapshot.forEach((item) => {
    const data = item.data()
    if (typeof data.email !== "string" || typeof data.displayName !== "string") {
      return
    }
    items.push({
      uid: item.id,
      email: data.email,
      displayName: data.displayName,
      role: asString(data.role, "Student"),
      matricNumber: asString(data.matricNumber) || undefined,
      facultyId: asString(data.facultyId) || undefined,
      facultyName: asString(data.facultyName) || undefined,
      departmentId: asString(data.departmentId) || undefined,
      departmentName: asString(data.departmentName) || undefined,
      level: asString(data.level) || undefined,
      session: asString(data.session) || undefined,
    })
  })
  return items.sort((a, b) => a.displayName.localeCompare(b.displayName))
}

export async function assignStudentIdentity(
  uid: string,
  payload: {
    matricNumber?: string
    facultyId?: string
    facultyName?: string
    departmentId?: string
    departmentName?: string
    level?: string
    session?: string
  }
): Promise<void> {
  const clean: Record<string, string> = {}
  if (payload.matricNumber !== undefined) {
    clean.matricNumber = payload.matricNumber.trim().toUpperCase()
  }
  if (payload.facultyId !== undefined) clean.facultyId = payload.facultyId
  if (payload.facultyName !== undefined) {
    clean.facultyName = payload.facultyName.trim()
  }
  if (payload.departmentId !== undefined) {
    clean.departmentId = payload.departmentId
  }
  if (payload.departmentName !== undefined) {
    clean.departmentName = payload.departmentName.trim()
  }
  if (payload.level !== undefined) clean.level = payload.level.trim()
  if (payload.session !== undefined) clean.session = payload.session.trim()

  await updateDoc(doc(db, "users", uid), {
    ...clean,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Admin-only role change. Parent is never assigned here (invite link only).
 */
export async function assignUserRole(
  uid: string,
  role: AssignableRole
): Promise<void> {
  if (!(assignableRoles as readonly string[]).includes(role)) {
    throw new Error("Invalid role. Choose Student, Staff, or Admin.")
  }
  await updateDoc(doc(db, "users", uid), {
    role: role as UserRole,
    updatedAt: serverTimestamp(),
  })
}

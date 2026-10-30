import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore"

import { db } from "@/lib/firebase"

export interface UnitLimit {
  id: string
  facultyId: string
  facultyName: string
  departmentId: string
  departmentName: string
  level: string
  maxUnits: number
}

const DEFAULT_MAX_UNITS = 18

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

export function unitLimitId(
  facultyId: string,
  departmentId: string,
  level: string
): string {
  const f = facultyId.trim() || "any"
  const d = departmentId.trim() || "any"
  const l = level.trim().toUpperCase().replace(/\s+/g, "") || "any"
  return `${f}_${d}_${l}`
}

export async function listUnitLimits(): Promise<UnitLimit[]> {
  const snap = await getDocs(collection(db, "unitLimits"))
  const items: UnitLimit[] = []
  snap.forEach((item) => {
    const data = item.data()
    items.push({
      id: item.id,
      facultyId: asString(data.facultyId),
      facultyName: asString(data.facultyName),
      departmentId: asString(data.departmentId),
      departmentName: asString(data.departmentName),
      level: asString(data.level),
      maxUnits: asNumber(data.maxUnits, DEFAULT_MAX_UNITS),
    })
  })
  return items.sort(
    (a, b) =>
      a.facultyName.localeCompare(b.facultyName) ||
      a.departmentName.localeCompare(b.departmentName) ||
      a.level.localeCompare(b.level)
  )
}

export async function saveUnitLimit(limit: Omit<UnitLimit, "id"> & { id?: string }): Promise<void> {
  if (!limit.departmentId) throw new Error("Department is required.")
  if (!limit.level.trim()) throw new Error("Level is required.")
  const maxUnits = Number(limit.maxUnits)
  if (!Number.isFinite(maxUnits) || maxUnits < 1) {
    throw new Error("Max units must be at least 1.")
  }
  const id =
    limit.id ||
    unitLimitId(limit.facultyId, limit.departmentId, limit.level)
  await setDoc(
    doc(db, "unitLimits", id),
    {
      facultyId: limit.facultyId,
      facultyName: limit.facultyName.trim(),
      departmentId: limit.departmentId,
      departmentName: limit.departmentName.trim(),
      level: limit.level.trim(),
      maxUnits,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export async function deleteUnitLimit(id: string): Promise<void> {
  await deleteDoc(doc(db, "unitLimits", id))
}

/** Resolve max units for a student placement. Falls back to 18 if unset. */
export async function getMaxUnitsForPlacement(input: {
  facultyId?: string
  departmentId?: string
  level?: string
}): Promise<{ maxUnits: number; matched: boolean; limit?: UnitLimit }> {
  const facultyId = input.facultyId?.trim() || ""
  const departmentId = input.departmentId?.trim() || ""
  const level = input.level?.trim() || ""

  if (departmentId && level) {
    const exactId = unitLimitId(facultyId, departmentId, level)
    const all = await listUnitLimits()
    const exact = all.find((l) => l.id === exactId)
    if (exact) return { maxUnits: exact.maxUnits, matched: true, limit: exact }

    const byDeptLevel = all.find(
      (l) =>
        l.departmentId === departmentId &&
        l.level.trim().toLowerCase() === level.toLowerCase()
    )
    if (byDeptLevel) {
      return { maxUnits: byDeptLevel.maxUnits, matched: true, limit: byDeptLevel }
    }
  }

  return { maxUnits: DEFAULT_MAX_UNITS, matched: false }
}

/** Grades treated as failed (must re-register). */
export function isFailedGrade(grade: string | undefined): boolean {
  if (!grade) return false
  const g = grade.trim().toUpperCase()
  return g === "F" || g === "ABS" || g === "ABSENT" || g === "INCOMPLETE"
}

export { DEFAULT_MAX_UNITS }

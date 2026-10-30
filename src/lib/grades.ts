import type { SemesterResult } from "@/lib/dashboard-data"

/**
 * University of Jos style 5-point grading (percentage → letter → grade point).
 * Total score = CA + Exam (expected out of 100).
 */
export function scoreToGrade(total: number): string {
  if (!Number.isFinite(total)) return "F"
  if (total >= 70) return "A"
  if (total >= 60) return "B"
  if (total >= 50) return "C"
  if (total >= 45) return "D"
  if (total >= 40) return "E"
  return "F"
}

export function gradeToPoint(grade: string): number {
  switch (grade.trim().toUpperCase()) {
    case "A":
      return 5
    case "B":
      return 4
    case "C":
      return 3
    case "D":
      return 2
    case "E":
      return 1
    default:
      return 0
  }
}

export function totalScore(row: Pick<SemesterResult, "ca" | "exam">): number {
  const ca = Number(row.ca) || 0
  const exam = Number(row.exam) || 0
  return ca + exam
}

/** Fill grade from CA + Exam for every row. */
export function withAutoGrades(results: SemesterResult[]): SemesterResult[] {
  return results.map((row) => ({
    ...row,
    units: Number(row.units) || 0,
    ca: Number(row.ca) || 0,
    exam: Number(row.exam) || 0,
    grade: scoreToGrade(totalScore(row)),
  }))
}

/**
 * Weighted GPA for a set of course results.
 * GPA = Σ(gradePoint × units) / Σ(units)
 */
export function computeGpa(results: SemesterResult[]): number | undefined {
  const graded = withAutoGrades(results)
  let quality = 0
  let units = 0
  for (const row of graded) {
    const u = row.units
    if (u <= 0) continue
    quality += gradeToPoint(row.grade) * u
    units += u
  }
  if (units <= 0) return undefined
  return Math.round((quality / units) * 100) / 100
}

/** CGPA over all stored results (same formula as GPA when one pool of courses). */
export function computeCgpa(results: SemesterResult[]): number | undefined {
  return computeGpa(results)
}

export function formatGpa(value: number | undefined): string {
  if (value === undefined) return "—"
  return value.toFixed(2)
}

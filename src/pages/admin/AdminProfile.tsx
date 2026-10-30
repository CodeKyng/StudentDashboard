import { useCallback, useEffect, useMemo, useState } from "react"
import { IdCard, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { RecordGate } from "@/components/admin/RecordGate"
import { useAdminRecord } from "@/components/admin/admin-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getAuthErrorMessage } from "@/lib/auth"
import { gradeToPoint, computeCgpa, formatGpa, withAutoGrades } from "@/lib/grades"
import {
  listStudentsWithMatric,
  type StudentDirectoryEntry,
} from "@/lib/institution-data"

export default function AdminProfile() {
  const { selectedUid, selectedProfile, draft } = useAdminRecord()
  const [identity, setIdentity] = useState<StudentDirectoryEntry | null>(null)
  const [loadingIdentity, setLoadingIdentity] = useState(false)

  const loadIdentity = useCallback(async () => {
    if (!selectedUid) {
      setIdentity(null)
      return
    }
    setLoadingIdentity(true)
    try {
      const all = await listStudentsWithMatric()
      setIdentity(all.find((s) => s.uid === selectedUid) ?? null)
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setLoadingIdentity(false)
    }
  }, [selectedUid])

  useEffect(() => {
    void loadIdentity()
  }, [loadIdentity])

  const computed = useMemo(() => {
    if (!draft) {
      return {
        cgpa: undefined as number | undefined,
        courses: 0,
        units: 0,
        rows: [] as ReturnType<typeof withAutoGrades>,
      }
    }
    const rows = withAutoGrades(draft.results)
    const units = rows.reduce((sum, r) => sum + (Number(r.units) || 0), 0)
    return {
      cgpa: computeCgpa(draft.results),
      courses: rows.length,
      units,
      rows,
    }
  }, [draft])

  return (
    <RecordGate>
      {() => (
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Student record
              </h2>
              <p className="text-sm text-muted-foreground">
                Identity is set under Students (matric & placement). CGPA comes
                from Results automatically.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void loadIdentity()}
              disabled={loadingIdentity}
            >
              <RefreshCw className="size-4" />
              Refresh identity
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IdCard className="size-4" />
                  Identity (set on student)
                </CardTitle>
                <CardDescription>
                  Change these on the Students page (matric assignment).
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
                <Field label="Name">
                  {selectedProfile?.displayName ?? identity?.displayName ?? "—"}
                </Field>
                <Field label="Email">
                  {selectedProfile?.email ?? identity?.email ?? "—"}
                </Field>
                <Field label="Matric number">
                  {identity?.matricNumber ? (
                    <span className="font-mono font-semibold">
                      {identity.matricNumber}
                    </span>
                  ) : (
                    <span className="text-amber-600">Not assigned</span>
                  )}
                </Field>
                <Field label="Level">
                  {identity?.level || draft?.level || "—"}
                </Field>
                <Field label="Session">
                  {identity?.session || draft?.session || "—"}
                </Field>
                <Field label="Faculty">
                  {identity?.facultyName || draft?.faculty || "—"}
                </Field>
                <Field label="Department" className="sm:col-span-2">
                  {identity?.departmentName || draft?.department || "—"}
                </Field>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calculated performance</CardTitle>
                <CardDescription>
                  From Results: total = CA + Exam → grade → points × units.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="px-3 py-1 text-base">
                    CGPA: {formatGpa(computed.cgpa)}
                  </Badge>
                  <Badge variant="outline">Courses: {computed.courses}</Badge>
                  <Badge variant="outline">Total units: {computed.units}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  A=5 (70+), B=4 (60–69), C=3 (50–59), D=2 (45–49), E=1 (40–44),
                  F=0. Edit scores on Results; save from the admin bar to
                  store the calculated CGPA on the student dashboard.
                </p>
                {computed.rows.length > 0 && (
                  <div className="overflow-x-auto rounded-md border">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
                        <tr>
                          <th className="px-3 py-2">Code</th>
                          <th className="px-3 py-2">Units</th>
                          <th className="px-3 py-2">Total</th>
                          <th className="px-3 py-2">Grade</th>
                          <th className="px-3 py-2">GP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {computed.rows.map((row, i) => {
                          const total =
                            (Number(row.ca) || 0) + (Number(row.exam) || 0)
                          return (
                            <tr
                              key={`${row.code}-${i}`}
                              className="border-b last:border-0"
                            >
                              <td className="px-3 py-2 font-mono">
                                {row.code || "—"}
                              </td>
                              <td className="px-3 py-2">{row.units}</td>
                              <td className="px-3 py-2">{total}</td>
                              <td className="px-3 py-2 font-semibold">
                                {row.grade}
                              </td>
                              <td className="px-3 py-2">
                                {gradeToPoint(row.grade)}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </RecordGate>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium">{children}</p>
    </div>
  )
}

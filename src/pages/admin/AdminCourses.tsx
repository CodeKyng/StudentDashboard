import { RecordGate } from "@/components/admin/RecordGate"
import { RecordTable } from "@/components/admin/RecordTable"
import { useAdminRecord } from "@/components/admin/admin-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminCourses() {
  const { patch } = useAdminRecord()

  return (
    <RecordGate>
      {(draft) => (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled courses</CardTitle>
              <CardDescription>
                Courses shown on the student dashboard overview.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecordTable
                rows={draft.courses}
                emptyLabel="No enrolled courses yet."
                createRow={() => ({
                  code: "",
                  title: "",
                  description: "",
                  progress: 0,
                })}
                onChange={(courses) => patch({ courses })}
                columns={[
                  { key: "code", label: "Code", minWidth: "100px" },
                  { key: "title", label: "Title", minWidth: "160px" },
                  { key: "description", label: "Description", minWidth: "220px" },
                  { key: "progress", label: "Progress", kind: "number", minWidth: "90px" },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course catalog</CardTitle>
              <CardDescription>
                Catalog entries available for registration views.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecordTable
                rows={draft.courseCatalog.map((course) => ({
                  ...course,
                  prerequisites: course.prerequisites.join(", "),
                }))}
                emptyLabel="Catalog is empty."
                createRow={() => ({
                  code: "",
                  department: "",
                  departmentName: "",
                  name: "",
                  description: "",
                  prerequisites: "",
                  units: 0,
                  semester: "",
                })}
                onChange={(rows) =>
                  patch({
                    courseCatalog: rows.map((row) => ({
                      code: String(row.code ?? ""),
                      department: String(row.department ?? ""),
                      departmentName: String(row.departmentName ?? ""),
                      name: String(row.name ?? ""),
                      description: String(row.description ?? ""),
                      prerequisites: String(row.prerequisites ?? "")
                        .split(",")
                        .map((part) => part.trim())
                        .filter(Boolean),
                      units: Number(row.units) || 0,
                      semester: String(row.semester ?? ""),
                    })),
                  })
                }
                columns={[
                  { key: "code", label: "Code", minWidth: "90px" },
                  { key: "name", label: "Name", minWidth: "140px" },
                  { key: "department", label: "Dept code", minWidth: "100px" },
                  { key: "departmentName", label: "Department", minWidth: "140px" },
                  { key: "units", label: "Units", kind: "number", minWidth: "80px" },
                  { key: "semester", label: "Semester", minWidth: "100px" },
                  { key: "prerequisites", label: "Prerequisites", minWidth: "160px" },
                  { key: "description", label: "Description", minWidth: "180px" },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </RecordGate>
  )
}

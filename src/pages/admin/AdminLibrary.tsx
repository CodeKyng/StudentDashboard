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

export default function AdminLibrary() {
  const { patch } = useAdminRecord()

  return (
    <RecordGate>
      {(draft) => (
        <Card>
          <CardHeader>
            <CardTitle>Library resources</CardTitle>
            <CardDescription>e-Library items available to the student.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecordTable
              rows={draft.libraryResources}
              emptyLabel="No library resources."
              createRow={() => ({
                title: "",
                author: "",
                category: "",
                url: "",
              })}
              onChange={(libraryResources) => patch({ libraryResources })}
              columns={[
                { key: "title", label: "Title", minWidth: "160px" },
                { key: "author", label: "Author", minWidth: "140px" },
                { key: "category", label: "Category", minWidth: "120px" },
                { key: "url", label: "URL", minWidth: "200px" },
              ]}
            />
          </CardContent>
        </Card>
      )}
    </RecordGate>
  )
}

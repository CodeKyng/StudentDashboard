import { Link } from "react-router-dom"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function AdminStudents() {
  const { users, directoryStatus, directoryError, selectStudent, refreshDirectory } =
    useAdminRecord()

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>User directory</CardTitle>
          <CardDescription>
            All registered accounts. Select a student to edit their dashboard record.
          </CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => void refreshDirectory()}
          disabled={directoryStatus === "loading"}
        >
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {directoryError && (
          <p className="mb-4 text-sm text-destructive" role="alert">
            {directoryError}
          </p>
        )}
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-36">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {directoryStatus === "loading" && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Loading directory...
                  </TableCell>
                </TableRow>
              )}
              {directoryStatus === "ready" && users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
              {users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell className="font-medium">{user.displayName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      asChild
                      onClick={() => selectStudent(user.uid)}
                    >
                      <Link to={`/admin/profile?student=${encodeURIComponent(user.uid)}`}>
                        Manage
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

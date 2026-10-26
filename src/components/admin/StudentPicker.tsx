import { useAdminRecord } from "@/components/admin/admin-context"
import type { UserProfile } from "@/lib/auth"

function UserOptions({ users }: { users: UserProfile[] }) {
  return users.map((user) => (
    <option key={user.uid} value={user.uid}>
      {user.displayName} · {user.role} · {user.email}
    </option>
  ))
}

export function StudentPicker() {
  const { users, selectedUid, selectStudent, directoryStatus } =
    useAdminRecord()
  const students = users.filter(
    (user) => user.role === "Student" || user.role === "Parent"
  )
  const others = users.filter(
    (user) => user.role !== "Student" && user.role !== "Parent"
  )

  return (
    <label className="grid w-full max-w-xl gap-1.5 text-sm font-medium">
      Student record
      <select
        className="h-9 rounded-lg border border-input bg-background px-3 text-sm font-normal"
        value={selectedUid}
        disabled={directoryStatus !== "ready"}
        onChange={(event) => selectStudent(event.target.value)}
      >
        <option value="">
          {directoryStatus === "loading"
            ? "Loading directory..."
            : "Select a student"}
        </option>
        {students.length > 0 && (
          <optgroup label="Students and parents">
            <UserOptions users={students} />
          </optgroup>
        )}
        {others.length > 0 && (
          <optgroup label="Staff and admins">
            <UserOptions users={others} />
          </optgroup>
        )}
      </select>
    </label>
  )
}

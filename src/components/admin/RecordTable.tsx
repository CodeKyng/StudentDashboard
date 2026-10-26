import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function replaceAt<T>(items: T[], index: number, next: T): T[] {
  return items.map((item, itemIndex) => (itemIndex === index ? next : item))
}

export function removeAt<T>(items: T[], index: number): T[] {
  return items.filter((_, itemIndex) => itemIndex !== index)
}

export interface RecordColumn<T extends object> {
  key: keyof T & string
  label: string
  kind?: "text" | "number" | "select"
  options?: readonly string[]
  minWidth?: string
}

export function RecordTable<T extends object>({
  rows,
  columns,
  onChange,
  emptyLabel,
  createRow,
}: {
  rows: T[]
  columns: RecordColumn<T>[]
  onChange: (rows: T[]) => void
  emptyLabel: string
  createRow: () => T
}) {
  function update(
    index: number,
    key: keyof T & string,
    raw: string,
    kind?: RecordColumn<T>["kind"]
  ) {
    const current = rows[index]
    const value = kind === "number" ? Number(raw) : raw
    onChange(replaceAt(rows, index, { ...current, [key]: value }))
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  style={column.minWidth ? { minWidth: column.minWidth } : undefined}
                >
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center text-muted-foreground"
                >
                  {emptyLabel}
                </TableCell>
              </TableRow>
            )}
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => {
                  const cell = row[column.key]
                  const text =
                    cell === undefined || cell === null ? "" : String(cell)
                  return (
                    <TableCell key={column.key}>
                      {column.kind === "select" ? (
                        <select
                          aria-label={column.label}
                          className="h-8 w-full min-w-28 rounded-lg border border-input bg-background px-2 text-sm"
                          value={text}
                          onChange={(event) =>
                            update(index, column.key, event.target.value)
                          }
                        >
                          {column.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          aria-label={column.label}
                          type={column.kind === "number" ? "number" : "text"}
                          value={text}
                          onChange={(event) =>
                            update(
                              index,
                              column.key,
                              event.target.value,
                              column.kind
                            )
                          }
                        />
                      )}
                    </TableCell>
                  )
                })}
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${index + 1}`}
                    onClick={() => onChange(removeAt(rows, index))}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => onChange([...rows, createRow()])}
      >
        <Plus /> Add row
      </Button>
    </div>
  )
}

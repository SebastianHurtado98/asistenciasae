import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface User {
  name: string
  userType: string
  company: string
  event: string
  observation: string
}

interface UserTableProps {
  users: User[]
  selectedEvent: string | null
}

export function UserTable({ users, selectedEvent }: UserTableProps) {
  return (
<div className="rounded-md border-2 border-gray-300 overflow-hidden">
<Table className="w-full text-[10px] md:text-sm lg:text-base">
<TableHeader>
      <TableRow className="bg-gray-200">
        <TableHead className="w-[40px] px-1 py-1 md:px-3 md:py-2 text-center">N°</TableHead>
        <TableHead className="px-1 py-1 md:px-3 md:py-2 text-center">Nombre</TableHead>
        <TableHead className="px-1 py-1 md:px-3 md:py-2 text-center">Tipo</TableHead>
        <TableHead className="px-1 py-1 md:px-3 md:py-2 text-center">Empresa</TableHead>
        {selectedEvent === null && (
        <TableHead className="px-1 py-1 md:px-3 md:py-2 text-center">Evento</TableHead>
        )}
        <TableHead className="px-1 py-1 md:px-3 md:py-2 text-center">Obs.</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {users.map((user, index) => (
        <TableRow key={index}>
          <TableCell className="px-1 py-1 md:px-3 md:py-2  text-center">{index + 1}</TableCell>
          <TableCell className="px-1 py-1 md:px-3 md:py-2  text-center">{user.name}</TableCell>
          <TableCell className="px-1 py-1 md:px-3 md:py-2  text-center">{user.userType}</TableCell>
          <TableCell className="px-1 py-1 md:px-3 md:py-2  text-center">{user.company}</TableCell>
          {selectedEvent === null && (
          <TableCell className="px-1 py-1 md:px-3 md:py-2  text-center">{user.event}</TableCell>
          )}
          <TableCell className="px-1 py-1 md:px-3 md:py-2  text-center">
            {user.observation && (
              <span
                className={`px-1 py-0.5 md:px-2 md:py-1 rounded text-xs md:text-sm ${
                  user.observation === "A"
                    ? "bg-red-100 text-red-800"
                    : user.observation === "P"
                    ? "bg-green-100 text-green-800"
                    : user.observation === "N"
                    ? "bg-blue-100 text-blue-800"
                    : ""
                }`}
              >
                {user.observation}
              </span>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>


  )
}


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
}

export function UserTable({ users }: UserTableProps) {
  return (
    <div className="rounded-md border-2 border-gray-300 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">N°</TableHead>
            <TableHead className="text-center">Nombre Completo</TableHead>
            <TableHead className="text-center">Tipo de Usuario</TableHead>
            <TableHead className="text-center">Empresa</TableHead>
            <TableHead className="text-center">Evento</TableHead>
            <TableHead className="text-center">Observación</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium text-center">{index+1}</TableCell>
              <TableCell className="text-center">{user.name}</TableCell>
              <TableCell className="text-center">{user.userType}</TableCell>
              <TableCell className="text-center">{user.company}</TableCell>
              <TableCell className="text-center">{user.event}</TableCell>
              <TableCell className="text-center">
                {user.observation && (
                  <span
                    className={`px-2 py-1 rounded ${
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


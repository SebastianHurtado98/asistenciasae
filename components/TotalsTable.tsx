import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TotalData {
  [userType: string]: {
    [event: string]: number
  }
}

interface TotalsTableProps {
  data: TotalData
  events: string[]
}

export function TotalsTable({ data, events }: TotalsTableProps) {
  const userTypes = Object.keys(data)
  const singleEvent = events.length === 1;

  // Calcular totales por evento
  const eventTotals = events.reduce(
    (acc, event) => {
      acc[event] = userTypes.reduce((sum, userType) => sum + (data[userType][event] || 0), 0)
      return acc
    },
    {} as { [event: string]: number },
  )

  // Calcular totales por tipo de usuario
  const userTypeTotals = userTypes.reduce(
    (acc, userType) => {
      acc[userType] = events.reduce((sum, event) => sum + (data[userType][event] || 0), 0)
      return acc
    },
    {} as { [userType: string]: number },
  )

  // Calcular el gran total
  const grandTotal = Object.values(userTypeTotals).reduce((sum, total) => sum + total, 0)

  return (
    <div className="rounded-md border-2 border-gray-300 overflow-x-auto">
      <div className="text-right py-2 pr-4 bg-gray-100 text-gray-600 text-sm md:text-base">
        Nota: no incluye AC
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Tipo de Usuario / Evento</TableHead>
            {!singleEvent &&
            events.map((event) => (
              <TableHead key={event} className="text-center">
                {event}
              </TableHead>
            ))
            }
            <TableHead className="text-center">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userTypes.map((userType) => (
            <TableRow key={userType}>
              <TableCell className="font-medium text-center">{userType}</TableCell>
              {!singleEvent &&
              events.map((event) => (
                <TableCell key={event} className="text-center">
                  {data[userType][event] || 0}
                </TableCell>
              ))
              }
              <TableCell className="text-center font-medium">{userTypeTotals[userType]}</TableCell>
            </TableRow>
          ))}
          <TableRow className="border-t-2">
            <TableCell className="font-medium text-center">Total</TableCell>
            {!singleEvent &&
            events.map((event) => (
              <TableCell key={event} className="text-center font-medium">
                {eventTotals[event]}
              </TableCell>
            ))
            }
            <TableCell className="text-center font-bold">{grandTotal}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}


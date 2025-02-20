"use client"

import { useState, useMemo, useEffect } from "react"
import { UserTable } from "@/components/UserTable"
import { TotalsTable } from "@/components/TotalsTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateTotalsData } from "@/utils/generateTotalsData"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Guest = {
  name: string
  is_user: boolean
  userType: string
  company: string
  event: string
  observation: string
}

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [events, setEvents] = useState<string[]>([])
  const [users, setUsers] = useState<Guest[]>([])

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    const { data: dataActiveMacro, error: errorActiveMacro } = await supabase
    .from('active_macro')
    .select('*')
    .limit(1)
    .single();

    if (errorActiveMacro) {
      console.error('Error fetching macro_events:', errorActiveMacro)
    }

    const { data: dataEvent2, error: errorEvent2 } = await supabase
      .from('event')
      .select('id, abbreviation')
      .eq('macro_event_id', dataActiveMacro.macro_event_id)
      .order('date_hour', { ascending: true })

    console.log("dataEvent2", dataEvent2)

    if(errorEvent2){
      console.log(errorEvent2)
    }

    if (dataEvent2) {
      const eventIds = dataEvent2.map(event => event.id);
      setEvents(dataEvent2.map(event => event.abbreviation))
    
      const { data: dataEventGuest, error: errorEventGuest } = await supabase
        .from('event_guest')
        .select(`
          name, 
          company_razon_social, 
          tipo_usuario, 
          event_id, 
          guest: guest_id (
            name,
            is_user,
            company_razon_social,
            tipo_usuario,
            start_date,
            observation,
            company: company_id (razon_social)
            )
          `)
        .in('event_id', eventIds)
        .eq('registered', true)         

        if (errorEventGuest) {
          console.error('Error fetching events:', errorEventGuest);
        } else {

          const mappedGuests = dataEventGuest.map((eventGuest)=> {
            // @ts-expect-error prisa
            const userType = eventGuest.guest.tipo_usuario;

            // @ts-expect-error prisa
            const startDate = new Date(eventGuest.guest?.start_date);
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            return {
            // @ts-expect-error prisa
            name: eventGuest.guest.name,
            // @ts-expect-error prisa
            userType: userType.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
            // @ts-expect-error prisa
            company: eventGuest.company_razon_social || eventGuest.guest?.company_razon_social || eventGuest.guest?.company?.razon_social || "",
            event: dataEvent2.find(event => event.id === eventGuest.event_id)?.abbreviation || "Desconocido",
            
            
            //@ts-expect-error prisa
            observation: (eventGuest.guest?.observation && startDate >= sixMonthsAgo ) ? "N" : (eventGuest.guest?.observation ? "A" : (userType === "Free Trial" ? "P" : "")),
          }});

          const filteredGuests = mappedGuests.filter(guest => guest.userType.toLowerCase() !== "ac");

          // @ts-expect-error prisa
          setUsers(filteredGuests);
        }      
    }
  }

  const totalsData = useMemo(() => generateTotalsData(users, events), [events, users])

  const filteredUsers = selectedEvent ? users.filter((user) => user.event === selectedEvent) : users

  const filteredTotalsData = selectedEvent
    ? Object.fromEntries(
        Object.entries(totalsData).map(([userType, eventData]) => [
          userType,
          { [selectedEvent]: eventData[selectedEvent] },
        ]),
      )
    : totalsData

  const filteredEvents = selectedEvent ? [selectedEvent] : events

  console.log("events", events)

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <Image 
              src="/SAE-asistencia.jpg"
              alt="SAE Logo Azul"
              width={768}
              height={192}
              className="mb-4 w-120 sm:w-192 mx-auto"
          />
          <br></br>
        <CardTitle>SAE Especial</CardTitle>
        <CardDescription>Resumen de usuarios registrados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-2">
      <div className="mt-4"></div>
      <Table className="max-w-lg mx-auto mb-0 border border-gray-300 border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead className="border border-gray-300 bg-gray-200"></TableHead>
              {events.map((event) => (
                <TableHead key={event} className="text-center border border-gray-300 bg-gray-200">
                  {event === "Jue AM" ? "Jue AM*" : event}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
            <TableCell className="border border-gray-300">
              % de Aforo lleno
            </TableCell>
              {events.map((event) => {
                const total = Object.values(totalsData).reduce((sum, userType) => sum + (userType[event] || 0), 0)
                const percentage = ((total / 86) * 100).toFixed(0)
                return (
                  <TableCell key={event} className="text-center border border-gray-300">
                    {event === "Jue AM"
                      ? `${total}`
                      : Number.parseFloat(percentage) >= 100
                        ? "Aforo lleno"
                        : `${percentage}%`}
                  </TableCell>
                )
              })}
            </TableRow>
          </TableBody>
        </Table>
        <div className="max-w-lg mx-auto text-left text-sm text-gray-500">
          * Aforo abierto por ser evento virtual
        </div>
        <div className="border-t border-gray-300 my-4"></div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            style={
              selectedEvent === null
                ? { backgroundColor: "#006f96", color: "white" }
                : { backgroundColor: "#ffffff", color: "black" }
            }
            onClick={() => setSelectedEvent(null)}
          >
            Total
          </Button>
          {events.map((event) => (
            <Button
              key={event}
              style={
                selectedEvent === event
                  ? { backgroundColor: "#006f96", color: "white" }
                  : { backgroundColor: "#ffffff", color: "black" }
              }
              onClick={() => setSelectedEvent(event)}
            >
              {event}
            </Button>
          ))}
        </div>

        <CardHeader className="text-center pb-0">
            <CardTitle>Usuarios registrados</CardTitle>
          </CardHeader>
          <div className="mt-0 text-sm md:text-base flex flex-col items-center">
          <p className="text-center mb-2">Leyenda de observación:</p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-1 md:gap-2">
              <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-center">
                A: Cliente en alerta
              </span>
              <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-center">
                P: Cliente potencial
              </span>
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-center">
                N: Cliente nuevo
              </span>
            </div>
          </div>
          <CardContent className="w-full">
            <UserTable users={filteredUsers} selectedEvent={selectedEvent} />
          </CardContent>
          <CardHeader className="text-center">
            <CardTitle>Totales por evento</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <TotalsTable data={filteredTotalsData} events={filteredEvents} />
          </CardContent>
          <div className="mt-0 text-sm md:text-base flex flex-col items-center">
          <p className="text-center mb-2">Nota: no incluye AC</p>
          </div>
      </CardContent>
    </Card>
  )
}

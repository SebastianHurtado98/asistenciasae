"use client"

import { useState, useMemo, useEffect } from "react"
import { UserTable } from "@/components/UserTable"
import { TotalsTable } from "@/components/TotalsTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateTotalsData } from "@/utils/generateTotalsData"
import { supabase } from "@/lib/supabase"
import Image from "next/image"

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
    const { data: dataEvent2, error: errorEvent2 } = await supabase
      .from('event')
      .select('id, abbreviation')
      .eq('macro_event_id', 5);

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
            company: company_id (razon_social),
            executive: executive_id (name, last_name, user_type, observation)
            )
          `)
        .in('event_id', eventIds)
        .eq('registered', true)         

        if (errorEventGuest) {
          console.error('Error fetching events:', errorEventGuest);
        } else {

          const mappedGuests = dataEventGuest.map((eventGuest)=> ({
            // @ts-expect-error prisa
            name: eventGuest.guest.is_user ? `${eventGuest.guest.executive.name} ${eventGuest.guest.executive.last_name}` : eventGuest.guest.name,
            // @ts-expect-error prisa
            userType: eventGuest.guest.is_user ? eventGuest.guest.executive.user_type : eventGuest.guest.tipo_usuario,
            // @ts-expect-error prisa
            company: eventGuest.guest.is_user ? eventGuest.guest.company?.razon_social : eventGuest.guest.company_razon_social,
            event: dataEvent2.find(event => event.id === eventGuest.event_id)?.abbreviation || "Desconocido",
            
            //@ts-expect-error prisa
            observation: eventGuest.guest?.executive?.observation ? "A" : "",
          }));

          const filteredGuests = mappedGuests.filter(guest => guest.userType !== "AC");

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
        <CardDescription>Resumen de usuarios registrados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-2">
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

      <CardHeader className="text-center">
            <CardTitle>Usuarios registrados</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <UserTable users={filteredUsers} />
          </CardContent>

          <CardHeader className="text-center">
            <CardTitle>Totales por evento</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <TotalsTable data={filteredTotalsData} events={filteredEvents} />
          </CardContent>
      </CardContent>
    </Card>
  )
}

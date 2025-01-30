interface User {
  name: string
  userType: string
  company: string
  event: string
}

export function generateTotalsData(users: User[], events: string[]) {
  const totalsData: { [key: string]: { [key: string]: number } } = {}

  // Inicializar totalsData con todos los userTypes y events
  const userTypes = Array.from(new Set(users.map((user) => user.userType)))
  userTypes.forEach((userType) => {
    totalsData[userType] = {}
    events.forEach((event) => {
      totalsData[userType][event] = 0
    })
  })

  // Contar usuarios por userType y event
  users.forEach((user) => {
    if (totalsData[user.userType] && events.includes(user.event)) {
      totalsData[user.userType][user.event]++
    }
  })

  return totalsData
}


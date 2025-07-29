export type Message = {
  id: number
  username: string
  message: string
  date: string
}

export type Room = {
  name: string
  usersOnline: number
  messages: Message[]
}

export type User = {
  username: string
}

import express from 'express'
import http from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'

import authRoutes from './authRoutes'
import errorHandler from './errorHandler'
import { Room } from './types'

const PORT = 8000

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true, // Allow cookies to be sent
  })
)

const DEFAULT_ROOM = 'General'
const chat: Room[] = [{ name: DEFAULT_ROOM, usersOnline: 0, messages: [] }]

const getRoom = (name: string): Room | null => {
  const room = chat.find((room) => room.name === name)
  if (!room) {
    return null
  }

  return room
}

const createRoom = (name: string) => {
  const room: Room = {
    name,
    usersOnline: 0,
    messages: [],
  }
  chat.push(room)
}

const increaseUsersOnline = (room: string) => {
  const currentRoom = getRoom(room)
  if (currentRoom) {
    currentRoom.usersOnline++
  }
}

const decreaseUsersOnline = (room: string) => {
  const previousRoom = getRoom(room)
  if (previousRoom && previousRoom.usersOnline > 0) {
    previousRoom.usersOnline--
  }
}

const socketRooms = new Map<string, string>()

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})

io.on('connection', (socket) => {
  console.log('connected: ', socket.id)
  socket.join(DEFAULT_ROOM)
  socketRooms.set(socket.id, DEFAULT_ROOM)

  socket.emit('room:get', { rooms: chat })

  socket.on('room:change', (data: { room: string }) => {
    socket.rooms.forEach((room) => {
      decreaseUsersOnline(room)
      socket.leave(room)
    })

    socket.join(data.room)
    increaseUsersOnline(data.room)
    socketRooms.set(socket.id, data.room)

    io.emit('room:get', { rooms: chat })

    const room = getRoom(data.room)
    if (room) {
      io.to(room.name).emit('chat:get', { messages: room ? room.messages : [] })
    }
  })

  socket.on('room:create', (data: { room: string }) => {
    let room = getRoom(data.room)
    if (!room) {
      createRoom(data.room)
      socketRooms.set(socket.id, data.room)
    }
  })

  socket.on('chat:send', (data: { room: string; message: string; username: string }) => {
    const room = getRoom(data.room)

    if (!room) {
      return
    }

    room.messages.push({
      id: room.messages.length + 1,
      message: data.message,
      username: data.username,
      date: new Date().toString(),
    })

    io.to(room.name).emit('chat:get', { messages: room.messages })
  })

  socket.on('disconnect', () => {
    console.log('disconnected: ', socket.id)

    const room = socketRooms.get(socket.id)
    if (room) {
      decreaseUsersOnline(room)
      socketRooms.delete(socket.id)
      io.emit('room:get', { rooms: chat })
    }
  })
})

app.use(authRoutes)
app.use(errorHandler)

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

import { useEffect, useState } from 'react'
import { Message, Room } from '../types'
import { io, Socket } from 'socket.io-client'
import { useSession } from '../context/SessionContext'
import ChatList from './ChatList'
import CreateRoom from './CreateRoom'

const DEFAULT_ROOM = 'General'

export default function Chat() {
  const { user, isAuthenticated } = useSession()
  const [room, setRoom] = useState(DEFAULT_ROOM)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    const socket = io('http://localhost:8000', {
      withCredentials: true,
    })

    socket.on('connect', () => {
      console.log('connected client')
    })

    socket.on('room:get', (data: { rooms: Room[] }) => {
      setRooms(data.rooms)
    })

    socket.on('chat:get', (data: { messages: Message[] }) => {
      setMessages(data.messages)
    })

    socket.on('disconnect', () => {
      console.log('disconnected client')
    })

    setSocket(socket)
    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!socket) {
      return
    }

    socket.emit('room:change', {
      room,
    })

    setMessages([])
  }, [socket, room])

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!socket) {
      return
    }

    socket.emit('chat:send', {
      message,
      username: user?.username,
      room,
    })
    setMessage('')
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
      <div className="col-span-3 sm:col-span-1 flex flex-col gap-6">
        <div>
          <span className="text-stone-500 mb-2">Current Room:</span>
          <div className="flex gap-4">
            <h2 className="text-lg font-bold">{room}</h2>
            <span className="flex gap-1 items-center font-normal">
              {rooms.find((otherRoom) => otherRoom.name === room)?.usersOnline}
              <span className="size-2 animate-pulse bg-emerald-600 block rounded-full"></span>
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-stone-500 mb-2">Rooms:</h3>
          <div className="flex flex-wrap gap-2">
            {rooms.length === 1 && (
              <div className="bg-stone-200 shadow-inner rounded-lg w-full p-4">
                <p className="text-stone-500 text-sm">No other rooms.</p>
              </div>
            )}
            {rooms.length > 1 &&
              rooms.map((otherRoom) => {
                if (room === otherRoom.name) {
                  return null
                }

                return (
                  <button
                    key={otherRoom.name}
                    onClick={() => setRoom(otherRoom.name)}
                    className="bg-stone-200 border-2 border-b-4 border-stone-300 rounded-lg h-10 px-2 font-bold active:bg-stone-300 active:border-b-2 hover:border-b-[5px] flex items-center gap-4"
                  >
                    {otherRoom.name}

                    {otherRoom.usersOnline > 0 && (
                      <span className="flex gap-1 items-center font-normal">
                        {otherRoom.usersOnline}
                        <span className="size-2 animate-pulse bg-emerald-600 block rounded-full"></span>
                      </span>
                    )}
                  </button>
                )
              })}
          </div>
        </div>
        {isAuthenticated && <CreateRoom socket={socket} setRoom={setRoom} />}
      </div>
      <div className="col-span-3 sm:col-span-2 flex flex-col gap-4">
        {isAuthenticated ? (
          <ChatList messages={messages} currentUser={user!} />
        ) : (
          <div className="flex bg-stone-200 rounded-lg shadow-inner h-screen max-h-[50vh] items-center justify-center px-6 gap-2">
            🔒
            <p className="text-stone-500 text-sm">Sign in to create and view messages.</p>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex flex-col">
          <fieldset className="flex flex-col mb-6">
            <label htmlFor="message" className="text-stone-500 text-sm mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={
                'min-h-16 py-2 px-4 rounded-lg focus:outline-none border border-stone-200 resize-y disabled:opacity-50'
              }
              disabled={!isAuthenticated}
            ></textarea>
          </fieldset>
          <button
            type="submit"
            className="ml-auto bg-cyan-500 border-2 border-b-4 border-cyan-600 text-stone-100 rounded-lg h-10 px-2 font-bold active:bg-cyan-600 active:border-b-2 hover:border-b-[5px] disabled:opacity-50"
            disabled={!isAuthenticated}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

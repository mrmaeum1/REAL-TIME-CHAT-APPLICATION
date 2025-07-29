import { useState } from 'react'
import { createPortal } from 'react-dom'
import CreateRoomModal from './CreateRoomModal'
import { Socket } from 'socket.io-client'

type Props = {
  socket: Socket | null
  setRoom: (room: string) => void
}

export default function CreateRoom({ socket, setRoom }: Props) {
  const [showModal, setShowModal] = useState(false)

  const handleCreateRoom = (room: string) => {
    if (!socket) {
      return
    }

    socket.emit('room:create', {
      room,
    })

    setRoom(room)
    setShowModal(false)
  }

  return (
    <>
      <button
        className="bg-stone-500 border-2 border-b-4 border-stone-600 text-stone-100 rounded-lg h-10 px-2 font-bold active:bg-stone-600 active:border-b-2 hover:border-b-[5px]"
        onClick={() => setShowModal(true)}
      >
        Create Room
      </button>

      {showModal &&
        createPortal(
          <CreateRoomModal handleClose={() => setShowModal(false)} handleCreateRoom={handleCreateRoom} />,
          document.body
        )}
    </>
  )
}

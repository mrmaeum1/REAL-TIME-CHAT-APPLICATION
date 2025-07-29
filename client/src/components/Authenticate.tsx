import { useState } from 'react'
import { useSession } from '../context/SessionContext'
import AuthenticateModal from './AuthenticateModal'
import { createPortal } from 'react-dom'

export default function Authenticate() {
  const { user, isAuthenticated, signIn, signOut } = useSession()
  const [showModal, setShowModal] = useState(false)

  const handleSignIn = async (username: string) => {
    await signIn(username)
    setShowModal(false)
  }

  return (
    <>
      {isAuthenticated ? (
        <div className="flex justify-between sm:justify-normal w-full sm:w-auto items-center gap-4">
          <p>
            <span className="text-stone-500">Welcome:</span> {user?.username}
          </p>
          <button
            className="bg-stone-500 border-2 border-b-4 border-stone-600 text-stone-100 rounded-lg h-10 px-2 font-bold active:bg-stone-600 active:border-b-2 hover:border-b-[5px]"
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          className="bg-stone-500 border-2 border-b-4 border-stone-600 text-stone-100 rounded-lg h-10 px-2 font-bold active:bg-stone-600 active:border-b-2 hover:border-b-[5px]"
          onClick={() => setShowModal(true)}
        >
          Sign In
        </button>
      )}

      {showModal &&
        createPortal(
          <AuthenticateModal handleClose={() => setShowModal(false)} handleSignIn={handleSignIn} />,
          document.body
        )}
    </>
  )
}

import { useState } from 'react'

type Props = {
  handleClose: () => void
  handleSignIn: (username: string) => Promise<void>
}

export default function AuthenticateModal({ handleClose, handleSignIn }: Props) {
  const [username, setUsername] = useState('')

  return (
    <div
      className="absolute flex items-center justify-center inset-0 bg-stone-950/50 backdrop-blur-sm"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          handleClose()
        }
      }}
    >
      <div className="flex flex-col bg-stone-50 p-6 rounded-lg shadow-2xl shadow-stone-700 font-mono">
        <fieldset className="flex flex-col mb-6">
          <label htmlFor="username" className="text-stone-500 text-sm mb-2">
            Username
          </label>
          <input
            className="h-10 px-4 rounded-lg focus:outline-none border border-stone-200"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
            name="username"
            placeholder="Username"
          />
        </fieldset>
        <button
          className="ml-auto bg-cyan-500 border-2 border-b-4 border-cyan-600 text-stone-100 rounded-lg h-10 px-2 font-bold active:bg-cyan-600 active:border-b-2 hover:border-b-[5px]"
          onClick={() => handleSignIn(username)}
        >
          Sign In
        </button>
      </div>
    </div>
  )
}

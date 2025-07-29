import { Message, User } from '../types'

type Props = {
  messages: Message[]
  currentUser: User
}

export default function ChatList({ messages, currentUser }: Props) {
  return (
    <ul className="flex flex-col gap-4 bg-stone-200 rounded-lg shadow-inner p-6 pt-2 overflow-y-scroll h-screen max-h-[50vh] justify-end">
      {messages.map((chatMessage) => {
        return (
          <li
            key={chatMessage.id}
            className={`${chatMessage.username === currentUser.username ? ' ml-auto' : 'mr-auto'} flex flex-col gap-2`}
          >
            <p
              className={`${chatMessage.username === currentUser.username ? 'bg-cyan-500 ml-auto' : 'mr-auto bg-stone-500'} rounded-lg px-2 py-1 text-stone-100 text-sm`}
            >
              {chatMessage.message}
            </p>
            <p
              className={`${chatMessage.username === currentUser.username ? 'flex-row' : 'flex-row-reverse'} flex text-xs text-stone-400 hover:text-stone-600 gap-2`}
            >
              <span>{new Date(chatMessage.date).toLocaleString()}</span>
              <span>⋅</span>
              <span className="font-bold">{chatMessage.username}</span>
            </p>
          </li>
        )
      })}
    </ul>
  )
}

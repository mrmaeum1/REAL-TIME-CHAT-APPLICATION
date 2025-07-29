import { SessionProvider } from './context/SessionContext'
import Authenticate from './components/Authenticate'
import Chat from './components/Chat'

function App() {
  return (
    <SessionProvider>
      <div className="font-mono text-stone-800 max-w-2xl px-6 lg:px-6 mx-auto">
        <header className="flex items-center justify-between py-6 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            💬
            <h1 className="font-bold text-xl">Chat App</h1>
          </div>
          <Authenticate />
        </header>
        <main>
          <Chat />
        </main>
      </div>
    </SessionProvider>
  )
}

export default App

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react'

type User = {
  username: string
}

type SessionContextType = {
  user: User | null
  isAuthenticated: boolean
  signIn: (username: string) => Promise<void>
  signOut: () => Promise<void>
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

type Props = {
  children: ReactNode
}

export const SessionProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  // Check if session available
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        console.log(await response.json())
        setUser(null)
      }
    } catch (error) {
      console.error('Auth session failed:', error)
    }
  }

  const signIn = async (username: string) => {
    try {
      const response = await fetch('http://localhost:8000/signin', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      })

      if (!response.ok) {
        throw new Error('Sign in failed')
      }

      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await fetch('http://localhost:8000/signout', {
        method: 'POST',
        credentials: 'include',
      })
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <SessionContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signIn,
        signOut,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}

import { useState, useEffect } from 'react'

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return { token, setToken, user, setUser, logout }
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T) => {
    setState(value)
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  return [state, setValue]
}

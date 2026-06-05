import { useState, useEffect } from 'react'

export function useAuth() {
  const [user, setUser] = useState<any>(() => {
    try {
      const item = localStorage.getItem('user');
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  });

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('guestId');
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
  };

  return { user, setUser, logout }
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

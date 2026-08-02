import { useEffect, useState } from 'react'

export function useStoredPreference<T extends string>(
  key: string,
  fallback: T,
  allowedValues: readonly T[],
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return fallback

    const storedValue = window.localStorage.getItem(key)
    return storedValue !== null && allowedValues.includes(storedValue as T) ? (storedValue as T) : fallback
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(key, value)
  }, [key, value])

  return [value, setValue]
}

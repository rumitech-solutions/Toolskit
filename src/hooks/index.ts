import { useCallback, useEffect, useState, useRef } from 'react'
import { useAppStore } from '../stores/appStore'
import type { SearchResult } from '../types'

export const useClipboard = (timeout = 2000) => {
  const [isCopied, setIsCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      timeoutRef.current = setTimeout(() => setIsCopied(false), timeout)
    } catch {
      useAppStore.getState().addNotification({ type: 'error', message: 'Failed to copy to clipboard' })
    }
  }, [timeout])

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }, [])
  return { copy, isCopied }
}

export const useKeyboardShortcuts = (shortcuts: Record<string, () => void>) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform)
      const modKey = isMac ? event.metaKey : event.ctrlKey
      const key = `${modKey ? 'cmd+' : ''}${event.key.toLowerCase()}`
      if (shortcuts[key]) { event.preventDefault(); shortcuts[key]() }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

export const useDebouncedSearch = (
  searchFn: (query: string) => Promise<SearchResult[]>,
  delay = 300,
) => {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const search = useCallback((query: string) => {
    setLoading(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (!query.trim()) { setResults([]); setLoading(false); return }
    timeoutRef.current = setTimeout(async () => {
      try { setResults(await searchFn(query)) } finally { setLoading(false) }
    }, delay)
  }, [searchFn, delay])

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }, [])
  return { results, loading, search }
}

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setStoredValue((current) => {
        const valueToStore = value instanceof Function ? value(current) : value
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
        return valueToStore
      })
    } catch (error) { console.error(`Error setting localStorage key "${key}":`, error) }
  }, [key])
  return [storedValue, setValue] as const
}

export const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const updateSize = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    updateSize(); window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  return size
}

export const useIsMobile = () => useWindowSize().width < 768

export const usePrefetchTool = () => useCallback((toolId: string) => {
  const tool = document.querySelector(`[data-tool="${toolId}"]`)
  if (tool) tool.scrollIntoView({ behavior: 'smooth' })
}, [])

export const useToolState = (toolId: string, initialValues: Record<string, any>) => {
  void toolId
  const [values, setValues] = useState<Record<string, any>>(initialValues)
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateValue = useCallback((key: string, value: any) => setValues((prev) => ({ ...prev, [key]: value })), [])
  const runTool = useCallback(async (fn: () => Promise<any>) => {
    setLoading(true); setError(null)
    try { const result = await fn(); setResults(result); return result }
    catch (err) { setError(err instanceof Error ? err.message : 'Unknown error'); return undefined }
    finally { setLoading(false) }
  }, [])
  const reset = useCallback(() => { setValues(initialValues); setResults({}); setError(null) }, [initialValues])
  return { values, results, loading, error, updateValue, runTool, reset }
}

export const useUrlState = (key: string, defaultValue: string) => {
  const [value, setValue] = useState(() => new URLSearchParams(window.location.search).get(key) || defaultValue)
  const updateValue = useCallback((newValue: string) => {
    setValue(newValue)
    const params = new URLSearchParams(window.location.search); params.set(key, newValue)
    window.history.replaceState({}, '', `?${params.toString()}`)
  }, [key])
  return [value, updateValue] as const
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage<string[]>('toolskit-favorites', [])
  const isFavorite = useCallback((toolId: string) => favorites.includes(toolId), [favorites])
  const toggleFavorite = useCallback((toolId: string) => {
    setFavorites((prev) => prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId])
  }, [setFavorites])
  return { favorites, isFavorite, toggleFavorite }
}

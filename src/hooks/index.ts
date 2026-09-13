import { useCallback, useEffect, useState, useRef } from 'react'
import { useAppStore } from '../stores/appStore'
import type { SearchResult, ToolDefinition } from '../types'

// Hook: Copy to clipboard with feedback
export const useClipboard = (timeout = 2000) => {
  const [isCopied, setIsCopied] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      timeoutRef.current = setTimeout(() => setIsCopied(false), timeout)
    } catch (err) {
      useAppStore.getState().addNotification({
        type: 'error',
        message: 'Failed to copy to clipboard',
      })
    }
  }, [timeout])

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  return { copy, isCopied }
}

// Hook: Keyboard shortcuts
export const useKeyboardShortcuts = (shortcuts: Record<string, () => void>) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform)
      const modKey = isMac ? event.metaKey : event.ctrlKey

      const key = `${modKey ? 'cmd+' : ''}${event.key.toLowerCase()}`
      
      if (shortcuts[key]) {
        event.preventDefault()
        shortcuts[key]()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

// Hook: Debounced search
export const useDebouncedSearch = (searchFn: (query: string) => Promise<SearchResult[]>, delay = 300) => {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const search = useCallback((query: string) => {
    setLoading(true)
    clearTimeout(timeoutRef.current)

    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const data = await searchFn(query)
        setResults(data)
      } finally {
        setLoading(false)
      }
    }, delay)
  }, [searchFn, delay])

  return { results, loading, search }
}

// Hook: Local storage state
export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}

// Hook: Window size detection
export const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }

    updateSize()
    const debounce = setTimeout(updateSize, 250)
    window.addEventListener('resize', updateSize)

    return () => {
      clearTimeout(debounce)
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return size
}

// Hook: Mobile detection
export const useIsMobile = () => {
  const { width } = useWindowSize()
  return width < 768
}

// Hook: Prefetch tool
export const usePrefetchTool = () => {
  return useCallback((toolId: string) => {
    const tool = document.querySelector(`[data-tool="${toolId}"]`)
    if (tool) {
      // Pre-render tool component
      tool.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])
}

// Hook: Tool state management
export const useToolState = (toolId: string, initialValues: Record<string, any>) => {
  const [values, setValues] = useState(initialValues)
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateValue = useCallback((key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  const runTool = useCallback(async (fn: () => Promise<any>) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fn()
      setResults(result)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setValues(initialValues)
    setResults({})
    setError(null)
  }, [initialValues])

  return { values, results, loading, error, updateValue, runTool, reset }
}

// Hook: URL state persistence
export const useUrlState = (key: string, defaultValue: string) => {
  const [value, setValue] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get(key) || defaultValue
  })

  const updateValue = useCallback((newValue: string) => {
    setValue(newValue)
    const params = new URLSearchParams(window.location.search)
    params.set(key, newValue)
    window.history.replaceState({}, '', `?${params.toString()}`)
  }, [key])

  return [value, updateValue] as const
}

// Hook: Tool favorites
export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage<string[]>('toolskit-favorites', [])

  const isFavorite = useCallback((toolId: string) => favorites.includes(toolId), [favorites])

  const toggleFavorite = useCallback((toolId: string) => {
    setFavorites((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    )
  }, [setFavorites])

  return { favorites, isFavorite, toggleFavorite }
}

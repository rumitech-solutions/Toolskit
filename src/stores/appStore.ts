import { useSyncExternalStore } from 'react'
import type { AppState, Notification, UserPreferences, ToolHistoryEntry } from '../types'

interface AppStateStore extends AppState {
  setCurrentTool: (toolId: string | null) => void
  setCategory: (category: AppState['selectedCategory']) => void
  setSearchQuery: (query: string) => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleSidebar: () => void
  toggleCommand: () => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  addToHistory: (entry: Omit<ToolHistoryEntry, 'id'>) => void
  clearHistory: () => void
  toggleHistoryItemStar: (id: string) => void
  setPreferences: (prefs: Partial<UserPreferences>) => void
}

type StoreState = Omit<AppStateStore,
  'setCurrentTool' | 'setCategory' | 'setSearchQuery' | 'setTheme' |
  'toggleSidebar' | 'toggleCommand' | 'addNotification' | 'removeNotification' |
  'addToHistory' | 'clearHistory' | 'toggleHistoryItemStar' | 'setPreferences'
>

const STORAGE_KEY = 'toolskit-app-state'

const getInitialState = (): StoreState => {
  const defaults: StoreState = {
    currentTool: null,
    selectedCategory: 'All',
    searchQuery: '',
    theme: 'light',
    sidebarOpen: true,
    commandOpen: false,
    notificationQueue: [],
    toolHistory: [],
  }

  if (typeof window === 'undefined') return defaults
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null') as Partial<StoreState> | null
    return saved ? { ...defaults, ...saved, notificationQueue: [] } : defaults
  } catch {
    return defaults
  }
}

let state: StoreState = getInitialState()
const listeners = new Set<() => void>()
let currentSnapshot: AppStateStore

const notify = () => listeners.forEach((listener) => listener())

const persist = () => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      theme: state.theme,
      sidebarOpen: state.sidebarOpen,
      toolHistory: state.toolHistory,
    }))
  } catch {
    // Ignore storage errors so the app remains usable.
  }
}

const setState = (next: Partial<StoreState>) => {
  state = { ...state, ...next }
  currentSnapshot = { ...state, ...actions }
  persist()
  notify()
}

const actions = {
  setCurrentTool: (toolId: string | null) => setState({ currentTool: toolId }),
  setCategory: (category: AppState['selectedCategory']) => setState({ selectedCategory: category }),
  setSearchQuery: (query: string) => setState({ searchQuery: query }),
  setTheme: (theme: 'light' | 'dark') => setState({ theme }),
  toggleSidebar: () => setState({ sidebarOpen: !state.sidebarOpen }),
  toggleCommand: () => setState({ commandOpen: !state.commandOpen }),
  addNotification: (notification: Omit<Notification, 'id'>) => setState({
    notificationQueue: [...state.notificationQueue, { id: `notif-${Date.now()}`, ...notification }],
  }),
  removeNotification: (id: string) => setState({
    notificationQueue: state.notificationQueue.filter((notification) => notification.id !== id),
  }),
  addToHistory: (entry: Omit<ToolHistoryEntry, 'id'>) => setState({
    toolHistory: [
      { id: `hist-${Date.now()}`, ...entry, starred: false },
      ...state.toolHistory.slice(0, 99),
    ],
  }),
  clearHistory: () => setState({ toolHistory: [] }),
  toggleHistoryItemStar: (id: string) => setState({
    toolHistory: state.toolHistory.map((item) =>
      item.id === id ? { ...item, starred: !item.starred } : item,
    ),
  }),
  setPreferences: (prefs: Partial<UserPreferences>) => setState({
    theme: prefs.theme ?? state.theme,
    sidebarOpen: prefs.sidebarCollapsed !== undefined ? !prefs.sidebarCollapsed : state.sidebarOpen,
  }),
}

currentSnapshot = { ...state, ...actions }

interface AppStoreHook {
  (): AppStateStore
  <T>(selector: (store: AppStateStore) => T): T
  getState: () => AppStateStore
}

export const useAppStore = ((selector?: <T>(store: AppStateStore) => T) => {
  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  if (selector) {
    return useSyncExternalStore(subscribe, () => selector(currentSnapshot), () => selector(currentSnapshot))
  }

  return useSyncExternalStore(subscribe, () => currentSnapshot, () => currentSnapshot)
}) as AppStoreHook

useAppStore.getState = () => currentSnapshot

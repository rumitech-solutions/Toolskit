import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { AppState, Notification, UserPreferences, ToolHistoryEntry } from '../types'

interface AppStateStore extends AppState {
  // Actions
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

export const useAppStore = create<AppStateStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        currentTool: null,
        selectedCategory: 'All',
        searchQuery: '',
        theme: 'light',
        sidebarOpen: true,
        commandOpen: false,
        notificationQueue: [],
        toolHistory: [],

        // Actions
        setCurrentTool: (toolId) => set({ currentTool: toolId }),
        setCategory: (category) => set({ selectedCategory: category }),
        setSearchQuery: (query) => set({ searchQuery: query }),
        setTheme: (theme) => set({ theme }),
        
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        toggleCommand: () => set((state) => ({ commandOpen: !state.commandOpen })),

        addNotification: (notification) => 
          set((state) => ({
            notificationQueue: [
              ...state.notificationQueue,
              { id: `notif-${Date.now()}`, ...notification }
            ]
          })),

        removeNotification: (id) =>
          set((state) => ({
            notificationQueue: state.notificationQueue.filter((n) => n.id !== id)
          })),

        addToHistory: (entry) =>
          set((state) => ({
            toolHistory: [
              { id: `hist-${Date.now()}`, ...entry, starred: false },
              ...state.toolHistory.slice(0, 99) // Keep last 100
            ]
          })),

        clearHistory: () => set({ toolHistory: [] }),

        toggleHistoryItemStar: (id) =>
          set((state) => ({
            toolHistory: state.toolHistory.map((item) =>
              item.id === id ? { ...item, starred: !item.starred } : item
            )
          })),

        setPreferences: (prefs) => set({
          theme: prefs.theme || get().theme,
          sidebarOpen: prefs.sidebarCollapsed !== undefined ? !prefs.sidebarCollapsed : get().sidebarOpen,
        }),
      }),
      {
        name: 'toolskit-app-state',
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
          toolHistory: state.toolHistory,
        }),
      }
    ),
    { name: 'AppStore' }
  )
)

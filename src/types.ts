export type Category = 'All' | 'Text' | 'Developer' | 'PDF' | 'Image' | 'Calculators' | 'Security'

export interface ToolDefinition {
  id: string
  name: string
  description: string
  category: Exclude<Category, 'All'>
  keywords: string[]
  shortcuts?: string[]
  file?: boolean
  premium?: boolean
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  action?: { label: string; onClick: () => void }
  duration?: number
}

export interface ToolHistoryEntry {
  id: string
  toolId: string
  timestamp: number
  starred?: boolean
  [key: string]: unknown
}

export interface UserPreferences {
  theme?: 'light' | 'dark'
  sidebarCollapsed?: boolean
}

export interface SearchResult {
  id: string
  name: string
  description: string
  category: Category
  score?: number
  [key: string]: unknown
}

export interface AppState {
  currentTool: string | null
  selectedCategory: Category
  searchQuery: string
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  commandOpen: boolean
  notificationQueue: Notification[]
  toolHistory: ToolHistoryEntry[]
}

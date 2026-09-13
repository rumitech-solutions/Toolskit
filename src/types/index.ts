// Complete type system for Toolskit v2

export type Category = 'All' | 'Text' | 'Developer' | 'PDF' | 'Image' | 'Calculators' | 'Security'

export interface ToolDefinition {
  id: string
  name: string
  description: string
  category: Exclude<Category, 'All'>
  keywords: string[]
  file?: boolean
  icon?: React.ReactNode
  shortcuts?: string[]
  demo?: string
  premium?: boolean
}

export interface ToolState {
  values: Record<string, any>
  results: Record<string, any>
  loading: boolean
  error: string | null
}

export interface ToolHistoryEntry {
  id: string
  toolId: string
  timestamp: number
  input: Record<string, any>
  output?: Record<string, any>
  starred: boolean
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  sidebarCollapsed: boolean
  favorites: string[]
  recentTools: string[]
  fontSize: 'sm' | 'md' | 'lg'
  notifications: boolean
  autoSave: boolean
  showTips: boolean
}

export interface ToolPreset {
  id: string
  name: string
  toolId: string
  values: Record<string, any>
  createdAt: number
  tags: string[]
  shared: boolean
}

export interface SearchResult {
  id: string
  name: string
  category: Category
  description: string
  score: number
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

export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  action?: { label: string; onClick: () => void }
  duration?: number
}

export interface LayoutMode {
  type: 'default' | 'split' | 'fullscreen'
  splitRatio?: number
}

import React, { useMemo } from 'react'
import { useAppStore } from '../stores/appStore'
import { useFavorites, useIsMobile } from '../hooks'
import type { Category, ToolDefinition } from '../types'

interface SidebarProps {
  tools: ToolDefinition[]
  categories: Category[]
  onSelectTool: (toolId: string) => void
  onSelectCategory: (category: Category) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  tools,
  categories,
  onSelectTool,
  onSelectCategory,
}) => {
  const {
    sidebarOpen,
    toggleSidebar,
    currentTool,
    selectedCategory,
    toolHistory,
  } = useAppStore()
  
  const { favorites, isFavorite, toggleFavorite } = useFavorites()
  const isMobile = useIsMobile()

  // Get favorite tools
  const favoriteTools = useMemo(
    () => tools.filter((t) => favorites.includes(t.id)).slice(0, 8),
    [tools, favorites]
  )

  // Get recent tools
  const recentTools = useMemo(
    () => {
      const seen = new Set<string>()
      return toolHistory
        .map((h) => tools.find((t) => t.id === h.toolId))
        .filter((t): t is ToolDefinition => t !== undefined && !seen.has(t.id) && !seen.add(t.id))
        .slice(0, 8)
    },
    [toolHistory, tools]
  )

  if (isMobile && !sidebarOpen) return null

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-secondary border-r border-gray-200 transition-transform z-sticky ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-primary">🛠️ Toolskit</h1>
              {isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-tertiary rounded-lg transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-2">Powerful tools at your fingertips</p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Quick Access */}
            <div className="p-4">
              <button
                onClick={() => useAppStore.getState().toggleCommand()}
                className="w-full flex items-center justify-between p-3 bg-primary-light text-primary rounded-lg hover:bg-primary hover:text-white transition-colors mb-4"
              >
                <span className="text-sm font-medium">🔍 Quick Search</span>
                <kbd className="hidden sm:block text-xs bg-white/20 px-2 py-1 rounded">⌘K</kbd>
              </button>
            </div>

            {/* Favorites */}
            {favoriteTools.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                  ⭐ Favorites
                </h3>
                <div className="space-y-1">
                  {favoriteTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => onSelectTool(tool.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        currentTool === tool.id
                          ? 'bg-primary text-white font-medium'
                          : 'hover:bg-tertiary'
                      }`}
                    >
                      {tool.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent */}
            {recentTools.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                  ⏱️ Recent
                </h3>
                <div className="space-y-1">
                  {recentTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => onSelectTool(tool.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        currentTool === tool.id
                          ? 'bg-primary text-white font-medium'
                          : 'hover:bg-tertiary'
                      }`}
                    >
                      {tool.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            <div className="px-4 py-3 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                📂 Categories
              </h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedCategory === cat
                        ? 'bg-primary text-white font-medium'
                        : 'hover:bg-tertiary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Help Section */}
            <div className="px-4 py-3 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                Help
              </h3>
              <div className="space-y-2 text-sm">
                <a
                  href="/docs"
                  className="block text-primary hover:text-primary-dark transition-colors"
                >
                  📖 Documentation
                </a>
                <a
                  href="/shortcuts"
                  className="block text-primary hover:text-primary-dark transition-colors"
                >
                  ⌨️ Keyboard Shortcuts
                </a>
                <a
                  href="/feedback"
                  className="block text-primary hover:text-primary-dark transition-colors"
                >
                  💬 Send Feedback
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <button className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-tertiary rounded-lg transition-colors text-left">
              ⚙️ Settings
            </button>
            <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
              <p>v2.0.0 • Made with ❤️</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-modal"
          onClick={toggleSidebar}
        />
      )}
    </>
  )
}

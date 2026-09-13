import React, { useMemo, useCallback, useState } from 'react'
import { CommandPalette } from './CommandPalette'
import { Sidebar } from './Sidebar'
import { NotificationCenter } from './NotificationCenter'
import { ToolPanel } from './ToolPanel'
import { useAppStore } from '../stores/appStore'
import { useKeyboardShortcuts } from '../hooks'
import { tools, categories } from '../toolRegistry'
import '../styles/design-system.css'

export const App: React.FC = () => {
  const {
    currentTool,
    selectedCategory,
    searchQuery,
    theme,
    sidebarOpen,
    toggleSidebar,
  } = useAppStore()

  // Filter tools by category and search
  const filteredTools = useMemo(() => {
    let result = selectedCategory === 'All' 
      ? tools 
      : tools.filter((t) => t.category === selectedCategory)

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.keywords.some((k) => k.toLowerCase().includes(q))
      )
    }

    return result
  }, [selectedCategory, searchQuery])

  // Get current tool
  const activeTool = useMemo(
    () => tools.find((t) => t.id === currentTool),
    [currentTool]
  )

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'cmd+k': () => useAppStore.getState().toggleCommand(),
    'cmd+b': () => toggleSidebar(),
    'cmd+/': () => {
      useAppStore.getState().addNotification({
        type: 'info',
        message: 'Keyboard shortcuts help coming soon!',
      })
    },
  })

  // Apply theme
  React.useEffect(() => {
    document.documentElement.style.colorScheme = theme
  }, [theme])

  return (
    <div className={`flex h-screen bg-primary text-primary overflow-hidden`}>
      {/* Sidebar */}
      <Sidebar
        tools={tools}
        categories={categories as any[]}
        onSelectTool={(toolId) => useAppStore.getState().setCurrentTool(toolId)}
        onSelectCategory={(cat) => useAppStore.getState().setCategory(cat)}
      />

      {/* Main Content */}
      <main className={`flex-1 flex flex-col transition-all ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-tertiary rounded-lg transition-colors lg:hidden"
              title="Toggle sidebar (Cmd+B)"
            >
              ☰
            </button>
            <div>
              <h1 className="text-2xl font-bold">
                {activeTool?.name || 'Select a Tool'}
              </h1>
              {activeTool && (
                <p className="text-sm text-gray-600 mt-1">{activeTool.description}</p>
              )}
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => useAppStore.getState().toggleCommand()}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-tertiary transition-colors"
              title="Search tools (Cmd+K)"
            >
              🔍 Search
              <kbd className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">⌘K</kbd>
            </button>

            <button
              onClick={() => {
                const isDark = useAppStore.getState().theme === 'dark'
                useAppStore.getState().setTheme(isDark ? 'light' : 'dark')
              }}
              className="p-2 hover:bg-tertiary rounded-lg transition-colors"
              title="Toggle dark mode"
            >
              {useAppStore.getState().theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <button
              onClick={() => window.open('/feedback')}
              className="p-2 hover:bg-tertiary rounded-lg transition-colors"
              title="Send feedback"
            >
              💬
            </button>
          </div>
        </header>

        {/* Tool Container */}
        <div className="flex-1 overflow-auto">
          {activeTool ? (
            <ToolPanel tool={activeTool} />
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🛠️</div>
                <h2 className="text-2xl font-bold mb-2">Welcome to Toolskit v2</h2>
                <p className="text-gray-600 mb-6">
                  Select a tool from the sidebar or use the search feature to get started
                </p>
                <button
                  onClick={() => useAppStore.getState().toggleCommand()}
                  className="btn btn-primary"
                >
                  🔍 Search Tools
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Command Palette */}
      <CommandPalette
        tools={tools}
        onSelectTool={(toolId) => useAppStore.getState().setCurrentTool(toolId)}
      />

      {/* Notifications */}
      <NotificationCenter />
    </div>
  )
}

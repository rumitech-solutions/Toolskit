import React, { useMemo, useState, useCallback } from 'react'
import { useAppStore } from '../stores/appStore'
import type { ToolDefinition } from '../types'

interface CommandPaletteProps {
  tools: ToolDefinition[]
  onSelectTool: (toolId: string) => void
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ tools, onSelectTool }) => {
  const { commandOpen, setCurrentTool } = useAppStore()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const results = useMemo(() => {
    if (!query.trim()) return tools.slice(0, 12)
    const terms = query.toLowerCase().trim().split(/\s+/)
    return tools
      .map((tool) => {
        const haystack = [tool.name, tool.description, ...tool.keywords, tool.category].join(' ').toLowerCase()
        const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0)
        return { tool, score }
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name))
      .map(({ tool }) => tool)
      .slice(0, 50)
  }, [query, tools])

  const handleSelect = useCallback((toolId: string) => {
    setCurrentTool(toolId)
    onSelectTool(toolId)
    setQuery('')
    setSelectedIndex(0)
    useAppStore.getState().toggleCommand()
  }, [setCurrentTool, onSelectTool])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, Math.max(results.length - 1, 0)))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Enter':
        if (results[selectedIndex]) handleSelect(results[selectedIndex].id)
        break
      case 'Escape':
        useAppStore.getState().toggleCommand()
        break
    }
  }

  if (!commandOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-modal" onClick={() => useAppStore.getState().toggleCommand()} style={{ animation: 'fadeIn 150ms ease-out' }} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-modal" style={{ animation: 'slideIn 250ms ease-out' }}>
        <div className="bg-primary border border-gray-200 rounded-lg shadow-2xl overflow-hidden">
          <div className="flex items-center border-b border-gray-200 p-4">
            <span className="text-gray-400 mr-3">🔍</span>
            <input autoFocus type="text" placeholder="Search tools... (type to filter)" value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0) }} onKeyDown={handleKeyDown}
              className="flex-1 outline-none bg-transparent text-lg" style={{ fontFamily: 'var(--font-family-sans)' }} />
            <kbd className="hidden sm:block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">ESC</kbd>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-8 text-center text-gray-500"><p className="text-lg font-medium">No tools found</p><p className="text-sm mt-2">Try adjusting your search terms</p></div>
            ) : (
              <div>{results.map((tool, index) => (
                <button key={tool.id} onClick={() => handleSelect(tool.id)} onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left px-4 py-3 flex items-start justify-between border-b border-gray-100 transition-all ${index === selectedIndex ? 'bg-primary-light text-primary-dark' : 'hover:bg-gray-50'}`}>
                  <div className="flex-1"><div className="font-medium text-sm">{tool.name}</div><div className="text-xs text-gray-500 mt-1 line-clamp-1">{tool.description}</div>
                    <div className="flex gap-1 mt-2"><span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded">{tool.category}</span>
                      {tool.premium && <span className="inline-block px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded">Pro</span>}
                    </div>
                  </div>
                  {tool.shortcuts?.[0] && <kbd className="hidden sm:block text-xs text-gray-400 ml-4">{tool.shortcuts[0]}</kbd>}
                </button>
              ))}</div>
            )}
          </div>
          <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 text-xs text-gray-600 flex justify-between">
            <div><span className="font-medium">{results.length}</span> results found</div>
            <div className="hidden sm:block"><span>↑↓ to navigate</span><span className="mx-2">•</span><span>Enter to select</span><span className="mx-2">•</span><span>Esc to close</span></div>
          </div>
        </div>
      </div>
    </>
  )
}

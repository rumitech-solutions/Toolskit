import React from 'react'
import { useClipboard, useToolState } from '../hooks'
import type { ToolDefinition } from '../types'

interface ToolPanelProps {
  tool: ToolDefinition
}

export const ToolPanel: React.FC<ToolPanelProps> = ({ tool }) => {
  const { values, results, loading, error, updateValue } = useToolState(tool.id, {})
  const { copy, isCopied } = useClipboard()

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
      {/* Input Panel */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">Input</h3>
          
          {/* Dynamic Input Fields - These should be generated from tool definition */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Text Input</label>
              <textarea
                className="input textarea"
                placeholder="Enter your text here..."
                value={values.input || ''}
                onChange={(e) => updateValue('input', e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Tool-specific options */}
            {tool.id === 'case-converter' && (
              <div>
                <label className="block text-sm font-medium mb-2">Case Mode</label>
                <select
                  className="input"
                  value={values.caseMode || 'lower'}
                  onChange={(e) => updateValue('caseMode', e.target.value)}
                >
                  <option value="upper">UPPERCASE</option>
                  <option value="lower">lowercase</option>
                  <option value="title">Title Case</option>
                  <option value="camel">camelCase</option>
                  <option value="snake">snake_case</option>
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <button className="btn btn-primary flex-1">
                {loading ? '⏳ Processing...' : '▶️ Run Tool'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => updateValue('input', '')}
              >
                🗑️ Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Output Panel */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">Output</h3>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-900 p-4 rounded-lg mb-4">
              <p className="font-medium">❌ Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center h-40 bg-tertiary rounded-lg">
              <div className="text-center">
                <div className="text-4xl mb-2 animate-pulse">⏳</div>
                <p className="text-gray-600">Processing...</p>
              </div>
            </div>
          )}

          {!loading && Object.keys(results).length === 0 ? (
            <div className="flex items-center justify-center h-40 bg-tertiary rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <p className="text-gray-600">Results will appear here</p>
              </div>
            </div>
          ) : (
            <>
              <textarea
                className="input textarea"
                placeholder="Results will appear here..."
                value={Object.values(results).join('\n')}
                readOnly
                rows={12}
              />

              {Object.keys(results).length > 0 && (
                <div className="flex gap-2 pt-4">
                  <button
                    className={`btn btn-primary flex-1 ${
                      isCopied ? 'bg-green-600 hover:bg-green-700' : ''
                    }`}
                    onClick={() =>
                      copy(Object.values(results).join('\n'))
                    }
                  >
                    {isCopied ? '✓ Copied!' : '📋 Copy Result'}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      const a = document.createElement('a')
                      a.href =
                        'data:text/plain,' +
                        encodeURIComponent(
                          Object.values(results).join('\n')
                        )
                      a.download = `${tool.id}-result.txt`
                      a.click()
                    }}
                  >
                    ⬇️ Download
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

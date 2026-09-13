import React, { useEffect } from 'react'
import { useAppStore } from '../stores/appStore'

interface NotificationItemProps {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  action?: { label: string; onClick: () => void }
  duration?: number
  onRemove: () => void
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  type,
  message,
  action,
  duration = 4000,
  onRemove,
}) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onRemove, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onRemove])

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
  }

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ⓘ',
    warning: '⚠',
  }

  return (
    <div
      key={id}
      className={`border rounded-lg p-4 mb-3 flex items-start justify-between animate-slideIn ${colors[type]}`}
      role="alert"
    >
      <div className="flex items-start gap-3 flex-1">
        <span className="text-lg flex-shrink-0">{icons[type]}</span>
        <div className="flex-1">
          <p className="font-medium text-sm">{message}</p>
          {action && (
            <button
              onClick={action.onClick}
              className="text-xs font-medium underline mt-1 hover:opacity-75 transition-opacity"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
      <button
        onClick={onRemove}
        className="flex-shrink-0 ml-4 text-lg opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  )
}

export const NotificationCenter: React.FC = () => {
  const { notificationQueue, removeNotification } = useAppStore()

  return (
    <div
      className="fixed bottom-0 right-0 p-6 w-full max-w-md pointer-events-none z-tooltip"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="pointer-events-auto">
        {notificationQueue.map((notif) => (
          <NotificationItem
            key={notif.id}
            {...notif}
            onRemove={() => removeNotification(notif.id)}
          />
        ))}
      </div>
    </div>
  )
}

'use client'

import { JSX, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import useAlertStore, { AlertType } from '@/store/useAlertStore'
import styles from '@/styles/alert.module.css'

const alertStyles: Record<AlertType, string> = {
  success: 'bg-green-100 border-green-500 text-green-700',
  error: 'bg-red-100 border-red-500 text-red-700',
  warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
  info: 'bg-blue-100 border-blue-500 text-blue-700',
}

const alertIcons: Record<AlertType, JSX.Element> = {
  success: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
}

const AlertItem = ({ id, type, message }: { id: string; type: AlertType; message: string }) => {
  const removeAlert = useAlertStore((state) => state.removeAlert)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsExiting(true)
    }, 2700) // 在自動移除前開始退出動畫

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div
      className={`
        ${alertStyles[type]}
        ${isExiting ? styles.fadeOut : styles.fadeIn}
        flex items-center p-4 mb-4 rounded-lg border
        transition-all duration-300 ease-in-out
        pointer-events-auto
      `}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3">
        {alertIcons[type]}
      </div>
      <div className="ml-3 text-sm font-medium">{message}</div>
      <button
        type="button"
        onClick={() => removeAlert(id)}
        className={`
          ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8
          ${type === 'success' ? 'hover:bg-green-200 focus:ring-green-400' : ''}
          ${type === 'error' ? 'hover:bg-red-200 focus:ring-red-400' : ''}
          ${type === 'warning' ? 'hover:bg-yellow-200 focus:ring-yellow-400' : ''}
          ${type === 'info' ? 'hover:bg-blue-200 focus:ring-blue-400' : ''}
        `}
      >
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}

const Alert = () => {
  const alerts = useAlertStore((state) => state.alerts)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className="fixed top-4 inset-x-0 flex justify-center pointer-events-none z-50">
      <div className="max-w-sm w-full mx-4">
        {alerts.map((alert) => (
          <AlertItem key={alert.id} {...alert} />
        ))}
      </div>
    </div>,
    document.body
  )
}

export default Alert
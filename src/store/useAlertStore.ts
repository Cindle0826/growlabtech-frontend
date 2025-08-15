import { create } from 'zustand'

export type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertMessage {
  id: string
  type: AlertType
  message: string
}

interface AlertState {
  alerts: AlertMessage[]
  addAlert: (type: AlertType, message: string) => void
  removeAlert: (id: string) => void
}

const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  addAlert: (type, message) => {
    const id = Math.random().toString(36).substring(7)
    set((state) => ({
      alerts: [...state.alerts, { id, type, message }],
    }))
    // 3秒後自動移除
    setTimeout(() => {
      set((state) => ({
        alerts: state.alerts.filter((alert) => alert.id !== id),
      }))
    }, 3000)
  },
  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== id),
    })),
}))

export default useAlertStore
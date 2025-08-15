import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
}

interface UserState {
  user: GoogleUserInfo | null
  isAuthenticated: boolean
  setUser: (user: GoogleUserInfo | null) => void
  logout: () => void
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user 
        })
      },
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        })
      },
    }),
    {
      name: 'user-storage',
      // 只儲存必要的狀態
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useUserStore
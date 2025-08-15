'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import useUserStore from '@/store/useUserStore'
import { protectedRoutes } from './auth-routes'
import useAlertStore from '@/store/useAlertStore'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: ReactNode
}

const api = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/authorize/validate`

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useUserStore()
  const [isLoading, setIsLoading] = useState(true)
  const { addAlert } = useAlertStore();

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

        // 如果是受保護的路由或用戶已登入，則進行後端驗證
        if (isProtectedRoute || user) {
          const response = await fetch(api, { credentials: 'include', });
          

          if (!response.ok) {
            // 如果驗證失敗，清除用戶狀態
            const data = await response.json();
            console.error('Auth validation failed:', data);
            logout();

            if (isProtectedRoute) {
              // 保存當前URL並重定向
              sessionStorage.setItem('returnUrl', pathname);
              router.push('/');
              addAlert('warning', "please login!")
            }
          }
        }
      } catch (error) {
        console.error('Auth validation error:', error);
        // 發生錯誤時清除用戶狀態
        logout();

        if (protectedRoutes.some(route => pathname.startsWith(route))) {
          sessionStorage.setItem('returnUrl', pathname);
          router.push('/');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // 執行驗證
    validateAuth();

    // 設置定期驗證（例如每5分鐘）
    const intervalId = setInterval(validateAuth, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [pathname, user, router, logout, addAlert]);

  // 在驗證過程中顯示載入狀態
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    )
  }

  // 檢查是否是受保護的路由
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // 如果是受保護的路由且沒有用戶，顯示空白（會被重定向）
  if (isProtectedRoute && !user) {
    return null
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
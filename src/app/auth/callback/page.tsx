'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import useUserStore from '@/store/useUserStore'
import useAlertStore from "@/store/useAlertStore"

const GoogleOAuth2CallbackPage = () => {
    const [data, setData] = useState('Processing Authorization...')
    const [secondsLeft, setSecondsLeft] = useState(3)
    const router = useRouter()
    const setUser = useUserStore(state => state.setUser)
    const { addAlert } = useAlertStore();

    useEffect(() => {
        let isExecuted = false

        const processAuthorization = async () => {
            if (isExecuted) return
            isExecuted = true

            try {
                const urlParams = new URLSearchParams(window.location.search)
                const code = urlParams.get("code")
                if (!code) {
                    console.error("Authorization code not found")
                    setData("Authorization code not found. Please try again.")
                    return
                }

                const api = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/authorize/googleLogin`
                const response = await fetch(api, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        code,
                        redirectUri: process.env.NEXT_PUBLIC_GOOGLE_OAUTH2_REDIRECT_URL,
                    }),
                })
                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.error || `HTTP error! Status: ${response.status}`)
                }

                const userData = await response.json()
                console.debug("userData", userData.data);

                setUser(userData.data)
                setData("Authorization successful!")

                // 處理重定向
                setTimeout(() => {
                    // 獲取之前保存的返回 URL
                    const returnUrl = sessionStorage.getItem('returnUrl') || '/'
                    sessionStorage.removeItem('returnUrl') // 清除保存的 URL
                    router.push(returnUrl)
                    router.refresh()
                    addAlert('success', 'login success!')
                }, 1000)
            } catch (error) {
                console.error(error)
                setData("Failed to fetch access token. Please refresh the page or try again later.")
                addAlert('error', 'login fail, please contact the administrator !')
            }
        }

        const countdownInterval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval)
                    processAuthorization()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(countdownInterval)
    }, [router, setUser, addAlert])

    return (
        <section className="overflow-hidden pt-[180px] pb-[120px]">
            <div className="container">
                <div className="-mx-4 flex flex-wrap">
                    <div className="w-full px-4 lg:w-8/12">
                        <div>
                            <h1 className="mb-8 text-3xl leading-tight font-bold text-black sm:text-4xl sm:leading-tight dark:text-white">
                                {data}
                            </h1>
                            {secondsLeft > 0 && (
                                <p className="text-xl text-gray-600 dark:text-gray-400">
                                    Please wait... {secondsLeft} seconds remaining.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default GoogleOAuth2CallbackPage

"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import useUserStore from "@/store/useUserStore";
import useAlertStore from "@/store/useAlertStore";

const AuthButton = () => {
  const { user, isAuthenticated, logout } = useUserStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addAlert } = useAlertStore();

  // 處理點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/authorize/googleSignOut`,
        {
          method: 'POST',
          credentials: 'include', // 確保包含 cookies
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json()
      if (!response.ok) {
        console.error(data);
        throw new Error(data.message);
      }

      // API 調用成功後，清除本地狀態
      console.debug(data)
      logout();
      setShowDropdown(false);
      addAlert('success', 'signout success!')
    } catch (error) {
      console.error('signout error:', error);
      // 可以在這裡添加錯誤提示
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Link
          href="/signin"
          className="text-dark hidden px-7 py-3 text-base font-medium hover:opacity-70 md:block dark:text-white"
        >
          Sign In
        </Link>
        {/* <Link
          href="/signup"
          className="ease-in-up shadow-btn hover:shadow-btn-hover bg-primary hover:bg-primary/90 hidden rounded-xs px-8 py-3 text-base font-medium text-white transition duration-300 md:block md:px-9 lg:px-6 xl:px-9"
        >
          Sign Up
        </Link> */}
      </>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-gray-200">
          {user?.picture ? (
            <Image
              src={user.picture}
              alt={user.name}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-500">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
          <div className="border-b border-gray-100 px-4 py-2 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthButton;
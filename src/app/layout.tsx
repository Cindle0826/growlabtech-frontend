"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import Alert from '@/components/Alert/Alert'
import { Inter } from "next/font/google";
import { AuthProvider } from '@/components/Auth/AuthProvider'
import "../styles/index.css";
import '@/styles/fullcalendar-dark.css';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <Providers>
          <AuthProvider>
            <Header />
            {children}
            <Footer />
            <ScrollToTop />
            <Alert />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}

import { Providers } from "./providers";

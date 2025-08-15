// app/calendar/page.tsx
import { memo, Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import FullCalendarClient from "@/components/Calendar/FullCalendarClient";
import CalendarSkeleton from "@/components/Calendar/CalendarSkeleton";

export const metadata: Metadata = {
  title: "我的行事曆 | SaaS 平台",
  description: "查看和管理您的 Google 行事曆事件",
  robots: { index: false, follow: true },
};

 const CalendarPage = () => {
  // const session = await getServerSession();
  
  // if (!session) {
  //   redirect('/signin');
  // }

  const MemoizedFullCalendarClient = memo(FullCalendarClient);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <p className="text-gray-600 mt-2">管理您的 Google Calendar 事件</p>
      </div>
      
      <Suspense fallback={<CalendarSkeleton />}>
        <MemoizedFullCalendarClient userId="test-user" />
      </Suspense>
    </main>
  );
}

export default CalendarPage

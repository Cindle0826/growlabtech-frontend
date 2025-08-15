"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import {
  EventApi,
  DateSelectArg,
  EventClickArg,
  EventInput,
  CalendarOptions
} from '@fullcalendar/core';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import EventDetailModal from './EventDetailModal';
import CreateEventModal from './CreateEventModal';
import CalendarSkeleton from './CalendarSkeleton';

export interface CalendarEvent extends EventInput {
  id: string;
  title: string;
  start: string | Date;
  end?: string | Date;
  description?: string;
  color?: string;
  extendedProps?: {
    description?: string;
    location?: string;
    attendees?: string[];
    timeZone?: string;
  };
}

interface FullCalendarClientProps {
  userId: string;
  userEmail?: string;
  apiBaseUrl?: string; // 你的後端 API 基礎 URL
}

export default function FullCalendarClient({ userId }: FullCalendarClientProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<DateSelectArg | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarRef = useRef<FullCalendar>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 將 fetchCalendarEvents 移到 useCallback 中
  const fetchCalendarEvents = useCallback(async () => {
    // 如果有正在進行的請求，取消它
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 創建新的 AbortController
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const queryParams = new URLSearchParams({
        userId: userId,
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString(),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/calendar/events?${queryParams}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          signal: abortControllerRef.current.signal
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const formattedEvents = data.events?.map((event: any) => ({
        id: event.id,
        title: event.summary,
        start: event.start.dateTime,
        end: event.end.dateTime,
        allDay: false,
        color: '#3788d8',
        extendedProps: {
          description: event.description,
          location: event.location,
          attendees: [],
          timeZone: event.start.timeZone,
        },
      })) || [];

      setEvents(formattedEvents);
    } catch (err) {
      // 忽略取消請求的錯誤
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      console.error('Failed to fetch calendar events:', err);
      setError(err instanceof Error ? err.message : 'Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  }, [userId, currentDate]); // 只依賴 userId 和 currentDate

  // 優化 useEffect
  useEffect(() => {
    fetchCalendarEvents();

    return () => {
      // 清理函數：組件卸載時取消正在進行的請求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchCalendarEvents]); // 只依賴 fetchCalendarEvents

  // 優化 handleDateChange
  const handleDateChange = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []); // 不需要任何依賴

  // 優化其他事件處理函數
  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    setSelectedDateRange(selectInfo);
    setShowCreateModal(true);
  }, []);

  // 處理事件點擊
  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      description: event.extendedProps?.description,
      extendedProps: event.extendedProps,
    });
    setShowEventModal(true);
  }, []);

  // 創建新事件
  const handleCreateEvent = async (eventData: Partial<CalendarEvent>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/calendar/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...eventData,
          userId,
          // 根據你的後端 API 需求調整欄位名稱
          summary: eventData.title,
          startTime: eventData.start,
          endTime: eventData.end,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const result = await response.json();

      // 重新獲取事件列表
      await fetchCalendarEvents();
      setShowCreateModal(false);
      setSelectedDateRange(null);

      // 顯示成功訊息
      alert('事件創建成功！');
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('創建事件失敗，請稍後再試');
    }
  };

  // 更新事件
  const handleUpdateEvent = async (eventId: string, eventData: Partial<CalendarEvent>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/calendar/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...eventData,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      await fetchCalendarEvents();
      setShowEventModal(false);
      setSelectedEvent(null);
      alert('事件更新成功！');
    } catch (error) {
      console.error('Failed to update event:', error);
      alert('更新事件失敗，請稍後再試');
    }
  };

  // 刪除事件
  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/calendar/events/${eventId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      await fetchCalendarEvents();
      setShowEventModal(false);
      setSelectedEvent(null);
      alert('事件刪除成功！');
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('刪除事件失敗，請稍後再試');
    }
  };

  // FullCalendar 配置
  const calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    locale: 'zh-tw',
    firstDay: 1, // 週一開始
    weekends: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekNumbers: false,
    navLinks: true,
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5], // 週一到週五
      startTime: '09:00',
      endTime: '18:00',
    },
    select: handleDateSelect,
    eventClick: handleEventClick,
    events: events,
    eventDisplay: 'block',
    displayEventTime: true,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    height: 'auto',
    contentHeight: 600,
    aspectRatio: 1.35,
    // 當用戶導航到不同月份時觸發
    datesSet: (dateInfo) => {
      const newDate = new Date(dateInfo.start);
      newDate.setDate(15); // 設定為月中，避免邊界問題
      if (newDate.getMonth() !== currentDate.getMonth() ||
        newDate.getFullYear() !== currentDate.getFullYear()) {
        handleDateChange(newDate);
      }
    },
  };

  if (loading) {
    return <CalendarSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-medium text-lg">載入行事曆時發生錯誤</h3>
        <p className="text-red-600 mt-2">{error}</p>
        <button
          onClick={fetchCalendarEvents}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          重新載入
        </button>
      </div>
    );
  }

return (
  <div className="space-y-6">
    {/* 行事曆工具列 */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-300">
            {format(currentDate, 'yyyy年MM月', { locale: zhTW })}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            共 {events.length} 個事件
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            新增事件
          </button>
          <button
            onClick={fetchCalendarEvents}
            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            重新整理
          </button>
        </div>
      </div>
    </div>

    {/* FullCalendar 組件 */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
      <div className="p-4">
        <FullCalendar
          ref={calendarRef}
          {...calendarOptions}
        />
      </div>
    </div>

    {/* 事件詳情 Modal */}
    {showEventModal && selectedEvent && (
      <EventDetailModal
        event={selectedEvent}
        onClose={() => {
          setShowEventModal(false);
          setSelectedEvent(null);
        }}
        onDelete={handleDeleteEvent}
        onUpdate={handleUpdateEvent}
      />
    )}

    {/* 創建事件 Modal */}
    {showCreateModal && (
      <CreateEventModal
        dateRange={selectedDateRange}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedDateRange(null);
        }}
        onCreate={handleCreateEvent}
      />
    )}
  </div>
);
}

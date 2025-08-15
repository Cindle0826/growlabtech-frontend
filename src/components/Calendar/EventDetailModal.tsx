// components/calendar/EventDetailModal.tsx
"use client";

import { CalendarEvent } from './FullCalendarClient';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface EventDetailModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onDelete: (eventId: string) => void;
  onUpdate: (eventId: string, eventData: Partial<CalendarEvent>) => void;
}

export default function EventDetailModal({ event, onClose, onDelete, onUpdate }: EventDetailModalProps) {
  const handleDelete = () => {
    if (confirm('確定要刪除這個事件嗎？')) {
      onDelete(event.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {event.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                開始時間
              </label>
              <p className="text-gray-900">
                {event.start ? format(new Date(event.start), 'yyyy年MM月dd日 HH:mm', { locale: zhTW }) : '未設定'}
              </p>
            </div>

            {event.end && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  結束時間
                </label>
                <p className="text-gray-900">
                  {format(new Date(event.end), 'yyyy年MM月dd日 HH:mm', { locale: zhTW })}
                </p>
              </div>
            )}

            {event.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  描述
                </label>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            )}

            {event.extendedProps?.location && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  地點
                </label>
                <p className="text-gray-900">
                  {event.extendedProps.location}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              關閉
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              刪除事件
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

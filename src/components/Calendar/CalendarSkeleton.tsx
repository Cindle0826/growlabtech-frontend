// components/calendar/CalendarSkeleton.tsx
export default function CalendarSkeleton() {
  return (
    <div className="space-y-6">
      {/* 工具列骨架 */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-9 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-9 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* 行事曆骨架 */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4">
          <div className="animate-pulse">
            {/* 行事曆頭部 */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 rounded w-12"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            
            {/* 星期標題 */}
            <div className="grid grid-cols-7 gap-px mb-2">
              {['日', '一', '二', '三', '四', '五', '六'].map((day, i) => (
                <div key={i} className="h-8 bg-gray-100 rounded flex items-center justify-center">
                  <div className="h-4 bg-gray-200 rounded w-4"></div>
                </div>
              ))}
            </div>
            
            {/* 行事曆網格 */}
            <div className="grid grid-cols-7 gap-px">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-50 border border-gray-100 p-1">
                  <div className="h-4 bg-gray-200 rounded w-6 mb-2"></div>
                  {Math.random() > 0.7 && (
                    <div className="h-3 bg-blue-200 rounded w-full mb-1"></div>
                  )}
                  {Math.random() > 0.8 && (
                    <div className="h-3 bg-green-200 rounded w-3/4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


import React from 'react';
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const sprintStart = 24;
  const sprintEnd = 31;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <CalendarIcon size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Sprint Schedule</h2>
              <p className="text-xs text-slate-500 font-medium tracking-tight uppercase">October 2024</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-700">October 2024</h3>
            <div className="flex gap-1">
              <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><ChevronLeft size={18} /></button>
              <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-1">{d}</div>
            ))}
            {Array.from({ length: 2 }).map((_, i) => <div key={`empty-${i}`} />)}
            {days.map(day => {
              const isInSprint = day >= sprintStart && day <= sprintEnd;
              const isToday = day === 26;
              return (
                <div 
                  key={day} 
                  className={`
                    relative h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all
                    ${isInSprint ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}
                    ${isToday ? 'ring-2 ring-blue-600 ring-offset-2' : ''}
                  `}
                >
                  {day}
                  {isToday && <div className="absolute bottom-1 w-1 h-1 bg-blue-600 rounded-full" />}
                </div>
              );
            })}
          </div>

          <div className="mt-6 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Sprint</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="text-sm font-semibold text-slate-700">Oct 24 - Oct 31</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sprint ends in 5 days. Make sure all items in "Review" are verified before the retrospective on Friday.
            </p>
          </div>
        </div>

        <div className="p-4 border-t bg-slate-50/50">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            Close Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;

import React, { useState } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LabScheduleModal({ isOpen, onClose, labName, allClasses }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4)); // Default to May 2026

  if (!isOpen) return null;

  const labSessions = allClasses
    .filter(cls => cls.lab === labName)
    .flatMap(cls => cls.sessions.map(s => ({ ...s, batch: cls.id })));

  // Calendar Helpers
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let d = 1; d <= totalDays; d++) calendarDays.push(d);

  const getSessionsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return labSessions.filter(s => s.date === dateStr);
  };

  const getDayStyle = (sessions) => {
    if (sessions.length === 0) return { bg: '#FFFFFF', text: '#374151', border: '#E5E7EB', label: 'Available' };
    if (sessions.length === 1) return { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA', label: 'Partially Booked' }; // Orange
    return { bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB', label: 'Not Available' }; // Grey
  };

  return (
    <div className="modal-overlay" style={{ backdropFilter: 'blur(4px)' }}>
      <div className="modal-content" style={{ maxWidth: '950px', width: '95%', padding: '0', borderRadius: '24px', overflow: 'hidden' }}>
        
        {/* Header */}
        <div className="bg-gray-900 p-8 text-white flex justify-between items-start">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <Calendar size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{labName}</h2>
              <p className="text-gray-400 text-sm mt-1">Real-time Lab Availability & Booking Calendar</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <X size={24} className="text-white" />
          </button>
        </div>

        <div className="p-8 bg-white">
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-8 px-2">
            <h3 className="text-2xl font-bold text-gray-800">{monthNames[month]} {year}</h3>
            <div className="flex gap-3">
              <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="btn btn-outline border-gray-200 p-3 rounded-xl shadow-sm">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="btn btn-outline border-gray-200 p-3 rounded-xl shadow-sm">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-7 gap-3">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
              <div key={d} className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{d.slice(0, 3)}</div>
            ))}

            {calendarDays.map((day, idx) => {
              const sessions = getSessionsForDay(day);
              const style = getDayStyle(sessions);
              
              return (
                <div 
                  key={idx} 
                  className={`min-h-[130px] p-4 rounded-2xl border transition-all ${!day ? 'border-transparent' : ''}`}
                  style={{ 
                    backgroundColor: day ? style.bg : 'transparent',
                    borderColor: day ? style.border : 'transparent',
                    boxShadow: day && sessions.length === 0 ? '0 1px 3px rgba(0,0,0,0.02)' : 'none'
                  }}
                >
                  {day && (
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-lg font-black" style={{ color: style.text }}>{day}</span>
                        {sessions.length > 0 && (
                          <div className={`w-2.5 h-2.5 rounded-full ${sessions.length === 1 ? 'bg-orange-500' : 'bg-gray-400'}`}></div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {sessions.map((s, sidx) => (
                          <div key={sidx} className="flex flex-col p-2 bg-white/80 rounded-lg border border-inherit shadow-sm">
                            <span className="text-[10px] font-bold text-gray-800 truncate">{s.batch}</span>
                            <div className="flex items-center gap-1 text-[9px] text-gray-500">
                              <Clock size={8} /> {s.startTime}
                            </div>
                          </div>
                        ))}
                        {sessions.length === 0 && (
                          <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">Empty</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* New Legend */}
          <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between">
            <div className="flex gap-8">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-lg border border-gray-200 bg-white"></div>
                <span className="text-sm font-bold text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-lg border border-orange-200 bg-orange-50"></div>
                <span className="text-sm font-bold text-orange-600">Partially Booked (Orange)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-lg border border-gray-300 bg-gray-100"></div>
                <span className="text-sm font-bold text-gray-500">Not Available (Grey)</span>
              </div>
            </div>
            <button onClick={onClose} className="px-12 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl">
              Close Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

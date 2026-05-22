import React from 'react';
import { Monitor, Shield, Users, Settings, Info, Plus, Pencil, BookOpen, Clock } from 'lucide-react';

const sessions = [
  { id: 1, code: 'PY-101', title: 'Python Fundamentals', category: 'Core Module • Basic Syntax', trainer: 'Dr. Sarah Lee', status: 'Upcoming', date: 'May 20, 2026' },
  { id: 2, code: 'PY-201', title: 'Advanced Data Structures', category: 'Algorithms • Optimization', trainer: 'Dr. Sarah Lee', status: 'Upcoming', date: 'May 22, 2026' },
  { id: 3, code: 'PY-301', title: 'Object Oriented Programming', category: 'Architecture • Design Patterns', trainer: 'James Carter', status: 'Upcoming', date: 'May 25, 2026' },
  { id: 4, code: 'PY-401', title: 'Database Connectivity', category: 'Backend • SQL Integration', trainer: 'Michael Chang', status: 'Upcoming', date: 'May 28, 2026' },
];

export default function Materials({ userRole }) {
  const isStudent = userRole === 'Student';
  const isAdminOrTrainer = userRole === 'Admin' || userRole === 'SuperAdmin' || userRole === 'Trainer' || userRole === 'Co-Trainer';

  return (
    <div className="animate-fade-in p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 m-0 tracking-tight">Curriculum Materials</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Access and prepare for your upcoming learning modules</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {sessions.map((session) => (
          <div key={session.id} className="card p-8 flex flex-col gap-6 border-none shadow-sm hover:shadow-xl transition-all group relative overflow-hidden" style={{ borderRadius: '2rem' }}>
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <BookOpen size={120} />
            </div>

            {/* Header Area */}
            <div className="flex justify-between items-start relative z-10">
              <div className="flex gap-2">
                <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-amber-200 shadow-sm">
                  {session.status}
                </span>
                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-indigo-100 shadow-sm">
                  {session.code}
                </span>
              </div>
              <div className="p-2 bg-gray-50 rounded-xl text-gray-400">
                <Monitor size={20} />
              </div>
            </div>

            {/* Title Block */}
            <div className="mt-2 relative z-10">
              <h2 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">{session.title}</h2>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2">{session.category}</p>
            </div>

            {/* Topics List Placeholder */}
            {isAdminOrTrainer && (
              <div className="space-y-3 relative z-10">
                <button className="w-full py-3 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 text-xs font-bold hover:bg-gray-50 hover:border-indigo-200 hover:text-indigo-500 transition-all flex items-center justify-center gap-2">
                  <Plus size={16} /> Add Session Topic
                </button>
              </div>
            )}

            {/* Metadata Rows */}
            <div className="grid grid-cols-2 gap-4 mt-2 relative z-10">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Users size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Lead Trainer</span>
                </div>
                <p className="text-sm font-black text-gray-800">{session.trainer}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Clock size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Scheduled Date</span>
                </div>
                <p className="text-sm font-black text-gray-800">{session.date}</p>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full mt-2 py-4 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-lg shadow-gray-900/10 active:scale-95 relative z-10">
              Preview Material
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

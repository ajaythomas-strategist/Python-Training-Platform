import React from 'react';
import { Monitor, Shield, Users, Settings, Info, Plus, Pencil } from 'lucide-react';

const sessions = [
  { id: 1, code: 'SESSION-1', title: 'Python Fundamentals', category: 'Python Training • Core Module', admin: 'Unassigned', trainer: 'Unassigned', resources: 'Pending', status: 'Upcoming' },
  { id: 2, code: 'SESSION-2', title: 'Advanced Data Structures', category: 'Python Training • Algorithms', admin: 'Unassigned', trainer: 'Unassigned', resources: 'Pending', status: 'Upcoming' },
  { id: 3, code: 'SESSION-3', title: 'Object Oriented Programming', category: 'Python Training • OOP', admin: 'Unassigned', trainer: 'Unassigned', resources: 'Pending', status: 'Upcoming' },
  { id: 4, code: 'SESSION-4', title: 'Database Connectivity', category: 'Python Training • SQL', admin: 'Unassigned', trainer: 'Unassigned', resources: 'Pending', status: 'Upcoming' },
];

export default function Materials({ userRole }) {
  const isAdmin = userRole === 'Admin';
  return (
    <div className="animate-fade-in p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 m-0">Session Materials</h1>
          <p className="text-sm text-gray-500">Manage and audit educational resources by session</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sessions.map((session) => (
          <div key={session.id} className="card p-6 flex flex-col gap-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            {/* Header Area */}
            <div className="flex justify-between items-start">
              <span className="bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-orange-200">
                {session.status}
              </span>
              <Monitor size={18} className="text-gray-400" />
            </div>

            {/* Title Block */}
            <div className="mt-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{session.code}</span>
              <h2 className="text-lg font-bold text-gray-800 mt-1 leading-tight">{session.title}</h2>
              <p className="text-xs text-gray-500 font-medium mt-1">{session.category}</p>
            </div>

            {/* Topics List Placeholder */}
            {!isAdmin && (
              <div className="space-y-3">
                <button className="w-full py-2.5 border-2 border-dashed border-gray-100 rounded-xl text-gray-400 text-xs font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                  <Plus size={14} /> Add Topic
                </button>
              </div>
            )}

            {/* Metadata Rows */}
            <div className="space-y-3 mt-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-500">
                  <Shield size={14} />
                  <span className="text-xs font-semibold">Material Admin</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-800">{session.admin}</span>
                  {!isAdmin && <Pencil size={12} className="text-gray-300 cursor-pointer hover:text-indigo-600" />}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-500">
                  <Users size={14} />
                  <span className="text-xs font-semibold">Lead Trainer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-800">{session.trainer}</span>
                  {!isAdmin && <Pencil size={12} className="text-gray-300 cursor-pointer hover:text-indigo-600" />}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-500">
                  <Settings size={14} />
                  <span className="text-xs font-semibold">Resources</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-800">{session.resources}</span>
                  {!isAdmin && <Pencil size={12} className="text-gray-300 cursor-pointer hover:text-indigo-600" />}
                </div>
              </div>

              <div className="flex items-start gap-2 text-gray-400 bg-gray-50 p-2 rounded-lg border border-gray-100 mt-2">
                <Info size={14} className="mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-500">Pending Assignment</span>
                  <span className="text-[10px] font-medium text-gray-400 italic">Schedule TBD</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full mt-2 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 text-xs font-bold hover:bg-gray-50 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm">
              View Material
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

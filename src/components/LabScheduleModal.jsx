import React from 'react';
import { X, Calendar, Clock, MapPin } from 'lucide-react';

export default function LabScheduleModal({ isOpen, onClose, labName, allClasses }) {
  if (!isOpen) return null;

  const labSessions = allClasses
    .filter(cls => cls.lab === labName)
    .flatMap(cls => cls.sessions.map(s => ({ ...s, batch: cls.id, trainer: cls.trainer })))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px', width: '90%' }}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Calendar size={24} className="text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-800">Schedule for {labName}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
          {labSessions.length > 0 ? (
            labSessions.map((session, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-gray-900">{session.date}</span>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={12} />
                    {session.startTime} - {session.endTime}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="badge badge-blue" style={{ fontSize: '10px' }}>{session.batch}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{session.trainer}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center py-10 text-gray-400">
              <Calendar size={48} strokeWidth={1} className="mb-2" />
              <p>No sessions scheduled for this lab.</p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="btn btn-primary px-8">Close</button>
        </div>
      </div>
    </div>
  );
}

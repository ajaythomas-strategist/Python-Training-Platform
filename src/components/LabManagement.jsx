import React, { useState } from 'react';
import { Plus, Users, Shield, Monitor, Calendar, Info, Clock, Cpu } from 'lucide-react';
import { labs, classes as allClasses } from '../data/mockData';
import LabScheduleModal from './LabScheduleModal';

export default function LabManagement() {
  const today = new Date().toISOString().split('T')[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  const [selectedLabSchedule, setSelectedLabSchedule] = useState(null);

  const getLabStatus = (labName) => {
    const startD = fromDate || toDate || today;
    const endD = toDate || fromDate || today;
    
    for (const cls of allClasses) {
      if (cls.lab === labName) {
        for (const session of cls.sessions) {
          if (session.date >= startD && session.date <= endD) {
            if (startTime && endTime) {
              if (startTime < session.endTime && session.startTime < endTime) {
                return { status: 'Busy', type: 'danger', class: cls.id, session: `${session.startTime} - ${session.endTime}` };
              }
            } else {
              return { status: 'Busy', type: 'danger', class: cls.id, session: `${session.startTime} - ${session.endTime}` };
            }
          }
        }
      }
    }
    return { status: 'Available', type: 'success' };
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Lab Management</h2>
          <p className="text-sm text-gray-500">Defaulting to Today's Status: <strong>{today}</strong></p>
        </div>
        
        <div className="flex flex-col gap-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date From:</span>
              <input 
                type="date" 
                value={fromDate} 
                onChange={(e) => setFromDate(e.target.value)}
                className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date To:</span>
              <input 
                type="date" 
                value={toDate} 
                onChange={(e) => setToDate(e.target.value)}
                className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Time:</span>
              <input 
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)}
                className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">End Time:</span>
              <input 
                type="time" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)}
                className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        <button className="btn btn-primary self-start">
          <Plus size={18} />
          Create New Lab
        </button>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.5rem' }}>
        {labs.map(lab => {
          const availability = getLabStatus(lab.name);
          const isBusy = availability.type === 'danger';
          
          return (
            <div key={lab.id} className="card flex-col transition-all duration-300" 
              style={{ 
                gap: '1rem', 
                minHeight: '420px',
                backgroundColor: isBusy ? '#F3F4F6' : '#F0FDF4', // Grey for Busy, Light Green for Available
                border: isBusy ? '1px solid #D1D5DB' : '1px solid #BBF7D0',
                opacity: isBusy ? 0.9 : 1
              }}>
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <span className={`badge ${isBusy ? 'badge-neutral' : 'badge-green'}`} 
                    style={{ 
                      alignSelf: 'flex-start', 
                      padding: '4px 12px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      backgroundColor: isBusy ? '#6B7280' : '#22C55E',
                      color: 'white'
                    }}>
                    {availability.status}
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{lab.id}</span>
                </div>
                <button 
                  onClick={() => setSelectedLabSchedule(lab.name)}
                  className="p-2 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                  title="View Schedule Calendar"
                >
                  <Calendar size={20} color="#6366F1" />
                </button>
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">{lab.name}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className={`w-2 h-2 rounded-full ${isBusy ? 'bg-gray-400' : 'bg-green-400'}`}></div>
                  Computer Lab • {lab.department}
                </div>
              </div>
              
              <div className="flex flex-col gap-3 py-4 border-y border-gray-100" style={{ fontSize: '0.875rem' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Shield size={16} className="text-gray-500" />
                    <span className="font-medium">System Admin</span>
                  </div>
                  <span className="font-semibold text-gray-800">{lab.assignedAdmin}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={16} className="text-gray-500" />
                    <span className="font-medium">Lab Trainer</span>
                  </div>
                  <span className="font-semibold text-gray-800">{lab.assignedTrainer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Cpu size={16} className="text-gray-500" />
                    <span className="font-medium">Workstations</span>
                  </div>
                  <span className="font-semibold text-gray-800">{lab.capacity} Units</span>
                </div>
              </div>

              {isBusy && availability.class && (
                <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-start gap-2">
                  <Info size={14} className="text-gray-500 mt-0.5" />
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Occupied by <strong>{availability.class}</strong>
                    </p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">
                      Time Slot: {availability.session}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-auto flex gap-3">
                <button className="btn btn-outline flex-1 justify-center py-2.5" style={{ backgroundColor: 'white' }}>
                  Edit Lab
                </button>
                <button 
                  onClick={() => setSelectedLabSchedule(lab.name)}
                  className="btn btn-primary flex-1 justify-center py-2.5"
                >
                  View Schedule
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <LabScheduleModal 
        isOpen={!!selectedLabSchedule}
        onClose={() => setSelectedLabSchedule(null)}
        labName={selectedLabSchedule}
        allClasses={allClasses}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { Plus, Users, Shield, Monitor, Info, Cpu, X } from 'lucide-react';
import { labs as initialLabs, classes as allClasses } from '../data/mockData';
import AddLabModal from './AddLabModal';
import MaintenanceModal from './MaintenanceModal';
import EditLabModal from './EditLabModal';

export default function LabManagement({ userRole }) {
  const [labsList, setLabsList] = useState(initialLabs);
  const [isAddLabOpen, setIsAddLabOpen] = useState(false);
  const isAdmin = userRole === 'Admin';
  const today = new Date().toISOString().split('T')[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedLabForMaintenance, setSelectedLabForMaintenance] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLabForEdit, setSelectedLabForEdit] = useState(null);

  const getLabStatus = (labName, labData) => {
    const startD = fromDate || toDate || today;
    const endD = toDate || fromDate || today;
    
    // Check Maintenance Status first
    if (labData?.maintenance) {
      const maintStart = labData.maintenance.startDate;
      const maintEnd = labData.maintenance.endDate;
      // Overlap logic: startD <= maintEnd AND endD >= maintStart
      if (startD <= maintEnd && endD >= maintStart) {
        return { 
          status: 'Maintenance', 
          type: 'warning', 
          reason: labData.maintenance.reason,
          dates: `${maintStart} to ${maintEnd}`
        };
      }
    }
    
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

  const handleAddLab = (newLab) => {
    setLabsList([...labsList, newLab]);
  };

  const handleSetMaintenance = (labId, maintenanceData) => {
    setLabsList(labsList.map(lab => 
      lab.id === labId 
        ? { ...lab, maintenance: maintenanceData, status: 'Not Available' } 
        : lab
    ));
  };

  const handleUpdateLab = (updatedLab) => {
    setLabsList(labsList.map(lab => lab.id === updatedLab.id ? updatedLab : lab));
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Lab Management</h2>
          <p className="text-sm text-gray-500">Facility tracking for <strong>{today}</strong></p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400 uppercase">From:</span>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="px-2 py-1 border rounded text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400 uppercase">To:</span>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="px-2 py-1 border rounded text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400 uppercase">Time:</span>
              <div className="flex items-center gap-1">
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="px-2 py-1 border rounded text-sm outline-none w-24" />
                <span className="text-gray-300">-</span>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="px-2 py-1 border rounded text-sm outline-none w-24" />
              </div>
            </div>
          </div>
        </div>

        {!isAdmin && (
          <button className="btn btn-primary self-start" onClick={() => setIsAddLabOpen(true)}>
            <Plus size={18} />
            Create New Lab
          </button>
        )}
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.5rem' }}>
        {labsList.map(lab => {
          const availability = getLabStatus(lab.name, lab);
          const isBusy = availability.type === 'danger';
          const isMaintenance = availability.type === 'warning';
          
          let cardBg = '#FFFFFF';
          let badgeBg = '#10B981';
          let iconColor = 'text-green-600';
          let iconBg = 'bg-green-50 border-green-100';
          let statusDot = 'bg-green-500';

          if (isBusy) {
            cardBg = '#F3F4F6';
            badgeBg = '#6B7280';
            iconColor = 'text-gray-500';
            iconBg = 'bg-gray-200 border-gray-300';
            statusDot = 'bg-gray-400';
          } else if (isMaintenance) {
            cardBg = '#FFFBEB';
            badgeBg = '#F59E0B'; // Amber
            iconColor = 'text-amber-600';
            iconBg = 'bg-amber-100 border-amber-200';
            statusDot = 'bg-amber-500';
          }
          
          return (
            <div key={lab.id} className="card flex-col transition-all duration-300" 
              style={{ 
                gap: '1rem', 
                minHeight: '380px',
                backgroundColor: cardBg, 
                border: '1px solid #E5E7EB',
                boxShadow: (isBusy || isMaintenance) ? 'none' : '0 1px 3px rgba(0,0,0,0.05)'
              }}>
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <span className={`badge`} 
                    style={{ 
                      alignSelf: 'flex-start', 
                      padding: '4px 12px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      backgroundColor: badgeBg,
                      color: 'white'
                    }}>
                    {availability.status}
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{lab.id}</span>
                </div>
                <div className={`p-2 rounded-lg border ${iconBg} transition-colors`}>
                  <Monitor size={20} className={iconColor} />
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">{lab.name}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className={`w-2 h-2 rounded-full ${statusDot}`}></div>
                  Computer Lab • {lab.department}
                </div>
              </div>
              
              <div className="flex flex-col gap-4 py-5 border-y border-gray-100" style={{ fontSize: '0.875rem' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Monitor size={18} className="text-gray-400" />
                    <span className="font-medium">Department</span>
                  </div>
                  <span className="font-semibold text-gray-800">{lab.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Cpu size={18} className="text-gray-400" />
                    <span className="font-medium">Workstations</span>
                  </div>
                  <span className="font-semibold text-gray-800">{lab.capacity} Units</span>
                </div>
              </div>

              {isBusy && availability.class && (
                <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-start gap-2 shadow-sm">
                  <Info size={14} className="text-red-400 mt-0.5" />
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Booked by <strong>{availability.class}</strong>
                    </p>
                    <p className="text-[10px] text-red-500 font-bold uppercase mt-1">
                      Slot: {availability.session}
                    </p>
                  </div>
                </div>
              )}

              {!isAdmin && (
                <div className="mt-auto flex gap-3">
                  <button 
                    className="btn btn-outline flex-1 justify-center py-2.5 text-sm font-bold transition-all hover:bg-gray-50 bg-white"
                    onClick={() => {
                      setSelectedLabForEdit(lab);
                      setIsEditModalOpen(true);
                    }}
                  >
                    Edit Lab
                  </button>
                  <button 
                    className="btn btn-primary flex-1 justify-center py-2.5 text-sm font-bold shadow-md shadow-indigo-100"
                    onClick={() => {
                      setSelectedLabForMaintenance(lab);
                      setIsMaintenanceModalOpen(true);
                    }}
                  >
                    Offline
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AddLabModal 
        isOpen={isAddLabOpen} 
        onClose={() => setIsAddLabOpen(false)} 
        onAdd={handleAddLab}
      />

      <MaintenanceModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => {
          setIsMaintenanceModalOpen(false);
          setSelectedLabForMaintenance(null);
        }}
        onSetMaintenance={handleSetMaintenance}
        lab={selectedLabForMaintenance}
      />

      <EditLabModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLabForEdit(null);
        }}
        onUpdate={handleUpdateLab}
        lab={selectedLabForEdit}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Wrench, Calendar, AlertTriangle, Monitor, Info } from 'lucide-react';

export default function MaintenanceModal({ isOpen, onClose, onSetMaintenance, lab }) {
  const [activeTab, setActiveTab] = useState('Settings');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setStartDate(lab?.maintenance?.startDate || today);
      setEndDate(lab?.maintenance?.endDate || today);
      setReason(lab?.maintenance?.reason || '');
      setActiveTab('Settings');
    }
  }, [isOpen, lab]);

  if (!isOpen || !lab) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      alert("Please fill in all fields.");
      return;
    }
    
    if (startDate > endDate) {
      alert("End date cannot be before start date.");
      return;
    }

    onSetMaintenance(lab.id, { startDate, endDate, reason });
    onClose();
  };

  const handleClear = () => {
    onSetMaintenance(lab.id, null);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden animate-scale-in border border-gray-100">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
              <Monitor size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">{lab.name}</h2>
              <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                {lab.department} • {lab.capacity} Workstations
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 mt-4 flex items-center gap-8 border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('Settings')}
            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'Settings' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Maintenance Settings
            {activeTab === 'Settings' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full animate-fade-in" />}
          </button>
          <button 
            onClick={() => setActiveTab('Details')}
            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'Details' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Lab Specifications
            {activeTab === 'Details' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full animate-fade-in" />}
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 overflow-y-auto min-h-[400px]">
          {activeTab === 'Settings' ? (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-900">Manage Maintenance Window</p>
                  <p className="text-sm text-amber-700 mt-1 leading-relaxed">
                    Set a date range to mark this lab as offline. This will alert staff that the facility is currently unavailable.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Start Date</label>
                    <div className="relative group">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input 
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium text-gray-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">End Date</label>
                    <div className="relative group">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input 
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium text-gray-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Maintenance Reason</label>
                  <textarea 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe the maintenance work..."
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium text-gray-700 min-h-[120px] resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit" 
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                  >
                    <Wrench size={18} />
                    Update Maintenance Status
                  </button>
                  {lab.maintenance && (
                    <button 
                      type="button" 
                      onClick={handleClear}
                      className="px-6 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto grid grid-cols-2 gap-6">
              {[
                { label: 'Department', value: lab.department, icon: Monitor },
                { label: 'Admin', value: lab.assignedAdmin, icon: Info },
                { label: 'Lead Trainer', value: lab.assignedTrainer, icon: Info },
                { label: 'Total Units', value: `${lab.capacity} Workstations`, icon: Monitor },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-base font-bold text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            Close Management
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Monitor, Info, Cpu, AlertTriangle, CheckCircle, XCircle, Loader } from 'lucide-react';
import AddLabModal from './AddLabModal';
import MaintenanceModal from './MaintenanceModal';
import EditLabModal from './EditLabModal';
import { useStore } from '../store/useStore';
import { baseUrl } from './utils/api';

// Inline toast notification system
function Toast({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '14px 20px', borderRadius: '16px', minWidth: '280px',
          background: t.type === 'success' ? '#ECFDF5' : t.type === 'error' ? '#FEF2F2' : '#F0F9FF',
          border: `1px solid ${t.type === 'success' ? '#A7F3D0' : t.type === 'error' ? '#FECACA' : '#BAE6FD'}`,
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
          animation: 'fadeIn 0.3s ease',
          fontSize: '0.875rem', fontWeight: 600,
          color: t.type === 'success' ? '#065F46' : t.type === 'error' ? '#991B1B' : '#0369A1',
        }}>
          {t.type === 'success' ? <CheckCircle size={18} /> : t.type === 'error' ? <XCircle size={18} /> : <Info size={18} />}
          {t.message}
        </div>
      ))}
    </div>
  );
}

export default function LabManagement({ userRole }) {
  const token = useStore((state) => state.token);
  const [labsList, setLabsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddLabOpen, setIsAddLabOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedLabForMaintenance, setSelectedLabForMaintenance] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLabForEdit, setSelectedLabForEdit] = useState(null);
  const [toasts, setToasts] = useState([]);

  const today = new Date().toISOString().split('T')[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const isAdmin = userRole === 'Admin';
  const canWrite = userRole === 'SuperAdmin' || userRole === 'Admin';

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  // ── Fetch labs from backend ────────────────────────────────────────────────
  const fetchLabs = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/labs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch labs');
      const data = await res.json();
      setLabsList(data);
    } catch (err) {
      showToast('Could not load labs from server', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, showToast]);

  useEffect(() => {
    fetchLabs();
  }, [fetchLabs]);

  // ── Determine display status from date/time filter ────────────────────────
  const getLabDisplayStatus = (lab) => {
    const startD = fromDate || today;
    const endD = toDate || today;

    // Maintenance window overlap check
    if (lab.maintenance?.startDate && lab.maintenance?.endDate) {
      if (startD <= lab.maintenance.endDate && endD >= lab.maintenance.startDate) {
        return {
          status: 'Maintenance',
          type: 'warning',
          reason: lab.maintenance.reason,
          dates: `${lab.maintenance.startDate} to ${lab.maintenance.endDate}`,
        };
      }
    }

    // Status from the DB field (Occupied means a class is currently assigned)
    if (lab.status === 'Occupied') {
      return { status: 'Occupied', type: 'danger' };
    }

    if (lab.status === 'Maintenance') {
      return { status: 'Maintenance', type: 'warning' };
    }

    return { status: 'Available', type: 'success' };
  };

  // ── Create lab ─────────────────────────────────────────────────────────────
  const handleAddLab = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        department: formData.department,
        capacity: parseInt(formData.capacity, 10),
      };
      const res = await fetch(`${baseUrl}/api/labs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create lab');
      setLabsList((prev) => [...prev, data]);
      showToast(`Lab "${data.name}" created successfully!`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // ── Edit lab ───────────────────────────────────────────────────────────────
  const handleUpdateLab = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        department: formData.department,
        capacity: parseInt(formData.capacity, 10),
      };
      const res = await fetch(`${baseUrl}/api/labs/${formData._id || formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update lab');
      setLabsList((prev) => prev.map((l) => (l._id === data._id ? data : l)));
      showToast(`Lab "${data.name}" updated!`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // ── Maintenance toggle ─────────────────────────────────────────────────────
  const handleSetMaintenance = async (labId, maintenanceData) => {
    try {
      const res = await fetch(`${baseUrl}/api/labs/${labId}/maintenance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ maintenance: maintenanceData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update maintenance');
      setLabsList((prev) => prev.map((l) => (l._id === data._id ? data : l)));
      const msg = maintenanceData
        ? `"${data.name}" set to Maintenance mode`
        : `"${data.name}" is back Online`;
      showToast(msg, maintenanceData ? 'info' : 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // ── Card style helpers ─────────────────────────────────────────────────────
  const getCardTheme = (availType) => {
    if (availType === 'danger')  return { cardBg: '#F3F4F6', badgeBg: '#6B7280', iconColor: 'text-gray-500', iconBg: 'bg-gray-200 border-gray-300', statusDot: 'bg-gray-400' };
    if (availType === 'warning') return { cardBg: '#FFFBEB', badgeBg: '#F59E0B', iconColor: 'text-amber-600', iconBg: 'bg-amber-100 border-amber-200', statusDot: 'bg-amber-500' };
    return { cardBg: '#FFFFFF', badgeBg: '#10B981', iconColor: 'text-green-600', iconBg: 'bg-green-50 border-green-100', statusDot: 'bg-green-500' };
  };

  return (
    <div className="p-6 animate-fade-in">
      <Toast toasts={toasts} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Lab Management</h2>
          <p className="text-sm text-gray-500">Facility tracking for <strong>{today}</strong></p>
        </div>

        {/* Date/Time Availability Filter */}
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

        {canWrite && (
          <button className="btn btn-primary self-start" onClick={() => setIsAddLabOpen(true)}>
            <Plus size={18} />
            Create New Lab
          </button>
        )}
      </div>

      {/* Lab Grid */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Loading labs…</p>
        </div>
      ) : labsList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8' }}>
          <Monitor size={40} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
          <p style={{ fontSize: '1rem', fontWeight: 600 }}>No labs found.</p>
          <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Create your first lab using the button above.</p>
        </div>
      ) : (
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.5rem' }}>
          {labsList.map((lab) => {
            const availability = getLabDisplayStatus(lab);
            const { cardBg, badgeBg, iconColor, iconBg, statusDot } = getCardTheme(availability.type);
            const isBusy = availability.type === 'danger';
            const isMaintenance = availability.type === 'warning';

            return (
              <div
                key={lab._id}
                className="card flex-col transition-all duration-300"
                style={{
                  gap: '1rem',
                  minHeight: '380px',
                  backgroundColor: cardBg,
                  border: '1px solid #E5E7EB',
                  boxShadow: (isBusy || isMaintenance) ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                {/* Card Header */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <span
                      className="badge"
                      style={{ alignSelf: 'flex-start', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: badgeBg, color: 'white' }}
                    >
                      {availability.status}
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {lab.department || 'Lab'}
                    </span>
                  </div>
                  <div className={`p-2 rounded-lg border ${iconBg} transition-colors`}>
                    <Monitor size={20} className={iconColor} />
                  </div>
                </div>

                {/* Lab Name & Sub-info */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">{lab.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className={`w-2 h-2 rounded-full ${statusDot}`}></div>
                    Computer Lab • {lab.department || 'General'}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-col gap-4 py-5 border-y border-gray-100" style={{ fontSize: '0.875rem' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Monitor size={18} className="text-gray-400" />
                      <span className="font-medium">Department</span>
                    </div>
                    <span className="font-semibold text-gray-800">{lab.department || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Cpu size={18} className="text-gray-400" />
                      <span className="font-medium">Workstations</span>
                    </div>
                    <span className="font-semibold text-gray-800">{lab.capacity} Units</span>
                  </div>
                  {lab.assignedAdmin?.name && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Info size={18} className="text-gray-400" />
                        <span className="font-medium">Admin</span>
                      </div>
                      <span className="font-semibold text-gray-800">{lab.assignedAdmin.name}</span>
                    </div>
                  )}
                </div>

                {/* Maintenance info banner */}
                {isMaintenance && availability.dates && (
                  <div className="bg-white p-3 rounded-lg border border-amber-200 flex items-start gap-2 shadow-sm">
                    <AlertTriangle size={14} className="text-amber-500 mt-0.5" />
                    <div className="flex flex-col">
                      <p className="text-xs text-gray-700 leading-relaxed">
                        Maintenance: <strong>{availability.reason || 'Scheduled'}</strong>
                      </p>
                      <p className="text-[10px] text-amber-600 font-bold uppercase mt-1">
                        {availability.dates}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {canWrite && (
                  <div className="mt-auto flex gap-3">
                    <button
                      className="btn btn-outline flex-1 justify-center py-2.5 text-sm font-bold transition-all hover:bg-gray-50 bg-white"
                      onClick={() => { setSelectedLabForEdit(lab); setIsEditModalOpen(true); }}
                    >
                      Edit Lab
                    </button>
                    <button
                      className="btn btn-primary flex-1 justify-center py-2.5 text-sm font-bold shadow-md shadow-indigo-100"
                      onClick={() => { setSelectedLabForMaintenance(lab); setIsMaintenanceModalOpen(true); }}
                    >
                      {isMaintenance ? 'Bring Online' : 'Set Offline'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AddLabModal
        isOpen={isAddLabOpen}
        onClose={() => setIsAddLabOpen(false)}
        onAdd={handleAddLab}
      />

      <MaintenanceModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => { setIsMaintenanceModalOpen(false); setSelectedLabForMaintenance(null); }}
        onSetMaintenance={handleSetMaintenance}
        lab={selectedLabForMaintenance}
      />

      <EditLabModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedLabForEdit(null); }}
        onUpdate={handleUpdateLab}
        lab={selectedLabForEdit}
      />
    </div>
  );
}

import React from 'react';
import { X, CheckCircle, Clock, XCircle } from 'lucide-react';
import { users } from '../data/mockData';

export default function StaffSelectionModal({ isOpen, onClose, role, onSelect }) {
  if (!isOpen) return null;

  const staffList = users.filter(u => u.role === role);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}
        >
          <X size={20} />
        </button>

        <h2 style={{ marginBottom: '1rem' }}>Select {role}</h2>
        
        <div className="flex flex-col gap-3">
          <div 
            onClick={() => { onSelect('Unassigned'); onClose(); }}
            style={{ padding: '1rem', border: '1px dashed #D1D5DB', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', color: '#6B7280', fontWeight: 500 }}
          >
            Clear / Unassign
          </div>
          
          {staffList.map(staff => (
            <div 
              key={staff.id} 
              onClick={() => { onSelect(staff.name); onClose(); }}
              className="flex items-center justify-between"
              style={{ padding: '1rem', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#F9FAFB' }}
            >
              <div className="flex items-center gap-4">
                <img src={staff.photo} alt={staff.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h3 style={{ fontSize: '1rem', margin: 0, color: '#1F2937' }}>{staff.name}</h3>
                  <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>{staff.department}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <span style={{ fontSize: '0.875rem', color: '#4B5563', fontWeight: 500 }}>
                  Assigned Sessions: {staff.assignedSessionsCount || 0}
                </span>
                <span className={`badge ${
                  staff.availability === 'Available' ? 'badge-green' : 
                  staff.availability === 'Busy' ? 'badge-blue' : 'badge-danger'
                }`} style={{ fontSize: '0.75rem', padding: '2px 6px' }}>
                  {staff.availability === 'Available' && <CheckCircle size={12} style={{ marginRight: '4px' }}/>}
                  {staff.availability === 'Busy' && <Clock size={12} style={{ marginRight: '4px' }}/>}
                  {staff.availability === 'On Leave' && <XCircle size={12} style={{ marginRight: '4px' }}/>}
                  {staff.availability || 'Unknown'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

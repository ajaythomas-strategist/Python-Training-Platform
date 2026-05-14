import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { users } from '../data/mockData';

export default function StaffSelectionModal({ isOpen, onClose, role, onSelect, currentClass, allClasses }) {
  const [selectedCoTrainers, setSelectedCoTrainers] = useState([]);

  useEffect(() => {
    if (isOpen && currentClass && role === 'Co-Trainer') {
      setSelectedCoTrainers(currentClass.coTrainers || []);
    }
  }, [isOpen, currentClass, role]);

  if (!isOpen) return null;

  const staffList = users.filter(u => u.role === role);
  
  const checkConflict = (staffName) => {
    if (!currentClass || !currentClass.sessions || currentClass.sessions.length === 0) return false;
    
    // Find all other classes this staff is assigned to
    const otherClasses = allClasses.filter(c => 
      c.id !== currentClass.id && 
      (c.trainer === staffName || (c.coTrainers && c.coTrainers.includes(staffName)))
    );

    // Check if any of those other classes share a session date and time overlap with current class
    for (const oc of otherClasses) {
      if (!oc.sessions) continue;
      for (const currentSession of currentClass.sessions) {
        for (const os of oc.sessions) {
          if (os.date === currentSession.date) {
            if (currentSession.startTime < os.endTime && os.startTime < currentSession.endTime) {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  const toggleCoTrainer = (name) => {
    setSelectedCoTrainers(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const handleApplyCoTrainers = () => {
    onSelect(selectedCoTrainers);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      <div className="card animate-fade-in flex-col" style={{ display: 'flex', width: '100%', maxWidth: '600px', maxHeight: '80vh', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}
        >
          <X size={20} />
        </button>

        <h2 style={{ marginBottom: '1rem' }}>Select {role}s</h2>
        
        <div className="flex flex-col gap-3" style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
          {role === 'Trainer' && (
            <div 
              onClick={() => { onSelect('Unassigned'); onClose(); }}
              style={{ padding: '1rem', border: '1px dashed #D1D5DB', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', color: '#6B7280', fontWeight: 500 }}
            >
              Clear / Unassign
            </div>
          )}
          
          {staffList.map(staff => {
            const hasConflict = checkConflict(staff.name);
            const isSelected = role === 'Co-Trainer' && selectedCoTrainers.includes(staff.name);
            
            return (
              <div 
                key={staff.id} 
                onClick={() => {
                  if (role === 'Trainer') {
                    onSelect(staff.name);
                  } else {
                    toggleCoTrainer(staff.name);
                  }
                }}
                className="flex items-center justify-between"
                style={{ 
                  padding: '1rem', 
                  border: `1px solid ${isSelected ? 'var(--color-primary)' : '#E5E7EB'}`, 
                  borderRadius: '8px', cursor: 'pointer', 
                  backgroundColor: isSelected ? '#EFF6FF' : (hasConflict ? '#FEF2F2' : '#F9FAFB'),
                  opacity: hasConflict && role === 'Trainer' ? 0.6 : 1
                }}
              >
                <div className="flex items-center gap-4">
                  {role === 'Co-Trainer' && (
                    <input 
                      type="checkbox" 
                      checked={isSelected} 
                      readOnly
                      style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                    />
                  )}
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
                  
                  {hasConflict ? (
                    <span className="badge badge-danger" style={{ fontSize: '0.75rem', padding: '2px 6px' }}>
                      <AlertTriangle size={12} style={{ marginRight: '4px' }}/>
                      Conflict (Date Clash)
                    </span>
                  ) : (
                    <span className={`badge ${
                      staff.availability === 'Available' ? 'badge-green' : 'badge-blue'
                    }`} style={{ fontSize: '0.75rem', padding: '2px 6px' }}>
                      {staff.availability === 'Available' && <CheckCircle size={12} style={{ marginRight: '4px' }}/>}
                      {staff.availability !== 'Available' && <Clock size={12} style={{ marginRight: '4px' }}/>}
                      {staff.availability || 'Unknown'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {role === 'Co-Trainer' && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleApplyCoTrainers}>Apply Selection ({selectedCoTrainers.length})</button>
          </div>
        )}
      </div>
    </div>
  );
}

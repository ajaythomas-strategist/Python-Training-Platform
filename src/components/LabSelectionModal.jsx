import React from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';
import { labs } from '../data/mockData';

export default function LabSelectionModal({ isOpen, onClose, onSelect, currentClass, allClasses }) {
  if (!isOpen) return null;

  const checkConflict = (labName) => {
    if (!currentClass || !currentClass.sessions || currentClass.sessions.length === 0) return false;
    
    // Find all other classes this lab is assigned to
    const otherClasses = allClasses.filter(c => c.id !== currentClass.id && c.lab === labName);

    // Check if any of those other classes share a session date with current class
    for (const oc of otherClasses) {
      if (!oc.sessions) continue;
      for (const currentSession of currentClass.sessions) {
        if (oc.sessions.includes(currentSession)) {
          return true;
        }
      }
    }
    return false;
  };

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

        <h2 style={{ marginBottom: '1rem' }}>Select Lab</h2>
        
        <div className="flex flex-col gap-3">
          <div 
            onClick={() => { onSelect('Unassigned'); onClose(); }}
            style={{ padding: '1rem', border: '1px dashed #D1D5DB', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', color: '#6B7280', fontWeight: 500 }}
          >
            Clear / Unassign
          </div>
          
          {labs.map(lab => {
            const hasConflict = checkConflict(lab.name);

            return (
              <div 
                key={lab.id} 
                onClick={() => {
                  if (!hasConflict) {
                    onSelect(lab.name);
                    onClose();
                  }
                }}
                className="flex items-center justify-between"
                style={{ 
                  padding: '1rem', border: '1px solid #E5E7EB', borderRadius: '8px', 
                  cursor: hasConflict ? 'not-allowed' : 'pointer', 
                  backgroundColor: hasConflict ? '#FEF2F2' : '#F9FAFB',
                  opacity: hasConflict ? 0.6 : 1
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1rem', margin: 0, color: '#1F2937' }}>{lab.name}</h3>
                  <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>{lab.department} • Capacity: {lab.capacity}</span>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  {hasConflict ? (
                    <span className="badge badge-danger" style={{ fontSize: '0.75rem', padding: '2px 6px' }}>
                      <AlertTriangle size={12} style={{ marginRight: '4px' }}/>
                      Conflict (Date Clash)
                    </span>
                  ) : (
                    <span className={`badge ${
                      lab.status === 'Available' ? 'badge-green' : 'badge-danger'
                    }`} style={{ fontSize: '0.75rem', padding: '2px 6px' }}>
                      {lab.status === 'Available' && <CheckCircle size={12} style={{ marginRight: '4px' }}/>}
                      {lab.status === 'Not Available' && <AlertTriangle size={12} style={{ marginRight: '4px' }}/>}
                      {lab.status}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

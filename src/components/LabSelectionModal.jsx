import React from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertTriangle, Building, MapPin } from 'lucide-react';
import { labs } from '../data/mockData';

export default function LabSelectionModal({ isOpen, onClose, onSelect, currentClass, allClasses }) {
  if (!isOpen) return null;

  const checkConflict = (labName) => {
    if (!currentClass || !currentClass.sessions || currentClass.sessions.length === 0) return false;
    
    // Find all other classes this lab is assigned to
    const otherClasses = allClasses.filter(c => c.id !== currentClass.id && c.lab === labName);

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

  return createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.55)', zIndex: 11000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
      backdropFilter: 'blur(16px)',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div className="animate-fade-in" style={{ 
        width: '100%', 
        maxWidth: '560px', 
        maxHeight: '85vh', 
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: '32px',
        padding: '36px',
        boxShadow: '0 30px 60px -15px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.05)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{ 
            position: 'absolute', right: '24px', top: '24px', 
            background: 'none', border: 'none', cursor: 'pointer', 
            color: '#94A3B8', width: '36px', height: '36px',
            borderRadius: '50%', backgroundColor: '#F8FAFC',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#1E293B';
            e.currentTarget.style.backgroundColor = '#F1F5F9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#94A3B8';
            e.currentTarget.style.backgroundColor = '#F8FAFC';
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ 
            padding: '12px', 
            background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)', 
            borderRadius: '16px', 
            color: '#4F46E5',
            display: 'flex'
          }}>
            <Building size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0F172A', margin: 0, letterSpacing: '-0.025em' }}>
              Select Lab
            </h2>
            {currentClass && (
              <span style={{ 
                background: '#EEF2FF', 
                color: '#4F46E5', 
                padding: '4px 12px', 
                borderRadius: '8px', 
                fontSize: '0.75rem', 
                fontWeight: '700',
                display: 'inline-block',
                marginTop: '4px'
              }}>
                Class: {currentClass.id}
              </span>
            )}
          </div>
        </div>
        
        {/* Scrollable Labs List */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px', 
          overflowY: 'auto', 
          flex: 1, 
          paddingRight: '6px',
          marginRight: '-6px'
        }}>
          {/* Clear Option */}
          <div 
            onClick={() => { onSelect('Unassigned'); onClose(); }}
            style={{ 
              padding: '16px', 
              border: '2px dashed #E2E8F0', 
              borderRadius: '20px', 
              cursor: 'pointer', 
              textAlign: 'center', 
              color: '#64748B', 
              fontWeight: '700',
              fontSize: '0.9rem',
              backgroundColor: '#F8FAFC',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.color = '#334155';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F8FAFC';
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <MapPin size={16} /> Clear / Unassign Lab
          </div>
          
          {labs.map(lab => {
            const hasConflict = checkConflict(lab.name);
            const isCurrent = currentClass?.lab === lab.name;

            return (
              <div 
                key={lab.id} 
                onClick={() => {
                  if (!hasConflict) {
                    onSelect(lab.name);
                    onClose();
                  }
                }}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '18px 20px', 
                  borderRadius: '20px', 
                  border: '2px solid',
                  borderColor: isCurrent ? '#4F46E5' : (hasConflict ? '#FEE2E2' : '#F1F5F9'),
                  backgroundColor: isCurrent ? '#F5F7FF' : (hasConflict ? '#FEF2F2' : '#FFFFFF'),
                  cursor: hasConflict ? 'not-allowed' : 'pointer', 
                  opacity: hasConflict ? 0.65 : 1,
                  transition: 'all 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  if (!hasConflict && !isCurrent) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = '#C7D2FE';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(15, 23, 42, 0.04)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!hasConflict && !isCurrent) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#F1F5F9';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: isCurrent ? '#1e1b4b' : '#1F2937', margin: 0 }}>
                    {lab.name}
                  </h3>
                  <span style={{ fontSize: '0.825rem', color: '#64748B', display: 'block', marginTop: '3px', fontWeight: '500' }}>
                    {lab.department} • Capacity: <strong style={{ color: '#475569' }}>{lab.capacity}</strong>
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {hasConflict ? (
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '6px 12px', 
                      borderRadius: '9999px',
                      backgroundColor: '#FFF1F2',
                      color: '#E11D48',
                      border: '1px solid #FDA4AF',
                      fontWeight: '700',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <AlertTriangle size={12} />
                      Date Clash
                    </span>
                  ) : (
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '6px 12px', 
                      borderRadius: '9999px',
                      backgroundColor: lab.status === 'Available' ? '#ECFDF5' : '#FFF7ED',
                      color: lab.status === 'Available' ? '#059669' : '#EA580C',
                      border: lab.status === 'Available' ? '1px solid #A7F3D0' : '1px solid #FED7AA',
                      fontWeight: '700',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {lab.status === 'Available' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                      {lab.status}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}

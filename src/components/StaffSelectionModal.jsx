import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, Clock, AlertTriangle, Users, ArrowRightLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { baseUrl } from './utils/api';

export default function StaffSelectionModal({ isOpen, onClose, role, onSelect, currentClass, allClasses }) {
  const [selectedCoTrainers, setSelectedCoTrainers] = useState([]);
  const [activeTab, setActiveTab] = useState('Trainer'); // Used only when role is 'Transfer-Tabs'
  const [users, setUsers] = useState([]);
  const token = useStore(state => state.token);

  useEffect(() => {
    if (!token || !isOpen) return;
    fetch(`${baseUrl}/api/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data.map(u => ({
        ...u,
        id: u._id,
        name: u.fullName || u.name,
        role: u.role || 'Staff',
        department: u.trainerProfile?.department || 'Unassigned',
        availability: u.trainerProfile?.availability || 'Available',
        rating: u.trainerProfile?.averageRating || 0,
        reviewCount: u.trainerProfile?.reviewCount || 0
      })) : []))
      .catch(console.error);
  }, [token, isOpen]);

  useEffect(() => {
    if (isOpen && currentClass && role === 'Co-Trainer') {
      setSelectedCoTrainers(currentClass.coTrainers || []);
    }
  }, [isOpen, currentClass, role]);

  if (!isOpen) return null;

  const currentRole = role === 'Transfer-Tabs' ? activeTab : role;
  const staffList = users.filter(u => u.role === currentRole);
  
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
    if (role === 'Transfer-Tabs') {
      onSelect({ type: 'Co-Trainer', staff: selectedCoTrainers.join(', ') });
    } else {
      onSelect(selectedCoTrainers);
    }
  };

  const handleSelectStaff = (staffName) => {
    if (currentRole === 'Trainer') {
      if (role === 'Transfer-Tabs') {
        onSelect({ type: 'Trainer', staff: staffName });
      } else {
        onSelect(staffName);
      }
    } else {
      toggleCoTrainer(staffName);
    }
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
        maxWidth: '580px', 
        maxHeight: '85vh', 
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: '32px',
        padding: '36px',
        boxShadow: '0 30px 60px -15px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.05)',
        border: '1px solid rgba(226, 232, 240, 0.8)'
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: role === 'Transfer-Tabs' ? '20px' : '24px' }}>
          <div style={{ 
            padding: '12px', 
            background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)', 
            borderRadius: '16px', 
            color: '#4F46E5',
            display: 'flex'
          }}>
            {role === 'Transfer-Tabs' ? <ArrowRightLeft size={24} /> : <Users size={24} />}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0F172A', margin: 0, letterSpacing: '-0.025em' }}>
              {role === 'Transfer-Tabs' ? 'Transfer Session' : `Select ${currentRole}s`}
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
        
        {/* Tab Controls for Transfer Session */}
        {role === 'Transfer-Tabs' && (
          <div style={{ 
            backgroundColor: '#F1F5F9', 
            borderRadius: '16px', 
            padding: '4px', 
            display: 'flex', 
            gap: '4px',
            marginBottom: '20px'
          }}>
            <button 
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                backgroundColor: activeTab === 'Trainer' ? 'white' : 'transparent',
                color: activeTab === 'Trainer' ? '#4F46E5' : '#64748B',
                boxShadow: activeTab === 'Trainer' ? '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)' : 'none'
              }}
              onClick={() => setActiveTab('Trainer')}
            >
              Transfer Trainer
            </button>
            <button 
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                backgroundColor: activeTab === 'Co-Trainer' ? 'white' : 'transparent',
                color: activeTab === 'Co-Trainer' ? '#4F46E5' : '#64748B',
                boxShadow: activeTab === 'Co-Trainer' ? '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)' : 'none'
              }}
              onClick={() => setActiveTab('Co-Trainer')}
            >
              Transfer Co-Trainer
            </button>
          </div>
        )}
        
        {/* Scrollable Staff List */}
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
          {(currentRole === 'Trainer' || role === 'Transfer-Tabs') && (
            <div 
              onClick={() => { 
                if (role === 'Transfer-Tabs') {
                  onSelect({ type: activeTab, staff: 'Unassigned' });
                } else {
                  onSelect('Unassigned'); 
                }
                onClose(); 
              }}
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
              <Users size={16} /> Clear / Unassign Staff
            </div>
          )}
          
          {staffList.map(staff => {
            const hasConflict = checkConflict(staff.name);
            const isSelected = currentRole === 'Co-Trainer' && selectedCoTrainers.includes(staff.name);
            const isCurrent = (currentRole === 'Trainer' && currentClass?.trainer === staff.name) ||
                              (currentRole === 'Co-Trainer' && isSelected);
            
            return (
              <div 
                key={staff.id} 
                onClick={() => handleSelectStaff(staff.name)}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px', 
                  borderRadius: '20px', 
                  border: '2px solid',
                  borderColor: isCurrent ? '#4F46E5' : (hasConflict ? '#FEE2E2' : '#F1F5F9'),
                  backgroundColor: isCurrent ? '#F5F7FF' : (hasConflict ? '#FEF2F2' : '#FFFFFF'),
                  cursor: 'pointer', 
                  opacity: hasConflict && currentRole === 'Trainer' ? 0.65 : 1,
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent && !(hasConflict && currentRole === 'Trainer')) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = '#C7D2FE';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(15, 23, 42, 0.04)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent && !(hasConflict && currentRole === 'Trainer')) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#F1F5F9';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                  {currentRole === 'Co-Trainer' && (
                    <input 
                      type="checkbox" 
                      checked={isSelected} 
                      readOnly
                      style={{ 
                        width: '18px', 
                        height: '18px', 
                        accentColor: '#4F46E5', 
                        cursor: 'pointer', 
                        borderRadius: '6px',
                        flexShrink: 0
                      }}
                    />
                  )}
                  <img 
                    src={staff.photo} 
                    alt={staff.name} 
                    style={{ 
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '50%', 
                      objectFit: 'cover',
                      border: '2px solid #E2E8F0',
                      flexShrink: 0 
                    }} 
                  />
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: isCurrent ? '#1e1b4b' : '#1F2937', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {staff.name}
                    </h3>
                    <span style={{ fontSize: '0.825rem', color: '#64748B', display: 'block', marginTop: '2px', fontWeight: '500' }}>
                      {staff.department}
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>
                    <span>Sessions: <strong style={{ color: '#475569' }}>{staff.assignedSessionsCount || 0}</strong></span>
                    <span style={{ marginTop: '1px' }}>Hours: <strong style={{ color: '#475569' }}>{staff.hours || 0}h</strong></span>
                  </div>
                  
                  {hasConflict ? (
                    <span style={{ 
                      fontSize: '0.7rem', 
                      padding: '4px 10px', 
                      borderRadius: '9999px',
                      backgroundColor: '#FFF1F2',
                      color: '#E11D48',
                      border: '1px solid #FDA4AF',
                      fontWeight: '700',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <AlertTriangle size={11} />
                      Date Clash
                    </span>
                  ) : (
                    <span style={{ 
                      fontSize: '0.7rem', 
                      padding: '4px 10px', 
                      borderRadius: '9999px',
                      backgroundColor: staff.availability === 'Available' ? '#ECFDF5' : '#EEF2FF',
                      color: staff.availability === 'Available' ? '#059669' : '#4F46E5',
                      border: staff.availability === 'Available' ? '1px solid #A7F3D0' : '1px solid #C7D2FE',
                      fontWeight: '700',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {staff.availability === 'Available' ? <CheckCircle size={11} /> : <Clock size={11} />}
                      {staff.availability || 'Available'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Co-Trainer Action Footer */}
        {currentRole === 'Co-Trainer' && (
          <div style={{ 
            marginTop: '24px', 
            paddingTop: '20px', 
            borderTop: '1px solid #F1F5F9', 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '12px' 
          }}>
            <button 
              className="btn" 
              style={{
                padding: '12px 24px',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                backgroundColor: 'white',
                color: '#64748B',
                fontWeight: '700',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.color = '#334155';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#64748B';
              }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="btn" 
              style={{
                padding: '12px 24px',
                borderRadius: '14px',
                border: 'none',
                backgroundColor: '#4F46E5',
                color: 'white',
                fontWeight: '700',
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: '0 8px 16px -4px rgba(79, 70, 229, 0.25)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4338CA';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 12px 20px -4px rgba(79, 70, 229, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4F46E5';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(79, 70, 229, 0.25)';
              }}
              onClick={handleApplyCoTrainers}
            >
              Apply Selection ({selectedCoTrainers.length})
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

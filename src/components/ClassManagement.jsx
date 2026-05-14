import React, { useState } from 'react';
import { Plus, Users, Calendar, MapPin, Edit2, X } from 'lucide-react';
import { classes as initialClasses } from '../data/mockData';
import StaffSelectionModal from './StaffSelectionModal';
import LabSelectionModal from './LabSelectionModal';

export default function ClassManagement() {
  const [classes, setClasses] = useState(initialClasses);
  
  // Modal State
  const [activeModal, setActiveModal] = useState(null); // 'Trainer', 'Co-Trainer', 'Lab'
  const [activeClassId, setActiveClassId] = useState(null);
  
  // Date Picker State
  const [showDatePickerFor, setShowDatePickerFor] = useState(null);
  const [newDate, setNewDate] = useState('');

  const updateClass = (classId, field, value) => {
    setClasses(classes.map(c => c.id === classId ? { ...c, [field]: value } : c));
  };

  const handleOpenModal = (modalType, classId) => {
    setActiveModal(modalType);
    setActiveClassId(classId);
  };

  const handleModalSelect = (value) => {
    if (activeModal === 'Trainer') updateClass(activeClassId, 'trainer', value);
    if (activeModal === 'Co-Trainer') updateClass(activeClassId, 'coTrainers', value);
    if (activeModal === 'Lab') updateClass(activeClassId, 'lab', value);
    setActiveModal(null);
    setActiveClassId(null);
  };

  const currentClassObj = classes.find(c => c.id === activeClassId);

  const handleAddSession = (classId) => {
    if (!newDate) return;
    const targetClass = classes.find(c => c.id === classId);
    if (targetClass && targetClass.sessions.length < 4) {
      const updatedSessions = [...targetClass.sessions, newDate];
      updateClass(classId, 'sessions', updatedSessions);
    }
    setShowDatePickerFor(null);
    setNewDate('');
  };

  const handleRemoveSession = (classId, sessionIndex) => {
    const targetClass = classes.find(c => c.id === classId);
    if (targetClass) {
      const updatedSessions = targetClass.sessions.filter((_, idx) => idx !== sessionIndex);
      updateClass(classId, 'sessions', updatedSessions);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1>Program & Class Management</h1>
        <button className="btn btn-primary">
          <Plus size={18} />
          Create Class
        </button>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.5rem' }}>
        {classes.map(cls => (
          <div key={cls.id} className="card flex-col" style={{ gap: '1rem', minHeight: '350px' }}>
            
            <div className="flex justify-between items-start">
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{cls.id}</h2>
              <select 
                value={cls.status}
                onChange={(e) => updateClass(cls.id, 'status', e.target.value)}
                style={{
                  padding: '4px 8px', borderRadius: '4px', border: '1px solid #E5E7EB', fontSize: '0.875rem',
                  backgroundColor: cls.status === 'Active' ? '#ECFDF5' : cls.status === 'Completed' ? '#EFF6FF' : '#FFFBEB',
                  color: cls.status === 'Active' ? '#059669' : cls.status === 'Completed' ? '#3B82F6' : '#D97706',
                  fontWeight: 600, outline: 'none', cursor: 'pointer'
                }}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-3 mt-2">
              
              <div className="flex items-start gap-2" style={{ fontSize: '0.875rem', color: '#4B5563' }}>
                <Calendar size={16} color="#F59E0B" style={{ marginTop: '2px' }} />
                <div className="flex-1">
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>Sessions ({cls.sessions.length}/4)</div>
                  {cls.sessions.map((session, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 mb-1" style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                      <span>{new Date(session).toLocaleString()}</span>
                      <button onClick={() => handleRemoveSession(cls.id, idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  
                  {cls.sessions.length < 4 && (
                    <div className="mt-2">
                      {showDatePickerFor === cls.id ? (
                        <div className="flex gap-2">
                          <input 
                            type="datetime-local" 
                            value={newDate} 
                            onChange={(e) => setNewDate(e.target.value)}
                            style={{ flex: 1, padding: '4px 8px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '0.75rem' }}
                          />
                          <button onClick={() => handleAddSession(cls.id)} className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Add</button>
                        </div>
                      ) : (
                        <button onClick={() => setShowDatePickerFor(cls.id)} style={{ background: 'none', border: '1px dashed #D1D5DB', width: '100%', padding: '4px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', color: '#6B7280' }}>
                          + Add Session
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #E5E7EB', margin: '8px 0' }}></div>

              <div 
                className="flex items-center justify-between" 
                style={{ fontSize: '0.875rem', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#F9FAFB' }}
                onClick={() => handleOpenModal('Lab', cls.id)}
              >
                <div className="flex items-center gap-2" style={{ color: '#4B5563' }}>
                  <MapPin size={16} color="#8B5CF6" />
                  <span style={{ fontWeight: 500 }}>Lab:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: cls.lab === 'Unassigned' ? '#9CA3AF' : '#1F2937', fontWeight: 500 }}>{cls.lab}</span>
                  <Edit2 size={12} color="#9CA3AF" />
                </div>
              </div>

              <div 
                className="flex items-center justify-between" 
                style={{ fontSize: '0.875rem', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#F9FAFB' }}
                onClick={() => handleOpenModal('Trainer', cls.id)}
              >
                <div className="flex items-center gap-2" style={{ color: '#4B5563' }}>
                  <Users size={16} color="#06B6D4" />
                  <span style={{ fontWeight: 500 }}>Trainer:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: cls.trainer === 'Unassigned' ? '#9CA3AF' : '#1F2937', fontWeight: 500 }}>{cls.trainer}</span>
                  <Edit2 size={12} color="#9CA3AF" />
                </div>
              </div>

              <div 
                className="flex items-center justify-between" 
                style={{ fontSize: '0.875rem', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#F9FAFB' }}
                onClick={() => handleOpenModal('Co-Trainer', cls.id)}
              >
                <div className="flex items-center gap-2" style={{ color: '#4B5563' }}>
                  <Users size={16} color="#6B7280" />
                  <span style={{ fontWeight: 500 }}>Co-Trainers:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: (!cls.coTrainers || cls.coTrainers.length === 0) ? '#9CA3AF' : '#1F2937', fontWeight: 500 }}>
                    {(!cls.coTrainers || cls.coTrainers.length === 0) ? 'Unassigned' : `${cls.coTrainers.length} Assigned`}
                  </span>
                  <Edit2 size={12} color="#9CA3AF" />
                </div>
              </div>

              {cls.coTrainers && cls.coTrainers.length > 0 && (
                <div className="flex flex-col gap-1 mt-1 pl-8">
                  {cls.coTrainers.map((ct, idx) => (
                    <span key={idx} style={{ fontSize: '0.75rem', color: '#6B7280' }}>• {ct}</span>
                  ))}
                </div>
              )}

            </div>
          </div>
        ))}
      </div>

      <StaffSelectionModal 
        isOpen={activeModal === 'Trainer' || activeModal === 'Co-Trainer'}
        onClose={() => setActiveModal(null)}
        role={activeModal}
        onSelect={handleModalSelect}
        currentClass={currentClassObj}
        allClasses={classes}
      />

      <LabSelectionModal 
        isOpen={activeModal === 'Lab'}
        onClose={() => setActiveModal(null)}
        onSelect={handleModalSelect}
        currentClass={currentClassObj}
        allClasses={classes}
      />
    </div>
  );
}

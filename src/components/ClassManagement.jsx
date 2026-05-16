import React, { useState } from 'react';
import { Plus, Users, Calendar, MapPin, Edit2, X, ArrowRightLeft, Eye, Info } from 'lucide-react';
import { classes as initialClasses } from '../data/mockData';
import StaffSelectionModal from './StaffSelectionModal';
import LabSelectionModal from './LabSelectionModal';

export default function ClassManagement({ userRole, userName }) {
  const [classes, setClasses] = useState(initialClasses);
  const [filters, setFilters] = useState({ Active: true, Upcoming: true, Completed: true });
  const isAdmin = userRole === 'Admin' || userRole === 'Trainer' || userRole === 'Co-Trainer';

  const getComputedStatus = (cls) => {
    // Completed is manual
    if (cls.status === 'Completed') return 'Completed';

    const today = new Date().toISOString().split('T')[0];
    
    // 1. Session Not Selected -> Upcoming
    if (!cls.sessions || cls.sessions.length === 0) return 'Upcoming';

    // 2. Batch from Tomorrow onwards -> Upcoming
    const hasTodaySession = cls.sessions.some(s => s.date === today);
    const earliestSession = cls.sessions.reduce((min, s) => s.date < min ? s.date : min, cls.sessions[0].date);

    // 3. Status Active automatically based on date (today)
    if (hasTodaySession) return 'Active';
    
    if (earliestSession > today) return 'Upcoming';

    // If past sessions exist but not today, and not marked Completed, we keep original status or default to Active
    return cls.status;
  };

  React.useEffect(() => {
    let changed = false;
    const newClasses = classes.map(cls => {
      const autoStatus = getComputedStatus(cls);
      if (cls.status !== autoStatus) {
        changed = true;
        return { ...cls, status: autoStatus };
      }
      return cls;
    });

    if (changed) {
      setClasses(newClasses);
    }
  }, [classes]);

  // Modal State
  const [activeModal, setActiveModal] = useState(null); // 'Trainer', 'Co-Trainer', 'Lab', 'Transfer-Trainer', 'Transfer-CoTrainer'
  const [activeClassId, setActiveClassId] = useState(null);
  const [activeSessionIdx, setActiveSessionIdx] = useState(null);
  const [transferInfo, setTransferInfo] = useState(null);
  
  // Date Picker State
  const [showDatePickerFor, setShowDatePickerFor] = useState(null);
  const [editingSessionIdx, setEditingSessionIdx] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState(['morning', 'afternoon']);
  const [customStartTime, setCustomStartTime] = useState('');
  const [customEndTime, setCustomEndTime] = useState('');

  const updateClass = (classId, field, value) => {
    setClasses(classes.map(c => c.id === classId ? { ...c, [field]: value } : c));
  };

  const handleOpenModal = (modalType, classId) => {
    setActiveModal(modalType);
    setActiveClassId(classId);
  };

  const handleModalSelect = (value) => {
    if (activeModal === 'Transfer-Tabs') {
      const targetClass = classes.find(c => c.id === activeClassId);
      if (targetClass) {
        const updatedSessions = [...targetClass.sessions];
        if (value.type === 'Trainer') {
          updatedSessions[activeSessionIdx] = { ...updatedSessions[activeSessionIdx], transferredTo: value.staff };
        } else {
          updatedSessions[activeSessionIdx] = { ...updatedSessions[activeSessionIdx], transferredCoTrainerTo: value.staff };
        }
        updateClass(activeClassId, 'sessions', updatedSessions);
      }
    }
    setActiveModal(null);
    setActiveClassId(null);
    setActiveSessionIdx(null);
  };

  const currentClassObj = classes.find(c => c.id === activeClassId);

  const handleAddSession = (classId) => {
    if (!newDate || selectedSlots.length === 0) return;
    
    // Validate custom time if selected
    if (selectedSlots.includes('custom') && (!customStartTime || !customEndTime)) return;

    const targetClass = classes.find(c => c.id === classId);
    if (targetClass) {
      let updatedSessions = [...targetClass.sessions];
      if (editingSessionIdx !== null) {
        // Update existing
        const slotType = selectedSlots[0];
        let slot;
        if (slotType === 'morning') slot = { startTime: '09:00', endTime: '12:00' };
        else if (slotType === 'afternoon') slot = { startTime: '13:00', endTime: '16:00' };
        else if (slotType === 'custom') slot = { startTime: customStartTime, endTime: customEndTime };
        
        if (slot && slot.startTime && slot.endTime) {
          updatedSessions[editingSessionIdx] = { ...updatedSessions[editingSessionIdx], date: newDate, ...slot };
        }
      } else {
        // Add new
        selectedSlots.forEach(slotType => {
          let slot;
          if (slotType === 'morning') slot = { startTime: '09:00', endTime: '12:00' };
          else if (slotType === 'afternoon') slot = { startTime: '13:00', endTime: '16:00' };
          else if (slotType === 'custom') slot = { startTime: customStartTime, endTime: customEndTime };
          
          if (slot && slot.startTime && slot.endTime) {
            updatedSessions.push({ date: newDate, ...slot });
          }
        });
      }
      updateClass(classId, 'sessions', updatedSessions);
    }
    setShowDatePickerFor(null);
    setEditingSessionIdx(null);
    setNewDate('');
    setSelectedSlots(['morning', 'afternoon']);
    setCustomStartTime('');
    setCustomEndTime('');
  };

  const handleEditSession = (classId, session, idx) => {
    setShowDatePickerFor(classId);
    setEditingSessionIdx(idx);
    setNewDate(session.date);
    if (session.startTime === '09:00' && session.endTime === '12:00') {
      setSelectedSlots(['morning']);
    } else if (session.startTime === '13:00' && session.endTime === '16:00') {
      setSelectedSlots(['afternoon']);
    } else {
      setSelectedSlots(['custom']);
      setCustomStartTime(session.startTime);
      setCustomEndTime(session.endTime);
    }
  };

  const handleTransferSession = (classId, idx) => {
    setActiveModal('Transfer-Tabs');
    setActiveClassId(classId);
    setActiveSessionIdx(idx);
  };

  const handleRemoveSession = (classId, sessionIndex) => {
    const targetClass = classes.find(c => c.id === classId);
    if (targetClass) {
      const updatedSessions = targetClass.sessions.filter((_, idx) => idx !== sessionIndex);
      updateClass(classId, 'sessions', updatedSessions);
    }
  };

  const filteredClasses = classes.filter(cls => {
    const matchStatus = filters[cls.status];
    const matchTrainer = (userRole === 'Trainer' || userRole === 'Co-Trainer') ? (cls.trainer === userName || cls.coTrainers?.includes(userName)) : true;
    return matchStatus && matchTrainer;
  });

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Class Management</h2>
        
        <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <span className="text-sm font-semibold text-gray-600 mr-2">Filter Status:</span>
          {['Active', 'Upcoming', 'Completed'].map(status => (
            <label key={status} className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={filters[status]} 
                onChange={() => setFilters({ ...filters, [status]: !filters[status] })}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={`text-sm font-medium transition-colors ${filters[status] ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`}>
                {status}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.5rem' }}>
        {filteredClasses.map(cls => (
          <div key={cls.id} className="card flex-col" style={{ gap: '1rem', minHeight: '350px' }}>
            
            <div className="flex justify-between items-start">
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{cls.id}</h2>
              {isAdmin ? (
                <span style={{
                  padding: '4px 12px', borderRadius: '4px', fontSize: '0.875rem',
                  backgroundColor: cls.status === 'Active' ? '#ECFDF5' : cls.status === 'Completed' ? '#EFF6FF' : '#FFFBEB',
                  color: cls.status === 'Active' ? '#059669' : cls.status === 'Completed' ? '#3B82F6' : '#D97706',
                  fontWeight: 700
                }}>
                  {cls.status}
                </span>
              ) : (
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
              )}
            </div>
            
            <div className="flex flex-col gap-3 mt-2">
              
            {/* Sessions Section */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1" style={{ fontSize: '0.875rem', color: '#4B5563' }}>
                <Calendar size={16} color="#F59E0B" />
                <span style={{ fontWeight: 600 }}>Number of Sessions Added: {cls.sessions.length}</span>
              </div>
              
              <div className="flex flex-col gap-2">
                {cls.sessions.map((session, idx) => (
                    <div key={idx} 
                      className="flex flex-col" 
                      style={{ 
                        padding: '12px', 
                        borderRadius: '6px', 
                        backgroundColor: (session.transferredTo || session.transferredCoTrainerTo) ? '#EEF2FF' : '#F9FAFB', 
                        border: (session.transferredTo || session.transferredCoTrainerTo) ? '1px solid #C7D2FE' : '1px solid #E5E7EB',
                      }}
                    >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>
                          {session.date} • {session.startTime} - {session.endTime}
                        </span>
                        {(session.transferredFrom || session.transferredCoTrainerFrom) && (
                          <button 
                            className="p-1 hover:bg-amber-100 rounded text-amber-600 transition-colors"
                            onClick={() => setTransferInfo({
                              type: session.transferredFrom ? 'Trainer' : 'Co-Trainer',
                              from: session.transferredFrom || session.transferredCoTrainerFrom,
                              to: session.transferredTo || 'Current assigned staff'
                            })}
                          >
                            <Eye size={12} />
                          </button>
                        )}
                      </div>
                      {!isAdmin && (
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleTransferSession(cls.id, idx)} 
                            title="Transfer Session"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: (session.transferredTo || session.transferredCoTrainerTo) ? '#4F46E5' : '#6366F1' }}
                          >
                            <ArrowRightLeft size={16} />
                          </button>
                          <button onClick={() => handleEditSession(cls.id, session, idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleRemoveSession(cls.id, idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}>
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                    {session.transferredTo && session.transferredTo !== 'Unassigned' && (
                      <div className="mt-1 flex items-center">
                        <span style={{ fontSize: '0.7rem', color: '#4F46E5', fontWeight: 600 }}>
                          Trainer Transferred to: {session.transferredTo}
                        </span>
                      </div>
                    )}
                    {session.transferredCoTrainerTo && session.transferredCoTrainerTo !== 'Unassigned' && (
                      <div className="mt-1 flex items-center">
                        <span style={{ fontSize: '0.7rem', color: '#4F46E5', fontWeight: 600 }}>
                          Co-Trainer Transferred to: {session.transferredCoTrainerTo}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {!isAdmin && (
                <div className="mt-1">
                  {showDatePickerFor === cls.id ? (
                    <div className="flex flex-col gap-2 p-3 border rounded-xl" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
                      <input 
                        type="date" 
                        value={newDate} 
                        onChange={(e) => setNewDate(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', backgroundColor: 'white' }}
                      />
                      
                      {newDate && (
                        <div className="flex flex-col gap-2 mt-2">
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1">Select Session Timings</p>
                          
                          <div 
                            className="flex items-center justify-between" 
                            style={{ fontSize: '0.875rem', padding: '12px', border: '1px solid', borderColor: selectedSlots.includes('morning') ? '#3B82F6' : '#E5E7EB', borderRadius: '6px', cursor: 'pointer', backgroundColor: selectedSlots.includes('morning') ? '#EFF6FF' : 'white' }}
                            onClick={() => {
                              if (editingSessionIdx !== null) {
                                setSelectedSlots(['morning']);
                              } else {
                                setSelectedSlots(prev => prev.includes('morning') ? prev.filter(s => s !== 'morning') : [...prev, 'morning']);
                              }
                            }}
                          >
                            <span style={{ fontWeight: 500, color: '#1F2937' }}>9 AM - 12 PM</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedSlots.includes('morning') ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                              {selectedSlots.includes('morning') && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>

                          <div 
                            className="flex items-center justify-between" 
                            style={{ fontSize: '0.875rem', padding: '12px', border: '1px solid', borderColor: selectedSlots.includes('afternoon') ? '#3B82F6' : '#E5E7EB', borderRadius: '6px', cursor: 'pointer', backgroundColor: selectedSlots.includes('afternoon') ? '#EFF6FF' : 'white' }}
                            onClick={() => {
                              if (editingSessionIdx !== null) {
                                setSelectedSlots(['afternoon']);
                              } else {
                                setSelectedSlots(prev => prev.includes('afternoon') ? prev.filter(s => s !== 'afternoon') : [...prev, 'afternoon']);
                              }
                            }}
                          >
                            <span style={{ fontWeight: 500, color: '#1F2937' }}>1 PM - 4 PM</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedSlots.includes('afternoon') ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                              {selectedSlots.includes('afternoon') && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>

                          <div 
                            className="flex flex-col gap-2" 
                            style={{ fontSize: '0.875rem', padding: '12px', border: '1px solid', borderColor: selectedSlots.includes('custom') ? '#3B82F6' : '#E5E7EB', borderRadius: '6px', cursor: 'pointer', backgroundColor: selectedSlots.includes('custom') ? '#EFF6FF' : 'white' }}
                            onClick={() => {
                              if (editingSessionIdx !== null) {
                                setSelectedSlots(['custom']);
                              } else {
                                setSelectedSlots(prev => prev.includes('custom') ? prev.filter(s => s !== 'custom') : [...prev, 'custom']);
                              }
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span style={{ fontWeight: 500, color: '#1F2937' }}>Custom Time</span>
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedSlots.includes('custom') ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                                {selectedSlots.includes('custom') && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                            </div>
                            {selectedSlots.includes('custom') && (
                              <div className="flex gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
                                <input 
                                  type="time" 
                                  value={customStartTime} 
                                  onChange={(e) => setCustomStartTime(e.target.value)}
                                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-blue-500 bg-white font-medium text-gray-700"
                                />
                                <input 
                                  type="time" 
                                  value={customEndTime} 
                                  onChange={(e) => setCustomEndTime(e.target.value)}
                                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-blue-500 bg-white font-medium text-gray-700"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-2 mt-3">
                        <button onClick={() => { setShowDatePickerFor(null); setEditingSessionIdx(null); setNewDate(''); setSelectedSlots(['morning', 'afternoon']); setCustomStartTime(''); setCustomEndTime(''); }} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.875rem', borderRadius: '8px' }}>Cancel</button>
                        <button 
                          onClick={() => handleAddSession(cls.id)} 
                          className="btn btn-primary" 
                          style={{ padding: '8px 16px', fontSize: '0.875rem', borderRadius: '8px', opacity: (!newDate || selectedSlots.length === 0) ? 0.5 : 1 }}
                          disabled={!newDate || selectedSlots.length === 0}
                        >
                          {editingSessionIdx !== null ? 'Update Session' : 'Add Sessions'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setShowDatePickerFor(cls.id)} style={{ background: 'none', border: '1px dashed #D1D5DB', width: '100%', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', color: '#6B7280', fontWeight: 500, transition: 'all 0.2s ease' }} onMouseOver={(e) => e.target.style.backgroundColor = '#F9FAFB'} onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
                      + Add Session
                    </button>
                  )}
                </div>
              )}
            </div>

              <div style={{ borderTop: '1px solid #E5E7EB', margin: '8px 0' }}></div>

              <div 
                className="flex items-center justify-between" 
                style={{ fontSize: '0.875rem', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: isAdmin ? 'default' : 'pointer', backgroundColor: '#F9FAFB' }}
                onClick={() => !isAdmin && handleOpenModal('Lab', cls.id)}
              >
                <div className="flex items-center gap-2" style={{ color: '#4B5563' }}>
                  <MapPin size={16} color="#8B5CF6" />
                  <span style={{ fontWeight: 500 }}>Lab:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: cls.lab === 'Unassigned' ? '#9CA3AF' : '#1F2937', fontWeight: 500 }}>{cls.lab}</span>
                  {!isAdmin && <Edit2 size={12} color="#9CA3AF" />}
                </div>
              </div>

              <div 
                className="flex items-center justify-between" 
                style={{ fontSize: '0.875rem', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: isAdmin ? 'default' : 'pointer', backgroundColor: '#F9FAFB' }}
                onClick={() => !isAdmin && handleOpenModal('Trainer', cls.id)}
              >
                <div className="flex items-center gap-2" style={{ color: '#4B5563' }}>
                  <Users size={16} color="#06B6D4" />
                  <span style={{ fontWeight: 500 }}>Trainer:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: cls.trainer === 'Unassigned' ? '#9CA3AF' : '#1F2937', fontWeight: 500 }}>{cls.trainer}</span>
                  {!isAdmin && <Edit2 size={12} color="#9CA3AF" />}
                </div>
              </div>

              <div 
                className="flex items-center justify-between" 
                style={{ fontSize: '0.875rem', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: isAdmin ? 'default' : 'pointer', backgroundColor: '#F9FAFB' }}
                onClick={() => !isAdmin && handleOpenModal('Co-Trainer', cls.id)}
              >
                <div className="flex items-center gap-2" style={{ color: '#4B5563' }}>
                  <Users size={16} color="#6B7280" />
                  <span style={{ fontWeight: 500 }}>Co-Trainers:</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex flex-col items-end">
                    {(!cls.coTrainers || cls.coTrainers.length === 0) ? (
                      <span style={{ color: '#9CA3AF', fontWeight: 500 }}>Unassigned</span>
                    ) : (
                      cls.coTrainers.map((ct, idx) => (
                        <span key={idx} style={{ color: '#1F2937', fontWeight: 500, fontSize: '0.875rem' }}>{ct}</span>
                      ))
                    )}
                  </div>
                  {!isAdmin && <Edit2 size={12} color="#9CA3AF" style={{ marginTop: '4px' }} />}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      <StaffSelectionModal 
        isOpen={activeModal === 'Trainer' || activeModal === 'Co-Trainer' || activeModal === 'Transfer-Tabs'}
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

      {/* Transfer Information Modal */}
      {transferInfo && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div className="card animate-fade-in" style={{ width: '400px', padding: '24px', borderRadius: '20px', border: 'none', textAlign: 'center' }}>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-amber-50 rounded-full text-amber-600">
                <Info size={32} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Session Transfer Info</h2>
            <p className="text-gray-500 text-sm mb-6">Details regarding the {transferInfo.type} replacement for this session.</p>
            
            <div className="space-y-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-left">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Transferred From</p>
                <p className="font-bold text-red-500">{transferInfo.from}</p>
              </div>
              
              <div className="flex justify-center">
                <div className="w-px h-6 bg-gray-200"></div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-left">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Assigned To (Current)</p>
                <p className="font-bold text-blue-700">{transferInfo.to}</p>
              </div>
            </div>

            <button 
              className="btn btn-primary w-full py-3 justify-center shadow-lg shadow-blue-200" 
              onClick={() => setTransferInfo(null)}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

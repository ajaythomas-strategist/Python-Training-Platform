import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Users, MapPin, Edit2, Eye, 
  CheckCircle2, CheckSquare, X,
  Calendar, ArrowRightLeft, Plus, Info
} from 'lucide-react';
import { classes as initialClasses, users, adjustDate } from '../data/mockData';
import StaffSelectionModal from './StaffSelectionModal';
import LabSelectionModal from './LabSelectionModal';

export default function ClassManagement({ userRole, userName, setActiveTab }) {
  const [classes, setClasses] = useState(initialClasses);
  const [filters, setFilters] = useState({ Active: true, Upcoming: true, Completed: true });
  const isAdmin = userRole === 'Admin' || userRole === 'Trainer' || userRole === 'Co-Trainer';

  const formatSessionDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = parseInt(parts[2], 10);
      const monthIdx = parseInt(parts[1], 10) - 1;
      if (monthIdx >= 0 && monthIdx < 12) {
        return `${day} ${months[monthIdx]}`;
      }
    }
    return dateStr;
  };

  const handleToggleTask = (classId, role, taskId) => {
    const updatedClasses = classes.map(cls => {
      if (cls.id === classId) {
        const updatedTasks = { ...cls.tasks };
        updatedTasks[role] = updatedTasks[role].map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        return { ...cls, tasks: updatedTasks };
      }
      return cls;
    });
    setClasses(updatedClasses);
  };

  const getComputedStatus = (cls) => {
    if (cls.status === 'Completed') return 'Completed';

    const today = new Date().toISOString().split('T')[0];
    
    if (!cls.sessions || cls.sessions.length === 0) return 'Upcoming';

    const hasTodaySession = cls.sessions.some(s => s.date === today);
    const earliestSession = cls.sessions.reduce((min, s) => s.date < min ? s.date : min, cls.sessions[0].date);

    if (hasTodaySession) return 'Active';
    
    if (earliestSession > today) return 'Upcoming';

    return cls.status;
  };

  useEffect(() => {
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClasses(newClasses);
    }
  }, [classes]);

  const [activeModal, setActiveModal] = useState(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedClassForTasks, setSelectedClassForTasks] = useState(null);
  const [activeClassId, setActiveClassId] = useState(null);
  const [activeSessionIdx, setActiveSessionIdx] = useState(null);
  const [transferInfo, setTransferInfo] = useState(null);
  
  const [showDatePickerFor, setShowDatePickerFor] = useState(null);
  const [editingSessionIdx, setEditingSessionIdx] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState(['morning', 'afternoon']);
  const [customSlots, setCustomSlots] = useState([{ startTime: '', endTime: '' }]);

  // Report State
  const [showReportFor, setShowReportFor] = useState(null);
  const [activeReportTab, setActiveReportTab] = useState('Attendance');

  // Pending Feedback State
  const [showPendingFeedbackFor, setShowPendingFeedbackFor] = useState(null);

  const handleDownloadCSV = (batchId, tab, batchStudents, sessionColumns, allActivities) => {
    let csvContent = "\ufeff"; // BOM for Excel UTF-8 support
    
    if (tab === 'Attendance') {
      const headers = ["Student Name", "Attendance %", ...sessionColumns.map((col, i) => `S${i + 1} (${col.subLabel.replace(/,/g, '')})`)];
      csvContent += headers.join(",") + "\n";
      
      batchStudents.forEach(student => {
        const row = [
          `"${student.name}"`,
          `${student.attendance}%`,
          ...sessionColumns.map((col, idx) => student.detailedReport?.sessions?.[idx]?.attendance || "-")
        ];
        csvContent += row.join(",") + "\n";
      });
    } else {
      const headers = ["Student Name", "Avg Mark", ...allActivities.map(a => `"${a.replace(/"/g, '""')}"`)];
      csvContent += headers.join(",") + "\n";
      
      batchStudents.forEach(student => {
        const performance = student.detailedReport?.performance || [];
        let total = 0;
        allActivities.forEach(act => {
          const record = performance.find(p => p.activity === act);
          if (record) {
            const val = parseInt(record.score.split('/')[0]) || 0;
            total += val;
          }
        });
        const avg = allActivities.length > 0 ? (total / allActivities.length).toFixed(1) : '0.0';
        
        const row = [
          `"${student.name}"`,
          `${avg}%`,
          ...allActivities.map(act => {
            const record = performance.find(p => p.activity === act);
            return record ? `"${record.score}"` : "Not Attended";
          })
        ];
        csvContent += row.join(",") + "\n";
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${batchId}_${tab.replace(/\s+/g, '_')}_Report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShowReport = (batchId) => {
    setShowReportFor(batchId);
    setActiveReportTab('Attendance');
  };
  const getPendingFeedbackStudents = (batchId, trainerName) => {
    const batchStudents = users.filter(u => u.role === 'Student' && u.batch === batchId);
    const feedbackStudentNames = new Set();
    
    const manualData = [
      { id: 'm1', sessionNo: 4, batch: '1 BCA A', date: adjustDate('2026-05-15'), time: '13:00 - 15:00', staffName: 'Dr. Sarah Lee', role: 'Trainer', studentName: 'Alice Johnson', feedback: 'Amazing depth of knowledge in Python.', rating: 5 },
      { id: 'm2', sessionNo: 4, batch: '1 BCA A', date: adjustDate('2026-05-15'), time: '13:00 - 15:00', staffName: 'James Carter', role: 'Co-Trainer', studentName: 'Alice Johnson', feedback: 'Very helpful during the hands-on lab.', rating: 4 },
      { id: 'm3', sessionNo: 1, batch: '1 PERFECT', date: adjustDate('2026-05-15'), time: '08:00 - 10:00', staffName: 'Margaret Hamilton', role: 'Trainer', studentName: 'Zara Ali', feedback: 'Flawless execution of the session.', rating: 5 },
      { id: 'm4', sessionNo: 2, batch: '1 BSC CS', date: adjustDate('2026-05-14'), time: '14:00 - 16:00', staffName: 'Michael Chang', role: 'Trainer', studentName: 'Bob Smith', feedback: 'Good pacing, but complex concepts need more time.', rating: 3 },
      { id: 'm5', sessionNo: 3, batch: '1 BCA A', date: adjustDate('2026-05-11'), time: '10:00 - 12:00', staffName: 'Dr. Sarah Lee', role: 'Trainer', studentName: 'Emily Davis', feedback: 'Excellent session on Data Structures.', rating: 5 },
      { id: 'm6', sessionNo: 1, batch: '1 BBA', date: adjustDate('2026-05-16'), time: '08:00 - 10:00', staffName: 'Dr. Sarah Lee', role: 'Trainer', studentName: 'Emily Davis', feedback: 'Very engaging and interactive.', rating: 4 },
    ];
    
    manualData.forEach(item => {
      if (item.batch === batchId && item.staffName === trainerName) {
        feedbackStudentNames.add(item.studentName);
      }
    });
    
    const cls = classes.find(c => c.id === batchId);
    if (cls) {
      cls.sessions?.forEach((session, sIdx) => {
        batchStudents.forEach(student => {
          const hash = (student.id * 1000 + sIdx + new Date(session.date).getTime()) % 100;
          if (hash > 70) {
            feedbackStudentNames.add(student.name);
          }
        });
      });
    }
    
    return batchStudents.filter(student => !feedbackStudentNames.has(student.name));
  };


  const updateClass = (classId, field, value) => {
    setClasses(classes.map(c => c.id === classId ? { ...c, [field]: value } : c));
    const rawClass = initialClasses.find(c => c.id === classId);
    if (rawClass) {
      rawClass[field] = value;
    }
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
    
    // Validate custom slots if selected
    if (selectedSlots.includes('custom')) {
      const invalid = customSlots.some(s => !s.startTime || !s.endTime);
      if (invalid) return;
    }

    const targetClass = classes.find(c => c.id === classId);
    if (targetClass) {
      let updatedSessions = [...targetClass.sessions];
      if (editingSessionIdx !== null) {
        // Update existing - only takes the FIRST slot if editing
        const slotType = selectedSlots[0];
        let slot;
        if (slotType === 'morning') slot = { startTime: '09:00', endTime: '12:00' };
        else if (slotType === 'afternoon') slot = { startTime: '13:00', endTime: '16:00' };
        else if (slotType === 'custom') slot = { startTime: customSlots[0].startTime, endTime: customSlots[0].endTime };
        
        if (slot && slot.startTime && slot.endTime) {
          updatedSessions[editingSessionIdx] = { ...updatedSessions[editingSessionIdx], date: newDate, ...slot };
        }
      } else {
        // Add new
        selectedSlots.forEach(slotType => {
          if (slotType === 'morning') updatedSessions.push({ date: newDate, startTime: '09:00', endTime: '12:00' });
          else if (slotType === 'afternoon') updatedSessions.push({ date: newDate, startTime: '13:00', endTime: '16:00' });
          else if (slotType === 'custom') {
            customSlots.forEach(cs => {
              if (cs.startTime && cs.endTime) {
                updatedSessions.push({ date: newDate, startTime: cs.startTime, endTime: cs.endTime });
              }
            });
          }
        });
      }
      updateClass(classId, 'sessions', updatedSessions);
    }
    setShowDatePickerFor(null);
    setEditingSessionIdx(null);
    setNewDate('');
    setSelectedSlots(['morning', 'afternoon']);
    setCustomSlots([{ startTime: '', endTime: '' }]);
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
      setCustomSlots([{ startTime: session.startTime, endTime: session.endTime }]);
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
    <>
    <div className="p-6 animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'nowrap', gap: '16px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', whiteSpace: 'nowrap', margin: 0, flexShrink: 0 }}>Class Management</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'nowrap', flexShrink: 0 }}>
          <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#4B5563', whiteSpace: 'nowrap', margin: 0, padding: 0 }}>Filter Status:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'nowrap' }}>
            {['Active', 'Upcoming', 'Completed'].map(status => (
              <label key={status} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', userSelect: 'none', margin: 0, padding: 0, whiteSpace: 'nowrap' }}>
                <input 
                  type="checkbox" 
                  checked={filters[status]} 
                  onChange={() => setFilters({ ...filters, [status]: !filters[status] })}
                  style={{ width: '15px', height: '15px', accentColor: 'var(--color-primary)', cursor: 'pointer', margin: 0, padding: 0, verticalAlign: 'middle', flexShrink: 0 }}
                />
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: filters[status] ? '#111827' : '#9CA3AF', transition: 'color 0.2s', lineHeight: '1' }}>
                  {status}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.5rem' }}>
        {filteredClasses.map(cls => (
          <div key={cls.id} style={{ backgroundColor: 'white', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', overflow: 'hidden', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '350px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#111827', margin: 0 }}>{cls.id}</h2>
              {isAdmin ? (
                <span style={{
                  padding: '6px 16px', borderRadius: '9999px', fontSize: '0.875rem',
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
                    padding: '6px 32px 6px 16px', borderRadius: '9999px', border: 'none', fontSize: '0.875rem',
                    backgroundColor: cls.status === 'Active' ? '#ECFDF5' : cls.status === 'Completed' ? '#EFF6FF' : '#FFFBEB',
                    color: cls.status === 'Active' ? '#059669' : cls.status === 'Completed' ? '#3B82F6' : '#D97706',
                    fontWeight: 600, outline: 'none', cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                      `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="${
                        cls.status === 'Active' ? '#059669' : cls.status === 'Completed' ? '#3B82F6' : '#D97706'
                      }" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>`
                    )}")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '12px'
                  }}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              )}
            </div>
            
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              
            {/* Sessions Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '0.875rem', color: '#4B5563' }}>
                  <Calendar size={16} color="#F59E0B" />
                  <span style={{ fontWeight: 600 }}>Number of Sessions Added: {cls.sessions.length}</span>
                </div>
                {cls.sessions.map((session, idx) => {
                  const hasTransfer = !!(session.transferredFrom || session.transferredCoTrainerFrom || session.transferredTo || session.transferredCoTrainerTo);
                  return (
                    <div key={idx}
                      style={{ 
                        padding: '7px 10px', 
                        borderRadius: '12px', 
                        backgroundColor: '#F9FAFB', 
                        border: '1px solid #E5E7EB',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px',
                        minWidth: 0,
                      }}
                    >
                      {/* Left: date/time + optional transfer badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0, flex: 1 }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }} title={`${session.date} • ${session.startTime}-${session.endTime}`}>
                          {formatSessionDate(session.date)} • {session.startTime}-{session.endTime}
                        </span>
                      </div>

                      {/* Right: action icons — always visible for non-admin, Eye only if transferred */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                        {/* Edit — only for non-admin */}
                        {!isAdmin && (
                          <button 
                            onClick={() => handleEditSession(cls.id, session, idx)} 
                            style={{ background: 'none', border: 'none', padding: '4px', margin: 0, cursor: 'pointer', color: '#6B7280', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'all 0.2s ease', outline: 'none' }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6B7280'; }}
                            title="Edit Session"
                          >
                            <Edit2 size={13} color="currentColor" />
                          </button>
                        )}

                        {/* Transfer — only for non-admin */}
                        {!isAdmin && (
                          <button 
                            onClick={() => handleTransferSession(cls.id, idx)} 
                            title="Transfer Session"
                            style={{ background: 'none', border: 'none', padding: '4px', margin: 0, cursor: 'pointer', color: '#6366F1', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'all 0.2s ease', outline: 'none' }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#EEF2FF'; e.currentTarget.style.color = '#4F46E5'; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6366F1'; }}
                          >
                            <ArrowRightLeft size={13} color="currentColor" />
                          </button>
                        )}

                        {/* Eye — only if session has been transferred */}
                        {hasTransfer && (
                          <button 
                            onClick={() => setTransferInfo({
                              type: session.transferredFrom ? 'Trainer' : 'Co-Trainer',
                              from: session.transferredFrom || session.transferredCoTrainerFrom,
                              to: session.transferredTo || session.transferredCoTrainerTo || 'Current assigned staff'
                            })}
                            title="Transfer Details"
                            style={{ background: 'none', border: 'none', padding: '4px', margin: 0, cursor: 'pointer', color: '#7C3AED', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'all 0.2s ease', outline: 'none' }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#EDE9FE'; e.currentTarget.style.color = '#5B21B6'; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#7C3AED'; }}
                          >
                            <Eye size={13} color="currentColor" />
                          </button>
                        )}

                        {/* Remove — only for non-admin */}
                        {!isAdmin && (
                          <button 
                            onClick={() => handleRemoveSession(cls.id, idx)} 
                            style={{ background: 'none', border: 'none', padding: '4px', margin: 0, cursor: 'pointer', color: '#EF4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'all 0.2s ease', outline: 'none' }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#FEE2E2'; e.currentTarget.style.color = '#DC2626'; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#EF4444'; }}
                            title="Remove Session"
                          >
                            <X size={13} color="currentColor" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {!isAdmin && (
                <div style={{ marginTop: '4px' }}>
                  {showDatePickerFor === cls.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '12px', backgroundColor: '#F9FAFB' }}>
                      <input 
                        type="date" 
                        value={newDate} 
                        onChange={(e) => setNewDate(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', backgroundColor: 'white' }}
                      />
                      
                      {newDate && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                          <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px', paddingLeft: '4px' }}>Select Session Timings</p>
                          
                          <div 
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', padding: '12px', border: '1px solid', borderColor: selectedSlots.includes('morning') ? '#3B82F6' : '#E5E7EB', borderRadius: '6px', cursor: 'pointer', backgroundColor: selectedSlots.includes('morning') ? '#EFF6FF' : 'white' }}
                            onClick={() => {
                              if (editingSessionIdx !== null) {
                                setSelectedSlots(['morning']);
                              } else {
                                setSelectedSlots(prev => prev.includes('morning') ? prev.filter(s => s !== 'morning') : [...prev, 'morning']);
                              }
                            }}
                          >
                            <span style={{ fontWeight: 500, color: '#1F2937' }}>9 AM - 12 PM</span>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `2px solid ${selectedSlots.includes('morning') ? '#3B82F6' : '#D1D5DB'}`, backgroundColor: selectedSlots.includes('morning') ? '#3B82F6' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {selectedSlots.includes('morning') && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white' }} />}
                            </div>
                          </div>

                          <div 
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', padding: '12px', border: '1px solid', borderColor: selectedSlots.includes('afternoon') ? '#3B82F6' : '#E5E7EB', borderRadius: '6px', cursor: 'pointer', backgroundColor: selectedSlots.includes('afternoon') ? '#EFF6FF' : 'white' }}
                            onClick={() => {
                              if (editingSessionIdx !== null) {
                                setSelectedSlots(['afternoon']);
                              } else {
                                setSelectedSlots(prev => prev.includes('afternoon') ? prev.filter(s => s !== 'afternoon') : [...prev, 'afternoon']);
                              }
                            }}
                          >
                            <span style={{ fontWeight: 500, color: '#1F2937' }}>1 PM - 4 PM</span>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `2px solid ${selectedSlots.includes('afternoon') ? '#3B82F6' : '#D1D5DB'}`, backgroundColor: selectedSlots.includes('afternoon') ? '#3B82F6' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {selectedSlots.includes('afternoon') && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white' }} />}
                            </div>
                          </div>

                          <div 
                            style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', padding: '12px', border: '1px solid', borderColor: selectedSlots.includes('custom') ? '#3B82F6' : '#E5E7EB', borderRadius: '6px', cursor: 'pointer', backgroundColor: selectedSlots.includes('custom') ? '#EFF6FF' : 'white' }}
                            onClick={() => {
                              if (editingSessionIdx !== null) {
                                setSelectedSlots(['custom']);
                              } else {
                                setSelectedSlots(prev => prev.includes('custom') ? prev.filter(s => s !== 'custom') : [...prev, 'custom']);
                              }
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontWeight: 500, color: '#1F2937' }}>Custom Time</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {selectedSlots.includes('custom') && editingSessionIdx === null && (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setCustomSlots([...customSlots, { startTime: '', endTime: '' }]); }}
                                    style={{ padding: '4px', borderRadius: '4px', background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer', display: 'inline-flex' }}
                                  >
                                    <Plus size={14} />
                                  </button>
                                )}
                                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `2px solid ${selectedSlots.includes('custom') ? '#3B82F6' : '#D1D5DB'}`, backgroundColor: selectedSlots.includes('custom') ? '#3B82F6' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {selectedSlots.includes('custom') && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white' }} />}
                                </div>
                              </div>
                            </div>
                            {selectedSlots.includes('custom') && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }} onClick={(e) => e.stopPropagation()}>
                                {customSlots.map((cs, cIdx) => (
                                  <div key={cIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input 
                                      type="time" 
                                      value={cs.startTime} 
                                      onChange={(e) => {
                                        const newCS = [...customSlots];
                                        newCS[cIdx].startTime = e.target.value;
                                        setCustomSlots(newCS);
                                      }}
                                      style={{ flex: 1, padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', backgroundColor: 'white', fontWeight: 500, color: '#374151' }}
                                    />
                                    <input 
                                      type="time" 
                                      value={cs.endTime} 
                                      onChange={(e) => {
                                        const newCS = [...customSlots];
                                        newCS[cIdx].endTime = e.target.value;
                                        setCustomSlots(newCS);
                                      }}
                                      style={{ flex: 1, padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', backgroundColor: 'white', fontWeight: 500, color: '#374151' }}
                                    />
                                    {customSlots.length > 1 && (
                                      <button 
                                        onClick={() => setCustomSlots(customSlots.filter((_, i) => i !== cIdx))}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'inline-flex', padding: '4px' }}
                                      >
                                        <X size={14} />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                        <button onClick={() => { setShowDatePickerFor(null); setEditingSessionIdx(null); setNewDate(''); setSelectedSlots(['morning', 'afternoon']); setCustomSlots([{ startTime: '', endTime: '' }]); }} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.875rem', borderRadius: '8px' }}>Cancel</button>
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
                    <button onClick={() => setShowDatePickerFor(cls.id)} style={{ background: 'none', border: '1px dashed #D1D5DB', width: '100%', padding: '12px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.875rem', color: '#6B7280', fontWeight: 500, transition: 'all 0.2s ease' }} onMouseOver={(e) => e.target.style.backgroundColor = '#F9FAFB'} onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
                      + Add Session
                    </button>
                  )}
                </div>
              )}

              <div 
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '12px', cursor: isAdmin ? 'default' : 'pointer', backgroundColor: '#F8FAFC', gap: '8px', minWidth: 0 }}
                onClick={() => !isAdmin && handleOpenModal('Lab', cls.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4B5563', flexShrink: 0 }}>
                  <MapPin size={15} color="#8B5CF6" />
                  <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Lab:</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                  <span style={{ color: cls.lab === 'Unassigned' ? '#9CA3AF' : '#1F2937', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>{cls.lab}</span>
                  {!isAdmin && <Edit2 size={11} color="#9CA3AF" style={{ flexShrink: 0 }} />}
                </div>
              </div>

              <div 
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '12px', cursor: isAdmin ? 'default' : 'pointer', backgroundColor: '#F8FAFC', gap: '8px', minWidth: 0 }}
                onClick={() => !isAdmin && handleOpenModal('Trainer', cls.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4B5563', flexShrink: 0 }}>
                  <Users size={15} color="#06B6D4" />
                  <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Trainer:</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                  <span style={{ color: cls.trainer === 'Unassigned' ? '#9CA3AF' : '#1F2937', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>{cls.trainer}</span>
                  {!isAdmin && <Edit2 size={11} color="#9CA3AF" style={{ flexShrink: 0 }} />}
                </div>
              </div>

              <div 
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: '12px', cursor: isAdmin ? 'default' : 'pointer', backgroundColor: '#F8FAFC', gap: '8px', minWidth: 0 }}
                onClick={() => !isAdmin && handleOpenModal('Co-Trainer', cls.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4B5563', flexShrink: 0 }}>
                  <Users size={15} color="#6B7280" />
                  <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Co-Trainers:</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                  <span style={{ color: (!cls.coTrainers || cls.coTrainers.length === 0) ? '#9CA3AF' : '#1F2937', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '155px' }}>
                    {(!cls.coTrainers || cls.coTrainers.length === 0) ? 'Unassigned' : cls.coTrainers.join(', ')}
                  </span>
                  {!isAdmin && <Edit2 size={11} color="#9CA3AF" style={{ flexShrink: 0 }} />}
                </div>
              </div>              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                  {/* Task Status */}
                  {(() => {
                    const roleKey = userRole === 'SuperAdmin' ? 'Admin' : (userRole === 'Admin' ? 'Admin' : (userRole === 'Trainer' ? 'Trainer' : 'Co-Trainer'));
                    const tasks = cls.tasks?.[roleKey] || [];
                    const completed = tasks.filter(t => t.completed).length;
                    const total = tasks.length;
                    
                    return (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClassForTasks(cls);
                          setIsTaskModalOpen(true);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          height: '40px',
                          padding: '0 12px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#374151',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <CheckSquare size={16} style={{ color: '#374151' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
                          <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', tracking: '0.05em', color: '#4B5563' }}>Task</span>
                          <span style={{ fontSize: '12px', fontWeight: '900', color: '#111827' }}>{completed}/{total}</span>
                        </div>
                      </button>
                    );
                  })()}

                  <button 
                    onClick={(e) => { e.stopPropagation(); handleShowReport(cls.id); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      height: '40px',
                      padding: '0 20px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#111827',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  >
                    <Eye size={16} style={{ color: '#374151' }} />
                    Show Report
                  </button>
                </div>

                {/* Feedback Section */}
                {((userRole === 'Trainer') || ((userRole === 'Student' || userRole === 'Admin' || userRole === 'SuperAdmin') && cls.feedbackEnabled)) && (
                  <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    {userRole === 'Trainer' && (() => {
                      const batchStudents = users.filter(u => u.role === 'Student' && u.batch === cls.id);
                      const totalCount = batchStudents.length;
                      const pendingCount = getPendingFeedbackStudents(cls.id, cls.trainer).length;
                      const givenCount = totalCount - pendingCount;
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#4B5563' }}>Enable Student Feedback</span>
                            <button 
                              onClick={() => updateClass(cls.id, 'feedbackEnabled', !cls.feedbackEnabled)}
                              style={{
                                position: 'relative', width: '44px', height: '24px', borderRadius: '12px',
                                backgroundColor: cls.feedbackEnabled ? '#10B981' : '#E5E7EB',
                                border: 'none', cursor: 'pointer', transition: 'background-color 0.2s'
                              }}
                            >
                              <div style={{
                                position: 'absolute', top: '2px', left: cls.feedbackEnabled ? '22px' : '2px',
                                width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'left 0.2s'
                              }} />
                            </button>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowPendingFeedbackFor(cls.id); }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#EEF2FF', color: '#4338CA', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 700, border: '1px solid rgba(199, 210, 254, 0.5)', cursor: 'pointer', width: '100%', transition: 'all 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E0E7FF'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#EEF2FF'}
                          >
                            <Users size={16} style={{ color: '#6366F1' }} />
                            Feedback ({givenCount}/{totalCount})
                          </button>
                        </div>
                      );
                    })()}
                    
                    {(userRole === 'Student' || userRole === 'Admin' || userRole === 'SuperAdmin') && cls.feedbackEnabled && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveTab('mark-rating'); }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)', color: 'white', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 700, border: 'none', cursor: 'pointer', width: '100%', boxShadow: '0 4px 12px rgba(79,70,229,0.3)', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        Provide Feedback
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

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
    {transferInfo && createPortal(
      <div style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        backgroundColor: 'rgba(15, 23, 42, 0.55)', zIndex: 11000, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        backdropFilter: 'blur(16px)',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <div className="animate-fade-in" style={{ 
          backgroundColor: 'white', 
          boxShadow: '0 30px 60px -15px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.05)', 
          width: '420px', 
          maxHeight: '90vh', 
          overflowY: 'auto', 
          padding: '40px 32px', 
          borderRadius: '32px', 
          border: '1px solid rgba(226, 232, 240, 0.8)', 
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Close button in top corner */}
          <button 
            onClick={() => setTransferInfo(null)}
            style={{ 
              position: 'absolute', top: '24px', right: '24px', border: 'none', background: 'none',
              color: '#94A3B8', cursor: 'pointer', transition: 'all 0.2s', width: '32px', height: '32px',
              borderRadius: '50%', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center'
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
            <X size={16} />
          </button>

          <div className="flex justify-center mb-6">
            <div style={{ 
              padding: '16px', 
              background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', 
              borderRadius: '24px', 
              color: '#D97706',
              boxShadow: '0 10px 15px -3px rgba(251, 191, 36, 0.15)'
            }}>
              <Info size={32} />
            </div>
          </div>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.02em', margin: 0 }}>
            Session Transfer Info
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: '500', lineHeight: '1.4', margin: '0 0 28px 0' }}>
            Details regarding the <strong>{transferInfo.type}</strong> replacement for this session.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
            {/* From Card */}
            <div style={{ 
              backgroundColor: '#FFF5F5', 
              padding: '18px 24px', 
              borderRadius: '20px', 
              border: '1px solid #FED7D7', 
              textAlign: 'left' 
            }}>
              <p style={{ fontSize: '0.65rem', fontWeight: '800', color: '#E53E3E', uppercase: true, tracking: '0.1em', letterSpacing: '0.075em', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
                Transferred From
              </p>
              <p style={{ fontSize: '1.05rem', fontWeight: '800', color: '#9B2C2C', margin: 0 }}>
                {transferInfo.from}
              </p>
            </div>
            
            {/* Visual connector */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '6px 14px', 
                borderRadius: '9999px', 
                backgroundColor: '#F1F5F9', 
                border: '1px solid #E2E8F0', 
                fontSize: '0.75rem', 
                fontWeight: '700', 
                color: '#64748B' 
              }}>
                <ArrowRightLeft size={12} /> Reassigned
              </div>
            </div>
            
            {/* To Card */}
            <div style={{ 
              backgroundColor: '#F0FDF4', 
              padding: '18px 24px', 
              borderRadius: '20px', 
              border: '1px solid #BBF7D0', 
              textAlign: 'left' 
            }}>
              <p style={{ fontSize: '0.65rem', fontWeight: '800', color: '#16A34A', uppercase: true, tracking: '0.1em', letterSpacing: '0.075em', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
                Assigned To (Current)
              </p>
              <p style={{ fontSize: '1.05rem', fontWeight: '800', color: '#14532D', margin: 0 }}>
                {transferInfo.to}
              </p>
            </div>
          </div>

          <button 
            style={{ 
              width: '100%', 
              padding: '16px', 
              backgroundColor: '#1E293B', 
              color: 'white', 
              borderRadius: '16px', 
              border: 'none', 
              fontWeight: '700', 
              fontSize: '0.9rem', 
              cursor: 'pointer', 
              transition: 'all 0.2s ease-in-out',
              boxShadow: '0 8px 16px -4px rgba(30, 41, 59, 0.25)'
            }}
            onClick={() => setTransferInfo(null)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0F172A';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 12px 20px -4px rgba(15, 23, 42, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1E293B';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(30, 41, 59, 0.25)';
            }}
          >
            Close Details
          </button>
        </div>
      </div>,
      document.body
    )}

    {/* Batch Report Modal */}
    {showReportFor && createPortal((() => {
      const batchStudents = users.filter(u => u.role === 'Student' && u.batch?.trim() === showReportFor?.trim());
      
      // Tab 1: Attendance dynamic columns
      const maxSessions = Math.max(...batchStudents.map(s => s.detailedReport?.sessions?.length || 0), 0);
      const currentClass = classes.find(c => c.id === showReportFor);
      const sessionColumns = Array.from({ length: maxSessions }, (_, i) => {
        const classSession = currentClass?.sessions?.[i];
        const date = classSession?.date || batchStudents.find(s => s.detailedReport?.sessions?.[i])?.detailedReport?.sessions?.[i]?.date || '';
        const time = classSession ? `${classSession.startTime}-${classSession.endTime}` : '';
        return { index: i, subLabel: date + (time ? ` ${time}` : '') };
      });

      // Tab 2: Activity dynamic columns
      const allActivities = Array.from(new Set(
        batchStudents.flatMap(s => s.detailedReport?.performance?.map(p => p.activity) || [])
      ));

      return (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
        }}>
          <div className="animate-fade-in" style={{ width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', backgroundColor: 'white', padding: '32px', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #F1F5F9' }}>
            <button 
              onClick={() => setShowReportFor(null)}
              style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-6" style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={32} color="#4F46E5" />
              </div>
              <div>
                <h2 style={{ marginBottom: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1F2937' }}>{showReportFor}</h2>
                <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>{batchStudents.length} Students in Batch</span>
              </div>
            </div>

            <div className="flex gap-6 border-b border-gray-200 mb-6">
              <div 
                onClick={() => setActiveReportTab('Attendance')}
                style={{ 
                  padding: '8px 4px', 
                  cursor: 'pointer', 
                  fontWeight: 600, 
                  borderBottom: activeReportTab === 'Attendance' ? '2px solid var(--color-primary)' : '2px solid transparent', 
                  color: activeReportTab === 'Attendance' ? 'var(--color-primary)' : '#6B7280',
                  transition: 'all 0.2s'
                }}
              >
                Dates & Sessions Attendance
              </div>
              <div 
                onClick={() => setActiveReportTab('Activity Report')}
                style={{ 
                  padding: '8px 4px', 
                  cursor: 'pointer', 
                  fontWeight: 600, 
                  borderBottom: activeReportTab === 'Activity Report' ? '2px solid var(--color-primary)' : '2px solid transparent', 
                  color: activeReportTab === 'Activity Report' ? 'var(--color-primary)' : '#6B7280',
                  transition: 'all 0.2s'
                }}
              >
                Class Performance Detailed Report
              </div>
            </div>

            {activeReportTab === 'Attendance' ? (
              <div className="table-container mb-4" style={{ overflowX: 'auto' }}>
                <table style={{ border: '1px solid #E5E7EB', width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '800px' }}>
                  <thead style={{ backgroundColor: '#F9FAFB' }}>
                    <tr>
                      <th style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontWeight: 600, fontSize: '0.875rem', minWidth: '200px', sticky: 'left', backgroundColor: '#F9FAFB', zIndex: 1 }}>Student Name</th>
                      <th style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontWeight: 600, fontSize: '0.875rem', minWidth: '100px' }}>Attendance %</th>
                      {sessionColumns.map((col, idx) => (
                        <th key={idx} style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontWeight: 600, fontSize: '0.875rem', minWidth: '120px', whiteSpace: 'nowrap', textAlign: 'center' }}>
                          S{idx + 1}<br/><span style={{ fontSize: '0.7rem', fontWeight: 400 }}>({col.subLabel})</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {batchStudents.map(student => (
                      <tr key={student.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                        <td style={{ padding: '12px 16px', sticky: 'left', backgroundColor: 'white', zIndex: 1 }}>
                          <div className="flex items-center gap-3">
                            <img src={student.photo} alt={student.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                            <span style={{ fontWeight: 500, color: '#1F2937' }}>{student.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontWeight: 600, color: student.attendance >= 80 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            {student.attendance}%
                          </span>
                        </td>
                        {sessionColumns.map((col, idx) => {
                          const sessionStatus = student.detailedReport?.sessions?.[idx]?.attendance;
                          return (
                            <td key={idx} style={{ padding: '12px 16px', textAlign: 'center' }}>
                              {sessionStatus ? (
                                <span style={{ 
                                  fontWeight: 700, 
                                  fontSize: '0.75rem',
                                  color: sessionStatus === 'Present' ? '#10B981' : '#EF4444'
                                }}>
                                  {sessionStatus === 'Present' ? 'Present' : 'Absent'}
                                </span>
                              ) : (
                                <span style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="table-container mb-4">
                <table style={{ border: '1px solid #E5E7EB', width: '100%', textAlign: 'left', borderCollapse: 'collapse', overflowX: 'auto', display: 'block' }}>
                  <thead style={{ backgroundColor: '#F9FAFB' }}>
                    <tr>
                      <th style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontWeight: 600, fontSize: '0.875rem', minWidth: '200px' }}>Activity Name</th>
                      <th style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontWeight: 600, fontSize: '0.875rem', minWidth: '100px' }}>Avg Mark</th>
                      {allActivities.map(act => (
                        <th key={act} style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontWeight: 600, fontSize: '0.875rem', minWidth: '150px' }}>{act}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {batchStudents.map(student => {
                      const performance = student.detailedReport?.performance || [];
                      let total = 0;
                      allActivities.forEach(act => {
                        const record = performance.find(p => p.activity === act);
                        if (record) {
                          const val = parseInt(record.score.split('/')[0]) || 0;
                          total += val;
                        }
                      });
                      const avg = allActivities.length > 0 ? (total / allActivities.length).toFixed(1) : '0.0';

                      return (
                        <tr key={student.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <div className="flex items-center gap-3">
                              <img src={student.photo} alt={student.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                              <span style={{ fontWeight: 500, color: '#1F2937' }}>{student.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{avg}%</span>
                          </td>
                          {allActivities.map(act => {
                            const record = performance.find(p => p.activity === act);
                            return (
                              <td key={act} style={{ padding: '12px 16px' }}>
                                {record ? (
                                  <span style={{ fontWeight: 500, color: '#374151' }}>{record.score}</span>
                                ) : (
                                  <span style={{ color: '#EF4444', fontSize: '0.875rem', fontWeight: 500 }}>Not Attended</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button className="btn btn-outline" onClick={() => setShowReportFor(null)}>Close Report</button>
              <button className="btn btn-primary" onClick={() => handleDownloadCSV(showReportFor, activeReportTab, batchStudents, sessionColumns, allActivities)}>Download CSV</button>
            </div>
          </div>
        </div>
      );
    })(), document.body)}
    {isTaskModalOpen && selectedClassForTasks && createPortal((() => {
      const roleKey = userRole === 'SuperAdmin' ? 'Admin' : (userRole === 'Admin' ? 'Admin' : (userRole === 'Trainer' ? 'Trainer' : 'Co-Trainer'));
      const tasks = selectedClassForTasks.tasks?.[roleKey] || [];
      const completedCount = tasks.filter(t => t.completed).length;
      const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

      return (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 10001,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          backdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{ 
            width: '100%', maxWidth: '500px', backgroundColor: 'white', 
            borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }}>
            {/* Premium Header Section */}
            <div style={{ 
              padding: '32px', 
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex' }}>
                    <CheckSquare size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Operational Tasks</h3>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '700', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {selectedClassForTasks.id}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsTaskModalOpen(false)}
                  style={{ backgroundColor: 'rgba(0,0,0,0.1)', border: 'none', padding: '10px', borderRadius: '12px', color: 'white', cursor: 'pointer', display: 'flex' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Progress Indicator */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.7)' }}>Completion Rate</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: '900' }}>{Math.round(progress)}%</span>
                </div>
                <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', width: `${progress}%`, backgroundColor: 'white', 
                    boxShadow: '0 0 15px rgba(255,255,255,0.4)', transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                  }} />
                </div>
              </div>
            </div>

            {/* Scrollable Tasks Body */}
            <div style={{ padding: '32px', maxHeight: '55vh', overflowY: 'auto', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {tasks.length === 0 ? (
                  <div style={{ padding: '40px 0', textAlign: 'center' }}>
                    <Info size={40} style={{ color: '#E5E7EB', marginBottom: '12px' }} />
                    <p style={{ margin: 0, color: '#9CA3AF', fontWeight: '600', fontStyle: 'italic' }}>No tasks assigned for your role.</p>
                  </div>
                ) : (
                  tasks.map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => handleToggleTask(selectedClassForTasks.id, roleKey, task.id)}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '16px', padding: '18px', 
                        borderRadius: '20px', border: '2px solid', cursor: 'pointer', transition: 'all 0.2s ease',
                        borderColor: task.completed ? '#ECFDF5' : '#F8FAFC',
                        backgroundColor: task.completed ? '#F0FDF4' : '#F8FAFC'
                      }}
                    >
                      <div style={{ 
                        width: '28px', height: '28px', borderRadius: '10px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: task.completed ? '#10B981' : '#E2E8F0',
                        color: 'white', transition: 'all 0.3s'
                      }}>
                        {task.completed ? <CheckCircle2 size={16} /> : <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ 
                          fontSize: '0.925rem', fontWeight: '700', color: task.completed ? '#065F46' : '#374151',
                          textDecoration: task.completed ? 'line-through' : 'none',
                          opacity: task.completed ? 0.6 : 1
                        }}>
                          {task.text}
                        </span>
                        {task.completed && (
                          <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
                            Action Completed
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '32px', backgroundColor: '#F9FAFB', borderTop: '1px solid #F1F5F9' }}>
              <button 
                onClick={() => setIsTaskModalOpen(false)}
                style={{ 
                  width: '100%', padding: '18px', backgroundColor: '#111827', color: 'white', 
                  border: 'none', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '900', 
                  textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              >
                Close Operational Panel
              </button>
            </div>
          </div>
        </div>
      );
    })(), document.body)}

    {showPendingFeedbackFor && createPortal((() => {
      const cls = classes.find(c => c.id === showPendingFeedbackFor);
      if (!cls) return null;
      const pendingList = getPendingFeedbackStudents(cls.id, cls.trainer);
      return (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{ 
            width: '100%', maxWidth: '480px', backgroundColor: 'white', borderRadius: '32px',
            boxShadow: '0 30px 60px -12px rgba(15, 23, 42, 0.25)', overflow: 'hidden',
            animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            {/* Header */}
            <div style={{ padding: '32px', borderBottom: '1px solid #F1F5F9', position: 'relative' }}>
              <button 
                onClick={() => setShowPendingFeedbackFor(null)}
                style={{ 
                  position: 'absolute', top: '28px', right: '28px', border: 'none', background: 'none',
                  color: '#9CA3AF', cursor: 'pointer', transition: 'color 0.2s', width: '32px', height: '32px',
                  borderRadius: '50%', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
              >
                <X size={18} />
              </button>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>Pending Feedback</h3>
              <p style={{ margin: '8px 0 0 0', color: '#6B7280', fontSize: '0.875rem', fontWeight: '600' }}>Batch: {cls.id} • {pendingList.length} Students Pending</p>
            </div>

            {/* List */}
            <div style={{ padding: '32px', maxHeight: '45vh', overflowY: 'auto', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pendingList.length === 0 ? (
                  <div style={{ padding: '40px 0', textAlign: 'center' }}>
                    <CheckCircle2 size={40} style={{ color: '#10B981', marginBottom: '12px' }} />
                    <p style={{ margin: 0, color: '#065F46', fontWeight: '800', fontSize: '1rem' }}>All Caught Up!</p>
                    <p style={{ margin: '4px 0 0 0', color: '#6B7280', fontSize: '0.875rem', fontWeight: '500' }}>All students in this batch have submitted their feedback.</p>
                  </div>
                ) : (
                  pendingList.map((student) => (
                    <div 
                      key={student.id} 
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', 
                        borderRadius: '20px', border: '1px solid #F1F5F9', backgroundColor: '#F8FAFC'
                      }}
                    >
                      <div style={{ 
                        width: '38px', height: '38px', borderRadius: '50%', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: '#EEF2FF', color: '#4F46E5', fontWeight: '900', fontSize: '0.875rem'
                      }}>
                        {student.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.925rem', fontWeight: '800', color: '#1E293B' }}>
                          {student.name}
                        </span>
                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', marginTop: '2px' }}>
                          {student.email}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '32px', backgroundColor: '#F9FAFB', borderTop: '1px solid #F1F5F9' }}>
              <button 
                onClick={() => setShowPendingFeedbackFor(null)}
                style={{ 
                  width: '100%', padding: '18px', backgroundColor: '#111827', color: 'white', 
                  border: 'none', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '900', 
                  textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              >
                Close List
              </button>
            </div>
          </div>
        </div>
      );
    })(), document.body)}
    </>
  );
}


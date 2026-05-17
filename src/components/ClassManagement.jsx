import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Users, BookOpen, Clock, MapPin, Edit2, ChevronRight, Eye, 
  Trash2, Search, Filter, CheckCircle2, MoreVertical, CheckSquare, X,
  Calendar, ArrowRightLeft, Plus, Info
} from 'lucide-react';
import { classes as initialClasses, users } from '../data/mockData';
import StaffSelectionModal from './StaffSelectionModal';
import LabSelectionModal from './LabSelectionModal';

export default function ClassManagement({ userRole, userName, setActiveTab }) {
  const [classes, setClasses] = useState(initialClasses);
  const [filters, setFilters] = useState({ Active: true, Upcoming: true, Completed: true });
  const isAdmin = userRole === 'Admin' || userRole === 'Trainer' || userRole === 'Co-Trainer';

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
      setClasses(newClasses);
    }
  }, [classes]);

  const [activeModal, setActiveModal] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);
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
      { id: 'm1', sessionNo: 4, batch: '1 BCA A', date: '2026-05-15', time: '13:00 - 15:00', staffName: 'Dr. Sarah Lee', role: 'Trainer', studentName: 'Alice Johnson', feedback: 'Amazing depth of knowledge in Python.', rating: 5 },
      { id: 'm2', sessionNo: 4, batch: '1 BCA A', date: '2026-05-15', time: '13:00 - 15:00', staffName: 'James Carter', role: 'Co-Trainer', studentName: 'Alice Johnson', feedback: 'Very helpful during the hands-on lab.', rating: 4 },
      { id: 'm3', sessionNo: 1, batch: '1 PERFECT', date: '2026-05-15', time: '08:00 - 10:00', staffName: 'Margaret Hamilton', role: 'Trainer', studentName: 'Zara Ali', feedback: 'Flawless execution of the session.', rating: 5 },
      { id: 'm4', sessionNo: 2, batch: '1 BSC CS', date: '2026-05-14', time: '14:00 - 16:00', staffName: 'Michael Chang', role: 'Trainer', studentName: 'Bob Smith', feedback: 'Good pacing, but complex concepts need more time.', rating: 3 },
      { id: 'm5', sessionNo: 3, batch: '1 BCA A', date: '2026-05-11', time: '10:00 - 12:00', staffName: 'Dr. Sarah Lee', role: 'Trainer', studentName: 'Emily Davis', feedback: 'Excellent session on Data Structures.', rating: 5 },
      { id: 'm6', sessionNo: 1, batch: '1 BBA', date: '2026-05-16', time: '08:00 - 10:00', staffName: 'Dr. Sarah Lee', role: 'Trainer', studentName: 'Emily Davis', feedback: 'Very engaging and interactive.', rating: 4 },
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

  const getPendingFeedbackCount = (batchId, trainerName) => {
    return getPendingFeedbackStudents(batchId, trainerName).length;
  };
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
          <div key={cls.id} style={{ backgroundColor: 'white', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', overflow: 'hidden', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '350px' }}>
            
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
                              <div className="flex items-center gap-3">
                                {selectedSlots.includes('custom') && editingSessionIdx === null && (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setCustomSlots([...customSlots, { startTime: '', endTime: '' }]); }}
                                    className="p-1 hover:bg-blue-200 rounded text-blue-600 transition-colors"
                                  >
                                    <Plus size={14} />
                                  </button>
                                )}
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedSlots.includes('custom') ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                                  {selectedSlots.includes('custom') && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                              </div>
                            </div>
                            {selectedSlots.includes('custom') && (
                              <div className="flex flex-col gap-3 mt-1" onClick={(e) => e.stopPropagation()}>
                                {customSlots.map((cs, cIdx) => (
                                  <div key={cIdx} className="flex items-center gap-2">
                                    <input 
                                      type="time" 
                                      value={cs.startTime} 
                                      onChange={(e) => {
                                        const newCS = [...customSlots];
                                        newCS[cIdx].startTime = e.target.value;
                                        setCustomSlots(newCS);
                                      }}
                                      className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-blue-500 bg-white font-medium text-gray-700"
                                    />
                                    <input 
                                      type="time" 
                                      value={cs.endTime} 
                                      onChange={(e) => {
                                        const newCS = [...customSlots];
                                        newCS[cIdx].endTime = e.target.value;
                                        setCustomSlots(newCS);
                                      }}
                                      className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-blue-500 bg-white font-medium text-gray-700"
                                    />
                                    {customSlots.length > 1 && (
                                      <button 
                                        onClick={() => setCustomSlots(customSlots.filter((_, i) => i !== cIdx))}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
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

                      <div className="flex justify-end gap-2 mt-3">
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

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
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
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 transition-all group"
                    >
                      <CheckSquare size={16} className="group-hover:scale-110 transition-transform" />
                      <div className="flex flex-col items-start leading-tight">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Task</span>
                        <span className="text-xs font-black">{completed}/{total}</span>
                      </div>
                    </button>
                  );
                })()}

                <button 
                  onClick={(e) => { e.stopPropagation(); handleShowReport(cls.id); }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 group"
                >
                  <Eye size={18} className="group-hover:scale-110 transition-transform" />
                  Show Report
                </button>
              </div>

              {/* Feedback Section */}
              <div className="mt-2 pt-4 border-t border-gray-100 flex items-center justify-between w-full">
                {userRole === 'Trainer' && (() => {
                  const batchStudents = users.filter(u => u.role === 'Student' && u.batch === cls.id);
                  const totalCount = batchStudents.length;
                  const pendingCount = getPendingFeedbackStudents(cls.id, cls.trainer).length;
                  const givenCount = totalCount - pendingCount;
                  return (
                    <div className="flex flex-col gap-3 w-full">
                      <div className="flex items-center justify-between">
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
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all border border-indigo-100/50 active:scale-95 w-full justify-center"
                      >
                        <Users size={16} className="text-indigo-500" />
                        Feedback ({givenCount}/{totalCount})
                      </button>
                    </div>
                  );
                })()}
                
                {(userRole === 'Student' || userRole === 'Admin' || userRole === 'SuperAdmin') && cls.feedbackEnabled && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveTab('mark-rating'); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 group w-full justify-center"
                  >
                    Provide Feedback
                  </button>
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
    {transferInfo && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
        <div className="animate-fade-in" style={{ backgroundColor: 'white', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', width: '400px', padding: '32px', borderRadius: '32px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
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
                  tasks.map((task, idx) => (
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


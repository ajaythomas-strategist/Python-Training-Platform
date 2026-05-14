import React, { useState } from 'react';
import { Users, UserCheck, BookOpen, Percent, Eye, X } from 'lucide-react';
import { users, classes } from '../data/mockData';

export default function DashboardOverview() {
  const [selectedBatchForAbsents, setSelectedBatchForAbsents] = useState(null);

  const trainers = users.filter(u => u.role === 'Trainer');
  const coTrainers = users.filter(u => u.role === 'Co-Trainer');
  const students = users.filter(u => u.role === 'Student');
  
  const totalAttendance = students.reduce((acc, s) => acc + (s.attendance || 0), 0);
  const avgAttendance = students.length > 0 ? (totalAttendance / students.length).toFixed(1) : 0;

  const today = new Date().toISOString().split('T')[0];
  
  // Find batches with sessions today
  const todayBatches = classes.filter(cls => 
    cls.sessions && cls.sessions.some(s => s.date === today)
  ).map(cls => {
    const batchStudents = students.filter(s => s.batch === cls.id);
    const session = cls.sessions.find(s => s.date === today);
    
    // Get full student objects for absentees
    const attendanceRecords = batchStudents.map(s => {
      const todaySession = s.detailedReport?.sessions?.find(rs => rs.date === today);
      return { 
        ...s,
        sessionStatus: todaySession?.attendance || 'Unknown' 
      };
    });

    const presentCount = attendanceRecords.filter(r => r.sessionStatus === 'Present').length;
    const absentStudents = attendanceRecords.filter(r => r.sessionStatus === 'Absent');
    const attendancePct = batchStudents.length > 0 ? ((presentCount / batchStudents.length) * 100).toFixed(0) : 0;

    return {
      ...cls,
      studentCount: batchStudents.length,
      attendancePct,
      absentCount: absentStudents.length,
      absentStudents, // Full student objects
      sessionTime: `${session.startTime} - ${session.endTime}`
    };
  });

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1>Dashboard Overview</h1>
        <div className="badge badge-blue">Today: {today}</div>
      </div>
      
      <div className="dashboard-grid mb-8">
        <div className="card stat-card">
          <div className="stat-icon blue">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Trainers</h3>
            <p>{trainers.length}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon purple">
            <UserCheck size={24} />
          </div>
          <div className="stat-content">
            <h3>Co-Trainers</h3>
            <p>{coTrainers.length}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon cyan">
            <BookOpen size={24} />
          </div>
          <div className="stat-content">
            <h3>Active Classes</h3>
            <p>{classes.filter(c => c.status === 'Active').length}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon green">
            <Percent size={24} />
          </div>
          <div className="stat-content">
            <h3>Avg Attendance</h3>
            <p>{avgAttendance}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="card" style={{ minHeight: '400px' }}>
          <h2 className="mb-6 flex items-center gap-2">
            <BookOpen size={20} className="text-indigo-600" />
            Today's Batch Attendance
          </h2>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Batch Name</th>
                  <th>Session Time</th>
                  <th>Students</th>
                  <th>Attendance %</th>
                  <th style={{ textAlign: 'center' }}>Absent</th>
                </tr>
              </thead>
              <tbody>
                {todayBatches.length > 0 ? todayBatches.map(batch => (
                  <tr key={batch.id}>
                    <td className="font-bold">{batch.id}</td>
                    <td className="text-gray-500 font-medium">{batch.sessionTime}</td>
                    <td>{batch.studentCount}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden" style={{ minWidth: '100px' }}>
                          <div 
                            className={`h-full ${Number(batch.attendancePct) > 80 ? 'bg-green-500' : 'bg-orange-500'}`} 
                            style={{ width: `${batch.attendancePct}%` }}
                          />
                        </div>
                        <span className="font-bold">{batch.attendancePct}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-4">
                        <span className="text-red-500 font-bold" style={{ fontSize: '1.125rem' }}>{batch.absentCount}</span>
                        <button 
                          className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                          style={{ marginLeft: '8px' }}
                          onClick={() => setSelectedBatchForAbsents(batch)}
                          title="Show Absentees"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <BookOpen size={48} strokeWidth={1} />
                        <p>No sessions scheduled for today.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Absent Students Modal */}
      {selectedBatchForAbsents && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '32px', borderRadius: '24px' }}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 style={{ margin: 0 }}>Absent Students</h2>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6B7280' }}>Batch: {selectedBatchForAbsents.id}</p>
              </div>
              <button onClick={() => setSelectedBatchForAbsents(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col gap-4" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
              {selectedBatchForAbsents.absentStudents.length > 0 ? (
                selectedBatchForAbsents.absentStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                    <div className="flex items-center gap-4">
                      {student.photo ? (
                        <img src={student.photo} alt={student.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} />
                      ) : (
                        <div className="avatar" style={{ width: '48px', height: '48px' }}>{student.name.charAt(0)}</div>
                      )}
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, color: '#991B1B' }}>{student.name}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#B91C1C' }}>{student.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#B91C1C', textTransform: 'uppercase' }}>Attendance</span>
                      <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#EF4444' }}>{student.attendance}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-green-600 font-bold flex flex-col items-center gap-2">
                   <div style={{ padding: '16px', backgroundColor: '#ECFDF5', borderRadius: '50%', color: '#10B981' }}>
                    <Users size={32} />
                   </div>
                   All students are present!
                </div>
              )}
            </div>

            <button 
              className="btn btn-primary w-full mt-8 py-4" 
              onClick={() => setSelectedBatchForAbsents(null)}
              style={{ justifyContent: 'center', borderRadius: '14px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

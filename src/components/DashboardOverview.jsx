import React, { useState } from 'react';
import { Users, UserCheck, BookOpen, Percent, Eye, X, Trophy, Star, Medal, Monitor, Shield, Cpu, User, Info } from 'lucide-react';
import { users, classes } from '../data/mockData';

export default function DashboardOverview() {
  const [selectedBatchForAbsents, setSelectedBatchForAbsents] = useState(null);

  const trainers = users.filter(u => u.role === 'Trainer');
  const coTrainers = users.filter(u => u.role === 'Co-Trainer');
  const students = users.filter(u => u.role === 'Student');
  
  const parseScore = (scoreStr) => parseInt(scoreStr?.replace('%', '') || '0');

  // 1. Top 3 Students Overall
  const topOverallStudents = [...students]
    .sort((a, b) => parseScore(b.score) - parseScore(a.score))
    .slice(0, 3);

  // 2. Top 3 Students in each Batch
  const batchGroups = students.reduce((acc, s) => {
    if (!acc[s.batch]) acc[s.batch] = [];
    acc[s.batch].push(s);
    return acc;
  }, {});

  const topStudentsPerBatch = Object.keys(batchGroups).map(batchId => {
    const sorted = [...batchGroups[batchId]]
      .sort((a, b) => parseScore(b.score) - parseScore(a.score))
      .slice(0, 3);
    return { batch: batchId, toppers: sorted };
  });

  // 3. Top 3 Trainers & Co-Trainers
  const topTrainers = [...trainers].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
  const topCoTrainers = [...coTrainers].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);

  const totalAttendance = students.reduce((acc, s) => acc + (s.attendance || 0), 0);
  const avgAttendance = students.length > 0 ? (totalAttendance / students.length).toFixed(1) : 0;

  const today = new Date().toISOString().split('T')[0];
  
  const todayBatches = classes.filter(cls => 
    cls.sessions && cls.sessions.some(s => s.date === today)
  ).map(cls => {
    const batchStudents = students.filter(s => s.batch === cls.id);
    const session = cls.sessions.find(s => s.date === today);
    
    const attendanceRecords = batchStudents.map(s => {
      const todaySession = s.detailedReport?.sessions?.find(rs => rs.date === today);
      return { ...s, sessionStatus: todaySession?.attendance || 'Unknown' };
    });

    const presentCount = attendanceRecords.filter(r => r.sessionStatus === 'Present').length;
    const absentStudents = attendanceRecords.filter(r => r.sessionStatus === 'Absent');
    const attendancePct = batchStudents.length > 0 ? ((presentCount / batchStudents.length) * 100).toFixed(0) : 0;

    return {
      ...cls,
      studentCount: batchStudents.length,
      attendancePct,
      absentCount: absentStudents.length,
      absentStudents,
      sessionTime: `${session.startTime} - ${session.endTime}`
    };
  });

  return (
    <div className="animate-fade-in p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">Live tracking for <strong>{today}</strong></p>
        </div>
        <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
           <div className="flex items-center gap-2">
            <Percent size={18} className="text-green-500" />
            <span className="text-sm font-bold text-gray-700">System Attendance: {avgAttendance}%</span>
          </div>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="dashboard-grid mb-12">
        <div className="card stat-card">
          <div className="stat-icon blue"><Users size={24} /></div>
          <div className="stat-content"><h3>Total Trainers</h3><p>{trainers.length}</p></div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon purple"><UserCheck size={24} /></div>
          <div className="stat-content"><h3>Co-Trainers</h3><p>{coTrainers.length}</p></div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon cyan"><BookOpen size={24} /></div>
          <div className="stat-content"><h3>Active Classes</h3><p>{classes.filter(c => c.status === 'Active').length}</p></div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon green"><Percent size={24} /></div>
          <div className="stat-content"><h3>Attendance</h3><p>{avgAttendance}%</p></div>
        </div>
      </div>

      {/* Today's Attendance Table */}
      <div className="card mb-12 flex-col" style={{ gap: '1.5rem' }}>
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><BookOpen size={20} /></div>
          Today's Batch Attendance
        </h2>
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Batch Name</th>
                <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Session Time</th>
                <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Students</th>
                <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Attendance %</th>
                <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Absent</th>
              </tr>
            </thead>
            <tbody>
              {todayBatches.map(batch => (
                <tr key={batch.id} className="border-t border-gray-50">
                  <td className="py-4 font-bold text-gray-800">{batch.id}</td>
                  <td className="py-4 text-gray-500">{batch.sessionTime}</td>
                  <td className="py-4">{batch.studentCount}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden" style={{ minWidth: '100px' }}>
                        <div className={`h-full ${Number(batch.attendancePct) > 80 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${batch.attendancePct}%` }} />
                      </div>
                      <span className="font-bold text-gray-700">{batch.attendancePct}%</span>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-red-500 font-bold">{batch.absentCount}</span>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400" onClick={() => setSelectedBatchForAbsents(batch)}>
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ borderTop: '2px solid #E5E7EB', margin: '40px 0' }}></div>

      {/* Leader Board Header */}
      <h1 className="text-3xl font-black text-gray-800 mb-8 tracking-tight">Leader Board</h1>

      {/* Row 1: Overall Leaders in Lab Card Design */}
      <div className="dashboard-grid mb-10" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.5rem' }}>
        {/* Top 3 Students Overall */}
        <div className="card flex-col" style={{ gap: '1rem', minHeight: '380px', border: '1px solid #E5E7EB' }}>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="badge" style={{ backgroundColor: '#10B981', color: 'white', fontWeight: 700, fontSize: '0.75rem', padding: '4px 12px' }}>TOP RANKED</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Ranking</span>
            </div>
            <div className="p-2 bg-green-50 rounded-lg border border-green-100">
              <Trophy size={20} className="text-green-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Top 3 Students</h2>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Overall Academic Excellence
            </div>
          </div>
          <div className="flex flex-col gap-4 py-5 border-y border-gray-100" style={{ fontSize: '0.875rem' }}>
            {topOverallStudents.map((s, idx) => (
              <div key={s.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-600">
                  <User size={18} className="text-gray-400" />
                  <span className="font-medium text-gray-700">{idx + 1}. {s.name}</span>
                </div>
                <span className="font-bold text-indigo-600">{s.score}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <button className="btn btn-outline w-full justify-center py-3 text-sm font-bold">View All Rankings</button>
          </div>
        </div>

        {/* Top 3 Trainers */}
        <div className="card flex-col" style={{ gap: '1rem', minHeight: '380px', border: '1px solid #E5E7EB' }}>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="badge" style={{ backgroundColor: '#6366F1', color: 'white', fontWeight: 700, fontSize: '0.75rem', padding: '4px 12px' }}>TOP RATED</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Main Trainers</span>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
              <Star size={20} className="text-indigo-600 fill-indigo-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Top 3 Trainers</h2>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              Teaching Performance
            </div>
          </div>
          <div className="flex flex-col gap-4 py-5 border-y border-gray-100" style={{ fontSize: '0.875rem' }}>
            {topTrainers.map((t, idx) => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-600">
                  <Users size={18} className="text-gray-400" />
                  <span className="font-medium text-gray-700">{idx + 1}. {t.name}</span>
                </div>
                <span className="font-bold text-gray-800">{t.rating} ★</span>
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <button className="btn btn-outline w-full justify-center py-3 text-sm font-bold">View Feedback</button>
          </div>
        </div>

        {/* Top 3 Co-Trainers */}
        <div className="card flex-col" style={{ gap: '1rem', minHeight: '380px', border: '1px solid #E5E7EB' }}>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="badge" style={{ backgroundColor: '#3B82F6', color: 'white', fontWeight: 700, fontSize: '0.75rem', padding: '4px 12px' }}>SUPPORT STARS</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Co-Trainers</span>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
              <Medal size={20} className="text-blue-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Top 3 Co-Trainers</h2>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              Support Performance
            </div>
          </div>
          <div className="flex flex-col gap-4 py-5 border-y border-gray-100" style={{ fontSize: '0.875rem' }}>
            {topCoTrainers.map((t, idx) => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-600">
                  <Users size={18} className="text-gray-400" />
                  <span className="font-medium text-gray-700">{idx + 1}. {t.name}</span>
                </div>
                <span className="font-bold text-gray-800">{t.rating} ★</span>
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <button className="btn btn-outline w-full justify-center py-3 text-sm font-bold">View Feedback</button>
          </div>
        </div>
      </div>

      {/* Row 2+ onwards: Batch Wise Toppers in Lab Card Design */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.5rem' }}>
        {topStudentsPerBatch.map(({ batch, toppers }) => (
          <div key={batch} className="card flex-col" style={{ gap: '1rem', minHeight: '380px', border: '1px solid #E5E7EB' }}>
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="badge" style={{ backgroundColor: '#6B7280', color: 'white', fontWeight: 700, fontSize: '0.75rem', padding: '4px 12px' }}>BATCH ACTIVE</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{batch}</span>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                <Monitor size={20} className="text-gray-400" />
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{batch} Toppers</h2>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                Top 3 Students in Batch
              </div>
            </div>
            
            <div className="flex flex-col gap-4 py-5 border-y border-gray-100" style={{ fontSize: '0.875rem' }}>
              {toppers.map((s, idx) => (
                <div key={s.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-600">
                    <User size={18} className={idx === 0 ? 'text-indigo-500' : 'text-gray-300'} />
                    <span className={`font-medium ${idx === 0 ? 'text-gray-800 font-bold' : 'text-gray-600'}`}>{idx + 1}. {s.name}</span>
                  </div>
                  <span className={`font-bold ${idx === 0 ? 'text-indigo-600' : 'text-gray-500'}`}>{s.score}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              <button className="btn btn-outline w-full justify-center py-3 text-sm font-bold">View Batch Report</button>
            </div>
          </div>
        ))}
      </div>

      {/* Absent Students Modal */}
      {selectedBatchForAbsents && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '32px', borderRadius: '24px', border: 'none' }}>
            <div className="flex justify-between items-center mb-6">
              <div><h2 className="text-2xl font-bold text-gray-800 m-0">Absent Students</h2><p style={{ margin: 0, fontSize: '0.875rem', color: '#6B7280' }}>Batch: {selectedBatchForAbsents.id}</p></div>
              <button onClick={() => setSelectedBatchForAbsents(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {selectedBatchForAbsents.absentStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                  <div className="flex items-center gap-4">
                    <img src={student.photo} alt={student.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} />
                    <div><p className="m-0 font-bold text-red-800">{student.name}</p><p className="m-0 text-xs text-red-400">{student.email}</p></div>
                  </div>
                  <div className="text-right">
                    <p className="m-0 text-[10px] font-bold text-red-300 uppercase">Attendance</p>
                    <p className="m-0 text-xl font-black text-red-600">{student.attendance}%</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary w-full mt-8 py-4" onClick={() => setSelectedBatchForAbsents(null)} style={{ justifyContent: 'center' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

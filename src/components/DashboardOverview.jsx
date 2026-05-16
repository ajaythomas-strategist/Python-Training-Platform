import React, { useState } from 'react';
import { Users, UserCheck, BookOpen, Percent, Eye, X, Star, User, Info, MessageSquare, ClipboardList, Shield, ClipboardCheck, Trophy, BarChart2, GraduationCap, Briefcase, Calendar } from 'lucide-react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell, Label } from 'recharts';
import { users, classes } from '../data/mockData';

export default function DashboardOverview({ userRole, userName }) {
  const [selectedBatchForAbsents, setSelectedBatchForAbsents] = useState(null);
  const [selectedBatchForComments, setSelectedBatchForComments] = useState(null);
  const [selectedBatchForActivity, setSelectedBatchForActivity] = useState(null);
  const [selectedBatchForEvaluation, setSelectedBatchForEvaluation] = useState(null);
  const [transferInfo, setTransferInfo] = useState(null);
  const [evaluationRating, setEvaluationRating] = useState(0);
  const [evaluationFeedback, setEvaluationFeedback] = useState('');
  const [upcomingRange, setUpcomingRange] = useState({ from: "", to: "" });
  const [completedRange, setCompletedRange] = useState({ from: "", to: "" });

  const isTrainer = userRole === 'Trainer' || userRole === 'Co-Trainer';
  const isStudent = userRole === 'Student';

  const studentDataObj = isStudent ? users.find(u => u.name === userName && u.role === 'Student') : null;
  const students = users.filter(u => u.role === 'Student');
  const myClasses = isTrainer
    ? classes.filter(c => c.trainer === userName || c.coTrainers?.includes(userName))
    : isStudent
      ? classes.filter(c => c.id === studentDataObj?.batch)
      : classes;

  const trainerKPIs = isTrainer ? {
    totalBatches: myClasses.length,
    completedBatches: myClasses.filter(c => c.status === 'Completed').length,
    remainingBatches: myClasses.filter(c => c.status !== 'Completed').length,
    totalSessions: myClasses.reduce((acc, c) => acc + (c.sessions?.length || 0), 0),
    completedSessions: myClasses.reduce((acc, c) => acc + (c.sessions?.filter(s => s.date < "2026-05-15").length || 0), 0),
    remainingSessions: myClasses.reduce((acc, c) => acc + (c.sessions?.filter(s => s.date >= "2026-05-15").length || 0), 0),
  } : null;

  const studentKPIs = isStudent ? {
    attendance: studentDataObj.attendance,
    score: studentDataObj.score,
    activitiesCompleted: studentDataObj.detailedReport?.performance?.length || 0,
    progress: 75 // Mock progress
  } : null;

  const totalAttendance = students.reduce((acc, s) => acc + (s.attendance || 0), 0);
  const avgAttendance = students.length > 0 ? (totalAttendance / students.length).toFixed(1) : 0;

  const today = "2026-05-15";
  const tomorrow = "2026-05-16";

  const getSessionsByRange = (range, defaultType) => {
    let dates = [];

    if (range.from && range.to) {
      const start = new Date(range.from);
      const end = new Date(range.to);
      const current = new Date(start);

      while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
    } else {
      if (defaultType === 'upcoming') {
        dates = [tomorrow];
      } else {
        dates = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(today);
          d.setDate(d.getDate() - (i + 1));
          return d.toISOString().split('T')[0];
        }).reverse();
      }
    }

    const allBatches = [];
    dates.forEach(date => {
      const dayBatches = mapSessionToBatch(date);
      allBatches.push(...dayBatches.map(b => ({ ...b, actualDate: date })));
    });
    return allBatches;
  };

  const mapSessionToBatch = (sessionDate) => {
    const relevantClasses = myClasses;
    return relevantClasses.flatMap(cls => {
      const session = cls.sessions.find(s => s.date === sessionDate);
      if (!session) return [];

      const batchStudents = students.filter(s => s.batch === cls.id);
      const attendanceRecords = batchStudents.map(s => {
        const dSession = s.detailedReport?.sessions?.find(rs => rs.date === sessionDate);
        return { ...s, sessionStatus: dSession?.attendance || 'Unknown' };
      });

      const presentCount = attendanceRecords.filter(r => r.sessionStatus === 'Present').length;
      const absentStudents = attendanceRecords.filter(r => r.sessionStatus === 'Absent');
      const attendancePct = batchStudents.length > 0 ? ((presentCount / batchStudents.length) * 100).toFixed(0) : 0;

      const trainer = users.find(u => u.name === cls.trainer);
      const coTrainerList = users.filter(u => cls.coTrainers?.includes(u.name));
      const sessionNo = cls.sessions.indexOf(session) + 1;

      return {
        ...cls,
        sessionNo,
        trainerData: trainer ? { name: trainer.name, rating: trainer.rating } : { name: cls.trainer, rating: 'N/A' },
        coTrainersData: coTrainerList.length > 0 ? coTrainerList.map(ct => ({ name: ct.name, rating: ct.rating })) : [{ name: 'None', rating: 'N/A' }],
        studentCount: batchStudents.length,
        attendancePct,
        absentCount: absentStudents.length,
        absentStudents,
        sessionTime: `${session.startTime} - ${session.endTime}`,
        transferredFrom: session.transferredFrom,
        transferredCoTrainerFrom: session.transferredCoTrainerFrom,
        comments: {
          trainer: trainer?.feedback || [],
          coTrainer: coTrainerList.flatMap(ct => ct.feedback || [])
        },
        activity: trainer?.sessionReports?.filter(r => r.batch === cls.id) || []
      };
    });
  };

  const todayBatches = mapSessionToBatch(today);
  const tomorrowBatches = getSessionsByRange(upcomingRange, 'upcoming');
  const completedBatches = getSessionsByRange(completedRange, 'completed');

  return (
    <div className="animate-fade-in p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-sm text-gray-500">Live tracking for <strong>{today}</strong></p>
      </div>

      {/* Stat Cards */}
      <div className="dashboard-grid mb-12" style={{
        display: 'grid',
        gridTemplateColumns: isTrainer || isStudent ? 'repeat(4, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))',
        gap: '1.5rem'
      }}>
        {isTrainer ? (
          <>
            <div className="card stat-card" style={{ padding: '1.5rem' }}>
              <div className="stat-icon blue" style={{ width: '48px', height: '48px' }}><BookOpen size={24} /></div>
              <div className="stat-content"><h3>Total Batches</h3><p>{trainerKPIs.totalBatches}</p></div>
            </div>
            <div className="card stat-card" style={{ padding: '1.5rem' }}>
              <div className="stat-icon green" style={{ width: '48px', height: '48px', backgroundColor: '#ECFDF5', color: '#10B981' }}><Shield size={24} /></div>
              <div className="stat-content"><h3>Completed</h3><p>{trainerKPIs.completedBatches}</p></div>
            </div>
            <div className="card stat-card" style={{ padding: '1.5rem' }}>
              <div className="stat-icon purple" style={{ width: '48px', height: '48px' }}><Users size={24} /></div>
              <div className="stat-content"><h3>Total Sessions</h3><p>{trainerKPIs.totalSessions}</p></div>
            </div>
            <div className="card stat-card" style={{ padding: '1.5rem' }}>
              <div className="stat-icon cyan" style={{ width: '48px', height: '48px' }}><Percent size={24} /></div>
              <div className="stat-content"><h3>Sessions Done</h3><p>{trainerKPIs.completedSessions}</p></div>
            </div>
          </>
        ) : isStudent ? (
          <>
            <div className="card stat-card" style={{ padding: '1.5rem' }}>
              <div className="stat-icon blue" style={{ width: '48px', height: '48px' }}><UserCheck size={24} /></div>
              <div className="stat-content"><h3>Attendance %</h3><p>{studentKPIs.attendance}%</p></div>
            </div>
            <div className="card stat-card" style={{ padding: '1.5rem' }}>
              <div className="stat-icon green" style={{ width: '48px', height: '48px', backgroundColor: '#ECFDF5', color: '#10B981' }}><Trophy size={24} /></div>
              <div className="stat-content"><h3>Performance</h3><p>{studentKPIs.score}</p></div>
            </div>
            <div className="card stat-card" style={{ padding: '1.5rem' }}>
              <div className="stat-icon purple" style={{ width: '48px', height: '48px' }}><ClipboardCheck size={24} /></div>
              <div className="stat-content"><h3>Activities</h3><p>{studentKPIs.activitiesCompleted}</p></div>
            </div>
            <div className="card stat-card" style={{ padding: '1.5rem' }}>
              <div className="stat-icon cyan" style={{ width: '48px', height: '48px' }}><Percent size={24} /></div>
              <div className="stat-content"><h3>Progress %</h3><p>{studentKPIs.progress}%</p></div>
            </div>
          </>
        ) : (
          <>
            <div className="card stat-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="stat-icon blue" style={{ width: '48px', height: '48px', backgroundColor: '#EEF2FF', color: '#6366F1', borderRadius: '12px' }}><Users size={24} /></div>
              <div className="stat-content"><h3>Total Students</h3><p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{students.length}</p></div>
            </div>
            <div className="card stat-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="stat-icon purple" style={{ width: '48px', height: '48px', backgroundColor: '#F5F3FF', color: '#8B5CF6', borderRadius: '12px' }}><GraduationCap size={24} /></div>
              <div className="stat-content"><h3>Total Trainings</h3><p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{classes.length}</p></div>
            </div>
            <div className="card stat-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="stat-icon cyan" style={{ width: '48px', height: '48px', backgroundColor: '#ECFEFF', color: '#06B6D4', borderRadius: '12px' }}><Calendar size={24} /></div>
              <div className="stat-content"><h3>Placement Activities</h3><p style={{ fontSize: '1.5rem', fontWeight: 800 }}>1</p></div>
            </div>
            <div className="card stat-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="stat-icon green" style={{ width: '48px', height: '48px', backgroundColor: '#ECFDF5', color: '#10B981', borderRadius: '12px' }}><Briefcase size={24} /></div>
              <div className="stat-content"><h3>Total Recruitments</h3><p style={{ fontSize: '1.5rem', fontWeight: 800 }}>1</p></div>
            </div>
          </>
        )}
      </div>

      {/* Advanced Analytics Section - Funnel Charts (Admin Only) */}
      {!isStudent && (() => {
        // Calculations for Placement Status
        const placedCount = 0;
        const inProcessCount = 0;
        const unplacedCount = totalStudents;

        const placementData = [
          { name: 'Placed Students', value: placedCount, fill: '#3b82f6' },
          { name: 'In Process', value: inProcessCount, fill: '#10b981' },
          { name: 'Unplaced', value: unplacedCount, fill: '#f59e0b' }
        ];

        const placementPercent = 0;

        // Calculations for Training Status
        const attendingCount = todayBatches.reduce((acc, b) => acc + (b.studentCount || 0), 0);
        const completedTrainingCount = completedBatches.reduce((acc, b) => acc + (b.studentCount || 0), 0);
        const notAttendingCount = Math.max(0, totalStudents - attendingCount - completedTrainingCount);

        const trainingData = [
          { name: 'Attending Trainings', value: attendingCount, fill: '#3b82f6' },
          { name: 'Completed Trainings', value: completedTrainingCount, fill: '#10b981' },
          { name: 'Not Attending', value: notAttendingCount, fill: '#f59e0b' }
        ];

        const trainingPercent = totalStudents > 0 ? Math.round((completedTrainingCount / totalStudents) * 100) : 0;

        return (
          <div className="flex flex-row mb-8 mt-2" style={{ gap: '0.5cm' }}>
            {/* Placement Status Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col p-6 flex-1">
              <div className="w-full flex justify-between items-center mb-2">
                <h2 className="text-base font-bold text-gray-700 flex items-center gap-2">
                  <BarChart2 size={18} className="text-gray-500" />
                  Placement Status Overview
                </h2>
                <span className="text-sm text-gray-500">Total: {totalStudents}</span>
              </div>
              
              <div style={{ width: '100%', height: 320 }} className="relative flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip wrapperStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend 
                      verticalAlign="bottom" 
                      align="center"
                      iconType="circle" 
                      wrapperStyle={{ fontSize: '12px', color: '#6b7280', paddingTop: '20px' }} 
                    />
                    <Pie
                      data={placementData}
                      cx="50%"
                      cy="50%"
                      innerRadius={85}
                      outerRadius={120}
                      paddingAngle={5}
                      cornerRadius={10}
                      dataKey="value"
                      stroke="none"
                      startAngle={90}
                      endAngle={-270}
                      isAnimationActive
                    >
                      {placementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          const { cx, cy } = viewBox;
                          return (
                            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan x={cx} dy="-0.1em" style={{ fontSize: '48px', fontWeight: '800', fill: '#1f2937' }}>
                                {placementPercent}%
                              </tspan>
                              <tspan x={cx} dy="1.6em" style={{ fontSize: '11px', fontWeight: '700', fill: '#6b7280', letterSpacing: '1px' }}>
                                COMPLETED
                              </tspan>
                            </text>
                          );
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Training Status Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col p-6 flex-1">
              <div className="w-full flex justify-between items-center mb-2">
                <h2 className="text-base font-bold text-gray-700 flex items-center gap-2">
                  <Users size={18} className="text-gray-500" />
                  Training Status Overview
                </h2>
                <span className="text-sm text-gray-500">Total: {totalStudents}</span>
              </div>
              
              <div style={{ width: '100%', height: 320 }} className="relative flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip wrapperStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend 
                      verticalAlign="bottom" 
                      align="center"
                      iconType="circle" 
                      wrapperStyle={{ fontSize: '12px', color: '#6b7280', paddingTop: '20px' }} 
                    />
                    <Pie
                      data={trainingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={85}
                      outerRadius={120}
                      paddingAngle={5}
                      cornerRadius={10}
                      dataKey="value"
                      stroke="none"
                      startAngle={90}
                      endAngle={-270}
                      isAnimationActive
                    >
                      {trainingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          const { cx, cy } = viewBox;
                          return (
                            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan x={cx} dy="-0.1em" style={{ fontSize: '48px', fontWeight: '800', fill: '#1f2937' }}>
                                {trainingPercent}%
                              </tspan>
                              <tspan x={cx} dy="1.6em" style={{ fontSize: '11px', fontWeight: '700', fill: '#6b7280', letterSpacing: '1px' }}>
                                COMPLETED
                              </tspan>
                            </text>
                          );
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Tables Section */}
      <div className="flex flex-col" style={{ gap: '20px' }}>

        {/* Active Session Table (Common for all but layout slightly different) */}
        <div className="card flex-col" style={{ gap: '1.5rem' }}>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><BookOpen size={20} /></div>
            {isStudent ? 'Active Session' : "Today's Batch"}
          </h2>
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr>
                  {!isStudent && (
                    <>
                      <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Batch</th>
                      <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Session No.</th>
                      <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Time</th>
                      <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Lab</th>
                      <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Trainer</th>
                      <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">{isTrainer ? 'Trainers' : 'Co Trainers'}</th>
                      <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">No. of Students</th>
                      <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Attendance %</th>
                      <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Absent</th>
                      <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Actions</th>
                    </>
                  )}
                  {isStudent && (
                    <>
                      <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Time</th>
                      <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Lab</th>
                      <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Trainer</th>
                      <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Attendance</th>
                      <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Score</th>
                      <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Evaluation</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {todayBatches.map(batch => (
                  <tr key={batch.id} className="border-t border-gray-50 text-sm">
                    {!isStudent ? (
                      <>
                        <td className="py-4 font-bold text-gray-800">{batch.id}</td>
                        <td className="py-4 text-center font-bold text-gray-600">#{batch.sessionNo}</td>
                        <td className="py-4 text-gray-500 font-medium">{batch.sessionTime}</td>
                        <td className="py-4 text-gray-600 font-bold">{batch.lab}</td>
                        <td className="py-4 text-gray-800 font-bold">
                          <div className="flex items-center gap-2">
                            {batch.trainerData.name}
                            {batch.transferredFrom && (
                              <button 
                                className="p-1 hover:bg-amber-100 rounded text-amber-600 transition-colors"
                                title="Transferred Session"
                                onClick={() => setTransferInfo({ type: 'Trainer', from: batch.transferredFrom, to: batch.trainerData.name })}
                              >
                                <Eye size={12} />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col">
                                {batch.coTrainersData.map((ct, idx) => (
                                  <span key={idx} className="text-gray-600 text-xs">{ct.name}</span>
                                ))}
                              </div>
                              {batch.transferredCoTrainerFrom && (
                                <button 
                                  className="p-1 hover:bg-amber-100 rounded text-amber-600 transition-colors"
                                  title="Transferred Co-Trainer"
                                  onClick={() => setTransferInfo({ type: 'Co-Trainer', from: batch.transferredCoTrainerFrom, to: batch.coTrainersData.map(ct => ct.name).join(', ') })}
                                >
                                  <Eye size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-center font-medium text-gray-800">{batch.studentCount}</td>
                        <td className="py-4 text-center font-bold text-emerald-600">{batch.attendancePct}%</td>
                        <td className="py-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <span className="text-red-500 font-bold">{batch.absentCount}</span>
                            <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 border border-gray-100 shadow-sm" onClick={() => setSelectedBatchForAbsents(batch)}>
                              <Eye size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="View Comments" onClick={() => setSelectedBatchForComments(batch)}>
                              <MessageSquare size={16} />
                            </button>
                            <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors" title="Activity Reports" onClick={() => setSelectedBatchForActivity(batch)}>
                              <ClipboardList size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 text-gray-500 font-medium">{batch.sessionTime}</td>
                        <td className="py-4 text-gray-600 font-bold">{batch.lab}</td>
                        <td className="py-4 text-gray-800 font-bold">{batch.trainerData.name}</td>
                        <td className="py-4 text-center">
                          <span className={`badge ${studentData.detailedReport?.sessions?.find(s => s.date === batch.actualDate)?.attendance === 'Present' ? 'badge-green' : 'bg-red-50 text-red-600'}`}>
                            {studentData.detailedReport?.sessions?.find(s => s.date === batch.actualDate)?.attendance || 'Upcoming'}
                          </span>
                        </td>
                        <td className="py-4 text-center font-bold text-indigo-600">--</td>
                        <td className="py-4 text-center">
                          <button
                            className="btn btn-primary py-2 px-4 text-[10px] font-black uppercase tracking-widest"
                            style={{ background: 'linear-gradient(to right, #4F46E5, #7C3AED)' }}
                            onClick={() => setSelectedBatchForEvaluation(batch)}
                          >
                            Mark Rating & Comment
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Session Table */}
        <div className="card flex-col" style={{ gap: '1.5rem' }}>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><ClipboardList size={20} /></div>
            Upcoming Session
          </h2>
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Time</th>
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Lab</th>
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Trainer</th>
                  {!isStudent && (
                    <>
                      <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Batch</th>
                      <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">{isTrainer ? 'Trainers' : 'Co Trainers'}</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {tomorrowBatches.map(batch => (
                  <tr key={batch.id} className="border-t border-gray-50 text-sm">
                    <td className="py-4 text-gray-500 font-medium">{batch.sessionTime}</td>
                    <td className="py-4 text-gray-600 font-bold">{batch.lab}</td>
                    <td className="py-4 text-gray-800 font-bold">
                      <div className="flex items-center gap-2">
                        {batch.trainerData.name}
                        {batch.transferredFrom && (
                          <button 
                            className="p-1 hover:bg-amber-100 rounded text-amber-600 transition-colors"
                            title="Transferred Session"
                            onClick={() => setTransferInfo({ type: 'Trainer', from: batch.transferredFrom, to: batch.trainerData.name })}
                          >
                            <Eye size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                    {!isStudent && (
                      <>
                        <td className="py-4 text-center font-bold text-gray-800">{batch.id}</td>
                        <td className="py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col">
                                {batch.coTrainersData.map((ct, idx) => (
                                  <span key={idx} className="text-gray-600 text-xs">{ct.name}</span>
                                ))}
                              </div>
                              {batch.transferredCoTrainerFrom && (
                                <button 
                                  className="p-1 hover:bg-amber-100 rounded text-amber-600 transition-colors"
                                  title="Transferred Co-Trainer"
                                  onClick={() => setTransferInfo({ type: 'Co-Trainer', from: batch.transferredCoTrainerFrom, to: batch.coTrainersData.map(ct => ct.name).join(', ') })}
                                >
                                  <Eye size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Completed Session Table (Student Only) */}
        {isStudent && (
          <div className="card flex-col" style={{ gap: '1.5rem' }}>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><UserCheck size={20} /></div>
              Completed Session
            </h2>
            <div className="table-container">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Session No.</th>
                    <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Session Time</th>
                    <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Lab</th>
                    <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Trainer</th>
                    <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Attendance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.detailedReport?.sessions?.map((sess, idx) => (
                    <tr key={idx} className="border-t border-gray-50 text-sm">
                      <td className="py-4 text-gray-600 font-bold">#{idx + 1}</td>
                      <td className="py-4 text-gray-500 font-medium">{sess.date} | 09:00 - 11:00</td>
                      <td className="py-4 text-gray-600 font-bold">Advanced Computing Lab</td>
                      <td className="py-4 text-gray-800 font-bold">Dr. Sarah Lee</td>
                      <td className="py-4 text-center">
                        <span className={`badge ${sess.attendance === 'Present' ? 'badge-green' : 'bg-red-50 text-red-600'}`}>
                          {sess.attendance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Activity Wise Report Table (Student Only) */}
        {isStudent && (
          <div className="card flex-col" style={{ gap: '1.5rem' }}>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Trophy size={20} /></div>
              Activity Wise Report
            </h2>
            <div className="table-container">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Activity Name</th>
                    <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Score</th>
                    <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Duration</th>
                    <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">No. of Times attended</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.detailedReport?.performance?.map((act, idx) => (
                    <tr key={idx} className="border-t border-gray-50 text-sm">
                      <td className="py-4 font-bold text-gray-800">{act.activity}</td>
                      <td className="py-4 text-center font-black text-indigo-600">{act.score}</td>
                      <td className="py-4 text-center text-gray-500">{act.timeTaken}</td>
                      <td className="py-4 text-center font-medium text-gray-800">{act.timesAttended || 1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {!isStudent && (
        <>
          <div style={{ height: '40px' }}></div>

          {/* Completed Session Table */}
          <div className="card mb-12 flex-col" style={{ gap: '1.5rem' }}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <div className="p-2 bg-green-50 rounded-lg text-green-600"><Shield size={20} /></div>
                  Completed Session
                </h2>
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-1.5 ml-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">From:</span>
                    <input
                      type="date"
                      value={completedRange.from}
                      onChange={(e) => setCompletedRange(prev => ({ ...prev, from: e.target.value }))}
                      className="bg-transparent border-none text-sm font-medium text-gray-700 outline-none cursor-pointer"
                    />
                  </div>
                  <div className="w-px h-4 bg-gray-200"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">To:</span>
                    <input
                      type="date"
                      value={completedRange.to}
                      onChange={(e) => setCompletedRange(prev => ({ ...prev, to: e.target.value }))}
                      className="bg-transparent border-none text-sm font-medium text-gray-700 outline-none cursor-pointer"
                    />
                  </div>
                  {(completedRange.from || completedRange.to) && (
                    <button onClick={() => setCompletedRange({ from: "", to: "" })} className="text-gray-400 hover:text-red-500 ml-1">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                {completedRange.from && completedRange.to ? `Showing ${completedRange.from} to ${completedRange.to}` : "Showing last week's sessions"}
              </p>
            </div>
            <div className="table-container">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Batch Name</th>
                    <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Session No.</th>
                    <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Session Time</th>
                    <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Lab</th>
                    <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Trainer</th>
                    <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">{isTrainer ? 'Trainers' : 'Co Trainers'}</th>
                    <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">No. of Students</th>
                    <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Attendance %</th>
                    <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Absent</th>
                    {!isTrainer && <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {completedBatches.length > 0 ? completedBatches.map((batch, idx) => (
                    <tr key={`${batch.id}-${idx}`} className="border-t border-gray-50 text-sm">
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800">{batch.id}</span>
                          {batch.actualDate && <span className="text-[10px] text-gray-400 font-medium">{batch.actualDate}</span>}
                        </div>
                      </td>
                      <td className="py-4 text-center font-bold text-gray-600">#{batch.sessionNo}</td>
                      <td className="py-4 text-gray-500">{batch.sessionTime}</td>
                      <td className="py-4 text-gray-600 font-medium">{batch.lab}</td>
                      <td className="py-4 text-gray-800 font-bold">
                        <div className="flex items-center gap-2">
                          {batch.trainerData.name}
                          {batch.transferredFrom && (
                            <button 
                              className="p-1 hover:bg-amber-100 rounded text-amber-600 transition-colors"
                              title="Transferred Session"
                              onClick={() => setTransferInfo({ type: 'Trainer', from: batch.transferredFrom, to: batch.trainerData.name })}
                            >
                              <Eye size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              {batch.coTrainersData.map((ct, idx) => (
                                <span key={idx} className="text-gray-600 text-xs">{ct.name}</span>
                              ))}
                            </div>
                            {batch.transferredCoTrainerFrom && (
                              <button 
                                className="p-1 hover:bg-amber-100 rounded text-amber-600 transition-colors"
                                title="Transferred Co-Trainer"
                                onClick={() => setTransferInfo({ type: 'Co-Trainer', from: batch.transferredCoTrainerFrom, to: batch.coTrainersData.map(ct => ct.name).join(', ') })}
                              >
                                <Eye size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center font-medium text-gray-800">{batch.studentCount}</td>
                      <td className="py-4">
                        <div className="flex items-center justify-center gap-3">
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden" style={{ width: '60px' }}>
                            <div className={`h-full ${Number(batch.attendancePct) > 80 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${batch.attendancePct}%` }} />
                          </div>
                          <span className="font-bold text-gray-700 text-xs w-8">{batch.attendancePct}%</span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-red-500 font-bold">{batch.absentCount}</span>
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 border border-gray-100 shadow-sm" onClick={() => setSelectedBatchForAbsents(batch)}>
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                      {!isTrainer && (
                        <td className="py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="View Comments" onClick={() => setSelectedBatchForComments(batch)}>
                              <MessageSquare size={16} />
                            </button>
                            <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors" title="Activity Reports" onClick={() => setSelectedBatchForActivity(batch)}>
                              <ClipboardList size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={isTrainer ? "8" : "10"} className="py-12 text-center text-gray-400 italic font-medium">No completed sessions found for the selected filter.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}


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

      {/* Comments Modal */}
      {selectedBatchForComments && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '32px', borderRadius: '24px', border: 'none' }}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 m-0">Staff Comments</h2>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6B7280' }}>Batch: {selectedBatchForComments.id}</p>
              </div>
              <button onClick={() => setSelectedBatchForComments(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
            </div>

            <div className="flex flex-col gap-6" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {/* Co-Trainer Comments First */}
              <div>
                <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3">{isTrainer ? 'Trainer Feedback' : 'Co-Trainer Feedback'}</h3>
                {selectedBatchForComments.comments.coTrainer.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedBatchForComments.comments.coTrainer.map((c, i) => (
                      <li key={i} className="p-3 bg-indigo-50 rounded-xl text-sm text-indigo-900 border border-indigo-100">{c}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">No co-trainer feedback found.</p>
                )}
              </div>

              {/* Trainer Comments Second */}
              <div>
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Trainer Feedback</h3>
                {selectedBatchForComments.comments.trainer.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedBatchForComments.comments.trainer.map((c, i) => (
                      <li key={i} className="p-3 bg-blue-50 rounded-xl text-sm text-blue-900 border border-blue-100">{c}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">No trainer feedback found.</p>
                )}
              </div>
            </div>

            <button className="btn btn-primary w-full mt-8 py-4" onClick={() => setSelectedBatchForComments(null)} style={{ justifyContent: 'center' }}>Close</button>
          </div>
        </div>
      )}

      {/* Activity Reports Modal */}
      {selectedBatchForActivity && (() => {
        const batchStudents = users.filter(u => u.batch === selectedBatchForActivity.id && u.role === 'Student');
        const allActivities = Array.from(new Set(batchStudents.flatMap(s => s.detailedReport?.performance?.map(p => p.activity) || [])));

        return (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
            <div className="card animate-fade-in" style={{ width: '95%', maxWidth: '1000px', padding: '32px', borderRadius: '24px', border: 'none' }}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 m-0">Batch Activity Reports</h2>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#6B7280' }}>Batch: {selectedBatchForActivity.id} • Performance Matrix</p>
                </div>
                <button onClick={() => setSelectedBatchForActivity(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
              </div>

              <div className="table-container" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-3">Name</th>
                      <th className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-3">Average Mark</th>
                      {allActivities.map((act, i) => (
                        <th key={i} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-3 px-4">{act}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {batchStudents.map((student, sIdx) => {
                      const performances = student.detailedReport?.performance || [];
                      const scores = performances.map(p => parseInt(p.score.split('/')[0]) || 0);
                      const avgMark = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '0.0';

                      return (
                        <tr key={sIdx} className="border-t border-gray-50 text-xs">
                          <td className="py-3 font-bold text-gray-800">{student.name}</td>
                          <td className="py-3 text-center">
                            <span className="font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{avgMark}%</span>
                          </td>
                          {allActivities.map((act, aIdx) => {
                            const perf = performances.find(p => p.activity === act);
                            return (
                              <td key={aIdx} className="py-3 text-center px-4">
                                {perf ? (
                                  <div className="flex flex-col">
                                    <span className="font-bold text-gray-800">{perf.score}</span>
                                    <span className="text-[10px] text-gray-400">({perf.timeTaken})</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-300">--</span>
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

              <button className="btn btn-primary w-full mt-8 py-4" onClick={() => setSelectedBatchForActivity(null)} style={{ justifyContent: 'center' }}>Close Reports</button>
            </div>
          </div>
        );
      })()}

      {/* Session Evaluation Modal */}
      {selectedBatchForEvaluation && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '32px', borderRadius: '24px', border: 'none' }}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 m-0">Evaluate Session</h2>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6B7280' }}>Batch: {selectedBatchForEvaluation.id} • Session {selectedBatchForEvaluation.sessionNo}</p>
              </div>
              <button onClick={() => setSelectedBatchForEvaluation(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
            </div>

            <div className="flex flex-col gap-6">
              {/* Rating Section */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Performance Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setEvaluationRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={star <= evaluationRating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Section */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Administrative Feedback</label>
                <textarea
                  rows={4}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm leading-relaxed"
                  placeholder="Enter detailed feedback about the trainer, student engagement, or facility quality..."
                  value={evaluationFeedback}
                  onChange={(e) => setEvaluationFeedback(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                className="btn btn-outline flex-1 py-4 justify-center"
                onClick={() => setSelectedBatchForEvaluation(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary flex-1 py-4 justify-center"
                style={{ background: 'linear-gradient(to right, #10B981, #059669)', border: 'none' }}
                onClick={() => {
                  console.log(`Evaluation Saved for ${selectedBatchForEvaluation.id}: ${evaluationRating} stars, ${evaluationFeedback}`);
                  setSelectedBatchForEvaluation(null);
                }}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
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

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Users, UserCheck, BookOpen, Percent, Eye, X, Star, Info, MessageSquare, ClipboardList, Shield, ClipboardCheck, Trophy, BarChart2, Clock } from 'lucide-react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { users, classes, adjustDate } from '../data/mockData';

const waveStyles = `
@keyframes wave-spin-1 {
  from { transform: translate(-50%, 0) rotate(0deg); }
  to { transform: translate(-50%, 0) rotate(360deg); }
}
@keyframes wave-spin-2 {
  from { transform: translate(-50%, 0) rotate(0deg); }
  to { transform: translate(-50%, 0) rotate(-360deg); }
}
@keyframes bubble-rise-1 {
  0% { transform: translateY(120px) scale(0.3); opacity: 0; }
  50% { opacity: 0.8; }
  100% { transform: translateY(-20px) scale(1); opacity: 0; }
}
@keyframes bubble-rise-2 {
  0% { transform: translateY(120px) scale(0.4); opacity: 0; }
  30% { opacity: 0.7; }
  100% { transform: translateY(-30px) scale(0.8); opacity: 0; }
}
@keyframes bubble-rise-3 {
  0% { transform: translateY(120px) scale(0.2); opacity: 0; }
  60% { opacity: 0.9; }
  100% { transform: translateY(-10px) scale(1.1); opacity: 0; }
}
`;

function LiquidProgress({ percent, title, themeColor }) {
  // Ultra-Premium dynamic theme palettes (Light Blue / Water theme & Emerald theme)
  const primaryColor = themeColor === 'green' ? '#10b981' : '#0ea5e9'; // Stunning sky blue
  const secondaryColor = themeColor === 'green' ? '#34d399' : '#38bdf8'; // Stunning light sky blue
  const liquidBg = themeColor === 'green'
    ? 'linear-gradient(to top, #047857, #10b981)'
    : 'linear-gradient(to top, #0284c7, #38bdf8)'; // Glassy, tropical light blue water!

  // Map water level height exactly 1:1 to the percentage value inside the donut.
  const visualHeight = percent;
  const isSubmerged = visualHeight > 48;

  return (
    <div style={{
      position: 'absolute',
      width: '160px', // Perfectly fits the innerRadius={80} (160px diameter) donut hole
      height: '160px',
      borderRadius: '50%',
      backgroundColor: 'transparent',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      zIndex: 5,
      top: '50%', // Mathematically perfect centering (legend rendered as HTML outside SVG)
      left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none'
    }}>
      <style>{waveStyles}</style>

      {/* Bubbles */}
      <div style={{
        position: 'absolute',
        width: '4px',
        height: '4px',
        backgroundColor: secondaryColor,
        borderRadius: '50%',
        left: '25%',
        animation: 'bubble-rise-1 4s infinite ease-in-out',
        opacity: 0
      }} />
      <div style={{
        position: 'absolute',
        width: '6px',
        height: '6px',
        backgroundColor: secondaryColor,
        borderRadius: '50%',
        left: '55%',
        animation: 'bubble-rise-2 5s infinite ease-in-out 1.5s',
        opacity: 0
      }} />
      <div style={{
        position: 'absolute',
        width: '3px',
        height: '3px',
        backgroundColor: secondaryColor,
        borderRadius: '50%',
        left: '75%',
        animation: 'bubble-rise-3 4.5s infinite ease-in-out 0.7s',
        opacity: 0
      }} />

      {/* Liquid Wave Mask & Container */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: `${visualHeight}%`,
        background: liquidBg,
        transition: 'height 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: 0.85
      }}>
        {/* Irregular rotating shapes to simulate wave action */}
        {/* Placed close to top ('-8px' / '-5px') so they extend DOWNWARDS (matching 280px/290px height), */}
        {/* keeping the visible waterline sloshing exactly around the percentage value! */}
        <div style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          backgroundColor: primaryColor,
          borderRadius: '45% 47% 43% 46%',
          top: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'wave-spin-1 10s infinite linear',
          opacity: 0.8,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          width: '290px',
          height: '290px',
          backgroundColor: secondaryColor,
          borderRadius: '46% 44% 48% 45%',
          top: '-5px',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'wave-spin-2 8s infinite linear',
          opacity: 0.5,
          pointerEvents: 'none'
        }} />
      </div>

      {/* Percentage and Labels overlay */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textShadow: isSubmerged ? '0 2px 4px rgba(0,0,0,0.25)' : 'none'
      }}>
        <span style={{
          fontSize: '34px',
          fontWeight: '900',
          lineHeight: '1',
          letterSpacing: '-0.02em',
          marginBottom: '4px',
          color: isSubmerged ? '#ffffff' : '#0f172a',
          transition: 'color 0.5s ease-in-out'
        }}>
          {percent}%
        </span>
        <span style={{
          fontSize: '10px',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '0.12em', // Premium wider letter-spacing
          color: isSubmerged
            ? (themeColor === 'green' ? '#e6fffa' : '#e0f2fe')
            : (themeColor === 'green' ? '#059669' : '#0284c7'),
          transition: 'color 0.5s ease-in-out'
        }}>
          {title}
        </span>
      </div>
    </div>
  );
}

export default function DashboardOverview({ userRole, userName }) {
  const [selectedBatchForAbsents, setSelectedBatchForAbsents] = useState(null);
  const [selectedBatchForComments, setSelectedBatchForComments] = useState(null);
  const [selectedBatchForActivity, setSelectedBatchForActivity] = useState(null);
  const [selectedBatchForEvaluation, setSelectedBatchForEvaluation] = useState(null);
  const [transferInfo, setTransferInfo] = useState(null);
  const [evaluationRating, setEvaluationRating] = useState(0);
  const [evaluationFeedback, setEvaluationFeedback] = useState('');
  const [upcomingRange] = useState({ from: "", to: "" });
  const [completedRange, setCompletedRange] = useState({ from: "", to: "" });

  const today = adjustDate("2026-05-15");
  const tomorrow = adjustDate("2026-05-16");

  const isTrainer = userRole === 'Trainer' || userRole === 'Co-Trainer';
  const isStudent = userRole === 'Student';
  const showTrainerCol = userRole !== 'Trainer';
  const showCoTrainersCol = userRole !== 'Co-Trainer';

  const studentData = isStudent ? users.find(u => u.name === userName && u.role === 'Student') : null;
  const students = users.filter(u => u.role === 'Student');
  const myClasses = isTrainer
    ? classes.filter(c => c.trainer === userName || c.coTrainers?.includes(userName))
    : isStudent
      ? classes.filter(c => c.id === studentData?.batch)
      : classes;

  const trainerKPIs = isTrainer ? {
    totalBatches: myClasses.length,
    completedBatches: myClasses.filter(c => c.status === 'Completed').length,
    remainingBatches: myClasses.filter(c => c.status !== 'Completed').length,
    totalSessions: myClasses.reduce((acc, c) => acc + (c.sessions?.length || 0), 0),
    completedSessions: myClasses.reduce((acc, c) => acc + (c.sessions?.filter(s => s.date < today).length || 0), 0),
    remainingSessions: myClasses.reduce((acc, c) => acc + (c.sessions?.filter(s => s.date >= today).length || 0), 0),
  } : null;

  const studentKPIs = isStudent ? {
    attendance: studentData.attendance,
    score: studentData.score,
    activitiesCompleted: studentData.detailedReport?.performance?.length || 0,
    progress: 75 // Mock progress
  } : null;



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
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: '32px'
      }}>
        {isTrainer ? (
          <>
            <div style={{ backgroundColor: 'white', borderRadius: '32px', padding: '24px 32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BookOpen size={28} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.72rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Total Batches</h3>
                <p style={{ margin: '4px 0 0', fontSize: '2.25rem', fontWeight: '900', color: '#111827', lineHeight: 1 }}>{trainerKPIs.totalBatches}</p>
              </div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '32px', padding: '24px 32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#F0FDF4', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Shield size={28} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.72rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Completed</h3>
                <p style={{ margin: '4px 0 0', fontSize: '2.25rem', fontWeight: '900', color: '#111827', lineHeight: 1 }}>{trainerKPIs.completedBatches}</p>
              </div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '32px', padding: '24px 32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#F5F3FF', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Users size={28} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.72rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Total Sessions</h3>
                <p style={{ margin: '4px 0 0', fontSize: '2.25rem', fontWeight: '900', color: '#111827', lineHeight: 1 }}>{trainerKPIs.totalSessions}</p>
              </div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '32px', padding: '24px 32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#ECFEFF', color: '#06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Percent size={28} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.72rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Sessions Done</h3>
                <p style={{ margin: '4px 0 0', fontSize: '2.25rem', fontWeight: '900', color: '#111827', lineHeight: 1 }}>{trainerKPIs.completedSessions}</p>
              </div>
            </div>
          </>
        ) : isStudent ? (
          <>
            <div style={{ backgroundColor: 'white', borderRadius: '32px', padding: '24px 32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <UserCheck size={28} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.72rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Attendance %</h3>
                <p style={{ margin: '4px 0 0', fontSize: '2.25rem', fontWeight: '900', color: '#111827', lineHeight: 1 }}>{studentKPIs.attendance}%</p>
              </div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '32px', padding: '24px 32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#F0FDF4', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Trophy size={28} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.72rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Performance</h3>
                <p style={{ margin: '4px 0 0', fontSize: '2.25rem', fontWeight: '900', color: '#111827', lineHeight: 1 }}>{studentKPIs.score}</p>
              </div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '32px', padding: '24px 32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#F5F3FF', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ClipboardCheck size={28} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.72rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Activities</h3>
                <p style={{ margin: '4px 0 0', fontSize: '2.25rem', fontWeight: '900', color: '#111827', lineHeight: 1 }}>{studentKPIs.activitiesCompleted}</p>
              </div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '32px', padding: '24px 32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#ECFEFF', color: '#06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Percent size={28} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.72rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Progress %</h3>
                <p style={{ margin: '4px 0 0', fontSize: '2.25rem', fontWeight: '900', color: '#111827', lineHeight: 1 }}>{studentKPIs.progress}%</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ backgroundColor: 'white', borderRadius: '32px', padding: '24px 32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Users size={28} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.72rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Total Trainers</h3>
                <p style={{ margin: '4px 0 0', fontSize: '2.25rem', fontWeight: '900', color: '#111827', lineHeight: 1 }}>{users.filter(u => u.role === 'Trainer').length}</p>
              </div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '32px', padding: '24px 32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#F5F3FF', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <UserCheck size={28} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.72rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Co Trainers</h3>
                <p style={{ margin: '4px 0 0', fontSize: '2.25rem', fontWeight: '900', color: '#111827', lineHeight: 1 }}>{users.filter(u => u.role === 'Co-Trainer').length}</p>
              </div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '32px', padding: '24px 32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#ECFEFF', color: '#06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BookOpen size={28} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.72rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>No. of Batches</h3>
                <p style={{ margin: '4px 0 0', fontSize: '2.25rem', fontWeight: '900', color: '#111827', lineHeight: 1 }}>{classes.length}</p>
              </div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '32px', padding: '24px 32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#FFF7ED', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Users size={28} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.72rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Total Students</h3>
                <p style={{ margin: '4px 0 0', fontSize: '2.25rem', fontWeight: '900', color: '#111827', lineHeight: 1 }}>{users.filter(u => u.role === 'Student').length}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Advanced Analytics Section - Funnel Charts (Admin Only) */}
      {!isStudent && (() => {
        // Calculations for Batch Funnel
        const activeBatchesCount = classes.filter(c => c.status === 'Active').length;
        const remainingBatchesCount = classes.filter(c => c.status === 'Upcoming').length;
        const completedBatchesCount = completedBatches.length;

        const totalBatches = activeBatchesCount + remainingBatchesCount + completedBatchesCount;
        const batchCompletionPercent = totalBatches > 0 ? Math.round((completedBatchesCount / totalBatches) * 100) : 0;

        const batchData = [
          { name: 'Active Batches', value: activeBatchesCount, fill: '#10b981' },
          { name: 'Completed Batches', value: completedBatchesCount, fill: '#0ea5e9' },
          { name: 'Remaining Batches', value: remainingBatchesCount, fill: '#f59e0b' }
        ];

        // Calculations for Student Funnel
        const totalStudents = users.filter(u => u.role === 'Student').length;
        const completedStudentsCount = completedBatches.reduce((acc, b) => acc + (b.studentCount || 0), 0) || Math.floor(totalStudents * 0.15);
        const attendingStudentsCount = todayBatches.reduce((acc, b) => acc + (b.studentCount || 0), 0) || Math.floor(totalStudents * 0.45);
        const remainingStudentsCount = Math.max(0, totalStudents - completedStudentsCount - attendingStudentsCount);

        const studentCompletionPercent = totalStudents > 0 ? Math.round((completedStudentsCount / totalStudents) * 100) : 0;

        const studentData = [
          { name: 'Attending Students', value: attendingStudentsCount, fill: '#10b981' },
          { name: 'Completed Students', value: completedStudentsCount, fill: '#0ea5e9' },
          { name: 'Remaining Students', value: remainingStudentsCount, fill: '#f59e0b' }
        ];

        return (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '32px',
            marginBottom: '48px',
            marginTop: '16px'
          }}>
            {/* Batch Status Overview */}
            <div style={{ 
              backgroundColor: 'white', borderRadius: '32px', padding: '32px', 
              border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)',
              display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', borderRadius: '12px', backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
                    <BarChart2 size={20} />
                  </div>
                  Batch Status Overview
                </h2>
                <span style={{ fontSize: '0.875rem', fontWeight: '800', color: '#64748B', backgroundColor: '#F8FAFC', padding: '6px 16px', borderRadius: '12px' }}>
                  Total: {totalBatches}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '20px' }}>
                <div style={{ width: '100%', height: 260, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip wrapperStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} contentStyle={{ borderRadius: '16px', border: 'none', padding: '12px 20px', fontWeight: '700' }} />
                      <Pie
                        data={batchData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                        startAngle={90}
                        endAngle={-270}
                        isAnimationActive
                      >
                        {batchData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <LiquidProgress percent={batchCompletionPercent} title="Completed" themeColor="blue" />
                </div>

                {/* Highly Polished External HTML Legend for Perfect Centering */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '16px' }}>
                  {batchData.map((entry, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: entry.fill }} />
                      <span style={{ fontSize: '0.8125rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Student Status Overview */}
            <div style={{ 
              backgroundColor: 'white', borderRadius: '32px', padding: '32px', 
              border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)',
              display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', borderRadius: '12px', backgroundColor: '#F0FDF4', color: '#10B981' }}>
                    <Users size={20} />
                  </div>
                  Student Status Overview
                </h2>
                <span style={{ fontSize: '0.875rem', fontWeight: '800', color: '#64748B', backgroundColor: '#F8FAFC', padding: '6px 16px', borderRadius: '12px' }}>
                  Total: {totalStudents}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '20px' }}>
                <div style={{ width: '100%', height: 260, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip wrapperStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} contentStyle={{ borderRadius: '16px', border: 'none', padding: '12px 20px', fontWeight: '700' }} />
                      <Pie
                        data={studentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                        startAngle={90}
                        endAngle={-270}
                        isAnimationActive
                      >
                        {studentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <LiquidProgress percent={studentCompletionPercent} title="Completed" themeColor="blue" />
                </div>

                {/* Highly Polished External HTML Legend for Perfect Centering */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '16px' }}>
                  {studentData.map((entry, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: entry.fill }} />
                      <span style={{ fontSize: '0.8125rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Tables Section */}
      <div className="flex flex-col" style={{ gap: '20px' }}>

        {/* Active Session Table (Common for all but layout slightly different) */}
        <div style={{ backgroundColor: 'white', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', overflow: 'hidden', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                      <th className="sticky-col-1 text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Batch</th>
                      <th className="sticky-col-2 text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Session No.</th>
                      <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Time</th>
                      <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Lab</th>
                      {showTrainerCol && <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Trainer</th>}
                      {showCoTrainersCol && <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Co Trainers</th>}
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
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {todayBatches.map(batch => (
                  <tr key={batch.id} className="border-t border-gray-50 text-sm">
                    {!isStudent ? (
                      <>
                        <td className="sticky-col-1 py-4" style={{ whiteSpace: 'nowrap' }}>
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            padding: '6px 12px', 
                            borderRadius: '12px', 
                            fontSize: '0.8rem', 
                            fontWeight: '700', 
                            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)', 
                            color: '#4F46E5',
                            boxShadow: '0 2px 4px rgba(79, 70, 229, 0.02)'
                          }}>
                            {batch.id}
                          </span>
                        </td>
                        <td className="sticky-col-2 py-4 text-center" style={{ whiteSpace: 'nowrap' }}>
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            padding: '4px 10px', 
                            borderRadius: '8px', 
                            fontSize: '0.78rem', 
                            fontWeight: '700', 
                            backgroundColor: '#F8FAFC', 
                            color: '#64748B',
                            border: '1px solid #E2E8F0'
                          }}>
                            #{batch.sessionNo}
                          </span>
                        </td>
                        <td className="py-4 text-gray-500 font-medium" style={{ whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                            <span style={{ color: '#94A3B8', display: 'flex', alignItems: 'center' }}><Clock size={14} /></span>
                            <span style={{ color: '#475569', fontWeight: '600' }}>{batch.sessionTime}</span>
                          </div>
                        </td>
                        <td className="py-4 font-bold text-gray-600" style={{ whiteSpace: 'nowrap' }}>
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '6px',
                            padding: '6px 12px', 
                            borderRadius: '10px', 
                            fontSize: '0.82rem', 
                            backgroundColor: '#F0FDFA', 
                            color: '#0D9488',
                            border: '1px solid #CCFBF1'
                          }}>
                            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0D9488' }}></span>
                            {batch.lab}
                          </span>
                        </td>
                        {showTrainerCol && (
                          <td className="py-4 text-gray-800 font-bold" style={{ whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ 
                                width: '28px', 
                                height: '28px', 
                                borderRadius: '50%', 
                                backgroundColor: '#EEF2FF', 
                                color: '#4F46E5', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontSize: '0.75rem', 
                                fontWeight: '700',
                                border: '1px solid #E0E7FF',
                                flexShrink: 0
                              }}>
                                {batch.trainerData.name.split(' ').pop().charAt(0)}
                              </div>
                              <span style={{ color: '#1E293B', fontSize: '0.85rem', fontWeight: '600' }}>{batch.trainerData.name}</span>
                              {batch.transferredFrom && (
                                <button 
                                  style={{ 
                                    border: 'none', 
                                    background: 'rgba(245, 158, 11, 0.1)', 
                                    color: '#D97706', 
                                    borderRadius: '6px', 
                                    padding: '4px 6px', 
                                    cursor: 'pointer', 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                  }}
                                  title={`Transferred Session (From ${batch.transferredFrom})`}
                                  onClick={() => setTransferInfo({ type: 'Trainer', from: batch.transferredFrom, to: batch.trainerData.name })}
                                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.18)'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'}
                                >
                                  <Eye size={12} />
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                        {showCoTrainersCol && (
                          <td className="py-4" style={{ whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                {batch.coTrainersData.map((ct, idx) => (
                                  <span key={idx} style={{ color: '#475569', fontSize: '0.8rem', fontWeight: '600' }}>{ct.name}</span>
                                ))}
                              </div>
                              {batch.transferredCoTrainerFrom && (
                                <button 
                                  style={{ 
                                    border: 'none', 
                                    background: 'rgba(245, 158, 11, 0.1)', 
                                    color: '#D97706', 
                                    borderRadius: '6px', 
                                    padding: '4px 6px', 
                                    cursor: 'pointer', 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                  }}
                                  title={`Transferred Co-Trainer (From ${batch.transferredCoTrainerFrom})`}
                                  onClick={() => setTransferInfo({ type: 'Co-Trainer', from: batch.transferredCoTrainerFrom, to: batch.coTrainersData.map(ct => ct.name).join(', ') })}
                                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.18)'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'}
                                >
                                  <Eye size={12} />
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                        <td className="py-4 text-center font-bold" style={{ whiteSpace: 'nowrap', fontSize: '0.9rem', color: '#334155' }}>{batch.studentCount}</td>
                        <td className="py-4 text-center" style={{ whiteSpace: 'nowrap' }}>
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            width: '72px',
                            padding: '6px 12px', 
                            borderRadius: '12px', 
                            fontSize: '0.82rem', 
                            fontWeight: '700', 
                            backgroundColor: 'rgba(16, 185, 129, 0.08)', 
                            color: '#10B981',
                            border: '1px solid rgba(16, 185, 129, 0.12)'
                          }}>
                            {batch.attendancePct}%
                          </span>
                        </td>
                        <td className="py-4 text-center" style={{ whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                            <span style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '6px',
                              padding: '6px 12px', 
                              borderRadius: '12px', 
                              fontSize: '0.82rem', 
                              fontWeight: '700', 
                              backgroundColor: batch.absentCount > 0 ? 'rgba(239, 68, 68, 0.08)' : '#F1F5F9', 
                              color: batch.absentCount > 0 ? '#EF4444' : '#64748B',
                              border: batch.absentCount > 0 ? '1px solid rgba(239, 68, 68, 0.12)' : '1px solid #E2E8F0'
                            }}>
                              <span>{batch.absentCount} Absent</span>
                              <button 
                                style={{ 
                                  border: 'none', 
                                  background: 'none', 
                                  color: batch.absentCount > 0 ? '#EF4444' : '#64748B', 
                                  padding: '0', 
                                  cursor: 'pointer', 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  marginLeft: '4px'
                                }} 
                                onClick={() => setSelectedBatchForAbsents(batch)}
                                title="View Absents"
                              >
                                <Eye size={14} />
                              </button>
                            </span>
                          </div>
                        </td>
                        <td className="py-4" style={{ whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <button 
                              style={{ 
                                border: 'none', 
                                background: 'rgba(79, 70, 229, 0.08)', 
                                color: '#4F46E5', 
                                borderRadius: '8px', 
                                padding: '8px', 
                                cursor: 'pointer', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                              }} 
                              title="Activity Reports" 
                              onClick={() => setSelectedBatchForActivity(batch)}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(79, 70, 229, 0.16)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(79, 70, 229, 0.08)'}
                            >
                              <ClipboardList size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 text-gray-500 font-medium" style={{ whiteSpace: 'nowrap' }}>{batch.sessionTime}</td>
                        <td className="py-4 text-gray-600 font-bold" style={{ whiteSpace: 'nowrap' }}>{batch.lab}</td>
                        <td className="py-4 text-gray-800 font-bold" style={{ whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{batch.trainerData.name}</span>
                            {batch.transferredFrom && (
                              <button 
                                style={{ 
                                  border: 'none', 
                                  background: 'rgba(245, 158, 11, 0.1)', 
                                  color: '#D97706', 
                                  borderRadius: '6px', 
                                  padding: '4px 6px', 
                                  cursor: 'pointer', 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  transition: 'all 0.2s'
                                }}
                                title="Transferred Session"
                                onClick={() => setTransferInfo({ type: 'Trainer', from: batch.transferredFrom, to: batch.trainerData.name })}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.18)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'}
                              >
                                <Eye size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-4 text-center" style={{ whiteSpace: 'nowrap' }}>
                          <span className={`badge ${studentData.detailedReport?.sessions?.find(s => s.date === batch.actualDate)?.attendance === 'Present' ? 'badge-green' : 'bg-red-50 text-red-600'}`}>
                            {studentData.detailedReport?.sessions?.find(s => s.date === batch.actualDate)?.attendance || 'Upcoming'}
                          </span>
                        </td>
                        <td className="py-4 text-center font-bold text-indigo-600" style={{ whiteSpace: 'nowrap' }}>--</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Session Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', overflow: 'hidden', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><ClipboardList size={20} /></div>
            Upcoming Session
          </h2>
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Batch</th>
                  <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Session No.</th>
                  <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Time</th>
                  <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Lab</th>
                  {showTrainerCol && <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Trainer</th>}
                  {showCoTrainersCol && <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Co Trainers</th>}
                  <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">No. of Students</th>
                </tr>
              </thead>
              <tbody>
                {tomorrowBatches.map(batch => (
                  <tr key={batch.id} className="border-t border-gray-50 text-sm">
                    <td className="py-4" style={{ whiteSpace: 'nowrap' }}>
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        padding: '6px 12px', 
                        borderRadius: '12px', 
                        fontSize: '0.8rem', 
                        fontWeight: '700', 
                        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)', 
                        color: '#4F46E5',
                        boxShadow: '0 2px 4px rgba(79, 70, 229, 0.02)'
                      }}>
                        {batch.id}
                      </span>
                    </td>
                    <td className="py-4 text-center" style={{ whiteSpace: 'nowrap' }}>
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        padding: '4px 10px', 
                        borderRadius: '8px', 
                        fontSize: '0.78rem', 
                        fontWeight: '700', 
                        backgroundColor: '#F8FAFC', 
                        color: '#64748B',
                        border: '1px solid #E2E8F0'
                      }}>
                        #{batch.sessionNo}
                      </span>
                    </td>
                    <td className="py-4 text-gray-500 font-medium" style={{ whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' }}>
                        <span style={{ color: '#94A3B8', display: 'flex', alignItems: 'center' }}><Clock size={14} /></span>
                        <span style={{ color: '#475569', fontWeight: '600' }}>{batch.sessionTime}</span>
                      </div>
                    </td>
                    <td className="py-4 font-bold text-gray-600" style={{ whiteSpace: 'nowrap' }}>
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '6px 12px', 
                        borderRadius: '10px', 
                        fontSize: '0.82rem', 
                        backgroundColor: '#F0FDFA', 
                        color: '#0D9488',
                        border: '1px solid #CCFBF1'
                      }}>
                        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0D9488' }}></span>
                        {batch.lab}
                      </span>
                    </td>
                    {showTrainerCol && (
                      <td className="py-4 text-gray-800 font-bold" style={{ whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                          <div style={{ 
                            width: '28px', 
                            height: '28px', 
                            borderRadius: '50%', 
                            backgroundColor: '#EEF2FF', 
                            color: '#4F46E5', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '0.75rem', 
                            fontWeight: '700',
                            border: '1px solid #E0E7FF',
                            flexShrink: 0
                          }}>
                            {batch.trainerData.name.split(' ').pop().charAt(0)}
                          </div>
                          <span style={{ color: '#1E293B', fontSize: '0.85rem', fontWeight: '600' }}>{batch.trainerData.name}</span>
                          {batch.transferredFrom && (
                            <button 
                              style={{ 
                                border: 'none', 
                                background: 'rgba(245, 158, 11, 0.1)', 
                                color: '#D97706', 
                                borderRadius: '6px', 
                                padding: '4px 6px', 
                                cursor: 'pointer', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                              }}
                              title={`Transferred Session (From ${batch.transferredFrom})`}
                              onClick={() => setTransferInfo({ type: 'Trainer', from: batch.transferredFrom, to: batch.trainerData.name })}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.18)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'}
                            >
                              <Eye size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                    {showCoTrainersCol && (
                      <td className="py-4" style={{ whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {batch.coTrainersData.map((ct, idx) => (
                              <span key={idx} style={{ color: '#475569', fontSize: '0.8rem', fontWeight: '600' }}>{ct.name}</span>
                            ))}
                          </div>
                          {batch.transferredCoTrainerFrom && (
                            <button 
                              style={{ 
                                border: 'none', 
                                background: 'rgba(245, 158, 11, 0.1)', 
                                color: '#D97706', 
                                borderRadius: '6px', 
                                padding: '4px 6px', 
                                cursor: 'pointer', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                              }}
                              title={`Transferred Co-Trainer (From ${batch.transferredCoTrainerFrom})`}
                              onClick={() => setTransferInfo({ type: 'Co-Trainer', from: batch.transferredCoTrainerFrom, to: batch.coTrainersData.map(ct => ct.name).join(', ') })}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.18)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'}
                            >
                              <Eye size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                    <td className="py-4 text-center font-bold" style={{ whiteSpace: 'nowrap', fontSize: '0.9rem', color: '#334155' }}>{batch.studentCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Completed Session Table (Student Only) */}
        {isStudent && (
          <div style={{ backgroundColor: 'white', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', overflow: 'hidden', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                      <td className="py-4 text-gray-600 font-bold" style={{ whiteSpace: 'nowrap' }}>#{idx + 1}</td>
                      <td className="py-4 text-gray-500 font-medium" style={{ whiteSpace: 'nowrap' }}>{sess.date} | 09:00 - 11:00</td>
                      <td className="py-4 text-gray-600 font-bold" style={{ whiteSpace: 'nowrap' }}>Advanced Computing Lab</td>
                      <td className="py-4 text-gray-800 font-bold" style={{ whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{sess.trainer || 'Dr. Sarah Lee'}</span>
                          {sess.transferredFrom && (
                            <button 
                              style={{ 
                                border: 'none', 
                                background: 'rgba(245, 158, 11, 0.1)', 
                                color: '#D97706', 
                                borderRadius: '6px', 
                                padding: '4px 6px', 
                                cursor: 'pointer', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                              }}
                              title="Transferred Session"
                              onClick={() => setTransferInfo({ type: 'Trainer', from: sess.transferredFrom, to: sess.trainer || 'Dr. Sarah Lee' })}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.18)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'}
                            >
                              <Eye size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-4 text-center" style={{ whiteSpace: 'nowrap' }}>
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
          <div style={{ backgroundColor: 'white', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', overflow: 'hidden', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
          <div style={{ backgroundColor: 'white', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', overflow: 'hidden', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
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
                {completedRange.from && completedRange.to ? `Showing ${completedRange.from} to ${completedRange.to}` : "Showing last week's Completed Session"}
              </p>
            </div>
            <div className="table-container">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="sticky-col-1 text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Batch Name</th>
                    <th className="sticky-col-2 text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Session No.</th>
                    <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Session Time</th>
                    <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Lab</th>
                    {showTrainerCol && <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Trainer</th>}
                    {showCoTrainersCol && <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Co Trainers</th>}
                    <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">No. of Students</th>
                    <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Attendance %</th>
                    <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Absent</th>
                    {!isTrainer && <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {completedBatches.length > 0 ? completedBatches.map((batch, idx) => (
                    <tr key={`${batch.id}-${idx}`} className="border-t border-gray-50 text-sm">
                      <td className="sticky-col-1 py-4" style={{ whiteSpace: 'nowrap' }}>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800">{batch.id}</span>
                          {batch.actualDate && <span className="text-[10px] text-gray-400 font-medium">{batch.actualDate}</span>}
                        </div>
                      </td>
                      <td className="sticky-col-2 py-4 text-center font-bold text-gray-600" style={{ whiteSpace: 'nowrap' }}>#{batch.sessionNo}</td>
                      <td className="py-4 text-gray-500" style={{ whiteSpace: 'nowrap' }}>{batch.sessionTime}</td>
                      <td className="py-4 text-gray-600 font-medium" style={{ whiteSpace: 'nowrap' }}>{batch.lab}</td>
                      {showTrainerCol && (
                        <td className="py-4 text-gray-800 font-bold" style={{ whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{batch.trainerData.name}</span>
                            {batch.transferredFrom && (
                              <button 
                                style={{ 
                                  border: 'none', 
                                  background: 'rgba(245, 158, 11, 0.1)', 
                                  color: '#D97706', 
                                  borderRadius: '6px', 
                                  padding: '4px 6px', 
                                  cursor: 'pointer', 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  transition: 'all 0.2s'
                                }}
                                title="Transferred Session"
                                onClick={() => setTransferInfo({ type: 'Trainer', from: batch.transferredFrom, to: batch.trainerData.name })}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.18)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'}
                              >
                                <Eye size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                      {showCoTrainersCol && (
                        <td className="py-4" style={{ whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              {batch.coTrainersData.map((ct, idx) => (
                                <span key={idx} className="text-gray-600 text-xs font-bold">{ct.name}</span>
                              ))}
                            </div>
                            {batch.transferredCoTrainerFrom && (
                              <button 
                                style={{ 
                                  border: 'none', 
                                  background: 'rgba(245, 158, 11, 0.1)', 
                                  color: '#D97706', 
                                  borderRadius: '6px', 
                                  padding: '4px 6px', 
                                  cursor: 'pointer', 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  transition: 'all 0.2s'
                                }}
                                title="Transferred Co-Trainer"
                                onClick={() => setTransferInfo({ type: 'Co-Trainer', from: batch.transferredCoTrainerFrom, to: batch.coTrainersData.map(ct => ct.name).join(', ') })}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.18)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'}
                              >
                                <Eye size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                      <td className="py-4 text-center font-medium text-gray-800" style={{ whiteSpace: 'nowrap' }}>{batch.studentCount}</td>
                      <td className="py-4 text-center" style={{ whiteSpace: 'nowrap' }}>
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          width: '72px',
                          padding: '6px 12px', 
                          borderRadius: '12px', 
                          fontSize: '0.82rem', 
                          fontWeight: '700', 
                          backgroundColor: 'rgba(16, 185, 129, 0.08)', 
                          color: '#10B981',
                          border: '1px solid rgba(16, 185, 129, 0.12)'
                        }}>
                          {batch.attendancePct}%
                        </span>
                      </td>
                      <td className="py-4 text-center" style={{ whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                          <span className="text-red-500 font-bold" style={{ fontSize: '0.95rem' }}>{batch.absentCount}</span>
                          <button 
                            style={{ 
                              border: 'none', 
                              background: 'rgba(239, 68, 68, 0.08)', 
                              color: '#EF4444', 
                              borderRadius: '8px', 
                              padding: '6px', 
                              cursor: 'pointer', 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              transition: 'all 0.2s'
                            }} 
                            onClick={() => setSelectedBatchForAbsents(batch)}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.16)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                      {!isTrainer && (
                        <td className="py-4" style={{ whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <button 
                              style={{ 
                                border: 'none', 
                                background: 'rgba(79, 70, 229, 0.08)', 
                                color: '#4F46E5', 
                                borderRadius: '8px', 
                                padding: '8px', 
                                cursor: 'pointer', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                              }} 
                              title="Activity Reports" 
                              onClick={() => setSelectedBatchForActivity(batch)}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(79, 70, 229, 0.16)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(79, 70, 229, 0.08)'}
                            >
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
      {selectedBatchForAbsents && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', padding: '20px' }}>
          <div className="animate-fade-in" style={{ backgroundColor: 'white', boxShadow: '0 30px 60px -12px rgba(15, 23, 42, 0.25)', width: '100%', maxWidth: '500px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.2)', overflow: 'hidden' }}>
            <div style={{ padding: '40px 40px 30px 40px', background: 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)', position: 'relative', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                <button onClick={() => setSelectedBatchForAbsents(null)} style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: 'none', padding: '8px', borderRadius: '12px', color: 'white', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}><X size={20} /></button>
              </div>
              <div className="flex items-center gap-4">
                <div style={{ padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '16px', backdropFilter: 'blur(10px)', color: 'white' }}>
                  <Users size={32} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>Absent Students</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span style={{ padding: '4px 10px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>Batch {selectedBatchForAbsents.id}</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ overflowY: 'auto', padding: '40px', flex: 1, backgroundColor: '#F8FAFC' }}>
              <div className="flex flex-col gap-4">
                {selectedBatchForAbsents.absentStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <img src={student.photo} alt={student.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #F1F5F9' }} />
                      <div><p className="m-0 font-bold text-gray-800">{student.name}</p><p className="m-0 text-xs text-gray-500">{student.email}</p></div>
                    </div>
                    <div className="text-right">
                      <p className="m-0 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Attendance</p>
                      <p className="m-0 text-xl font-black text-rose-600">{student.attendance}%</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                style={{ width: '100%', marginTop: '32px', padding: '16px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: 'white', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.3)', transition: 'transform 0.2s' }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.target.style.transform = 'none'}
                onClick={() => setSelectedBatchForAbsents(null)}>Close Roster</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Comments Modal */}
      {selectedBatchForComments && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', padding: '20px' }}>
          <div className="animate-fade-in" style={{ backgroundColor: 'white', boxShadow: '0 30px 60px -12px rgba(15, 23, 42, 0.25)', width: '100%', maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.2)', overflow: 'hidden' }}>
            <div style={{ padding: '40px 40px 30px 40px', background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', position: 'relative', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                <button onClick={() => setSelectedBatchForComments(null)} style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: 'none', padding: '8px', borderRadius: '12px', color: 'white', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}><X size={20} /></button>
              </div>
              <div className="flex items-center gap-4">
                <div style={{ padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '16px', backdropFilter: 'blur(10px)', color: 'white' }}>
                  <MessageSquare size={32} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>Staff Comments</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span style={{ padding: '4px 10px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>Batch {selectedBatchForComments.id}</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ overflowY: 'auto', padding: '40px', flex: 1, backgroundColor: '#F8FAFC' }}>
              <div className="flex flex-col gap-8">
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#6D28D9', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>{isTrainer ? 'Trainer Feedback' : 'Co-Trainer Feedback'}</h3>
                  {selectedBatchForComments.comments.coTrainer.length > 0 ? (
                    <ul className="space-y-3">
                      {selectedBatchForComments.comments.coTrainer.map((c, i) => (
                        <li key={i} style={{ padding: '16px', backgroundColor: 'white', borderRadius: '16px', color: '#4C1D95', border: '1px solid #EDE9FE', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>{c}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: '#94A3B8', fontStyle: 'italic', fontSize: '0.875rem' }}>No co-trainer feedback found.</p>
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Trainer Feedback</h3>
                  {selectedBatchForComments.comments.trainer.length > 0 ? (
                    <ul className="space-y-3">
                      {selectedBatchForComments.comments.trainer.map((c, i) => (
                        <li key={i} style={{ padding: '16px', backgroundColor: 'white', borderRadius: '16px', color: '#1E3A8A', border: '1px solid #DBEAFE', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>{c}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: '#94A3B8', fontStyle: 'italic', fontSize: '0.875rem' }}>No trainer feedback found.</p>
                  )}
                </div>
              </div>
              <button 
                style={{ width: '100%', marginTop: '32px', padding: '16px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: 'white', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.3)', transition: 'transform 0.2s' }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.target.style.transform = 'none'}
                onClick={() => setSelectedBatchForComments(null)}>Close Reviews</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Activity Reports Modal */}
      {selectedBatchForActivity && (() => {
        const batchStudents = users.filter(u => u.batch === selectedBatchForActivity.id && u.role === 'Student');
        const allActivities = Array.from(new Set(batchStudents.flatMap(s => s.detailedReport?.performance?.map(p => p.activity) || [])));

        return createPortal(
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', padding: '20px' }}>
            <div className="animate-fade-in" style={{ backgroundColor: 'white', boxShadow: '0 30px 60px -12px rgba(15, 23, 42, 0.25)', width: '100%', maxWidth: '1000px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.2)', overflow: 'hidden' }}>
              <div style={{ padding: '40px 40px 30px 40px', background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', position: 'relative', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                  <button onClick={() => setSelectedBatchForActivity(null)} style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: 'none', padding: '8px', borderRadius: '12px', color: 'white', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}><X size={20} /></button>
                </div>
                <div className="flex items-center gap-4">
                  <div style={{ padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '16px', backdropFilter: 'blur(10px)', color: 'white' }}>
                    <ClipboardList size={32} />
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>Batch Activity Reports</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span style={{ padding: '4px 10px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>Batch {selectedBatchForActivity.id}</span>
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>Performance Matrix</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ overflowY: 'auto', padding: '40px', flex: 1, backgroundColor: '#F8FAFC' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid #F1F5F9', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #F1F5F9' }}>
                      <tr>
                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Mark</th>
                        {allActivities.map((act, i) => (
                          <th key={i} style={{ padding: '16px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{act}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {batchStudents.map((student, sIdx) => {
                        const performances = student.detailedReport?.performance || [];
                        const scores = performances.map(p => parseInt(p.score.split('/')[0]) || 0);
                        const avgMark = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '0.0';
                        return (
                          <tr key={sIdx} style={{ borderBottom: sIdx !== batchStudents.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                            <td style={{ padding: '16px', fontSize: '0.925rem', color: '#1E293B', fontWeight: 700 }}>{student.name}</td>
                            <td style={{ padding: '16px', textAlign: 'center' }}>
                              <span style={{ padding: '6px 12px', backgroundColor: '#EEF2FF', color: '#4F46E5', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800 }}>{avgMark}%</span>
                            </td>
                            {allActivities.map((act, aIdx) => {
                              const perf = performances.find(p => p.activity === act);
                              return (
                                <td key={aIdx} style={{ padding: '16px', textAlign: 'center' }}>
                                  {perf ? (
                                    <div className="flex flex-col">
                                      <span style={{ fontWeight: 700, color: '#1E293B' }}>{perf.score}</span>
                                      <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>({perf.timeTaken})</span>
                                    </div>
                                  ) : (
                                    <span style={{ color: '#CBD5E1', fontWeight: 800 }}>--</span>
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
                <div className="flex justify-end mt-8">
                  <button 
                    style={{ padding: '16px 32px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: 'white', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.3)', transition: 'transform 0.2s' }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.target.style.transform = 'none'}
                    onClick={() => setSelectedBatchForActivity(null)}>Close Matrix</button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        );
      })()}

      {/* Session Evaluation Modal */}
      {selectedBatchForEvaluation && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', padding: '20px' }}>
          <div className="animate-fade-in" style={{ backgroundColor: 'white', boxShadow: '0 30px 60px -12px rgba(15, 23, 42, 0.25)', width: '100%', maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.2)', overflow: 'hidden' }}>
            <div style={{ padding: '40px 40px 30px 40px', background: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)', position: 'relative', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                <button onClick={() => setSelectedBatchForEvaluation(null)} style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: 'none', padding: '8px', borderRadius: '12px', color: 'white', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}><X size={20} /></button>
              </div>
              <div className="flex items-center gap-4">
                <div style={{ padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '16px', backdropFilter: 'blur(10px)', color: 'white' }}>
                  <Star size={32} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>Evaluate Session</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span style={{ padding: '4px 10px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>Batch {selectedBatchForEvaluation.id}</span>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>Session {selectedBatchForEvaluation.sessionNo}</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ overflowY: 'auto', padding: '40px', flex: 1, backgroundColor: '#F8FAFC' }}>
              <div className="flex flex-col gap-8">
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'block' }}>Performance Rating</label>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setEvaluationRating(star)}
                        style={{ background: 'white', border: '1px solid #F1F5F9', padding: '16px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <Star size={36} style={{ fill: star <= evaluationRating ? '#F59E0B' : 'transparent', color: star <= evaluationRating ? '#F59E0B' : '#CBD5E1', transition: 'all 0.2s' }} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'block' }}>Administrative Feedback</label>
                  <textarea
                    rows={4}
                    style={{ width: '100%', padding: '20px', backgroundColor: 'white', border: '2px solid #E2E8F0', borderRadius: '20px', outline: 'none', color: '#1E293B', fontSize: '1rem', transition: 'all 0.2s', resize: 'vertical' }}
                    placeholder="Enter detailed feedback about the trainer, student engagement, or facility quality..."
                    value={evaluationFeedback}
                    onChange={(e) => setEvaluationFeedback(e.target.value)}
                    onFocus={(e) => { e.target.style.borderColor = '#F59E0B'; e.target.style.boxShadow = '0 0 0 4px rgba(245, 158, 11, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '2px solid #E2E8F0', backgroundColor: 'transparent', color: '#64748B', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseOver={(e) => { e.target.style.backgroundColor = '#F1F5F9'; e.target.style.color = '#1E293B'; }}
                  onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#64748B'; }}
                  onClick={() => setSelectedBatchForEvaluation(null)}
                >
                  Cancel
                </button>
                <button
                  style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)', transition: 'transform 0.2s' }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.target.style.transform = 'none'}
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
        </div>,
        document.body
      )}
      {/* Transfer Information Modal */}
      {transferInfo && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', padding: '20px' }}>
          <div className="animate-fade-in" style={{ backgroundColor: 'white', boxShadow: '0 30px 60px -12px rgba(15, 23, 42, 0.25)', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.2)', overflow: 'hidden' }}>
            <div style={{ padding: '30px', background: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)', position: 'relative', flexShrink: 0, textAlign: 'center' }}>
              <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                <button onClick={() => setTransferInfo(null)} style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: 'none', padding: '8px', borderRadius: '12px', color: 'white', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}><X size={20} /></button>
              </div>
              <div style={{ display: 'inline-flex', padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '20px', backdropFilter: 'blur(10px)', color: 'white', marginBottom: '16px' }}>
                <Info size={40} />
              </div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>Transfer Info</h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', fontWeight: 500 }}>{transferInfo.type} replacement</p>
            </div>
            <div style={{ padding: '32px', backgroundColor: '#F8FAFC' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Transferred From</p>
                  <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: '#EF4444' }}>{transferInfo.from}</p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
                  <div style={{ width: '2px', height: '16px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}></div>
                </div>
                
                <div style={{ backgroundColor: '#EEF2FF', padding: '20px', borderRadius: '20px', border: '1px solid #E0E7FF' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', fontWeight: 800, color: '#818CF8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned To (Current)</p>
                  <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: '#4338CA' }}>{transferInfo.to}</p>
                </div>
              </div>

              <button 
                style={{ width: '100%', marginTop: '32px', padding: '16px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: 'white', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.3)', transition: 'transform 0.2s' }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.target.style.transform = 'none'}
                onClick={() => setTransferInfo(null)}>Dismiss</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

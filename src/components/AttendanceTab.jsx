import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Check, X, UserCheck, UserMinus, Save, Shield, Lock, 
  Fingerprint, Monitor, Users, Play, Pause, RefreshCw, 
  ChevronRight, AlertCircle, Clock
} from 'lucide-react';
import { users, classes } from '../data/mockData';

const liveFeedStyles = `
  @keyframes sonarPulse {
    0% {
      transform: scale(0.95);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.35;
    }
    100% {
      transform: scale(1.45);
      opacity: 0;
    }
  }

  @keyframes slideInSpring {
    0% {
      opacity: 0;
      transform: translateY(30px) scale(0.8) rotate(-1.5deg);
    }
    70% {
      transform: translateY(-4px) scale(1.04) rotate(0.5deg);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1) rotate(0deg);
    }
  }

  @keyframes perspectiveFlip {
    0% {
      opacity: 0;
      transform: translateY(50px) scale(0.7) rotateX(-45deg);
    }
    60% {
      transform: translateY(-8px) scale(1.06) rotateX(10deg);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1) rotateX(0deg);
    }
  }

  @keyframes pulseRadar {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(0.93);
    }
  }

  @keyframes signalPulse {
    0%, 100% {
      border-color: rgba(16, 185, 129, 0.15);
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01);
    }
    50% {
      border-color: rgba(16, 185, 129, 0.4);
      box-shadow: 0 0 14px rgba(16, 185, 129, 0.25);
    }
  }

  @keyframes liveDot {
    0%, 100% {
      opacity: 0.3;
      transform: scale(0.85);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  .joining-student-card {
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
  }

  .joining-student-card:hover {
    transform: translateY(-8px) scale(1.03) !important;
    box-shadow: 0 20px 40px -15px rgba(16, 185, 129, 0.45) !important;
    border-color: rgba(16, 185, 129, 0.6) !important;
    background-color: rgba(255, 255, 255, 0.06) !important;
  }

  .joining-student-card:hover .student-card-avatar {
    transform: scale(1.12) rotate(8deg) !important;
    background-color: #10B981 !important;
    color: white !important;
    border-color: #10B981 !important;
  }
`;

export default function AttendanceTab({ userRole, userName }) {
  // Common State
  const [activeBatch, setActiveBatch] = useState(null);
  const [sessionStatus, setSessionStatus] = useState('idle'); // 'idle', 'active', 'summary'
  const [sessionCode, setSessionCode] = useState('');
  const [presentStudents, setPresentStudents] = useState([]);
  
  // Student State
  const [studentOtp, setStudentOtp] = useState(['', '', '', '']);
  const [isMarked, setIsMarked] = useState(false);
  const [studentError, setStudentError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);

  const isStudent = userRole === 'Student';
  const isTrainer = userRole === 'Trainer' || userRole === 'Co-Trainer';

  // Filter classes based on user role and name
  const visibleClasses = classes.filter(batch => {
    if (userRole === 'SuperAdmin' || userRole === 'Admin') return true;
    if (userRole === 'Trainer') return batch.trainer === userName;
    if (userRole === 'Co-Trainer') return batch.coTrainers && batch.coTrainers.includes(userName);
    return false;
  });

  // Helper for progress bar color
  const getTimerColor = (time) => {
    if (time > 20) return '#10B981'; // Green
    if (time > 10) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  // Trainer: Generate new code
  const generateCode = () => {
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setSessionCode(newCode);
  };

  // Timer Logic: Decrement every second, regenerate code at 0
  useEffect(() => {
    let timer;
    if (sessionStatus === 'active') {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            generateCode(); // Regenerate code when timer expires
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimeLeft(30);
    }
    return () => clearInterval(timer);
  }, [sessionStatus]);

  const startSession = (batch) => {
    setActiveBatch(batch);
    generateCode();
    setPresentStudents([]);
    setSessionStatus('active');
  };

  const endSession = () => {
    setSessionStatus('summary');
  };

  // Mock: Simulate students joining randomly in Trainer View
  useEffect(() => {
    if (sessionStatus === 'active' && isTrainer && activeBatch) {
      // Find students belonging to THIS batch in mockData
      const batchStudents = users.filter(u => u.role === 'Student' && u.batch === activeBatch.id).slice(0, 8);
      const interval = setInterval(() => {
        if (presentStudents.length < batchStudents.length) {
          const nextStudent = batchStudents[presentStudents.length];
          if (nextStudent && Math.random() > 0.7) {
            setPresentStudents(prev => [...prev, nextStudent]);
          }
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [sessionStatus, activeBatch, isTrainer, presentStudents.length]);

  // Student OTP Input Handler
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...studentOtp];
    newOtp[index] = value;
    setStudentOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = () => {
    const enteredCode = studentOtp.join('');
    // For demo: any 4-digit code works if it matches a generated one (or just 7777 for demo)
    if (enteredCode.length === 4) {
      setIsMarked(true);
      setStudentError('');
    } else {
      setStudentError('Invalid Code. Please check the projector.');
    }
  };

  // --- STUDENT VIEW ---
  if (isStudent) {
    return (
      <div style={{
        height: 'calc(100vh - 80px)', width: '100%', 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        padding: '20px'
      }}>
        <div style={{
          width: '100%', maxWidth: '440px', backgroundColor: '#111827',
          padding: '48px', borderRadius: '40px', border: '1px solid #374151',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '24px', 
            backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px'
          }}>
            <Fingerprint size={40} style={{ color: '#10B981' }} />
          </div>

          <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: '900', marginBottom: '8px', letterSpacing: '-0.02em' }}>Live Attendance</h1>
          <p style={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '40px' }}>
            Enter the 4-digit code shown on the screen
          </p>

          {isMarked ? (
            <div style={{
              width: '100%', padding: '40px', backgroundColor: 'rgba(16, 185, 129, 0.05)',
              borderRadius: '32px', border: '2px solid rgba(16, 185, 129, 0.1)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
              animation: 'scaleIn 0.5s ease-out'
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#10B981',
                display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
              }}>
                <Check size={32} style={{ color: 'white' }} strokeWidth={4} />
              </div>
              <div>
                <p style={{ color: 'white', fontSize: '1.25rem', fontWeight: '900', margin: 0 }}>Verified Successfully</p>
                <p style={{ color: '#10B981', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>Status: Present</p>
              </div>
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '32px' }}>
                {[0, 1, 2, 3].map(i => (
                  <input 
                    key={i}
                    id={`otp-${i}`}
                    type="number"
                    value={studentOtp[i]}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    style={{
                      width: '64px', height: '80px', backgroundColor: 'black', border: '2px solid #374151',
                      borderRadius: '16px', outline: 'none', textAlign: 'center', fontSize: '2rem',
                      fontWeight: '900', color: '#10B981', transition: 'all 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10B981'}
                    onBlur={(e) => e.target.style.borderColor = '#374151'}
                  />
                ))}
              </div>
              
              {studentError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', fontSize: '0.75rem', fontWeight: '700', marginBottom: '24px', justifyContent: 'center' }}>
                  <AlertCircle size={14} /> {studentError}
                </div>
              )}

              <button 
                onClick={handleVerify}
                style={{
                  width: '100%', padding: '20px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  borderRadius: '20px', color: 'white', border: 'none', fontWeight: '900', fontSize: '0.875rem',
                  textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer',
                  boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.4)', transition: 'all 0.2s'
                }}
              >
                Verify & Submit
              </button>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '40px', opacity: 0.4 }}>
            <Lock size={12} style={{ color: '#94A3B8' }} />
            <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Secure Identity Verification</span>
          </div>
        </div>
      </div>
    );
  }

  // --- TRAINER VIEW ---
  return (
    <div className="p-8" style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      <style>{liveFeedStyles}</style>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>Attendance Management</h1>
          <p style={{ color: '#6B7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', marginTop: '8px' }}>
            Real-time batch presence tracking
          </p>
        </div>
      </div>

      {sessionStatus === 'idle' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
          {visibleClasses.map(batch => (
            <div key={batch.id} style={{
              backgroundColor: 'white', borderRadius: '32px', padding: '32px', border: '1px solid #F1F5F9',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                  <Users size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', color: '#111827' }}>{batch.name}</h3>
                  <p style={{ margin: 0, color: '#6B7280', fontSize: '0.75rem', fontWeight: '700' }}>{batch.id} • {batch.students} Students</p>
                </div>
              </div>
              <button 
                onClick={() => startSession(batch)}
                style={{
                  width: '100%', padding: '16px', backgroundColor: '#111827', color: 'white', border: 'none',
                  borderRadius: '16px', fontWeight: '900', fontSize: '0.75rem', textTransform: 'uppercase',
                  letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                }}
              >
                <Play size={16} fill="white" /> Start Taking Attendance
              </button>
            </div>
          ))}
        </div>
      )}

      {sessionStatus === 'active' && activeBatch && (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 99999, // Overlays everything including sidebar
          background: 'radial-gradient(circle at 50% 20%, #0f172a 0%, #020617 100%)',
          padding: '40px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          overflowY: 'auto',
          boxSizing: 'border-box'
        }}>
          {/* Top Edge Neon Countdown Progress Bar */}
          <div style={{ 
            position: 'absolute', top: 0, left: 0, right: 0, height: '6px', 
            backgroundColor: 'rgba(255,255,255,0.01)', zIndex: 100000 
          }}>
            <div style={{ 
              height: '100%', 
              width: `${(timeLeft / 30) * 100}%`, 
              backgroundColor: getTimerColor(timeLeft),
              transition: 'width 1s linear',
              boxShadow: `0 0 15px ${getTimerColor(timeLeft)}`
            }} />
          </div>

          {/* Immersive Cinematic Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981', animation: 'liveDot 1.5s infinite', boxShadow: '0 0 15px #10B981' }} />
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Live Verification Session</span>
                <h2 style={{ margin: '4px 0 0 0', fontSize: '1.75rem', fontWeight: '900', color: 'white', letterSpacing: '-0.02em' }}>{activeBatch.name}</h2>
              </div>
            </div>
            
            <button 
              onClick={endSession}
              style={{
                padding: '14px 28px', 
                backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                color: '#EF4444', 
                border: '1.5px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '16px', 
                fontWeight: '900', 
                fontSize: '0.75rem', 
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                cursor: 'pointer', 
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#EF4444';
                e.target.style.color = 'white';
                e.target.style.boxShadow = '0 0 25px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                e.target.style.color = '#EF4444';
                e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.05)';
              }}
            >
              Close & Review Session
            </button>
          </div>

          {/* Huge Projector Display (Side-by-Side Widescreen design to optimize screen usage and prevent vertical squeezing) */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '40px', 
            padding: '40px 60px', 
            color: 'white',
            boxShadow: '0 30px 60px -12px rgba(0,0,0,0.4)', 
            position: 'relative', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            gap: '40px',
            flex: '1' // Flex grow to take maximum available space
          }}>
            {/* Left Side: Glowing Timer Hub */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '900', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'white' }}>
                REFRESHING CODE IN
              </p>
              <p style={{ margin: 0, fontSize: '5.5rem', fontWeight: '900', color: getTimerColor(timeLeft), lineHeight: 1, letterSpacing: '-0.05em' }}>
                {timeLeft}<span style={{ fontSize: '1.75rem', opacity: 0.5 }}>s</span>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6, marginTop: '8px' }}>
                <Clock size={16} style={{ color: getTimerColor(timeLeft) }} />
                <span style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'white', letterSpacing: '0.02em' }}>Active Security Feed</span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '140px', backgroundColor: 'rgba(255, 255, 255, 0.06)' }} />

            {/* Right Side: Access Code Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.3)' }}>
                ACCESS CODE
              </p>

              <div style={{ display: 'flex', gap: '20px' }}>
                {sessionCode.split('').map((char, i) => (
                  <div key={i} style={{
                    width: '110px', height: '155px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '2.5px solid rgba(255, 255, 255, 0.08)', 
                    borderRadius: '24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '5rem', fontWeight: '900', color: '#10B981',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 35px rgba(16, 185, 129, 0.12)',
                    textShadow: '0 0 25px rgba(16, 185, 129, 0.25)'
                  }}>
                    {char}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Joining Feed */}
          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.02)', 
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '40px', 
            padding: '32px 40px', 
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#10B981' }}>
                  <UserCheck size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', color: 'white' }}>Live Joining Feed</h3>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '900', color: '#E2E8F0' }}>
                  {presentStudents.length} Students Present
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {presentStudents.map((student, index) => {
                const delay = `${index * 0.05}s`;
                return (
                  <div 
                    key={student.id} 
                    className="joining-student-card"
                    style={{
                      padding: '16px 24px', 
                      backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                      borderRadius: '24px', 
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '16px', 
                      animation: `perspectiveFlip 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay} both, signalPulse 2.5s ease-in-out infinite`,
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Glowing Left Border Accent */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '4px',
                      height: '100%',
                      backgroundColor: '#10B981'
                    }} />

                    {/* Animated Avatar Circle */}
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                      color: '#10B981', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: '900', 
                      fontSize: '0.875rem',
                      border: '1.5px solid rgba(16, 185, 129, 0.2)',
                      boxShadow: '0 0 10px rgba(16, 185, 129, 0.1)',
                      transition: 'transform 0.3s ease'
                    }} className="student-card-avatar">
                      {student.name.charAt(0)}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: '900', color: 'white' }}>{student.name}</span>
                      <span style={{ fontSize: '0.6875rem', fontWeight: '800', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block', animation: 'liveDot 1s infinite' }} />
                        Verified
                      </span>
                    </div>

                    <div style={{ 
                      width: '22px', 
                      height: '22px', 
                      borderRadius: '50%', 
                      backgroundColor: '#10B981', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
                      marginLeft: '4px'
                    }}>
                      <Check size={12} style={{ color: 'white' }} strokeWidth={4} />
                    </div>
                  </div>
                );
              })}
              {presentStudents.length === 0 && (
                <div style={{
                  width: '100%',
                  padding: '60px 40px',
                  textAlign: 'center',
                  border: '2px dashed rgba(255, 255, 255, 0.1)',
                  borderRadius: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255,255,255,0.01)',
                  position: 'relative',
                  overflow: 'hidden',
                  gap: '24px'
                }}>
                  {/* Modern Sonar Radar Scan animation */}
                  <div style={{
                    position: 'relative',
                    width: '100px',
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Expanding Sonar Waves */}
                    <div style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      border: '2px solid rgba(16, 185, 129, 0.2)',
                      animation: 'sonarPulse 3s infinite linear'
                    }} />
                    <div style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      border: '2px solid rgba(16, 185, 129, 0.15)',
                      animation: 'sonarPulse 3s infinite linear 1s'
                    }} />
                    <div style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      border: '2px solid rgba(16, 185, 129, 0.1)',
                      animation: 'sonarPulse 3s infinite linear 2s'
                    }} />
                    
                    {/* Centered Glowing Radar Hub */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      border: '2px solid #10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 25px rgba(16, 185, 129, 0.2)',
                      zIndex: 2,
                      animation: 'pulseRadar 2s infinite ease-in-out'
                    }}>
                      <Fingerprint size={24} style={{ color: '#10B981' }} />
                    </div>
                  </div>

                  <div style={{ zIndex: 2 }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '900', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Radar Active & Scanning
                    </h4>
                    <p style={{ margin: '6px 0 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.8125rem', fontWeight: '700' }}>
                      Waiting for students to enter the 4-digit security code...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {sessionStatus === 'summary' && activeBatch && (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)', border: '1px solid #F1F5F9' }}>
            <div style={{ padding: '40px', background: '#111827', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '900' }}>Attendance Summary</h2>
                <p style={{ margin: 0, opacity: 0.6, fontSize: '0.875rem', fontWeight: '700' }}>{activeBatch.name} • {new Date().toLocaleDateString()}</p>
              </div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', color: '#10B981' }}>{presentStudents.length}</p>
                  <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', opacity: 0.5 }}>Present</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  {/* Mock: Assume total 15 for summary */}
                  <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', color: '#EF4444' }}>{Math.max(0, 15 - presentStudents.length)}</p>
                  <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', opacity: 0.5 }}>Absent</p>
                </div>
              </div>
            </div>

            <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              {/* Present Column */}
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', fontWeight: '900', color: '#10B981', marginBottom: '24px' }}>
                  <UserCheck size={20} /> Present Students
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {presentStudents.map(student => (
                    <div key={student.id} style={{ padding: '16px 20px', backgroundColor: '#F0FDF4', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '800', color: '#065F46' }}>{student.name}</span>
                      <button onClick={() => setPresentStudents(prev => prev.filter(s => s.id !== student.id))} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Absent Column (Mocking remaining students) */}
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', fontWeight: '900', color: '#EF4444', marginBottom: '24px' }}>
                  <UserMinus size={20} /> Absent Students
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {users.filter(u => u.role === 'Student').slice(0, 15)
                    .filter(u => !presentStudents.find(ps => ps.id === u.id))
                    .map(student => (
                    <div key={student.id} style={{ padding: '16px 20px', backgroundColor: '#FEF2F2', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '800', color: '#991B1B' }}>{student.name}</span>
                      <button onClick={() => setPresentStudents(prev => [...prev, student])} style={{ background: '#EF4444', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: '800', cursor: 'pointer' }}>
                        Mark Present
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: '32px 40px', backgroundColor: '#F9FAFB', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <button onClick={() => setSessionStatus('idle')} style={{ padding: '16px 32px', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', fontWeight: '800', cursor: 'pointer' }}>Discard</button>
              <button onClick={() => setSessionStatus('idle')} style={{ padding: '16px 40px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)' }}>Save & Finalize</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

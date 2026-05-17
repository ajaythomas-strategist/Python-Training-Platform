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

  @keyframes radarSweep {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes signalEmit {
    0% {
      transform: scale(0.35);
      opacity: 0.95;
    }
    100% {
      transform: scale(2.4);
      opacity: 0;
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
  const [radarStudent, setRadarStudent] = useState(null);
  
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
    
    // Sample with 20 premium dummy names as requested by the user
    const sampleDummyStudents = [
      { id: 'd1', name: 'Alexander Wright' },
      { id: 'd2', name: 'Sophia Chen' },
      { id: 'd3', name: 'Marcus Sterling' },
      { id: 'd4', name: 'Emily Rodriguez' },
      { id: 'd5', name: 'Vikram Mehta' },
      { id: 'd6', name: 'Elena Rostova' },
      { id: 'd7', name: 'Liam Gallagher' },
      { id: 'd8', name: 'Zahra Al-Farsi' },
      { id: 'd9', name: 'Lucas Novak' },
      { id: 'd10', name: 'Chloe Dubois' },
      { id: 'd11', name: 'Julian Vance' },
      { id: 'd12', name: 'Aria Takahashi' },
      { id: 'd13', name: 'Mateo Silva' },
      { id: 'd14', name: 'Sarah Jenkins' },
      { id: 'd15', name: 'Dante Moretti' },
      { id: 'd16', name: 'Naomi Campbell' },
      { id: 'd17', name: 'Leo Fitzpatrick' },
      { id: 'd18', name: 'Sophia Kowalski' },
      { id: 'd19', name: 'Zane Thompson' },
      { id: 'd20', name: 'Isabella Vance' }
    ];
    
    setPresentStudents(sampleDummyStudents);
    setSessionStatus('active');
  };

  const endSession = () => {
    setSessionStatus('summary');
  };

  // Mock: Simulate students joining randomly in Trainer View
  useEffect(() => {
    if (sessionStatus === 'active' && isTrainer && activeBatch) {
      // Find eligible students in mockData that belong to this batch
      const batchStudents = users.filter(u => u.role === 'Student' && u.batch === activeBatch.id);
      
      const interval = setInterval(() => {
        // If there's currently a student actively showing/scanning in the radar, wait for them to finish
        if (radarStudent) return;

        // Get a student that isn't already present (excluding current pre-populated lists)
        const unjoinedStudents = batchStudents.filter(u => !presentStudents.some(p => p.name === u.name));
        
        if (unjoinedStudents.length > 0) {
          const nextStudent = unjoinedStudents[0];
          if (nextStudent && Math.random() > 0.5) {
            // 1. Show the student inside the radar scan first (directly below code!)
            setRadarStudent(nextStudent);
            
            // 2. After 2 seconds, complete the verification scan and transition them to the Left Panel list
            setTimeout(() => {
              setPresentStudents(prev => {
                if (prev.some(s => s.name === nextStudent.name)) return prev;
                return [...prev, nextStudent];
              });
              setRadarStudent(null);
            }, 2000);
          }
        }
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [sessionStatus, activeBatch, isTrainer, presentStudents.length, radarStudent]);

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
          background: 'radial-gradient(circle at 50% 20%, #080d1a 0%, #02050d 100%)',
          padding: '40px 60px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxSizing: 'border-box',
          overflow: 'hidden'
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981', animation: 'liveDot 1.5s infinite', boxShadow: '0 0 15px #10B981' }} />
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Active Holographic Radar Scanner</span>
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
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.05)',
                zIndex: 20
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

          {/* Futuristic Two-Column Split Screen Panel */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            flex: '1',
            gap: '60px',
            alignItems: 'stretch',
            overflow: 'hidden'
          }}>
            {/* LEFT COLUMN: Transparent Verified Names List ("Plain" - No Card Backgrounds) */}
            <div style={{
              width: '45%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              padding: '20px 0',
              overflowY: 'auto'
            }}>
              <p style={{ margin: '0 0 28px 0', fontSize: '0.8125rem', fontWeight: '900', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'white' }}>
                RECENTLY VERIFIED ({presentStudents.length})
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {presentStudents.slice(-20).reverse().map((student) => (
                  <div 
                    key={student.id} 
                    style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      animation: 'slideInSpring 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                    }}
                  >
                    <span style={{ 
                      width: '12px', height: '12px', borderRadius: '50%', 
                      backgroundColor: '#10B981', display: 'inline-block',
                      boxShadow: '0 0 10px #10B981', animation: 'liveDot 1s infinite',
                      marginRight: '24px',
                      flexShrink: 0
                    }} />
                    <span style={{ 
                      fontSize: '2.2rem', 
                      fontWeight: '800', 
                      color: 'white',
                      letterSpacing: '-0.02em',
                      textShadow: '0 2px 10px rgba(255,255,255,0.05)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {student.name}
                    </span>
                  </div>
                ))}
                
                {presentStudents.length === 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', opacity: 0.25, marginTop: '20px' }}>
                    <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: 'white', fontStyle: 'italic' }}>
                      Radar scanning batch...
                    </p>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '700', color: 'white' }}>
                      Waiting for student verification signals
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Divider Line */}
            <div style={{ width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.05)', alignSelf: 'stretch' }} />

            {/* RIGHT COLUMN: Cinematic Orbital Radar Scan & Access Code Core */}
            <div style={{
              width: '55%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {/* Circular Holographic Radar Sweep Shell */}
              <div style={{
                position: 'relative',
                width: '390px',
                height: '390px',
                borderRadius: '50%',
                border: '2px dashed rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 60px rgba(16, 185, 129, 0.03), inset 0 0 60px rgba(16, 185, 129, 0.03)',
                transition: 'all 0.5s ease',
                backgroundColor: 'rgba(16, 185, 129, 0.01)'
              }}>
                {/* Orbital Rings */}
                <div style={{ position: 'absolute', width: '80%', height: '80%', borderRadius: '50%', border: '1px solid rgba(16, 185, 129, 0.08)' }} />
                <div style={{ position: 'absolute', width: '55%', height: '55%', borderRadius: '50%', border: '1px dashed rgba(16, 185, 129, 0.05)' }} />

                {/* Staggered Circular Emitting Waves (Large Concentric Round Signals Emitters) */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: 0, left: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  zIndex: 1
                }}>
                  <div style={{
                    position: 'absolute',
                    width: '390px',
                    height: '390px',
                    borderRadius: '50%',
                    border: '4px solid rgba(16, 185, 129, 0.4)',
                    animation: 'signalEmit 4s infinite linear'
                  }} />
                  <div style={{
                    position: 'absolute',
                    width: '390px',
                    height: '390px',
                    borderRadius: '50%',
                    border: '3px solid rgba(16, 185, 129, 0.25)',
                    animation: 'signalEmit 4s infinite linear 1.3s'
                  }} />
                  <div style={{
                    position: 'absolute',
                    width: '390px',
                    height: '390px',
                    borderRadius: '50%',
                    border: '2px solid rgba(16, 185, 129, 0.15)',
                    animation: 'signalEmit 4s infinite linear 2.6s'
                  }} />
                </div>

                {/* Dynamic Holographic Scanner Screen Content */}
                <div style={{
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  width: '100%',
                  padding: '24px'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.35em' }}>
                      SECURITY KEY
                    </span>
                    
                    {/* Access Code display with glowing holographic letters - always visible! */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '16px',
                      margin: '12px 0 8px 0'
                    }}>
                      {sessionCode.split('').map((char, i) => (
                        <span 
                          key={i} 
                          style={{
                            fontSize: '6.25rem', 
                            fontWeight: '900', 
                            color: '#10B981',
                            fontFamily: 'monospace',
                            letterSpacing: '0.02em',
                            textShadow: '0 0 35px rgba(16, 185, 129, 0.5)'
                          }}
                        >
                          {char}
                        </span>
                      ))}
                    </div>

                    <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', animation: 'liveDot 1s infinite' }} />
                      TRANSMITTING SECURE BEACON
                    </span>

                    {/* Real-time Verified Student Name Display (Always overlaid below the code, never hiding it!) */}
                    <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {radarStudent ? (
                        <div style={{
                          animation: 'slideInSpring 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}>
                          <p style={{
                            margin: 0,
                            fontSize: '2.4rem',
                            fontWeight: '900',
                            color: 'white',
                            letterSpacing: '-0.01em',
                            textShadow: '0 0 25px rgba(255,255,255,0.6)'
                          }}>
                            {radarStudent.name}
                          </p>
                          <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '4px' }}>
                            MATCH DETECTED • VERIFIED
                          </span>
                        </div>
                      ) : (
                        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '800', color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', letterSpacing: '0.05em' }}>
                          Awaiting student responses...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Countdown Ticker Bar underneath the Radar Scan Circle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '32px', opacity: 0.85 }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getTimerColor(timeLeft), animation: 'liveDot 1s infinite' }} />
                <span style={{ fontSize: '0.8125rem', fontWeight: '900', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.18em' }}>
                  ROTATING SECURITY KEY IN <span style={{ color: getTimerColor(timeLeft), fontWeight: '900', fontFamily: 'monospace', fontSize: '0.9375rem' }}>{timeLeft}S</span>
                </span>
              </div>
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

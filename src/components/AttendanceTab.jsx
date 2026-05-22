import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Check, X, UserCheck, UserMinus, Save, Shield, Lock, 
  Fingerprint, Monitor, Users, Play, Pause, RefreshCw, 
  ChevronRight, AlertCircle, Clock, Maximize2, Minimize2
} from 'lucide-react';
import { users, classes } from '../data/mockData';

const simulationPool = [
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
  { id: 'd20', name: 'Isabella Vance' },
  { id: 'd21', name: 'Oliver Bennett' },
  { id: 'd22', name: 'Noah King' },
  { id: 'd23', name: 'Mia Patel' },
  { id: 'd24', name: 'Ethan Hunt' },
  { id: 'd25', name: 'Ava Adams' },
  { id: 'd26', name: 'James Wilson' },
  { id: 'd27', name: 'Lily Smith' },
  { id: 'd28', name: 'Daniel Brown' },
  { id: 'd29', name: 'Olivia Jones' },
  { id: 'd30', name: 'William Taylor' }
];

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

  @keyframes tickerSlideUp {
    0% {
      opacity: 0;
      transform: translateY(40px) scale(0.9);
      filter: blur(4px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
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

  @keyframes nameOnRing {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    55% {
      opacity: 0.75;
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

  @keyframes shakeError {
    0%, 100% { transform: translateX(0); }
    15%       { transform: translateX(-10px); }
    30%       { transform: translateX(10px); }
    45%       { transform: translateX(-8px); }
    60%       { transform: translateX(8px); }
    75%       { transform: translateX(-4px); }
    90%       { transform: translateX(4px); }
  }

  @keyframes successPop {
    0%   { opacity: 0; transform: scale(0.7); }
    60%  { transform: scale(1.06); }
    100% { opacity: 1; transform: scale(1); }
  }

  @keyframes ringPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5), 0 0 30px rgba(16,185,129,0.2); }
    50%       { box-shadow: 0 0 0 18px rgba(16,185,129,0), 0 0 50px rgba(16,185,129,0.4); }
  }

  @keyframes errorSlideIn {
    0%   { opacity: 0; transform: translateY(-12px) scale(0.95); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

export default function AttendanceTab({ userRole, userName }) {
  // Common State
  const [activeBatch, setActiveBatch] = useState(null);
  const [sessionStatus, setSessionStatus] = useState('idle'); // 'idle', 'active', 'summary'
  const [sessionCode, setSessionCode] = useState('');
  const [presentStudents, setPresentStudents] = useState([]);
  const [radarStudents, setRadarStudents] = useState([]);
  const [waitingQueue, setWaitingQueue] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const verifiedListRef = useRef(null);
  
  // Student State
  const [studentOtp, setStudentOtp] = useState(['', '', '', '']);
  const [isMarked, setIsMarked]     = useState(false);
  const [studentError, setStudentError] = useState('');
  const [hasError, setHasError]     = useState(false); // triggers shake animation
  const [markedTime, setMarkedTime] = useState('');    // timestamp for success card
  const [timeLeft, setTimeLeft]     = useState(30);

  const isStudent = userRole === 'Student';
  const isTrainer = userRole === 'Trainer' || userRole === 'Co-Trainer';

  // Smoothly scroll the verified list to the bottom whenever a new student verifies (Bottom-to-Up movement)
  useEffect(() => {
    if (verifiedListRef.current) {
      setTimeout(() => {
        if (verifiedListRef.current) {
          verifiedListRef.current.scrollTo({
            top: verifiedListRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [presentStudents.length]);

  // Track Full Screen state change
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error enabling full-screen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

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
    setPresentStudents([]); // Start verified students list from 0!
    setRadarStudents([]);   // Clear active radar slots!
    setWaitingQueue([]);    // Clear waiting queue!
    setSessionStatus('active');
  };

  const endSession = () => {
    setSessionStatus('summary');
  };

  // Single clean simulation engine using refs to avoid stale-closure issues
  const simStateRef = useRef({ presentStudents: [], radarStudents: [], waitingQueue: [] });
  
  useEffect(() => {
    simStateRef.current = { presentStudents, radarStudents, waitingQueue };
  }, [presentStudents, radarStudents, waitingQueue]);

  useEffect(() => {
    if (sessionStatus !== 'active' || !isTrainer || !activeBatch) return;

    const tick = setInterval(() => {
      const { presentStudents: ps, radarStudents: rs, waitingQueue: wq } = simStateRef.current;
      const now = Date.now();

      // Step 1: Graduate verified radar students (>= 4s) to present list
      const verified = rs.filter(s => now - s.joinedAt >= 4000);
      const stillOnRadar = rs.filter(s => now - s.joinedAt < 4000);

      if (verified.length > 0) {
        setPresentStudents(prev => {
          const next = [...prev];
          verified.forEach(v => {
            if (!next.some(s => s.name === v.name)) next.push(v);
          });
          return next;
        });
        setRadarStudents(stillOnRadar);
        return; // Let state settle before next step
      }

      // Step 2: Fill radar slots from waiting queue (up to 5 at a time)
      const openSlots = 5 - rs.length;
      if (openSlots > 0 && wq.length > 0) {
        const toAdd = wq.slice(0, openSlots).map(s => ({ ...s, joinedAt: Date.now() }));
        setWaitingQueue(prev => prev.slice(toAdd.length));
        setRadarStudents(prev => [...prev, ...toAdd]);
        return;
      }

      // Step 3: Pull next unqueued student into waiting queue
      const allAccounted = [...ps, ...rs, ...wq].map(s => s.name);
      const unjoined = simulationPool.filter(u => !allAccounted.includes(u.name));
      if (unjoined.length > 0) {
        setWaitingQueue(prev => [...prev, unjoined[0]]);
      }
    }, 1200);

    return () => clearInterval(tick);
  }, [sessionStatus, isTrainer, activeBatch]);

  // Auto-focus next input; auto-verify on 4th digit
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // digits only
    const newOtp = [...studentOtp];
    newOtp[index] = value;
    setStudentOtp(newOtp);
    setStudentError('');
    setHasError(false);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
    // Auto-submit when last digit filled
    if (value && index === 3) {
      const code = newOtp.join('');
      if (code.length === 4) {
        setTimeout(() => {
          const now = new Date();
          setIsMarked(true);
          setStudentError('');
          setMarkedTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }, 150);
      }
    }
  };

  const handleVerify = () => {
    const enteredCode = studentOtp.join('');
    if (enteredCode.length === 4 && /^\d{4}$/.test(enteredCode)) {
      // Correct: mark attendance
      setIsMarked(true);
      setStudentError('');
      setHasError(false);
      const now = new Date();
      setMarkedTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } else {
      // Wrong: show error + shake
      setStudentError('Incorrect code. Please check the projector and try again.');
      setHasError(true);
      setStudentOtp(['', '', '', '']);
      setTimeout(() => {
        setHasError(false);
        document.getElementById('otp-0')?.focus();
      }, 600);
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
            /* ── SUCCESS CARD ── */
            <div style={{
              width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px',
              animation: 'successPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both'
            }}>
              {/* Pulsing green circle */}
              <div style={{
                width: '96px', height: '96px', borderRadius: '50%', backgroundColor: '#10B981',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'ringPulse 2s infinite'
              }}>
                <Check size={44} style={{ color: 'white' }} strokeWidth={3.5} />
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'white', fontSize: '1.6rem', fontWeight: '900', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
                  Attendance Marked!
                </p>
                <p style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>
                  ✓ &nbsp;You are marked Present
                </p>
              </div>

              {/* Info strip */}
              <div style={{
                width: '100%', backgroundColor: 'rgba(16,185,129,0.07)',
                border: '1px solid rgba(16,185,129,0.2)', borderRadius: '20px', padding: '20px 24px',
                display: 'flex', flexDirection: 'column', gap: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Student</span>
                  <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: '800' }}>{userName}</span>
                </div>
                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Time</span>
                  <span style={{ color: '#10B981', fontSize: '0.875rem', fontWeight: '800', fontFamily: 'monospace' }}>{markedTime}</span>
                </div>
                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</span>
                  <span style={{
                    backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981',
                    fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase',
                    letterSpacing: '0.12em', padding: '4px 12px', borderRadius: '999px',
                    border: '1px solid rgba(16,185,129,0.3)'
                  }}>Present</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsMarked(false);
                  setStudentOtp(['', '', '', '']);
                  setStudentError('');
                  setHasError(false);
                  setMarkedTime('');
                }}
                style={{
                  marginTop: '8px',
                  padding: '14px 40px',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  color: '#94A3B8',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  fontWeight: '800',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(16,185,129,0.15)';
                  e.currentTarget.style.color = '#10B981';
                  e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.color = '#94A3B8';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                Close
              </button>
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              {/* OTP Inputs */}
              <div style={{
                display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '24px',
                animation: hasError ? 'shakeError 0.55s ease both' : 'none'
              }}>
                {[0, 1, 2, 3].map(i => (
                  <input 
                    key={i}
                    id={`otp-${i}`}
                    type="number"
                    inputMode="numeric"
                    maxLength={1}
                    value={studentOtp[i]}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !studentOtp[i] && i > 0) {
                        document.getElementById(`otp-${i - 1}`)?.focus();
                      }
                    }}
                    style={{
                      width: '64px', height: '80px',
                      backgroundColor: hasError ? 'rgba(239,68,68,0.08)' : 'black',
                      border: `2px solid ${hasError ? '#EF4444' : '#374151'}`,
                      borderRadius: '16px', outline: 'none', textAlign: 'center', fontSize: '2rem',
                      fontWeight: '900', color: hasError ? '#EF4444' : '#10B981', transition: 'all 0.2s'
                    }}
                    onFocus={(e) => { e.target.style.borderColor = hasError ? '#EF4444' : '#10B981'; }}
                    onBlur={(e)  => { e.target.style.borderColor = hasError ? '#EF4444' : '#374151'; }}
                  />
                ))}
              </div>

              {/* Error notification */}
              {studentError && (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  backgroundColor: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '16px', padding: '14px 16px', marginBottom: '20px',
                  animation: 'errorSlideIn 0.3s ease both'
                }}>
                  <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0, marginTop: '1px' }} />
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ color: '#EF4444', fontSize: '0.8rem', fontWeight: '800', margin: '0 0 2px 0' }}>
                      Incorrect Code
                    </p>
                    <p style={{ color: '#FCA5A5', fontSize: '0.72rem', fontWeight: '600', margin: 0 }}>
                      {studentError}
                    </p>
                  </div>
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
    <div className="animate-fade-in p-8">
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

      {sessionStatus === 'active' && activeBatch && createPortal(
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
                <span style={{ fontSize: '0.875rem', fontWeight: '900', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.25em' }}>Marking Attendance</span>
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
            gap: '280px',
            alignItems: 'stretch',
            overflow: 'hidden'
          }}>
            {/* LEFT COLUMN: Transparent Verified Names List */}
            <div 
              ref={verifiedListRef}
              style={{
                width: '30%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                padding: '20px 0',
                overflow: 'hidden'
              }}
            >
              <p style={{ margin: '0 0 28px 0', fontSize: '0.8125rem', fontWeight: '900', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'white' }}>
                RECENTLY VERIFIED ({presentStudents.length})
              </p>
              {/* Queue count badge */}
              {waitingQueue.length > 0 && (
                <p style={{ margin: '-18px 0 20px 0', fontSize: '0.7rem', fontWeight: '800', opacity: 0.35, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#F59E0B' }}>
                  {waitingQueue.length} in queue
                </p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {presentStudents.slice(-10).map((student) => (
                  <div 
                    key={student.id} 
                    style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      animation: 'tickerSlideUp 0.6s cubic-bezier(0.25, 1, 0.5, 1) both',
                    }}
                  >
                    <span style={{ 
                      width: '10px', height: '10px', borderRadius: '50%', 
                      backgroundColor: '#10B981', display: 'inline-block',
                      boxShadow: '0 0 10px #10B981',
                      marginRight: '20px',
                      flexShrink: 0
                    }} />
                    <span style={{ 
                      fontSize: '2rem', 
                      fontWeight: '800', 
                      color: 'white',
                      letterSpacing: '-0.02em',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {student.name}
                    </span>
                  </div>
                ))}
                
                {presentStudents.length === 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', opacity: 0.3, marginTop: '20px' }}>
                    <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: 'white' }}>
                      Awaiting verification...
                    </p>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '700', color: 'rgba(255,255,255,0.7)' }}>
                      Students entering security key will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>



            {/* RIGHT COLUMN: Cinematic Orbital Radar — names sit ON the outermost ring */}
            <div style={{
              width: '70%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingLeft: '0px',
              position: 'relative'
            }}>
              {/* 
                600×600 outer wrapper — names are positioned here relative to center (300, 300).
                The 390px circle is placed at offset (105, 105) so its center aligns with (300, 300).
                Names at R=195 will land exactly ON the outermost circle ring, like radar blips.
              */}
              <div style={{
                position: 'relative',
                width: '600px',
                height: '600px',
                flexShrink: 0
              }}>

                {/* ── The 390px radar circle, centered in the 600px wrapper ── */}
                <div style={{
                  position: 'absolute',
                  left: '105px',
                  top: '105px',
                  width: '390px',
                  height: '390px',
                  borderRadius: '50%',
                  border: '2px dashed rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 60px rgba(16, 185, 129, 0.04), inset 0 0 60px rgba(16, 185, 129, 0.04)',
                  backgroundColor: 'rgba(16, 185, 129, 0.01)',
                  overflow: 'visible'
                }}>

                  {/* Orbital Rings (relative to the 390px circle) */}
                  <div style={{ position: 'absolute', width: '80%', height: '80%', borderRadius: '50%', border: '1px solid rgba(16, 185, 129, 0.08)' }} />
                  <div style={{ position: 'absolute', width: '55%', height: '55%', borderRadius: '50%', border: '1px dashed rgba(16, 185, 129, 0.05)' }} />

                  {/* Staggered Circular Emitting Waves */}
                  <div style={{
                    position: 'absolute', width: '100%', height: '100%',
                    top: 0, left: 0, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', pointerEvents: 'none', zIndex: 1
                  }}>
                    <div style={{ position: 'absolute', width: '390px', height: '390px', borderRadius: '50%', border: '4px solid rgba(16, 185, 129, 0.4)', animation: 'signalEmit 4s infinite linear' }} />
                    <div style={{ position: 'absolute', width: '390px', height: '390px', borderRadius: '50%', border: '3px solid rgba(16, 185, 129, 0.25)', animation: 'signalEmit 4s infinite linear 1.3s' }} />
                    <div style={{ position: 'absolute', width: '390px', height: '390px', borderRadius: '50%', border: '2px solid rgba(16, 185, 129, 0.15)', animation: 'signalEmit 4s infinite linear 2.6s' }} />
                  </div>

                  {/* Security Key + Timer (inside circle) */}
                  <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', padding: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.35em' }}>
                        SECURITY KEY
                      </span>
                      <div style={{ display: 'flex', gap: '12px', margin: '20px 0' }}>
                        {sessionCode.split('').map((char, i) => (
                          <span key={i} style={{ fontSize: '9.5rem', fontWeight: '900', color: '#10B981', fontFamily: 'monospace', letterSpacing: '-0.02em', textShadow: '0 0 60px rgba(16, 185, 129, 0.75)' }}>
                            {char}
                          </span>
                        ))}
                      </div>
                      <span style={{ fontSize: '0.95rem', fontWeight: '900', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.18em', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: getTimerColor(timeLeft), animation: 'liveDot 1s infinite', boxShadow: `0 0 10px ${getTimerColor(timeLeft)}` }} />
                        ROTATING SECURITY KEY IN <span style={{ color: getTimerColor(timeLeft), fontWeight: '900', fontFamily: 'monospace', fontSize: '1.25rem', marginLeft: '4px' }}>{timeLeft}S</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Names: static on the outermost ring, fade-in only ── */}
                {radarStudents.map((student, index) => {
                  const angle = -90 + index * 72;
                  const R = 195;
                  const cx = 300;
                  const cy = 300;
                  const x = cx + R * Math.cos(angle * Math.PI / 180);
                  const y = cy + R * Math.sin(angle * Math.PI / 180);

                  return (
                    <div
                      key={student.id}
                      style={{
                        position: 'absolute',
                        left: `${x}px`,
                        top: `${y}px`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 200,
                        pointerEvents: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        animation: 'tickerSlideUp 0.5s ease both'
                      }}
                    >
                      {/* Pulsing blip dot */}
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        boxShadow: '0 0 12px #10B981, 0 0 24px #10B981',
                        marginBottom: '6px',
                        animation: 'liveDot 1.2s infinite'
                      }} />
                      {/* Name label — static, no outward expansion */}
                      <span style={{
                        color: 'white',
                        fontWeight: '900',
                        fontSize: '1.2rem',
                        letterSpacing: '-0.02em',
                        textShadow: '0 0 20px #10B981, 0 0 40px #10B981',
                        whiteSpace: 'nowrap',
                        textAlign: 'center'
                      }}>
                        {student.name}
                      </span>
                    </div>
                  );
                })}

              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {sessionStatus === 'summary' && activeBatch && (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)', border: '1px solid #F1F5F9' }}>
            <div style={{ padding: '40px', background: '#111827', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '900', color: '#FFFFFF' }}>Attendance Summary</h2>
                <p style={{ margin: 0, opacity: 0.6, fontSize: '0.875rem', fontWeight: '700' }}>{activeBatch.name} • {new Date().toLocaleDateString()}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                {/* Top Action Options */}
                <div style={{ display: 'flex', gap: '12px', marginRight: '16px' }}>
                  <button 
                    onClick={() => setSessionStatus('idle')} 
                    style={{ 
                      padding: '12px 24px', 
                      backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                      color: 'white', 
                      border: '1px solid rgba(255, 255, 255, 0.15)', 
                      borderRadius: '12px', 
                      fontWeight: '800', 
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
                  >
                    Discard
                  </button>
                  <button 
                    onClick={() => setSessionStatus('idle')} 
                    style={{ 
                      padding: '12px 28px', 
                      backgroundColor: '#10B981', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '12px', 
                      fontWeight: '900', 
                      fontSize: '0.8125rem',
                      cursor: 'pointer', 
                      boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.5)'}
                    onMouseLeave={(e) => e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.3)'}
                  >
                    Save & Finalize
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
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

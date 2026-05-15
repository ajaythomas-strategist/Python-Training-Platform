import React, { useState, useEffect } from 'react';
import { Check, X, UserCheck, UserMinus, Save, Shield, Lock, Fingerprint } from 'lucide-react';
import { users } from '../data/mockData';

export default function AttendanceTab({ userRole, userName }) {
  const [sessionStatus, setSessionStatus] = useState('active'); // 'active' or 'verification'
  const [timeLeft, setTimeLeft] = useState(30);
  const [code, setCode] = useState('7 7 7 3');
  const [isPaused, setIsPaused] = useState(false);
  const [presentStudents, setPresentStudents] = useState([
    { id: 5, name: "Emily Davis" }
  ]);

  // Student specific state
  const [studentCode, setStudentCode] = useState('');
  const [isMarked, setIsMarked] = useState(false);

  const isStudent = userRole === 'Student';
  const batchRoster = users.filter(u => u.role === 'Student').slice(0, 15);

  // Real-time Timer Logic (Trainer Only)
  useEffect(() => {
    let interval;
    if (!isStudent && sessionStatus === 'active' && !isPaused && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (!isStudent && timeLeft === 0 && !isPaused && sessionStatus === 'active') {
      const newCode = Math.floor(1000 + Math.random() * 9000).toString().split('').join(' ');
      setCode(newCode);
      setTimeLeft(30);
    }
    return () => clearInterval(interval);
  }, [timeLeft, isPaused, sessionStatus, isStudent]);

  if (isStudent) {
    return (
      <div className="h-screen w-full bg-slate-950 text-slate-200 overflow-hidden flex flex-col items-center justify-center p-12 animate-in fade-in duration-500">
        <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-2xl border border-slate-800 p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-8">
          <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-4">
            <Fingerprint size={40} className="text-indigo-400" />
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">Live Attendance</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Enter the session code displayed on screen</p>
          </div>

          {isMarked ? (
            <div className="w-full py-12 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Check size={32} className="text-white" strokeWidth={4} />
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-white">Attendance Verified</p>
                <p className="text-sm text-emerald-400 font-bold uppercase tracking-widest mt-1">Status: Present</p>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-6">
              <div className="flex gap-4 justify-center">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-16 h-20 bg-black rounded-2xl border border-slate-800 flex items-center justify-center">
                    <input 
                      type="text"
                      maxLength="1"
                      className="w-full bg-transparent border-none outline-none text-center text-4xl font-black text-indigo-400"
                      onChange={(e) => {
                        if (e.target.value) {
                          setStudentCode(prev => prev + e.target.value);
                          if (studentCode.length === 3) setIsMarked(true);
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
              <button 
                className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:from-indigo-500 hover:to-violet-500 transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
                onClick={() => setIsMarked(true)}
              >
                Mark Attendance
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 text-slate-600">
            <Lock size={12} />
            <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted Verification</span>
          </div>
        </div>
      </div>
    );
  }

  // Trainer view logic (Existing)
  const handleStop = () => setSessionStatus('verification');
  const toggleStatus = (student) => {
    if (presentStudents.find(ps => ps.id === student.id)) {
      setPresentStudents(prev => prev.filter(ps => ps.id !== student.id));
    } else {
      setPresentStudents(prev => [...prev, student]);
    }
  };

  if (sessionStatus === 'verification') {
    return (
      <div className="h-screen w-full bg-slate-950 text-slate-200 overflow-hidden flex flex-col p-12 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-12 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Final Verification</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Review student presence and finalize attendance</p>
          </div>
          <div className="flex gap-4">
            <div className="px-8 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Present</p>
              <p className="text-3xl font-black text-white">{presentStudents.length}</p>
            </div>
            <div className="px-8 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-1">Absent</p>
              <p className="text-3xl font-black text-white">{batchRoster.length - presentStudents.length}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-4 gap-6 pr-4 custom-scrollbar pb-12">
          {batchRoster.map(student => {
            const isPresent = presentStudents.find(ps => ps.id === student.id);
            return (
              <div key={student.id} onClick={() => toggleStatus(student)} className={`p-6 rounded-[2rem] border transition-all cursor-pointer flex flex-col gap-4 group ${isPresent ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10' : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'}`}>
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${isPresent ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-slate-800 text-slate-600 border-slate-700'}`}>
                    {isPresent ? <UserCheck size={24} /> : <UserMinus size={24} />}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isPresent ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{isPresent ? 'Present' : 'Absent'}</span>
                </div>
                <div>
                  <p className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">{student.name}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">ID: #{1000 + student.id}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-8 border-t border-slate-800 flex justify-end gap-6">
          <button onClick={() => setSessionStatus('active')} className="px-10 py-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-sm uppercase tracking-widest rounded-2xl transition-all active:scale-95">Back to Live</button>
          <button onClick={() => window.location.reload()} className="px-12 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-2xl shadow-emerald-500/20 active:scale-95 flex items-center gap-3">
            <Save size={20} /> Finalize Attendance
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-200 overflow-hidden flex animate-in fade-in duration-500">
      <div className="w-1/5 h-full border-r border-slate-800 p-8 flex flex-col gap-10 bg-slate-900/50">
        <h2 className="text-xs font-black text-slate-500 tracking-[0.4em] uppercase">Session Intel</h2>
        <div className="flex flex-col gap-10 mt-4">
          <div className="space-y-2">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Batch Code</p>
            <p className="text-2xl font-black text-white tracking-tighter">1 BBA</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Active Subject</p>
            <p className="text-2xl font-black text-white tracking-tighter">Neural Architectures</p>
          </div>
        </div>
        <div className="mt-auto p-6 rounded-3xl bg-slate-800/30 border border-slate-800 flex items-center gap-4 group hover:bg-slate-800/50 transition-all cursor-help">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Biometric Link Active</span>
        </div>
      </div>

      <div className="w-3/5 h-full flex flex-col items-center justify-center relative bg-black">
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-900 overflow-hidden">
          <div className="h-full bg-emerald-500 transition-all duration-1000 ease-linear shadow-[0_0_30px_#10b981]" style={{ width: `${(timeLeft / 30) * 100}%` }}></div>
        </div>
        <div className="flex flex-col items-center w-full px-12">
          <h1 className="text-[22rem] font-black tracking-[0.1em] text-white leading-none select-none filter drop-shadow-[0_0_80px_rgba(255,255,255,0.15)] animate-pulse">{code}</h1>
          <p className="text-slate-400 mt-16 text-3xl font-black uppercase tracking-[0.5em] opacity-40">System refreshing in <span className="text-emerald-500">{timeLeft}s</span></p>
        </div>
        <div className="absolute bottom-12 flex gap-10 bg-slate-800/60 backdrop-blur-3xl px-12 py-5 rounded-[2.5rem] border border-slate-700 shadow-2xl items-center hover:bg-slate-800/80 transition-all group">
          <button onClick={() => setIsPaused(!isPaused)} className="text-slate-300 hover:text-emerald-400 transition-all text-sm font-black uppercase tracking-widest flex items-center gap-3 active:scale-95">{isPaused ? '▶ Resume Session' : '⏸ Pause Stream'}</button>
          <div className="h-8 w-px bg-slate-700 group-hover:bg-slate-600 transition-colors"></div>
          <button onClick={handleStop} className="text-red-500 hover:text-red-400 transition-all font-black text-sm uppercase tracking-widest active:scale-95">🛑 Stop Attendance</button>
        </div>
      </div>

      <div className="w-1/5 h-full border-l border-slate-800 p-8 bg-slate-900/50 flex flex-col">
        <div className="mb-10">
          <h2 className="text-xs font-black text-slate-500 tracking-[0.4em] uppercase mb-3">Students Present</h2>
          <p className="text-lg text-emerald-400 font-black tracking-tighter">{presentStudents.length} Students Present</p>
        </div>
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
          {presentStudents.map((student) => (
            <div key={student.id} className="flex items-center gap-4 p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 animate-in fade-in slide-in-from-right-4 duration-300 group hover:bg-slate-800 transition-all">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all"><Check size={16} strokeWidth={4} /></div>
              <span className="text-slate-200 font-black text-sm tracking-tight">{student.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-6">
          <button className="w-full py-5 bg-white text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all active:scale-95 shadow-xl shadow-white/5">Mark Attendance</button>
          <div className="pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3"><span>Roster Efficiency</span><span className="text-emerald-500">{Math.round((presentStudents.length / batchRoster.length) * 100)}%</span></div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 ease-out shadow-[0_0_15px_#10b981]" style={{ width: `${(presentStudents.length / batchRoster.length) * 100}%` }}></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

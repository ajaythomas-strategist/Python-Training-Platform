import React, { useState, useEffect } from 'react';
import { RefreshCw, Timer, ShieldCheck, Copy } from 'lucide-react';

export default function AttendanceTab() {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCode = () => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      setCode(newCode);
      setTimeLeft(30);
      setIsGenerating(false);
    }, 500);
  };

  useEffect(() => {
    if (code && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setCode('');
    }
  }, [code, timeLeft]);

  return (
    <div className="p-6 animate-fade-in flex flex-col items-center justify-center min-h-[60vh]">
      <div className="card max-w-md w-full p-10 flex flex-col items-center text-center gap-8 shadow-2xl border-none" 
        style={{ 
          background: 'linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)',
          borderRadius: '40px'
        }}>
        
        <div className="p-4 bg-indigo-50 rounded-3xl text-indigo-600 mb-2">
          <ShieldCheck size={48} strokeWidth={1.5} />
        </div>

        <div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">Attendance Code</h2>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            Generate a secure, time-sensitive code for students to mark their presence in today's session.
          </p>
        </div>

        {code ? (
          <div className="flex flex-col items-center gap-6 w-full animate-bounce-in">
            <div className="bg-white border-2 border-indigo-100 p-8 rounded-[32px] shadow-sm w-full relative overflow-hidden group">
              <div className="absolute top-0 left-0 h-1 bg-indigo-600 transition-all duration-1000 ease-linear" 
                style={{ width: `${(timeLeft / 30) * 100}%` }} 
              />
              <span className="text-6xl font-black tracking-[0.2em] text-indigo-600 font-mono pl-[0.2em]">
                {code}
              </span>
            </div>

            <div className="flex items-center gap-3 bg-gray-100 px-6 py-3 rounded-2xl">
              <Timer size={20} className="text-gray-400" />
              <span className="text-sm font-bold text-gray-600">
                Code expires in <span className="text-indigo-600">{timeLeft}s</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="py-12 px-8 bg-gray-50 rounded-[32px] border border-dashed border-gray-200 w-full">
            <p className="text-gray-400 text-sm font-medium italic">No active code generated</p>
          </div>
        )}

        <button 
          className={`btn btn-primary w-full py-5 rounded-2xl flex justify-center items-center gap-3 transition-all transform active:scale-95 ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={generateCode}
          disabled={isGenerating}
          style={{ 
            fontSize: '1.125rem', 
            fontWeight: 800,
            background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
            boxShadow: '0 15px 30px -10px rgba(79, 70, 229, 0.4)'
          }}
        >
          {isGenerating ? (
            <RefreshCw size={24} className="animate-spin" />
          ) : (
            <>
              <RefreshCw size={24} />
              {code ? 'Regenerate Code' : 'Generate Code'}
            </>
          )}
        </button>

        {code && (
          <button 
            className="text-gray-400 hover:text-indigo-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
            onClick={() => navigator.clipboard.writeText(code)}
          >
            <Copy size={14} />
            Copy to Clipboard
          </button>
        )}
      </div>

      <div className="mt-12 flex gap-12 text-center">
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-black text-gray-800">30s</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Validity</span>
        </div>
        <div className="w-px h-10 bg-gray-200" />
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-black text-gray-800">Dynamic</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Encryption</span>
        </div>
        <div className="w-px h-10 bg-gray-200" />
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-black text-gray-800">Live</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sync</span>
        </div>
      </div>
    </div>
  );
}

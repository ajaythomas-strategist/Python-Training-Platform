import React, { useState, useEffect } from 'react';
import { Timer, RefreshCw } from 'lucide-react';

export default function AttendanceLive() {
  const [code, setCode] = useState('847291');
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Generate new code
          setCode(Math.floor(100000 + Math.random() * 900000).toString());
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-fade-in flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1>Live Session Attendance</h1>
        <button className="btn btn-outline" onClick={() => {
          setCode(Math.floor(100000 + Math.random() * 900000).toString());
          setTimeLeft(30);
        }}>
          <RefreshCw size={18} /> Force Refresh
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="attendance-display card w-full" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#4F46E5', marginBottom: '0.5rem' }}>
            Session Attendance Code
          </h2>
          <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>
            Enter this code in your student portal to mark attendance.
          </p>
          
          <div className="attendance-code">
            {code}
          </div>

          <div className={`attendance-timer ${timeLeft <= 5 ? 'timer-urgent' : ''}`}>
            <Timer size={24} />
            <span>Refreshes in <strong>{timeLeft}</strong> seconds</span>
          </div>
          
          <div className="mt-8" style={{ width: '100%', maxWidth: '300px' }}>
            <div className="progress-bar-container" style={{ height: '4px', backgroundColor: 'rgba(79, 70, 229, 0.2)' }}>
              <div 
                className="progress-bar progress-blue" 
                style={{ width: `${(timeLeft / 30) * 100}%`, transition: 'width 1s linear' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

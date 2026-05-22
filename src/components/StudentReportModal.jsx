import React from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function StudentReportModal({ user, isOpen, onClose }) {
  if (!isOpen || !user || !user.detailedReport) return null;

  return createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(12px)',
      padding: '20px'
    }}>
      <div className="animate-fade-in" style={{ 
        width: '100%', maxWidth: '1000px', backgroundColor: 'white', borderRadius: '32px', overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', flexDirection: 'column', maxHeight: '90vh'
      }}>
        
        {/* Premium Header Section */}
        <div style={{ 
          padding: '40px 40px 30px 40px', flexShrink: 0,
          background: 'linear-gradient(135deg, #4F46E5 0%, #312E81 100%)',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
            <button onClick={onClose} style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)', 
              border: 'none', padding: '8px', borderRadius: '12px', color: 'white', cursor: 'pointer',
              transition: 'all 0.2s ease'
            }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}>
              <X size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-5">
            <div style={{ 
              padding: '4px', backgroundColor: 'rgba(255, 255, 255, 0.2)', 
              borderRadius: '50%', backdropFilter: 'blur(10px)'
            }}>
              <img src={user.photo} alt={user.name} style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>{user.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span style={{ padding: '4px 12px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.05em' }}>Student Profile</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem', fontWeight: 500 }}>• Batch {user.batch}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div style={{ overflowY: 'auto', padding: '40px', flex: 1, backgroundColor: '#F8FAFC' }}>
          
          {/* Key Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
            <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px 0' }}>Overall Score</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 900, color: '#4F46E5', margin: 0, letterSpacing: '-0.02em' }}>{user.score}</p>
            </div>
            <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px 0' }}>Attendance Rate</h3>
              <div className="flex items-center gap-3 mt-1">
                <p style={{ fontSize: '2.5rem', fontWeight: 900, color: user.attendance >= 80 ? '#10B981' : '#EF4444', margin: 0, letterSpacing: '-0.02em' }}>{user.attendance}%</p>
                {user.attendance >= 80 ? (
                  <span style={{ padding: '4px 10px', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>EXCELLENT</span>
                ) : (
                  <span style={{ padding: '4px 10px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>NEEDS ATTENTION</span>
                )}
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginBottom: '16px', letterSpacing: '-0.01em' }}>Sessions & Attendance</h3>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid #F1F5F9', overflow: 'hidden', marginBottom: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #F1F5F9' }}>
                <tr>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Session Name</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {user.detailedReport.sessions.map((session, idx) => (
                  <tr key={idx} style={{ borderBottom: idx !== user.detailedReport.sessions.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <td style={{ padding: '16px 24px', fontSize: '0.925rem', color: '#475569', fontWeight: 500 }}>{session.date}</td>
                    <td style={{ padding: '16px 24px', fontSize: '0.925rem', color: '#1E293B', fontWeight: 700 }}>{session.sessionName}</td>
                    <td style={{ padding: '16px 24px' }}>
                      {session.attendance === 'Present' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#F0FDF4', color: '#166534', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
                          <CheckCircle size={14} /> Present
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#FEF2F2', color: '#991B1B', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
                          <XCircle size={14} /> Absent
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginBottom: '16px', letterSpacing: '-0.01em' }}>Performance Detailed Report</h3>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid #F1F5F9', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #F1F5F9' }}>
                <tr>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Activity Name</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Score</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time Taken</th>
                </tr>
              </thead>
              <tbody>
                {user.detailedReport.performance.map((perf, idx) => (
                  <tr key={idx} style={{ borderBottom: idx !== user.detailedReport.performance.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <td style={{ padding: '16px 24px', fontSize: '0.925rem', color: '#1E293B', fontWeight: 700 }}>{perf.activity}</td>
                    <td style={{ padding: '16px 24px', fontSize: '1rem', color: '#4F46E5', fontWeight: 800 }}>{perf.score}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex items-center gap-2" style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: 600 }}>
                        <Clock size={16} /> {perf.timeTaken}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
            <button 
              onClick={onClose}
              style={{ 
                padding: '16px 32px', borderRadius: '16px', border: 'none', 
                backgroundColor: '#1E293B', color: 'white', fontWeight: '800', cursor: 'pointer',
                transition: 'all 0.2s ease', boxShadow: '0 10px 15px -3px rgba(30, 41, 59, 0.3)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'none'}
            >
              Close Profile
            </button>
          </div>
          
        </div>
      </div>
    </div>,
    document.body
  );
}

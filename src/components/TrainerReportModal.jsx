import React from 'react';
import { createPortal } from 'react-dom';
import { X, Star, Clock, Calendar } from 'lucide-react';

export default function TrainerReportModal({ user, isOpen, onClose }) {
  if (!isOpen || !user) return null;

  const sessionReports = user.sessionReports || [];
  const transferredTo = user.transferredSessions?.filter(ts => ts.direction === 'To') || [];
  const takenFrom = user.transferredSessions?.filter(ts => ts.direction === 'From') || [];

  return createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(12px)',
      padding: '20px'
    }}>
      <div className="animate-fade-in" style={{ 
        width: '100%', maxWidth: '1100px', backgroundColor: 'white', borderRadius: '32px', overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', flexDirection: 'column', maxHeight: '90vh'
      }}>
        
        {/* Premium Header Section */}
        <div style={{ 
          padding: '40px 40px 30px 40px', flexShrink: 0,
          background: 'linear-gradient(135deg, #7C3AED 0%, #4338CA 100%)',
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
                <span style={{ 
                  padding: '4px 12px', backgroundColor: user.role === 'Trainer' ? 'rgba(192, 132, 252, 0.3)' : 'rgba(52, 211, 153, 0.3)', 
                  borderRadius: '12px', color: 'white', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.05em' 
                }}>
                  {user.role} Profile
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div style={{ overflowY: 'auto', padding: '40px', flex: 1, backgroundColor: '#F8FAFC' }}>
          
          {/* Key Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px 0' }}>Total Sessions</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 900, color: '#7C3AED', margin: 0, letterSpacing: '-0.02em' }}>{user.sessions}</p>
            </div>
            <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px 0' }}>Total Hours</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 900, color: '#4338CA', margin: 0, letterSpacing: '-0.02em' }}>{user.hours}</p>
            </div>
            <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px 0' }}>Missed Sessions</h3>
              <div className="flex items-center gap-3 mt-1">
                <p style={{ fontSize: '2.5rem', fontWeight: 900, color: user.missedSessions > 0 ? '#EF4444' : '#10B981', margin: 0, letterSpacing: '-0.02em' }}>{user.missedSessions}</p>
                {user.missedSessions === 0 && (
                  <span style={{ padding: '4px 10px', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>PERFECT</span>
                )}
              </div>
            </div>
            <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px 0' }}>Avg Rating</h3>
              <p className="flex items-center gap-2" style={{ fontSize: '2.5rem', fontWeight: 900, color: '#F59E0B', margin: 0, letterSpacing: '-0.02em' }}>
                {user.rating} <Star size={28} fill="#F59E0B" />
              </p>
            </div>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginBottom: '16px', letterSpacing: '-0.01em' }}>Session Reports</h3>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid #F1F5F9', overflow: 'hidden', marginBottom: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #F1F5F9' }}>
                <tr>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Session</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Batch</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lab</th>
                  {user.role === 'Co-Trainer' && <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lead Trainer</th>}
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hours</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Rating</th>
                </tr>
              </thead>
              <tbody>
                {user.sessionReports.map((report, idx) => (
                  <tr key={idx} style={{ borderBottom: idx !== user.sessionReports.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <td style={{ padding: '16px 24px', fontSize: '0.925rem', color: '#475569', fontWeight: 500 }}>{report.date}</td>
                    <td style={{ padding: '16px 24px', fontSize: '0.925rem', color: '#1E293B', fontWeight: 700 }}>{report.session}</td>
                    <td style={{ padding: '16px 24px', fontSize: '0.925rem', color: '#475569' }}>{report.batch}</td>
                    <td style={{ padding: '16px 24px', fontSize: '0.925rem', color: '#475569' }}>{report.lab}</td>
                    {user.role === 'Co-Trainer' && (
                      <td style={{ padding: '16px 24px', fontSize: '0.925rem', color: '#7C3AED', fontWeight: 600 }}>{report.trainer || 'N/A'}</td>
                    )}
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex items-center gap-1" style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: 600 }}>
                        <Clock size={16} /> {report.hours}h
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: 800, color: '#F59E0B' }}>{report.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginBottom: '16px', letterSpacing: '-0.01em', marginTop: '32px' }}>Transferred Sessions: To Others</h3>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid #FECACA', overflow: 'hidden', marginBottom: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#FEF2F2', borderBottom: '2px solid #FECACA' }}>
                <tr>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Session</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Batch</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lab</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hours</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Transferred To</th>
                </tr>
              </thead>
              <tbody>
                {transferredTo.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#991B1B', padding: '2rem', fontWeight: 500 }}>No sessions transferred to others.</td>
                  </tr>
                ) : (
                  transferredTo.map((ts, idx) => (
                    <tr key={idx} style={{ borderBottom: idx !== transferredTo.length - 1 ? '1px solid #FECACA' : 'none' }}>
                      <td style={{ padding: '16px 24px', fontSize: '0.925rem', color: '#7F1D1D', fontWeight: 500 }}>{ts.date}</td>
                      <td style={{ padding: '16px 24px', fontSize: '0.925rem', color: '#7F1D1D', fontWeight: 700 }}>{ts.session}</td>
                      <td style={{ padding: '16px 24px', fontSize: '0.925rem', color: '#991B1B' }}>{ts.batch}</td>
                      <td style={{ padding: '16px 24px', fontSize: '0.925rem', color: '#991B1B' }}>{ts.lab}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <div className="flex items-center gap-1" style={{ color: '#991B1B', fontSize: '0.875rem', fontWeight: 600 }}>
                          <Clock size={16} /> {ts.hours}h
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: 700, color: '#DC2626' }}>{ts.partner}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginBottom: '16px', letterSpacing: '-0.01em', marginTop: '32px' }}>Transferred Sessions: Taken From Others</h3>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid #A7F3D0', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#ECFDF5', borderBottom: '2px solid #A7F3D0' }}>
                <tr>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Session</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Batch</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lab</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hours</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Rating</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Taken From</th>
                </tr>
              </thead>
              <tbody>
                {takenFrom.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', color: '#065F46', padding: '2rem', fontWeight: 500 }}>No sessions taken from others.</td>
                  </tr>
                ) : (
                  takenFrom.map((ts, idx) => (
                    <tr key={idx} style={{ borderBottom: idx !== takenFrom.length - 1 ? '1px solid #A7F3D0' : 'none' }}>
                      <td style={{ padding: '16px 24px', fontSize: '0.925rem', color: '#064E3B', fontWeight: 500 }}>{ts.date}</td>
                      <td style={{ padding: '16px 24px', fontSize: '0.925rem', color: '#064E3B', fontWeight: 700 }}>{ts.session}</td>
                      <td style={{ padding: '16px 24px', fontSize: '0.925rem', color: '#065F46' }}>{ts.batch}</td>
                      <td style={{ padding: '16px 24px', fontSize: '0.925rem', color: '#065F46' }}>{ts.lab}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <div className="flex items-center gap-1" style={{ color: '#065F46', fontSize: '0.875rem', fontWeight: 600 }}>
                          <Clock size={16} /> {ts.hours}h
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: 800, color: '#F59E0B' }}>{ts.rating || 'N/A'}</td>
                      <td style={{ padding: '16px 24px', fontWeight: 700, color: '#059669' }}>{ts.partner}</td>
                    </tr>
                  ))
                )}
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

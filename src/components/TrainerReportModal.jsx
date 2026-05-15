import React from 'react';
import { X, Star, Clock, Calendar } from 'lucide-react';

export default function TrainerReportModal({ user, isOpen, onClose }) {
  if (!isOpen || !user) return null;

  const sessionReports = user.sessionReports || [];
  const transferredTo = user.transferredSessions?.filter(ts => ts.direction === 'To') || [];
  const takenFrom = user.transferredSessions?.filter(ts => ts.direction === 'From') || [];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '1100px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-4 mb-6" style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
          <img src={user.photo} alt={user.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <h2 style={{ marginBottom: 0 }}>{user.name}</h2>
            <span className={user.role === 'Trainer' ? 'badge badge-purple' : 'badge badge-green'}>{user.role}</span>
          </div>
        </div>

        <div className="dashboard-grid mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          <div className="card flex-col gap-1" style={{ padding: '1rem', backgroundColor: '#F9FAFB', boxShadow: 'none', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: 500 }}>Total Sessions</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{user.sessions}</p>
          </div>
          <div className="card flex-col gap-1" style={{ padding: '1rem', backgroundColor: '#F9FAFB', boxShadow: 'none', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: 500 }}>Total Hours</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{user.hours}</p>
          </div>
          <div className="card flex-col gap-1" style={{ padding: '1rem', backgroundColor: '#F9FAFB', boxShadow: 'none', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: 500 }}>Missed Sessions</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: user.missedSessions > 0 ? '#EF4444' : '#10B981' }}>{user.missedSessions}</p>
          </div>
          <div className="card flex-col gap-1" style={{ padding: '1rem', backgroundColor: '#F9FAFB', boxShadow: 'none', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: 500 }}>Avg Rating</h3>
            <p className="flex items-center gap-1" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F59E0B' }}>
              {user.rating} <Star size={20} fill="#F59E0B" />
            </p>
          </div>
        </div>

        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Session Reports</h3>
        <div className="table-container mb-8">
          <table style={{ border: '1px solid #E5E7EB' }}>
            <thead style={{ backgroundColor: '#F9FAFB' }}>
              <tr>
                <th>Date</th>
                <th>Session</th>
                <th>Batch</th>
                <th>Lab</th>
                {user.role === 'Co-Trainer' && <th>Lead Trainer</th>}
                <th>Hours</th>
                <th>Avg Rating</th>
              </tr>
            </thead>
            <tbody>
              {user.sessionReports.map((report, idx) => (
                <tr key={idx}>
                  <td style={{ color: '#4B5563', fontSize: '0.875rem' }}>{report.date}</td>
                  <td style={{ fontWeight: 500 }}>{report.session}</td>
                  <td style={{ fontSize: '0.875rem' }}>{report.batch}</td>
                  <td style={{ fontSize: '0.875rem' }}>{report.lab}</td>
                  {user.role === 'Co-Trainer' && (
                    <td style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-primary)' }}>{report.trainer || 'N/A'}</td>
                  )}
                  <td>
                    <div className="flex items-center gap-1" style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                      <Clock size={14} /> {report.hours}h
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: '#F59E0B' }}>{report.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', marginTop: '2rem' }}>Transferred Sessions: To Others</h3>
        <div className="table-container mb-6">
          <table style={{ border: '1px solid #E5E7EB' }}>
            <thead style={{ backgroundColor: '#FEF2F2' }}>
              <tr>
                <th>Date</th>
                <th>Session</th>
                <th>Batch</th>
                <th>Lab</th>
                <th>Hours</th>
                <th>Transferred To</th>
              </tr>
            </thead>
            <tbody>
              {transferredTo.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#6B7280', padding: '2rem' }}>No sessions transferred to others.</td>
                </tr>
              ) : (
                transferredTo.map((ts, idx) => (
                  <tr key={idx}>
                    <td style={{ color: '#4B5563', fontSize: '0.875rem' }}>{ts.date}</td>
                    <td style={{ fontWeight: 500 }}>{ts.session}</td>
                    <td style={{ fontSize: '0.875rem' }}>{ts.batch}</td>
                    <td style={{ fontSize: '0.875rem' }}>{ts.lab}</td>
                    <td>
                      <div className="flex items-center gap-1" style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                        <Clock size={14} /> {ts.hours}h
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#EF4444' }}>{ts.partner}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', marginTop: '2rem' }}>Transferred Sessions: Taken From Others</h3>
        <div className="table-container mb-4">
          <table style={{ border: '1px solid #E5E7EB' }}>
            <thead style={{ backgroundColor: '#ECFDF5' }}>
              <tr>
                <th>Date</th>
                <th>Session</th>
                <th>Batch</th>
                <th>Lab</th>
                <th>Hours</th>
                <th>Avg Rating</th>
                <th>Taken From</th>
              </tr>
            </thead>
            <tbody>
              {takenFrom.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#6B7280', padding: '2rem' }}>No sessions taken from others.</td>
                </tr>
              ) : (
                takenFrom.map((ts, idx) => (
                  <tr key={idx}>
                    <td style={{ color: '#4B5563', fontSize: '0.875rem' }}>{ts.date}</td>
                    <td style={{ fontWeight: 500 }}>{ts.session}</td>
                    <td style={{ fontSize: '0.875rem' }}>{ts.batch}</td>
                    <td style={{ fontSize: '0.875rem' }}>{ts.lab}</td>
                    <td>
                      <div className="flex items-center gap-1" style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                        <Clock size={14} /> {ts.hours}h
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: '#F59E0B' }}>{ts.rating || 'N/A'}</td>
                    <td>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#10B981' }}>{ts.partner}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="btn btn-outline" onClick={onClose}>Close Report</button>
        </div>
      </div>
    </div>
  );
}

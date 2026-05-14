import React from 'react';
import { X, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function StudentReportModal({ user, isOpen, onClose }) {
  if (!isOpen || !user || !user.detailedReport) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
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
            <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>{user.batch}</span>
          </div>
        </div>

        <div className="dashboard-grid mb-6">
          <div className="card" style={{ padding: '1rem', backgroundColor: '#F9FAFB', boxShadow: 'none', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: 500 }}>Overall Score</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{user.score}</p>
          </div>
          <div className="card" style={{ padding: '1rem', backgroundColor: '#F9FAFB', boxShadow: 'none', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: 500 }}>Attendance</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: user.attendance >= 80 ? 'var(--color-success)' : 'var(--color-danger)' }}>{user.attendance}%</p>
          </div>
        </div>

        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Dates & Sessions Attendance</h3>
        <div className="table-container mb-8">
          <table style={{ border: '1px solid #E5E7EB' }}>
            <thead style={{ backgroundColor: '#F9FAFB' }}>
              <tr>
                <th>Date</th>
                <th>Session Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {user.detailedReport.sessions.map((session, idx) => (
                <tr key={idx}>
                  <td>{session.date}</td>
                  <td style={{ fontWeight: 500 }}>{session.sessionName}</td>
                  <td>
                    {session.attendance === 'Present' ? (
                      <span className="badge badge-green flex items-center gap-1" style={{ width: 'fit-content' }}><CheckCircle size={14} /> Present</span>
                    ) : (
                      <span className="badge badge-danger flex items-center gap-1" style={{ width: 'fit-content' }}><XCircle size={14} /> Absent</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Class Performance Detailed Report</h3>
        <div className="table-container mb-4">
          <table style={{ border: '1px solid #E5E7EB' }}>
            <thead style={{ backgroundColor: '#F9FAFB' }}>
              <tr>
                <th>Activity Name</th>
                <th>Score</th>
                <th>Time Taken</th>
              </tr>
            </thead>
            <tbody>
              {user.detailedReport.performance.map((perf, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 500 }}>{perf.activity}</td>
                  <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{perf.score}</td>
                  <td>
                    <div className="flex items-center gap-1" style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                      <Clock size={14} /> {perf.timeTaken}
                    </div>
                  </td>
                </tr>
              ))}
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

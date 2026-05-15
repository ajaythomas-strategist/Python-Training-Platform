import React from 'react';
import { X, Calendar, ArrowRight } from 'lucide-react';

export default function MissedSessionsModal({ user, isOpen, onClose }) {
  if (!isOpen || !user) return null;

  const transferredSessions = user.transferredSessions || [];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}
        >
          <X size={20} />
        </button>

        <h2 style={{ marginBottom: '0.25rem' }}>Transferred Sessions</h2>
        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Details of sessions transferred by {user.name}.
        </p>

        {transferredSessions.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: '8px', color: '#6B7280' }}>
            No transferred sessions recorded.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {transferredSessions.map((session, idx) => (
              <div key={idx} style={{ padding: '1rem', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: '#F9FAFB' }}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2" style={{ fontWeight: 600, color: '#1F2937' }}>
                    <Calendar size={16} color="#8B5CF6" /> {session.date}
                  </div>
                  <span className={`badge ${session.direction === 'To' ? 'badge-danger' : 'badge-green'}`} style={{ fontSize: '10px' }}>
                    {session.direction === 'To' ? 'Transferred To' : 'Taken From'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2" style={{ fontSize: '0.875rem', color: '#4B5563' }}>
                  <span>{session.direction === 'To' ? user.name : session.partner}</span>
                  <ArrowRight size={14} color="#9CA3AF" />
                  <span style={{ fontWeight: 500 }}>{session.direction === 'To' ? session.partner : user.name}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', fontStyle: 'italic' }}>Reason: {session.reason}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { X, MessageSquare } from 'lucide-react';

export default function CommentsModal({ user, isOpen, onClose }) {
  if (!isOpen || !user || !user.feedback) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', position: 'relative', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}
        >
          <X size={20} />
        </button>

        <h2 style={{ marginBottom: '0.25rem' }}>Feedback Comments</h2>
        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          All reviews and comments left for {user.name}.
        </p>

        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }} className="flex flex-col gap-3">
          {user.feedback.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: '8px', color: '#6B7280' }}>
              No comments available.
            </div>
          ) : (
            user.feedback.map((comment, idx) => (
              <div key={idx} style={{ padding: '1rem', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: '#F9FAFB', display: 'flex', gap: '1rem' }}>
                <MessageSquare size={16} color="#818CF8" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                <p style={{ fontSize: '0.875rem', color: '#374151', fontStyle: 'italic', margin: 0 }}>"{comment}"</p>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex justify-end pt-4" style={{ borderTop: '1px solid #E5E7EB' }}>
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

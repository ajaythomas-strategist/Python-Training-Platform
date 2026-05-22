import React from 'react';
import { createPortal } from 'react-dom';
import { X, MessageSquare } from 'lucide-react';

export default function CommentsModal({ user, isOpen, onClose }) {
  if (!isOpen || !user || !user.feedback) return null;

  return createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(12px)',
      padding: '20px'
    }}>
      <div className="animate-fade-in" style={{ 
        width: '100%', maxWidth: '600px', backgroundColor: 'white', borderRadius: '32px', overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', flexDirection: 'column', maxHeight: '90vh'
      }}>
        
        {/* Premium Header */}
        <div style={{ 
          padding: '40px 40px 30px 40px', flexShrink: 0,
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
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
          
          <div className="flex items-center gap-4">
            <div style={{ 
              padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.2)', 
              borderRadius: '16px', backdropFilter: 'blur(10px)', color: 'white'
            }}>
              <MessageSquare size={32} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>Feedback Comments</h2>
              <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', fontWeight: 500 }}>All reviews left for {user.name}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div style={{ overflowY: 'auto', padding: '40px', flex: 1, backgroundColor: '#F8FAFC' }}>
          
          <div className="flex flex-col gap-4">
            {user.feedback.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: 'white', borderRadius: '24px', border: '1px dashed #CBD5E1' }}>
                <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.925rem', fontWeight: 600 }}>No comments available.</p>
              </div>
            ) : (
              user.feedback.map((comment, idx) => (
                <div key={idx} style={{ 
                  padding: '24px', backgroundColor: 'white', borderRadius: '24px', 
                  border: '1px solid #F1F5F9', display: 'flex', gap: '20px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', transition: 'transform 0.2s', cursor: 'default'
                }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
                  <div style={{ padding: '12px', backgroundColor: '#EEF2FF', borderRadius: '16px', color: '#6366F1', height: 'fit-content' }}>
                    <MessageSquare size={20} />
                  </div>
                  <p style={{ fontSize: '1rem', color: '#1E293B', fontStyle: 'italic', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>"{comment}"</p>
                </div>
              ))
            )}
          </div>

          <div style={{ marginTop: '32px' }}>
            <button 
              onClick={onClose}
              style={{ 
                width: '100%', padding: '16px', borderRadius: '16px', border: 'none', 
                backgroundColor: '#1E293B', color: 'white', fontWeight: '800', cursor: 'pointer',
                transition: 'all 0.2s ease', boxShadow: '0 10px 15px -3px rgba(30, 41, 59, 0.3)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'none'}
            >
              Close
            </button>
          </div>
          
        </div>
      </div>
    </div>,
    document.body
  );
}

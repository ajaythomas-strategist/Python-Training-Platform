import React from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, ArrowRight } from 'lucide-react';

export default function MissedSessionsModal({ user, isOpen, onClose }) {
  if (!isOpen || !user) return null;

  const transferredSessions = user.transferredSessions || [];

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
          background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
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
              <Calendar size={32} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>Transferred Sessions</h2>
              <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', fontWeight: 500 }}>Details of sessions transferred by {user.name}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div style={{ overflowY: 'auto', padding: '40px', flex: 1, backgroundColor: '#F8FAFC' }}>
          
          {transferredSessions.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: 'white', borderRadius: '24px', border: '1px dashed #CBD5E1' }}>
              <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.925rem', fontWeight: 600 }}>No transferred sessions recorded.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {transferredSessions.map((session, idx) => (
                <div key={idx} style={{ 
                  padding: '24px', backgroundColor: 'white', borderRadius: '24px', 
                  border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                  transition: 'transform 0.2s'
                }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
                  
                  <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <div className="flex items-center gap-2" style={{ fontWeight: 800, color: '#1E293B', fontSize: '1.125rem' }}>
                      <div style={{ padding: '8px', backgroundColor: '#F5F3FF', borderRadius: '10px', color: '#8B5CF6' }}>
                        <Calendar size={18} />
                      </div>
                      {session.date}
                    </div>
                    <span style={{ 
                      padding: '4px 12px', 
                      backgroundColor: session.direction === 'To' ? '#FEE2E2' : '#D1FAE5', 
                      color: session.direction === 'To' ? '#B91C1C' : '#047857', 
                      borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' 
                    }}>
                      {session.direction === 'To' ? 'Transferred To' : 'Taken From'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Original</span>
                      <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>{session.direction === 'To' ? user.name : session.partner}</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <ArrowRight size={20} color="#CBD5E1" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Replacement</span>
                      <span style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.9rem' }}>{session.direction === 'To' ? session.partner : user.name}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reason for transfer</span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.925rem', color: '#475569', fontStyle: 'italic', fontWeight: 500 }}>"{session.reason}"</p>
                  </div>

                </div>
              ))}
            </div>
          )}

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
              Close Record
            </button>
          </div>
          
        </div>
      </div>
    </div>,
    document.body
  );
}

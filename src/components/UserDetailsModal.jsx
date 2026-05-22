import React from 'react';
import { createPortal } from 'react-dom';
import { X, GraduationCap, Users } from 'lucide-react';

export default function UserDetailsModal({ user, isOpen, onClose }) {
  if (!isOpen || !user) return null;

  return createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(12px)',
      padding: '20px'
    }}>
      <div className="animate-fade-in" style={{ 
        width: '100%', maxWidth: '400px', backgroundColor: 'white', borderRadius: '32px', overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', flexDirection: 'column', maxHeight: '90vh'
      }}>
        
        {/* Dynamic Premium Header based on Role */}
        <div style={{ 
          padding: '40px 30px 30px 30px', flexShrink: 0,
          background: user.role === 'Student' ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' :
                      user.role === 'Trainer' ? 'linear-gradient(135deg, #7C3AED 0%, #4338CA 100%)' :
                      user.role === 'Admin' ? 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)' :
                      'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          position: 'relative',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
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
          
          <div style={{ 
            padding: '4px', backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            borderRadius: '50%', backdropFilter: 'blur(10px)', marginBottom: '16px'
          }}>
            {user.photo ? (
              <img src={user.photo} alt={user.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white' }} />
            ) : (
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'white', color: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900 }}>
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>{user.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span style={{ 
              padding: '6px 16px', backgroundColor: 'rgba(255, 255, 255, 0.2)', 
              borderRadius: '12px', color: 'white', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase'
            }}>
              {user.role}
            </span>
          </div>
        </div>

        {/* Scrollable Body */}
        <div style={{ overflowY: 'auto', padding: '32px', flex: 1, backgroundColor: '#F8FAFC' }}>
          
          {user.role === 'Student' && (
            <div>
              <h3 style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Student Profile</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  <div style={{ padding: '12px', backgroundColor: '#EEF2FF', borderRadius: '16px', color: '#4F46E5' }}>
                    <Users size={20} />
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gender</p>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>{user.gender || 'Not specified'}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  <div style={{ padding: '12px', backgroundColor: '#F5F3FF', borderRadius: '16px', color: '#7C3AED' }}>
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>High School</p>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>{user.highSchool || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: user.role === 'Student' ? '32px' : '0' }}>
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
              Close Profile
            </button>
          </div>
          
        </div>
      </div>
    </div>,
    document.body
  );
}

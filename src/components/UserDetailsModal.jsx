import React from 'react';
import { X, GraduationCap, Users } from 'lucide-react';

export default function UserDetailsModal({ user, isOpen, onClose }) {
  if (!isOpen || !user) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center mb-6 mt-4">
          {user.photo ? (
            <img 
              src={user.photo} 
              alt={user.name} 
              style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
            />
          ) : (
            <div className="avatar" style={{ width: '120px', height: '120px', fontSize: '48px', marginBottom: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              {user.name.charAt(0)}
            </div>
          )}
          <h2 style={{ marginBottom: '0.25rem' }}>{user.name}</h2>
          <span className={`badge ${
            user.role === 'Student' ? 'badge-blue' : 
            user.role === 'Admin' ? 'badge-danger' :
            user.role === 'Trainer' ? 'badge-purple' : 'badge-green'
          }`}>
            {user.role}
          </span>
        </div>

        {user.role === 'Student' && (
          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem' }}>
            <h3 style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student Profile</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div style={{ padding: '8px', backgroundColor: '#F3F4F6', borderRadius: '8px', color: '#4B5563' }}>
                  <Users size={18} />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Gender</p>
                  <p style={{ fontWeight: 500 }}>{user.gender || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div style={{ padding: '8px', backgroundColor: '#F3F4F6', borderRadius: '8px', color: '#4B5563' }}>
                  <GraduationCap size={18} />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>High School</p>
                  <p style={{ fontWeight: 500 }}>{user.highSchool || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <button className="btn btn-outline w-full" onClick={onClose} style={{ justifyContent: 'center' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Super Admin Credentials
    if (username === '8129214289' && password === 'AjayThomas@1') {
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
      padding: '20px'
    }}>
      <div className="card animate-fade-in" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '48px',
        borderRadius: '32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white'
      }}>
        <div className="flex flex-col items-center mb-10 text-center">
          <div style={{
            padding: '20px',
            backgroundColor: '#EEF2FF',
            borderRadius: '24px',
            color: '#4F46E5',
            marginBottom: '20px',
            boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.1)'
          }}>
            <ShieldCheck size={40} />
          </div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#1F2937' }}>TrainMaster</h1>
          <p style={{ margin: '8px 0 0', color: '#6B7280', fontSize: '1rem' }}>Super Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input 
                required
                type="text"
                className="w-full"
                style={{ 
                  padding: '14px 16px 14px 48px', 
                  borderRadius: '14px', 
                  border: '2px solid #F3F4F6',
                  outline: 'none',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#F9FAFB'
                }}
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input 
                required
                type={showPassword ? 'text' : 'password'}
                className="w-full"
                style={{ 
                  padding: '14px 16px 14px 48px', 
                  borderRadius: '14px', 
                  border: '2px solid #F3F4F6',
                  outline: 'none',
                  fontSize: '1rem',
                  backgroundColor: '#F9FAFB'
                }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p style={{ margin: 0, color: '#EF4444', fontSize: '0.875rem', fontWeight: 600, textAlign: 'center' }}>
              {error}
            </p>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ 
              padding: '16px', 
              borderRadius: '14px', 
              fontSize: '1rem', 
              fontWeight: 700,
              justifyContent: 'center',
              marginTop: '12px',
              background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
              boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)'
            }}
          >
            Sign In
          </button>
        </form>

        <p style={{ marginTop: '32px', textAlign: 'center', color: '#9CA3AF', fontSize: '0.875rem' }}>
          Restricted access for authorized personnel only.
        </p>
      </div>
    </div>
  );
}

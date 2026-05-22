import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Mail, Phone, Briefcase, GraduationCap, ShieldCheck, Camera, Save, Sparkles, Lock } from 'lucide-react';

export default function EditUserModal({ isOpen, onClose, user, onUpdate, userRole }) {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Student',
    email: '',
    phone: '',
    batch: '',
    department: '',
    photo: ''
  });

  const isRestricted = userRole === 'Trainer' || userRole === 'Co-Trainer';

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        role: user.role || 'Student',
        email: user.email || '',
        phone: user.phone || '',
        batch: user.batch || '',
        department: user.department || '',
        photo: user.photo || ''
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...user,
      ...formData,
      // Ensure role cannot be altered by restricted roles under any circumstances
      role: isRestricted ? 'Student' : formData.role
    });
    onClose();
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%'
  };

  const labelStyle = {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginLeft: '4px'
  };

  const inputWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 16px 16px 52px',
    backgroundColor: '#F8FAFC',
    border: '2px solid #F1F5F9',
    borderRadius: '16px',
    outline: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#1E293B',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit'
  };

  const iconStyle = {
    position: 'absolute',
    left: '18px',
    color: '#64748B',
    pointerEvents: 'none'
  };

  return createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(12px)',
      padding: '20px'
    }}>
      <div className="animate-fade-in" style={{ 
        width: '100%', maxWidth: '650px', backgroundColor: 'white', borderRadius: '32px', overflowY: 'auto', maxHeight: '90vh',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Header Section */}
        <div style={{ 
          padding: '40px 40px 30px 40px', 
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
            <button onClick={onClose} style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)', 
              border: 'none', padding: '8px', borderRadius: '12px', color: 'white', cursor: 'pointer' 
            }}>
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center gap-5">
            <div style={{ 
              padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.2)', 
              color: 'white', borderRadius: '20px', backdropFilter: 'blur(10px)'
            }}>
              <Sparkles size={28} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>Edit Member Profile</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>Update platform member details securely</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Full Name */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Full Name</label>
              <div style={inputWrapperStyle}>
                <User size={20} style={iconStyle} />
                <input 
                  required
                  type="text" 
                  placeholder="Enter full name..."
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#4F46E5'; e.target.style.backgroundColor = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#F1F5F9'; e.target.style.backgroundColor = '#F8FAFC'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Email */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Email Address</label>
                <div style={inputWrapperStyle}>
                  <Mail size={20} style={iconStyle} />
                  <input 
                    required
                    type="email" 
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = '#4F46E5'; e.target.style.backgroundColor = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#F1F5F9'; e.target.style.backgroundColor = '#F8FAFC'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Phone */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Phone Number</label>
                <div style={inputWrapperStyle}>
                  <Phone size={20} style={iconStyle} />
                  <input 
                    required
                    type="tel" 
                    placeholder="+91 00000 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = '#4F46E5'; e.target.style.backgroundColor = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#F1F5F9'; e.target.style.backgroundColor = '#F8FAFC'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Role */}
              <div style={inputGroupStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={labelStyle}>Assigned Role</label>
                  {isRestricted && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase' }}>
                      <Lock size={10} /> Locked
                    </span>
                  )}
                </div>
                <div style={inputWrapperStyle}>
                  <ShieldCheck size={20} style={iconStyle} />
                  <select 
                    value={formData.role}
                    disabled={isRestricted}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    style={{ 
                      ...inputStyle, 
                      cursor: isRestricted ? 'not-allowed' : 'pointer', 
                      appearance: 'none',
                      backgroundColor: isRestricted ? '#F1F5F9' : '#F8FAFC',
                      color: isRestricted ? '#64748B' : '#1E293B'
                    }}
                  >
                    <option value="Student">Student</option>
                    <option value="Trainer">Trainer</option>
                    <option value="Co-Trainer">Co-Trainer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Batch/Dept */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>{formData.role === 'Student' ? 'Active Batch' : 'Department'}</label>
                <div style={inputWrapperStyle}>
                  {formData.role === 'Student' ? <GraduationCap size={20} style={iconStyle} /> : <Briefcase size={20} style={iconStyle} />}
                  <input 
                    required
                    type="text" 
                    placeholder={formData.role === 'Student' ? 'e.g. Batch Alpha' : 'e.g. IT Dept'}
                    value={formData.role === 'Student' ? formData.batch : formData.department}
                    onChange={(e) => formData.role === 'Student' ? setFormData({...formData, batch: e.target.value}) : setFormData({...formData, department: e.target.value})}
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = '#4F46E5'; e.target.style.backgroundColor = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#F1F5F9'; e.target.style.backgroundColor = '#F8FAFC'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>
            </div>

            {/* Profile Photo */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Profile Image Link (Optional)</label>
              <div style={inputWrapperStyle}>
                <Camera size={20} style={iconStyle} />
                <input 
                  type="url" 
                  placeholder="https://..."
                  value={formData.photo}
                  onChange={(e) => setFormData({...formData, photo: e.target.value})}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#4F46E5'; e.target.style.backgroundColor = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#F1F5F9'; e.target.style.backgroundColor = '#F8FAFC'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '50px' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{ 
                flex: 1, padding: '18px', borderRadius: '18px', border: '2px solid #E2E8F0', 
                backgroundColor: 'white', color: '#64748B', fontWeight: '800', cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#F8FAFC'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={{ 
                flex: 1.5, padding: '18px', borderRadius: '18px', border: 'none', 
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', 
                color: 'white', fontWeight: '900', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: '0 10px 20px -5px rgba(79, 70, 229, 0.5)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'none'}
            >
              <Save size={20} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

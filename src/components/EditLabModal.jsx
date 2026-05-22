import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Monitor, Shield, Users, Cpu, Save } from 'lucide-react';

export default function EditLabModal({ isOpen, onClose, onUpdate, lab }) {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    capacity: ''
  });

  useEffect(() => {
    if (isOpen && lab) {
      setFormData({
        name: lab.name || '',
        department: lab.department || '',
        capacity: lab.capacity || ''
      });
    }
  }, [isOpen, lab]);

  if (!isOpen || !lab) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...lab, ...formData, capacity: parseInt(formData.capacity) });
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
        {/* Header Section - Green Theme */}
        <div style={{ 
          padding: '40px 40px 30px 40px', 
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
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
              <Monitor size={28} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>Edit Lab Details</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>Update facility and workstation info</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Lab Name */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Lab Display Name</label>
              <div style={inputWrapperStyle}>
                <Monitor size={20} style={iconStyle} />
                <input 
                  required
                  type="text" 
                  placeholder="Enter lab name..."
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#10B981'; e.target.style.backgroundColor = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#F1F5F9'; e.target.style.backgroundColor = '#F8FAFC'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Department */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Allocated Department</label>
                <div style={inputWrapperStyle}>
                  <Shield size={20} style={iconStyle} />
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Advanced Computing"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = '#10B981'; e.target.style.backgroundColor = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#F1F5F9'; e.target.style.backgroundColor = '#F8FAFC'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Capacity */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Workstation Capacity</label>
                <div style={inputWrapperStyle}>
                  <Cpu size={20} style={iconStyle} />
                  <input 
                    required
                    type="number" 
                    placeholder="Number of units"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = '#10B981'; e.target.style.backgroundColor = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#F1F5F9'; e.target.style.backgroundColor = '#F8FAFC'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
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
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', 
                color: 'white', fontWeight: '900', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.5)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'none'}
            >
              <Save size={20} />
              Save Lab Profile
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

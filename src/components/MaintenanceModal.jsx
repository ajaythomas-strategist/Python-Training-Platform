import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, AlertTriangle, Save, Clock } from 'lucide-react';

export default function MaintenanceModal({ isOpen, onClose, onSetMaintenance, lab }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setStartDate(lab?.maintenance?.startDate || today);
      setEndDate(lab?.maintenance?.endDate || today);
    }
  }, [isOpen, lab]);

  if (!isOpen || !lab) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Please select both dates.");
      return;
    }
    
    if (startDate > endDate) {
      alert("End date cannot be before start date.");
      return;
    }

    onSetMaintenance(lab._id || lab.id, { startDate, endDate, reason: 'Maintenance' });
    onClose();
  };

  const handleClear = () => {
    onSetMaintenance(lab._id || lab.id, null);
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
        width: '100%', maxWidth: '600px', backgroundColor: 'white', borderRadius: '32px', overflowY: 'auto', maxHeight: '90vh',
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
              <Clock size={28} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>Set Lab Offline</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>{lab.name} • Maintenance Schedule</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            <div style={{ 
              backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', 
              padding: '16px', borderRadius: '20px', display: 'flex', gap: '12px' 
            }}>
              <AlertTriangle size={20} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400E', fontWeight: 500, lineHeight: '1.5' }}>
                Marking this lab offline will prevent any classes from being scheduled during the selected dates.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* From Date */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>From Date</label>
                <div style={inputWrapperStyle}>
                  <Calendar size={20} style={iconStyle} />
                  <input 
                    required
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = '#10B981'; e.target.style.backgroundColor = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#F1F5F9'; e.target.style.backgroundColor = '#F8FAFC'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* To Date */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>To Date</label>
                <div style={inputWrapperStyle}>
                  <Calendar size={20} style={iconStyle} />
                  <input 
                    required
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
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
            {lab.maintenance ? (
              <button 
                type="button" 
                onClick={handleClear}
                style={{ 
                  flex: 1, padding: '18px', borderRadius: '18px', border: 'none', 
                  backgroundColor: '#FEE2E2', color: '#EF4444', fontWeight: '800', cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#FECACA'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#FEE2E2'}
              >
                Bring Online
              </button>
            ) : (
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
            )}
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
              Set Schedule
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

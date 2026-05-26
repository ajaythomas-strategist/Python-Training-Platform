import React from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Phone, User, Shield, GraduationCap, Briefcase, BookOpen } from 'lucide-react';

const roleGradient = (role) => {
    if (role === 'Student') return 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)';
    if (role === 'Trainer') return 'linear-gradient(135deg, #7C3AED 0%, #4338CA 100%)';
    if (role === 'Co-Trainer') return 'linear-gradient(135deg, #8B5CF6 0%, #5B21B6 100%)';
    if (role === 'Admin') return 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)';
    return 'linear-gradient(135deg, #10B981 0%, #059669 100%)'; // SuperAdmin
};

function InfoCard({ icon, label, value, iconBg, iconColor }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                backgroundColor: 'white',
                borderRadius: '18px',
                border: '1px solid #F1F5F9',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
        >
            <div
                style={{
                    padding: '12px',
                    backgroundColor: iconBg,
                    borderRadius: '14px',
                    color: iconColor,
                    flexShrink: 0,
                }}
            >
                {icon}
            </div>
            <div>
                <p
                    style={{
                        margin: '0 0 3px 0',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: '#94A3B8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                    }}
                >
                    {label}
                </p>
                <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#1E293B' }}>
                    {value || (
                        <span style={{ color: '#CBD5E1', fontStyle: 'italic', fontWeight: 500 }}>
                            Not specified
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
}

export default function UserDetailsModal({ user, isOpen, onClose }) {
    if (!isOpen || !user) return null;

    const isStudent = user.role === 'Student';
    const isTrainerRole = user.role === 'Trainer' || user.role === 'Co-Trainer';

    return createPortal(
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(12px)',
                padding: '20px',
            }}
        >
            <div
                className="animate-fade-in"
                style={{
                    width: '100%',
                    maxWidth: '460px',
                    backgroundColor: 'white',
                    borderRadius: '32px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 60px -12px rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '90vh',
                }}
            >
                {/* ── Header ── */}
                <div
                    style={{
                        padding: '40px 30px 30px',
                        background: roleGradient(user.role),
                        position: 'relative',
                        flexShrink: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                        <button
                            onClick={onClose}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                padding: '8px',
                                borderRadius: '12px',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                            onMouseOver={(e) =>
                                (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.35)')
                            }
                            onMouseOut={(e) =>
                                (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)')
                            }
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Initials Avatar */}
                    <div
                        style={{
                            width: '96px',
                            height: '96px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.25)',
                            border: '3px solid rgba(255,255,255,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            fontWeight: 900,
                            color: 'white',
                            marginBottom: '16px',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>

                    <h2
                        style={{
                            margin: 0,
                            fontSize: '1.6rem',
                            fontWeight: 900,
                            color: 'white',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {user.name}
                    </h2>
                    <span
                        style={{
                            marginTop: '10px',
                            padding: '5px 16px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: '10px',
                            color: 'white',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                        }}
                    >
                        {user.role}
                    </span>
                </div>

                {/* ── Scrollable Body ── */}
                <div
                    style={{
                        overflowY: 'auto',
                        padding: '28px',
                        flex: 1,
                        backgroundColor: '#F8FAFC',
                    }}
                >
                    {/* Common Info */}
                    <p
                        style={{
                            margin: '0 0 14px 4px',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            color: '#94A3B8',
                            textTransform: 'uppercase',
                            letterSpacing: '0.07em',
                        }}
                    >
                        Contact & Profile
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            marginBottom: '20px',
                        }}
                    >
                        <InfoCard
                            icon={<Mail size={18} />}
                            label="Email"
                            value={user.email}
                            iconBg="#EFF6FF"
                            iconColor="#3B82F6"
                        />
                        <InfoCard
                            icon={<Phone size={18} />}
                            label="Phone"
                            value={user.phone}
                            iconBg="#F0FDF4"
                            iconColor="#16A34A"
                        />
                        <InfoCard
                            icon={<User size={18} />}
                            label="Gender"
                            value={user.gender}
                            iconBg="#FDF4FF"
                            iconColor="#9333EA"
                        />
                        <InfoCard
                            icon={<Shield size={18} />}
                            label="Account Status"
                            value={user.isActive === false ? 'Inactive' : 'Active'}
                            iconBg={user.isActive === false ? '#FEF2F2' : '#ECFDF5'}
                            iconColor={user.isActive === false ? '#EF4444' : '#10B981'}
                        />
                    </div>

                    {/* Student-specific */}
                    {isStudent && (
                        <>
                            <p
                                style={{
                                    margin: '0 0 14px 4px',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    color: '#94A3B8',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.07em',
                                }}
                            >
                                Academic Details
                            </p>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                    marginBottom: '20px',
                                }}
                            >
                                <InfoCard
                                    icon={<GraduationCap size={18} />}
                                    label="Batch"
                                    value={user.batch}
                                    iconBg="#EEF2FF"
                                    iconColor="#4F46E5"
                                />
                                <InfoCard
                                    icon={<BookOpen size={18} />}
                                    label="High School"
                                    value={user.highSchool}
                                    iconBg="#FFF7ED"
                                    iconColor="#EA580C"
                                />
                            </div>
                        </>
                    )}

                    {/* Trainer/Co-Trainer-specific */}
                    {isTrainerRole && (
                        <>
                            <p
                                style={{
                                    margin: '0 0 14px 4px',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    color: '#94A3B8',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.07em',
                                }}
                            >
                                Work Details
                            </p>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                    marginBottom: '20px',
                                }}
                            >
                                <InfoCard
                                    icon={<Briefcase size={18} />}
                                    label="Department"
                                    value={user.department}
                                    iconBg="#F5F3FF"
                                    iconColor="#7C3AED"
                                />
                            </div>
                        </>
                    )}

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '18px',
                            border: 'none',
                            backgroundColor: '#1E293B',
                            color: 'white',
                            fontWeight: 800,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 8px 15px -3px rgba(30,41,59,0.25)',
                            fontSize: '0.9375rem',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#0F172A';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#1E293B';
                            e.currentTarget.style.transform = 'none';
                        }}
                    >
                        Close Profile
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}

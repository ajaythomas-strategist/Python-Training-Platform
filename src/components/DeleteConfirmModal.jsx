import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, message, isBulk = false, count = 1 }) {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '24px',
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    width: '100%',
                    maxWidth: '400px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    animation: 'modal-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    overflow: 'hidden',
                }}
            >
                <div style={{ padding: '32px 32px 24px' }}>
                    <div
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            backgroundColor: '#FEF2F2',
                            color: '#EF4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '24px',
                        }}
                    >
                        <AlertTriangle size={28} />
                    </div>

                    <h2
                        style={{
                            margin: '0 0 12px 0',
                            fontSize: '1.25rem',
                            fontWeight: '800',
                            color: '#111827',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {title || (isBulk ? `Delete ${count} Users?` : 'Delete User?')}
                    </h2>

                    <p
                        style={{
                            margin: 0,
                            fontSize: '0.95rem',
                            color: '#4B5563',
                            lineHeight: '1.5',
                        }}
                    >
                        {message ||
                            `Are you sure you want to permanently delete ${
                                isBulk ? `these ${count} selected users` : 'this user'
                            }? This action cannot be undone and will remove all their associated data.`}
                    </p>
                </div>

                <div
                    style={{
                        padding: '24px 32px',
                        backgroundColor: '#F8FAFC',
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'flex-end',
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: 'white',
                            border: '1px solid #E2E8F0',
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            color: '#475569',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F1F5F9';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#EF4444',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#DC2626';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#EF4444';
                        }}
                    >
                        Delete {isBulk ? `${count} Users` : 'User'}
                    </button>
                </div>
            </div>
            <style>
                {`
                @keyframes modal-slide-up {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                `}
            </style>
        </div>
    );
}

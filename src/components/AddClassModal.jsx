import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { baseUrl } from './utils/api';

export default function AddClassModal({ isOpen, onClose, onClassAdded, token }) {
    const [className, setClassName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setClassName('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${baseUrl}/api/classes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ className }),
            });
            if (!res.ok) throw new Error('Failed to create class');
            const newClass = await res.json();
            onClassAdded(newClass);
            onClose();
        } catch (err) {
            console.error(err);
            alert('Error creating class');
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                backdropFilter: 'blur(8px)',
            }}
        >
            <div
                className="animate-fade-in"
                style={{
                    backgroundColor: 'white',
                    padding: '32px',
                    borderRadius: '32px',
                    width: '400px',
                    position: 'relative',
                    boxShadow: '0 30px 60px -12px rgba(15, 23, 42, 0.25)',
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '24px',
                        right: '24px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6B7280',
                    }}
                >
                    <X size={20} />
                </button>
                <h2 style={{ marginTop: 0, fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>
                    Create New Class
                </h2>
                <p style={{ margin: '8px 0 24px 0', fontSize: '0.875rem', color: '#6B7280' }}>
                    Enter a unique name for the training batch.
                </p>
                <form
                    onSubmit={handleSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                >
                    <div>
                        <label
                            style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#374151',
                            }}
                        >
                            Class Name
                        </label>
                        <input
                            required
                            type="text"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                border: '1px solid #E5E7EB',
                                backgroundColor: '#F8FAFC',
                                outline: 'none',
                                fontSize: '0.875rem',
                            }}
                            placeholder="e.g. 1 BCA A"
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            padding: '14px',
                            background: '#4F46E5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            marginTop: '8px',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
                        }}
                    >
                        Create Class
                    </button>
                </form>
            </div>
        </div>
    );
}

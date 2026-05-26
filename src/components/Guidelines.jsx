import React, { useState, useEffect, useCallback } from 'react';
import { Shield, UserCheck, Users, Plus, Trash2, CheckCircle2, Loader, BookOpen } from 'lucide-react';
import { useStore } from '../store/useStore';
import { baseUrl } from './utils/api';

// Role config (colours, icons)
const roleConfig = [
    { name: 'Admin',      icon: <Shield size={24} />,    color: '#4F46E5', accent: '#818CF8' },
    { name: 'Trainer',    icon: <UserCheck size={24} />, color: '#10B981', accent: '#34D399' },
    { name: 'Co-Trainer', icon: <Users size={24} />,     color: '#6366F1', accent: '#818CF8' },
    { name: 'Student',    icon: <BookOpen size={24} />,  color: '#F59E0B', accent: '#FBBF24' },
    { name: 'All',        icon: <Shield size={24} />,    color: '#64748B', accent: '#94A3B8' },
];

const roleMap = Object.fromEntries(roleConfig.map((r) => [r.name, r]));

// Inline toast
function Toast({ toasts }) {
    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {toasts.map((t) => (
                <div key={t.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '14px 20px', borderRadius: '16px', minWidth: '280px',
                    background: t.type === 'error' ? '#FEF2F2' : '#ECFDF5',
                    border: `1px solid ${t.type === 'error' ? '#FECACA' : '#A7F3D0'}`,
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    fontSize: '0.875rem', fontWeight: 600,
                    color: t.type === 'error' ? '#991B1B' : '#065F46',
                    animation: 'fadeIn 0.3s ease',
                }}>
                    {t.message}
                </div>
            ))}
        </div>
    );
}

export default function Guidelines({ userRole }) {
    const token = useStore((state) => state.token);
    const [guidelines, setGuidelines] = useState({});   // { Admin: [...], Trainer: [...] }
    const [flatList, setFlatList] = useState([]);        // for non-admin roles
    const [loading, setLoading] = useState(true);
    const [newText, setNewText] = useState({ role: '', text: '' });
    const [toasts, setToasts] = useState([]);

    const isSuperAdmin = userRole === 'SuperAdmin';
    const isAdminOrSuper = userRole === 'SuperAdmin' || userRole === 'Admin';

    // ── Toast helpers ────────────────────────────────────────────────────────
    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
    }, []);

    // ── Fetch guidelines ─────────────────────────────────────────────────────
    const fetchGuidelines = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/guidelines`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to load guidelines');
            const { grouped, data } = await res.json();

            if (grouped) {
                setGuidelines(data);   // Admin/SuperAdmin: grouped object
                setFlatList([]);
            } else {
                setFlatList(data);     // Other roles: flat array
                setGuidelines({});
            }
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [token, showToast]);

    useEffect(() => { fetchGuidelines(); }, [fetchGuidelines]);

    // ── Add guideline ────────────────────────────────────────────────────────
    const handleAdd = async (role) => {
        if (!newText.text.trim()) return;
        try {
            const res = await fetch(`${baseUrl}/api/guidelines`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ role, text: newText.text.trim() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to add guideline');

            setGuidelines((prev) => ({
                ...prev,
                [role]: [...(prev[role] || []), data],
            }));
            setNewText({ role: '', text: '' });
            showToast('Guideline added!');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    // ── Delete guideline ─────────────────────────────────────────────────────
    const handleDelete = async (id, role) => {
        try {
            const res = await fetch(`${baseUrl}/api/guidelines/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to delete guideline');

            setGuidelines((prev) => ({
                ...prev,
                [role]: prev[role].filter((g) => g._id !== id),
            }));
            showToast('Guideline removed');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    // ── Render a single card ─────────────────────────────────────────────────
    const renderCard = (roleName, items) => {
        const rc = roleMap[roleName] || roleConfig[0];
        return (
            <div key={roleName} style={{
                backgroundColor: 'white',
                borderRadius: '32px',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.04)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #F1F5F9',
                transition: 'transform 0.3s ease',
            }} className="hover:transform hover:scale-[1.02]">

                {/* Card Header */}
                <div style={{
                    padding: '40px 32px',
                    background: `linear-gradient(135deg, ${rc.color} 0%, ${rc.accent} 100%)`,
                    color: 'white',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            padding: '16px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: '20px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            display: 'flex',
                        }}>
                            {rc.icon}
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.02em' }}>{roleName}</h3>
                            <p style={{ margin: '4px 0 0', fontSize: '0.75rem', fontWeight: '800', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                SOP Management
                            </p>
                        </div>
                    </div>
                </div>

                {/* Guidelines List */}
                <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {items.length === 0 ? (
                        <div style={{ padding: '40px 0', textAlign: 'center' }}>
                            <Users size={40} style={{ color: '#E2E8F0', margin: '0 auto 12px', display: 'block' }} />
                            <p style={{ margin: 0, color: '#94A3B8', fontWeight: '600', fontSize: '0.875rem' }}>
                                No active guidelines for this role
                            </p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item._id || item.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '16px',
                                backgroundColor: '#F8FAFC',
                                borderRadius: '20px',
                                border: '1px solid #F1F5F9',
                            }} className="group transition-all hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50">
                                <div style={{
                                    width: '24px', height: '24px', borderRadius: '50%',
                                    backgroundColor: rc.color, color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <CheckCircle2 size={14} strokeWidth={3} />
                                </div>
                                <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#334155', flex: 1, lineHeight: '1.5' }}>
                                    {item.text}
                                </span>
                                {isSuperAdmin && (
                                    <button
                                        onClick={() => handleDelete(item._id || item.id, roleName)}
                                        style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: '4px', display: 'flex', transition: 'color 0.2s ease' }}
                                        className="hover:text-red-500"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Add new SOP input — SuperAdmin / Admin only */}
                {isAdminOrSuper && (
                    <div style={{ padding: '32px', backgroundColor: '#F9FAFB', borderTop: '1px solid #F1F5F9' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder={`New SOP for ${roleName}…`}
                                value={newText.role === roleName ? newText.text : ''}
                                onChange={(e) => setNewText({ role: roleName, text: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && handleAdd(roleName)}
                                style={{
                                    width: '100%',
                                    padding: '16px 56px 16px 20px',
                                    backgroundColor: 'white',
                                    border: '2px solid #E2E8F0',
                                    borderRadius: '20px',
                                    fontSize: '0.875rem',
                                    fontWeight: '700',
                                    outline: 'none',
                                    transition: 'border-color 0.2s ease',
                                    boxSizing: 'border-box',
                                }}
                                className="focus:border-indigo-500"
                            />
                            <button
                                onClick={() => handleAdd(roleName)}
                                style={{
                                    position: 'absolute', right: '10px', top: '10px',
                                    width: '40px', height: '40px',
                                    backgroundColor: rc.color, color: 'white',
                                    border: 'none', borderRadius: '14px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', boxShadow: `0 4px 12px ${rc.color}40`,
                                }}
                            >
                                <Plus size={20} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // ── Main Render ──────────────────────────────────────────────────────────
    return (
        <div className="p-8 animate-fade-in">
            <Toast toasts={toasts} />

            {/* Page Header */}
            <div className="mb-12">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight m-0">Platform Guidelines</h1>
                <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">
                    Standard Operating Procedures &amp; Quality Standards
                </p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Loading guidelines…</p>
                </div>
            ) : isAdminOrSuper ? (
                // Admin/SuperAdmin: full grouped management view
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                    {roleConfig.map((rc) => renderCard(rc.name, guidelines[rc.name] || []))}
                </div>
            ) : (
                // Other roles: flat list of their own guidelines
                flatList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: '#94A3B8' }}>
                        <BookOpen size={48} style={{ margin: '0 auto 16px', display: 'block', opacity: 0.3 }} />
                        <p style={{ fontSize: '1rem', fontWeight: 700 }}>No guidelines published for your role yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '720px', margin: '0 auto' }}>
                        {flatList.map((item) => {
                            const rc = roleMap[item.role] || roleConfig[0];
                            return (
                                <div key={item._id} style={{
                                    display: 'flex', alignItems: 'center', gap: '16px',
                                    padding: '20px 24px',
                                    backgroundColor: 'white',
                                    borderRadius: '20px',
                                    border: '1px solid #F1F5F9',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: rc.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <CheckCircle2 size={16} strokeWidth={3} />
                                    </div>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#334155', flex: 1, lineHeight: '1.5' }}>
                                        {item.text}
                                    </span>
                                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: rc.color, textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: `${rc.color}15`, padding: '4px 10px', borderRadius: '99px' }}>
                                        {item.role}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )
            )}
        </div>
    );
}

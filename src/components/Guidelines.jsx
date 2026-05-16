import React, { useState } from 'react';
import { Shield, UserCheck, Users, Plus, Trash2, CheckCircle2 } from 'lucide-react';

// Mock initial guidelines data
const initialGuidelines = {
  Admin: [
    { id: 1, text: 'Ensure lab systems are updated before class' },
    { id: 2, text: 'Check attendance logs daily' },
    { id: 3, text: 'Coordinate with trainers for software requirements' }
  ],
  Trainer: [
    { id: 4, text: 'Deliver lesson plan according to schedule' },
    { id: 5, text: 'Assign and review daily tasks' },
    { id: 6, text: 'Provide feedback to students' }
  ],
  'Co-Trainer': [
    { id: 7, text: 'Assist students during practical sessions' },
    { id: 8, text: 'Monitor student progress' },
    { id: 9, text: 'Handle technical queries' }
  ]
};

export default function Guidelines({ userRole }) {
  const [guidelines, setGuidelines] = useState(initialGuidelines);
  const [newTask, setNewTask] = useState({ role: '', text: '' });
  const isSuperAdmin = userRole === 'SuperAdmin';

  const handleAddTask = (role) => {
    if (!newTask.text.trim()) return;
    const newTaskObj = {
      id: Date.now(),
      text: newTask.text.trim()
    };
    setGuidelines({
      ...guidelines,
      [role]: [...guidelines[role], newTaskObj]
    });
    setNewTask({ role: '', text: '' });
  };

  const handleRemoveTask = (role, id) => {
    setGuidelines({
      ...guidelines,
      [role]: guidelines[role].filter(task => task.id !== id)
    });
  };

  const roleConfig = [
    { name: 'Admin', icon: <Shield size={24} />, color: '#4F46E5', bgColor: '#EEF2FF', accent: '#818CF8' },
    { name: 'Trainer', icon: <UserCheck size={24} />, color: '#10B981', bgColor: '#ECFDF5', accent: '#34D399' },
    { name: 'Co-Trainer', icon: <Users size={24} />, color: '#6366F1', bgColor: '#F5F3FF', accent: '#818CF8' }
  ];

  return (
    <div className="p-8 animate-fade-in" style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight m-0">Platform Guidelines</h1>
        <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-xs">Standard Operating Procedures & Quality Standards</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '32px' 
      }}>
        {roleConfig.map((role) => (
          <div key={role.name} style={{ 
            backgroundColor: 'white', 
            borderRadius: '32px', 
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #F1F5F9',
            transition: 'transform 0.3s ease'
          }} className="hover:transform hover:scale-[1.02]">
            
            {/* Header Section */}
            <div style={{ 
              padding: '40px 32px', 
              background: `linear-gradient(135deg, ${role.color} 0%, ${role.accent} 100%)`,
              color: 'white',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ 
                  padding: '16px', 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  borderRadius: '20px', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  display: 'flex'
                }}>
                  {role.icon}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.02em' }}>{role.name}</h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>SOP Management</p>
                </div>
              </div>
            </div>

            {/* List Content */}
            <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {guidelines[role.name].map((task) => (
                  <div key={task.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px', 
                    padding: '16px', 
                    backgroundColor: '#F8FAFC', 
                    borderRadius: '20px',
                    border: '1px solid #F1F5F9',
                    position: 'relative'
                  }} className="group transition-all hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50">
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      backgroundColor: role.color, 
                      color: 'white', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <CheckCircle2 size={14} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#334155', flex: 1, lineHeight: '1.5' }}>
                      {task.text}
                    </span>
                    {isSuperAdmin && (
                      <button 
                        onClick={() => handleRemoveTask(role.name, task.id)}
                        style={{ 
                          backgroundColor: 'transparent', 
                          border: 'none', 
                          color: '#CBD5E1', 
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          transition: 'color 0.2s ease'
                        }}
                        className="hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                
                {guidelines[role.name].length === 0 && (
                  <div style={{ padding: '40px 0', textAlign: 'center' }}>
                    <Users size={40} style={{ color: '#E2E8F0', marginBottom: '12px' }} />
                    <p style={{ margin: 0, color: '#94A3B8', fontWeight: '600', fontSize: '0.875rem' }}>No active guidelines for this role</p>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Controls */}
            {isSuperAdmin && (
              <div style={{ padding: '32px', backgroundColor: '#F9FAFB', borderTop: '1px solid #F1F5F9' }}>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text"
                    placeholder={`New SOP for ${role.name}...`}
                    value={newTask.role === role.name ? newTask.text : ''}
                    onChange={(e) => setNewTask({ role: role.name, text: e.target.value })}
                    style={{ 
                      width: '100%', 
                      padding: '16px 56px 16px 20px', 
                      backgroundColor: 'white', 
                      border: '2px solid #E2E8F0', 
                      borderRadius: '20px', 
                      fontSize: '0.875rem', 
                      fontWeight: '700',
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask(role.name)}
                    className="focus:border-indigo-500"
                  />
                  <button 
                    onClick={() => handleAddTask(role.name)}
                    style={{ 
                      position: 'absolute', 
                      right: '10px', 
                      top: '10px', 
                      width: '40px', 
                      height: '40px', 
                      backgroundColor: role.color, 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '14px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer',
                      boxShadow: `0 4px 12px ${role.color}40`
                    }}
                  >
                    <Plus size={20} strokeWidth={3} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

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
    { name: 'Admin', icon: <Shield size={24} />, color: 'blue' },
    { name: 'Trainer', icon: <UserCheck size={24} />, color: 'emerald' },
    { name: 'Co-Trainer', icon: <Users size={24} />, color: 'indigo' }
  ];

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Platform Guidelines</h1>
        <p className="text-gray-500 mt-2 font-medium">Standard operating procedures and tasks for platform roles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {roleConfig.map((role) => (
          <div key={role.name} className="card overflow-hidden shadow-xl border border-gray-100 flex flex-col h-full bg-white rounded-3xl">
            {/* Header */}
            <div className={`p-6 bg-${role.color}-600 text-white`}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  {role.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{role.name}</h3>
                  <p className="text-sm opacity-80 font-medium">Role Guidelines</p>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="p-6 flex-1 space-y-4">
              {guidelines[role.name].map((task) => (
                <div key={task.id} className="flex items-start justify-between group p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className={`mt-0.5 text-${role.color}-500`} />
                    <span className="text-sm font-semibold text-gray-700 leading-relaxed">{task.text}</span>
                  </div>
                  {isSuperAdmin && (
                    <button 
                      onClick={() => handleRemoveTask(role.name, task.id)}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              {guidelines[role.name].length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm italic">No guidelines defined.</p>
                </div>
              )}
            </div>

            {/* Add Task - Only SuperAdmin */}
            {isSuperAdmin && (
              <div className="p-6 bg-gray-50 border-t border-gray-100 mt-auto">
                <div className="relative">
                  <input 
                    type="text"
                    placeholder={`Add task for ${role.name}...`}
                    value={newTask.role === role.name ? newTask.text : ''}
                    onChange={(e) => setNewTask({ role: role.name, text: e.target.value })}
                    className="w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-medium shadow-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask(role.name)}
                  />
                  <button 
                    onClick={() => handleAddTask(role.name)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all"
                  >
                    <Plus size={18} />
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

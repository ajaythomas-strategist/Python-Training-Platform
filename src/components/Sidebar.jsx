import React from 'react';
import { LayoutDashboard, Users, BookOpen, Star, FlaskConical, ShieldAlert, LogOut, Trophy } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout, userRole, userName }) {
  const allItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={20} />, roles: ['SuperAdmin', 'Admin', 'Trainer', 'Co-Trainer'] },
    { id: 'users', label: 'User Management', icon: <Users size={20} />, superOnly: true },
    { id: 'reports', label: 'User Reports', icon: <Star size={20} />, roles: ['SuperAdmin', 'Admin'] },
    { id: 'classes', label: 'Class', icon: <BookOpen size={20} />, roles: ['SuperAdmin', 'Admin', 'Trainer', 'Co-Trainer'] },
    { id: 'material', label: 'Material', icon: <BookOpen size={20} />, roles: ['SuperAdmin', 'Trainer', 'Co-Trainer', 'Student'] },
    { id: 'labs', label: 'Lab Management', icon: <FlaskConical size={20} />, roles: ['SuperAdmin', 'Admin'] },
    { id: 'guidelines', label: 'Guidelines', icon: <ShieldAlert size={20} />, roles: ['SuperAdmin', 'Admin', 'Trainer', 'Co-Trainer'] },
    { id: 'reviews', label: 'Reviews & Ratings', icon: <Star size={20} />, roles: ['SuperAdmin', 'Admin'] },
    { id: 'attendance', label: 'Attendance', icon: <Users size={20} />, roles: ['Trainer', 'Co-Trainer', 'Student'] },
  ];

  const menuItems = allItems.filter(item => {
    if (item.superOnly) return userRole === 'SuperAdmin';
    if (item.roles) return item.roles.includes(userRole);
    return true;
  });

  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="sidebar-logo flex-col items-start gap-1">
        <div className="flex items-center gap-2">
          <div className="avatar">{userName ? userName.charAt(0) : 'TM'}</div>
          {userName || 'TrainMaster'}
        </div>
        <div className={`badge ${userRole === 'SuperAdmin' ? 'badge-purple' : userRole === 'Admin' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'} flex items-center gap-1 mt-2`} style={{ fontSize: '0.65rem' }}>
          <ShieldAlert size={12} />
          {userRole === 'SuperAdmin' ? 'SUPER ADMIN' : userRole === 'Admin' ? 'ADMIN' : userRole === 'Student' ? 'STUDENT' : 'TRAINER'}
        </div>
      </div>
      <nav className="sidebar-nav mt-4" style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
      <div className="sidebar-footer" style={{ padding: '20px', borderTop: '1px solid #E5E7EB' }}>
        <div 
          className="nav-item" 
          onClick={onLogout}
          style={{ color: '#EF4444', cursor: 'pointer' }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
}

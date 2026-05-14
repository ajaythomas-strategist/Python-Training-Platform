import React from 'react';
import { LayoutDashboard, Users, BookOpen, Star, FlaskConical, ShieldAlert, LogOut } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'users', label: 'User Management', icon: <Users size={20} /> },
    { id: 'reports', label: 'User Reports', icon: <Star size={20} /> },
    { id: 'classes', label: 'Class', icon: <BookOpen size={20} /> },
    { id: 'labs', label: 'Lab Management', icon: <FlaskConical size={20} /> },
    { id: 'reviews', label: 'Reviews & Ratings', icon: <Star size={20} /> },
  ];

  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="sidebar-logo flex-col items-start gap-1">
        <div className="flex items-center gap-2">
          <div className="avatar">TM</div>
          TrainMaster
        </div>
        <div className="badge badge-purple flex items-center gap-1 mt-2" style={{ fontSize: '0.65rem' }}>
          <ShieldAlert size={12} />
          SUPER ADMIN
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

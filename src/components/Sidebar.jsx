import React from 'react';
import { LayoutDashboard, Users, BookOpen, Star, FlaskConical, ShieldAlert } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'users', label: 'User Management', icon: <Users size={20} /> },
    { id: 'reports', label: 'User Reports', icon: <Star size={20} /> },
    { id: 'classes', label: 'Class', icon: <BookOpen size={20} /> },
    { id: 'labs', label: 'Lab Management', icon: <FlaskConical size={20} /> },
    { id: 'reviews', label: 'Reviews & Ratings', icon: <Star size={20} /> },
  ];

  return (
    <aside className="sidebar">
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
      <nav className="sidebar-nav mt-4">
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
    </aside>
  );
}

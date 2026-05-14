import React from 'react';
import { Users, UserCheck, BookOpen, Percent } from 'lucide-react';
import { summaryStats } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', attendance: 95 },
  { name: 'Tue', attendance: 92 },
  { name: 'Wed', attendance: 96 },
  { name: 'Thu', attendance: 90 },
  { name: 'Fri', attendance: 98 },
];

export default function DashboardOverview() {
  return (
    <div className="animate-fade-in">
      <h1>Dashboard Overview</h1>
      
      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="stat-icon blue">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Students</h3>
            <p>{summaryStats.totalStudents}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon purple">
            <UserCheck size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Trainers</h3>
            <p>{summaryStats.totalTrainers}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon cyan">
            <BookOpen size={24} />
          </div>
          <div className="stat-content">
            <h3>Active Classes</h3>
            <p>{summaryStats.activeClasses}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon green">
            <Percent size={24} />
          </div>
          <div className="stat-content">
            <h3>Attendance Rate</h3>
            <p>{summaryStats.attendanceRate}%</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card" style={{ gridColumn: 'span 2', height: '400px' }}>
          <h2>Weekly Attendance Overview</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                cursor={{ fill: '#F9FAFB' }}
              />
              <Bar dataKey="attendance" fill="#818CF8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

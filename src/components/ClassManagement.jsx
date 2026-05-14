import React from 'react';
import { Plus, Users, Calendar, MapPin } from 'lucide-react';
import { classes } from '../data/mockData';

export default function ClassManagement() {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1>Program & Class Management</h1>
        <button className="btn btn-primary">
          <Plus size={18} />
          Create Class
        </button>
      </div>

      <div className="dashboard-grid">
        {classes.map(cls => (
          <div key={cls.id} className="card">
            <div className="flex justify-between items-center mb-4">
              <span className={`badge ${cls.status === 'Active' ? 'badge-green' : 'badge-blue'}`}>
                {cls.status}
              </span>
              <span style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: 600 }}>{cls.id}</span>
            </div>
            
            <h2 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{cls.program}</h2>
            
            <div className="flex flex-col gap-2 mt-4" style={{ fontSize: '0.875rem', color: '#4B5563' }}>
              <div className="flex items-center gap-2">
                <MapPin size={16} color="#8B5CF6" />
                <span>{cls.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} color="#06B6D4" />
                <span>Trainer: {cls.trainer}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} color="#6B7280" />
                <span>Co-Trainer: {cls.coTrainer}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} color="#F59E0B" />
                <span>{cls.schedule}</span>
              </div>
            </div>

            <div className="mt-4 pt-4" style={{ borderTop: '1px solid #E5E7EB', display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline w-full" style={{ justifyContent: 'center' }}>
                Edit Details
              </button>
              <button className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>
                Assign Staff
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

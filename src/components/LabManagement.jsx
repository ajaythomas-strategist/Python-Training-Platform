import React from 'react';
import { Plus, Users, Shield, FlaskConical } from 'lucide-react';
import { labs } from '../data/mockData';

export default function LabManagement() {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1>Lab Management</h1>
        <button className="btn btn-primary">
          <Plus size={18} />
          Create New Lab
        </button>
      </div>

      <div className="dashboard-grid">
        {labs.map(lab => (
          <div key={lab.id} className="card">
            <div className="flex justify-between items-center mb-4">
              <span className={`badge ${
                lab.status === 'Active' ? 'badge-green' : 
                lab.status === 'Available' ? 'badge-blue' : 'badge-purple'
              }`}>
                {lab.status}
              </span>
              <span style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: 600 }}>{lab.id}</span>
            </div>
            
            <h2 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{lab.name}</h2>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>{lab.department} Department</p>
            
            <div className="flex flex-col gap-3" style={{ fontSize: '0.875rem', color: '#4B5563' }}>
              <div className="flex items-center gap-2">
                <Shield size={16} color="#EF4444" />
                <span><strong>Admin:</strong> {lab.assignedAdmin}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} color="#8B5CF6" />
                <span><strong>Trainer:</strong> {lab.assignedTrainer}</span>
              </div>
              <div className="flex items-center gap-2">
                <FlaskConical size={16} color="#06B6D4" />
                <span><strong>Capacity:</strong> {lab.capacity} Students</span>
              </div>
            </div>

            <div className="mt-5 pt-4" style={{ borderTop: '1px solid #E5E7EB', display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline w-full" style={{ justifyContent: 'center' }}>
                Edit Lab
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

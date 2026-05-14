import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, KeyRound, Upload } from 'lucide-react';
import { users } from '../data/mockData';
import BulkUploadModal from './BulkUploadModal';
import UserDetailsModal from './UserDetailsModal';

export default function UserManagement() {
  const [activeRole, setActiveRole] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const roles = ['All', 'Admin', 'Student', 'Trainer', 'Co-Trainer'];

  const filteredUsers = users.filter(user => 
    (activeRole === 'All' || user.role === activeRole) &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
     (user.batch && user.batch.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1>User Management</h1>
        <div className="flex gap-4">
          <button className="btn btn-outline" onClick={() => setIsBulkUploadOpen(true)}>
            <Upload size={18} />
            Bulk Upload
          </button>
          <button className="btn btn-primary">
            <Plus size={18} />
            Add User
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <div className="tabs">
            {roles.map(role => (
              <div 
                key={role} 
                className={`tab ${activeRole === role ? 'active' : ''}`}
                onClick={() => setActiveRole(role)}
              >
                {role}{role !== 'All' ? 's' : ''}
              </div>
            ))}
          </div>
          
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: '#6B7280' }} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '6px',
                border: '1px solid #E5E7EB',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Mail ID / Phone Number</th>
                <th>{activeRole === 'Student' ? 'Batch' : 'Department'}</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div 
                      className="flex items-center gap-2" 
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedUser(user)}
                    >
                      {user.photo ? (
                        <img 
                          src={user.photo} 
                          alt={user.name} 
                          style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                      ) : (
                        <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '12px' }}>
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <span style={{ 
                        fontWeight: 500, 
                        color: 'var(--color-primary)',
                        textDecoration: 'underline',
                        textUnderlineOffset: '2px'
                      }}>
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span style={{ color: '#4B5563', fontSize: '0.875rem' }}>{user.email}</span>
                      <span style={{ color: '#6B7280', fontSize: '0.75rem' }}>{user.phone}</span>
                    </div>
                  </td>
                  <td>{user.role === 'Student' ? user.batch : user.department}</td>
                  <td>
                    <span className={`badge ${
                      user.role === 'Student' ? 'badge-blue' : 
                      user.role === 'Admin' ? 'badge-danger' :
                      user.role === 'Trainer' ? 'badge-purple' : 'badge-green'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-outline" style={{ padding: '4px 8px' }} title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-outline" style={{ padding: '4px 8px' }} title="Password Reset">
                        <KeyRound size={14} color="#F59E0B" />
                      </button>
                      <button className="btn btn-outline" style={{ padding: '4px 8px', color: '#EF4444', borderColor: '#FCA5A5' }} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <BulkUploadModal 
        isOpen={isBulkUploadOpen} 
        onClose={() => setIsBulkUploadOpen(false)} 
        role={activeRole === 'All' ? 'User' : activeRole}
      />

      <UserDetailsModal 
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}

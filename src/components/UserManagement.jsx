import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, KeyRound, Upload, X, Filter, Users, Shield, GraduationCap, Briefcase, UserCheck } from 'lucide-react';
import { users as initialUsers } from '../data/mockData';
import BulkUploadModal from './BulkUploadModal';
import UserDetailsModal from './UserDetailsModal';
import AddUserModal from './AddUserModal';

export default function UserManagement() {
  const [usersList, setUsersList] = useState(initialUsers);
  const [activeRole, setActiveRole] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const roles = [
    { id: 'All', label: 'All Users', icon: <Users size={16} /> },
    { id: 'Admin', label: 'Admins', icon: <Shield size={16} /> },
    { id: 'Student', label: 'Students', icon: <GraduationCap size={16} /> },
    { id: 'Trainer', label: 'Trainers', icon: <Briefcase size={16} /> },
    { id: 'Co-Trainer', label: 'Co-Trainers', icon: <UserCheck size={16} /> }
  ];
  
  const allBatches = Array.from(new Set(usersList.filter(u => u.batch).map(u => u.batch))).sort();
  const allDepts = Array.from(new Set(usersList.filter(u => u.department).map(u => u.department))).sort();

  const filteredUsers = usersList.filter(user => 
    (activeRole === 'All' || user.role === activeRole) &&
    (selectedBatch === 'All' || user.batch === selectedBatch) &&
    (selectedDept === 'All' || user.department === selectedDept) &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
     (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
     (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
     (user.batch && user.batch.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleAddUser = (newUser) => {
    setUsersList([newUser, ...usersList]);
  };

  return (
    <div className="p-8" style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>User Management</h1>
          <p style={{ color: '#6B7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', marginTop: '8px' }}>
            Manage and oversee platform access
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => setIsBulkUploadOpen(true)}
            style={{ 
              padding: '12px 24px', backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '16px',
              display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', fontWeight: '800', 
              color: '#4B5563', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}
          >
            <Upload size={18} /> Bulk Upload
          </button>
          <button 
            onClick={() => setIsAddUserOpen(true)}
            style={{ 
              padding: '12px 28px', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', 
              borderRadius: '16px', border: 'none', display: 'flex', alignItems: 'center', gap: '10px', 
              fontSize: '0.875rem', fontWeight: '900', color: 'white', cursor: 'pointer', 
              transition: 'all 0.2s', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)'
            }}
          >
            <Plus size={18} /> Add New User
          </button>
        </div>
      </div>

      {/* Navigation & Filters Card */}
      <div style={{ 
        backgroundColor: 'white', borderRadius: '32px', border: '1px solid #F1F5F9', 
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', overflow: 'hidden', marginBottom: '32px'
      }}>
        <div style={{ padding: '24px 32px', display: 'flex', gap: '24px', alignItems: 'center', justifyContent: 'space-between', overflowX: 'auto' }}>
          {/* Role Pill Navigation */}
          <div style={{ display: 'flex', gap: '8px', backgroundColor: '#F1F5F9', padding: '6px', borderRadius: '20px' }}>
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => {
                  setActiveRole(role.id);
                  setSelectedBatch('All');
                  setSelectedDept('All');
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '16px',
                  border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '800', transition: 'all 0.2s',
                  backgroundColor: activeRole === role.id ? 'white' : 'transparent',
                  color: activeRole === role.id ? '#4F46E5' : '#64748B',
                  boxShadow: activeRole === role.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                {role.icon}
                {role.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
            {/* Batch/Dept Filters */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {activeRole === 'Student' && (
                <div style={{ position: 'relative' }}>
                  <Filter size={14} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <select 
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    style={{
                      padding: '12px 16px 12px 40px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
                      borderRadius: '16px', fontSize: '0.875rem', fontWeight: '700', color: '#1E293B',
                      outline: 'none', cursor: 'pointer', appearance: 'none', minWidth: '180px'
                    }}
                  >
                    <option value="All">All Batches</option>
                    {allBatches.map(batch => <option key={batch} value={batch}>{batch}</option>)}
                  </select>
                </div>
              )}

              {(activeRole === 'Admin' || activeRole === 'Trainer' || activeRole === 'Co-Trainer') && (
                <div style={{ position: 'relative' }}>
                  <Filter size={14} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <select 
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    style={{
                      padding: '12px 16px 12px 40px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
                      borderRadius: '16px', fontSize: '0.875rem', fontWeight: '700', color: '#1E293B',
                      outline: 'none', cursor: 'pointer', appearance: 'none', minWidth: '180px'
                    }}
                  >
                    <option value="All">All Departments</option>
                    {allDepts.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: activeRole === 'All' ? '320px' : '240px', transition: 'width 0.2s ease-in-out' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input 
                type="text" 
                placeholder={`Search ${activeRole === 'All' ? 'users' : activeRole.toLowerCase() + 's'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '14px 44px 14px 48px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
                  borderRadius: '16px', fontSize: '0.875rem', fontWeight: '600', outline: 'none', transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#4F46E5';
                  e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.05)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = '#F8FAFC';
                  e.target.style.borderColor = '#E2E8F0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                <th style={{ padding: '20px 32px', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B' }}>User Information</th>
                <th style={{ padding: '20px 32px', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B' }}>Contact Details</th>
                <th style={{ padding: '20px 32px', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B' }}>{activeRole === 'Student' ? 'Batch' : 'Department'}</th>
                <th style={{ padding: '20px 32px', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B' }}>Role</th>
                <th style={{ padding: '20px 32px', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id} style={{ 
                  borderBottom: index === filteredUsers.length - 1 ? 'none' : '1px solid #F1F5F9',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer'
                }} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '24px 32px' }} onClick={() => setSelectedUser(user)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ position: 'relative' }}>
                        {user.photo ? (
                          <img src={user.photo} alt={user.name} style={{ width: '48px', height: '48px', borderRadius: '16px', objectFit: 'cover', border: '2px solid white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                        ) : (
                          <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: '900', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div style={{ 
                          position: 'absolute', bottom: '-4px', right: '-4px', width: '14px', height: '14px', 
                          borderRadius: '50%', backgroundColor: '#10B981', border: '2px solid white' 
                        }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#111827' }}>{user.name}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '600', color: '#6B7280' }}>ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '24px 32px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#4F46E5' }}>{user.email}</span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#6B7280' }}>{user.phone}</span>
                    </div>
                  </td>
                  <td style={{ padding: '24px 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '800', color: '#1E293B' }}>{user.role === 'Student' ? user.batch : user.department}</span>
                    </div>
                  </td>
                  <td style={{ padding: '24px 32px' }}>
                    <span style={{
                      padding: '6px 14px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em',
                      backgroundColor: user.role === 'Admin' ? '#FEF2F2' : user.role === 'Student' ? '#EFF6FF' : user.role === 'Trainer' ? '#F5F3FF' : '#F0FDF4',
                      color: user.role === 'Admin' ? '#EF4444' : user.role === 'Student' ? '#3B82F6' : user.role === 'Trainer' ? '#8B5CF6' : '#10B981'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '24px 32px' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button style={{ 
                        padding: '10px', borderRadius: '12px', border: '1px solid #F1F5F9', backgroundColor: 'white',
                        color: '#64748B', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }} title="Edit Profile"
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#4F46E5'; e.currentTarget.style.borderColor = '#4F46E5'; e.currentTarget.style.backgroundColor = '#EEF2FF'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.borderColor = '#F1F5F9'; e.currentTarget.style.backgroundColor = 'white'; }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button style={{ 
                        padding: '10px', borderRadius: '12px', border: '1px solid #F1F5F9', backgroundColor: 'white',
                        color: '#F59E0B', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }} title="Reset Security"
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFFBEB'; e.currentTarget.style.borderColor = '#F59E0B'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#F1F5F9'; }}
                      >
                        <KeyRound size={16} />
                      </button>
                      <button style={{ 
                        padding: '10px', borderRadius: '12px', border: '1px solid #FEE2E2', backgroundColor: 'white',
                        color: '#EF4444', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }} title="Suspend User"
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; e.currentTarget.style.borderColor = '#EF4444'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#FEE2E2'; }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div style={{ padding: '80px', textAlign: 'center' }}>
              <div style={{ marginBottom: '20px', color: '#E2E8F0' }}><Search size={48} style={{ margin: '0 auto' }} /></div>
              <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#1E293B' }}>No users found</p>
              <p style={{ margin: '8px 0 0', color: '#64748B', fontSize: '0.875rem' }}>Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>
      
      <BulkUploadModal 
        isOpen={isBulkUploadOpen} 
        onClose={() => setIsBulkUploadOpen(false)} 
        role={activeRole === 'All' ? 'User' : activeRole}
      />

      <AddUserModal 
        isOpen={isAddUserOpen} 
        onClose={() => setIsAddUserOpen(false)} 
        onAdd={handleAddUser}
      />

      <UserDetailsModal 
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}

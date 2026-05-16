import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, KeyRound, Upload } from 'lucide-react';
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

  const roles = ['All', 'Admin', 'Student', 'Trainer', 'Co-Trainer'];
  
  // Get unique batches and departments
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
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <div className="flex gap-4">
          <button className="btn btn-outline py-2 px-4 flex items-center gap-2" onClick={() => setIsBulkUploadOpen(true)}>
            <Upload size={18} />
            Bulk Upload
          </button>
          <button className="btn btn-primary py-2 px-4 flex items-center gap-2" onClick={() => setIsAddUserOpen(true)}>
            <Plus size={18} />
            Add User
          </button>
        </div>
      </div>

      <div className="card shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 border-b border-gray-100 bg-white min-h-[64px]">
          {/* Tabs - Left Aligned */}
          <div className="flex items-center">
            <div className="tabs flex gap-8">
              {roles.map(role => (
                <div 
                  key={role} 
                  className={`tab pt-5 pb-4 px-1 transition-all text-sm font-bold cursor-pointer relative whitespace-nowrap ${activeRole === role ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  onClick={() => {
                    setActiveRole(role);
                    setSelectedBatch('All');
                    setSelectedDept('All');
                  }}
                >
                  {role}{role !== 'All' ? 's' : ''}
                  {activeRole === role && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Filters & Search - Right Aligned */}
          <div className="flex items-center gap-3 py-3">
            {/* Batch Filter - Only for Students */}
            {activeRole === 'Student' && (
              <select 
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 h-[42px] text-[11px] font-bold text-gray-500 uppercase tracking-wider outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-w-[160px] cursor-pointer"
              >
                <option value="All">All Batches</option>
                {allBatches.map(batch => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            )}

            {/* Department Filter - For Admins, Trainers, Co-Trainers */}
            {(activeRole === 'Admin' || activeRole === 'Trainer' || activeRole === 'Co-Trainer') && (
              <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 h-[42px] text-[11px] font-bold text-gray-500 uppercase tracking-wider outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-w-[160px] cursor-pointer"
              >
                <option value="All">All Departments</option>
                {allDepts.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            )}

            {/* Search Input - Always shown */}
            <div className="relative w-64 h-[42px]">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input 
                type="text" 
                placeholder={`Search ${activeRole === 'All' ? 'users' : activeRole.toLowerCase() + 's'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-full pl-11 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all shadow-none"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
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

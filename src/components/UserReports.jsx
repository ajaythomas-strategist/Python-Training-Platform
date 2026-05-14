import React, { useState } from 'react';
import { Star, MessageSquare, AlertCircle } from 'lucide-react';
import { users } from '../data/mockData';
import MissedSessionsModal from './MissedSessionsModal';
import CommentsModal from './CommentsModal';
import StudentReportModal from './StudentReportModal';
import TrainerReportModal from './TrainerReportModal';

export default function UserReports() {
  const [activeTab, setActiveTab] = useState('Student');
  const [selectedMissedUser, setSelectedMissedUser] = useState(null);
  const [selectedCommentsUser, setSelectedCommentsUser] = useState(null);
  const [selectedDetailedReport, setSelectedDetailedReport] = useState(null);

  const tabs = ['Student', 'Trainer', 'Co-Trainer'];

  const filteredUsers = users.filter(user => user.role === activeTab);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1>User Reports</h1>
      </div>

      <div className="card">
        <div className="tabs mb-6">
          {tabs.map(tab => (
            <div 
              key={tab} 
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}s
            </div>
          ))}
        </div>

        <div className="table-container">
          <table>
            <thead>
              {activeTab === 'Student' ? (
                <tr>
                  <th>Student Name</th>
                  <th>Attendance %</th>
                  <th>Overall Score</th>
                  <th>Comments</th>
                  <th>Actions</th>
                </tr>
              ) : (
                <tr>
                  <th>{activeTab} Name</th>
                  <th>Sessions (Total / Classes / Hours)</th>
                  <th>Missed Sessions</th>
                  <th>Overall Rating</th>
                  <th>Feedback</th>
                  <th>Actions</th>
                </tr>
              )}
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      {user.photo ? (
                        <img 
                          src={user.photo} 
                          alt={user.name} 
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                      ) : (
                        <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <span style={{ fontWeight: 500 }}>{user.name}</span>
                    </div>
                  </td>
                  
                  {activeTab === 'Student' ? (
                    <>
                      <td>
                        <div className="flex items-center gap-2">
                          <span style={{ fontWeight: 600, color: user.attendance < 80 ? '#EF4444' : '#10B981' }}>
                            {user.attendance}%
                          </span>
                          {user.attendance < 80 && <AlertCircle size={14} color="#EF4444" />}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-purple" style={{ fontSize: '0.875rem' }}>{user.score}</span>
                      </td>
                      <td style={{ color: '#4B5563', fontSize: '0.875rem', fontStyle: 'italic', maxWidth: '300px' }}>
                        "{user.comments}"
                      </td>
                      <td>
                        <button className="btn btn-primary" style={{ padding: '4px 12px' }} onClick={() => setSelectedDetailedReport(user)}>
                          Show Report
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <div className="flex flex-col">
                          <span style={{ fontWeight: 500 }}>{user.sessions} Sessions</span>
                          <span style={{ color: '#6B7280', fontSize: '0.75rem' }}>
                            {user.classes} Classes • {user.hours} Hours
                          </span>
                        </div>
                      </td>
                      <td>
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '4px 8px', color: user.missedSessions > 0 ? '#EF4444' : '#10B981', borderColor: user.missedSessions > 0 ? '#FCA5A5' : '#A7F3D0' }}
                          onClick={() => setSelectedMissedUser(user)}
                        >
                          {user.missedSessions} Missed
                        </button>
                      </td>
                      <td>
                        <div className="flex items-center gap-1" style={{ fontWeight: 600, color: '#F59E0B' }}>
                          {user.rating} <Star size={16} fill="#F59E0B" />
                        </div>
                      </td>
                      <td>
                        <button 
                          className="btn btn-outline" 
                          onClick={() => setSelectedCommentsUser(user)}
                          style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                        >
                          <MessageSquare size={16} color="#818CF8" />
                          Show Comments 
                          <span className="badge badge-blue" style={{ marginLeft: '4px', padding: '2px 6px' }}>
                            {user.feedback?.length || 0}
                          </span>
                        </button>
                      </td>
                      <td>
                        <button className="btn btn-primary" style={{ padding: '4px 12px' }} onClick={() => setSelectedDetailedReport(user)}>
                          Show Report
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <MissedSessionsModal 
        user={selectedMissedUser} 
        isOpen={!!selectedMissedUser} 
        onClose={() => setSelectedMissedUser(null)} 
      />
      
      <CommentsModal 
        user={selectedCommentsUser} 
        isOpen={!!selectedCommentsUser} 
        onClose={() => setSelectedCommentsUser(null)} 
      />
      
      <StudentReportModal
        user={activeTab === 'Student' ? selectedDetailedReport : null}
        isOpen={!!selectedDetailedReport && activeTab === 'Student'}
        onClose={() => setSelectedDetailedReport(null)}
      />

      <TrainerReportModal
        user={activeTab !== 'Student' ? selectedDetailedReport : null}
        isOpen={!!selectedDetailedReport && activeTab !== 'Student'}
        onClose={() => setSelectedDetailedReport(null)}
      />
    </div>
  );
}

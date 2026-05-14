import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { reviews } from '../data/mockData';

export default function ReviewSystem() {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1>Review & Rating System</h1>
      </div>

      <div className="dashboard-grid">
        {reviews.map((review, index) => (
          <div key={index} className="card">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>
                  {review.trainerName.replace('Dr. ', '').charAt(0)}
                </div>
                <div>
                  <h2 style={{ marginBottom: '0.25rem' }}>{review.trainerName}</h2>
                  <span className="badge badge-purple">Trainer</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F59E0B' }}>
                  {review.overallScore.toFixed(1)} <Star fill="#F59E0B" color="#F59E0B" size={24} />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Overall Rating</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 style={{ fontSize: '0.875rem', color: '#4B5563', marginBottom: '0.5rem', fontWeight: 600 }}>Score Breakdown</h3>
              
              <div className="mb-3">
                <div className="flex justify-between" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#6B7280' }}>Student Reviews (60% weight)</span>
                  <span style={{ fontWeight: 600 }}>{review.studentScore.toFixed(1)} / 5.0</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar progress-blue" style={{ width: `${(review.studentScore / 5) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#6B7280' }}>Admin Reviews (40% weight)</span>
                  <span style={{ fontWeight: 600 }}>{review.adminScore.toFixed(1)} / 5.0</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar progress-purple" style={{ width: `${(review.adminScore / 5) * 100}%` }}></div>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '0.875rem', color: '#4B5563', marginBottom: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={16} /> Recent Feedback
              </h3>
              <div className="flex flex-col gap-3">
                {review.recentFeedback.map((fb, idx) => (
                  <div key={idx} style={{ padding: '0.75rem', backgroundColor: '#F9FAFB', borderRadius: '0.5rem', border: '1px solid #E5E7EB' }}>
                    <div className="flex justify-between items-center mb-1">
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{fb.student}</span>
                      <div className="flex" style={{ color: '#F59E0B' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < fb.rating ? '#F59E0B' : 'transparent'} />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#4B5563', fontStyle: 'italic' }}>"{fb.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

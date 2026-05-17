import React, { useState } from 'react';
import { Star, MessageSquare, Shield, Users, CheckCircle, ChevronRight, Award, UserCheck } from 'lucide-react';
import { classes, users } from '../data/mockData';

export default function MarkRating({ userRole, userName }) {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedCoTrainer, setSelectedCoTrainer] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Determine who to rate based on role
  const isTrainer = userRole === 'Trainer';
  const isAdmin = userRole === 'SuperAdmin' || userRole === 'Admin';
  const isStudent = userRole === 'Student';

  // Find current student's batch
  const currentUserObj = users.find(u => u.name === userName && u.role === userRole);
  const studentBatchId = currentUserObj?.batch;

  // Filter batches visible to the user
  const visibleClasses = classes.filter(batch => {
    if (isAdmin) return true;
    if (isTrainer) return batch.trainer === userName;
    if (isStudent) return batch.id === studentBatchId;
    return false;
  });

  const handleSelectBatch = (batch) => {
    setSelectedBatch(batch);
    setRating(0);
    setFeedback('');
    setIsSubmitted(false);
    
    // Auto-select first Co-Trainer if user is Trainer
    if (isTrainer && batch.coTrainers?.length > 0) {
      setSelectedCoTrainer(batch.coTrainers[0]);
    } else {
      setSelectedCoTrainer(null);
    }
  };

  const getTargetRole = () => {
    if (isAdmin) return 'Trainer';
    if (isTrainer) return 'Co-Trainer';
    if (isStudent) return selectedCoTrainer ? 'Co-Trainer' : 'Trainer';
    return '';
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    setIsSubmitted(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      setSelectedBatch(null);
      setSelectedCoTrainer(null);
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="p-8" style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>Performance Rating</h1>
        <p style={{ color: '#6B7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', marginTop: '8px' }}>
          {isAdmin ? 'Evaluate Trainer Excellence' : isTrainer ? 'Assess Co-Trainer Support' : 'Share Your Feedback & Rate Your Trainers'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedBatch ? '1fr 400px' : '1fr', gap: '32px', transition: 'all 0.4s ease' }}>
        {/* Batch List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', alignContent: 'start' }}>
          {visibleClasses.map(batch => (
            <div 
              key={batch.id} 
              onClick={() => handleSelectBatch(batch)}
              style={{
                backgroundColor: 'white', borderRadius: '32px', padding: '32px', border: selectedBatch?.id === batch.id ? '2px solid #4F46E5' : '1px solid #F1F5F9',
                boxShadow: selectedBatch?.id === batch.id ? '0 20px 40px -10px rgba(79, 70, 229, 0.15)' : '0 10px 25px -5px rgba(0,0,0,0.03)',
                cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative', overflow: 'hidden'
              }}
            >
              {selectedBatch?.id === batch.id && (
                <div style={{ position: 'absolute', top: 0, right: 0, padding: '12px', backgroundColor: '#4F46E5', color: 'white', borderBottomLeftRadius: '20px' }}>
                  <CheckCircle size={16} />
                </div>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
                  <Award size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', color: '#111827' }}>{batch.name}</h3>
                  <p style={{ margin: 0, color: '#6B7280', fontSize: '0.75rem', fontWeight: '700' }}>Batch ID: {batch.id}</p>
                </div>
              </div>

              <div style={{ padding: '20px', backgroundColor: '#F8FAFC', borderRadius: '24px', border: '1px solid #F1F5F9' }}>
                <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Primary Trainer
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#4F46E5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.75rem' }}>
                    {batch.trainer.charAt(0)}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: '800', color: '#1E293B' }}>{batch.trainer}</span>
                </div>
                
                {batch.coTrainers?.length > 0 && (
                  <>
                    <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.05em', marginBottom: '8px' }}>
                      Co-Trainers
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {batch.coTrainers.map(ct => (
                        <div key={ct} title={ct} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#E0E7FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.65rem', border: '2px solid white' }}>
                          {ct.charAt(0)}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Rating Panel */}
        {selectedBatch && (
          <div style={{
            backgroundColor: 'white', borderRadius: '40px', padding: '48px', border: '1px solid #F1F5F9',
            boxShadow: '0 30px 60px -12px rgba(0,0,0,0.1)', position: 'sticky', top: '24px',
            animation: 'slideInRight 0.5s ease-out', display: 'flex', flexDirection: 'column', gap: '32px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#111827', margin: 0 }}>Mark Performance</h2>
              <p style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: '600', marginTop: '8px' }}>Batch: {selectedBatch.name}</p>
            </div>

            {isTrainer && selectedBatch.coTrainers?.length > 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', color: '#94A3B8' }}>Select Co-Trainer to Rate</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {selectedBatch.coTrainers.map(ct => (
                    <button
                      key={ct}
                      onClick={() => setSelectedCoTrainer(ct)}
                      style={{
                        padding: '12px 16px', borderRadius: '14px', border: 'none',
                        backgroundColor: selectedCoTrainer === ct ? '#4F46E5' : '#F1F5F9',
                        color: selectedCoTrainer === ct ? 'white' : '#475569',
                        fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      {ct}
                    </button>
                  ))}
                </div>
              </div>
            )}



            <div style={{ padding: '24px', backgroundColor: '#F8FAFC', borderRadius: '24px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Evaluating {getTargetRole()}
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#4F46E5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.875rem' }}>
                  {((isAdmin || selectedCoTrainer === null) ? selectedBatch.trainer : selectedCoTrainer)?.charAt(0)}
                </div>
                <span style={{ fontSize: '1.125rem', fontWeight: '900', color: '#1E293B' }}>
                  {(isAdmin || selectedCoTrainer === null) ? selectedBatch.trainer : selectedCoTrainer}
                </span>
              </div>
            </div>

            {isSubmitted ? (
              <div style={{ 
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px',
                animation: 'scaleIn 0.4s ease-out'
              }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)' }}>
                  <CheckCircle size={40} strokeWidth={3} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '1.25rem', fontWeight: '900', color: '#111827', margin: 0 }}>Rating Submitted!</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', marginTop: '4px' }}>Performance data has been updated.</p>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8' }}>Overall Rating</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(rating)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', transition: 'transform 0.2s' }}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.8)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <Star 
                          size={44} 
                          fill={star <= (hover || rating) ? "#F59E0B" : "transparent"} 
                          color={star <= (hover || rating) ? "#F59E0B" : "#E2E8F0"}
                          strokeWidth={star <= (hover || rating) ? 0 : 2}
                          style={{ transition: 'all 0.2s ease' }}
                        />
                      </button>
                    ))}
                  </div>
                  <p style={{ margin: 0, fontSize: '1rem', fontWeight: '900', color: rating > 0 ? '#F59E0B' : '#94A3B8' }}>
                    {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : rating === 5 ? 'Exceptional' : 'Select Rating'}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8' }}>Feedback & Comments</label>
                  <textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Describe specific strengths or areas for improvement..."
                    style={{
                      width: '100%', height: '160px', padding: '20px', borderRadius: '24px', border: '2px solid #F1F5F9',
                      backgroundColor: '#F9FAFB', outline: 'none', fontSize: '0.875rem', fontWeight: '600',
                      transition: 'all 0.2s', resize: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                    onBlur={(e) => e.target.style.borderColor = '#F1F5F9'}
                  />
                </div>

                <button 
                  onClick={handleSubmit}
                  disabled={rating === 0}
                  style={{
                    width: '100%', padding: '20px', backgroundColor: rating === 0 ? '#E2E8F0' : '#4F46E5', color: 'white',
                    border: 'none', borderRadius: '20px', fontWeight: '900', fontSize: '0.875rem', textTransform: 'uppercase',
                    letterSpacing: '0.15em', cursor: rating === 0 ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                    boxShadow: rating === 0 ? 'none' : '0 10px 20px -5px rgba(79, 70, 229, 0.3)'
                  }}
                >
                  Submit Performance Review
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

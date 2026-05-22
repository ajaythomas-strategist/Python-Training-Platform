import React, { useState } from 'react';
import { Star, MessageSquare, Shield, Users, CheckCircle, Award, Lock, AlertTriangle, ChevronDown, X } from 'lucide-react';
import { classes, users } from '../data/mockData';
import { privateCommentsStore, trainerReviewsStore } from '../data/commentsStore';

export default function MarkRating({ userRole, userName }) {
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState('co-trainer'); // 'co-trainer' | 'students'
  
  // Evaluation States (resets on batch selection change)
  const [coTrainerRatings, setCoTrainerRatings] = useState({}); // { [ctName]: rating }
  const [coTrainerFeedbacks, setCoTrainerFeedbacks] = useState({}); // { [ctName]: feedback }
  const [studentRatings, setStudentRatings] = useState({}); // { [studentName]: rating }
  const [studentComments, setStudentComments] = useState({}); // { [studentName]: comment }
  const [trainerRating, setTrainerRating] = useState(0); // For Admin / Student rating Trainer
  const [trainerFeedback, setTrainerFeedback] = useState('');
  
  const [hoverRating, setHoverRating] = useState({ type: null, id: null, val: 0 }); // Tracks hover state for stars
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isTrainer = userRole === 'Trainer';
  const isAdmin = userRole === 'SuperAdmin' || userRole === 'Admin';
  const isStudent = userRole === 'Student';

  const currentUserObj = users.find(u => u.name === userName && u.role === userRole);
  const studentBatchId = currentUserObj?.batch;

  const visibleClasses = classes.filter(batch => {
    if (isAdmin) return true;
    if (isTrainer) return batch.trainer === userName;
    if (isStudent) return batch.id === studentBatchId && batch.feedbackEnabled;
    return false;
  });

  const handleOpenEvaluation = (batch) => {
    setSelectedBatchId(batch.id);
    setActiveModalTab('co-trainer');
    setCoTrainerRatings({});
    setCoTrainerFeedbacks({});
    setStudentRatings({});
    setStudentComments({});
    setTrainerRating(0);
    setTrainerFeedback('');
    setIsSubmitted(false);
  };

  const handleCloseModal = () => {
    setSelectedBatchId(null);
  };

  const getSelectedBatch = () => {
    return classes.find(b => b.id === selectedBatchId);
  };

  const getValidationError = (batch) => {
    if (!batch) return '';
    if (isTrainer) {
      if (batch.coTrainers && batch.coTrainers.length > 0) {
        for (const ct of batch.coTrainers) {
          if (!coTrainerRatings[ct] || coTrainerRatings[ct] === 0) {
            return `Please rate Co-Trainer: ${ct}`;
          }
        }
      }
    } else if (isAdmin || isStudent) {
      if (!trainerRating || trainerRating === 0) {
        return `Please rate Primary Trainer: ${batch.trainer}`;
      }
    }
    return '';
  };

  const handleSubmit = (batch) => {
    const error = getValidationError(batch);
    if (error) return;

    setIsSubmitted(true);

    // Save Co-Trainers reviews (Trainer evaluating Co-Trainer)
    if (isTrainer && batch.coTrainers && batch.coTrainers.length > 0) {
      batch.coTrainers.forEach(ct => {
        const rating = coTrainerRatings[ct] || 0;
        const feedback = coTrainerFeedbacks[ct] || '';
        trainerReviewsStore.push({
          id: Date.now() + Math.random(),
          sessionNo: 1,
          batch: batch.id,
          date: new Date().toISOString().split('T')[0],
          time: 'N/A',
          staffName: ct,
          role: 'Co-Trainer',
          studentName: `${userName} (Trainer)`,
          feedback: feedback.trim() || 'No feedback provided.',
          rating: rating
        });
      });
    }

    // Save Student comments and ratings (Trainer evaluating Student)
    if (isTrainer) {
      const batchStudents = users.filter(u => u.role === 'Student' && u.batch === batch.id);
      batchStudents.forEach(student => {
        const rating = studentRatings[student.name] || null;
        const comment = studentComments[student.name] || '';
        
        if (rating !== null || comment.trim()) {
          privateCommentsStore.push({
            id: Date.now() + Math.random(),
            studentName: student.name,
            batch: batch.id,
            comment: comment.trim() || 'No written comment.',
            rating: rating,
            trainerName: userName,
            date: new Date().toISOString().split('T')[0]
          });
        }
      });
    }

    // Save Admin / Student Trainer review
    if (isAdmin || isStudent) {
      trainerReviewsStore.push({
        id: Date.now() + Math.random(),
        sessionNo: 1,
        batch: batch.id,
        date: new Date().toISOString().split('T')[0],
        time: 'N/A',
        staffName: batch.trainer,
        role: 'Trainer',
        studentName: isStudent ? userName : `${userName} (Admin)`,
        feedback: trainerFeedback.trim() || 'No feedback provided.',
        rating: trainerRating
      });

      // Students can optionally rate Co-Trainers
      if (isStudent && batch.coTrainers) {
        batch.coTrainers.forEach(ct => {
          const rating = coTrainerRatings[ct] || 0;
          const feedback = coTrainerFeedbacks[ct] || '';
          if (rating > 0) {
            trainerReviewsStore.push({
              id: Date.now() + Math.random(),
              sessionNo: 1,
              batch: batch.id,
              date: new Date().toISOString().split('T')[0],
              time: 'N/A',
              staffName: ct,
              role: 'Co-Trainer',
              studentName: userName,
              feedback: feedback.trim() || 'No feedback provided.',
              rating: rating
            });
          }
        });
      }
    }

    // Success delay, close modal
    setTimeout(() => {
      setSelectedBatchId(null);
      setIsSubmitted(false);
    }, 2200);
  };

  const renderStars = ({ ratingValue, onSelect, type, id, compulsory = false }) => {
    const currentHover = hoverRating.type === type && hoverRating.id === id ? hoverRating.val : 0;
    const activeVal = currentHover || ratingValue || 0;
    
    return (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onSelect(star)}
            onMouseEnter={() => setHoverRating({ type, id, val: star })}
            onMouseLeave={() => setHoverRating({ type: null, id: null, val: 0 })}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.85)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Star
              size={24}
              fill={star <= activeVal ? "#F59E0B" : "transparent"}
              color={star <= activeVal ? "#F59E0B" : "#CBD5E1"}
              strokeWidth={star <= activeVal ? 0 : 2}
              style={{ transition: 'all 0.15s ease' }}
            />
          </button>
        ))}
        {compulsory && (ratingValue || 0) === 0 && (
          <span style={{ fontSize: '0.68rem', color: '#EF4444', fontWeight: '800', marginLeft: '6px' }}>* Required</span>
        )}
      </div>
    );
  };

  const activeBatch = getSelectedBatch();
  const validationError = activeBatch ? getValidationError(activeBatch) : '';
  const batchStudents = activeBatch ? users.filter(u => u.role === 'Student' && u.batch === activeBatch.id) : [];

  return (
    <div className="animate-fade-in p-8">
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>Performance Rating</h1>
        <p style={{ color: '#6B7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', marginTop: '8px' }}>
          {isAdmin ? 'Evaluate Trainer Excellence' : isTrainer ? 'Assess Co-Trainer Performance & Add Student Notes' : 'Share Your Feedback & Rate Your Trainers'}
        </p>
        {isTrainer && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '12px', padding: '8px 16px', backgroundColor: '#EDE9FE', borderRadius: '9999px', border: '1px solid #DDD6FE' }}>
            <Lock size={14} color="#7C3AED" />
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#7C3AED' }}>
              Evaluate co-trainers and students in a popup tabbed interface by clicking "Evaluate Batch"
            </span>
          </div>
        )}
      </div>

      {/* Grid of Batch Cards */}
      {visibleClasses.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '60px 40px', backgroundColor: 'white',
          borderRadius: '32px', border: '1px solid #F1F5F9', textAlign: 'center', maxWidth: '500px', margin: '40px auto 0',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)'
        }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5', marginBottom: '24px' }}>
            <Shield size={32} />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', color: '#1E293B' }}>No Batches Available</h3>
          <p style={{ margin: '12px 0 0 0', color: '#6B7280', fontSize: '0.875rem', fontWeight: '600', lineHeight: '1.6' }}>
            {isStudent ? 'Your trainer has not enabled feedback for your batch yet.' : 'No batches assigned to you.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {visibleClasses.map(batch => {
            const cardStudentsCount = users.filter(u => u.role === 'Student' && u.batch === batch.id).length;
            return (
              <div
                key={batch.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '28px',
                  padding: '28px',
                  border: '1px solid #F1F5F9',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Status Badge */}
                <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: batch.status === 'Active' ? '#ECFDF5' : '#F3F4F6',
                    color: batch.status === 'Active' ? '#059669' : '#6B7280',
                    border: batch.status === 'Active' ? '1px solid #A7F3D0' : '1px solid #E5E7EB'
                  }}>
                    {batch.status}
                  </span>
                </div>

                {/* Card Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '16px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
                    <Award size={22} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', color: '#111827' }}>{batch.id}</h3>
                    <p style={{ margin: '2px 0 0', color: '#6B7280', fontSize: '0.75rem', fontWeight: '700' }}>
                      {cardStudentsCount} Students · {batch.coTrainers?.length || 0} Co-Trainer(s)
                    </p>
                  </div>
                </div>

                {/* Trainer Info */}
                <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '20px', border: '1px solid #F1F5F9', marginBottom: '20px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ margin: '0 0 6px', fontSize: '0.62rem', fontWeight: '800', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.05em' }}>Primary Trainer</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#4F46E5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.7rem' }}>
                        {batch.trainer.charAt(0)}
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1E293B' }}>{batch.trainer}</span>
                    </div>
                  </div>

                  {batch.coTrainers?.length > 0 ? (
                    <div>
                      <p style={{ margin: '0 0 6px', fontSize: '0.62rem', fontWeight: '800', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.05em' }}>Co-Trainers</p>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {batch.coTrainers.map(ct => (
                          <div key={ct} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 9px', backgroundColor: '#EDE9FE', borderRadius: '9999px' }}>
                            <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#7C3AED', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.55rem' }}>
                              {ct.charAt(0)}
                            </div>
                            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#5B21B6' }}>{ct}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p style={{ margin: '0 0 6px', fontSize: '0.62rem', fontWeight: '800', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.05em' }}>Co-Trainers</p>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#94A3B8', fontStyle: 'italic' }}>None assigned</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleOpenEvaluation(batch)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    backgroundColor: '#F3F4F6',
                    border: 'none',
                    borderRadius: '16px',
                    color: '#4B5563',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5E7EB';
                    e.currentTarget.style.color = '#1F2937';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                    e.currentTarget.style.color = '#4B5563';
                  }}
                >
                  Evaluate Batch
                  <ChevronDown size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ==================== EVALUATION POPUP MODAL ==================== */}
      {activeBatch && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '32px',
            width: '640px',
            maxWidth: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            animation: 'scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            
            {/* Modal Header */}
            <div style={{ padding: '24px 32px 16px 32px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', color: '#7C3AED', letterSpacing: '0.05em' }}>Batch Performance Review</span>
                <h2 style={{ margin: '4px 0 0 0', fontSize: '1.4rem', fontWeight: '900', color: '#111827' }}>{activeBatch.id}</h2>
              </div>
              <button
                onClick={handleCloseModal}
                style={{
                  background: '#F3F4F6',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#4B5563',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
              >
                <X size={18} />
              </button>
            </div>

            {isSubmitted ? (
              /* Success State overlay */
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '16px', padding: '60px 24px', textAlign: 'center', flex: 1
              }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#10B981',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                  boxShadow: '0 0 30px rgba(16,185,129,0.3)'
                }}>
                  <CheckCircle size={36} strokeWidth={3} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#111827', margin: 0 }}>Review Submitted Successfully!</h3>
                  <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#6B7280', marginTop: '6px' }}>Updating records dashboard...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Modal Tabs (For Trainer Role only - 2 Sections) */}
                {isTrainer && (
                  <div style={{ display: 'flex', borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
                    <button
                      onClick={() => setActiveModalTab('co-trainer')}
                      style={{
                        flex: 1,
                        padding: '16px',
                        border: 'none',
                        borderBottom: activeModalTab === 'co-trainer' ? '3px solid #7C3AED' : '3px solid transparent',
                        backgroundColor: 'transparent',
                        color: activeModalTab === 'co-trainer' ? '#7C3AED' : '#6B7280',
                        fontWeight: '800',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Users size={16} />
                      1. Co-Trainers
                    </button>
                    <button
                      onClick={() => setActiveModalTab('students')}
                      style={{
                        flex: 1,
                        padding: '16px',
                        border: 'none',
                        borderBottom: activeModalTab === 'students' ? '3px solid #7C3AED' : '3px solid transparent',
                        backgroundColor: 'transparent',
                        color: activeModalTab === 'students' ? '#7C3AED' : '#6B7280',
                        fontWeight: '800',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <MessageSquare size={16} />
                      2. Students Comment
                    </button>
                  </div>
                )}

                {/* Modal Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
                  
                  {/* ================== TRAINER FLOW (TABBED) ================== */}
                  {isTrainer && (
                    <>
                      {/* Co-Trainers Tab content */}
                      {activeModalTab === 'co-trainer' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', backgroundColor: '#F5F3FF', borderRadius: '12px', border: '1px solid #DDD6FE' }}>
                            <Lock size={15} color="#7C3AED" />
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#6D28D9' }}>
                              Co-Trainer ratings are compulsory. Written feedback is optional.
                            </span>
                          </div>

                          {activeBatch.coTrainers && activeBatch.coTrainers.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {activeBatch.coTrainers.map(ct => (
                                <div key={ct} style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '18px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.75rem' }}>
                                      {ct.charAt(0)}
                                    </div>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1E293B' }}>{ct}</span>
                                  </div>
                                  
                                  {renderStars({
                                    ratingValue: coTrainerRatings[ct],
                                    onSelect: (val) => setCoTrainerRatings(prev => ({ ...prev, [ct]: val })),
                                    type: 'co-trainer',
                                    id: ct,
                                    compulsory: true
                                  })}

                                  <textarea
                                    value={coTrainerFeedbacks[ct] || ''}
                                    onChange={(e) => setCoTrainerFeedbacks(prev => ({ ...prev, [ct]: e.target.value }))}
                                    placeholder={`Add comments/feedback for co-trainer ${ct} (optional)...`}
                                    style={{
                                      width: '100%', height: '70px', padding: '10px 12px', borderRadius: '10px',
                                      border: '1px solid #E2E8F0', backgroundColor: 'white', fontSize: '0.85rem',
                                      fontWeight: '600', outline: 'none', resize: 'none', boxSizing: 'border-box'
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8' }}>
                              <AlertTriangle size={32} style={{ marginBottom: '8px' }} />
                              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700' }}>No Co-Trainers assigned to this batch.</p>
                            </div>
                          )}
                        </div>
                      )}
                      {/* Students Comments Tab content */}
                      {activeModalTab === 'students' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', backgroundColor: '#ECFDF5', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
                            <MessageSquare size={15} color="#059669" />
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#047857' }}>
                              Student comments are optional. Private comments are hidden from students.
                            </span>
                          </div>

                          {batchStudents.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {batchStudents.map(student => (
                                <div key={student.id} style={{ padding: '16px', backgroundColor: '#FAFAFA', borderRadius: '16px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#E0E7FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.75rem' }}>
                                      {student.name.charAt(0)}
                                    </div>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#374151' }}>{student.name}</span>
                                  </div>

                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Private Feedback / Comments (Optional)</span>
                                    <textarea
                                      value={studentComments[student.name] || ''}
                                      onChange={(e) => setStudentComments(prev => ({ ...prev, [student.name]: e.target.value }))}
                                      placeholder={`Add private notes about ${student.name}...`}
                                      style={{
                                        width: '100%', height: '80px', padding: '10px 12px', borderRadius: '10px',
                                        border: '1px solid #E2E8F0', backgroundColor: 'white', fontSize: '0.85rem',
                                        fontWeight: '600', outline: 'none', resize: 'none', boxSizing: 'border-box'
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8' }}>
                              <Users size={32} style={{ marginBottom: '8px' }} />
                              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700' }}>No students in this batch.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* ================== ADMIN FLOW (SINGLE PANEL) ================== */}
                  {isAdmin && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '18px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: '#4F46E5', letterSpacing: '0.05em' }}>
                          Trainer Performance Evaluation
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#4B5563' }}>
                          Rating is compulsory for Primary Trainer <strong>{activeBatch.trainer}</strong>.
                        </p>
                        
                        {renderStars({
                          ratingValue: trainerRating,
                          onSelect: setTrainerRating,
                          type: 'admin-trainer',
                          id: activeBatch.trainer,
                          compulsory: true
                        })}

                        <textarea
                          value={trainerFeedback}
                          onChange={(e) => setTrainerFeedback(e.target.value)}
                          placeholder={`Add evaluations/feedback for primary trainer ${activeBatch.trainer} (optional)...`}
                          style={{
                            width: '100%', height: '90px', padding: '12px', borderRadius: '10px',
                            border: '1px solid #E2E8F0', backgroundColor: 'white', fontSize: '0.85rem',
                            fontWeight: '600', outline: 'none', resize: 'none', boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* ================== STUDENT FLOW (SINGLE PANEL) ================== */}
                  {isStudent && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* Primary Trainer Review */}
                      <div style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '18px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: '#4F46E5', letterSpacing: '0.05em' }}>
                          Rate Primary Trainer: {activeBatch.trainer}
                        </h4>
                        
                        {renderStars({
                          ratingValue: trainerRating,
                          onSelect: setTrainerRating,
                          type: 'student-trainer',
                          id: activeBatch.trainer,
                          compulsory: true
                        })}

                        <textarea
                          value={trainerFeedback}
                          onChange={(e) => setTrainerFeedback(e.target.value)}
                          placeholder="Give feedback for your primary trainer..."
                          style={{
                            width: '100%', height: '80px', padding: '12px', borderRadius: '10px',
                            border: '1px solid #E2E8F0', backgroundColor: 'white', fontSize: '0.85rem',
                            fontWeight: '600', outline: 'none', resize: 'none', boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      {/* Optional Co-Trainer Review */}
                      {activeBatch.coTrainers && activeBatch.coTrainers.length > 0 && (
                        <div>
                          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: '#4F46E5', letterSpacing: '0.05em' }}>
                            Rate Co-Trainers <span style={{ color: '#94A3B8', fontWeight: '600', textTransform: 'none' }}>(Optional)</span>
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {activeBatch.coTrainers.map(ct => (
                              <div key={ct} style={{ padding: '14px', backgroundColor: '#FAFAFA', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#374151' }}>{ct}</span>
                                
                                {renderStars({
                                  ratingValue: coTrainerRatings[ct],
                                  onSelect: (val) => setCoTrainerRatings(prev => ({ ...prev, [ct]: val })),
                                  type: 'student-co-trainer',
                                  id: ct,
                                  compulsory: false
                                })}

                                <textarea
                                  value={coTrainerFeedbacks[ct] || ''}
                                  onChange={(e) => setCoTrainerFeedbacks(prev => ({ ...prev, [ct]: e.target.value }))}
                                  placeholder={`Comments for co-trainer ${ct} (optional)...`}
                                  style={{
                                    width: '100%', height: '65px', padding: '10px', borderRadius: '10px',
                                    border: '1px solid #E2E8F0', backgroundColor: 'white', fontSize: '0.82rem',
                                    fontWeight: '600', outline: 'none', resize: 'none', boxSizing: 'border-box'
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Modal Footer */}
                <div style={{ padding: '16px 32px 24px 32px', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {validationError && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#FEF2F2', borderRadius: '12px', border: '1px solid #FEE2E2' }}>
                      <AlertTriangle size={15} color="#EF4444" />
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#B91C1C' }}>{validationError}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={handleCloseModal}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#F3F4F6',
                        color: '#4B5563',
                        border: 'none',
                        borderRadius: '14px',
                        fontSize: '0.85rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSubmit(activeBatch)}
                      disabled={!!validationError}
                      style={{
                        padding: '12px 28px',
                        backgroundColor: !!validationError ? '#E5E7EB' : '#7C3AED',
                        color: 'white',
                        border: 'none',
                        borderRadius: '14px',
                        fontSize: '0.85rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: !!validationError ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: !!validationError ? 'none' : '0 8px 16px -4px rgba(124, 58, 237, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        if (!validationError) e.currentTarget.style.backgroundColor = '#6D28D9';
                      }}
                      onMouseLeave={(e) => {
                        if (!validationError) e.currentTarget.style.backgroundColor = '#7C3AED';
                      }}
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

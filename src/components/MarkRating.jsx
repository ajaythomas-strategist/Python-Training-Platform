import React, { useState } from 'react';
import { Star, MessageSquare, Shield, Users, CheckCircle, Award, Lock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { classes, users } from '../data/mockData';
import { privateCommentsStore, trainerReviewsStore } from '../data/commentsStore';

export default function MarkRating({ userRole, userName }) {
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  
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

  const handleToggleBatch = (batch) => {
    if (selectedBatchId === batch.id) {
      setSelectedBatchId(null);
      return;
    }
    
    // Initialize rating/feedback states
    setSelectedBatchId(batch.id);
    setCoTrainerRatings({});
    setCoTrainerFeedbacks({});
    setStudentRatings({});
    setStudentComments({});
    setTrainerRating(0);
    setTrainerFeedback('');
    setIsSubmitted(false);
  };

  const getValidationError = (batch) => {
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

      // Students can optionally rate Co-Trainers if they want
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

    // Success delay, collapse card
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
              Evaluate Co-Trainers and Students directly within the Batch Card below
            </span>
          </div>
        )}
      </div>

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {visibleClasses.map(batch => {
            const isExpanded = selectedBatchId === batch.id;
            const batchStudents = users.filter(u => u.role === 'Student' && u.batch === batch.id);
            const validationError = getValidationError(batch);
            
            return (
              <div
                key={batch.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '28px',
                  padding: '28px',
                  border: isExpanded ? '2px solid #7C3AED' : '1px solid #F1F5F9',
                  boxShadow: isExpanded ? '0 25px 50px -12px rgba(124,58,237,0.18)' : '0 10px 25px -5px rgba(0,0,0,0.03)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
                      {batchStudents.length} Students · {batch.coTrainers?.length || 0} Co-Trainer(s)
                    </p>
                  </div>
                </div>

                {/* Primary Info */}
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

                {/* Action Trigger Button */}
                {!isExpanded ? (
                  <button
                    onClick={() => handleToggleBatch(batch)}
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
                ) : (
                  <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px', marginTop: '20px' }}>
                    {/* Collapsible toggle */}
                    <button
                      onClick={() => handleToggleBatch(batch)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: '#F8FAFC',
                        border: '1px dashed #E2E8F0',
                        borderRadius: '12px',
                        color: '#6B7280',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        marginBottom: '20px'
                      }}
                    >
                      <span>Close Form</span>
                      <ChevronUp size={15} />
                    </button>

                    {isSubmitted ? (
                      /* Success State overlay */
                      <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        gap: '16px', padding: '40px 20px', animation: 'scaleIn 0.3s ease-out', textAlign: 'center'
                      }}>
                        <div style={{
                          width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#10B981',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                          boxShadow: '0 0 25px rgba(16,185,129,0.3)'
                        }}>
                          <CheckCircle size={32} strokeWidth={3} />
                        </div>
                        <div>
                          <p style={{ fontSize: '1.05rem', fontWeight: '900', color: '#111827', margin: 0 }}>Review Submitted Successfully!</p>
                          <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6B7280', marginTop: '4px' }}>Updating records dashboard...</p>
                        </div>
                      </div>
                    ) : (
                      /* Evaluation Form contents */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        {/* ================== TRAINER FLOW ================== */}
                        {isTrainer && (
                          <>
                            {/* Co-Trainers Section */}
                            <div>
                              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#7C3AED', letterSpacing: '0.05em' }}>
                                Co-Trainer Evaluation
                              </h4>
                              {batch.coTrainers && batch.coTrainers.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                  {batch.coTrainers.map(ct => (
                                    <div key={ct} style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.65rem' }}>
                                          {ct.charAt(0)}
                                        </div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1E293B' }}>{ct}</span>
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
                                        placeholder={`Add comments/feedback for ${ct} (optional)...`}
                                        style={{
                                          width: '100%', height: '65px', padding: '10px', borderRadius: '10px',
                                          border: '1px solid #E2E8F0', backgroundColor: 'white', fontSize: '0.8rem',
                                          fontWeight: '600', outline: 'none', resize: 'none', boxSizing: 'border-box'
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontStyle: 'italic' }}>No co-trainers assigned.</span>
                              )}
                            </div>

                            {/* Students Section (Scrollable to prevent giant card heights) */}
                            <div>
                              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#7C3AED', letterSpacing: '0.05em' }}>
                                Student Evaluation <span style={{ color: '#94A3B8', fontWeight: '600', textTransform: 'none' }}>(Optional)</span>
                              </h4>
                              {batchStudents.length > 0 ? (
                                <div style={{
                                  display: 'flex', flexDirection: 'column', gap: '16px',
                                  maxHeight: '300px', overflowY: 'auto', paddingRight: '6px',
                                  border: '1px solid #F1F5F9', padding: '10px', borderRadius: '16px', backgroundColor: '#FAFAFA'
                                }}>
                                  {batchStudents.map(student => (
                                    <div key={student.id} style={{ padding: '12px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#E0E7FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.65rem' }}>
                                          {student.name.charAt(0)}
                                        </div>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#374151' }}>{student.name}</span>
                                      </div>

                                      {renderStars({
                                        ratingValue: studentRatings[student.name],
                                        onSelect: (val) => setStudentRatings(prev => ({ ...prev, [student.name]: val })),
                                        type: 'student',
                                        id: student.name,
                                        compulsory: false
                                      })}

                                      <textarea
                                        value={studentComments[student.name] || ''}
                                        onChange={(e) => setStudentComments(prev => ({ ...prev, [student.name]: e.target.value }))}
                                        placeholder={`Private notes about ${student.name} (optional)...`}
                                        style={{
                                          width: '100%', height: '55px', padding: '8px', borderRadius: '8px',
                                          border: '1px solid #E2E8F0', backgroundColor: 'white', fontSize: '0.78rem',
                                          fontWeight: '600', outline: 'none', resize: 'none', boxSizing: 'border-box'
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontStyle: 'italic' }}>No students in this batch.</span>
                              )}
                            </div>
                          </>
                        )}

                        {/* ================== ADMIN FLOW ================== */}
                        {isAdmin && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <h4 style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#4F46E5', letterSpacing: '0.05em' }}>
                                Trainer Performance Rating
                              </h4>
                              
                              {renderStars({
                                ratingValue: trainerRating,
                                onSelect: setTrainerRating,
                                type: 'admin-trainer',
                                id: batch.trainer,
                                compulsory: true
                              })}

                              <textarea
                                value={trainerFeedback}
                                onChange={(e) => setTrainerFeedback(e.target.value)}
                                placeholder={`Submit feedback for primary trainer ${batch.trainer} (optional)...`}
                                style={{
                                  width: '100%', height: '80px', padding: '10px', borderRadius: '10px',
                                  border: '1px solid #E2E8F0', backgroundColor: 'white', fontSize: '0.82rem',
                                  fontWeight: '600', outline: 'none', resize: 'none', boxSizing: 'border-box'
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* ================== STUDENT FLOW ================== */}
                        {isStudent && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Primary Trainer Review */}
                            <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <h4 style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#4F46E5', letterSpacing: '0.05em' }}>
                                Rate Primary Trainer: {batch.trainer}
                              </h4>
                              
                              {renderStars({
                                ratingValue: trainerRating,
                                onSelect: setTrainerRating,
                                type: 'student-trainer',
                                id: batch.trainer,
                                compulsory: true
                              })}

                              <textarea
                                value={trainerFeedback}
                                onChange={(e) => setTrainerFeedback(e.target.value)}
                                placeholder="Give feedback for your primary trainer..."
                                style={{
                                  width: '100%', height: '70px', padding: '10px', borderRadius: '10px',
                                  border: '1px solid #E2E8F0', backgroundColor: 'white', fontSize: '0.82rem',
                                  fontWeight: '600', outline: 'none', resize: 'none', boxSizing: 'border-box'
                                }}
                              />
                            </div>

                            {/* Optional Co-Trainer Review */}
                            {batch.coTrainers && batch.coTrainers.length > 0 && (
                              <div>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#4F46E5', letterSpacing: '0.05em' }}>
                                  Rate Co-Trainers <span style={{ color: '#94A3B8', fontWeight: '600', textTransform: 'none' }}>(Optional)</span>
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                  {batch.coTrainers.map(ct => (
                                    <div key={ct} style={{ padding: '14px', backgroundColor: '#FAFAFA', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                      <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#374151' }}>{ct}</span>
                                      
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
                                          width: '100%', height: '60px', padding: '8px', borderRadius: '8px',
                                          border: '1px solid #E2E8F0', backgroundColor: 'white', fontSize: '0.78rem',
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

                        {/* Submit Button Section with Inline Alerts */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                          {validationError && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#FEF2F2', borderRadius: '12px', border: '1px solid #FEE2E2' }}>
                              <AlertTriangle size={15} color="#EF4444" />
                              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#B91C1C' }}>{validationError}</span>
                            </div>
                          )}

                          <button
                            onClick={() => handleSubmit(batch)}
                            disabled={!!validationError}
                            style={{
                              width: '100%',
                              padding: '16px',
                              backgroundColor: !!validationError ? '#E5E7EB' : '#7C3AED',
                              color: 'white',
                              border: 'none',
                              borderRadius: '16px',
                              fontWeight: '900',
                              fontSize: '0.85rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.12em',
                              cursor: !!validationError ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s',
                              boxShadow: !!validationError ? 'none' : '0 10px 20px -5px rgba(124, 58, 237, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                              if (!validationError) e.currentTarget.style.backgroundColor = '#6D28D9';
                            }}
                            onMouseLeave={(e) => {
                              if (!validationError) e.currentTarget.style.backgroundColor = '#7C3AED';
                            }}
                          >
                            Submit Performance Review
                          </button>
                        </div>

                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

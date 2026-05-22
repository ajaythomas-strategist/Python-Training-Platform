import React, { useState } from 'react';
import { Star, MessageSquare, Shield, Users, CheckCircle, Award, Lock, AlertTriangle, ChevronDown, ChevronUp, User } from 'lucide-react';
import { classes, users } from '../data/mockData';

// Module-level store so comments survive tab switches
export const privateCommentsStore = [];

export default function MarkRating({ userRole, userName }) {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedCoTrainer, setSelectedCoTrainer] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [studentComments, setStudentComments] = useState({}); // { studentName: comment }
  const [expandedStudents, setExpandedStudents] = useState({}); // { studentName: bool }

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

  const handleSelectBatch = (batch) => {
    setSelectedBatch(batch);
    setRating(0);
    setFeedback('');
    setIsSubmitted(false);
    setStudentComments({});
    setExpandedStudents({});

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

  const getTargetName = () => {
    if (isAdmin || isStudent) return selectedCoTrainer || selectedBatch?.trainer;
    if (isTrainer) return selectedCoTrainer;
    return '';
  };

  // Trainer can only rate co-trainers
  const hasCoTrainers = selectedBatch?.coTrainers?.length > 0;
  const canSubmit = rating > 0 && (!isTrainer || (selectedCoTrainer !== null && hasCoTrainers));

  const batchStudents = selectedBatch
    ? users.filter(u => u.role === 'Student' && u.batch === selectedBatch.id)
    : [];

  const handleSubmit = () => {
    if (!canSubmit) return;

    // Save private comments to the module-level store
    Object.entries(studentComments).forEach(([studentName, comment]) => {
      if (comment.trim()) {
        privateCommentsStore.push({
          id: Date.now() + Math.random(),
          studentName,
          batch: selectedBatch.id,
          comment: comment.trim(),
          trainerName: userName,
          date: new Date().toISOString().split('T')[0],
        });
      }
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setSelectedBatch(null);
      setSelectedCoTrainer(null);
      setIsSubmitted(false);
      setStudentComments({});
      setExpandedStudents({});
    }, 3000);
  };

  const toggleStudentComment = (studentName) => {
    setExpandedStudents(prev => ({ ...prev, [studentName]: !prev[studentName] }));
  };

  return (
    <div className="animate-fade-in p-8">
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>Performance Rating</h1>
        <p style={{ color: '#6B7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', marginTop: '8px' }}>
          {isAdmin ? 'Evaluate Trainer Excellence' : isTrainer ? 'Assess Co-Trainer Performance' : 'Share Your Feedback & Rate Your Trainers'}
        </p>
        {isTrainer && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '12px', padding: '8px 16px', backgroundColor: '#EDE9FE', borderRadius: '9999px', border: '1px solid #DDD6FE' }}>
            <Lock size={14} color="#7C3AED" />
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#7C3AED' }}>You can only rate Co-Trainers in your assigned batches</span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedBatch ? '1fr 420px' : '1fr', gap: '32px', transition: 'all 0.4s ease' }}>
        {/* Batch List */}
        {visibleClasses.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '60px 40px', backgroundColor: 'white',
            borderRadius: '32px', border: '1px solid #F1F5F9', textAlign: 'center', maxWidth: '500px', margin: '40px auto 0',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)'
          }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5', marginBottom: '24px' }}>
              <Shield size={32} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', color: '#1E293B' }}>Feedback Not Enabled</h3>
            <p style={{ margin: '12px 0 0 0', color: '#6B7280', fontSize: '0.875rem', fontWeight: '600', lineHeight: '1.6' }}>
              Your trainer has not enabled student feedback for your batch yet.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', alignContent: 'start' }}>
            {visibleClasses.map(batch => (
              <div
                key={batch.id}
                onClick={() => handleSelectBatch(batch)}
                style={{
                  backgroundColor: 'white', borderRadius: '32px', padding: '32px',
                  border: selectedBatch?.id === batch.id ? '2px solid #4F46E5' : '1px solid #F1F5F9',
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
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', color: '#111827' }}>{batch.id}</h3>
                    <p style={{ margin: 0, color: '#6B7280', fontSize: '0.75rem', fontWeight: '700' }}>
                      {isTrainer ? `${batch.coTrainers?.length || 0} Co-Trainer(s)` : `Trainer: ${batch.trainer}`}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '20px', backgroundColor: '#F8FAFC', borderRadius: '24px', border: '1px solid #F1F5F9' }}>
                  {!isTrainer && (
                    <>
                      <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.05em', marginBottom: '8px' }}>
                        Primary Trainer
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#4F46E5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.75rem' }}>
                          {batch.trainer.charAt(0)}
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: '800', color: '#1E293B' }}>{batch.trainer}</span>
                      </div>
                    </>
                  )}

                  {batch.coTrainers?.length > 0 ? (
                    <>
                      <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.05em', marginBottom: '8px' }}>
                        Co-Trainers {isTrainer && <span style={{ color: '#7C3AED' }}>(Ratable)</span>}
                      </p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {batch.coTrainers.map(ct => (
                          <div key={ct} title={ct} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: isTrainer ? '#EDE9FE' : '#E0E7FF', borderRadius: '9999px', border: isTrainer ? '1px solid #DDD6FE' : '1px solid #C7D2FE' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: isTrainer ? '#7C3AED' : '#4F46E5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.6rem' }}>
                              {ct.charAt(0)}
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: isTrainer ? '#5B21B6' : '#3730A3' }}>{ct}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : isTrainer ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', backgroundColor: '#FEF3C7', borderRadius: '12px', border: '1px solid #FDE68A' }}>
                      <AlertTriangle size={14} color="#D97706" />
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#92400E' }}>No Co-Trainers assigned</span>
                    </div>
                  ) : (
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '600' }}>No Co-Trainers</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rating Panel */}
        {selectedBatch && (
          <div style={{
            backgroundColor: 'white', borderRadius: '40px', padding: '40px 36px', border: '1px solid #F1F5F9',
            boxShadow: '0 30px 60px -12px rgba(0,0,0,0.1)', position: 'sticky', top: '24px',
            animation: 'slideInRight 0.5s ease-out', display: 'flex', flexDirection: 'column', gap: '28px',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#111827', margin: 0 }}>
                {isTrainer ? 'Rate Co-Trainer' : 'Mark Performance'}
              </h2>
              <p style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: '600', marginTop: '8px' }}>Batch: {selectedBatch.id}</p>
            </div>

            {/* Trainer: No co-trainers warning */}
            {isTrainer && !hasCoTrainers && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '32px', backgroundColor: '#FFFBEB', borderRadius: '24px', border: '1px solid #FDE68A', textAlign: 'center' }}>
                <AlertTriangle size={32} color="#D97706" />
                <p style={{ margin: 0, fontWeight: '800', color: '#92400E', fontSize: '0.875rem' }}>No Co-Trainers Assigned</p>
                <p style={{ margin: 0, color: '#B45309', fontSize: '0.8rem', fontWeight: '600', lineHeight: 1.5 }}>
                  This batch has no co-trainers yet. Ratings can only be given to Co-Trainers.
                </p>
              </div>
            )}

            {/* Co-Trainer selector (Trainer only, multiple co-trainers) */}
            {isTrainer && hasCoTrainers && selectedBatch.coTrainers.length > 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.08em' }}>Select Co-Trainer to Rate</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {selectedBatch.coTrainers.map(ct => (
                    <button
                      key={ct}
                      onClick={() => setSelectedCoTrainer(ct)}
                      style={{
                        padding: '10px 16px', borderRadius: '14px', border: selectedCoTrainer === ct ? '2px solid #7C3AED' : '1px solid #E5E7EB',
                        backgroundColor: selectedCoTrainer === ct ? '#7C3AED' : '#F8FAFC',
                        color: selectedCoTrainer === ct ? 'white' : '#475569',
                        fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      {ct}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Evaluating card */}
            {(isAdmin || isStudent || (isTrainer && selectedCoTrainer)) && (
              <div style={{ padding: '20px 24px', backgroundColor: '#F8FAFC', borderRadius: '20px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  Evaluating {getTargetRole()}
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.875rem' }}>
                    {getTargetName()?.charAt(0)}
                  </div>
                  <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1E293B' }}>{getTargetName()}</span>
                </div>
              </div>
            )}

            {isSubmitted ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', animation: 'scaleIn 0.4s ease-out' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)' }}>
                  <CheckCircle size={40} strokeWidth={3} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '1.25rem', fontWeight: '900', color: '#111827', margin: 0 }}>Rating Submitted!</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', marginTop: '4px' }}>Performance data has been recorded.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Only show rating/feedback if there's someone to rate */}
                {(!isTrainer || (isTrainer && selectedCoTrainer && hasCoTrainers)) && (
                  <>
                    {/* Star Rating */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                      <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8' }}>Overall Rating</p>
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

                    {/* Feedback textarea */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8' }}>Feedback & Comments</label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Describe specific strengths or areas for improvement..."
                        style={{
                          width: '100%', height: '120px', padding: '16px', borderRadius: '20px', border: '2px solid #F1F5F9',
                          backgroundColor: '#F9FAFB', outline: 'none', fontSize: '0.875rem', fontWeight: '600',
                          transition: 'all 0.2s', resize: 'none', boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                        onBlur={(e) => e.target.style.borderColor = '#F1F5F9'}
                      />
                    </div>
                  </>
                )}

                {/* Private Student Comments — Trainer only */}
                {isTrainer && batchStudents.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Section header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'linear-gradient(135deg, #EDE9FE 0%, #E0E7FF 100%)', borderRadius: '16px', border: '1px solid #DDD6FE' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                        <MessageSquare size={16} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '900', color: '#4C1D95' }}>Private Student Comments</p>
                        <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '700', color: '#7C3AED', marginTop: '2px' }}>Visible only to Admin & Trainers · Hidden from Students</p>
                      </div>
                      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#7C3AED', borderRadius: '9999px', padding: '3px 10px' }}>
                        <Lock size={10} color="white" />
                        <span style={{ fontSize: '0.6rem', fontWeight: '800', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Private</span>
                      </div>
                    </div>

                    {/* Student list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {batchStudents.map(student => (
                        <div key={student.id} style={{ border: '1px solid #E5E7EB', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#FAFAFA' }}>
                          {/* Student row */}
                          <button
                            onClick={() => toggleStudentComment(student.name)}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', gap: '10px' }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: studentComments[student.name]?.trim() ? '#7C3AED' : '#E5E7EB', color: studentComments[student.name]?.trim() ? 'white' : '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.7rem', flexShrink: 0, transition: 'all 0.2s' }}>
                                {student.name.charAt(0)}
                              </div>
                              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1F2937' }}>{student.name}</span>
                              {studentComments[student.name]?.trim() && (
                                <span style={{ fontSize: '0.6rem', fontWeight: '800', color: '#7C3AED', backgroundColor: '#EDE9FE', borderRadius: '9999px', padding: '2px 8px' }}>✓ Comment added</span>
                              )}
                            </div>
                            <div style={{ color: '#9CA3AF', flexShrink: 0 }}>
                              {expandedStudents[student.name] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          </button>

                          {/* Expandable comment area */}
                          {expandedStudents[student.name] && (
                            <div style={{ padding: '0 14px 14px' }}>
                              <textarea
                                value={studentComments[student.name] || ''}
                                onChange={(e) => setStudentComments(prev => ({ ...prev, [student.name]: e.target.value }))}
                                placeholder={`Add a private comment about ${student.name}...`}
                                style={{
                                  width: '100%', height: '80px', padding: '12px', borderRadius: '12px',
                                  border: '2px solid #DDD6FE', backgroundColor: 'white', outline: 'none',
                                  fontSize: '0.8rem', fontWeight: '600', color: '#374151',
                                  resize: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
                                onBlur={(e) => e.target.style.borderColor = '#DDD6FE'}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit button */}
                {(!isTrainer || (isTrainer && hasCoTrainers && selectedCoTrainer)) && (
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    style={{
                      width: '100%', padding: '20px',
                      backgroundColor: !canSubmit ? '#E2E8F0' : (isTrainer ? '#7C3AED' : '#4F46E5'),
                      color: 'white', border: 'none', borderRadius: '20px', fontWeight: '900',
                      fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                      cursor: !canSubmit ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                      boxShadow: !canSubmit ? 'none' : (isTrainer ? '0 10px 20px -5px rgba(124, 58, 237, 0.35)' : '0 10px 20px -5px rgba(79, 70, 229, 0.3)')
                    }}
                  >
                    Submit Performance Review
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

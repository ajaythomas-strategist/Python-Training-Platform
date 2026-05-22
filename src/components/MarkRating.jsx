import React, { useState } from 'react';
import { Star, MessageSquare, Shield, Users, CheckCircle, Award, Lock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { classes, users } from '../data/mockData';
import { privateCommentsStore } from '../data/commentsStore';

export default function MarkRating({ userRole, userName }) {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedCoTrainer, setSelectedCoTrainer] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [studentComments, setStudentComments] = useState({});
  const [expandedStudents, setExpandedStudents] = useState({});
  const [activeTab, setActiveTab] = useState('co-trainer'); // 'co-trainer' | 'students'

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
    setActiveTab('co-trainer');
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
    if (isAdmin) return selectedBatch?.trainer;
    if (isTrainer) return selectedCoTrainer;
    if (isStudent) return selectedCoTrainer || selectedBatch?.trainer;
    return '';
  };

  const hasCoTrainers = selectedBatch?.coTrainers?.length > 0;
  const canSubmitRating = rating > 0 && (!isTrainer || (selectedCoTrainer !== null && hasCoTrainers));

  const batchStudents = selectedBatch
    ? users.filter(u => u.role === 'Student' && u.batch === selectedBatch.id)
    : [];

  const commentCount = Object.values(studentComments).filter(c => c?.trim()).length;

  const handleSubmitRating = () => {
    if (!canSubmitRating) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setSelectedBatch(null);
      setSelectedCoTrainer(null);
      setIsSubmitted(false);
      setStudentComments({});
      setExpandedStudents({});
      setRating(0);
      setFeedback('');
    }, 3000);
  };

  const handleSaveComments = () => {
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
    setStudentComments({});
    setExpandedStudents({});
  };

  const toggleStudentComment = (studentName) => {
    setExpandedStudents(prev => ({ ...prev, [studentName]: !prev[studentName] }));
  };

  // Tab button style helper
  const tabStyle = (tab) => ({
    flex: 1,
    padding: '12px 8px',
    border: 'none',
    borderBottom: activeTab === tab ? '3px solid #7C3AED' : '3px solid transparent',
    backgroundColor: 'transparent',
    color: activeTab === tab ? '#7C3AED' : '#9CA3AF',
    fontWeight: '800',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  });

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
              Rate Co-Trainers · Add private comments for individual students
            </span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedBatch ? '1fr 440px' : '1fr', gap: '32px', transition: 'all 0.4s ease' }}>

        {/* ── Left: Batch Cards ── */}
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
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', color: '#1E293B' }}>No Batches Available</h3>
            <p style={{ margin: '12px 0 0 0', color: '#6B7280', fontSize: '0.875rem', fontWeight: '600', lineHeight: '1.6' }}>
              {isStudent ? 'Your trainer has not enabled feedback for your batch yet.' : 'No batches assigned to you.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', alignContent: 'start' }}>
            {visibleClasses.map(batch => (
              <div
                key={batch.id}
                onClick={() => handleSelectBatch(batch)}
                style={{
                  backgroundColor: 'white', borderRadius: '28px', padding: '28px',
                  border: selectedBatch?.id === batch.id ? '2px solid #7C3AED' : '1px solid #F1F5F9',
                  boxShadow: selectedBatch?.id === batch.id ? '0 20px 40px -10px rgba(124,58,237,0.15)' : '0 10px 25px -5px rgba(0,0,0,0.03)',
                  cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  position: 'relative', overflow: 'hidden'
                }}
              >
                {selectedBatch?.id === batch.id && (
                  <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px', backgroundColor: '#7C3AED', color: 'white', borderBottomLeftRadius: '18px' }}>
                    <CheckCircle size={15} />
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '16px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
                    <Award size={22} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#111827' }}>{batch.id}</h3>
                    <p style={{ margin: 0, color: '#6B7280', fontSize: '0.72rem', fontWeight: '700' }}>
                      {isTrainer
                        ? `${batch.coTrainers?.length || 0} Co-Trainer(s) · ${users.filter(u => u.role === 'Student' && u.batch === batch.id).length} Students`
                        : `Trainer: ${batch.trainer}`}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '20px', border: '1px solid #F1F5F9' }}>
                  {!isTrainer && (
                    <>
                      <p style={{ margin: '0 0 6px', fontSize: '0.6rem', fontWeight: '800', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.05em' }}>Primary Trainer</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#4F46E5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.7rem' }}>
                          {batch.trainer.charAt(0)}
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1E293B' }}>{batch.trainer}</span>
                      </div>
                    </>
                  )}

                  {batch.coTrainers?.length > 0 ? (
                    <>
                      <p style={{ margin: '0 0 6px', fontSize: '0.6rem', fontWeight: '800', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.05em' }}>
                        Co-Trainers {isTrainer && <span style={{ color: '#7C3AED' }}>(Ratable)</span>}
                      </p>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {batch.coTrainers.map(ct => (
                          <div key={ct} title={ct} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 9px', backgroundColor: isTrainer ? '#EDE9FE' : '#E0E7FF', borderRadius: '9999px' }}>
                            <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: isTrainer ? '#7C3AED' : '#4F46E5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.55rem' }}>
                              {ct.charAt(0)}
                            </div>
                            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: isTrainer ? '#5B21B6' : '#3730A3' }}>{ct}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : isTrainer ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 12px', backgroundColor: '#FEF3C7', borderRadius: '10px' }}>
                      <AlertTriangle size={12} color="#D97706" />
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#92400E' }}>No Co-Trainers assigned</span>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Right: Action Panel ── */}
        {selectedBatch && (
          <div style={{
            backgroundColor: 'white', borderRadius: '36px', border: '1px solid #F1F5F9',
            boxShadow: '0 30px 60px -12px rgba(0,0,0,0.1)', position: 'sticky', top: '24px',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            maxHeight: '90vh'
          }}>

            {/* Panel header */}
            <div style={{ padding: '28px 32px 0', flexShrink: 0 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#111827', margin: '0 0 2px' }}>
                {selectedBatch.id}
              </h2>
              <p style={{ color: '#9CA3AF', fontSize: '0.78rem', fontWeight: '600', margin: 0 }}>
                {isTrainer ? `${selectedBatch.coTrainers?.length || 0} Co-Trainer(s) · ${batchStudents.length} Students` : `Trainer: ${selectedBatch.trainer}`}
              </p>
            </div>

            {/* Tabs — show both tabs only for Trainer */}
            {isTrainer && (
              <div style={{ display: 'flex', padding: '16px 32px 0', borderBottom: '1px solid #F3F4F6', flexShrink: 0, gap: '0' }}>
                <button style={tabStyle('co-trainer')} onClick={() => setActiveTab('co-trainer')}>
                  <Star size={14} />
                  Rate Co-Trainer
                </button>
                <button style={tabStyle('students')} onClick={() => setActiveTab('students')}>
                  <MessageSquare size={14} />
                  Student Comments
                  {commentCount > 0 && (
                    <span style={{ backgroundColor: '#7C3AED', color: 'white', borderRadius: '9999px', padding: '1px 7px', fontSize: '0.65rem', fontWeight: '900' }}>
                      {commentCount}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Scrollable content area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* ═══ TAB: CO-TRAINER RATING ═══ */}
              {(!isTrainer || activeTab === 'co-trainer') && (
                <>
                  {/* No co-trainers warning */}
                  {isTrainer && !hasCoTrainers && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '28px', backgroundColor: '#FFFBEB', borderRadius: '20px', border: '1px solid #FDE68A', textAlign: 'center' }}>
                      <AlertTriangle size={28} color="#D97706" />
                      <p style={{ margin: 0, fontWeight: '800', color: '#92400E', fontSize: '0.875rem' }}>No Co-Trainers Assigned</p>
                      <p style={{ margin: 0, color: '#B45309', fontSize: '0.8rem', fontWeight: '600', lineHeight: 1.5 }}>
                        This batch has no co-trainers. Switch to the Student Comments tab to add notes.
                      </p>
                      <button
                        onClick={() => setActiveTab('students')}
                        style={{ padding: '10px 20px', backgroundColor: '#7C3AED', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Go to Student Comments →
                      </button>
                    </div>
                  )}

                  {/* Co-Trainer selector (multiple co-trainers) */}
                  {isTrainer && hasCoTrainers && selectedBatch.coTrainers.length > 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: '900', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.08em' }}>Select Co-Trainer to Rate</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {selectedBatch.coTrainers.map(ct => (
                          <button
                            key={ct}
                            onClick={() => setSelectedCoTrainer(ct)}
                            style={{
                              padding: '9px 16px', borderRadius: '12px',
                              border: selectedCoTrainer === ct ? '2px solid #7C3AED' : '1px solid #E5E7EB',
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
                  {(isAdmin || isStudent || (isTrainer && selectedCoTrainer && hasCoTrainers)) && (
                    <div style={{ padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '18px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
                      <p style={{ margin: '0 0 8px', fontSize: '0.6rem', fontWeight: '800', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.05em' }}>
                        Evaluating {getTargetRole()}
                      </p>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.85rem' }}>
                          {getTargetName()?.charAt(0)}
                        </div>
                        <span style={{ fontSize: '1rem', fontWeight: '900', color: '#1E293B' }}>{getTargetName()}</span>
                      </div>
                    </div>
                  )}

                  {isSubmitted ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '20px', animation: 'scaleIn 0.4s ease-out' }}>
                      <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}>
                        <CheckCircle size={36} strokeWidth={3} />
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '1.1rem', fontWeight: '900', color: '#111827', margin: 0 }}>Rating Submitted!</p>
                        <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#6B7280', marginTop: '4px' }}>Performance data has been recorded.</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {(!isTrainer || (isTrainer && selectedCoTrainer && hasCoTrainers)) && (
                        <>
                          {/* Stars */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                            <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8' }}>Overall Rating</p>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => setRating(star)}
                                  onMouseEnter={() => setHover(star)}
                                  onMouseLeave={() => setHover(rating)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '3px', transition: 'transform 0.2s' }}
                                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.8)'}
                                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                  <Star
                                    size={42}
                                    fill={star <= (hover || rating) ? "#F59E0B" : "transparent"}
                                    color={star <= (hover || rating) ? "#F59E0B" : "#E2E8F0"}
                                    strokeWidth={star <= (hover || rating) ? 0 : 2}
                                    style={{ transition: 'all 0.2s ease' }}
                                  />
                                </button>
                              ))}
                            </div>
                            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '900', color: rating > 0 ? '#F59E0B' : '#94A3B8' }}>
                              {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : rating === 5 ? 'Exceptional' : 'Select Rating'}
                            </p>
                          </div>

                          {/* Feedback textarea */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.68rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8' }}>
                              Feedback & Comments
                            </label>
                            <textarea
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              placeholder="Describe specific strengths or areas for improvement..."
                              style={{
                                width: '100%', height: '110px', padding: '14px', borderRadius: '18px',
                                border: '2px solid #F1F5F9', backgroundColor: '#F9FAFB', outline: 'none',
                                fontSize: '0.875rem', fontWeight: '600', transition: 'all 0.2s',
                                resize: 'none', boxSizing: 'border-box'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
                              onBlur={(e) => e.target.style.borderColor = '#F1F5F9'}
                            />
                          </div>

                          {/* Submit */}
                          <button
                            onClick={handleSubmitRating}
                            disabled={!canSubmitRating}
                            style={{
                              width: '100%', padding: '18px',
                              backgroundColor: !canSubmitRating ? '#E2E8F0' : (isTrainer ? '#7C3AED' : '#4F46E5'),
                              color: 'white', border: 'none', borderRadius: '18px', fontWeight: '900',
                              fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                              cursor: !canSubmitRating ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                              boxShadow: !canSubmitRating ? 'none' : '0 10px 20px -5px rgba(124,58,237,0.35)'
                            }}
                          >
                            Submit Performance Review
                          </button>
                        </>
                      )}
                    </>
                  )}
                </>
              )}

              {/* ═══ TAB: STUDENT COMMENTS ═══ */}
              {isTrainer && activeTab === 'students' && (
                <>
                  {/* Section info banner */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 18px', background: 'linear-gradient(135deg, #EDE9FE 0%, #E0E7FF 100%)', borderRadius: '18px', border: '1px solid #DDD6FE' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                      <Lock size={18} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: '900', color: '#4C1D95' }}>Private Student Comments</p>
                      <p style={{ margin: '3px 0 0', fontSize: '0.72rem', fontWeight: '600', color: '#6D28D9', lineHeight: 1.4 }}>
                        These comments are <strong>confidential</strong> — visible only to SuperAdmin, Admin & Trainers. Students cannot see these notes.
                      </p>
                    </div>
                  </div>

                  {batchStudents.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '32px', textAlign: 'center' }}>
                      <Users size={32} color="#D1D5DB" />
                      <p style={{ margin: 0, fontWeight: '700', color: '#9CA3AF', fontSize: '0.875rem' }}>No students found in this batch.</p>
                    </div>
                  ) : (
                    <>
                      {/* Student list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {batchStudents.map(student => (
                          <div key={student.id} style={{
                            border: expandedStudents[student.name] ? '2px solid #DDD6FE' : '1px solid #E5E7EB',
                            borderRadius: '18px', overflow: 'hidden', backgroundColor: 'white',
                            boxShadow: expandedStudents[student.name] ? '0 4px 20px rgba(124,58,237,0.08)' : 'none',
                            transition: 'all 0.2s'
                          }}>
                            {/* Student header row */}
                            <button
                              onClick={() => toggleStudentComment(student.name)}
                              style={{
                                width: '100%', display: 'flex', alignItems: 'center',
                                justifyContent: 'space-between', padding: '13px 16px',
                                background: 'none', border: 'none', cursor: 'pointer', gap: '10px'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                  width: '36px', height: '36px', borderRadius: '50%',
                                  backgroundColor: studentComments[student.name]?.trim() ? '#7C3AED' : '#F3F4F6',
                                  color: studentComments[student.name]?.trim() ? 'white' : '#6B7280',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontWeight: '900', fontSize: '0.8rem', flexShrink: 0, transition: 'all 0.25s'
                                }}>
                                  {student.name.charAt(0)}
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                  <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: '800', color: '#1F2937' }}>{student.name}</p>
                                  {studentComments[student.name]?.trim() ? (
                                    <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: '700', color: '#7C3AED' }}>✓ Comment added</p>
                                  ) : (
                                    <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: '600', color: '#9CA3AF' }}>Click to add a private comment</p>
                                  )}
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {studentComments[student.name]?.trim() && (
                                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#7C3AED', flexShrink: 0 }} />
                                )}
                                <div style={{ color: '#9CA3AF', flexShrink: 0 }}>
                                  {expandedStudents[student.name] ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                                </div>
                              </div>
                            </button>

                            {/* Expandable comment textarea */}
                            {expandedStudents[student.name] && (
                              <div style={{ padding: '0 16px 16px' }}>
                                <textarea
                                  value={studentComments[student.name] || ''}
                                  onChange={(e) => setStudentComments(prev => ({ ...prev, [student.name]: e.target.value }))}
                                  placeholder={`Write a private note about ${student.name}... (e.g. attendance concerns, performance, behaviour)`}
                                  style={{
                                    width: '100%', height: '90px', padding: '12px 14px',
                                    borderRadius: '14px', border: '2px solid #EDE9FE',
                                    backgroundColor: '#FAFAFA', outline: 'none',
                                    fontSize: '0.83rem', fontWeight: '600', color: '#374151',
                                    resize: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
                                    lineHeight: 1.5
                                  }}
                                  onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
                                  onBlur={(e) => e.target.style.borderColor = '#EDE9FE'}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Save comments button */}
                      <button
                        onClick={handleSaveComments}
                        disabled={commentCount === 0}
                        style={{
                          width: '100%', padding: '18px',
                          background: commentCount === 0 ? '#E5E7EB' : 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                          color: 'white', border: 'none', borderRadius: '18px', fontWeight: '900',
                          fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.12em',
                          cursor: commentCount === 0 ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                          boxShadow: commentCount === 0 ? 'none' : '0 10px 20px -5px rgba(124,58,237,0.35)'
                        }}
                      >
                        {commentCount === 0 ? 'Add comments to save' : `Save ${commentCount} Comment${commentCount > 1 ? 's' : ''}`}
                      </button>
                    </>
                  )}
                </>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

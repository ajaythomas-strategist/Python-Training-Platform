import React, { useState } from 'react';
import { Star, Filter, Calendar, Users, Search, X, ChevronDown, Lock, MessageSquare } from 'lucide-react';
import { users, classes, adjustDate } from '../data/mockData';
import { privateCommentsStore } from './MarkRating';

export default function ReviewsAndRatings({ userRole, userName }) {
  const [filters, setFilters] = useState({
    batch: '',
    dateFrom: '',
    dateTo: '',
    name: '',
    ratingMin: '',
    ratingMax: ''
  });

  const students = users.filter(u => u.role === 'Student');
  const isTrainerRole = userRole === 'Trainer';

  // Derive all individual reviews from mock data with more dummy entries
  const allReviews = [];

  // Manual dummy data for a rich experience
  const manualData = [
    { id: 'm1', sessionNo: 4, batch: '1 BCA A', date: adjustDate('2026-05-15'), time: '13:00 - 15:00', staffName: 'Dr. Sarah Lee', role: 'Trainer', studentName: 'Alice Johnson', feedback: 'Amazing depth of knowledge in Python.', rating: 5 },
    { id: 'm2', sessionNo: 4, batch: '1 BCA A', date: adjustDate('2026-05-15'), time: '13:00 - 15:00', staffName: 'James Carter', role: 'Co-Trainer', studentName: 'Alice Johnson', feedback: 'Very helpful during the hands-on lab.', rating: 4 },
    { id: 'm3', sessionNo: 1, batch: '1 PERFECT', date: adjustDate('2026-05-15'), time: '08:00 - 10:00', staffName: 'Margaret Hamilton', role: 'Trainer', studentName: 'Zara Ali', feedback: 'Flawless execution of the session.', rating: 5 },
    { id: 'm4', sessionNo: 2, batch: '1 BSC CS', date: adjustDate('2026-05-14'), time: '14:00 - 16:00', staffName: 'Michael Chang', role: 'Trainer', studentName: 'Bob Smith', feedback: 'Good pacing, but complex concepts need more time.', rating: 3 },
    { id: 'm5', sessionNo: 3, batch: '1 BCA A', date: adjustDate('2026-05-11'), time: '10:00 - 12:00', staffName: 'Dr. Sarah Lee', role: 'Trainer', studentName: 'Emily Davis', feedback: 'Excellent session on Data Structures.', rating: 5 },
    { id: 'm6', sessionNo: 1, batch: '1 BBA', date: adjustDate('2026-05-16'), time: '08:00 - 10:00', staffName: 'Dr. Sarah Lee', role: 'Trainer', studentName: 'Emily Davis', feedback: 'Very engaging and interactive.', rating: 4 },
  ];

  allReviews.push(...manualData);

  classes.forEach(cls => {
    cls.sessions.forEach((session, sIdx) => {
      const batchStudents = students.filter(s => s.batch === cls.id);
      batchStudents.forEach(student => {
        const staff = [cls.trainer, ...(cls.coTrainers || [])];
        staff.forEach(staffName => {
          const staffMember = users.find(u => u.name === staffName);
          if (!staffMember) return;
          const hash = (student.id * 1000 + sIdx + new Date(session.date).getTime()) % 100;
          if (hash > 70) { 
            allReviews.push({
              id: `${cls.id}-${session.date}-${student.id}-${staffMember.id}`,
              sessionNo: sIdx + 1,
              batch: cls.id,
              date: session.date,
              time: `${session.startTime} - ${session.endTime}`,
              staffName: staffMember.name,
              role: staffMember.role,
              studentName: student.name,
              feedback: "Consistent and professional delivery.",
              rating: 4 + (hash % 2)
            });
          }
        });
      });
    });
  });

  const baseReviews = isTrainerRole ? allReviews.filter(r => r.staffName === userName) : allReviews;

  const filteredReviews = baseReviews.filter(review => {
    const matchBatch = !filters.batch || review.batch === filters.batch;
    const matchName = isTrainerRole || !filters.name || review.staffName === filters.name;
    const matchRatingMin = !filters.ratingMin || review.rating >= Number(filters.ratingMin);
    const matchRatingMax = !filters.ratingMax || review.rating <= Number(filters.ratingMax);
    
    let matchDate = true;
    if (filters.dateFrom && filters.dateTo) {
      matchDate = review.date >= filters.dateFrom && review.date <= filters.dateTo;
    } else if (filters.dateFrom) {
      matchDate = review.date >= filters.dateFrom;
    } else if (filters.dateTo) {
      matchDate = review.date <= filters.dateTo;
    }

    return matchBatch && matchName && matchRatingMin && matchRatingMax && matchDate;
  });

  const uniqueBatches = [...new Set(classes.map(c => c.id))];
  const uniqueTrainers = [...new Set(allReviews.map(r => r.staffName))].sort();

  // Calculate summary stats
  const trainerRatings = baseReviews.map(r => r.rating);
  const totalReviews = trainerRatings.length;
  const averageRating = totalReviews > 0 ? (trainerRatings.reduce((a, b) => a + b, 0) / totalReviews).toFixed(1) : '0.0';
  const excellenceRatio = totalReviews > 0 ? Math.round((trainerRatings.filter(r => r >= 4).length / totalReviews) * 100) : 0;

  return (
    <div className="animate-fade-in p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 m-0">
            {isTrainerRole ? 'Student Feedback Dashboard' : 'Reviews & Ratings'}
          </h1>
          <p className="text-sm text-gray-500">
            {isTrainerRole ? 'Track anonymous evaluations and session feedback' : 'Student feedback and staff performance tracking'}
          </p>
        </div>
      </div>

      {isTrainerRole && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', padding: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
              <Star size={32} fill="#D97706" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.05em' }}>Average Rating</p>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '1.75rem', fontWeight: '900', color: '#1E293B' }}>{averageRating} <span style={{ fontSize: '1rem', color: '#94A3B8', fontWeight: '600' }}>/ 5.0</span></h3>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', padding: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7' }}>
              <Users size={32} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.05em' }}>Total Reviews</p>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '1.75rem', fontWeight: '900', color: '#1E293B' }}>{totalReviews} <span style={{ fontSize: '1rem', color: '#94A3B8', fontWeight: '600' }}>Reviews</span></h3>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', padding: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <Star size={32} fill="#059669" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.05em' }}>Excellence Score</p>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '1.75rem', fontWeight: '900', color: '#1E293B' }}>{excellenceRatio}% <span style={{ fontSize: '1rem', color: '#94A3B8', fontWeight: '600' }}>4★ & 5★</span></h3>
            </div>
          </div>
        </div>
      )}

      {/* Primary Filters (Unified Single Row Bar - Optimized Spacing) */}
      <div className="card mb-8" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', padding: '1.25rem 2rem', marginBottom: '0.5cm' }}>
        <div className="flex items-center justify-between gap-4">
          {/* Date Range Group */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-600 whitespace-nowrap">From:</span>
              <input 
                type="date"
                className="bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-sm outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/20"
                value={filters.dateFrom}
                onChange={(e) => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-600 whitespace-nowrap">To:</span>
              <input 
                type="date"
                className="bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-sm outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/20"
                value={filters.dateTo}
                onChange={(e) => setFilters(f => ({ ...f, dateTo: e.target.value }))}
              />
            </div>
          </div>

          <div className="w-px h-8 bg-gray-200"></div>

          {/* Batch Selection */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-600 whitespace-nowrap">Batch:</span>
            <select 
              className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/20 transition-all min-w-[120px]"
              value={filters.batch}
              onChange={(e) => setFilters(f => ({ ...f, batch: e.target.value }))}
            >
              <option value="">All Batches</option>
              {uniqueBatches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {!isTrainerRole && (
            <>
              {/* Trainer Selection */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-600 whitespace-nowrap">Trainer:</span>
                <select 
                  className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/20 transition-all min-w-[160px]"
                  value={filters.name}
                  onChange={(e) => setFilters(f => ({ ...f, name: e.target.value }))}
                >
                  <option value="">All Trainers</option>
                  {uniqueTrainers.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="w-px h-8 bg-gray-200"></div>
            </>
          )}

          {/* Rating Filter */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-600 whitespace-nowrap">Rating:</span>
            <div className="flex items-center gap-2">
              <select 
                className="bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-xs outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/20 min-w-[90px]"
                value={filters.ratingMin}
                onChange={(e) => setFilters(f => ({ ...f, ratingMin: e.target.value }))}
              >
                <option value="">Min (≥)</option>
                {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} ★ +</option>)}
              </select>
              <span className="text-gray-300">to</span>
              <select 
                className="bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-xs outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/20 min-w-[90px]"
                value={filters.ratingMax}
                onChange={(e) => setFilters(f => ({ ...f, ratingMax: e.target.value }))}
              >
                <option value="">Max (≤)</option>
                {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} ★ -</option>)}
              </select>
            </div>
          </div>

          <button 
            onClick={() => setFilters({ batch: '', dateFrom: '', dateTo: '', name: '', ratingMin: '', ratingMax: '' })}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Clear All Filters"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="card flex-col" style={{ gap: '1.5rem' }}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 m-0">Feedback Records</h2>
          <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            {filteredReviews.length} Records Found
          </span>
        </div>

        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Batch</th>
                {!isTrainerRole && <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Trainer Name</th>}
                {!isTrainerRole && <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Role</th>}
                {!isTrainerRole && <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Student</th>}
                <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4 w-1/2">Feedback</th>
                <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length > 0 ? filteredReviews.map((rev) => (
                <tr key={rev.id} className="border-t border-gray-50 text-sm hover:bg-gray-50/50 transition-colors">
                  <td className="py-4">
                    <span className="badge badge-blue">{rev.batch}</span>
                  </td>
                  {!isTrainerRole && (
                    <td className="py-4">
                      <span className="font-bold text-gray-800">{rev.staffName}</span>
                    </td>
                  )}
                  {!isTrainerRole && (
                    <td className="py-4">
                      <span className={`text-xs font-bold ${rev.role === 'Trainer' ? 'text-indigo-600' : 'text-purple-600'}`}>
                        {rev.role}
                      </span>
                    </td>
                  )}
                  {!isTrainerRole && (
                    <td className="py-4 text-gray-600 font-medium">
                      {rev.studentName}
                    </td>
                  )}
                  <td className="py-4">
                    <p className="m-0 text-gray-500 leading-relaxed italic">"{rev.feedback}"</p>
                  </td>
                  <td className="py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            className={i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} 
                          />
                        ))}
                      </div>
                      <span className="text-xs font-black text-gray-800">{rev.rating}.0</span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={isTrainerRole ? "3" : "6"} className="py-12 text-center text-gray-400 italic font-medium">
                    No reviews found matching your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Private Student Comments — visible only to SuperAdmin, Admin, Trainer */}
      {(userRole === 'SuperAdmin' || userRole === 'Admin' || userRole === 'Trainer') && (
        <div className="card flex-col" style={{ gap: '1.5rem', marginTop: '1.5rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <MessageSquare size={20} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '800', color: '#111827' }}>Private Student Comments</h2>
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '600', color: '#7C3AED' }}>Submitted by Trainers · Hidden from Students & Co-Trainers</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', backgroundColor: '#EDE9FE', borderRadius: '9999px', border: '1px solid #DDD6FE' }}>
              <Lock size={12} color="#7C3AED" />
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confidential</span>
            </div>
          </div>

          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Student</th>
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Batch</th>
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4 w-1/2">Comment</th>
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Trainer</th>
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {privateCommentsStore.length > 0 ? privateCommentsStore.map((c) => (
                  <tr key={c.id} className="border-t border-gray-50 text-sm hover:bg-purple-50/30 transition-colors">
                    <td className="py-4">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.7rem', flexShrink: 0 }}>
                          {c.studentName.charAt(0)}
                        </div>
                        <span style={{ fontWeight: '700', color: '#1F2937' }}>{c.studentName}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="badge badge-purple">{c.batch}</span>
                    </td>
                    <td className="py-4">
                      <p style={{ margin: 0, color: '#374151', fontWeight: '600', fontSize: '0.875rem', lineHeight: 1.5 }}>{c.comment}</p>
                    </td>
                    <td className="py-4">
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#6B7280' }}>{c.trainerName}</span>
                    </td>
                    <td className="py-4">
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#9CA3AF' }}>{c.date}</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontStyle: 'italic', fontWeight: '600', fontSize: '0.875rem' }}>
                      No private comments submitted yet. Trainers can add comments from the Performance Rating page.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

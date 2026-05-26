import React, { useState, useEffect } from 'react';
import { Star, Users, X, MessageSquare, Lock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { baseUrl } from './utils/api';
import { privateCommentsStore } from '../data/commentsStore';

export default function ReviewsAndRatings({ userRole, userName }) {
  const token = useStore((state) => state.token);
  const user = useStore((state) => state.user);
  
  const [reviews, setReviews] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    batch: '',
    dateFrom: '',
    dateTo: '',
    name: '',
    ratingMin: '',
    ratingMax: ''
  });

  const isTrainerRole = userRole === 'Trainer';
  const isAdminOrSuper = userRole === 'Admin' || userRole === 'SuperAdmin';

  // 1. Fetch data
  useEffect(() => {
    if (!token) return;
    
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // If trainer, fetch only their reviews. Otherwise fetch all (Admins).
        // For Students, we might fetch all if allowed, but usually students only see their trainers. Let's fetch all for simplicity, or we can use the same endpoint.
        const endpoint = isTrainerRole && user?._id 
          ? `/api/reviews/trainer/${user._id}` 
          : '/api/reviews';
          
        const res = await fetch(`${baseUrl}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }

        // Fetch classes for batch filter dropdown
        const classRes = await fetch(`${baseUrl}/api/classes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (classRes.ok) {
          const classData = await classRes.json();
          setClassesList(classData);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [token, isTrainerRole, user]);

  // 2. Filter logic
  const filteredReviews = reviews.filter(review => {
    // review.classId is populated with { _id, batchId }
    // review.trainerId is populated with { _id, name }
    
    const batchName = review.classId?.batchId || 'Unknown Batch';
    const trainerName = review.trainerId?.name || 'Unknown Trainer';
    const reviewDate = new Date(review.createdAt).toISOString().split('T')[0];

    const matchBatch = !filters.batch || batchName === filters.batch;
    const matchName = isTrainerRole || !filters.name || trainerName === filters.name;
    const matchRatingMin = !filters.ratingMin || review.rating >= Number(filters.ratingMin);
    const matchRatingMax = !filters.ratingMax || review.rating <= Number(filters.ratingMax);
    
    let matchDate = true;
    if (filters.dateFrom && filters.dateTo) {
      matchDate = reviewDate >= filters.dateFrom && reviewDate <= filters.dateTo;
    } else if (filters.dateFrom) {
      matchDate = reviewDate >= filters.dateFrom;
    } else if (filters.dateTo) {
      matchDate = reviewDate <= filters.dateTo;
    }

    return matchBatch && matchName && matchRatingMin && matchRatingMax && matchDate;
  });

  // Extract unique batches and trainers for dropdowns
  const uniqueBatches = [...new Set(classesList.map(c => c.batchId))];
  const uniqueTrainers = [...new Set(reviews.map(r => r.trainerId?.name).filter(Boolean))].sort();

  // Summary stats (Trainer specific or Global)
  const ratings = filteredReviews.map(r => r.rating);
  const totalReviews = ratings.length;
  const averageRating = totalReviews > 0 ? (ratings.reduce((a, b) => a + b, 0) / totalReviews).toFixed(1) : '0.0';
  const excellenceRatio = totalReviews > 0 ? Math.round((ratings.filter(r => r >= 4).length / totalReviews) * 100) : 0;

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

      {(isTrainerRole || isAdminOrSuper) && (
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

      {/* Primary Filters */}
      <div className="card mb-8" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', padding: '1.25rem 2rem', marginBottom: '0.5cm' }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-600 whitespace-nowrap">From:</span>
              <input type="date" className="bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-sm outline-none" value={filters.dateFrom} onChange={(e) => setFilters(f => ({ ...f, dateFrom: e.target.value }))} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-600 whitespace-nowrap">To:</span>
              <input type="date" className="bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-sm outline-none" value={filters.dateTo} onChange={(e) => setFilters(f => ({ ...f, dateTo: e.target.value }))} />
            </div>
          </div>

          <div className="w-px h-8 bg-gray-200"></div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-600 whitespace-nowrap">Batch:</span>
            <select className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none min-w-[120px]" value={filters.batch} onChange={(e) => setFilters(f => ({ ...f, batch: e.target.value }))}>
              <option value="">All Batches</option>
              {uniqueBatches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {!isTrainerRole && (
            <>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-600 whitespace-nowrap">Trainer:</span>
                <select className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none min-w-[160px]" value={filters.name} onChange={(e) => setFilters(f => ({ ...f, name: e.target.value }))}>
                  <option value="">All Trainers</option>
                  {uniqueTrainers.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
            </>
          )}

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-600 whitespace-nowrap">Rating:</span>
            <div className="flex items-center gap-2">
              <select className="bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-xs outline-none min-w-[90px]" value={filters.ratingMin} onChange={(e) => setFilters(f => ({ ...f, ratingMin: e.target.value }))}>
                <option value="">Min (≥)</option>
                {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} ★ +</option>)}
              </select>
              <span className="text-gray-300">to</span>
              <select className="bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-xs outline-none min-w-[90px]" value={filters.ratingMax} onChange={(e) => setFilters(f => ({ ...f, ratingMax: e.target.value }))}>
                <option value="">Max (≤)</option>
                {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} ★ -</option>)}
              </select>
            </div>
          </div>

          <button onClick={() => setFilters({ batch: '', dateFrom: '', dateTo: '', name: '', ratingMin: '', ratingMax: '' })} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Clear All Filters"><X size={20} /></button>
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
                <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Date</th>
                <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Batch</th>
                {!isTrainerRole && <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Trainer Name</th>}
                <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Reviewer</th>
                <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4 w-1/2">Feedback</th>
                <th className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Rating</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={isTrainerRole ? "5" : "6"} className="py-12 text-center text-gray-400 italic font-medium">
                    Loading records...
                  </td>
                </tr>
              ) : filteredReviews.length > 0 ? (
                filteredReviews.map((rev) => (
                  <tr key={rev._id} className="border-t border-gray-50 text-sm hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 text-gray-600 font-medium">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <span className="badge badge-blue">{rev.classId?.batchId || 'Unknown'}</span>
                    </td>
                    {!isTrainerRole && (
                      <td className="py-4">
                        <span className="font-bold text-gray-800">{rev.trainerId?.name}</span>
                      </td>
                    )}
                    <td className="py-4">
                      <span className={`text-xs font-bold ${rev.reviewerId?.role === 'Trainer' ? 'text-indigo-600' : 'text-purple-600'}`}>
                        {rev.reviewerId?.name} ({rev.reviewerId?.role})
                      </span>
                    </td>
                    <td className="py-4">
                      <p className="m-0 text-gray-500 leading-relaxed italic">"{rev.comments || 'No written feedback'}"</p>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                          ))}
                        </div>
                        <span className="text-xs font-black text-gray-800">{rev.rating}.0</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isTrainerRole ? "5" : "6"} className="py-12 text-center text-gray-400 italic font-medium">
                    No reviews found matching your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Private Student Comments */}
      {(userRole === 'SuperAdmin' || userRole === 'Admin' || userRole === 'Trainer') && (
        <div className="card flex-col" style={{ gap: '1.5rem', marginTop: '1.5rem' }}>
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
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest pb-4">Rating</th>
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
                      {c.rating ? (
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < c.rating ? '#F59E0B' : 'transparent'} color={i < c.rating ? '#F59E0B' : '#E2E8F0'} strokeWidth={i < c.rating ? 0 : 2} />
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>-</span>
                      )}
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
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontStyle: 'italic', fontWeight: '600', fontSize: '0.875rem' }}>
                      No private comments submitted yet. Trainers can add comments and ratings from the Performance Rating page.
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

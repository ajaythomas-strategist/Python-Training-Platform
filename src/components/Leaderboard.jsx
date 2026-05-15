import React from 'react';
import { Trophy, Star, Medal, Monitor, User, Users } from 'lucide-react';
import { users, classes } from '../data/mockData';

export default function Leaderboard({ userRole, userName }) {
  const trainers = users.filter(u => u.role === 'Trainer');
  const coTrainers = users.filter(u => u.role === 'Co-Trainer');
  const students = users.filter(u => u.role === 'Student');
  
  const isTrainer = userRole === 'Trainer';
  const trainerBatches = isTrainer ? classes.filter(c => c.trainer === userName).map(c => c.id) : [];

  const parseScore = (scoreStr) => parseInt(scoreStr?.replace('%', '') || '0');

  // 1. Top 3 Students Overall
  const topOverallStudents = [...students]
    .sort((a, b) => parseScore(b.score) - parseScore(a.score))
    .slice(0, 3);

  // 2. Top 3 Students in each Batch
  const batchGroups = students.reduce((acc, s) => {
    if (!acc[s.batch]) acc[s.batch] = [];
    acc[s.batch].push(s);
    return acc;
  }, {});

  const topStudentsPerBatch = Object.keys(batchGroups)
    .filter(batchId => isTrainer ? trainerBatches.includes(batchId) : true)
    .map(batchId => {
      const sorted = [...batchGroups[batchId]]
        .sort((a, b) => parseScore(b.score) - parseScore(a.score))
        .slice(0, 3);
      return { batch: batchId, toppers: sorted };
    });

  // 3. Top 3 Trainers & Co-Trainers
  const topTrainers = [...trainers].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
  const topCoTrainers = [...coTrainers].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);

  return (
    <div className="animate-fade-in p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Performance Leaderboard</h1>
        <p className="text-sm text-gray-500">Excellence tracking across all batches</p>
      </div>

      {/* Row 1: Overall Leaders in Lab Card Design */}
      <div className="dashboard-grid mb-10" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.5rem' }}>
        {/* Top 3 Students Overall */}
        <div className="card flex-col" style={{ gap: '1rem', minHeight: '380px', border: '1px solid #E5E7EB' }}>
          <div className="flex justify-between items-start mb-[-8px]">
            <span className="badge" style={{ backgroundColor: '#10B981', color: 'white', fontWeight: 700, fontSize: '0.75rem', padding: '4px 12px' }}>TOP RANKED</span>
            <div className="p-2 bg-green-50 rounded-lg border border-green-100">
              <Trophy size={20} className="text-green-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Top 3 Students</h2>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Overall Academic Excellence
            </div>
          </div>
          <div className="flex flex-col gap-4 py-5 border-y border-gray-100" style={{ fontSize: '0.875rem' }}>
            {topOverallStudents.map((s, idx) => (
              <div key={s.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-600">
                  <User size={18} className="text-gray-400" />
                  <span className="font-medium text-gray-700">{idx + 1}. {s.name}</span>
                </div>
                <span className="font-bold text-indigo-600">{s.score}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <button className="btn btn-outline w-full justify-center py-3 text-sm font-bold">View All Rankings</button>
          </div>
        </div>

        {/* Top 3 Trainers */}
        <div className="card flex-col" style={{ gap: '1rem', minHeight: '380px', border: '1px solid #E5E7EB' }}>
          <div className="flex justify-between items-start mb-[-8px]">
            <span className="badge" style={{ backgroundColor: '#6366F1', color: 'white', fontWeight: 700, fontSize: '0.75rem', padding: '4px 12px' }}>TOP RATED</span>
            <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
              <Star size={20} className="text-indigo-600 fill-indigo-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Top 3 Trainers</h2>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              Teaching Performance
            </div>
          </div>
          <div className="flex flex-col gap-4 py-5 border-y border-gray-100" style={{ fontSize: '0.875rem' }}>
            {topTrainers.map((t, idx) => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-600">
                  <Users size={18} className="text-gray-400" />
                  <span className="font-medium text-gray-700">{idx + 1}. {t.name}</span>
                </div>
                <span className="font-bold text-gray-800">{t.rating} ★</span>
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <button className="btn btn-outline w-full justify-center py-3 text-sm font-bold">View Feedback</button>
          </div>
        </div>

        {/* Top 3 Co-Trainers */}
        <div className="card flex-col" style={{ gap: '1rem', minHeight: '380px', border: '1px solid #E5E7EB' }}>
          <div className="flex justify-between items-start mb-[-8px]">
            <span className="badge" style={{ backgroundColor: '#3B82F6', color: 'white', fontWeight: 700, fontSize: '0.75rem', padding: '4px 12px' }}>SUPPORT STARS</span>
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
              <Medal size={20} className="text-blue-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Top 3 Co-Trainers</h2>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              Support Performance
            </div>
          </div>
          <div className="flex flex-col gap-4 py-5 border-y border-gray-100" style={{ fontSize: '0.875rem' }}>
            {topCoTrainers.map((t, idx) => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-600">
                  <Users size={18} className="text-gray-400" />
                  <span className="font-medium text-gray-700">{idx + 1}. {t.name}</span>
                </div>
                <span className="font-bold text-gray-800">{t.rating} ★</span>
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <button className="btn btn-outline w-full justify-center py-3 text-sm font-bold">View Feedback</button>
          </div>
        </div>
      </div>

      {/* Row 2+ onwards: Batch Wise Toppers in Lab Card Design */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.5rem' }}>
        {topStudentsPerBatch.map(({ batch, toppers }) => (
          <div key={batch} className="card flex-col" style={{ gap: '1rem', minHeight: '380px', border: '1px solid #E5E7EB' }}>
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold text-gray-800 m-0">{batch} Toppers</h2>
              <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                <Monitor size={20} className="text-gray-400" />
              </div>
            </div>
            
            <div className="text-sm text-gray-500 flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              Top 3 Students in Batch
            </div>
            
            <div className="flex flex-col gap-4 py-5 border-y border-gray-100" style={{ fontSize: '0.875rem' }}>
              {toppers.map((s, idx) => (
                <div key={s.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-600">
                    <User size={18} className={idx === 0 ? 'text-indigo-500' : 'text-gray-300'} />
                    <span className={`font-medium ${idx === 0 ? 'text-gray-800 font-bold' : 'text-gray-600'}`}>{idx + 1}. {s.name}</span>
                  </div>
                  <span className={`font-bold ${idx === 0 ? 'text-indigo-600' : 'text-gray-500'}`}>{s.score}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              <button className="btn btn-outline w-full justify-center py-3 text-sm font-bold">View Batch Report</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

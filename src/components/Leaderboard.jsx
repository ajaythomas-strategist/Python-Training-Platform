import { Trophy, Star, Medal, Crown } from 'lucide-react';
import { users, classes } from '../data/mockData';

function LeaderboardCard({ title, subtitle, badgeText, badgeBg, icon: Icon, iconColor, hoverBorderColor, radialBg, items, isRating }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      padding: '28px',
      borderRadius: '24px',
      backgroundColor: 'white',
      border: '1px solid #F1F5F9',
      boxShadow: '0 10px 30px -5px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.01)',
      transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      zIndex: 1
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.08)';
      e.currentTarget.style.borderColor = hoverBorderColor;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 10px 30px -5px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.01)';
      e.currentTarget.style.borderColor = '#F1F5F9';
    }}
    >
      {/* Decorative Radial glow in card corner */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        background: radialBg,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Header section with Badge and Icon */}
      {(badgeText || Icon) && (
        <div className="flex justify-between items-start" style={{ marginBottom: '-4px', zIndex: 10 }}>
          {badgeText ? (
            <span style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: badgeBg, 
              color: 'white', 
              fontWeight: '800', 
              fontSize: '0.72rem', 
              padding: '6px 14px', 
              borderRadius: '20px',
              letterSpacing: '0.06em',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              lineHeight: '1'
            }}>
              {badgeText}
            </span>
          ) : <div />}
          {Icon && (
            <div style={{ 
              padding: '10px', 
              borderRadius: '16px', 
              backgroundColor: hoverBorderColor + '0A', // Ultra-faint tinted background
              border: `1px solid ${hoverBorderColor}20`,
              color: iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icon size={20} />
            </div>
          )}
        </div>
      )}

      {/* Title & Subtitle */}
      <div style={{ zIndex: 10 }}>
        <h2 className="text-xl font-bold text-gray-800 mb-1.5" style={{ fontSize: '1.2rem', letterSpacing: '-0.01em', margin: '0 0 6px 0' }}>{title}</h2>
        <div className="text-xs text-gray-500 font-semibold flex items-center gap-2">
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: iconColor }}></div>
          {subtitle}
        </div>
      </div>

      {/* Rank list */}
      <div className="flex flex-col gap-3.5 py-4" style={{ borderTop: '1px solid #F1F5F9', zIndex: 10 }}>
        {items.map((item, idx) => {
          const rawValue = isRating 
            ? (parseFloat(item.rating || '0') / 5) * 100 
            : parseInt(item.score?.replace('%', '') || '0');

          return (
            <div key={item.id || idx} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 14px',
              borderRadius: '16px',
              background: idx === 0 
                ? 'linear-gradient(90deg, rgba(251, 191, 36, 0.06) 0%, rgba(245, 158, 11, 0.02) 100%)' 
                : idx === 1
                  ? 'linear-gradient(90deg, rgba(148, 163, 184, 0.06) 0%, rgba(148, 163, 184, 0.02) 100%)'
                  : 'linear-gradient(90deg, rgba(217, 119, 6, 0.06) 0%, rgba(217, 119, 6, 0.02) 100%)',
              border: idx === 0 
                ? '1px solid rgba(251, 191, 36, 0.25)' 
                : idx === 1
                  ? '1px solid rgba(148, 163, 184, 0.2)'
                  : '1px solid rgba(217, 119, 6, 0.2)',
              boxShadow: idx === 0 ? '0 4px 12px rgba(251, 191, 36, 0.03)' : 'none',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            >
              {/* Rank Circle or Crown */}
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
                fontWeight: '800',
                fontSize: '0.8rem',
                color: 'white',
                background: idx === 0 
                  ? 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)' // Gold
                  : idx === 1 
                    ? 'linear-gradient(135deg, #E2E8F0 0%, #94A3B8 100%)' // Silver
                    : 'linear-gradient(135deg, #FDBA74 0%, #D97706 100%)', // Bronze
                flexShrink: 0
              }}>
                {idx === 0 ? <Crown size={12} style={{ color: 'white' }} /> : idx + 1}
              </div>

              {/* User details container */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ 
                    fontWeight: idx === 0 ? '700' : '600', 
                    color: idx === 0 ? '#1E293B' : '#475569', 
                    fontSize: '0.85rem' 
                  }}>
                    {item.name}
                  </div>
                  
                  {/* Value displaying Score or Rating (same row as name) */}
                  <div style={{ 
                    fontWeight: '800', 
                    color: idx === 0 ? '#B45309' : '#334155', 
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}>
                    {isRating ? (
                      <>
                        <span>{item.rating}</span>
                        <Star size={12} className="text-amber-500" />
                      </>
                    ) : (
                      <span>{item.score}</span>
                    )}
                  </div>
                </div>

                {/* Horizontal Progress */}
                <div style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${rawValue}%`, 
                    height: '100%', 
                    borderRadius: '2px',
                    background: idx === 0 
                      ? 'linear-gradient(90deg, #FCD34D 0%, #F59E0B 100%)' 
                      : idx === 1 
                        ? 'linear-gradient(90deg, #CBD5E1 0%, #94A3B8 100%)' 
                        : 'linear-gradient(90deg, #FDBA74 0%, #D97706 100%)'
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Leaderboard({ userRole, userName }) {
  const trainers = users.filter(u => u.role === 'Trainer');
  const coTrainers = users.filter(u => u.role === 'Co-Trainer');
  const students = users.filter(u => u.role === 'Student');
  
  const isTrainer = userRole === 'Trainer' || userRole === 'Co-Trainer';
  const trainerBatches = isTrainer ? classes.filter(c => c.trainer === userName || c.coTrainers?.includes(userName)).map(c => c.id) : [];

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
        <p className="text-sm text-gray-500 font-medium">Excellence tracking across all batches</p>
      </div>

      {/* Row 1: Overall Leaders in Premium Card Design */}
      <div className="dashboard-grid mb-10" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.5rem' }}>
        {/* Top 3 Students Overall */}
        <LeaderboardCard 
          title="Top 3 Students" 
          subtitle="Overall Academic Excellence"
          badgeText="TOP RANKED"
          badgeBg="linear-gradient(135deg, #10B981 0%, #059669 100%)"
          icon={Trophy}
          iconColor="#10B981"
          hoverBorderColor="#10B981"
          radialBg="radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)"
          items={topOverallStudents}
          isRating={false}
        />

        {/* Top 3 Trainers */}
        <LeaderboardCard 
          title="Top 3 Trainers" 
          subtitle="Teaching Performance"
          badgeText="TOP RATED"
          badgeBg="linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)"
          icon={Star}
          iconColor="#6366F1"
          hoverBorderColor="#6366F1"
          radialBg="radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)"
          items={topTrainers}
          isRating={true}
        />

        {/* Top 3 Co-Trainers */}
        <LeaderboardCard 
          title="Top 3 Co-Trainers" 
          subtitle="Support Performance"
          badgeText="SUPPORT STARS"
          badgeBg="linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)"
          icon={Medal}
          iconColor="#3B82F6"
          hoverBorderColor="#3B82F6"
          radialBg="radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)"
          items={topCoTrainers}
          isRating={true}
        />
      </div>

      {/* Row 2+ onwards: Batch Wise Toppers in Premium Card Design */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.5rem' }}>
        {topStudentsPerBatch.map(({ batch, toppers }) => (
          <LeaderboardCard 
            key={batch}
            title={`${batch} Toppers`}
            subtitle="Top 3 Students in Batch"
            badgeText={null}
            badgeBg={null}
            icon={null}
            iconColor="#8B5CF6"
            hoverBorderColor="#8B5CF6"
            radialBg="radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)"
            items={toppers}
            isRating={false}
          />
        ))}
      </div>
    </div>
  );
}

import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const DashboardOverview = lazy(() => import('./components/DashboardOverview'));
const UserManagement = lazy(() => import('./components/UserManagement'));
const LabManagement = lazy(() => import('./components/LabManagement'));
const ClassManagement = lazy(() => import('./components/ClassManagement'));
const Materials = lazy(() => import('./components/Materials'));
const ReviewsAndRatings = lazy(() => import('./components/ReviewsAndRatings'));
const UserReports = lazy(() => import('./components/UserReports'));
const Leaderboard = lazy(() => import('./components/Leaderboard'));
const AttendanceTab = lazy(() => import('./components/AttendanceTab'));
const Guidelines = lazy(() => import('./components/Guidelines'));
const MarkRating = lazy(() => import('./components/MarkRating'));

// A sleek loading fallback for lazily loaded chunks
const LoadingFallback = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '80vh', gap: '16px' }}>
    <div style={{ width: '40px', height: '40px', border: '3px solid rgba(16, 185, 129, 0.2)', borderTopColor: '#10B981', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Loading Module...</span>
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

// Centralised route configuration
export const appRoutes = [
  { path: '/', component: DashboardOverview, label: 'Dashboard' },
  { path: '/users', component: UserManagement, label: 'User Management' },
  { path: '/labs', component: LabManagement, label: 'Lab Management' },
  { path: '/classes', component: ClassManagement, label: 'Class Management' },
  { path: '/material', component: Materials, label: 'Materials' },
  { path: '/reviews', component: ReviewsAndRatings, label: 'Reviews & Ratings' },
  { path: '/reports', component: UserReports, label: 'User Reports' },
  { path: '/leaderboard', component: Leaderboard, label: 'Leaderboard' },
  { path: '/attendance', component: AttendanceTab, label: 'Attendance' },
  { path: '/guidelines', component: Guidelines, label: 'Guidelines' },
  { path: '/mark-rating', component: MarkRating, label: 'Mark Rating' },
];

// Helper component to render all routes wrapped in Suspense for code splitting
export default function AppRoutes({ userRole, userName }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {appRoutes.map((r) => (
          <Route
            key={r.path}
            path={r.path}
            element={<r.component userRole={userRole} userName={userName} />}
          />
        ))}
        {/* Fallback to dashboard for unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import UserManagement from './components/UserManagement';
import LabManagement from './components/LabManagement';
import ClassManagement from './components/ClassManagement';
import UserReports from './components/UserReports';
import ReviewsAndRatings from './components/ReviewsAndRatings';
import Leaderboard from './components/Leaderboard';
import Materials from './components/Materials';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'SuperAdmin' or 'Admin'
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <Login onLogin={(role) => {
      setIsAuthenticated(true);
      setUserRole(role);
    }} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview userRole={userRole} />;
      case 'users': return <UserManagement userRole={userRole} />;
      case 'labs': return <LabManagement userRole={userRole} />;
      case 'classes': return <ClassManagement userRole={userRole} />;
      case 'material': return <Materials userRole={userRole} />;
      case 'reviews': return <ReviewsAndRatings userRole={userRole} />;
      case 'reports': return <UserReports userRole={userRole} />;
      case 'leaderboard': return <Leaderboard userRole={userRole} />;
      default: return <DashboardOverview userRole={userRole} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setIsAuthenticated(false)} userRole={userRole} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;

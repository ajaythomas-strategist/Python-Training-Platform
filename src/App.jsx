import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import UserManagement from './components/UserManagement';
import LabManagement from './components/LabManagement';
import ClassManagement from './components/ClassManagement';
import UserReports from './components/UserReports';
import ReviewSystem from './components/ReviewSystem';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview />;
      case 'users': return <UserManagement />;
      case 'labs': return <LabManagement />;
      case 'classes': return <ClassManagement />;
      case 'reviews': return <ReviewSystem />;
      case 'reports': return <UserReports />;
      case 'leaderboard': return <Leaderboard />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setIsAuthenticated(false)} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;

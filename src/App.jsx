import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import UserManagement from './components/UserManagement';
import LabManagement from './components/LabManagement';
import ClassManagement from './components/ClassManagement';
import UserReports from './components/UserReports';
import ReviewSystem from './components/ReviewSystem';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview />;
      case 'users': return <UserManagement />;
      case 'labs': return <LabManagement />;
      case 'classes': return <ClassManagement />;
      case 'reviews': return <ReviewSystem />;
      case 'reports': return <UserReports />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;

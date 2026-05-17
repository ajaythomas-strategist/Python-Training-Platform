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
import AttendanceTab from './components/AttendanceTab';
import Login from './components/Login';
import Guidelines from './components/Guidelines';
import MarkRating from './components/MarkRating';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'SuperAdmin', 'Admin', or 'Trainer'
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <Login onLogin={(role, name) => {
      setIsAuthenticated(true);
      setUserRole(role);
      setUserName(name || '');
    }} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview userRole={userRole} userName={userName} />;
      case 'users': return <UserManagement userRole={userRole} userName={userName} />;
      case 'labs': return <LabManagement userRole={userRole} userName={userName} />;
      case 'classes': return <ClassManagement userRole={userRole} userName={userName} setActiveTab={setActiveTab} />;
      case 'material': return <Materials userRole={userRole} userName={userName} />;
      case 'reviews': return <ReviewsAndRatings userRole={userRole} userName={userName} />;
      case 'reports': return <UserReports userRole={userRole} userName={userName} />;
      case 'leaderboard': return <Leaderboard userRole={userRole} userName={userName} />;
      case 'attendance': return <AttendanceTab userRole={userRole} userName={userName} />;
      case 'guidelines': return <Guidelines userRole={userRole} userName={userName} />;
      case 'mark-rating': return <MarkRating userRole={userRole} userName={userName} />;
      default: return <DashboardOverview userRole={userRole} userName={userName} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={() => {
          setIsAuthenticated(false);
          setUserRole(null);
          setUserName('');
        }} 
        userRole={userRole} 
        userName={userName}
      />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;

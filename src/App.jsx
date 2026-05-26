import React, { useEffect } from 'react';
import { BrowserRouter, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes';
import Login from './components/Login';
import './components/utils/api'; // Initialize global fetch interceptor

function App() {
  const { isAuthenticated, user, logout, checkAuth } = useStore();
  const userRole = user?.role || null;
  const userName = user?.name || '';

  useEffect(() => {
    if (isAuthenticated && checkAuth) {
      checkAuth();
    }
  }, [isAuthenticated, checkAuth]);

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: '#333', color: '#fff', borderRadius: '10px' } }} />
        <Login />
      </>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: '#333', color: '#fff', borderRadius: '10px' } }} />
        <Sidebar onLogout={logout} userRole={userRole} userName={userName} />
        <main className="main-content">
          <AppRoutes userRole={userRole} userName={userName} />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

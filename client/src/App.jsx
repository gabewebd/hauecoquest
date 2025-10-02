// Josh Andrei Aguiluz
import React, { useState } from 'react';
import { Navigation } from './layout/Navigation';
import SignUp from './pages/SignUp';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import QuestsPage from './pages/QuestsPage';
import CommunityPage from './pages/CommunityPage';
import LeaderboardPage from './pages/LeaderboardPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import PartnerDashboard from './pages/PartnerDashboard';
import AdminDashboard from './pages/AdminDashboard';

import { UserProvider } from './context/UserContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log(`Navigating to: ${page}`);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={handlePageChange} />;
      case 'login':
        return <LoginPage onPageChange={handlePageChange} />;
      case 'signup':
        return <SignUp onPageChange={handlePageChange} />;
      case 'quests':
        return <QuestsPage onPageChange={handlePageChange} />;
      case 'community':
        return <CommunityPage onPageChange={handlePageChange} />;
      case 'leaderboard':
        return <LeaderboardPage onPageChange={handlePageChange} />;
      case 'profile':
        return <ProfilePage onPageChange={handlePageChange} />;
      case 'dashboard':
        return <DashboardPage onPageChange={handlePageChange} />;
      case 'partner-dashboard':
        return <PartnerDashboard onPageChange={handlePageChange} />;
      case 'admin-dashboard':
        return <AdminDashboard onPageChange={handlePageChange} />;
      default:
        return <HomePage onPageChange={handlePageChange} />;
    }
  };

  return (
    <UserProvider>
      <div>
        <Navigation
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        <main>
          {renderPage()}
        </main>
      </div>
    </UserProvider>
  );
}

export default App;
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

import { UserProvider } from './pages/UserContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log(`Navigating to: ${page}`);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'quests':
        return <QuestsPage />;
      case 'community':
        return <CommunityPage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'profile':
        return <ProfilePage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'login':
        return <LoginPage onPageChange={handlePageChange} />;
      case 'signup':
        return <SignUp onPageChange={handlePageChange} />;
      default:
        return <HomePage />;
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
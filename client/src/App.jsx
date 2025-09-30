// Josh Andrei Aguiluz
import React, { useState } from 'react';
import { Navigation } from './layout/Navigation';
import HomePage from './pages/HomePage';
import QuestsPage from './pages/QuestsPage';
import CommunityPage from './pages/CommunityPage';
import LeaderboardPage from './pages/LeaderboardPage';
import DashboardPage from './pages/DashboardPage';

import ProfilePage from './pages/ProfilePage';

import EventsPage from './pages/EventsPage';

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
        return <HomePage />;
      case 'quests':
        return <QuestsPage />;
      case 'community':
        return <CommunityPage />;
      case 'events':
        return <EventsPage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'profile':
        return <ProfilePage />;
      case 'dashboard':
        return <DashboardPage />;
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
          // You can toggle this to see the logged-in vs. logged-out state
          isLoggedIn={false} 
        />
        <main>
          {renderPage()}
        </main>
      </div>
    </UserProvider>
  );
}

export default App;
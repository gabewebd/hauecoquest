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
import ContactQuestMasters from './pages/ContactQuestMasters';
// import AlliancePartners from './pages/AlliancePartners';

import { UserProvider, useUser } from './context/UserContext';
import { CheckCircle, Info, X } from 'lucide-react';

// Notification Component
const Notification = ({ notification, onDismiss }) => {
  if (!notification) return null;

  const { type, title, message, duration = 5000 } = notification;
  
  // Auto-dismiss after duration
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [notification, duration, onDismiss]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-blue-500';
  const icon = type === 'success' ? <CheckCircle className="w-6 h-6" /> : <Info className="w-6 h-6" />;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm">
      <div className={`${bgColor} text-white p-4 rounded-lg shadow-lg`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">{icon}</div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{title}</h4>
            <p className="text-sm text-white/90 mt-1">{message}</p>
          </div>
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// App Content Component (inside UserProvider)
const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const { notification, dismissNotification } = useUser();

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
      case 'contactquestmasters':
        return <ContactQuestMasters onPageChange={handlePageChange} />;
      // case 'alliancepartners':
      //   return <AlliancePartners onPageChange={handlePageChange} />;
      default:
        return <HomePage onPageChange={handlePageChange} />;
    }
  };

  return (
    <div>
      <Navigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      <main>
        {renderPage()}
      </main>
      <Notification notification={notification} onDismiss={dismissNotification} />
    </div>
  );
};

// Main App Component
function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
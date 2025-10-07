//Josh Andrei Aguiluz
import React, { useState, useEffect } from 'react';
import { Crown, Award, Shield, Sprout, Recycle, Zap, Users, Swords, Users2, Leaf, Rocket } from 'lucide-react';
import { userAPI } from '../utils/api';
import { useUser } from '../context/UserContext';
import FacebookIcon from '../img/Facebook.png';
import InstagramIcon from '../img/Instagram.png';
import TiktokIcon from '../img/Tiktok.png';

// Helper component for the Top 3 champions
const TopChampionCard = ({ user, rank, onPageChange }) => {
  const rankStyles = {
    1: { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-600', crown: true },
    2: { bg: 'bg-gray-200', border: 'border-gray-300', text: 'text-gray-600' },
    3: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-600' },
  };
  const style = rankStyles[rank];

  // Points are always shown since only 'partner' users are passed to this filtered array
  const pointsDisplay = user.points.toLocaleString();

  return (
    <div className={`relative ${style.bg} p-6 rounded-2xl border-2 ${style.border} text-center flex flex-col items-center`}>
      {style.crown && <Crown className="absolute -top-4 text-yellow-500 w-8 h-8" />}
      <div className="relative mb-3">
        {/* FIXED: Replaced to-primary-green with to-green-500 */}
        <div className={`w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center text-white text-3xl font-bold`}>
          {user.avatarInitial}
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white text-sm font-bold w-8 h-8 rounded-full border-2 flex items-center justify-center border-yellow-300">{user.level}</div>
      </div>
      <button
        onClick={() => onPageChange('profile', { userId: user.id })}
        className="font-bold text-lg text-gray-800 hover:text-green-600 hover:underline cursor-pointer"
      >
        {user.name}
      </button>
      <p className={`text-sm font-semibold ${style.text} mb-2`}>{user.title}</p>
      {/* FIXED: Replaced text-dark-green with text-green-900 */}
      <p className="text-2xl font-bold text-green-900">{pointsDisplay}</p>
    </div>
  );
};

// Helper component for the rest of the leaderboard rows (4th place and below)
const LeaderboardRow = ({ user, rank, onPageChange }) => {
  // Points are always shown since only 'partner' users are passed to this array
  const pointsDisplay = user.points.toLocaleString();

  return (
    <div className="flex items-center bg-white p-3 rounded-xl mb-2 hover:bg-green-50/50 transition-colors">
      <div className="w-8 text-center font-bold text-gray-500 text-lg">#{rank}</div>
      <div className="flex items-center gap-3 flex-1 ml-4">
        <div className="relative">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-lg text-gray-600">{user.avatarInitial}</div>
          <div className="absolute -bottom-0 -right-0 bg-white text-xs font-bold w-5 h-5 rounded-full border flex items-center justify-center">{user.level}</div>
        </div>
        <div>
          <button
            onClick={() => onPageChange('profile', { userId: user.id })}
            className="font-bold text-gray-800 hover:text-green-600 hover:underline cursor-pointer"
          >
            {user.name}
          </button>
          <p className="text-sm text-gray-500">{user.title}</p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-3 text-gray-400">
        <Award className="w-5 h-5" title="Award Winner" />
        <Shield className="w-5 h-5" title="Guardian" />
        <Sprout className="w-5 h-5" title="Planter" />
      </div>
      {/* FIXED: Replaced text-primary-green with text-green-600 */}
      <div className="w-24 text-right font-bold text-green-600 text-lg">{pointsDisplay}</div>
    </div>
  );
};

// Helper component for department leaderboard rows
const DepartmentRow = ({ department, rank, onPageChange }) => (
  <div className="flex items-center bg-white p-4 rounded-xl mb-3 hover:bg-green-50/50 transition-colors border-2 border-gray-100">
    <div className="w-12 text-center font-bold text-gray-500 text-2xl">#{rank}</div>
    <div className="flex items-center gap-4 flex-1 ml-4">
      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
        {department.department}
      </div>
      <div>
        <h3 className="font-bold text-xl text-gray-800">{department.department}</h3>
        <p className="text-sm text-gray-500">{department.userCount} students</p>
        <div className="flex gap-2 mt-1">
          {department.topUsers.map((user, index) => (
            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              {user.username} ({user.points}pts)
            </span>
          ))}
        </div>
      </div>
      </div>
    <div className="text-right">
      <div className="text-2xl font-bold text-green-600">{department.totalPoints.toLocaleString()}</div>
      <div className="text-sm text-gray-500">Total Points</div>
    </div>
  </div>
);

const LeaderboardPage = ({ onPageChange }) => {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [departmentData, setDepartmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuests: 0,
    totalPoints: 0
  });
  const [displayCount, setDisplayCount] = useState(10);

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'SOC', label: 'School of Computing (SOC)' },
    { value: 'SAS', label: 'School of Arts and Sciences (SAS)' },
    { value: 'SEA', label: 'School of Engineering and Architecture (SEA)' },
    { value: 'SBA', label: 'School of Business and Accountancy (SBA)' },
    { value: 'SED', label: 'School of Education (SED)' },
    { value: 'CCJEF', label: 'College of Criminal Justice Education and Forensics (CCJEF)' },
    { value: 'SHTM', label: 'School of Hospitality and Tourism Management (SHTM)' },
    { value: 'SNAMS', label: 'School of Nursing and Allied Medical Sciences (SNAMS)' }
  ];

  useEffect(() => {
    fetchLeaderboard();
    setDisplayCount(10); // Reset display count when department changes
  }, [selectedDepartment]);

  const fetchLeaderboard = async () => {
    try {
      console.log('Fetching leaderboard for department:', selectedDepartment);
      const response = await userAPI.getLeaderboard(selectedDepartment);
      console.log('Leaderboard response:', response);

      if (selectedDepartment === 'all') {
        // Department leaderboard - show department totals
        console.log('Processing all departments view');
        setUsers(response.leaderboard || []);
        setDepartmentData(null);

        // Calculate stats for all departments
        const totalUsers = (response.leaderboard || []).reduce((sum, dept) => sum + (dept.userCount || 0), 0);
        const totalPoints = (response.leaderboard || []).reduce((sum, dept) => sum + (dept.totalPoints || 0), 0);

        setStats({
          totalUsers,
          totalQuests: 0, // Not available in department view
          totalPoints
        });
      } else {
        // Individual department leaderboard
        console.log('Processing individual department view');
        const transformedUsers = (response.leaderboard || []).map(user => ({
          id: user._id || user.username, // Use username as fallback ID
          name: user.username,
          role: user.role, // Ensure role is included for filtering
          title: getRoleTitle(user.role, user.questsCompleted),
          points: user.eco_score || user.points || 0,
          level: Math.floor((user.eco_score || user.points || 0) / 100) + 1,
          avatarInitial: getInitials(user.username),
          questsCompleted: user.questsCompleted
        }));

        setUsers(transformedUsers);
        setDepartmentData({
          department: response.department,
          totalPoints: response.departmentTotal,
          totalUsers: response.totalUsers
        });

        // Calculate stats for this department
        setStats({
          totalUsers: response.totalUsers || 0,
          totalQuests: (response.leaderboard || []).reduce((sum, u) => sum + (u.questsCompleted || 0), 0),
          totalPoints: response.departmentTotal || 0
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleTitle = (role, questsCompleted) => {
    if (role === 'admin') return 'Quest Master';
    if (role === 'partner') return 'Environmental Partner';

    // Based on quests completed
    if (questsCompleted >= 20) return 'Sustainability Champion';
    if (questsCompleted >= 15) return 'Eco-Warrior';
    if (questsCompleted >= 10) return 'Green Guardian';
    if (questsCompleted >= 5) return 'Nature Defender';
    if (questsCompleted >= 3) return 'Eco-Enthusiast';
    return 'Green Rookie';
  };

  // 🟢 MODIFICATION: Filter to include ONLY 'partner' users (excludes 'admin' and 'user')
  const filteredUsers = users.filter(user => user.role === 'partner');

  // Sort the filtered users by points (descending)
  const sortedUsers = [...filteredUsers].sort((a, b) => b.points - a.points);

  const handleShowMore = () => {
    setDisplayCount(prev => prev + 10);
  };

  if (loading) {
    return (
      <div className="font-sans bg-app-bg text-gray-800 min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
          </div>
      </div>
    );
  }

  const topThree = sortedUsers.slice(0, 3);
  const remainingUsers = sortedUsers.slice(3, displayCount);

  return (
    <div className="font-sans bg-app-bg text-gray-800">
      <main className="pt-24 pb-12">
        {/* Header */}
        <section className="container mx-auto px-4 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              {/* FIXED: Replaced text-dark-green with text-green-900 */}
              <h2 className="text-4xl font-extrabold text-green-900 mb-2">Hall of Fame</h2>
              <p className="text-gray-600 max-w-lg">Celebrate our environmental champions and see how you rank among the eco-heroes making a real difference in the world!</p>
              <div className="flex items-center gap-4 mt-6">
                {/* FIXED: Replaced bg-primary-green with bg-green-500 */}
                <button
                  onClick={() => {
                    const leaderboardSection = document.querySelector('#leaderboard-section');
                    if (leaderboardSection) {
                      leaderboardSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition"
                >
                  View Rankings
                </button>
                <button
                  onClick={() => {
                    if (user) {
                      if (user.role === 'admin') {
                        onPageChange('admin-dashboard');
                      } else if (user.role === 'partner') {
                        onPageChange('partner-dashboard');
                      } else {
                        onPageChange('dashboard');
                      }
                    } else {
                      onPageChange('login');
                    }
                  }}
                  className="font-bold text-gray-700 py-3 px-6 hover:text-green-600 transition"
                >
                  My Progress
                </button>
              </div>
            </div>
            <div className="bg-green-50 p-6 rounded-2xl text-center">
              <p>Leaderboard Illustration Placeholder</p>
            </div>
          </div>
        </section>

        {/* Department Filter */}
        <section className="container mx-auto px-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Filter by Department</h3>
                <p className="text-gray-600">View rankings for specific departments or see all participants</p>
              </div>
              <div className="w-full md:w-80">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium"
                >
                  {departmentOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="container mx-auto px-4 mb-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-2xl shadow-md border text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500">
              {selectedDepartment === 'all' ? 'Total Students' : 'Department Students'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-md border text-center">
            <Swords className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalQuests}</p>
            <p className="text-sm text-gray-500">
              {selectedDepartment === 'all' ? 'All Quests' : 'Quests Completed'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-md border text-center">
            <Users2 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{selectedDepartment === 'all' ? users.length : stats.totalUsers}</p>
            <p className="text-sm text-gray-500">
              {selectedDepartment === 'all' ? 'Departments' : 'Active Students'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-md border text-center">
            <Leaf className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalPoints}</p>
            <p className="text-sm text-gray-500">
              {selectedDepartment === 'all' ? 'Combined Points' : 'Department Points'}
            </p>
          </div>
        </section>

        {/* Leaderboard Section */}
        <section id="leaderboard-section" className="container mx-auto px-4">

          {/* Top Champions */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">
              🏆 {selectedDepartment === 'all' ? 'Department Rankings' : 'Top Environmental Partners'} 🏆
            </h2>
            {selectedDepartment !== 'all' && (
              <p className="text-lg text-gray-600 mt-2">
                {departmentOptions.find(d => d.value === selectedDepartment)?.label}
              </p>
            )}
            {departmentData && (
              <div className="mt-4 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <p className="text-lg font-bold text-green-800">
                  Department Total: {departmentData.totalPoints.toLocaleString()} points
                </p>
                <p className="text-sm text-green-600">
                  {departmentData.totalUsers} students contributing
                </p>
              </div>
            )}
          </div>

          {selectedDepartment === 'all' ? (
            // Department leaderboard
            <div className="bg-white p-6 rounded-2xl shadow-xl border">
              <h3 className="text-2xl font-bold mb-6">Department Rankings</h3>
              {users.map((department, index) => (
                <DepartmentRow
                  key={department.department}
                  department={department}
                  rank={department.rank}
                  onPageChange={onPageChange}
                />
              ))}
            </div>
          ) : (
            // Individual department leaderboard (now only showing partners in that department)
            sortedUsers.length >= 3 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <TopChampionCard user={sortedUsers[1]} rank={2} onPageChange={onPageChange} />
                  <TopChampionCard user={sortedUsers[0]} rank={1} onPageChange={onPageChange} />
                  <TopChampionCard user={sortedUsers[2]} rank={3} onPageChange={onPageChange} />
                </div>

                {/* Complete Leaderboard */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border">
                  <h3 className="text-2xl font-bold mb-4">Complete Partner Rankings</h3>
                  {remainingUsers.map((user, index) => (
                    <LeaderboardRow key={`${user.name}-${index}`} user={user} rank={index + 4} onPageChange={onPageChange} />
                  ))}

                  {/* Show More Button */}
                  {displayCount < sortedUsers.length && (
                    <div className="text-center mt-6">
                      <button
                        onClick={handleShowMore}
                        className="bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition"
                      >
                        Show More (+10)
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white p-12 rounded-2xl shadow-xl border text-center">
                <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">No Partners Found</h3>
                <p className="text-gray-500">There are no environmental partners registered in this department yet.</p>
              </div>
            )
          )}
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 mt-24">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center flex flex-col items-center">
            {/* FIXED: Replaced text-primary-green with text-green-500 */}
            <Rocket className="w-12 h-12 text-green-500 mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Climb the Eco-Hero Rankings!</h2>
            <p className="text-gray-600 max-w-lg mx-auto mb-6">Complete quests, attend events, and make environmental impact to earn points and climb the leaderboard. Every action counts towards a sustainable future!</p>
            <div className="flex gap-4">
              {/* --- CHANGE: Made this button functional --- */}
              <button
                onClick={() => onPageChange('quests')}
                className="bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition"
              >
                Start New Quest
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-700 text-white pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/vite.svg"
                alt="HAU Eco-Quest Logo"
                className="h-8 w-8 bg-white rounded-full p-1"
              />
              <h3 className="text-2xl font-bold">HAU Eco-Quest</h3>
            </div>
            <p className="text-sm text-green-100">
              Empowering students to become environmental champions through
              engaging sustainability adventures. Join the movement to save our
              planet!
            </p>
          </div>

          {/* Adventure Paths */}
          <div>
            <h4 className="font-bold mb-4">Adventure Paths</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li><button onClick={() => onPageChange('quests')} className="hover:text-white">Browse Epic Quests</button></li>
              <li><button onClick={() => onPageChange('community')} className="hover:text-white">Hero Community</button></li>
              <li><button onClick={() => onPageChange('leaderboard')} className="hover:text-white">Hall of Fame</button></li>
            </ul>
          </div>

          {/* Support Guild */}
          <div>
            <h4 className="font-bold mb-4">Support Guild</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li><button onClick={() => onPageChange('contactquestmasters')} className="hover:text-white">Contact Quest Masters</button></li>
              <li><button onClick={() => onPageChange('alliancepartners')} className="hover:text-white">Alliance Partners</button></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold mb-4">Connect with Us</h4>
            <div className="bg-green-600 p-4 rounded-lg text-sm">
              <p>eco-quest@hau.edu.ph</p>
              <p>+63 (2) 123-4567</p>
              <p>HAU Main Campus</p>
              <div className="flex gap-4 mt-4">
                <a href="#"><img src={FacebookIcon} alt="Facebook" className="w-6 h-6" /></a>
                <a href="#"><img src={InstagramIcon} alt="Instagram" className="w-6 h-6" /></a>
                <a href="#"><img src={TiktokIcon} alt="Instagram" className="w-6 h-6" /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto text-center border-t border-green-600 mt-8 pt-6 text-green-200 text-sm">
          <p>© 2025 HAU Eco-Quest. All rights reserved. Built with for a sustainable future.</p>
        </div>
      </footer>
    </div>
  );
};

export default LeaderboardPage;

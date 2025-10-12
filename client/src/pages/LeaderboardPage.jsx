//Josh Andrei Aguiluz
import React, { useState, useEffect } from 'react';
import { Crown, Award, Shield, Sprout, Recycle, Zap, Users, Swords, Users2, Leaf, Rocket, Search, Filter } from 'lucide-react';
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

  // Points are always shown since only regular 'user' role users are passed to this filtered array
  const pointsDisplay = user.points.toLocaleString();

  return (
    <div className={`relative ${style.bg} p-6 rounded-2xl border-2 ${style.border} text-center flex flex-col items-center`}>
      {style.crown && <Crown className="absolute -top-4 text-yellow-500 w-8 h-8" />}
      <div className="relative mb-3">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
          {user.avatarImage ? (
            <img 
              src={user.avatarImage} 
              alt={user.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-full h-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white text-3xl font-bold`} style={{display: user.avatarImage ? 'none' : 'flex'}}>
            {user.avatarInitial}
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white text-sm font-bold w-8 h-8 rounded-full border-2 flex items-center justify-center border-yellow-300">{user.level}</div>
      </div>
      <div className="absolute -top-2 -left-2 bg-white text-lg font-black w-10 h-10 rounded-full border-2 flex items-center justify-center border-gray-300 text-gray-700">
        #{rank}
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
  // Points are always shown since only regular 'user' role users are passed to this array
  const pointsDisplay = user.points.toLocaleString();

  return (
    <div className="flex items-center bg-white p-3 rounded-xl mb-2 hover:bg-green-50/50 transition-colors">
      <div className="w-8 text-center font-bold text-gray-500 text-lg">#{rank}</div>
      <div className="flex items-center gap-3 flex-1 ml-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
            {user.avatarImage ? (
              <img 
                src={user.avatarImage} 
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center font-bold text-lg text-gray-600" style={{display: user.avatarImage ? 'none' : 'flex'}}>
              {user.avatarInitial}
            </div>
          </div>
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
const DepartmentRow = ({ department, rank, onPageChange, onDepartmentSelect }) => {
  const getDepartmentLogo = (dept) => {
    const logoMap = {
      'SOC': '/assets/departments/hau_soc_logo_revised4.png',
      'SAS': '/assets/departments/hau_sas_logo.png',
      'SEA': '/assets/departments/hau_sea_logo.png',
      'SBA': '/assets/departments/hau_sba_logo.png',
      'SED': '/assets/departments/hau_sed_logo.png',
      'CCJEF': '/assets/departments/hau_ccjef_logo.png',
      'SHTM': '/assets/departments/hau_SHTM_logo.png',
      'SNAMS': '/assets/departments/hau_snams_logo.png'
    };
    return logoMap[dept] || '/assets/departments/hau_soc_logo_revised4.png';
  };

  return (
    <div className="flex items-center bg-gradient-to-r from-white to-green-50 p-6 rounded-2xl mb-4 hover:from-green-50 hover:to-green-100 transition-all duration-300 border-2 border-green-100 hover:border-green-200 shadow-md hover:shadow-lg">
      <div className="w-16 text-center font-black text-gray-700 text-3xl bg-white rounded-full w-12 h-12 flex items-center justify-center border-2 border-gray-200">
        #{rank}
      </div>
      <div className="flex items-center gap-6 flex-1 ml-6">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg flex items-center justify-center bg-white">
          <img 
            src={getDepartmentLogo(department.department)} 
            alt={`${department.department} logo`}
            className="w-16 h-16 object-contain"
          />
        </div>
        <div className="flex-1">
          <button
            onClick={() => onDepartmentSelect(department.department)}
            className="font-black text-2xl text-gray-800 hover:text-green-600 hover:underline cursor-pointer transition-colors block mb-2"
          >
            {department.department}
          </button>
          <p className="text-lg text-gray-600 font-semibold mb-3">{department.userCount} students</p>
          <div className="flex flex-wrap gap-2">
            {department.topUsers.map((user, index) => (
              <span key={index} className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                {user.username} ({user.points}pts)
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-3xl font-black text-green-600">{department.totalPoints.toLocaleString()}</div>
        <div className="text-lg text-gray-600 font-semibold">Total Points</div>
      </div>
    </div>
  );
};

const LeaderboardPage = ({ onPageChange }) => {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [departmentData, setDepartmentData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuests: 0,
    totalPoints: 0
  });
  const [displayCount, setDisplayCount] = useState(10);

  // Helper function to get avatar image
  const getAvatarImage = (avatarTheme) => {
    const avatarMap = {
      'Leaf': '/assets/avatars-headers/leaf-avatar.png',
      'Sun': '/assets/avatars-headers/sun-avatar.png',
      'Tree': '/assets/avatars-headers/tree-avatar.png',
      'Water': '/assets/avatars-headers/water-avatar.png',
      'Girl Avatar 1': '/assets/avatars-headers/leaf-avatar.png', // Legacy support
      'Girl Avatar 2': '/assets/avatars-headers/sun-avatar.png', // Legacy support
      'Boy Avatar 1': '/assets/avatars-headers/tree-avatar.png', // Legacy support
      'Boy Avatar 2': '/assets/avatars-headers/water-avatar.png', // Legacy support
    };
    return avatarMap[avatarTheme] || '/assets/avatars-headers/leaf-avatar.png';
  };

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
    setLoading(true); // Set loading state when department changes
    fetchLeaderboard();
    setDisplayCount(10); // Reset display count when department changes
  }, [selectedDepartment]);

  // Handle department navigation from URL params or props
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const deptParam = urlParams.get('department');
    if (deptParam && deptParam !== selectedDepartment) {
      setSelectedDepartment(deptParam);
    }
  }, []);

  const fetchLeaderboard = async () => {
    try {
      console.log('Fetching leaderboard for department:', selectedDepartment);
      const response = await userAPI.getLeaderboard(selectedDepartment);
      console.log('Leaderboard response:', response);

      if (selectedDepartment === 'all') {
        // Department leaderboard - show department totals
        console.log('Processing all departments view');
        setUsers([]); // Clear users array for department view
        setDepartments(response.leaderboard || []); // Set department data
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
          id: user._id, // Use the MongoDB _id
          name: user.username,
          role: user.role, // Ensure role is included for filtering
          title: getRoleTitle(user.role, user.questsCompleted),
          points: user.eco_score || user.points || 0,
          level: Math.floor((user.eco_score || user.points || 0) / 100) + 1,
          avatarInitial: getInitials(user.username),
          avatarImage: getAvatarImage(user.avatar_theme),
          questsCompleted: user.questsCompleted
        }));

        setUsers(transformedUsers);
        setDepartments([]); // Clear departments array for individual view
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
      setUsers([]);
      setDepartments([]);
      setStats({});
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

  // Filter to include ONLY 'user' role (excludes 'admin' and 'partner')
  const filteredUsers = users.filter(user => user.role === 'user');

  // Sort users by points first (descending) to establish rankings
  const sortedUsers = [...filteredUsers].sort((a, b) => b.points - a.points);

  // Add original rank to each user
  const usersWithRank = sortedUsers.map((user, index) => ({
    ...user,
    originalRank: index + 1
  }));


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

  const topThree = usersWithRank.slice(0, 3);
  const remainingUsers = usersWithRank.slice(3, displayCount);

  return (
    <div className="font-sans bg-gray-50 text-gray-900">
      <main className="pt-20 pb-12">
        {/* Page Header - Compact */}
        <section className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-xl shadow-lg">
                  <Crown className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-gray-900 mb-1">Hall of Fame</h1>
                  <p className="text-gray-600 text-sm">Celebrate our environmental champions and see how you rank among the eco-heroes</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-xs text-gray-500 font-semibold">
                    {selectedDepartment === 'all' ? 'Total Students' : 'Department Students'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Swords className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stats.totalQuests}</p>
                  <p className="text-xs text-gray-500 font-semibold">
                    {selectedDepartment === 'all' ? 'All Quests' : 'Quests Completed'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{selectedDepartment === 'all' ? departments.length : stats.totalUsers}</p>
                  <p className="text-xs text-gray-500 font-semibold">
                    {selectedDepartment === 'all' ? 'Departments' : 'Active Students'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stats.totalPoints}</p>
                  <p className="text-xs text-gray-500 font-semibold">
                    {selectedDepartment === 'all' ? 'Combined Points' : 'Department Points'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Bar - Sticky */}
        <section className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Department Filter */}
              <div className="w-full md:w-80 ml-auto">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-lg px-4 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

        {/* Leaderboard Section */}
        <section id="leaderboard-section" className="container mx-auto px-6 py-8">

          {selectedDepartment === 'all' ? (
            // Department leaderboard
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Department Rankings</h2>
                  <p className="text-gray-600">Click on any department to view their top environmental champions</p>
                </div>
                {departments.length > 0 ? (
                  <div className="space-y-4">
                    {departments.map((department, index) => (
                      <DepartmentRow
                        key={department.department}
                        department={department}
                        rank={department.rank}
                        onPageChange={onPageChange}
                        onDepartmentSelect={setSelectedDepartment}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-600 mb-2">No Departments Found</h3>
                    <p className="text-gray-500">No departments match your search criteria.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Individual department leaderboard (now only showing regular users in that department)
            usersWithRank.length > 0 ? (
              <>
                {/* Department Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">Top Environmental Champions</h2>
                  <p className="text-lg text-gray-600 mt-2">
                    {departmentOptions.find(d => d.value === selectedDepartment)?.label}
                  </p>
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

                {/* Show top 3 champions if we have 3 or more users */}
                {usersWithRank.length >= 3 && (
                  <div className="mb-12">
                    <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Top Champions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                      {/* 2nd Place */}
                      <div className="order-2 md:order-1">
                        <TopChampionCard key={usersWithRank[1].id} user={usersWithRank[1]} rank={usersWithRank[1].originalRank} onPageChange={onPageChange} />
                      </div>
                      {/* 1st Place - Center and elevated */}
                      <div className="order-1 md:order-2 transform md:scale-110 md:-mt-4">
                        <TopChampionCard key={usersWithRank[0].id} user={usersWithRank[0]} rank={usersWithRank[0].originalRank} onPageChange={onPageChange} />
                      </div>
                      {/* 3rd Place */}
                      <div className="order-3 md:order-3">
                        <TopChampionCard key={usersWithRank[2].id} user={usersWithRank[2]} rank={usersWithRank[2].originalRank} onPageChange={onPageChange} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Show all users in a simple list format */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    {usersWithRank.length >= 3 ? 'Complete User Rankings' : 'User Rankings'}
                  </h3>
                  {usersWithRank.length >= 3 ? (
                    // If we have 3+ users, show remaining users (4th place and below)
                    remainingUsers.map((user, index) => (
                      <LeaderboardRow key={`${user.name}-${index}`} user={user} rank={user.originalRank} onPageChange={onPageChange} />
                    ))
                  ) : (
                    // If we have fewer than 3 users, show all users with their original ranks
                    usersWithRank.map((user, index) => (
                      <LeaderboardRow key={`${user.name}-${index}`} user={user} rank={user.originalRank} onPageChange={onPageChange} />
                    ))
                  )}

                  {/* Show More Button */}
                  {usersWithRank.length >= 3 && displayCount < usersWithRank.length && (
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
              <div className="bg-white p-12 rounded-2xl shadow-lg border border-gray-200 text-center">
                <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">No Users Found</h3>
                <p className="text-gray-500">There are no users registered in this department yet.</p>
              </div>
            )
          )}
        </section>

        {/* CTA */}
        <section className="py-32 px-6 bg-gray-100 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight text-gray-900">
              Climb the Eco-Hero Rankings!
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Complete quests, attend events, and make environmental impact to earn points and climb the leaderboard. Every action counts towards a sustainable future!
            </p>
            
            <button 
              onClick={() => onPageChange('quests')}
              className="bg-green-600 hover:bg-green-700 text-white font-black px-12 py-5 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all inline-flex items-center gap-3 text-lg"
            >
              <Rocket className="w-6 h-6" />
              Start New Quest
            </button>
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
                src="/assets/hau-eco-quest-logo.png"
                alt="HAU Eco-Quest Logo"
                className="h-8 w-8"
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

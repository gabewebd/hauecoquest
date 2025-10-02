//Josh Andrei Aguiluz
import React, { useState, useEffect } from 'react';
import { useUser } from "../context/UserContext";
import { BookOpen, PlusCircle, User, Settings, BarChart, TreePine, Recycle, Droplets, Sun, Zap, Activity, Badge, Trophy, CheckCircle, Clock, List, ChevronRight, Award, UserCircle, Users, Crown } from 'lucide-react';

// --- ALL HELPER COMPONENTS ARE NOW DEFINED AT THE TOP LEVEL ---

const StatCard = ({ icon, value, label, change }) => (
    <div className="bg-white p-5 rounded-xl shadow-md border"><div className="flex items-center gap-4">{icon}<div><p className="text-2xl font-bold">{value}</p><p className="text-sm text-gray-500">{label}</p></div></div><p className="text-xs text-green-600 mt-2 font-semibold">{change}</p></div>
);
const QuickLink = ({ icon, title, subtitle }) => (
    <a href="#" className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"><div className="bg-gray-100 p-2 rounded-lg">{icon}</div><div className="flex-1"><p className="font-semibold">{title}</p><p className="text-xs text-gray-500">{subtitle}</p></div><ChevronRight className="w-5 h-5 text-gray-400" /></a>
);
const ActivityItem = ({ icon, title, subtitle, time, points }) => (
    <div className="flex items-start gap-3"><div className="mt-1">{icon}</div><div className="flex-1"><p className="font-semibold text-sm">{title}</p><p className="text-xs text-gray-500">{subtitle}</p></div><div className="text-right"><p className="text-xs text-gray-400">{time}</p>{points && <p className="text-xs font-bold text-green-600">{points}</p>}</div></div>
);
const QuestStat = ({ icon, value, label }) => (
    <div className="bg-gray-50 p-4 rounded-lg"><div className="mx-auto w-fit mb-2">{icon}</div><p className="text-2xl font-bold">{value}</p><p className="text-sm text-gray-500">{label}</p></div>
);
const GoalItem = ({ title, value, progress, label }) => (
    <div className="mb-4"><div className="flex justify-between font-semibold text-sm mb-1"><p>{title}</p><p>{value}</p></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-orange-400 h-2 rounded-full" style={{ width: `${progress}%` }}></div></div><p className="text-xs text-gray-500 mt-1">{label}</p></div>
);
const CategoryProgress = ({ icon, title, value, progress }) => (
    <div className="mb-4"><div className="flex items-center gap-2 mb-1"><div className="w-5">{icon}</div><p className="font-semibold text-sm flex-1">{title}</p><p className="text-xs text-gray-500">{value}</p></div><div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div></div></div>
);
const ImpactCard = ({ icon, value, label, color }) => (
    <div className={`p-4 rounded-xl text-center ${color}`}><div className="mx-auto w-fit mb-1">{icon}</div><p className="text-xl font-bold">{value}</p><p className="text-xs">{label}</p></div>
);

const AchievementSection = ({ achievements }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h3 className="text-xl font-bold mb-4">Recent Achievements</h3>
            <div className="space-y-3">
                {achievements.length > 0 ? (
                    achievements.slice(0, 3).map((achievement, index) => (
                        <ActivityItem 
                            key={index}
                            icon={<Badge className="text-green-500"/>} 
                            title={achievement.badge_id?.name || 'Achievement'} 
                            subtitle={achievement.badge_id?.description || 'Great job!'} 
                            time={new Date(achievement.earned_at).toLocaleDateString()} 
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No achievements yet. Complete quests to earn badges!</p>
                )}
            </div>
            <button className="font-semibold text-green-600 mt-4 text-sm hover:underline">View All Badges</button>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h3 className="text-xl font-bold mb-4">Badge Collection</h3>
            <div className="bg-purple-50 text-purple-800 p-6 rounded-xl text-center">
                <p className="text-5xl font-bold">{achievements.length}</p>
                <p className="font-semibold">Badges Earned</p>
                <p className="text-xs">Out of 35 available badges</p>
            </div>
            <div className="mt-4 space-y-3">
                <p className="font-semibold text-sm">Next Badges to Unlock</p>
                <GoalItem title="Energy Master" value="7/10" progress={70} label="Complete 10 energy conservation quests" />
                <GoalItem title="Water Guardian" value="156/500" progress={31.2} label="Save 500 liters of water" />
            </div>
        </div>
    </div>
);

const OverviewTabContent = ({ dashboardData }) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard icon={<CheckCircle className="w-8 h-8 text-green-500" />} value={dashboardData.questsCompleted} label="Quests Completed" change="+1 this month" />
                <StatCard icon={<Award className="w-8 h-8 text-orange-500" />} value={dashboardData.badgesEarned} label="Badges Earned" change="+0 new" />
                <StatCard icon={<Trophy className="w-8 h-8 text-yellow-500" />} value={dashboardData.ecoPoints} label="Eco Points" change="+150 this week" />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border">
                <h3 className="text-xl font-bold mb-4">Quick Adventures</h3>
                <div className="space-y-3">
                    <QuickLink icon={<BookOpen className="w-5 h-5 text-blue-500" />} title="Browse Quests" subtitle="Discover new adventures" />
                    <QuickLink icon={<User className="w-5 h-5 text-green-500" />} title="View Community" subtitle="Connect with Eco-Heroes" />
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {dashboardData.recentActivity.length > 0 ? (
                    dashboardData.recentActivity.map((activity, index) => (
                        <ActivityItem 
                            key={index}
                            icon={activity.icon} 
                            title={activity.title} 
                            subtitle={activity.subtitle} 
                            time={activity.time} 
                            points={activity.points} 
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No recent activity</p>
                )}
            </div>
        </div>
    </div>
);

const ProgressTabContent = ({ dashboardData, userData, levelProgress }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border text-center">
                    <h3 className="text-xl font-bold mb-2">Level {userData.level}</h3>
                    <p className="text-gray-500 text-sm mb-4">Environmental Champion</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${levelProgress}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500">{userData.pointsToNextLevel - (userData.points % userData.pointsToNextLevel)} more points needed</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border">
                    <h3 className="text-xl font-bold mb-4">Streaks & Goals</h3>
                    <GoalItem 
                        title="Day Streak" 
                        value={dashboardData.currentStreak || 0} 
                        progress={(dashboardData.currentStreak || 0) / 30 * 100} 
                        label={`Longest Streak: ${dashboardData.longestStreak || 0} days`} 
                    />
                    <GoalItem 
                        title="Weekly Goal" 
                        value={`${dashboardData.weeklyPoints || 0}/150`} 
                        progress={(dashboardData.weeklyPoints || 0) / 150 * 100} 
                        label="Earn 150 eco-points this week" 
                    />
                    <GoalItem 
                        title="Monthly Goal" 
                        value={`${dashboardData.monthlyQuests || 0}/3`} 
                        progress={(dashboardData.monthlyQuests || 0) / 3 * 100} 
                        label="Complete 3 new quests this month" 
                    />
                </div>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border">
                <h3 className="text-xl font-bold mb-4">Quest Progress</h3>
                <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                    <QuestStat icon={<CheckCircle className="w-8 h-8 text-green-500" />} value={dashboardData.questsCompleted} label="Completed" />
                    <QuestStat icon={<Clock className="w-8 h-8 text-blue-500" />} value={dashboardData.questsInProgress} label="In Progress" />
                    <QuestStat icon={<List className="w-8 h-8 text-gray-500" />} value={dashboardData.availableQuests} label="Available" />
                </div>
                <h4 className="font-semibold mb-4">Progress by Category</h4>
                {Object.entries(dashboardData.categoryProgress).map(([category, progress]) => {
                    const progressPercent = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
                    const getCategoryIcon = (cat) => {
                        const icons = {
                            'Recycling & Waste': <Recycle className="w-5 h-5 text-blue-500"/>,
                            'Energy Conservation': <Sun className="w-5 h-5 text-yellow-500"/>,
                            'Water Conservation': <Droplets className="w-5 h-5 text-cyan-500"/>,
                            'Gardening & Planting': <TreePine className="w-5 h-5 text-green-500"/>,
                            'Education & Awareness': <BookOpen className="w-5 h-5 text-purple-500"/>,
                            'Transportation': <Building className="w-5 h-5 text-indigo-500"/>
                        };
                        return icons[cat] || <TreePine className="w-5 h-5 text-green-500"/>;
                    };
                    return (
                        <CategoryProgress 
                            key={category}
                            icon={getCategoryIcon(category)} 
                            title={category} 
                            value={`${progress.completed} of ${progress.total} quests`} 
                            progress={progressPercent} 
                        />
                    );
                })}
            </div>
        </div>
        <AchievementSection achievements={dashboardData.achievements} />
    </div>
);

// TabButton component - NOW DEFINED AT TOP LEVEL
const TabButton = ({ id, label, icon, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 text-sm ${
            activeTab === id
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
    >
        {icon}
        {label}
    </button>
);

// Pending Approval Component
const PendingApprovalCard = ({ user }) => {
    const roleTitle = user.requested_role === 'partner' ? 'Environmental Partner' : 'Admin';
    const roleIcon = user.requested_role === 'partner' ? 
        <Users className="w-8 h-8 text-yellow-500" /> : 
        <Crown className="w-8 h-8 text-red-500" />;
    
    return (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-2xl shadow-lg mb-8 text-white">
            <div className="flex items-center gap-6">
                <div className="bg-white/20 p-4 rounded-full">
                    {roleIcon}
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">🕐 Role Request Pending</h2>
                    <p className="text-white/90 mb-1">
                        Your <strong>{roleTitle}</strong> request is being reviewed by our administrators.
                    </p>
                    <p className="text-white/80 text-sm">
                        You'll receive access to additional features once your request is approved.
                        In the meantime, you can still participate in quests and earn points!
                    </p>
                </div>
                <div className="text-center">
                    <div className="bg-white/20 px-4 py-2 rounded-full mb-2">
                        <Clock className="w-6 h-6 mx-auto" />
                    </div>
                    <p className="text-sm font-semibold">Awaiting Approval</p>
                </div>
            </div>
        </div>
    );
};

// Role Request Component
const RoleRequestCard = ({ user, onRequestRole }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRoleRequest = async () => {
        if (!selectedRole) return;
        
        setLoading(true);
        try {
            const result = await onRequestRole(selectedRole);
            
            if (result.success) {
                setShowModal(false);
                setSelectedRole('');
                const roleTitle = selectedRole === 'partner' ? 'Partner' : 'Admin';
                alert(`✅ Request sent! Your ${roleTitle} request has been submitted successfully. You will be notified when an admin reviews your request.`);
                // The page will automatically refresh and show the pending approval card
                window.location.reload();
            } else {
                console.error('Role request failed:', result.error);
                alert(`❌ ${result.error || 'Failed to submit role request'}`);
            }
        } catch (error) {
            console.error('Role request error:', error);
            alert(`❌ Network error: ${error.message}`);
        }
        setLoading(false);
    };

    return (
        <>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl shadow-lg mb-8 text-white">
                <div className="flex items-center gap-6">
                    <div className="bg-white/20 p-4 rounded-full">
                        <Settings className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2">🚀 Upgrade Your Account</h2>
                        <p className="text-white/90 mb-1">
                            Ready to take on more responsibilities? Request Partner or Admin access!
                        </p>
                        <p className="text-white/80 text-sm">
                            Partners can create and manage quests, while Admins have full platform control.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition"
                    >
                        Request Role
                    </button>
                </div>
            </div>

            {/* Role Request Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="p-6">
                            <h3 className="text-2xl font-bold mb-4">Request Role Upgrade</h3>
                            <p className="text-gray-600 mb-6">
                                Choose the role you'd like to request. Your request will be reviewed by administrators.
                            </p>

                            <div className="space-y-3 mb-6">
                                <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="partner"
                                        checked={selectedRole === 'partner'}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="mt-1"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Users className="w-5 h-5 text-purple-500" />
                                            <span className="font-semibold">Environmental Partner</span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Create and manage environmental quests, access analytics dashboard
                                        </p>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="admin"
                                        checked={selectedRole === 'admin'}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="mt-1"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Crown className="w-5 h-5 text-red-500" />
                                            <span className="font-semibold">Platform Administrator</span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Full platform control, user management, content approval
                                        </p>
                                    </div>
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRoleRequest}
                                    disabled={!selectedRole || loading}
                                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Avatar mapping
const getAvatarStyles = (avatarName) => {
    const avatars = {
        "Girl Avatar 1": { color: "text-pink-500", bg: "bg-pink-100" },
        "Girl Avatar 2": { color: "text-pink-400", bg: "bg-pink-50" },
        "Boy Avatar 1": { color: "text-blue-500", bg: "bg-blue-100" },
        "Boy Avatar 2": { color: "text-blue-400", bg: "bg-blue-50" },
    };
    return avatars[avatarName] || avatars["Girl Avatar 1"];
};

// Header theme mapping
const getHeaderTheme = (themeName) => {
    const themes = {
        orange: "from-orange-400 to-pink-500",
        green: "from-green-400 to-emerald-600",
        blue: "from-blue-400 to-indigo-500",
    };
    return themes[themeName] || themes.orange;
};

// DashboardHeader component - NOW USES AVATAR & HEADER THEME FROM USER CONTEXT
const DashboardHeader = ({ userData, levelProgress, avatarStyle, headerTheme }) => (
    <div className={`bg-gradient-to-r ${headerTheme} p-6 rounded-2xl shadow-lg mb-8`}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
                <div className={`w-20 h-20 rounded-full ${avatarStyle.bg} flex items-center justify-center shadow-md`}>
                    <UserCircle className={`w-16 h-16 ${avatarStyle.color}`} />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-bold w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                    {userData.level}
                </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-white">Welcome back, {userData.name}! 👋</h2>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white">
                        Student
                    </span>
                </div>
                <p className="text-white/90">{userData.title}</p>
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-white/80 mb-1">
                        <span>Progress to Level {userData.level + 1}</span>
                        <span>{userData.points} / {userData.pointsToNextLevel} eco-points</span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full" style={{ width: `${levelProgress}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- Main Dashboard Component ---
const DashboardPage = () => {
    const { user, logout, requestRole } = useUser();
    const [dashboardData, setDashboardData] = useState({
        questsCompleted: 0,
        badgesEarned: 0,
        ecoPoints: 0,
        questsInProgress: 0,
        availableQuests: 0,
        recentActivity: [],
        achievements: [],
        categoryProgress: {},
        currentStreak: 0,
        longestStreak: 0,
        weeklyPoints: 0,
        monthlyQuests: 0
    });
    const [loading, setLoading] = useState(true);

    // Handle pending role requests - show special pending view instead of blocking access
    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const calculateCurrentStreak = (questsData) => {
        const completedQuests = questsData
            .filter(q => q.status === 'approved')
            .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
        
        if (completedQuests.length === 0) return 0;
        
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        for (let quest of completedQuests) {
            const questDate = new Date(quest.submitted_at);
            questDate.setHours(0, 0, 0, 0);
            
            const daysDiff = Math.floor((currentDate - questDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === streak) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (daysDiff > streak) {
                break;
            }
        }
        
        return streak;
    };

    const calculateLongestStreak = (questsData) => {
        const completedQuests = questsData
            .filter(q => q.status === 'approved')
            .sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at));
        
        if (completedQuests.length === 0) return 0;
        
        let longestStreak = 0;
        let currentStreak = 1;
        
        for (let i = 1; i < completedQuests.length; i++) {
            const prevDate = new Date(completedQuests[i - 1].submitted_at);
            const currDate = new Date(completedQuests[i].submitted_at);
            
            prevDate.setHours(0, 0, 0, 0);
            currDate.setHours(0, 0, 0, 0);
            
            const daysDiff = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 1) {
                currentStreak++;
            } else {
                longestStreak = Math.max(longestStreak, currentStreak);
                currentStreak = 1;
            }
        }
        
        return Math.max(longestStreak, currentStreak);
    };

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'x-auth-token': token };

            // Fetch user's quest submissions
            const questsRes = await fetch('http://localhost:5000/api/quests/submissions/my', { headers });
            const questsData = await questsRes.json();

            // Fetch user's badges
            const badgesRes = await fetch('http://localhost:5000/api/badges/my', { headers });
            const badgesData = await badgesRes.json();

            // Fetch all quests for stats
            const allQuestsRes = await fetch('http://localhost:5000/api/quests', { headers });
            const allQuestsData = await allQuestsRes.json();

            // Fetch user's posts for activity
            const postsRes = await fetch('http://localhost:5000/api/posts/my', { headers });
            const postsData = await postsRes.json();

            // Calculate stats
            const completedQuests = questsData.filter(q => q.status === 'approved').length;
            const inProgressQuests = questsData.filter(q => q.status === 'pending').length;
            const availableQuests = allQuestsData.filter(q => q.isActive).length;

            // Calculate category progress
            const categoryProgress = {};
            allQuestsData.forEach(quest => {
                if (!categoryProgress[quest.category]) {
                    categoryProgress[quest.category] = { completed: 0, total: 0 };
                }
                categoryProgress[quest.category].total++;
                if (questsData.some(q => q.quest_id === quest._id && q.status === 'approved')) {
                    categoryProgress[quest.category].completed++;
                }
            });

            // Recent activity
            const recentActivity = [
                ...questsData.slice(0, 3).map(q => ({
                    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
                    title: `Completed '${q.quest_id?.title || 'Quest'}'`,
                    subtitle: `You earned ${q.points_earned || 0} points`,
                    time: new Date(q.submitted_at).toLocaleDateString(),
                    points: `+${q.points_earned || 0} points`
                })),
                ...postsData.slice(0, 2).map(p => ({
                    icon: <User className="w-5 h-5 text-blue-500" />,
                    title: `Posted: ${p.title}`,
                    subtitle: 'Shared with the community',
                    time: new Date(p.created_at).toLocaleDateString()
                }))
            ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

            // Calculate streaks and goals
            const now = new Date();
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

            // Weekly points (from approved quests in last 7 days)
            const weeklyQuests = questsData.filter(q => 
                q.status === 'approved' && new Date(q.submitted_at) >= oneWeekAgo
            );
            const weeklyPoints = weeklyQuests.reduce((sum, q) => sum + (q.quest_id?.points || 0), 0);

            // Monthly quests (approved in last 30 days)
            const monthlyQuests = questsData.filter(q => 
                q.status === 'approved' && new Date(q.submitted_at) >= oneMonthAgo
            ).length;

            // Calculate current streak (consecutive days with activity)
            const currentStreak = calculateCurrentStreak(questsData);
            const longestStreak = calculateLongestStreak(questsData);

            setDashboardData({
                questsCompleted: completedQuests,
                badgesEarned: badgesData.length,
                ecoPoints: user.points || 0,
                questsInProgress: inProgressQuests,
                availableQuests: availableQuests,
                recentActivity: recentActivity,
                achievements: badgesData,
                categoryProgress: categoryProgress,
                currentStreak: currentStreak,
                longestStreak: longestStreak,
                weeklyPoints: weeklyPoints,
                monthlyQuests: monthlyQuests
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="pt-24 text-center">Loading Dashboard...</div>;
    }

    if (loading) {
        return (
            <div className="pt-24 text-center">
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard data...</p>
            </div>
        );
    }

    const userData = {
        name: user.username,
        title: 'Environmental Champion',
        level: Math.floor((user.points || 0) / 100) + 1,
        points: user.points || 0,
        pointsToNextLevel: 100,
    };

    const avatarStyle = getAvatarStyles(user.avatar);
    const headerTheme = getHeaderTheme(user.headerTheme);
    const levelProgress = (userData.points / userData.pointsToNextLevel) * 100;
    
    return (
        <div className="font-sans bg-gray-50 text-gray-800 min-h-screen">
            <main className="container mx-auto px-4 pt-24 pb-12">
                {/* Show pending approval card if user has requested role */}
                {user.requested_role && !user.is_approved && (
                    <PendingApprovalCard user={user} />
                )}
                
                {/* Show role request card if user is regular user with no pending requests */}
                {user.role === 'user' && !user.requested_role && (
                    <RoleRequestCard user={user} onRequestRole={requestRole} />
                )}
                
                <DashboardHeader userData={userData} levelProgress={levelProgress} avatarStyle={avatarStyle} headerTheme={headerTheme} />
                
                {/* Combined Content */}
                <div className="space-y-8">
                    {/* Overview Section */}
                    <OverviewTabContent dashboardData={dashboardData} />
                    
                    {/* Progress Section */}
                    <ProgressTabContent dashboardData={dashboardData} userData={userData} levelProgress={levelProgress} />
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
//Josh Andrei Aguiluz
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { BookOpen, PlusCircle, User, Settings, BarChart, TreePine, Recycle, Droplets, Sun, Zap, Activity, Badge, Trophy, CheckCircle, Clock, List, ChevronRight, Award } from 'lucide-react';

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

const ImpactSection = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border">
        <h3 className="text-xl font-bold mb-4">Environmental Impact</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
            <ImpactCard icon={<TreePine/>} value="8" label="Trees Planted" color="bg-green-100 text-green-800" />
            <ImpactCard icon={<Recycle/>} value="15.2" label="kg Waste Collected" color="bg-blue-100 text-blue-800" />
            <ImpactCard icon={<Sun/>} value="42.5" label="kWh Energy Saved" color="bg-yellow-100 text-yellow-800" />
            <ImpactCard icon={<Droplets/>} value="156" label="L Water Saved" color="bg-cyan-100 text-cyan-800" />
            <ImpactCard icon={<Zap/>} value="23.8" label="kg CO₂ Reduced" color="bg-gray-200 text-gray-800" />
        </div>
        <div className="bg-green-50 text-green-800 p-4 rounded-lg text-center text-sm">
            <strong>Your Environmental Contribution:</strong> Amazing work! Your actions have made a real difference for our planet.
        </div>
    </div>
);
const AchievementSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h3 className="text-xl font-bold mb-4">Recent Achievements</h3>
            <div className="space-y-3">
                <ActivityItem icon={<Badge className="text-green-500"/>} title="Tree Hugger" subtitle="Plant 5 trees" time="3 days ago" />
                <ActivityItem icon={<Trophy className="text-yellow-500"/>} title="Recycling Champion" subtitle="Complete 5 recycling quests" time="1 week ago" />
                <ActivityItem icon={<Clock className="text-orange-500"/>} title="Week Warrior" subtitle="Complete quests for 7 consecutive days" time="3 days ago" />
            </div>
            <button className="font-semibold text-green-600 mt-4 text-sm hover:underline">View All Badges</button>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h3 className="text-xl font-bold mb-4">Badge Collection</h3>
            <div className="bg-purple-50 text-purple-800 p-6 rounded-xl text-center">
                <p className="text-5xl font-bold">0</p>
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

const OverviewTabContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard icon={<CheckCircle className="w-8 h-8 text-green-500" />} value="12" label="Quests Completed" change="+1 this month" />
                <StatCard icon={<Award className="w-8 h-8 text-orange-500" />} value="0" label="Badges Earned" change="+0 new" />
                <StatCard icon={<Trophy className="w-8 h-8 text-yellow-500" />} value="0" label="Eco Points" change="+150 this week" />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border">
                <h3 className="text-xl font-bold mb-4">Quick Adventures</h3>
                <div className="space-y-3">
                    <QuickLink icon={<BookOpen className="w-5 h-5 text-blue-500" />} title="Browse Quests" subtitle="Discover new adventures" />
                    <QuickLink icon={<PlusCircle className="w-5 h-5 text-purple-500" />} title="Submit Proposal" subtitle="Pitch your own quest ideas" />
                    <QuickLink icon={<Users className="w-5 h-5 text-green-500" />} title="View Community" subtitle="Connect with Eco-Heroes" />
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            <div className="space-y-4">
                <ActivityItem icon={<CheckCircle className="w-5 h-5 text-green-500" />} title="Completed 'Campus Tree Planting'" subtitle="You earned the Tree Hugger badge" time="2 hours ago" points="+50 points" />
                <ActivityItem icon={<User className="w-5 h-5 text-blue-500" />} title="Maria Santos is now your friend" subtitle="You can now see each other's progress" time="1 day ago" />
            </div>
        </div>
    </div>
);

const ProgressTabContent = () => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border text-center">
                    <h3 className="text-xl font-bold mb-2">Level 1</h3>
                    <p className="text-gray-500 text-sm mb-4">Environmental Champion</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: '0%' }}></div></div>
                    <p className="text-xs text-gray-500">100 more points needed</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border">
                    <h3 className="text-xl font-bold mb-4">Streaks & Goals</h3>
                    <GoalItem title="Day Streak" value="7" progress={7/15 * 100} label="Longest Streak: 15 days" />
                    <GoalItem title="Weekly Goal" value="112/150" progress={112/150 * 100} label="Earn 150 eco-points this week" />
                    <GoalItem title="Monthly Goal" value="2/3" progress={2/3 * 100} label="Complete 3 new quests this month" />
                </div>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border">
                <h3 className="text-xl font-bold mb-4">Quest Progress</h3>
                <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                    <QuestStat icon={<CheckCircle className="w-8 h-8 text-green-500" />} value="12" label="Completed" />
                    <QuestStat icon={<Clock className="w-8 h-8 text-blue-500" />} value="3" label="In Progress" />
                    <QuestStat icon={<List className="w-8 h-8 text-gray-500" />} value="25" label="Available" />
                </div>
                <h4 className="font-semibold mb-4">Progress by Category</h4>
                <CategoryProgress icon={<Recycle className="w-5 h-5 text-blue-500"/>} title="Recycling & Waste" value="4 of 8 quests" progress={50} />
                <CategoryProgress icon={<Sun className="w-5 h-5 text-yellow-500"/>} title="Energy Conservation" value="3 of 6 quests" progress={50} />
                <CategoryProgress icon={<Droplets className="w-5 h-5 text-cyan-500"/>} title="Water Conservation" value="2 of 5 quests" progress={40} />
                <CategoryProgress icon={<TreePine className="w-5 h-5 text-green-500"/>} title="Gardening & Planting" value="3 of 4 quests" progress={75} />
            </div>
        </div>
        <ImpactSection />
        <AchievementSection />
    </div>
);

// --- Main Dashboard Component ---
const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { user } = useUser();

    if (!user) {
        return <div className="pt-24 text-center">Loading Dashboard...</div>;
    }

    const userData = {
        name: user.username,
        title: 'Environmental Champion',
        level: Math.floor((user.points || 0) / 100) + 1,
        points: user.points || 0,
        pointsToNextLevel: 100,
    };

    const levelProgress = (userData.points / userData.pointsToNextLevel) * 100;

    // ✅ FIX: This component is now defined OUTSIDE the main component
    const TabButton = ({ id, label, icon }) => (
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

    // ✅ FIX: This component is now defined OUTSIDE the main component
    const DashboardHeader = () => (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-md">
                        {userData.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-bold w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                        {userData.level}
                    </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome back, {userData.name}! 👋</h2>
                    <p className="text-gray-500">{userData.title}</p>
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress to Level {userData.level + 1}</span>
                            <span>{userData.points} / {userData.pointsToNextLevel} eco-points</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${levelProgress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
    return (
        <div className="font-sans bg-app-bg text-gray-800">
            <main className="container mx-auto px-4 pt-24 pb-12">
                <DashboardHeader />
                <div className="bg-white p-2 rounded-full shadow-md border border-gray-100 inline-flex items-center gap-2 mb-8">
                    <TabButton id="overview" label="Overview" icon={<Activity className="w-4 h-4" />} />
                    <TabButton id="progress" label="Progress" icon={<BarChart className="w-4 h-4" />} />
                </div>
                {activeTab === 'overview' && <OverviewTabContent />}
                {activeTab === 'progress' && <ProgressTabContent />}
            </main>
        </div>
    );
};

export default DashboardPage;
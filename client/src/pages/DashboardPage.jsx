//Josh Andrei Aguiluz
import React, { useState, useEffect } from 'react';
import { useUser } from "../context/UserContext";
import { BookOpen, PlusCircle, User, Settings, BarChart, TreePine, Recycle, Droplets, Sun, Zap, Activity, Badge, Trophy, CheckCircle, Clock, List, ChevronRight, Award, UserCircle, Users, Crown, Building, Target, MapPin, Calendar, Search, TrendingUp, TrendingDown, XCircle, Eye, FileText, Heart, MessageCircle, Edit, Trash2, Share2, X, Save } from 'lucide-react';

// Helper to get avatar image
const getPostAvatarImage = (avatarTheme) => {
    const avatars = {
        'leaf': '/assets/avatars-headers/leaf-avatar.png',
        'sun': '/assets/avatars-headers/sun-avatar.png',
        'tree': '/assets/avatars-headers/tree-avatar.png',
        'water': '/assets/avatars-headers/water-avatar.png',
    };
    return avatars[avatarTheme] || '/assets/avatars-headers/leaf-avatar.png';
};

// --- ALL HELPER COMPONENTS ARE NOW DEFINED AT THE TOP LEVEL ---

const StatCard = ({ icon, value, label, change }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
        <div className="flex items-center gap-4">
            {icon}
            <div>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
                <p className="text-sm text-gray-600 font-semibold">{label}</p>
            </div>
        </div>
        {change && <p className="text-xs text-green-600 mt-2 font-semibold">{change}</p>}
    </div>
);
const QuickLink = ({ icon, title, subtitle, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all text-left">
        <div className="bg-gray-100 p-3 rounded-lg">{icon}</div>
        <div className="flex-1">
            <p className="font-semibold text-gray-800">{title}</p>
            <p className="text-xs text-gray-600">{subtitle}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
);
const ActivityItem = ({ icon, title, subtitle, time, points }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="mt-1">{icon}</div>
        <div className="flex-1">
            <p className="font-semibold text-sm text-gray-800">{title}</p>
            <p className="text-xs text-gray-600">{subtitle}</p>
        </div>
        <div className="text-right">
            <p className="text-xs text-gray-500">{time}</p>
            {points && <p className="text-xs font-bold text-green-600">{points}</p>}
        </div>
    </div>
);
const QuestStat = ({ icon, value, label }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-all">
        <div className="mx-auto w-fit mb-3">{icon}</div>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-600 font-semibold">{label}</p>
    </div>
);
const GoalItem = ({ title, value, progress, label }) => (
    <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex justify-between font-semibold text-sm mb-2">
            <p className="text-gray-800">{title}</p>
            <p className="text-green-600">{value}</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-xs text-gray-600">{label}</p>
    </div>
);
const CategoryProgress = ({ icon, title, value, progress }) => (
    <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-6">{icon}</div>
            <p className="font-semibold text-sm flex-1 text-gray-800">{title}</p>
            <p className="text-xs text-gray-600">{value}</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
    </div>
);
const ImpactCard = ({ icon, value, label, color }) => (
    <div className={`p-6 rounded-2xl text-center shadow-lg ${color}`}>
        <div className="mx-auto w-fit mb-3">{icon}</div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-white/90">{label}</p>
    </div>
);

// --- CHART COMPONENTS ---
const SimpleBarChart = ({ data, title, color = 'green' }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    const colorClasses = {
        green: 'bg-green-500',
        blue: 'bg-blue-500',
        orange: 'bg-orange-500',
        purple: 'bg-purple-500'
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="w-20 text-sm font-semibold text-gray-700">{item.label}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                            <div 
                                className={`h-full ${colorClasses[color]} rounded-full transition-all duration-500`}
                                style={{ width: `${(item.value / maxValue) * 100}%` }}
                            ></div>
                        </div>
                        <div className="w-12 text-sm font-bold text-gray-800">{item.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LineChart = ({ data, title, color = 'green' }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    const minValue = Math.min(...data.map(item => item.value));
    const range = maxValue - minValue;
    
    const colorClasses = {
        green: 'stroke-green-500',
        blue: 'stroke-blue-500',
        orange: 'stroke-orange-500',
        purple: 'stroke-purple-500'
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="h-32 relative">
                <svg className="w-full h-full" viewBox="0 0 300 100">
                    <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={colorClasses[color]}
                        points={data.map((item, index) => {
                            const x = (index / (data.length - 1)) * 300;
                            const y = 100 - ((item.value - minValue) / range) * 80;
                            return `${x},${y}`;
                        }).join(' ')}
                    />
                    {data.map((item, index) => {
                        const x = (index / (data.length - 1)) * 300;
                        const y = 100 - ((item.value - minValue) / range) * 80;
                        return (
                            <circle
                                key={index}
                                cx={x}
                                cy={y}
                                r="3"
                                fill="currentColor"
                                className={colorClasses[color]}
                            />
                        );
                    })}
                </svg>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
                {data.map((item, index) => (
                    <span key={index}>{item.label}</span>
                ))}
            </div>
        </div>
    );
};

const GroupedBarChart = ({ data, title, categories, colors = ['#3B82F6', '#10B981'] }) => {
    const maxValue = Math.max(...data.flat().map(item => item.value));
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="space-y-4">
                {data[0].map((item, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm font-semibold text-gray-700">
                            <span>{item.label}</span>
                            <span>{item.value}</span>
                        </div>
                        <div className="flex gap-2">
                            {data.map((dataset, datasetIndex) => {
                                const value = dataset[index]?.value || 0;
                                const percentage = (value / maxValue) * 100;
                                return (
                                    <div key={datasetIndex} className="flex-1">
                                        <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                                            <div 
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{ 
                                                    width: `${percentage}%`,
                                                    backgroundColor: colors[datasetIndex % colors.length]
                                                }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 text-center">
                                            {categories[datasetIndex]}: {value}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center gap-4 mt-4">
                {categories.map((category, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: colors[index % colors.length] }}
                        ></div>
                        <span className="text-sm text-gray-700">{category}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DonutChart = ({ data, title, size = 120 }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;
    
    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="flex items-center gap-6">
                <div className="relative" style={{ width: size, height: size }}>
                    <svg width={size} height={size} className="transform -rotate-90">
                        {data.map((item, index) => {
                            const percentage = (item.value / total) * 100;
                            const circumference = 2 * Math.PI * 45; // radius = 45
                            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                            const strokeDashoffset = -cumulativePercentage * circumference / 100;
                            
                            cumulativePercentage += percentage;
                            
                            return (
                                <circle
                                    key={index}
                                    cx="60"
                                    cy="60"
                                    r="45"
                                    fill="none"
                                    stroke={colors[index % colors.length]}
                                    strokeWidth="20"
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    className="transition-all duration-500"
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">{total}</div>
                            <div className="text-xs text-gray-500">Total</div>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: colors[index % colors.length] }}
                            ></div>
                            <span className="text-sm text-gray-700">{item.label}</span>
                            <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AchievementSection = ({ achievements, challengeBadges = [] }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Badge Collection</h3>
            {challengeBadges.length === 0 ? (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        🏆
            </div>
                    <p className="text-gray-500">No badges earned yet. Complete challenges to earn badges!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challengeBadges.map((badge, index) => (
                        <div key={index} className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm border border-purple-200 text-center hover:shadow-md transition-all">
                            {badge.image_url ? (
                                <img 
                                    src={badge.image_url} 
                                    alt={badge.name || 'Challenge Badge'} 
                                    className="w-20 h-20 mx-auto mb-4 rounded-lg object-cover shadow-md"
                                />
                            ) : (
                                <div className="w-20 h-20 mx-auto mb-4 bg-purple-200 rounded-lg flex items-center justify-center text-3xl">
                                    🏆
                                </div>
                            )}
                            <h4 className="font-bold text-lg mb-2 text-purple-800">
                                {badge.name || 'Challenge Badge'}
                            </h4>
                            <p className="text-purple-600 text-sm mb-2">
                                {badge.description || 'Earned from completing a challenge'}
                            </p>
                            <p className="text-xs text-purple-500">
                                Challenge Badge
                            </p>
            </div>
                    ))}
        </div>
            )}
    </div>
);

const OverviewTabContent = ({ dashboardData, onPageChange, userData }) => {
    // Generate chart data from dashboard data
    const weeklyProgressData = dashboardData.weeklyProgress || [
        { label: 'Mon', value: Math.floor(Math.random() * 20) + 5 },
        { label: 'Tue', value: Math.floor(Math.random() * 20) + 8 },
        { label: 'Wed', value: Math.floor(Math.random() * 20) + 12 },
        { label: 'Thu', value: Math.floor(Math.random() * 20) + 6 },
        { label: 'Fri', value: Math.floor(Math.random() * 20) + 15 },
        { label: 'Sat', value: Math.floor(Math.random() * 20) + 10 },
        { label: 'Sun', value: Math.floor(Math.random() * 20) + 7 }
    ];

    const categoryData = [
        { label: 'Recycling', value: dashboardData.categoryProgress['Recycling & Waste']?.completed || 0 },
        { label: 'Energy', value: dashboardData.categoryProgress['Energy Conservation']?.completed || 0 },
        { label: 'Water', value: dashboardData.categoryProgress['Water Conservation']?.completed || 0 },
        { label: 'Gardening', value: dashboardData.categoryProgress['Gardening & Planting']?.completed || 0 },
        { label: 'Education', value: dashboardData.categoryProgress['Education & Awareness']?.completed || 0 }
    ];

    const questTypeData = [
        { label: 'Completed', value: dashboardData.questsCompleted },
        { label: 'In Progress', value: dashboardData.questsInProgress },
        { label: 'Available', value: dashboardData.availableQuests }
    ];

    return (
        <div className="space-y-8">
            {/* User Level Display */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-xl shadow-sm text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Level {userData.level}</h3>
                        <p className="text-white/90">Environmental Champion</p>
                        <div className="mt-4">
                            <div className="flex justify-between text-sm text-white/80 mb-1">
                                <span>Progress to Level {userData.level + 1}</span>
                                <span>{userData.points % 100} / 100 points</span>
                            </div>
                            <div className="w-full bg-white/30 rounded-full h-2">
                                <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: `${((userData.points % 100) / 100) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold">{userData.points}</div>
                        <div className="text-sm text-white/80">Total Points</div>
                    </div>
                </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={<CheckCircle className="w-8 h-8 text-green-500" />} value={dashboardData.questsCompleted} label="Quests Completed" change="+1 this month" />
                <StatCard icon={<Target className="w-8 h-8 text-purple-500" />} value={dashboardData.challengesCompleted?.length || 0} label="Challenges Completed" change="+0 this month" />
                <StatCard icon={<Trophy className="w-8 h-8 text-yellow-500" />} value={dashboardData.ecoPoints} label="Eco Points" change="+150 this week" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold mb-4">Quick Adventures</h3>
                    <div className="space-y-3">
                        <QuickLink icon={<BookOpen className="w-5 h-5 text-blue-500" />} title="Browse Quests" subtitle="Discover new adventures" onClick={() => onPageChange('quests')} />
                        <QuickLink icon={<User className="w-5 h-5 text-green-500" />} title="View Community" subtitle="Connect with Eco-Heroes" onClick={() => onPageChange('community')} />
                    </div>
                </div>
                
                <AchievementSection achievements={dashboardData.achievements} challengeBadges={dashboardData.challengeBadges} />
            </div>

        </div>
    );
};

// --- QUESTS TAB ---
const QuestsTab = ({ onPageChange }) => {
    const [quests, setQuests] = useState([]);
    const [userSubmissions, setUserSubmissions] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [userChallengeSubmissions, setUserChallengeSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    useEffect(() => {
        fetchQuests();
        fetchUserSubmissions();
        fetchChallenges();
        fetchUserChallengeSubmissions();
    }, []);

    const fetchQuests = async () => {
        try {
            const { questAPI } = await import('../utils/api');
            const data = await questAPI.getAllQuests();
            setQuests(data);
        } catch (error) {
            console.error('Error fetching quests:', error);
        }
    };

    const fetchUserSubmissions = async () => {
        try {
            const { questAPI } = await import('../utils/api');
            const data = await questAPI.getMySubmissions();
            console.log('Fetched user submissions:', data);
            setUserSubmissions(data || []);
        } catch (error) {
            console.error('Error fetching user submissions:', error);
            setUserSubmissions([]);
        }
    };

    const fetchChallenges = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/challenges', {
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                const data = await response.json();
                setChallenges(data);
            }
        } catch (error) {
            console.error('Error fetching challenges:', error);
            setChallenges([]);
        }
    };

    const fetchUserChallengeSubmissions = async () => {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`/api/challenges/submissions/user/${user._id}`, {
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                const data = await response.json();
                setUserChallengeSubmissions(data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching challenge submissions:', error);
            setUserChallengeSubmissions([]);
            setLoading(false);
        }
    };

    const handleStartQuest = (questId) => {
        onPageChange('quest-details', questId);
    };

    // Calculate quest progress
    const completedQuests = userSubmissions.filter(s => s.status === 'approved').length;
    const pendingQuests = userSubmissions.filter(s => s.status === 'pending').length;
    const rejectedQuests = userSubmissions.filter(s => s.status === 'rejected').length;
    const availableQuests = quests.filter(q => 
        !userSubmissions.some(s => {
            const questId = s.quest_id?._id || s.quest_id;
            return questId === q._id;
        })
    ).length;

    // Get unique categories from quests
    const categories = [...new Set(quests.map(q => q.category))];

    // Filter submissions based on search and filters
    const filteredSubmissions = userSubmissions.filter(submission => {
        // Handle both populated and unpopulated quest_id
        const questId = submission.quest_id?._id || submission.quest_id;
        const quest = quests.find(q => q._id === questId);
        if (!quest) return false;
        
        const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             quest.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || quest.category === categoryFilter;
        
        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Filter available quests
    const filteredAvailableQuests = quests.filter(quest => {
        const hasSubmission = userSubmissions.some(s => {
            const questId = s.quest_id?._id || s.quest_id;
            return questId === quest._id;
        });
        if (hasSubmission) return false;
        
        const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             quest.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || quest.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });

    const filteredQuests = quests.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-3 text-gray-600">Loading your quests...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Quest Progress Cards */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold mb-6">Quest Progress</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="mx-auto w-fit mb-2">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <p className="text-2xl font-bold">{completedQuests}</p>
                        <p className="text-sm text-gray-500">Completed</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="mx-auto w-fit mb-2">
                            <Clock className="w-8 h-8 text-blue-500" />
                        </div>
                        <p className="text-2xl font-bold">{pendingQuests}</p>
                        <p className="text-sm text-gray-500">Pending</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="mx-auto w-fit mb-2">
                            <XCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <p className="text-2xl font-bold">{rejectedQuests}</p>
                        <p className="text-sm text-gray-500">Rejected</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="mx-auto w-fit mb-2">
                            <List className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-2xl font-bold">{availableQuests}</p>
                        <p className="text-sm text-gray-500">Available</p>
                    </div>
                </div>
                
                <h4 className="font-semibold mb-4">Progress by Category</h4>
                <div className="space-y-3">
                    {Object.entries(quests.reduce((acc, quest) => {
                        const category = quest.category;
                        if (!acc[category]) {
                            acc[category] = { total: 0, completed: 0 };
                        }
                        acc[category].total++;
                        if (userSubmissions.some(s => {
                            const questId = s.quest_id?._id || s.quest_id;
                            return questId === quest._id && s.status === 'approved';
                        })) {
                            acc[category].completed++;
                        }
                        return acc;
                    }, {})).map(([category, progress]) => {
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
                            <div key={category} className="mb-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-5">{getCategoryIcon(category)}</div>
                                    <p className="font-semibold text-sm flex-1">{category}</p>
                                    <p className="text-xs text-gray-500">{progress.completed} of {progress.total} quests</p>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search quests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 border-2 border-gray-200 rounded-lg px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-lg px-4 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Completed</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    
                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-lg px-4 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    </div>
                </div>

            {/* Quest Submissions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                    <List className="w-6 h-6 text-gray-500" />
                    <h3 className="text-xl font-bold">My Quest Submissions</h3>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-semibold">
                        {filteredSubmissions.length}
                    </span>
                        </div>
                
                {filteredSubmissions.length > 0 ? (
                    <div className="space-y-4">
                        {filteredSubmissions.map(submission => {
                            // Handle both populated and unpopulated quest_id
                            const questId = submission.quest_id?._id || submission.quest_id;
                            const quest = quests.find(q => q._id === questId);
                            if (!quest) {
                                console.log('Quest not found for submission:', submission);
                                return null;
                            }
                            
                            const getStatusColor = (status) => {
                                switch (status) {
                                    case 'approved': return 'bg-green-50 border-green-200';
                                    case 'pending': return 'bg-blue-50 border-blue-200';
                                    case 'rejected': return 'bg-red-50 border-red-200';
                                    default: return 'bg-gray-50 border-gray-200';
                                }
                            };
                            
                            const getStatusBadge = (status) => {
                                switch (status) {
                                    case 'approved': return 'bg-green-100 text-green-700';
                                    case 'pending': return 'bg-blue-100 text-blue-700';
                                    case 'rejected': return 'bg-red-100 text-red-700';
                                    default: return 'bg-gray-100 text-gray-700';
                                }
                            };
                            
                            return (
                                <div key={submission._id} className={`border rounded-xl p-5 ${getStatusColor(submission.status)}`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h4 className="text-lg font-bold">{quest.title}</h4>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(submission.status)}`}>
                                                    {submission.status === 'approved' ? 'Completed' : 
                                                     submission.status === 'pending' ? 'Pending Review' : 
                                                     submission.status === 'rejected' ? 'Rejected' : submission.status}
                                            </span>
                                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                                quest.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                                quest.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {quest.difficulty}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                                            <span className="flex items-center gap-1">
                                                <Target className="w-4 h-4" />
                                                {quest.category}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Award className="w-4 h-4" />
                                                {quest.points} points
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                    {submission.status === 'approved' ? 
                                                        `Completed: ${new Date(submission.approved_at || submission.submitted_at).toLocaleDateString()}` :
                                                        `Submitted: ${new Date(submission.submitted_at).toLocaleDateString()}`
                                                    }
                                            </span>
                                        </div>
                                            {submission.submission_text && (
                                                <p className="text-sm text-gray-600 line-clamp-2">{submission.submission_text}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                                onClick={() => onPageChange('quest-details', quest._id)}
                                                className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition font-semibold"
                                        >
                                                <Eye className="w-4 h-4" />
                                                View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                </div>
                ) : (
                    <div className="text-center py-12">
                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-600 mb-2">No Quest Submissions</h3>
                        <p className="text-gray-500 mb-4">You haven't submitted any quests yet.</p>
                        <button 
                            onClick={() => onPageChange('quests')}
                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
                        >
                            Browse Available Quests
                        </button>
            </div>
                )}
            </div>

            {/* My Challenge Submissions Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                    <Target className="w-6 h-6 text-purple-500" />
                    <h3 className="text-xl font-bold">My Challenge Submissions</h3>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-semibold">
                        {userChallengeSubmissions.length}
                    </span>
                </div>
                
                {userChallengeSubmissions.length > 0 ? (
                    <div className="space-y-4">
                        {userChallengeSubmissions.map(submission => {
                            const challenge = challenges.find(c => c._id === submission.challenge_id);
                            if (!challenge) return null;
                            
                            const getStatusColor = (status) => {
                                switch (status) {
                                    case 'approved': return 'bg-green-50 border-green-200';
                                    case 'pending': return 'bg-blue-50 border-blue-200';
                                    case 'rejected': return 'bg-red-50 border-red-200';
                                    default: return 'bg-gray-50 border-gray-200';
                                }
                            };
                            
                            const getStatusBadge = (status) => {
                                switch (status) {
                                    case 'approved': return 'bg-green-100 text-green-700';
                                    case 'pending': return 'bg-blue-100 text-blue-700';
                                    case 'rejected': return 'bg-red-100 text-red-700';
                                    default: return 'bg-gray-100 text-gray-700';
                                }
                            };
                            
                            return (
                                <div key={submission._id} className={`border rounded-xl p-5 ${getStatusColor(submission.status)}`}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h4 className="text-lg font-bold">{challenge.title}</h4>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(submission.status)}`}>
                                                    {submission.status === 'approved' ? 'Completed' : 
                                                     submission.status === 'pending' ? 'Pending Review' : 
                                                     submission.status === 'rejected' ? 'Rejected' : submission.status}
                                                </span>
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                                    Challenge
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                                            <span className="flex items-center gap-1">
                                                    <Award className="w-4 h-4" />
                                                    {challenge.points} points
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                    {submission.status === 'approved' ? 
                                                        `Completed: ${new Date(submission.approved_at || submission.submitted_at).toLocaleDateString()}` :
                                                        `Submitted: ${new Date(submission.submitted_at).toLocaleDateString()}`
                                                    }
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Trophy className="w-4 h-4" />
                                                    {challenge.badgeTitle || 'Challenge Badge'}
                                            </span>
                                        </div>
                                            {submission.reflection_text && (
                                                <p className="text-sm text-gray-600 line-clamp-2">{submission.reflection_text}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                                onClick={() => onPageChange('challenge-details', challenge._id)}
                                                className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition font-semibold"
                                        >
                                                <Eye className="w-4 h-4" />
                                                View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                </div>
                ) : (
                    <div className="text-center py-12">
                        <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-600 mb-2">No Challenge Submissions</h3>
                        <p className="text-gray-500 mb-4">You haven't submitted any challenges yet.</p>
                        <button 
                            onClick={() => onPageChange('community')}
                            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition font-semibold"
                        >
                            Browse Community Challenges
                        </button>
            </div>
                )}
            </div>

        </div>
    );
};

// --- NOTIFICATIONS TAB ---
const NotificationsTab = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/notifications', {
                headers: { 'x-auth-token': token }
            });
            
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: { 'x-auth-token': token }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Notifications</h3>
                    <button 
                        onClick={() => {
                            const token = localStorage.getItem('token');
                            fetch('/api/notifications/read-all', {
                                method: 'PUT',
                                headers: { 'x-auth-token': token }
                            }).then(() => fetchNotifications());
                        }}
                        className="text-sm text-green-600 hover:underline"
                    >
                        Mark all as read
                    </button>
                </div>

                {notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No notifications yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map(notification => (
                            <div 
                                key={notification._id} 
                                className={`p-4 rounded-lg border border-gray-200 transition ${
                                    notification.is_read ? 'bg-gray-50' : 'bg-white shadow-sm'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-sm">{notification.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        {!notification.is_read && (
                                            <button 
                                                onClick={() => markAsRead(notification._id)}
                                                className="text-xs text-green-600 hover:underline"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => deleteNotification(notification._id)}
                                            className="text-xs text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- ACHIEVEMENTS TAB ---
const AchievementsTab = () => {
    const [userQuests, setUserQuests] = useState([]);
    const [userChallengeSubmissions, setUserChallengeSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));
            
            // Fetch user's quest submissions
            const questsRes = await fetch('/api/quests/submissions/my', {
                headers: { 'x-auth-token': token }
            });
            if (questsRes.ok) {
                const questsData = await questsRes.json();
                setUserQuests(questsData);
            }

            // Fetch user's challenge submissions
            const challengeSubmissionsRes = await fetch(`/api/challenges/submissions/user/${user._id}`, {
                headers: { 'x-auth-token': token }
            });
            if (challengeSubmissionsRes.ok) {
                const challengeSubmissionsData = await challengeSubmissionsRes.json();
                setUserChallengeSubmissions(challengeSubmissionsData || []);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-3 text-gray-600">Loading achievements...</p>
            </div>
        );
    }

    // Create challenge badges array from approved submissions
    const challengeBadges = userChallengeSubmissions
        .filter(sub => sub.status === 'approved')
        .map(submission => ({
            name: submission.challenge_id?.badgeTitle || submission.challenge_id?.title || 'Challenge Badge',
            description: `Badge earned from completing ${submission.challenge_id?.title || 'challenge'}`,
            image_url: submission.challenge_id?.badge_url,
            challenge_id: submission.challenge_id?._id
        }));

    // Define quest achievements with progress tracking
    const questAchievements = [
        {
            id: 'first_quest',
            title: 'First Steps',
            description: 'Complete your first quest',
            icon: <Trophy className="w-5 h-5" />,
            color: 'green',
            requirement: 1,
            current: userQuests.length,
            completed: userQuests.length >= 1
        },
        {
            id: 'quest_master',
            title: 'Quest Master',
            description: 'Complete 5 quests',
            icon: <Award className="w-5 h-5" />,
            color: 'blue',
            requirement: 5,
            current: userQuests.length,
            completed: userQuests.length >= 5
        },
        {
            id: 'quest_champion',
            title: 'Quest Champion',
            description: 'Complete 10 quests',
            icon: <Crown className="w-5 h-5" />,
            color: 'purple',
            requirement: 10,
            current: userQuests.length,
            completed: userQuests.length >= 10
        },
        {
            id: 'gardening_expert',
            title: 'Gardening Expert',
            description: 'Complete 3 Gardening & Planting quests',
            icon: <TreePine className="w-5 h-5" />,
            color: 'green',
            requirement: 3,
            current: userQuests.filter(q => q.quest_id?.category === 'Gardening & Planting').length,
            completed: userQuests.filter(q => q.quest_id?.category === 'Gardening & Planting').length >= 3
        },
        {
            id: 'recycling_expert',
            title: 'Recycling Expert',
            description: 'Complete 3 Recycling & Waste quests',
            icon: <Recycle className="w-5 h-5" />,
            color: 'blue',
            requirement: 3,
            current: userQuests.filter(q => q.quest_id?.category === 'Recycling & Waste').length,
            completed: userQuests.filter(q => q.quest_id?.category === 'Recycling & Waste').length >= 3
        },
        {
            id: 'energy_expert',
            title: 'Energy Expert',
            description: 'Complete 3 Energy Conservation quests',
            icon: <Sun className="w-5 h-5" />,
            color: 'yellow',
            requirement: 3,
            current: userQuests.filter(q => q.quest_id?.category === 'Energy Conservation').length,
            completed: userQuests.filter(q => q.quest_id?.category === 'Energy Conservation').length >= 3
        },
        {
            id: 'water_expert',
            title: 'Water Expert',
            description: 'Complete 3 Water Conservation quests',
            icon: <Droplets className="w-5 h-5" />,
            color: 'cyan',
            requirement: 3,
            current: userQuests.filter(q => q.quest_id?.category === 'Water Conservation').length,
            completed: userQuests.filter(q => q.quest_id?.category === 'Water Conservation').length >= 3
        }
    ];

    return (
        <div className="space-y-6">
            {/* Quest Achievements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold mb-4">Quest Achievements</h3>
                {questAchievements.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No quest achievements available yet. Complete quests to unlock achievements!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {questAchievements.map((achievement) => (
                            <div 
                                key={achievement.id} 
                                className={`p-4 rounded-lg border transition-all ${
                                    achievement.completed 
                                        ? `bg-gradient-to-r from-${achievement.color}-50 to-${achievement.color}-100 border-${achievement.color}-200` 
                                        : 'bg-gray-50 border-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                        achievement.completed 
                                            ? `bg-${achievement.color}-500 text-white` 
                                            : 'bg-gray-300 text-gray-500'
                                    }`}>
                                        {achievement.completed ? achievement.icon : <Trophy className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-semibold ${
                                            achievement.completed 
                                                ? `text-${achievement.color}-800` 
                                                : 'text-gray-600'
                                        }`}>
                                            {achievement.title}
                                        </h4>
                                        <p className={`text-sm ${
                                            achievement.completed 
                                                ? `text-${achievement.color}-600` 
                                                : 'text-gray-500'
                                        }`}>
                                            {achievement.description}
                                        </p>
                                        <div className="mt-2">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className={achievement.completed ? `text-${achievement.color}-700` : 'text-gray-500'}>
                                                    Progress: {achievement.current}/{achievement.requirement}
                                                </span>
                                                <span className={achievement.completed ? `text-${achievement.color}-700 font-semibold` : 'text-gray-500'}>
                                                    {achievement.completed ? '✓ Completed' : 'In Progress'}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full transition-all duration-300 ${
                                                        achievement.completed 
                                                            ? `bg-${achievement.color}-500` 
                                                            : 'bg-gray-400'
                                                    }`}
                                                    style={{ 
                                                        width: `${Math.min((achievement.current / achievement.requirement) * 100, 100)}%` 
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const ProgressTabContent = ({ dashboardData, userData, levelProgress }) => {
    const [quests, setQuests] = useState([]);
    const [userSubmissions, setUserSubmissions] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [userChallengeSubmissions, setUserChallengeSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    useEffect(() => {
        fetchQuests();
        fetchUserSubmissions();
        fetchChallenges();
        fetchUserChallengeSubmissions();
    }, []);

    const fetchQuests = async () => {
        try {
            const { questAPI } = await import('../utils/api');
            const data = await questAPI.getAllQuests();
            setQuests(data);
        } catch (error) {
            console.error('Error fetching quests:', error);
        }
    };

    const fetchUserSubmissions = async () => {
        try {
            const { questAPI } = await import('../utils/api');
            const data = await questAPI.getMySubmissions();
            console.log('Fetched user submissions:', data);
            setUserSubmissions(data || []);
        } catch (error) {
            console.error('Error fetching user submissions:', error);
            setUserSubmissions([]);
        }
    };

    const fetchChallenges = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/challenges', {
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                const data = await response.json();
                setChallenges(data);
            }
        } catch (error) {
            console.error('Error fetching challenges:', error);
            setChallenges([]);
        }
    };

    const fetchUserChallengeSubmissions = async () => {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`/api/challenges/submissions/user/${user._id}`, {
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                const data = await response.json();
                setUserChallengeSubmissions(data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching challenge submissions:', error);
            setUserChallengeSubmissions([]);
            setLoading(false);
        }
    };

    // Filter quest submissions based on search term and category
    const filteredQuestSubmissions = userSubmissions.filter(submission => {
        const questId = submission.quest_id?._id || submission.quest_id;
        const quest = quests.find(q => q._id === questId);
        if (!quest) return false;
        
        const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             quest.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || quest.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });

    // Get unique categories from quests
    const categories = [...new Set(quests.map(quest => quest.category))];

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-3 text-gray-600">Loading your progress...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Search and Filter Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search quest submissions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="md:w-64">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                </div>
                </div>
            </div>

            {/* Quest Submissions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold mb-4">Quest Submissions</h3>
                {filteredQuestSubmissions.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            🎯
                        </div>
                        <p className="text-gray-500">
                            {userSubmissions.length === 0 
                                ? "No quest submissions yet. Start completing quests to build your quest history!"
                                : "No quest submissions match your search criteria."
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredQuestSubmissions.map((submission, index) => {
                            const questId = submission.quest_id?._id || submission.quest_id;
                            const quest = quests.find(q => q._id === questId);
                            if (!quest) return null;
                            
                            return (
                                <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg text-gray-900 truncate">{quest.title}</h3>
                                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{quest.description}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-3 flex-shrink-0 ${
                                            submission.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            submission.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {submission.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                                        <span>Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</span>
                                        <span>{quest.points} points</span>
                                        <span>Category: {quest.category}</span>
                                        <span>Difficulty: {quest.difficulty}</span>
                                    </div>
                                    <div className="flex justify-end">
                                        <button 
                                            onClick={() => window.location.href = `/quest-details/${quest._id}`}
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm font-semibold"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Challenge Submissions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold mb-4">Challenge Submissions</h3>
                {userChallengeSubmissions.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            🏆
                        </div>
                        <p className="text-gray-500">No challenge submissions yet. Start completing challenges to build your challenge history!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {userChallengeSubmissions.map((submission, index) => {
                            const challenge = challenges.find(c => c._id === submission.challenge_id);
                            if (!challenge) return null;
                            
                            return (
                                <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg text-gray-900 truncate">{challenge.title}</h3>
                                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{challenge.description}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-3 flex-shrink-0 ${
                                            submission.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            submission.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {submission.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                                        <span>Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</span>
                                        <span>{challenge.points} points</span>
                                        <span>Badge: {challenge.badgeTitle || 'Challenge Badge'}</span>
                                    </div>
                                    <div className="flex justify-end">
                                        <button 
                                            onClick={() => window.location.href = `/challenge-details/${challenge._id}`}
                                            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition text-sm font-semibold"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- COMMUNITY TAB ---
const CommunityTab = ({ onPageChange }) => {
    const [posts, setPosts] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [userChallengeSubmissions, setUserChallengeSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'posts', 'challenges'
    const [showPostModal, setShowPostModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    useEffect(() => {
        fetchCommunityData();
    }, []);

    const fetchCommunityData = async () => {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));

            console.log('🔍 Fetching community data for user:', user._id);

            // Fetch user's posts
            const postsRes = await fetch('/api/posts', {
                headers: { 'x-auth-token': token }
            });
            console.log('📝 Posts API Response Status:', postsRes.status);
            
            if (postsRes.ok) {
                const postsData = await postsRes.json();
                console.log('📝 All Posts Data:', postsData);
                
                const userPosts = postsData.filter(p => p.author?._id === user._id || p.author === user._id);
                console.log('📝 User Posts (filtered):', userPosts);
                
                // Transform posts to include proper author data
                const transformedPosts = userPosts.map(post => ({
                    ...post,
                    author: {
                        _id: post.author?._id || post.author,
                        username: post.author?.username || 'Unknown',
                        avatar_theme: post.author?.avatar_theme || 'leaf',
                        avatar: getPostAvatarImage(post.author?.avatar_theme || 'leaf')
                    }
                }));
                setPosts(transformedPosts);
            } else {
                console.error('❌ Failed to fetch posts:', postsRes.statusText);
                setPosts([]);
            }

            // Fetch community challenges
            const challengesRes = await fetch('/api/challenges', {
                headers: { 'x-auth-token': token }
            });
            console.log('🎯 Challenges API Response Status:', challengesRes.status);
            
            if (challengesRes.ok) {
                const challengesData = await challengesRes.json();
                console.log('🎯 All Challenges Data:', challengesData);
                setChallenges(challengesData);
            } else {
                console.error('❌ Failed to fetch challenges:', challengesRes.statusText);
                setChallenges([]);
            }

            // Fetch user's challenge submissions
            const submissionsRes = await fetch(`/api/challenges/submissions/user/${user._id}`, {
                headers: { 'x-auth-token': token }
            });
            console.log('📋 Challenge Submissions API Response Status:', submissionsRes.status);
            
            if (submissionsRes.ok) {
                const submissionsData = await submissionsRes.json();
                console.log('📋 User Challenge Submissions Data:', submissionsData);
                setUserChallengeSubmissions(submissionsData);
            } else {
                console.error('❌ Failed to fetch challenge submissions:', submissionsRes.statusText);
                setUserChallengeSubmissions([]);
            }

            setLoading(false);
        } catch (error) {
            console.error('❌ Error fetching community data:', error);
            setLoading(false);
        }
    };

    const handleSavePost = async (postData) => {
        try {
            const token = localStorage.getItem('token');

            if (editingPost) {
                // Update existing post
                const payload = {
                    title: postData.title,
                    content: postData.content,
                    category: postData.category,
                    tags: postData.tags.split(',').map(t => t.trim()).filter(t => t)
                };

                const response = await fetch(`/api/posts/${editingPost._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error('Failed to update post');
                const updatedPost = await response.json();
                setPosts(posts.map(p => p._id === editingPost._id ? updatedPost : p));
            } else {
                // Create new post
                const formData = new FormData();
                formData.append('title', postData.title);
                formData.append('content', postData.content);
                formData.append('category', postData.category);
                formData.append('tags', JSON.stringify(postData.tags.split(',').map(t => t.trim()).filter(t => t)));

                if (postData.image) {
                    formData.append('image', postData.image);
                }

                const response = await fetch('/api/posts', {
                    method: 'POST',
                    headers: {
                        'x-auth-token': token
                    },
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || 'Failed to create post');
                }
                const newPost = await response.json();
                setPosts([newPost, ...posts]);
            }

            setShowPostModal(false);
            setEditingPost(null);
        } catch (error) {
            console.error('Error saving post:', error);
            alert(`Failed to save post: ${error.message}`);
        }
    };

    const handleDeletePost = async (id) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/posts/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
            });
            setPosts(posts.filter(p => p._id !== id));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Create challenges with user progress
    const challengesWithProgress = challenges.map(challenge => {
        const userSubmission = userChallengeSubmissions.find(sub => 
            sub.challenge_id?._id === challenge._id || sub.challenge_id === challenge._id
        );
        
        return {
            ...challenge,
            userSubmission,
            userProgress: userSubmission ? {
                status: userSubmission.status,
                submittedAt: userSubmission.submitted_at,
                points: userSubmission.status === 'approved' ? challenge.points : 0
            } : null
        };
    });

    const filteredChallenges = challengesWithProgress.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-3 text-gray-600">Loading community data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h3 className="text-xl font-bold">My Community Content</h3>
                        <p className="text-sm text-gray-500">Manage your posts and view community challenges</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingPost(null);
                            setShowPostModal(true);
                        }}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Create Post
                    </button>
                    </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    {/* Search Bar - Left */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-colors"
                    />
                </div>
                    
                    {/* Filters - Right */}
                    <div className="flex gap-2 flex-wrap">
                        {['All', 'Posts', 'Challenges'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter.toLowerCase())}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                    activeFilter === filter.toLowerCase()
                                        ? 'bg-green-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                </div>
            </div>

                    <div className="space-y-4">
                    {/* Posts Section */}
                    {(activeFilter === 'all' || activeFilter === 'posts') && (
                        <div>
                            <h4 className="text-lg font-semibold mb-3 text-gray-800">My Posts</h4>
                            {filteredPosts.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm">No posts found</p>
                                    </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredPosts.map(post => (
                                        <div key={post._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                                            <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                        <h4 className="text-lg font-bold">{post.title}</h4>
                                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                                            {post.category}
                                                        </span>
                                    </div>
                                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {new Date(post.created_at).toLocaleDateString()}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-4 h-4" />
                                                            {post.views || 0} views
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Heart className="w-4 h-4" />
                                                            {post.likes?.length || 0} likes
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MessageCircle className="w-4 h-4" />
                                                            {post.comments?.length || 0} comments
                                                        </span>
                                    </div>
                                                    {post.tags && post.tags.length > 0 && (
                                                        <div className="flex gap-2 mt-2 flex-wrap">
                                                            {post.tags.map((tag, idx) => (
                                                                <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingPost({ ...post, tags: post.tags?.join(', ') || '' });
                                                            setShowPostModal(true);
                                                        }}
                                                        className="p-2 hover:bg-blue-50 rounded-lg transition"
                                                    >
                                                        <Edit className="w-5 h-5 text-blue-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePost(post._id)}
                                                        className="p-2 hover:bg-red-50 rounded-lg transition"
                                                    >
                                                        <Trash2 className="w-5 h-5 text-red-600" />
                                                    </button>
                                                </div>
                                </div>
                            </div>
                        ))}
                    </div>
                            )}
                </div>
            )}

                    {/* Challenges Section */}
                    {(activeFilter === 'all' || activeFilter === 'challenges') && (
                        <div>
                            <h4 className="text-lg font-semibold mb-3 text-gray-800">My Community Challenges</h4>
                            {filteredChallenges.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm">No challenges found</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredChallenges.map(challenge => {
                                        const getStatusColor = (status) => {
                                            switch (status) {
                                                case 'approved': return 'bg-green-100 text-green-700';
                                                case 'pending': return 'bg-yellow-100 text-yellow-700';
                                                case 'rejected': return 'bg-red-100 text-red-700';
                                                default: return 'bg-gray-100 text-gray-700';
                                            }
                                        };

                                        const getStatusText = (status) => {
                                            switch (status) {
                                                case 'approved': return 'Completed';
                                                case 'pending': return 'Pending Review';
                                                case 'rejected': return 'Rejected';
                                                default: return 'Not Started';
                                            }
                                        };

                    return (
                                            <div key={challenge._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                                                <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                            <h4 className="text-lg font-bold">{challenge.title}</h4>
                                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                                                Challenge
                                                            </span>
                                                            {challenge.userProgress && (
                                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(challenge.userProgress.status)}`}>
                                                                    {getStatusText(challenge.userProgress.status)}
                                                                </span>
                                                            )}
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                                challenge.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                            }`}>
                                                                {challenge.isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                </div>
                                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{challenge.description}</p>
                                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                {new Date(challenge.created_at).toLocaleDateString()}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Users className="w-4 h-4" />
                                                                {challenge.participants?.length || 0} participants
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Target className="w-4 h-4" />
                                                                {challenge.userProgress ? 
                                                                    `${challenge.userProgress.status === 'approved' ? '1' : '0'} / 1 progress` :
                                                                    '0 / 1 progress'
                                                                }
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Award className="w-4 h-4" />
                                                                {challenge.userProgress?.points || 0} / {challenge.points || 0} points
                                                            </span>
                                                            {challenge.userProgress?.submittedAt && (
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-4 h-4" />
                                                                    Submitted: {new Date(challenge.userProgress.submittedAt).toLocaleDateString()}
                                                                </span>
                                                            )}
                                </div>
                            </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => onPageChange('challenge-details', challenge._id)}
                                                            className="p-2 hover:bg-green-50 rounded-lg transition"
                                                        >
                                                            <Eye className="w-5 h-5 text-green-600" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                    );
                })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* No content message */}
                    {activeFilter === 'all' && filteredPosts.length === 0 && filteredChallenges.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No content found. Create your first post!</p>
                </div>
                    )}
            </div>
            </div>

            {/* Post Modal */}
            {showPostModal && (
                <PostModal
                    post={editingPost}
                    onClose={() => {
                        setShowPostModal(false);
                        setEditingPost(null);
                    }}
                    onSave={handleSavePost}
                />
            )}
        </div>
    );
};

// --- POST MODAL ---
const PostModal = ({ post, onClose, onSave }) => {
    const [formData, setFormData] = useState(post || {
        title: '',
        category: 'Updates',
        content: '',
        tags: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

                    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{post ? 'Edit Post' : 'Create New Post'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <X className="w-5 h-5" />
                    </button>
                    </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Post Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., Tips for Sustainable Living"
                    />
                </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option>Updates</option>
                            <option>Environmental Tips</option>
                            <option>Success Stories</option>
                            <option>Events</option>
                            <option>News</option>
                        </select>
            </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Content</label>
                        <textarea
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows="8"
                            placeholder="Write your post content here..."
                        />
                </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Tags (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., sustainability, recycling, climate"
                        />
            </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Post Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Optional: Upload an image for this post</p>
        </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold flex items-center justify-center gap-2"
                        >
                            <Share2 className="w-5 h-5" />
                            {post ? 'Update Post' : 'Publish Post'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition font-semibold"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
    </div>
);
};

// TabButton component
const TabButton = ({ id, label, icon, activeTab, setActiveTab }) => (
    <button
        data-tab={id}
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
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl shadow-sm mb-6 text-white sticky top-20 z-30">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                        <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">🚀 Upgrade Your Account</h3>
                        <p className="text-white/90 text-sm">
                            Ready for more responsibilities? Request Partner or Admin access!
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-semibold transition text-sm"
                    >
                        Request Role
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
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
    return avatars[avatarName] || avatars["Girl Avatar 1"]; // Default avatar
};

// Header theme mapping
const getHeaderTheme = (themeName) => {
    const themes = {
        orange: "from-orange-400 to-pink-500",
        green: "from-green-400 to-emerald-600",
        blue: "from-blue-400 to-indigo-500",
    };
    return themes[themeName] || themes.orange; // Default theme
};

const DashboardHeader = ({ userData, levelProgress, avatarStyle, headerTheme }) => (
    <div className={`bg-gradient-to-r ${headerTheme} p-8 rounded-xl shadow-sm mb-8 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-xl"></div>
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
                <div className={`w-24 h-24 rounded-full ${avatarStyle.bg} flex items-center justify-center shadow-lg border-4 border-white/20`}>
                    <UserCircle className={`w-20 h-20 ${avatarStyle.color}`} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm font-bold w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                    {userData.level}
                </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-4 mb-3">
                    <h2 className="text-4xl font-bold text-white">Welcome back, {userData.name}! 👋</h2>
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/20 text-white backdrop-blur-sm">
                        Environmental Champion
                    </span>
                </div>
                <p className="text-white/90 text-lg mb-4">{userData.title}</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex justify-between text-sm text-white/90 mb-2">
                        <span className="font-semibold">Progress to Level {userData.level + 1}</span>
                        <span className="font-bold">{userData.points % 100} / 100 eco-points</span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-3">
                        <div className="bg-white h-3 rounded-full transition-all duration-500 shadow-lg" style={{ width: `${Math.min(levelProgress || 0, 100)}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- Main Dashboard Component ---
const DashboardPage = ({ onPageChange }) => { // Added onPageChange prop
    const { user, logout, requestRole } = useUser();
    const [activeTab, setActiveTab] = useState('overview');
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

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        } else {
            setLoading(false); // If no user, stop loading
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'x-auth-token': token };

            // Fetch user dashboard data
            const dashboardRes = await fetch('/api/dashboard/user', { headers });
            const dashboardData = await dashboardRes.json();
            
            if(!dashboardRes.ok) {
                throw new Error(dashboardData.msg || "Failed to fetch dashboard data");
            }

            console.log('Dashboard data loaded:', dashboardData);

            // Create recent activity from actual data
            const recentActivity = [
                ...(dashboardData.submissions || []).slice(0, 3).map(s => ({
                    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
                    title: `Completed '${s.quest?.title || 'a quest'}'`,
                    subtitle: `You earned ${s.points_earned || 0} points`,
                    time: new Date(s.submitted_at).toLocaleDateString(),
                    points: `+${s.points_earned || 0} points`
                })),
                ...(dashboardData.posts || []).slice(0, 2).map(p => ({
                    icon: <User className="w-5 h-5 text-blue-500" />,
                    title: `Posted: ${p.title}`,
                    subtitle: 'Shared with the community',
                    time: new Date(p.created_at).toLocaleDateString()
                }))
            ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

            // Fetch community challenges
            const challengesRes = await fetch('/api/challenges', { headers });
            const challengesData = challengesRes.ok ? await challengesRes.json() : [];

            // Fetch user's approved challenge submissions for badges
            const challengeSubmissionsRes = await fetch(`/api/challenges/submissions/user/${user._id}`, { headers });
            const challengeSubmissions = challengeSubmissionsRes.ok ? await challengeSubmissionsRes.json() : [];
            const approvedSubmissions = challengeSubmissions.filter(sub => sub.status === 'approved');
            
            // Get challenge badges from approved submissions
            const challengeBadges = approvedSubmissions.map(submission => {
                const challenge = challengesData.find(c => c._id === submission.challenge_id);
                return challenge ? {
                    ...challenge,
                    badge_url: challenge.badge_url,
                    badgeTitle: challenge.badgeTitle,
                    title: challenge.title
                } : null;
            }).filter(Boolean);

            // Get user's completed challenges from dashboard data
            const completedChallenges = dashboardData.challengesCompleted || [];
            const completedChallengeBadges = completedChallenges.map(challenge => ({
                ...challenge,
                image_url: challenge.badge_url,
                name: challenge.badgeTitle,
                title: challenge.title
            }));

            // Update dashboard data with real backend data
            setDashboardData({
                questsCompleted: dashboardData.questsCompleted?.length || 0,
                badgesEarned: dashboardData.badges?.length || 0,
                ecoPoints: dashboardData.user?.points || 0,
                questsInProgress: dashboardData.questsInProgress || 0,
                availableQuests: dashboardData.availableQuests || 0,
                recentActivity: recentActivity,
                achievements: dashboardData.badges?.progress || [],
                categoryProgress: dashboardData.categoryProgress || {},
                currentStreak: dashboardData.user?.streaks?.current_streak || 0,
                longestStreak: dashboardData.user?.streaks?.longest_streak || 0,
                weeklyPoints: dashboardData.weeklyPoints || 0,
                monthlyQuests: dashboardData.monthlyQuests || 0,
                communityChallenges: challengesData.filter(c => c.isActive).slice(0, 3),
                challengeBadges: [...challengeBadges, ...completedChallengeBadges],
                challengesCompleted: completedChallenges,
                weeklyProgress: dashboardData.weeklyProgress || [
                    { label: 'Mon', value: Math.floor(Math.random() * 20) + 5 },
                    { label: 'Tue', value: Math.floor(Math.random() * 20) + 8 },
                    { label: 'Wed', value: Math.floor(Math.random() * 20) + 12 },
                    { label: 'Thu', value: Math.floor(Math.random() * 20) + 6 },
                    { label: 'Fri', value: Math.floor(Math.random() * 20) + 15 },
                    { label: 'Sat', value: Math.floor(Math.random() * 20) + 10 },
                    { label: 'Sun', value: Math.floor(Math.random() * 20) + 7 }
                ],
                goals: dashboardData.user?.goals || {
                    energy_conservation: { current: 0, target: 10 },
                    water_saved: { current: 0, target: 500 },
                    trees_planted: { current: 0, target: 5 }
                }
            });
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };
    
    // --- FIX START ---
    // This is the main cause of the white screen.
    // If the user is not loaded yet, we should show a loading indicator.
    if (loading) {
        return (
            <div className="pt-24 text-center">
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your dashboard...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="pt-24 text-center">
                <p>Please log in to view your dashboard.</p>
            </div>
        );
    }

    // This block was causing the crash. We create a safe `userData` object with defaults.
    const userData = {
        name: user.username || 'Eco Hero',
        title: 'Environmental Champion', // This can be dynamic later
        level: Math.floor((user.points || 0) / 100) + 1,
        points: user.points || 0,
        pointsToNextLevel: 100, // This should come from your backend if it's dynamic
        avatar: user.avatar || 'Girl Avatar 1', // Provide a default
        headerTheme: user.headerTheme || 'orange', // Provide a default
    };
    
    const avatarStyle = getAvatarStyles(userData.avatar);
    const headerTheme = getHeaderTheme(userData.headerTheme);
    const levelProgress = ((userData.points % 100) / 100) * 100;
    // --- FIX END ---
    
    return (
        <div className="font-sans bg-gray-50 text-gray-800 min-h-screen">
            <main className="container mx-auto px-6 pt-24 pb-12">
                {user.requested_role && !user.is_approved && (
                    <PendingApprovalCard user={user} />
                )}
                
                {user.role === 'user' && !user.requested_role && (
                    <RoleRequestCard user={user} onRequestRole={requestRole} />
                )}
                
                <DashboardHeader userData={userData} levelProgress={levelProgress} avatarStyle={avatarStyle} headerTheme={headerTheme} />
                
                {/* Navigation Tabs */}
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 inline-flex items-center gap-3 mb-8">
                    <TabButton id="overview" label="Overview" icon={<BarChart className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="achievements" label="Achievements" icon={<Trophy className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="notifications" label="Notifications" icon={<Users className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        <OverviewTabContent dashboardData={dashboardData} onPageChange={onPageChange} userData={userData} />
                    </div>
                )}
                {activeTab === 'achievements' && <AchievementsTab />}
                {activeTab === 'notifications' && <NotificationsTab />}
            </main>
        </div>
    );
};

export default DashboardPage;


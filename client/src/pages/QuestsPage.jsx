//Josh Andrei Aguiluz
import React, { useState, useEffect } from 'react';
import { Search, Droplets, TreePine, Recycle, Sun, Leaf, Building, Clock, Users, Award, Lightbulb, BookOpen, Smile, Camera, Handshake } from 'lucide-react';
import QuestDetailsPage from './QuestDetailsPage'; 
import { questAPI } from '../utils/api';
import { useUser } from '../context/UserContext';
import FacebookIcon from '../img/Facebook.png';
import InstagramIcon from '../img/Instagram.png';
import TiktokIcon from '../img/Tiktok.png';

// --- QUEST CARD COMPONENT (Modified) ---

const QuestCard = ({ icon, title, description, difficulty, points, duration, participants, progress, color, onViewDetails, questData, user }) => {
  const difficultyStyles = {
    Easy: 'bg-green-100 text-green-600',
    Medium: 'bg-yellow-100 text-yellow-600',
    Hard: 'bg-red-100 text-red-600',
  };
  
  const colorVariants = {
    green: { bg: 'bg-green-500', hover: 'hover:bg-green-600', iconBg: 'bg-green-100' },
    yellow: { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600', iconBg: 'bg-yellow-100' },
    blue: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', iconBg: 'bg-blue-100' },
    cyan: { bg: 'bg-cyan-500', hover: 'hover:bg-cyan-600', iconBg: 'bg-cyan-100' },
    lime: { bg: 'bg-lime-500', hover: 'hover:bg-lime-600', iconBg: 'bg-lime-100' },
    indigo: { bg: 'bg-indigo-500', hover: 'hover:bg-indigo-600', iconBg: 'bg-indigo-100' },
  };
  const activeColor = colorVariants[color] || colorVariants.green;

  // Check if quest is full
  const currentParticipants = questData?.completions?.length || participants || 0;
  const maxParticipants = questData?.maxParticipants || 100;
  const isQuestFull = currentParticipants >= maxParticipants;

  // Determine button text and style based on submission status
  const getButtonText = () => {
    if (!user) return 'Login to Start';
    // Admin and Partner can only view, not participate
    if (user.role === 'admin' || user.role === 'partner') return 'View Quest';
    if (isQuestFull) return 'QUEST FULL';
    if (questData.existingSubmission) {
      if (questData.existingSubmission.status === 'pending') return 'IN PROGRESS';
      if (questData.existingSubmission.status === 'approved') return 'COMPLETED';
      if (questData.existingSubmission.status === 'rejected') return 'REJECTED';
    }
    return 'Start Quest';
  };

  const getButtonColor = () => {
    // Quest is full - disabled state
    if (isQuestFull && user && user.role === 'user') {
      return 'bg-gray-400 cursor-not-allowed';
    }
    // Admin and Partner view mode
    if (user && (user.role === 'admin' || user.role === 'partner')) {
      return 'bg-blue-500 hover:bg-blue-600';
    }
    if (questData.existingSubmission) {
      if (questData.existingSubmission.status === 'pending') return 'bg-yellow-500 hover:bg-yellow-600';
      if (questData.existingSubmission.status === 'approved') return 'bg-green-600 hover:bg-green-700';
      if (questData.existingSubmission.status === 'rejected') return 'bg-red-500 hover:bg-red-600';
    }
    return `${activeColor.bg} ${activeColor.hover}`;
  };


  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col transition-transform transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${activeColor.iconBg}`}>{icon}</div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${difficultyStyles[difficulty]}`}>{difficulty}</span>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-sm text-gray-500 mb-4 border-t border-b border-gray-100 py-3">
        <div className="flex items-center gap-1.5"><Award className="w-4 h-4 text-yellow-500"/><span>{points} pts</span></div>
        <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500"/><span>{duration}</span></div>
        <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-purple-500"/><span>{participants}/{questData.maxParticipants || 100}</span></div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{participants} / {questData.maxParticipants || 100} joined</span>
          <span>{Math.round(progress)}% Full</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`${activeColor.bg} h-2 rounded-full transition-all duration-300`} style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <button 
            // 🔑 Action: Pass the full quest object to the handler
            onClick={() => onViewDetails(questData)}
            disabled={isQuestFull && user && user.role === 'user'}
            className={`mt-auto w-full ${getButtonColor()} text-white font-bold py-2.5 px-4 rounded-xl transition-transform ${
              isQuestFull && user && user.role === 'user' 
                ? 'cursor-not-allowed' 
                : 'transform hover:scale-105'
            }`}
        >
        {getButtonText()}
      </button>
    </div>
  );
};

// New component for the guideline cards
const GuidelineCard = ({ icon, title, description, iconColor }) => (
    <div className="text-center p-4">
        <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full mb-4 text-3xl`} style={{ color: iconColor }}>
            {icon}
        </div>
        <h4 className="font-bold text-gray-800 mb-2">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
    </div>
);

// --- MAIN PAGE COMPONENT (Modified) ---

const QuestsPage = ({ onPageChange }) => {
    const { user } = useUser();
    const [selectedQuest, setSelectedQuest] = useState(null);
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [todayQuest, setTodayQuest] = useState(null);

    useEffect(() => {
        fetchQuests();
    }, [user]);

    const fetchQuests = async () => {
        try {
            const questsData = await questAPI.getAllQuests();
            
            // Fetch user's submissions to check status
            let userSubmissions = [];
            if (user) {
                try {
                    const token = localStorage.getItem('token');
                    const submissionsRes = await fetch('http://localhost:5000/api/quests/submissions/my', {
                        headers: { 'x-auth-token': token }
                    });
                    userSubmissions = await submissionsRes.json();
                } catch (error) {
                    console.error('Error fetching user submissions:', error);
                }
            }
            
            // Transform quest data to match QuestCard component props
            const transformedQuests = questsData.map(quest => {
                const userSubmission = userSubmissions.find(sub => sub.quest_id?._id === quest._id);
                
                return {
                    ...quest,
                    id: quest._id,
                    icon: getCategoryIcon(quest.category),
                    color: getCategoryColor(quest.category),
                    participants: quest.completions?.length || 0,
                    progress: ((quest.completions?.length || 0) / (quest.maxParticipants || 50)) * 100,
                    submissionStatus: userSubmission?.status || null,
                    existingSubmission: userSubmission || null
                };
            });
            
            setQuests(transformedQuests);
            
            // Fetch today's daily quest from API
            try {
                const dailyQuestRes = await fetch('http://localhost:5000/api/daily/quest');
                const dailyQuestData = await dailyQuestRes.json();
                if (dailyQuestData.quest) {
                    const transformedDailyQuest = {
                        ...dailyQuestData.quest,
                        id: dailyQuestData.quest._id,
                        icon: getCategoryIcon(dailyQuestData.quest.category),
                        color: getCategoryColor(dailyQuestData.quest.category),
                        participants: dailyQuestData.quest.completions?.length || 0,
                        progress: ((dailyQuestData.quest.completions?.length || 0) / (dailyQuestData.quest.maxParticipants || 50)) * 100,
                        isDailyQuest: true
                    };
                    setTodayQuest(transformedDailyQuest);
                }
            } catch (error) {
                console.error('Error fetching daily quest:', error);
                // Fallback to first active quest
                const activeQuests = transformedQuests.filter(q => q.isActive);
                if (activeQuests.length > 0) {
                    setTodayQuest(activeQuests[0]);
                }
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching quests:', error);
            setLoading(false);
        }
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'Gardening & Planting': <TreePine className="w-6 h-6 text-green-700"/>,
            'Recycling & Waste': <Recycle className="w-6 h-6 text-blue-700"/>,
            'Energy Conservation': <Sun className="w-6 h-6 text-yellow-600"/>,
            'Water Conservation': <Droplets className="w-6 h-6 text-cyan-700"/>,
            'Education & Awareness': <BookOpen className="w-6 h-6 text-purple-700"/>,
            'Transportation': <Building className="w-6 h-6 text-indigo-700"/>
        };
        return icons[category] || <Leaf className="w-6 h-6 text-lime-700"/>;
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Gardening & Planting': 'green',
            'Recycling & Waste': 'blue',
            'Energy Conservation': 'yellow',
            'Water Conservation': 'cyan',
            'Education & Awareness': 'purple',
            'Transportation': 'indigo'
        };
        return colors[category] || 'green';
    };

    const handleViewDetails = (questData) => {
        if (!user) {
            onPageChange('login');
            return;
        }
        setSelectedQuest(questData);
    };

    const handleBack = () => {
        setSelectedQuest(null);
    };

    const handleQuestSubmission = () => {
        // Refresh quests data to show updated status
        fetchQuests();
        // You could also show a success message here
        console.log('Quest submitted successfully!');
    };

    // Filter quests
    const filteredQuests = quests.filter(quest => {
        const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             quest.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || quest.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === 'All' || quest.difficulty === selectedDifficulty;
        return matchesSearch && matchesCategory && matchesDifficulty;
    });

    if (loading) {
        return (
            <div className="font-sans bg-app-bg text-gray-800 min-h-screen flex items-center justify-center pt-24">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading quests...</p>
                </div>
            </div>
        );
    }

    if (selectedQuest) {
        return <QuestDetailsPage quest={selectedQuest} onBack={handleBack} onSubmissionSuccess={handleQuestSubmission} userRole={user?.role} />;
    }

  return (
    <div className="font-sans bg-app-bg text-gray-800">
      <main className="pt-24 pb-12">
        {/* Page Header */}
        <section className="container mx-auto px-4 text-center mb-12">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-8 flex items-center justify-center gap-6">
                <div className="bg-white p-4 rounded-full shadow-md">
                    <BookOpen className="w-10 h-10 text-primary-green" />
                </div>
                <div>
                    <h2 className="text-4xl font-extrabold text-dark-green mb-2">Environmental Quests</h2>
                    <p className="max-w-2xl mx-auto text-gray-600">
                        Choose your adventure and make a real impact on our planet. Complete quests to earn points, badges, and contribute to a sustainable future!
                    </p>
                </div>
            </div>
        </section>

        {/* Today's Quest (Modified) */}
        {todayQuest && (
            <section className="container mx-auto px-4 mb-12">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 relative">
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                        DAILY
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="text-yellow-500">⭐</span> Today's Quest
                    </h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {todayQuest.icon}
                            <div>
                                <h4 className="font-bold text-blue-800">{todayQuest.title}</h4>
                                <p className="text-sm text-blue-700">{todayQuest.description?.substring(0, 100)}...</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => handleViewDetails(todayQuest)}
                                className="bg-green-500 text-white font-bold py-2 px-5 rounded-full transition-transform transform hover:scale-105"
                            >
                                {user ? 'Accept Challenge' : 'Login to Accept'}
                            </button>
                            <button 
                                onClick={() => handleViewDetails(todayQuest)}
                                className="text-sm text-gray-600 hover:underline"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        )}

        {/* Filters and Quest Grid */}
        <section className="container mx-auto px-4">
            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 mb-8">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search quests..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-xl" 
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                     <div>
                        <div className="flex flex-wrap gap-2">
                           {['All', 'Gardening & Planting', 'Recycling & Waste', 'Energy Conservation', 'Water Conservation'].map((category) => (
                               <button 
                                   key={category}
                                   onClick={() => setSelectedCategory(category)}
                                   className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                                       selectedCategory === category 
                                           ? 'bg-green-500 text-white' 
                                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                   }`}
                               >
                                   {category === 'All' ? 'All Quests' : category.split(' ')[0]}
                               </button>
                           ))}
                        </div>
                    </div>
                    <div>
                        <select 
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="w-full border rounded-xl px-4 py-2 bg-white"
                        >
                            <option value="All">All Difficulty Levels</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                 </div>
            </div>

            {/* Quest Grid */}
            {filteredQuests.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl shadow-lg border text-center">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-600 mb-2">No Quests Found</h3>
                    <p className="text-gray-500">
                        {searchTerm || selectedCategory !== 'All' 
                            ? 'Try adjusting your filters' 
                            : 'No quests have been created yet. Check back soon!'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredQuests.map((quest) => (
                        <QuestCard key={quest.id} {...quest} onViewDetails={handleViewDetails} questData={quest} user={user} />
                    ))}
                </div>
            )}
        </section>
        
        {/* QUEST GUIDELINES SECTION (Refactored) */}
        <section className="container mx-auto px-4 mt-24 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Quest Guidelines</h2>
                <p className="text-gray-600 max-w-lg mb-8">
                    To ensure the integrity of your environmental impact, please follow these core principles when completing quests.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                    <GuidelineCard
                        icon={<Lightbulb className="w-8 h-8"/>}
                        title="Real Impact"
                        description="Ensure your actions are genuine and contribute directly to the quest's stated environmental goal."
                        iconColor="#10b981" 
                    />
                    <GuidelineCard
                        icon={<Camera className="w-8 h-8"/>}
                        title="Verify Progress"
                        description="Always document your proof of completion clearly (photos/videos) for verification by a Quest Master."
                        iconColor="#3b82f6" 
                    />
                    <GuidelineCard
                        icon={<Handshake className="w-8 h-8"/>}
                        title="Collaborate Fairly"
                        description="If the quest is collaborative, ensure all team members contribute equally to the final outcome."
                        iconColor="#ef4444" 
                    />
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
              <li><button className="hover:text-white">Contact Quest Masters</button></li>
              <li><button className="hover:text-white">Alliance Partners</button></li>
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
}


export default QuestsPage;
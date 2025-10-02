// Josh Andrei Aguiluz
import React, { useState, useEffect } from "react";
// Import icons needed for the Hero section buttons
import { Swords, BookOpen, BarChart } from "lucide-react";
import { questAPI, userAPI } from "../utils/api";
import FacebookIcon from '../img/Facebook.png';
import InstagramIcon from '../img/Instagram.png';
import TiktokIcon from '../img/Tiktok.png';
// 1. Import useUser to check if an account is logged in
import { useUser } from '../context/UserContext';


export default function HomePage({ onPageChange }) {
  // 2. Get the user object from the context
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalQuests: 0,
    totalUsers: 0,
    totalPoints: 0
  });
  const [featuredQuests, setFeaturedQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch quests
      const questsData = await questAPI.getAllQuests();
      
      // Fetch leaderboard to get user stats
      const leaderboardData = await userAPI.getLeaderboard();
      
      // Calculate stats
      const totalPoints = leaderboardData.reduce((sum, user) => sum + (user.eco_score || user.points || 0), 0);
      
      setStats({
        totalQuests: questsData.length,
        totalUsers: leaderboardData.length,
        totalPoints: totalPoints
      });

      // Get featured quests (first 3 active quests)
      const activeQuests = questsData.filter(q => q.isActive).slice(0, 3);
      setFeaturedQuests(activeQuests);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching home data:', error);
      setLoading(false);
    }
  };
  
  const handleJoinQuest = () => {
    if (user) {
      onPageChange('quests');
    } else {
      onPageChange('login');
    }
  };

  return (
    <div className="font-sans bg-green-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-green-700 text-white py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Welcome to HAU Eco-Quest</h1>
          <p className="text-lg mb-8">
            Join the quest to save the planet through exciting eco-adventures.
            Track your impact, complete challenges, and become an environmental hero!
          </p>
          <div className="flex justify-center gap-4">
            
            {!user ? (
              <>
                <button
                  onClick={() => onPageChange('signup')}
                  className="bg-white text-green-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-green-100 flex items-center gap-2 transition"
                >
                  <Swords className="w-5 h-5" />
                  Start Questing
                </button>
                <a
                  href="#quests"
                  className="bg-green-500 font-semibold px-6 py-3 rounded-lg shadow hover:bg-green-600 flex items-center gap-2 transition text-white"
                >
                  <BookOpen className="w-5 h-5" />
                  Learn More
                </a>
              </>
            ) : (
              <button
                onClick={() => onPageChange('dashboard')}
                className="bg-white text-green-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-green-100 flex items-center gap-2 transition"
              >
                <BarChart className="w-5 h-5" />
                Go to Your Dashboard
              </button>
            )}

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-green-100 p-6 rounded-lg shadow">
            <h2 className="text-3xl font-bold text-green-700">{loading ? '...' : stats.totalQuests}</h2>
            <p className="text-gray-600">Eco Quests</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg shadow">
            <h2 className="text-3xl font-bold text-green-700">{loading ? '...' : stats.totalUsers}+</h2>
            <p className="text-gray-600">Student Heroes</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg shadow">
            <h2 className="text-3xl font-bold text-green-700">{loading ? '...' : stats.totalPoints}</h2>
            <p className="text-gray-600">Eco Points</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg shadow">
            <h2 className="text-3xl font-bold text-green-700">{loading ? '...' : stats.totalPoints}</h2>
            <p className="text-gray-600">Total Points</p>
          </div>
        </div>
      </section>

      {/* Featured Quests */}
      <section id="quests" className="py-16 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-green-700 mb-6">
            Featured Eco Quests
          </h2>
          <p className="text-gray-600 mb-12">
            Take part in exciting sustainability missions and earn rewards while
            helping the planet.
          </p>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : featuredQuests.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">No Quests Created Yet</h3>
              <p className="text-gray-500">Check back soon for exciting eco-adventures!</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              {featuredQuests.map((quest) => (
                <div key={quest._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col">
                  <div className="bg-green-100 h-32 rounded mb-4 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-700 mb-2">
                    {quest.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                    {quest.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                    <span>{quest.points} pts</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      quest.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      quest.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {quest.difficulty}
                    </span>
                  </div>
                  {/* --- CHANGE: Updated button style --- */}
                  <button 
                    onClick={handleJoinQuest} 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-full shadow-md transition transform hover:scale-105"
                  >
                    Join Quest
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">🌟</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Become an Eco-Hero?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join thousands of students making a real environmental impact. Start your
            journey today and earn rewards while saving the planet!
          </p>
          
          {!user && (
            <button 
              onClick={() => onPageChange('signup')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition"
            >
              Continue Your Journey
            </button>
          )}

        </div>
      </section>

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


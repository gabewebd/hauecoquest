import React, { useState, useEffect } from "react";
import { Rocket, ArrowRight, Target, Users, BarChart, Zap } from "lucide-react";
import { questAPI, userAPI } from "../utils/api";
import FacebookIcon from '../img/Facebook.png';
import InstagramIcon from '../img/Instagram.png';
import TiktokIcon from '../img/Tiktok.png';
import { useUser } from '../context/UserContext';

export default function HomePage({ onPageChange }) {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalQuests: 0,
    totalUsers: 0,
    totalPoints: 0
  });
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch quests data
      const questsData = await questAPI.getAllQuests();
      console.log('Quests data:', questsData);
      
      // Fetch leaderboard data for all departments
      const leaderboardData = await userAPI.getLeaderboard('all');
      console.log('Leaderboard data:', leaderboardData);
      
      // Handle department leaderboard structure
      let totalUsers = 0;
      let totalPoints = 0;
      
      if (leaderboardData && leaderboardData.leaderboard) {
        // Department leaderboard structure
        totalUsers = leaderboardData.leaderboard.reduce((sum, dept) => sum + (dept.userCount || 0), 0);
        totalPoints = leaderboardData.leaderboard.reduce((sum, dept) => sum + (dept.totalPoints || 0), 0);
      } else if (Array.isArray(leaderboardData)) {
        // Individual user leaderboard structure
        totalUsers = leaderboardData.length;
        totalPoints = leaderboardData.reduce((sum, user) => {
        return sum + (user.eco_score || user.points || 0);
      }, 0);
      }
      
      // Update stats with actual data
      setStats({
        totalQuests: questsData ? questsData.length : 0,
        totalUsers: totalUsers,
        totalPoints: totalPoints
      });


      // Fetch challenge data
      try {
        const challengeRes = await fetch('/api/challenges');
        if (challengeRes.ok) {
          const challengesData = await challengeRes.json();
          if (challengesData && challengesData.length > 0) {
            setChallenge(challengesData[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching challenge:', error);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching home data:', error);
      // Set fallback values
      setStats({
        totalQuests: 0,
        totalUsers: 0,
        totalPoints: 0
      });
      setLoading(false);
    }
  };
  
  return (
    <div className="font-sans bg-white text-gray-900 overflow-x-hidden">
      <section className="relative bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-white rounded-full"></div>
        </div>

        <div className="absolute inset-0 opacity-20">
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-32">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-center md:text-left z-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-6 leading-tight">
                IMAGINE A PLACE...
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-green-50 leading-relaxed">
                ...where you can save the planet and have fun doing it. Join thousands of students on eco-adventures, complete epic quests, and become an environmental hero. All while earning points and unlocking rewards!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
                {!user ? (
                  <>
                    <button
                      onClick={() => onPageChange('signup')}
                      className="bg-white text-green-600 font-bold px-6 md:px-8 py-3 md:py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      <Rocket className="w-4 h-4 md:w-5 md:h-5" />
                      Start Your Quest
                    </button>
                    <button
                      onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                      className="text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-white hover:text-green-600 hover:bg-opacity-100 transition-all flex items-center justify-center gap-2 border-2 border-white border-opacity-50 text-sm md:text-base"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onPageChange('dashboard')}
                    className="bg-white text-green-600 font-bold px-6 md:px-8 py-3 md:py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <BarChart className="w-4 h-4 md:w-5 md:h-5" />
                    Go to Dashboard
                  </button>
                )}
              </div>
            </div>

            <div className="relative z-10 hidden md:block">
              <img 
                src="/assets/designs/eco-adventure.jpg" 
                alt="Students collaborating on an eco-adventure"
                className="rounded-3xl shadow-2xl w-full h-full object-cover"
              />
            </div>

          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white p-4 md:p-8 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all text-center">
              <div className="bg-green-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Target className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-green-600 mb-2">{loading ? '...' : stats.totalQuests}</h2>
              <p className="text-gray-600 font-semibold text-xs md:text-base">Active Quests</p>
            </div>
            <div className="bg-white p-4 md:p-8 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all text-center">
              <div className="bg-emerald-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-emerald-600 mb-2">{loading ? '...' : stats.totalUsers}+</h2>
              <p className="text-gray-600 font-semibold text-xs md:text-base">Eco-Warriors</p>
            </div>
            <div className="bg-white p-4 md:p-8 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all text-center">
              <div className="bg-teal-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Zap className="w-6 h-6 md:w-8 md:h-8 text-teal-600" />
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-teal-600 mb-2">{loading ? '...' : stats.totalPoints}</h2>
              <p className="text-gray-600 font-semibold text-xs md:text-base">Impact Score</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            
            <img 
              src="/assets/designs/quest.png" 
              alt="HAU Eco-Quest board with active missions"
              className="rounded-2xl md:rounded-3xl w-full h-full object-cover shadow-lg"
            />
            
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 leading-tight text-gray-900">
                Create eco-adventures with purpose
              </h2>
              <p className="text-base md:text-xl text-gray-600 leading-relaxed">
                HAU Eco-Quest makes it easy to join sustainability missions designed for students. From tree planting to waste reduction, every quest brings you closer to real environmental impact while earning rewards and recognition.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 leading-tight text-gray-900">
                Where tracking your impact is simple
              </h2>
              <p className="text-base md:text-xl text-gray-600 leading-relaxed">
                See your environmental footprint grow with every completed quest. Track points, badges, and achievements on your personalized dashboard. Compete on leaderboards and unlock exclusive rewards as you level up your eco-warrior status.
              </p>
            </div>
            
            {/* UPDATED Dashboard Interface Image */}
            <img 
              src="/assets/designs/progress.jpg" 
              alt="Dashboard showing user progress and stats"
              className="rounded-2xl md:rounded-3xl w-full h-full object-cover shadow-lg order-1 md:order-2"
            />
            
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            
            {/* UPDATED Community Hub Image */}
            <img 
              src="/assets/designs/collaborating.jpg" 
              alt="Students collaborating in the community hub"
              className="rounded-2xl md:rounded-3xl w-full h-full object-cover shadow-lg"
            />
            
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 leading-tight text-gray-900">
                From few to a student guild
              </h2>
              <p className="text-base md:text-xl text-gray-600 leading-relaxed">
                Join a thriving community of eco-conscious students. Participate in group challenges, share your achievements, and inspire others. Together, we're building a movement that proves sustainability can be exciting, rewarding, and social.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 px-4 md:px-6 bg-gray-100 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 md:mb-8 leading-tight text-gray-900">
            Ready to start your<br />eco-adventure?
          </h2>
          <p className="text-base md:text-xl text-gray-600 mb-8 md:mb-10">
            Join thousands of students making a difference. Start your HAU Eco-Quest journey today and become the environmental hero you were meant to be.
          </p>
          
          {!user && (
            <button 
              onClick={() => onPageChange('signup')}
              className="bg-green-600 hover:bg-green-700 text-white font-black px-8 md:px-12 py-4 md:py-5 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all inline-flex items-center gap-3 text-base md:text-lg"
            >
              <Rocket className="w-5 h-5 md:w-6 md:h-6" />
              Start Your Journey
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-700 text-white pt-12 md:pt-16 pb-6 md:pb-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 text-left">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <img
                src="/assets/hau-eco-quest-logo.png"
                alt="HAU Eco-Quest Logo"
                className="h-6 w-6 md:h-8 md:w-8"
              />
              <h3 className="text-xl md:text-2xl font-bold">HAU Eco-Quest</h3>
            </div>
            <p className="text-xs md:text-sm text-green-100 leading-relaxed">
              Empowering students to become environmental champions through
              engaging sustainability adventures. Join the movement to save our
              planet!
            </p>
          </div>

          {/* Adventure Paths */}
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Adventure Paths</h4>
            <ul className="space-y-2 text-xs md:text-sm text-green-100">
              <li><button onClick={() => onPageChange('quests')} className="hover:text-white">Browse Epic Quests</button></li>
              <li><button onClick={() => onPageChange('community')} className="hover:text-white">Hero Community</button></li>
              <li><button onClick={() => onPageChange('leaderboard')} className="hover:text-white">Hall of Fame</button></li>
            </ul>
          </div>

          {/* Support Guild */}
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Support Guild</h4>
            <ul className="space-y-2 text-xs md:text-sm text-green-100">
              <li><button onClick={() => onPageChange('contactquestmasters')} className="hover:text-white">Contact Quest Masters</button></li>
              <li><button onClick={() => onPageChange('alliancepartners')} className="hover:text-white">Alliance Partners</button></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Connect with Us</h4>
            <div className="bg-green-600 p-3 md:p-4 rounded-lg text-xs md:text-sm">
              <p>eco-quest@hau.edu.ph</p>
              <p>+63 (2) 123-4567</p>
              <p>HAU Main Campus</p>
              <div className="flex gap-3 md:gap-4 mt-3 md:mt-4">
                <a href="#"><img src={FacebookIcon} alt="Facebook" className="w-5 h-5 md:w-6 md:h-6" /></a>
                <a href="#"><img src={InstagramIcon} alt="Instagram" className="w-5 h-5 md:w-6 md:h-6" /></a>
                <a href="#"><img src={TiktokIcon} alt="TikTok" className="w-5 h-5 md:w-6 md:h-6" /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto text-center border-t border-green-600 mt-6 md:mt-8 pt-4 md:pt-6 text-green-200 text-xs md:text-sm">
          <p>© 2025 HAU Eco-Quest. All rights reserved. Built with for a sustainable future.</p>
        </div>
      </footer>
    </div>
  );
}
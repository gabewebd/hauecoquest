//Josh Andrei Aguiluz
import React from 'react';
import { Crown, Award, Shield, Sprout, Recycle, Zap, Users, Swords, Users2, Leaf, Rocket } from 'lucide-react';

// Helper component for the Top 3 champions
const TopChampionCard = ({ user, rank }) => {
  const rankStyles = {
    1: { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-600', crown: true },
    2: { bg: 'bg-gray-200', border: 'border-gray-300', text: 'text-gray-600' },
    3: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-600' },
  };
  const style = rankStyles[rank];

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
      <h4 className="font-bold text-lg text-gray-800">{user.name}</h4>
      <p className={`text-sm font-semibold ${style.text} mb-2`}>{user.title}</p>
      {/* FIXED: Replaced text-dark-green with text-green-900 */}
      <p className="text-2xl font-bold text-green-900">{user.points.toLocaleString()}</p>
    </div>
  );
};

// Helper component for the rest of the leaderboard rows (4th place and below)
const LeaderboardRow = ({ user, rank }) => (
  <div className="flex items-center bg-white p-3 rounded-xl mb-2 hover:bg-green-50/50 transition-colors">
    <div className="w-8 text-center font-bold text-gray-500 text-lg">#{rank}</div>
    <div className="flex items-center gap-3 flex-1 ml-4">
      <div className="relative">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-lg text-gray-600">{user.avatarInitial}</div>
        <div className="absolute -bottom-0 -right-0 bg-white text-xs font-bold w-5 h-5 rounded-full border flex items-center justify-center">{user.level}</div>
      </div>
      <div>
        <p className="font-bold text-gray-800">{user.name}</p>
        <p className="text-sm text-gray-500">{user.title}</p>
      </div>
    </div>
    <div className="hidden md:flex items-center gap-3 text-gray-400">
      <Award className="w-5 h-5" title="Award Winner"/>
      <Shield className="w-5 h-5" title="Guardian"/>
      <Sprout className="w-5 h-5" title="Planter"/>
    </div>
    {/* FIXED: Replaced text-primary-green with text-green-600 */}
    <div className="w-24 text-right font-bold text-green-600 text-lg">{user.points.toLocaleString()}</div>
  </div>
);

const LeaderboardPage = () => {
    // Mock data for the leaderboard
    const users = [
        { name: 'Ana Reyes', title: 'Sustainability Champion', points: 2847, level: 15, avatarInitial: 'AR' },
        { name: 'Maria Santos', title: 'Eco-Warrior', points: 2654, level: 14, avatarInitial: 'MS' },
        { name: 'Carlos Mendoza', title: 'Green Guardian', points: 2589, level: 14, avatarInitial: 'CM' },
        { name: 'Lisa Garcia', title: 'Nature Defender', points: 2234, level: 12, avatarInitial: 'LG' },
        { name: 'John Dela Cruz', title: 'Green Guardian', points: 1987, level: 10, avatarInitial: 'JD' },
        { name: 'Sarah Kim', title: 'Eco-Enthusiast', points: 1823, level: 9, avatarInitial: 'SK' },
        { name: 'Miguel Torres', title: 'Sustainability Student', points: 1756, level: 8, avatarInitial: 'MT' },
        { name: 'Elena Rodriguez', title: 'Green Rookie', points: 1634, level: 8, avatarInitial: 'ER' },
    ];

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
                            <button className="bg-green-500 text-white font-bold py-3 px-6 rounded-full">View Rankings</button>
                            <button className="font-bold text-gray-700 py-3 px-6">My Progress</button>
                        </div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-2xl text-center">
                        <p>Leaderboard Illustration Placeholder</p>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="container mx-auto px-4 mb-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white p-4 rounded-2xl shadow-md border text-center"><Users className="w-8 h-8 text-blue-500 mx-auto mb-2"/><p className="text-2xl font-bold">1,248</p><p className="text-sm text-gray-500">Active Champions</p></div>
                <div className="bg-white p-4 rounded-2xl shadow-md border text-center"><Swords className="w-8 h-8 text-yellow-500 mx-auto mb-2"/><p className="text-2xl font-bold">3,891</p><p className="text-sm text-gray-500">Quests Completed</p></div>
                <div className="bg-white p-4 rounded-2xl shadow-md border text-center"><Users2 className="w-8 h-8 text-purple-500 mx-auto mb-2"/><p className="text-2xl font-bold">2,156</p><p className="text-sm text-gray-500">Green Participants</p></div>
                <div className="bg-white p-4 rounded-2xl shadow-md border text-center"><Leaf className="w-8 h-8 text-green-500 mx-auto mb-2"/><p className="text-2xl font-bold">45.2 tons</p><p className="text-sm text-gray-500">CO₂ saved</p></div>
            </section>

            {/* Leaderboard Section */}
            <section className="container mx-auto px-4">
                {/* Filters */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border mb-8">
                    <h3 className="font-bold mb-4">Leaderboard Filters</h3>
                    <div className="flex flex-wrap gap-4">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-2">Time Period</p>
                            {/* FIXED: Replaced bg-primary-green with bg-green-500 */}
                            <div className="flex gap-2"><button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">This Week</button><button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">This Month</button><button className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">All Time</button></div>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-2">Category</p>
                            <div className="flex gap-2"><button className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">Overall Points</button><button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">Quest Master</button></div>
                        </div>
                    </div>
                </div>

                {/* Top Champions */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold">🏆 Top Environmental Champions 🏆</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <TopChampionCard user={users[1]} rank={2} />
                    <TopChampionCard user={users[0]} rank={1} />
                    <TopChampionCard user={users[2]} rank={3} />
                </div>

                {/* Complete Leaderboard */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border">
                  <h3 className="text-2xl font-bold mb-4">Complete Leaderboard</h3>
                  {users.slice(3).map((user, index) => (
                      <LeaderboardRow key={user.name} user={user} rank={index + 4} />
                  ))}
                </div>
            </section>

             {/* CTA */}
            <section className="container mx-auto px-4 mt-24">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center flex flex-col items-center">
                    {/* FIXED: Replaced text-primary-green with text-green-500 */}
                    <Rocket className="w-12 h-12 text-green-500 mb-4"/>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Climb the Eco-Hero Rankings!</h2>
                    <p className="text-gray-600 max-w-lg mx-auto mb-6">Complete quests, attend events, and make environmental impact to earn points and climb the leaderboard. Every action counts towards a sustainable future!</p>
                    <div className="flex gap-4">
                        {/* FIXED: Replaced bg-primary-green with bg-green-500 */}
                        <button className="bg-green-500 text-white font-bold py-3 px-6 rounded-full">Start New Quest</button>
                        <button className="bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-full">Join Events</button>
                    </div>
                </div>
            </section>
        </main>

        {/* Your Requested Footer */}
        <footer className="bg-green-700 text-white pt-16 pb-8 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
                {/* Brand */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <img src="/vite.svg" alt="HAU Eco-Quest Logo" className="h-8 w-8 bg-white rounded-full p-1"/>
                        <h3 className="text-2xl font-bold">HAU Eco-Quest</h3>
                    </div>
                    <p className="text-sm text-green-100">
                        Empowering students to become environmental champions through engaging sustainability adventures. Join the movement to save our planet!
                    </p>
                </div>
                {/* Adventure Paths */}
                <div>
                    <h4 className="font-bold mb-4">Adventure Paths</h4>
                    <ul className="space-y-2 text-sm text-green-100">
                        <li><a href="#" className="hover:text-white">Browse Epic Quests</a></li>
                        <li><a href="#" className="hover:text-white">Upcoming Events</a></li>
                        <li><a href="#" className="hover:text-white">Hero Community</a></li>
                        <li><a href="#" className="hover:text-white">Hall of Fame</a></li>
                    </ul>
                </div>
                {/* Support Guild */}
                <div>
                    <h4 className="font-bold mb-4">Support Guild</h4>
                    <ul className="space-y-2 text-sm text-green-100">
                        <li><a href="#" className="hover:text-white">Contact Quest Masters</a></li>
                        <li><a href="#" className="hover:text-white">Alliance Partners</a></li>
                        <li><a href="#" className="hover:text-white">Help Center</a></li>
                        <li><a href="#" className="hover:text-white">Quest Rules</a></li>
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
                            <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                            <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                            <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-6xl mx-auto text-center border-t border-green-600 mt-8 pt-6 text-green-200 text-sm">
                <p>© 2024 HAU Eco-Quest. All rights reserved. Built with ❤️ for a sustainable future.</p>
            </div>
        </footer>
    </div>
  );
};

export default LeaderboardPage;
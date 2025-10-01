//Josh Andrei Aguiluz
import React from 'react';
import { Users, Heart, Trophy, Leaf, UserPlus, Share2, Award, Shield, Search, MessageCircle, MoreHorizontal, Flag, Smile, Camera, Users2 } from 'lucide-react';

// Reusable component for each post in the community feed
const PostCard = ({ avatar, name, title, time, text, quest, image, likes, comments, shares }) => (
  <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />
        <div>
          <div className="flex items-center gap-1">
            <h4 className="font-bold text-gray-800">{name}</h4>
            <span className="text-blue-500">✔️</span>
          </div>
          <p className="text-sm text-gray-500">{title} • {time}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-400">
        <Flag className="w-4 h-4 cursor-pointer hover:text-red-500" />
        <MoreHorizontal className="w-5 h-5 cursor-pointer hover:text-gray-800" />
      </div>
    </div>
    <p className="my-4 text-gray-700">{text}</p>
    {quest && (
      <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-3 py-2 rounded-lg inline-block mb-4">
        {quest}
      </div>
    )}
    {image && <img src={image} alt="Post content" className="rounded-lg w-full object-cover max-h-80" />}
    <div className="flex justify-between items-center mt-4 border-t border-gray-100 pt-4">
      <div className="flex items-center gap-6 text-gray-500">
        <button className="flex items-center gap-2 hover:text-red-500">
          <Heart className="w-5 h-5" /> {likes}
        </button>
        <button className="flex items-center gap-2 hover:text-blue-500">
          <MessageCircle className="w-5 h-5" /> {comments}
        </button>
        <button className="flex items-center gap-2 hover:text-green-500">
          <Share2 className="w-5 h-5" /> {shares}
        </button>
      </div>
      {/* FIXED: Replaced text-primary-green with text-green-600 */}
      <a href="#" className="text-sm font-bold text-green-600 hover:underline">View Details</a>
    </div>
  </div>
);

const CommunityPage = () => {
  // Mock data for the community feed posts
  const posts = [
    { avatar: 'https://i.pravatar.cc/150?u=maria', name: 'Maria Santos', title: 'Eco-Warrior', time: '2 hours ago', text: 'Just completed the Tree Planting Initiative! 🌱 Planted 25 native trees with my team. The feeling of contributing to our campus forest is incredible!', quest: 'Campus Tree Planting Initiative', image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=500', likes: 43, comments: 12, shares: 8 },
    { avatar: 'https://i.pravatar.cc/150?u=john', name: 'John Dela Cruz', title: 'Green Guardian', time: '5 hours ago', text: 'Amazing turnout at today\'s Earth Day Festival! 🌎 Met so many passionate environmental advocates. Together we can make a difference!', quest: 'Earth Day Festival', image: null, likes: 67, comments: 23, shares: 15 },
    { avatar: 'https://i.pravatar.cc/150?u=ana', name: 'Ana Reyes', title: 'Sustainability Champion', time: '1 day ago', text: 'Weekly update! Our campus recycling program has diverted 2.3 tons of waste from landfills this month! 💪 Every small action counts!', quest: null, image: 'https://images.unsplash.com/photo-1595278069441-2cf29f8a0273?w=500', likes: 89, comments: 34, shares: 28 },
    { avatar: 'https://i.pravatar.cc/150?u=carlos', name: 'Carlos Santos', title: 'Nature Defender', time: '2 days ago', text: 'Just learned about permaculture in our Biodiversity Survey quest! 🦋 The interconnection of ecosystems is fascinating. Can\'t wait to implement these principles!', quest: 'Campus Biodiversity Survey', image: 'https://images.unsplash.com/photo-1591854333935-a98b2ced8b8c?w=500', likes: 56, comments: 18, shares: 12 },
  ];

  return (
    <div className="font-sans bg-app-bg text-gray-800">
      <main className="pt-24 pb-12">
        {/* Community Hub Header */}
        <section className="container mx-auto px-4 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              {/* FIXED: Replaced text-dark-green with text-green-900 */}
              <h2 className="text-4xl font-extrabold text-green-900 mb-2">Community Hub</h2>
              <p className="text-gray-600 max-w-lg">Connect with fellow eco-heroes, share your environmental journey, and inspire others to make a positive impact on our planet!</p>
              <div className="flex items-center gap-4 mt-6">
                {/* FIXED: Replaced bg-primary-green with bg-green-500 */}
                <button className="flex items-center gap-2 bg-green-500 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105"><UserPlus className="w-5 h-5"/> Join Community</button>
                <button className="flex items-center gap-2 font-bold text-gray-700 py-3 px-6"><Share2 className="w-5 h-5"/> Share Achievement</button>
              </div>
            </div>
            <div className="bg-green-50 p-6 rounded-2xl text-center">
                <p className="text-gray-500">Community Illustration Placeholder</p>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="container mx-auto px-4 mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white p-4 rounded-2xl shadow-md border flex items-center gap-4"><Users className="w-8 h-8 text-blue-500"/><div><p className="text-2xl font-bold">1,248</p><p className="text-sm text-gray-500">Active Heroes</p></div></div>
                <div className="bg-white p-4 rounded-2xl shadow-md border flex items-center gap-4"><Heart className="w-8 h-8 text-red-500"/><div><p className="text-2xl font-bold">15.6k</p><p className="text-sm text-gray-500">Likes Today</p></div></div>
                <div className="bg-white p-4 rounded-2xl shadow-md border flex items-center gap-4"><Trophy className="w-8 h-8 text-yellow-500"/><div><p className="text-2xl font-bold">892</p><p className="text-sm text-gray-500">Quests Completed</p></div></div>
                <div className="bg-white p-4 rounded-2xl shadow-md border flex items-center gap-4"><Leaf className="w-8 h-8 text-green-500"/><div><p className="text-2xl font-bold">45.2k</p><p className="text-sm text-gray-500">CO₂ saved (kg)</p></div></div>
            </div>
        </section>
        
        {/* Community Challenge */}
        <section className="container mx-auto px-4 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">December Community Challenge</h3>
            <p className="text-gray-600 mb-6">Join forces to achieve our collective environmental goal!</p>
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <p className="font-bold text-green-800 mb-2">Plant 1,000 Trees Challenge</p>
              <div className="flex justify-between text-sm text-green-700 mb-1"><span>Progress: 687 / 1,000 trees</span><span>68.7%</span></div>
              {/* FIXED: Replaced bg-primary-green with bg-green-500 */}
              <div className="w-full bg-green-200 rounded-full h-3 mb-4"><div className="bg-green-500 h-3 rounded-full" style={{width: '68.7%'}}></div></div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                {/* FIXED: Replaced bg-primary-green with bg-green-500 */}
                <button className="bg-green-500 text-white font-bold py-2 px-5 rounded-full">Join Challenge</button>
                <a href="#" className="font-semibold hover:underline">View Leaderboard</a>
              </div>
            </div>
          </div>
        </section>

        {/* Community Feed */}
        <section className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-4">Community Feed</h3>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex flex-wrap gap-2">
              {/* FIXED: Replaced bg-primary-green with bg-green-500 */}
              <button className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">Recent Activity</button>
              <button className="bg-white border text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">Most Popular</button>
            </div>
            <div className="relative w-full md:w-auto">
              <input type="text" placeholder="Search community posts..." className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-full" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          {/* Posts */}
          <div>
            {posts.map((post, index) => <PostCard key={index} {...post} />)}
          </div>
          
          <div className="text-center mt-8">
            <button className="bg-white border font-bold text-gray-700 py-3 px-8 rounded-full hover:bg-gray-50">Load More Posts</button>
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="container mx-auto px-4 mt-24">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Community Guidelines</h2>
                <p className="text-gray-600 max-w-xl mx-auto mb-8">Let's keep our community positive, supportive, and focused on environmental action. Share your journey, celebrate others' achievements, and inspire change together!</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center gap-2"><Smile className="w-10 h-10 text-yellow-500"/> <h4 className="font-bold">Stay Positive</h4> <p className="text-sm text-gray-500">Encourage and support fellow eco-heroes.</p></div>
                    <div className="flex flex-col items-center gap-2"><Camera className="w-10 h-10 text-blue-500"/> <h4 className="font-bold">Share Progress</h4> <p className="text-sm text-gray-500">Document your environmental impact.</p></div>
                    <div className="flex flex-col items-center gap-2"><Users2 className="w-10 h-10 text-green-500"/> <h4 className="font-bold">Collaborate</h4> <p className="text-sm text-gray-500">Work together for a better world.</p></div>
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
}

export default CommunityPage;
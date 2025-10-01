// Josh Andrei Aguiluz
import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, X, User, LogOut, Shield, Award, Star, Trophy, Zap, Calendar, 
  Users, Home, BookOpen, MessageCircle, Crown, Settings, ChevronDown 
} from 'lucide-react';
import { useUser } from "../pages/UserContext";

export function Navigation({ currentPage, onPageChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // ✅ Safe destructure (prevents "user is null" crash)
  const { user, logout: userLogout } = useUser() || {};

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'quests', label: 'Quests', icon: BookOpen },
    { id: 'community', label: 'Community', icon: MessageCircle },
    { id: 'leaderboard', label: 'Leaderboard', icon: Crown },
  ];

  // UPDATED: Replicating the avatar theme structure from ProfilePage to ensure consistency
  // These objects now contain the background (bg) and the icon color (color)
  const avatars = [
    { name: "Girl Avatar 1", gender: "Female", color: "text-pink-500", bg: "bg-pink-100" },
    { name: "Girl Avatar 2", gender: "Female", color: "text-pink-400", bg: "bg-pink-50" },
    { name: "Boy Avatar 1", gender: "Male", color: "text-blue-500", bg: "bg-blue-100" },
    { name: "Boy Avatar 2", gender: "Male", color: "text-blue-400", bg: "bg-blue-50" },
  ];
  // Find the selected avatar object
  const selectedAvatar = avatars.find((a) => a.name === (user?.avatar || "Girl Avatar 1"));
  // Use a default style if the avatar isn't found
  const defaultAvatarStyle = { bg: "bg-pink-100", color: "text-pink-500" };
  const currentAvatarStyle = selectedAvatar || defaultAvatarStyle;


  const getProfileDropdown = () => {
    if (!user) return null;

    const points = user.points || 0;
    const level = Math.floor(points / 100) + 1;
    const roleIcon = user.role === 'admin' ? '👑' : user.role === 'partner' ? '🤝' : '⭐';
    
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className="flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-2 shadow-sm hover:shadow-md transition-all"
        >
          <div className="relative">
            {/* FINAL FIX APPLIED HERE: Using the correct background and icon color classes */}
            <div className={`w-10 h-10 ${currentAvatarStyle.bg} rounded-full flex items-center justify-center`}>
              <User className={`w-6 h-6 ${currentAvatarStyle.color}`} /> {/* Icon color is now dynamic */}
            </div>
            <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
              {level}
            </div>
          </div>
          <div className="hidden lg:block text-left">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-gray-800">{user.username || 'User'}</span>
              <span>{roleIcon}</span>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              {points.toLocaleString()} pts
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {profileDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
            <button 
              onClick={() => { onPageChange('profile'); setProfileDropdownOpen(false); }} 
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
            >
              <User className="w-4 h-4" /> View Profile
            </button>
            <button 
              onClick={() => { onPageChange('dashboard'); setProfileDropdownOpen(false); }} 
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
            <div className="border-t border-gray-100 my-1"></div>
            <button 
              onClick={() => { userLogout?.(); onPageChange('home'); setProfileDropdownOpen(false); }} 
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button onClick={() => onPageChange('home')} className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-2xl">🌱</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">HAU Eco-Quest</h1>
              <p className="text-xs text-gray-500">Join the Green Adventure</p>
            </div>
          </button>

          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
                    isActive ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => onPageChange('dashboard')} 
                  className="flex items-center gap-2 bg-green-100 text-green-600 border border-green-200 hover:bg-green-200 px-4 py-2 rounded-full font-semibold transition-colors"
                >
                  <Zap className="w-4 h-4" /> Dashboard
                </button>
                {getProfileDropdown()}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button onClick={() => onPageChange('login')} className="font-semibold text-gray-600 hover:text-green-600">
                  Login
                </button>
                <button onClick={() => onPageChange('signup')} className="bg-green-500 text-white px-5 py-2 rounded-full font-bold hover:bg-green-600">
                  Join Adventure
                </button>
              </div>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {/* Mobile menu content can be added here if needed */}
          </div>
        )}
      </div>
    </nav>
  );
}
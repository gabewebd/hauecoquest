import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, X, User, LogOut, Shield, Trash2, Trophy, 
  ChevronDown, BookOpen, MessageCircle, Crown, Home, Sparkles 
} from 'lucide-react';
import { useUser } from "../context/UserContext";

export function Navigation({ currentPage, onPageChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { user, logout: userLogout, deleteAccount } = useUser() || {};

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const result = await deleteAccount();
      if (result.success) {
        alert('Account deleted successfully');
        onPageChange('home');
      } else {
        alert('Failed to delete account');
      }
    }
  };

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

  const navItems = user ? [
    { id: 'quests', label: 'Quests', icon: BookOpen },
    { id: 'community', label: 'Community', icon: MessageCircle },
    { id: 'leaderboard', label: 'Leaderboard', icon: Crown },
  ] : [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'quests', label: 'Quests', icon: BookOpen },
    { id: 'community', label: 'Community', icon: MessageCircle },
    { id: 'leaderboard', label: 'Leaderboard', icon: Crown },
  ];

  const avatars = [
    { name: "Girl Avatar 1", gender: "Female", color: "text-pink-500", bg: "bg-pink-100" },
    { name: "Girl Avatar 2", gender: "Female", color: "text-pink-400", bg: "bg-pink-50" },
    { name: "Boy Avatar 1", gender: "Male", color: "text-blue-500", bg: "bg-blue-100" },
    { name: "Boy Avatar 2", gender: "Male", color: "text-blue-400", bg: "bg-blue-50" },
  ];
  const selectedAvatar = avatars.find((a) => a.name === (user?.avatar || "Girl Avatar 1"));
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
          className="flex items-center gap-3 bg-white hover:bg-gray-50 rounded-full px-3 py-2 transition-all shadow-md border border-gray-200"
        >
          <div className="relative">
            <div className={`w-10 h-10 ${currentAvatarStyle.bg} rounded-full flex items-center justify-center`}>
              <User className={`w-6 h-6 ${currentAvatarStyle.color}`} />
            </div>
            <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
              {level}
            </div>
          </div>
          <div className="hidden lg:block text-left">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-gray-900">{user.username || 'User'}</span>
              <span>{roleIcon}</span>
            </div>
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              {points.toLocaleString()} pts
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {profileDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-2xl py-2 z-50">
            <button 
              onClick={() => { onPageChange('profile'); setProfileDropdownOpen(false); }} 
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full rounded-lg mx-1"
            >
              <User className="w-4 h-4" /> View Profile
            </button>

            <div className="border-t border-gray-200 my-1"></div>
            
            <button 
              onClick={() => { userLogout?.(); onPageChange('home'); setProfileDropdownOpen(false); }} 
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full rounded-lg mx-1"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
            
            <div className="border-t border-gray-200 my-1"></div>
            
            <button 
              onClick={() => { handleDeleteAccount(); setProfileDropdownOpen(false); }} 
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full rounded-lg mx-1"
            >
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button onClick={() => onPageChange('home')} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900">HAU Eco-Quest</span>
          </button>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    isActive 
                      ? 'bg-green-100 text-green-600' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                {!user.requested_role && user.role === 'user' && (
                  <button 
                    onClick={() => onPageChange('dashboard')} 
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Dashboard
                  </button>
                )}
                {!user.requested_role && user.role === 'partner' && (
                  <button 
                    onClick={() => onPageChange('partner-dashboard')} 
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Shield className="w-4 h-4" /> Partner
                  </button>
                )}
                {!user.requested_role && user.role === 'admin' && (
                  <button 
                    onClick={() => onPageChange('admin-dashboard')} 
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Shield className="w-4 h-4" /> Admin
                  </button>
                )}
                {user.requested_role && !user.is_approved && (
                  <div className="flex items-center gap-2 bg-amber-100 text-amber-700 border border-amber-300 px-4 py-2 rounded-full font-bold text-sm">
                    <Shield className="w-4 h-4" /> Pending Approval
                  </div>
                )}
                {getProfileDropdown()}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => onPageChange('login')} 
                  className="font-bold text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                  Login
                </button>
                <button 
                  onClick={() => onPageChange('signup')} 
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onPageChange(item.id); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                      isActive 
                        ? 'bg-green-100 text-green-600' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
              
              {user ? (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button 
                    onClick={() => { onPageChange('profile'); setMobileMenuOpen(false); }} 
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-semibold"
                  >
                    <User className="w-5 h-5" /> Profile
                  </button>
                  <button 
                    onClick={() => { userLogout?.(); onPageChange('home'); setMobileMenuOpen(false); }} 
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-semibold"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button 
                    onClick={() => { onPageChange('login'); setMobileMenuOpen(false); }} 
                    className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-bold"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => { onPageChange('signup'); setMobileMenuOpen(false); }} 
                    className="bg-green-600 text-white px-4 py-3 rounded-lg font-bold"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
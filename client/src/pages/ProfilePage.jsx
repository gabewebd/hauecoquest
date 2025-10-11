//Josh Andrei Aguiluz
import React, { useState, useEffect } from "react";
import {
  Award,
  Edit,
  Trophy,
  User,
  UserCircle,
  Trash2,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { userAPI } from "../utils/api";
import FacebookIcon from '../img/Facebook.png';
import InstagramIcon from '../img/Instagram.png';
import TiktokIcon from '../img/Tiktok.png';

const ProfilePage = ({ onPageChange, userId }) => {
  const { user, updateUser, deleteAccount } = useUser();
  
  // Determine if we're viewing own profile or someone else's
  const isOwnProfile = !userId || userId === user?._id;
  const profileUserId = userId || user?._id;
  
  
  const [activeTab, setActiveTab] = useState("Activity");
  const [userCreatedQuests, setUserCreatedQuests] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTab, setEditTab] = useState("avatar");
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar_theme || "Leaf");
  const [headerTheme, setHeaderTheme] = useState(user?.header_theme || "leaf");
  const [editedUsername, setEditedUsername] = useState(user?.username || "");
  
  // Data states
  const [userActivity, setUserActivity] = useState([]);
  const [userQuests, setUserQuests] = useState([]);
  const [userChallengeSubmissions, setUserChallengeSubmissions] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [userPhotos, setUserPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Profile user state (the user being viewed)
  const [profileUser, setProfileUser] = useState(null);
  
  // Current display user (either logged-in user or profile user)
  const displayUser = isOwnProfile ? user : profileUser;

  // Update local state when user context changes
  useEffect(() => {
    if (user) {
      setSelectedAvatar(user.avatar_theme || "Leaf");
      setHeaderTheme(user.header_theme || "leaf");
      setEditedUsername(user.username || "");
    }
  }, [user]);

  // Fetch profile user data when component mounts or userId changes
  useEffect(() => {
    if (profileUserId) {
      fetchProfileUserData();
    }
  }, [profileUserId]);

  // Fetch tabs data after profile user is loaded
  useEffect(() => {
    if (profileUser && !isOwnProfile) {
      fetchProfileUserTabsData();
    }
  }, [profileUser, isOwnProfile]);

  // Fetch user data when component mounts or user changes (for own profile)
  useEffect(() => {
    if (user && isOwnProfile) {
      fetchUserData();
    }
  }, [user, isOwnProfile]);

  const fetchProfileUserData = async () => {
    if (isOwnProfile) {
      setProfileUser(user);
      return;
    }

    setLoading(true);
    try {
      const profileData = await userAPI.getUserProfile(profileUserId);
      setProfileUser(profileData);
    } catch (error) {
      console.error('Error fetching profile user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileUserTabsData = async () => {
    if (isOwnProfile) {
      return; // Don't fetch tabs data for own profile, it's handled by fetchUserData
    }

    try {
      // Fetch profile user's quest submissions
      if (displayUser?.role === 'user') {
        const questsRes = await fetch(`/api/quests/submissions/user/${profileUserId}`);
        if (questsRes.ok) {
          const questsData = await questsRes.json();
          setUserQuests(questsData);
        }
      } else {
        // For admin and partner, fetch quests they created
        const questsRes = await fetch('/api/quests');
        if (questsRes.ok) {
          const questsData = await questsRes.json();
          const createdQuests = questsData.filter(quest => quest.createdBy && quest.createdBy._id === profileUserId);
          setUserCreatedQuests(createdQuests);
        }
      }

      // Fetch profile user's posts/activity
      const postsRes = await fetch('/api/posts');
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        const userPosts = postsData.filter(post => post.author?._id === profileUserId || post.author === profileUserId);
        setUserActivity(userPosts);
      }

      // Fetch profile user's badges/achievements
      const badgesRes = await fetch(`/api/badges/user/${profileUserId}`);
      if (badgesRes.ok) {
        const badgesData = await badgesRes.json();
        setUserAchievements(badgesData);
      }

      // Fetch profile user's photo history
      const photosRes = await fetch(`/api/users/${profileUserId}/photos`);
      if (photosRes.ok) {
        const photosData = await photosRes.json();
        console.log('Fetched profile user photos:', photosData);
        setUserPhotos(photosData || []);
      } else {
        console.error('Failed to fetch photos:', photosRes.status, photosRes.statusText);
        setUserPhotos([]);
      }

      // Fetch profile user's challenge submissions
      if (displayUser?.role === 'user') {
        const challengeSubmissionsRes = await fetch(`/api/challenges/submissions/user/${profileUserId}`);
        if (challengeSubmissionsRes.ok) {
          const challengeSubmissionsData = await challengeSubmissionsRes.json();
          setUserChallengeSubmissions(challengeSubmissionsData || []);
        }
      }

    } catch (error) {
      console.error('Error fetching profile user tabs data:', error);
    }
  };

  const fetchUserData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            // Fetch user's quest submissions (for regular users)
            if (user.role === 'user') {
                const questsRes = await fetch('/api/quests/submissions/my', {
                    headers: { 'x-auth-token': token }
                });
                const questsData = await questsRes.json();
                setUserQuests(questsData);
            } else {
                // For admin and partner, fetch quests they created
                const questsRes = await fetch('/api/quests', {
                    headers: { 'x-auth-token': token }
                });
                const questsData = await questsRes.json();
                const createdQuests = questsData.filter(quest => quest.createdBy && quest.createdBy._id === user._id);
                setUserCreatedQuests(createdQuests);
            }

            // Fetch user's posts/activity
            const postsRes = await fetch('/api/posts', {
                headers: { 'x-auth-token': token }
            });
            const postsData = await postsRes.json();
            const userPosts = postsData.filter(post => post.author?._id === user._id || post.author === user._id);
            setUserActivity(userPosts);

            // Fetch user's badges/achievements
            const badgesRes = await fetch('/api/badges/my', {
                headers: { 'x-auth-token': token }
            });
            const badgesData = await badgesRes.json();
            setUserAchievements(badgesData);

            // Fetch user's photo history
            const photosRes = await fetch(`/api/users/${user._id}/photos`, {
                headers: { 'x-auth-token': token }
            });
            if (photosRes.ok) {
                const photosData = await photosRes.json();
                console.log('Fetched user photos:', photosData);
                setUserPhotos(photosData || []);
            } else {
                console.error('Failed to fetch user photos:', photosRes.status, photosRes.statusText);
                setUserPhotos([]);
            }

        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

  const generateAchievements = (quests) => {
    const achievements = [];
    const completedQuests = quests.filter(q => q.status === 'approved').length;
    
    if (completedQuests >= 1) {
      achievements.push({ name: 'First Steps', description: 'Complete your first quest', icon: '🌱' });
    }
    if (completedQuests >= 5) {
      achievements.push({ name: 'Quest Master', description: 'Complete 5 quests', icon: '🏆' });
    }
    if (completedQuests >= 10) {
      achievements.push({ name: 'Eco Champion', description: 'Complete 10 quests', icon: '👑' });
    }
    
    return achievements;
  };

  // Rest of your code stays the same...

  // Avatars with lucide-react icons and colors
  const avatars = [
    { name: "Leaf", gender: "Nature", color: "text-green-500", bg: "bg-green-100", image: "/assets/avatars-headers/leaf-avatar.png" },
    { name: "Sun", gender: "Energy", color: "text-yellow-500", bg: "bg-yellow-100", image: "/assets/avatars-headers/sun-avatar.png" },
    { name: "Tree", gender: "Growth", color: "text-green-600", bg: "bg-green-50", image: "/assets/avatars-headers/tree-avatar.png" },
    { name: "Water", gender: "Life", color: "text-blue-500", bg: "bg-blue-100", image: "/assets/avatars-headers/water-avatar.png" },
  ];

  const headerThemes = {
    leaf: "from-orange-400 to-pink-500",
    sun: "from-green-400 to-emerald-600",
    tree: "from-blue-400 to-indigo-500",
    water: "from-cyan-400 to-blue-500",
  };

  const headerImages = {
    leaf: "/assets/avatars-headers/leaf-header.png",
    sun: "/assets/avatars-headers/sun-header.png",
    tree: "/assets/avatars-headers/tree-header.png",
    water: "/assets/avatars-headers/water-header.png",
  };

  const handleSaveChanges = async () => {
    const result = await updateUser({
      username: editedUsername,
      avatar_theme: selectedAvatar,
      header_theme: headerTheme,
    });
    
    if (result.success) {
      setIsEditOpen(false);
    } else {
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setSelectedAvatar(user?.avatar_theme || "Leaf");
    setHeaderTheme(user?.header_theme || "leaf");
    setEditedUsername(user?.username || "");
    setIsEditOpen(false);
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const result = await deleteAccount();
      if (result.success) {
        alert('Account deleted successfully');
        onPageChange('home');
      } else {
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  const currentAvatar = avatars.find((a) => a.name === (displayUser?.avatar_theme || selectedAvatar)) || avatars[0];
  const level = Math.floor((displayUser?.points || 0) / 100) + 1;

  // Show loading if we don't have the display user data yet
  if (!displayUser && loading) {
    return (
      <div className="pt-20 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error if we can't load the profile
  if (!displayUser && !loading) {
    return (
      <div className="pt-20 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">Profile not found</p>
          <button 
            onClick={() => onPageChange('home')}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 flex flex-col min-h-screen">
      {/* Banner */}
      <div className="relative flex justify-center">
        <div 
          className="bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${headerImages[displayUser?.header_theme || headerTheme] || headerImages.orange})`,
            height: '400px',
            width: '1200px', // Fixed width to match header image aspect ratio
            maxWidth: '100%' // Ensure it doesn't exceed screen width
          }}
        >
        </div>
        {/* Profile Card */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-20 w-full max-w-4xl px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center relative">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {currentAvatar?.image ? (
                  <img 
                    src={currentAvatar.image} 
                    alt={currentAvatar.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full ${currentAvatar?.bg} flex justify-center items-center`} style={{display: currentAvatar?.image ? 'none' : 'flex'}}>
                  <UserCircle className={`w-20 h-20 ${currentAvatar?.color}`} />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {level}
              </div>
            </div>

            {/* Info */}
            <div className="ml-6 flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{displayUser?.username || "Guest"}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  displayUser?.role === 'admin' 
                    ? 'bg-red-100 text-red-700' 
                    : displayUser?.role === 'partner'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {displayUser?.role === 'admin' ? 'Admin' : displayUser?.role === 'partner' ? 'Partner' : 'Student'}
                </span>
              </div>
              <p className="text-gray-600">{displayUser?.hau_affiliation || "HAU Student"}</p>
              <p className="text-sm text-gray-500 mt-1">
                Environmental science student passionate about making a
                difference on campus.
              </p>

              {/* Stats */}
              <div className="flex gap-6 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-500" /> {displayUser?.points || 0} points
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-orange-500" /> {displayUser?.questsCompleted?.length || 0} quests completed
                </div>
              </div>
            </div>

            {/* Actions - Only show edit button for own profile */}
            {isOwnProfile && (
              <div className="flex gap-2 absolute top-4 right-4">
                <button
                  onClick={() => { 
                    setSelectedAvatar(displayUser?.avatar_theme || "Leaf");
                    setHeaderTheme(displayUser?.header_theme || "leaf");
                    setEditedUsername(displayUser?.username || "");
                    setEditTab("profile"); 
                    setIsEditOpen(true); 
                  }}
                  className="px-3 py-1 bg-gray-100 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-200"
                >
                  <Edit className="w-4 h-4" /> Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-28 max-w-4xl mx-auto px-4 flex-grow">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-6">
          <div className="flex justify-center gap-3">
            {displayUser?.role === 'user' ? 
              ["Activity", "Quests", "Photo History", "Achievements"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 text-sm ${
                    activeTab === tab
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              )) :
              ["Activity", "Created Quests", "Photo History", "Achievements"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 text-sm ${
                    activeTab === tab
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))
            }
          </div>
        </div>

        {/* Content */}
        <div className="py-10">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {activeTab === "Activity" && (
                <div className="space-y-6">
                  {userActivity.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        📝
                      </div>
                      <p className="text-gray-500">No activity yet. Start posting to build your activity feed!</p>
                    </div>
                  ) : (
                    userActivity.map((post, index) => (
                      <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-3">{post.content}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          <span>{post.likes?.length || 0} likes</span>
                          <span>{post.comments?.length || 0} comments</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "Quests" && (
                <div className="space-y-6">
                  {userQuests.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        🎯
                      </div>
                      <p className="text-gray-500">No quest submissions yet. Start completing quests to build your quest history!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {userQuests.map((quest, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg text-gray-900 truncate">{quest.quest_id?.title || 'Quest Submission'}</h3>
                              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{quest.quest_id?.description || quest.reflection_text || 'Quest description'}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-3 flex-shrink-0 ${
                              quest.status === 'approved' ? 'bg-green-100 text-green-700' :
                              quest.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {quest.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                            <span>Submitted: {new Date(quest.submitted_at).toLocaleDateString()}</span>
                            <span>{quest.quest_id?.points || 0} points</span>
                            <span>Category: {quest.quest_id?.category || 'General'}</span>
                            <span>Difficulty: {quest.quest_id?.difficulty || 'Medium'}</span>
                          </div>
                          <div className="flex justify-end">
                            <button 
                              onClick={() => onPageChange('quest-details', quest.quest_id?._id)}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm font-semibold"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Created Quests" && (
                <div className="space-y-4">
                  {userCreatedQuests.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p>No quests created yet</p>
                    </div>
                  ) : (
                    userCreatedQuests.map((quest, index) => (
                      <div key={index} className="bg-white p-6 rounded-xl shadow-md border">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg">{quest.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            quest.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {quest.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{quest.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Created: {new Date(quest.createdAt).toLocaleDateString()}</span>
                            <span>{quest.points} points</span>
                            <span>Category: {quest.category}</span>
                            <span>Difficulty: {quest.difficulty}</span>
                          </div>
                          <button 
                            onClick={() => onPageChange('quest-details', quest._id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm font-semibold"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "Photo History" && (
                <div className="space-y-6">
                  {userPhotos.length === 0 && userChallengeSubmissions.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        📷
                      </div>
                      <p className="text-gray-500">No photos uploaded yet. Complete quests and challenges to build your photo history!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Quest Submissions */}
                      {userPhotos.map((photo, index) => (
                        <div key={`quest-${index}`} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                          <div className="aspect-square bg-gray-100 flex items-center justify-center">
                            {photo.photo_url || photo.image_url ? (
                              <img 
                                src={photo.photo_url || photo.image_url}
                                alt={`Quest: ${photo.quest_title}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className="w-full h-full flex items-center justify-center text-gray-400" style={{display: 'none'}}>
                              📷 Photo not available
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-sm">{photo.quest_title}</h3>
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Quest</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{photo.quest_category}</p>
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                photo.status === 'approved' ? 'bg-green-100 text-green-700' :
                                photo.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {photo.status}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(photo.submitted_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Challenge Submissions */}
                      {userChallengeSubmissions.map((submission, index) => (
                        <div key={`challenge-${index}`} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                          <div className="aspect-square bg-gray-100 flex items-center justify-center">
                            {submission.photo_url ? (
                              <img 
                                src={submission.photo_url}
                                alt={`Challenge: ${submission.challenge_id?.title}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className="w-full h-full flex items-center justify-center text-gray-400" style={{display: 'none'}}>
                              📷 Photo not available
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-sm">{submission.challenge_id?.title}</h3>
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">Challenge</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{submission.challenge_id?.category || 'Community Challenge'}</p>
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                submission.status === 'approved' ? 'bg-green-100 text-green-700' :
                                submission.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {submission.status}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(submission.submitted_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Achievements" && (
                <div className="space-y-6">
                  {userAchievements.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                      <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No achievements yet. Complete quests to earn badges!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userAchievements.map((userBadge, index) => (
                        <div key={index} className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-sm border border-yellow-200 text-center">
                          <div className="text-4xl mb-3">{userBadge.badge_id?.image_url || '🏆'}</div>
                          <h3 className="font-bold text-lg mb-2 text-yellow-800">{userBadge.badge_id?.name || 'Achievement'}</h3>
                          <p className="text-yellow-600 text-sm mb-2">{userBadge.badge_id?.description || 'Great job!'}</p>
                          <p className="text-xs text-yellow-500">
                            Earned: {new Date(userBadge.earned_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-2xl relative shadow-lg border border-gray-200">
            {/* Header Tabs */}
            <div className="bg-gray-50 rounded-xl p-3 mb-6">
              <div className="flex gap-3">
                <button
                  onClick={() => setEditTab("profile")}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 text-sm ${
                    editTab === "profile"
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setEditTab("avatar")}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 text-sm ${
                    editTab === "avatar"
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Choose Avatar
                </button>
                <button
                  onClick={() => setEditTab("header")}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 text-sm ${
                    editTab === "header"
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Header Theme
                </button>
              </div>
            </div>

            {/* Profile Tab */}
            {editTab === "profile" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Username</label>
                  <input
                    type="text"
                    value={editedUsername}
                    onChange={(e) => setEditedUsername(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your username"
                  />
                </div>
                
              </div>
            )}

            {/* Avatar Tab */}
            {editTab === "avatar" && (
              <div className="grid grid-cols-2 gap-6">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.name}
                    onClick={() => setSelectedAvatar(avatar.name)}
                    className={`p-4 border-2 rounded-xl cursor-pointer text-center transition ${
                      selectedAvatar === avatar.name
                        ? "bg-green-100 border-green-500"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-gray-200">
                      {avatar.image ? (
                        <img 
                          src={avatar.image} 
                          alt={avatar.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full ${avatar.bg} flex justify-center items-center`} style={{display: avatar.image ? 'none' : 'flex'}}>
                        <UserCircle className={`w-16 h-16 ${avatar.color}`} />
                      </div>
                    </div>
                    <h3 className="mt-2 font-medium">{avatar.name}</h3>
                    <p className="text-xs text-gray-500">
                      {avatar.gender} • Perfect For You!
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Header Theme Tab */}
            {editTab === "header" && (
              <div className="grid grid-cols-2 gap-6">
                {Object.keys(headerImages).map((theme) => (
                  <div
                    key={theme}
                    onClick={() => setHeaderTheme(theme)}
                    className={`h-40 rounded-xl cursor-pointer border-4 transition overflow-hidden relative ${
                      headerTheme === theme
                        ? "border-green-500"
                        : "border-gray-200"
                    }`}
                  >
                    <div 
                      className="w-full h-full bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${headerImages[theme]})`
                      }}
                    >
                      {headerTheme === theme && (
                        <div className="w-full h-full bg-black bg-opacity-20 flex items-center justify-center">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handleCancelEdit}
                className="px-6 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      
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
              <li><button onClick={() => onPageChange('contactquestmasters')} className="hover:text-white">Contact Quest Masters</button></li>
              <li><button onClick={() => onPageChange('alliancepartners')} className="hover:text-white">Alliance Partners</button></li>
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
};

export default ProfilePage;

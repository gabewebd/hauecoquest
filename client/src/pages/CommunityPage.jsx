//Josh Andrei Aguiluz
import React, { useState, useEffect } from 'react';
import { Users, Heart, Trophy, Leaf, UserPlus, Share2, Award, Shield, Search, MessageCircle, MoreHorizontal, Flag, Smile, Camera, Users2, FileText, X } from 'lucide-react';
import FacebookIcon from '../img/Facebook.png';
import InstagramIcon from '../img/Instagram.png';
import TiktokIcon from '../img/Tiktok.png';
import { postAPI, questAPI, userAPI } from '../utils/api';
import { useUser } from '../context/UserContext';

// Reusable component for each post in the community feed
const PostCard = ({ avatar, name, title, time, text, quest, image, likes, comments, onLike, onComment, postId, user, onPageChange, isPinned, onPin }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentCount, setCommentCount] = useState(comments);

  const handleLike = () => {
    if (!user) {
      onPageChange('login');
      return;
    }
    if (onLike) {
      onLike(postId);
    }
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleComment = () => {
    if (!user) {
      onPageChange('login');
      return;
    }
    if (commentText.trim()) {
      if (onComment) {
        onComment(postId, commentText);
      }
      setCommentText('');
      setCommentCount(prev => prev + 1);
      setShowCommentInput(false);
    }
  };

  const handleShare = () => {
    if (!user) {
      onPageChange('login');
      return;
    }
    // Copy link to clipboard
    const postUrl = `${window.location.origin}/community/post/${postId}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      alert('Post link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy link. Please try again.');
    });
    
    if (onShare) {
      onShare(postId);
    }
  };

  return (
  <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />
        <div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onPageChange('profile', postId)}
              className="font-bold text-gray-800 hover:text-green-600 hover:underline"
            >
              {name}
            </button>
            <span className="text-blue-500">✔️</span>
            {isPinned && (
              <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded ml-2">
                📌 Pinned by Admin
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{title} • {time}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-400">
        {/* Admin can pin posts */}
        {user && user.role === 'admin' && (
          <button 
            onClick={() => onPin && onPin(postId)}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            Pin Post
          </button>
        )}
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
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 hover:text-red-500 ${isLiked ? 'text-red-500' : ''}`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} /> {likeCount}
        </button>
        <button 
          onClick={() => setShowCommentInput(!showCommentInput)}
          className="flex items-center gap-2 hover:text-blue-500"
        >
          <MessageCircle className="w-5 h-5" /> {commentCount}
        </button>
      </div>
      {/* FIXED: Replaced text-primary-green with text-green-600 */}
      <button 
        onClick={() => onPageChange('post-details', postId)}
        className="text-sm font-bold text-green-600 hover:underline"
      >
        View Details
      </button>
    </div>
    
    {showCommentInput && (
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-2 border border-gray-200 rounded-lg resize-none"
          rows="2"
        />
        <div className="flex justify-end gap-2 mt-2">
          <button 
            onClick={() => setShowCommentInput(false)}
            className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
          <button 
            onClick={handleComment}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Comment
          </button>
        </div>
      </div>
    )}
  </div>
  );
};

// Create Post Modal Component
const CreatePostModal = ({ isOpen, onClose, onSubmit, user }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Updates',
    tags: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const postData = {
        ...formData,
        photo: selectedFile,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      };
      
      await onSubmit(postData);
      
      // Reset form
      setFormData({ title: '', content: '', category: 'Updates', tags: '' });
      setSelectedFile(null);
      setPreviewUrl(null);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-2xl font-bold">Create New Post</h3>
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
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="What's your environmental story?"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Updates">Updates</option>
              <option value="Environmental Tips">Environmental Tips</option>
              <option value="Success Stories">Success Stories</option>
              <option value="Events">Events</option>
              <option value="News">News</option>
              <option value="Community Challenge">Community Challenge</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Content</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="6"
              placeholder="Share your environmental journey, tips, or achievements..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., recycling, sustainability, tips"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Post Image (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="post-image-upload"
              />
              <label 
                htmlFor="post-image-upload" 
                className="cursor-pointer block text-center"
              >
                {previewUrl ? (
                  <div className="space-y-2">
                    <img 
                      src={previewUrl} 
                      alt="Post preview" 
                      className="max-h-32 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-green-600">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                      <Camera className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">Click to upload image</p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Create Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CommunityPage = ({ onPageChange }) => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]); // Store all posts for filtering
  const [communityChallenge, setCommunityChallenge] = useState(null);
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalLikes: 0,
    questsCompleted: 0,
    totalPoints: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Recent Activity');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'x-auth-token': token
        }
      });
      
      if (response.ok) {
        // Refresh posts to show updated likes
        fetchCommunityData();
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ text: commentText })
      });
      
      if (response.ok) {
        // Refresh posts to show updated comments
        fetchCommunityData();
      }
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  const handlePin = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/pin`, {
        method: 'PUT',
        headers: {
          'x-auth-token': token
        }
      });
      
      if (response.ok) {
        // Refresh posts to show updated pin status
        fetchCommunityData();
        alert('Post pinned successfully!');
      }
    } catch (error) {
      console.error('Error pinning post:', error);
      alert('Failed to pin post');
    }
  };

  const handleJoinChallenge = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/dashboard/join-challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
      
      if (response.ok) {
        alert('Successfully joined the challenge!');
        // Refresh challenge data
        const challengeResponse = await fetch('http://localhost:5000/api/dashboard/community-challenge');
        const challengeData = await challengeResponse.json();
        setCommunityChallenge(challengeData.challenge);
      } else {
        const errorData = await response.json();
        alert(errorData.msg || 'Failed to join challenge');
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
      alert('Failed to join challenge');
    }
  };

  const fetchCommunityData = async () => {
   
    try {
      // Fetch posts
      const postsData = await postAPI.getAllPosts();
      
      // Fetch users for stats
      const usersData = await userAPI.getLeaderboard();
      
      // Fetch quests for stats
      const questsData = await questAPI.getAllQuests();
      
      // Fetch community challenge
      const challengeResponse = await fetch('http://localhost:5000/api/dashboard/community-challenge');
      const challengeData = await challengeResponse.json();
      setCommunityChallenge(challengeData.challenge);
      
      // Calculate stats
      const totalLikes = postsData.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
      const totalPoints = usersData.reduce((sum, user) => sum + (user.eco_score || user.points || 0), 0);
      const completedQuests = questsData.filter(q => !q.isActive).length;
      
      setStats({
        activeUsers: usersData.length,
        totalLikes: totalLikes,
        questsCompleted: completedQuests,
        totalPoints: totalPoints
      });
      
      // Transform posts for display
      const transformedPosts = postsData.map((post, index) => {
        const author = post.author;
        const timeAgo = getTimeAgo(new Date(post.created_at));
        
        return {
          id: post._id || index,
          avatar: `https://i.pravatar.cc/150?u=${author?.username || 'user'}`,
          name: author?.username || 'Anonymous',
          title: getRoleTitle(author?.role, author?.questsCompleted || 0),
          time: timeAgo,
          text: post.content,
          quest: post.category === 'Updates' ? null : post.category,
          image: post.image_url ? `http://localhost:5000${post.image_url}` : null,
          likes: post.likes?.length || 0,
          comments: post.comments?.length || 0,
          shares: 0,
          created_at: post.created_at,
          isPinned: post.isPinned || false
        };
      });
      
      setAllPosts(transformedPosts);
      setPosts(transformedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching community data:', error);
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const getRoleTitle = (role, questsCompleted) => {
    if (role === 'admin') return 'Quest Master';
    if (role === 'partner') return 'Environmental Partner';
    
    if (questsCompleted >= 20) return 'Sustainability Champion';
    if (questsCompleted >= 15) return 'Eco-Warrior';
    if (questsCompleted >= 10) return 'Green Guardian';
    if (questsCompleted >= 5) return 'Nature Defender';
    if (questsCompleted >= 3) return 'Eco-Enthusiast';
    return 'Green Rookie';
  };

  // Filter and search functionality
  useEffect(() => {
    let filteredPosts = [...allPosts];
    
    // Apply search filter
    if (searchTerm) {
      filteredPosts = filteredPosts.filter(post => 
        post.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply activity filter
    if (activeFilter === 'Recent Activity') {
      filteredPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (activeFilter === 'Most Popular') {
      filteredPosts.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
    }
    
    setPosts(filteredPosts);
  }, [allPosts, searchTerm, activeFilter]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCreatePost = async (postData) => {
    try {
      console.log('Creating post with data:', postData);
      const result = await postAPI.createPost(postData);
      console.log('Post creation result:', result);
      
      // Refresh the posts
      fetchCommunityData();
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert(`Failed to create post: ${error.message}`);
      throw error;
    }
  };

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
                
                {/* Only show the "Join Community" button if the user is NOT logged in */}
                {!user && (
                  <button 
                    onClick={() => onPageChange('signup')}
                    className="flex items-center gap-2 bg-green-500 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105"
                  >
                    <UserPlus className="w-5 h-5"/> Join Community
                  </button>
                )}

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
                <div className="bg-white p-4 rounded-2xl shadow-md border flex items-center gap-4"><Users className="w-8 h-8 text-blue-500"/><div><p className="text-2xl font-bold">{loading ? '...' : stats.activeUsers}</p><p className="text-sm text-gray-500">Active Heroes</p></div></div>
                <div className="bg-white p-4 rounded-2xl shadow-md border flex items-center gap-4"><Heart className="w-8 h-8 text-red-500"/><div><p className="text-2xl font-bold">{loading ? '...' : stats.totalLikes}</p><p className="text-sm text-gray-500">Total Likes</p></div></div>
                <div className="bg-white p-4 rounded-2xl shadow-md border flex items-center gap-4"><Trophy className="w-8 h-8 text-yellow-500"/><div><p className="text-2xl font-bold">{loading ? '...' : stats.questsCompleted}</p><p className="text-sm text-gray-500">Quests Completed</p></div></div>
                <div className="bg-white p-4 rounded-2xl shadow-md border flex items-center gap-4"><Leaf className="w-8 h-8 text-green-500"/><div><p className="text-2xl font-bold">{loading ? '...' : stats.totalPoints}</p><p className="text-sm text-gray-500">Total Points</p></div></div>
            </div>
        </section>
        
        {/* Community Challenge */}
        <section className="container mx-auto px-4 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-lg p-6">
            {communityChallenge ? (
              <>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🌳</div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 text-green-800">{communityChallenge.title}</h3>
                  <p className="text-gray-700 max-w-xl mx-auto">{communityChallenge.description}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between text-sm font-semibold mb-3">
                      <span className="text-green-700">Trees Planted</span>
                      <span className="text-green-700">{communityChallenge.current_progress || 0} / {communityChallenge.target}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                        style={{ width: `${Math.min(((communityChallenge.current_progress || 0) / communityChallenge.target) * 100, 100)}%` }}
                      >
                        <span className="text-white text-xs font-bold">
                          {Math.round(((communityChallenge.current_progress || 0) / communityChallenge.target) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {communityChallenge.participants?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600 font-semibold">Eco-Warriors</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {communityChallenge.target - (communityChallenge.current_progress || 0)}
                      </div>
                      <div className="text-xs text-gray-600 font-semibold">Trees to Go</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl mb-1">🏆</div>
                      <div className="text-xs text-gray-600 font-semibold">Tree Master Badge</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {!user ? (
                      <>
                        <button 
                          onClick={() => onPageChange('signup')}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-full shadow-lg transition transform hover:scale-105"
                        >
                          🌱 Sign Up to Join Challenge
                        </button>
                        <button 
                          onClick={() => onPageChange('login')}
                          className="bg-white hover:bg-gray-50 text-green-600 font-bold px-8 py-4 rounded-full shadow-lg border-2 border-green-600 transition transform hover:scale-105"
                        >
                          🔑 Login to Join
                        </button>
                      </>
                    ) : user.role === 'user' ? (
                      <>
                        <button 
                          onClick={() => onPageChange('challenge-details', communityChallenge._id)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-full shadow-lg transition transform hover:scale-105"
                        >
                          🌱 Join Challenge & Earn Badge
                        </button>
                        <button 
                          onClick={() => onPageChange('challenge-details', communityChallenge._id)}
                          className="bg-white hover:bg-gray-50 text-green-600 font-bold px-6 py-3 rounded-full shadow-lg border-2 border-green-600 transition transform hover:scale-105"
                        >
                          📊 View Challenge
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => onPageChange('challenge-details', communityChallenge._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full shadow-lg transition transform hover:scale-105"
                      >
                        👁️ View Challenge Progress
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Users2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">No Active Challenge</h3>
                <p className="text-gray-500">Check back later for new community challenges!</p>
              </div>
            )}
          </div>
        </section>

        {/* Community Feed */}
        <section className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Community Feed</h3>
            {user && (
              <button 
                onClick={() => setShowCreatePostModal(true)}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                <FileText className="w-4 h-4" />
                Create Post
              </button>
            )}
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex flex-wrap gap-2">
              {['Recent Activity', 'Most Popular'].map((filter) => (
                <button 
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    activeFilter === filter 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white border text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Search community posts..." 
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500" 
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          {/* Posts */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-lg border text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">No Community Updates Yet</h3>
              <p className="text-gray-500">Be the first to share your environmental journey!</p>
            </div>
          ) : (
            <>
              <div>
                {posts.map((post, index) => (
                  <PostCard 
                    key={index} 
                    {...post} 
                    onLike={handleLike}
                    onComment={handleComment}
                    onPin={handlePin}
                    postId={post.id || index}
                    user={user}
                    onPageChange={onPageChange}
                    isPinned={post.isPinned}
                  />
                ))}
              </div>
              
              {posts.length > 10 && (
                <div className="text-center mt-8">
                  <button className="bg-white border font-bold text-gray-700 py-3 px-8 rounded-full hover:bg-gray-50">Load More Posts</button>
                </div>
              )}
            </>
          )}
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

        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={showCreatePostModal}
          onClose={() => setShowCreatePostModal(false)}
          onSubmit={handleCreatePost}
          user={user}
        />
    </div>
  );
}

export default CommunityPage;


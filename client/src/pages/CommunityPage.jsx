//Josh Andrei Aguiluz
import React, { useState, useEffect } from 'react';
import { Users, Heart, Trophy, Leaf, UserPlus, Share2, Award, Shield, Search, MessageCircle, MoreHorizontal, Flag, Smile, Camera, Users2, FileText, X, Sparkles, Target, Plus } from 'lucide-react';
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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <img src={avatar} alt={name} className="w-12 h-12 rounded-full border-2 border-gray-100" />
          <div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange('profile', postId)}
                className="font-bold text-gray-900 hover:text-green-600 transition-colors"
              >
                {name}
              </button>
              {isPinned && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold border border-amber-200">
                  Pinned
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{title} • {time}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user && user.role === 'admin' && (
            <button
              onClick={() => onPin && onPin(postId)}
              className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              Pin
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-800 mb-4 leading-relaxed">{text}</p>

      {quest && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-3 py-2 rounded-lg inline-block mb-4">
          {quest}
        </div>
      )}

      {image && (
        <div className="rounded-xl overflow-hidden border border-gray-200 mb-4">
          <img src={image} alt="Post content" className="w-full object-cover max-h-96" />
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center gap-6 text-gray-500">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 hover:text-red-500 transition-colors font-medium ${isLiked ? 'text-red-500' : ''}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{likeCount}</span>
          </button>
          <button
            onClick={() => setShowCommentInput(!showCommentInput)}
            className="flex items-center gap-2 hover:text-blue-500 transition-colors font-medium"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{commentCount}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 hover:text-green-500 transition-colors font-medium"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => onPageChange('post-details', postId)}
          className="text-sm font-bold text-green-600 hover:text-green-700 transition-colors"
        >
          View Details
        </button>
      </div>

      {showCommentInput && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="3"
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setShowCommentInput(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleComment}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
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
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-2xl font-bold text-gray-900">Create New Post</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-900">Post Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="What's your environmental story?"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-900">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
            <label className="block text-sm font-bold mb-2 text-gray-900">Content</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              rows="6"
              placeholder="Share your environmental journey, tips, or achievements..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-900">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="e.g., recycling, sustainability, tips"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-900">Post Image (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-green-500 transition-colors">
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
                  <div className="space-y-3">
                    <img
                      src={previewUrl}
                      alt="Post preview"
                      className="max-h-40 mx-auto rounded-xl border-2 border-gray-200"
                    />
                    <p className="text-sm text-green-600 font-semibold">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl mx-auto flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 font-semibold">Click to upload image</p>
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
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors font-bold flex items-center justify-center gap-2"
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
  const [allPosts, setAllPosts] = useState([]);
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
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'x-auth-token': token
        }
      });

      if (response.ok) {
        fetchCommunityData();
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ text: commentText })
      });

      if (response.ok) {
        fetchCommunityData();
      }
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  const handlePin = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/posts/${postId}/pin`, {
        method: 'PUT',
        headers: {
          'x-auth-token': token
        }
      });

      if (response.ok) {
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
      const response = await fetch('/api/dashboard/join-challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });

      if (response.ok) {
        alert('Successfully joined the challenge!');
        const challengeResponse = await fetch('/api/dashboard/community-challenge');
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
      const postsData = await postAPI.getAllPosts();
      const usersData = await userAPI.getLeaderboard('all');
      const questsData = await questAPI.getAllQuests();

      const challengeResponse = await fetch('/api/dashboard/community-challenge');
      const challengeData = await challengeResponse.json();
      setCommunityChallenge(challengeData.challenge);

      const totalLikes = postsData.reduce((sum, post) => sum + (post.likes?.length || 0), 0);

      // Handle department leaderboard data structure
      let totalPoints = 0;
      let totalUsers = 0;
      if (usersData.leaderboard && Array.isArray(usersData.leaderboard)) {
        totalPoints = usersData.leaderboard.reduce((sum, dept) => sum + (dept.totalPoints || 0), 0);
        totalUsers = usersData.leaderboard.reduce((sum, dept) => sum + (dept.userCount || 0), 0);
      }

      const completedQuests = questsData.filter(q => !q.isActive).length;

      setStats({
        activeUsers: totalUsers,
        totalLikes: totalLikes,
        questsCompleted: completedQuests,
        totalPoints: totalPoints
      });

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
          image: post.image_url ? `${post.image_url}` : null,
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

  useEffect(() => {
    let filteredPosts = [...allPosts];

    if (searchTerm) {
      filteredPosts = filteredPosts.filter(post =>
        post.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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

      fetchCommunityData();
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert(`Failed to create post: ${error.message}`);
      throw error;
    }
  };

  return (
    <div className="font-sans bg-gray-50 text-gray-900 min-h-screen pb-28">
      <main className="pt-20 pb-12">
        {/* Page Header */}
        <section className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-xl shadow-lg">
                  <Users2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-gray-900 mb-1">Community Hub</h1>
                  <p className="text-gray-600 text-sm">Connect with fellow eco-heroes and share your journey</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{loading ? '...' : stats.activeUsers}</p>
                  <p className="text-xs text-gray-500 font-semibold">Active Heroes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{loading ? '...' : stats.totalLikes}</p>
                  <p className="text-xs text-gray-500 font-semibold">Total Likes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{loading ? '...' : stats.questsCompleted}</p>
                  <p className="text-xs text-gray-500 font-semibold">Quests Done</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{loading ? '...' : stats.totalPoints}</p>
                  <p className="text-xs text-gray-500 font-semibold">Total Points</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Two Column Layout */}
        <section className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - Community Challenge (1 column) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Community Challenge Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
                  {communityChallenge ? (
                    <>
                      {/* Challenge Header with Image Placeholder */}
                      <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-6 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-5 left-5 w-20 h-20 bg-white rounded-full"></div>
                          <div className="absolute bottom-5 right-5 w-24 h-24 bg-white rounded-full"></div>
                        </div>
                        <div className="relative text-center text-white">
                          <div className="w-24 h-24 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl mx-auto mb-4 flex items-center justify-center border-2 border-white border-opacity-30">
                            <Target className="w-12 h-12" />
                          </div>
                          <h3 className="text-xl font-black mb-2">{communityChallenge.title}</h3>
                        </div>
                      </div>

                      {/* Challenge Content */}
                      <div className="p-6">
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                          {communityChallenge.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-6">
                          <div className="flex justify-between text-xs font-bold mb-2 text-gray-700">
                            <span>Progress</span>
                            <span className="text-green-600">
                              {communityChallenge.current_progress || 0} / {communityChallenge.target}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(((communityChallenge.current_progress || 0) / communityChallenge.target) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          <div className="text-center p-3 bg-green-50 rounded-xl">
                            <div className="text-xl font-black text-green-600 mb-1">
                              {communityChallenge.participants?.length || 0}
                            </div>
                            <div className="text-xs text-gray-600 font-semibold">Warriors</div>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-xl">
                            <div className="text-xl font-black text-blue-600 mb-1">
                              {communityChallenge.target - (communityChallenge.current_progress || 0)}
                            </div>
                            <div className="text-xs text-gray-600 font-semibold">Remaining</div>
                          </div>
                        </div>

                        {/* Action Button */}
                        {!user ? (
                          <button
                            onClick={() => onPageChange('signup')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-3 rounded-xl shadow-md transition-all"
                          >
                            Join Challenge
                          </button>
                        ) : user.role === 'user' ? (
                          <button
                            onClick={() => onPageChange('challenge-details', communityChallenge._id)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-3 rounded-xl shadow-md transition-all"
                          >
                            View Challenge
                          </button>
                        ) : (
                          <button
                            onClick={() => onPageChange('challenge-details', communityChallenge._id)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-xl shadow-md transition-all"
                          >
                            View Progress
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-gray-300" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-600 mb-2">No Active Challenge</h3>
                      <p className="text-sm text-gray-500">Check back later for new challenges!</p>
                    </div>
                  )}
                </div>

                {/* Quick Info Card */}
                {!user && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                    <h4 className="font-black text-gray-900 mb-2">Join Our Community</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Connect with eco-heroes and start making an impact today.
                    </p>
                    <button
                      onClick={() => onPageChange('signup')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2.5 rounded-lg transition-all"
                    >
                      Sign Up Now
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Content - Posts Feed (2 columns) */}
            <div className="lg:col-span-2">
              {/* Filters - Made Sticky with proper z-index and backdrop */}
              <div className="sticky top-20 z-40 bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-6 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex gap-2">
                    {['Recent Activity', 'Most Popular'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => handleFilterChange(filter)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeFilter === filter
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                  <div className="relative w-full md:w-64">
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Posts Container - with proper overflow clipping */}
              <div className="relative">
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none z-30"></div>

                {/* Posts */}
                {loading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="bg-white p-16 rounded-2xl shadow-lg border border-gray-200 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-600 mb-2">No Posts Found</h3>
                    <p className="text-gray-500">
                      {searchTerm ? 'Try adjusting your search' : 'Be the first to share your story!'}
                    </p>
                  </div>
                ) : (
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

                    {posts.length > 10 && (
                      <div className="text-center mt-6 mb-24">
                        <button className="bg-white border-2 border-gray-200 font-bold text-gray-700 py-3 px-8 rounded-xl hover:bg-gray-50 transition-all">
                          Load More Posts
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="container mx-auto px-6 py-16">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left side - Placeholder Image */}
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-12 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
                  <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full"></div>
                </div>
                <div className="relative text-center text-white z-10">
                  <div className="w-48 h-48 bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl mx-auto mb-6 flex items-center justify-center border-4 border-white border-opacity-30">
                    <div className="text-center">
                      <Users2 className="w-20 h-20 mx-auto mb-3" />
                      <span className="text-2xl font-black">Community</span>
                      <br />
                      <span className="text-lg font-bold">Guidelines</span>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-white opacity-90">Build a Better Community</p>
                </div>
              </div>

              {/* Right side - Guidelines */}
              <div className="p-10 flex flex-col justify-center">
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-gray-900 mb-3">Community Guidelines</h2>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Keep our community positive, supportive, and focused on environmental action
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Smile className="w-7 h-7 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1 text-base">Stay Positive</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Encourage and support fellow eco-heroes in their journey</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Camera className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1 text-base">Share Progress</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Document and celebrate your environmental impact with the community</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users2 className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1 text-base">Collaborate</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Work together with others to create lasting positive change</p>
                    </div>
                  </div>
                </div>
              </div>
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
                <a href="#"><img src={TiktokIcon} alt="TikTok" className="w-6 h-6" /></a>
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

      {/* Sticky Create Post Button - Fixed to bottom center */}
      {user && (
        <button
          onClick={() => setShowCreatePostModal(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl hover:bg-green-700 transition-all hover:scale-105 flex items-center gap-2 font-bold"
        >
          <Plus className="w-5 h-5" />
          <span>Create Post</span>
        </button>
      )}
    </div>
  );
}

export default CommunityPage;

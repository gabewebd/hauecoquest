//Josh Andrei Aguiluz
import React, { useState, useEffect } from 'react';
import { Users, Heart, Trophy, Leaf, UserPlus, Share2, Award, Shield, Search, MessageCircle, MoreHorizontal, Flag, Smile, Camera, Users2, FileText } from 'lucide-react';
import { postAPI, questAPI, userAPI } from '../utils/api';
import { useUser } from '../context/UserContext';

// Reusable component for each post in the community feed
const PostCard = ({ avatar, name, title, time, text, quest, image, likes, comments, shares, onLike, onComment, onShare, postId, user, onPageChange }) => {
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
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 hover:text-green-500"
        >
          <Share2 className="w-5 h-5" /> {shares}
        </button>
      </div>
      {/* FIXED: Replaced text-primary-green with text-green-600 */}
      <a href="#" className="text-sm font-bold text-green-600 hover:underline">View Details</a>
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

const CommunityPage = ({ onPageChange }) => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]); // Store all posts for filtering
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalLikes: 0,
    questsCompleted: 0,
    totalPoints: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Recent Activity');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const handleLike = async (postId) => {
    try {
      // You could implement actual like functionality here
      console.log('Liked post:', postId);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      // You could implement actual comment functionality here
      console.log('Commented on post:', postId, commentText);
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  const handleShare = async (postId) => {
    try {
      // You could implement actual share functionality here
      console.log('Shared post:', postId);
    } catch (error) {
      console.error('Error sharing post:', error);
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
          image: null, // Can be extended if posts have images
          likes: post.likes?.length || 0,
          comments: post.comments?.length || 0,
          shares: 0,
          created_at: post.created_at
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
                <button 
                  onClick={() => user ? alert('Challenge joined!') : onPageChange('login')}
                  className="bg-green-500 text-white font-bold py-2 px-5 rounded-full"
                >
                  {user ? 'Join Challenge' : 'Login to Join'}
                </button>
                <button onClick={() => onPageChange('leaderboard')} className="font-semibold hover:underline">View Leaderboard</button>
              </div>
            </div>
          </div>
        </section>

        {/* Community Feed */}
        <section className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-4">Community Feed</h3>
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
                    onShare={handleShare}
                    postId={post.id || index}
                    user={user}
                    onPageChange={onPageChange}
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
              <li><button onClick={() => onPageChange('quests')} className="hover:text-white">Browse Epic Quests</button></li>
              <li><button onClick={() => onPageChange('quests')} className="hover:text-white">Upcoming Events</button></li>
              <li><button onClick={() => onPageChange('community')} className="hover:text-white">Hero Community</button></li>
              <li><button onClick={() => onPageChange('leaderboard')} className="hover:text-white">Hall of Fame</button></li>
            </ul>
          </div>

          {/* Support Guild */}
          <div>
            <h4 className="font-bold mb-4">Support Guild</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li><button onClick={() => onPageChange('quests')} className="hover:text-white">Contact Quest Masters</button></li>
              <li><button onClick={() => onPageChange('community')} className="hover:text-white">Alliance Partners</button></li>
              <li><button onClick={() => onPageChange('community')} className="hover:text-white">Help Center</button></li>
              <li><button onClick={() => onPageChange('quests')} className="hover:text-white">Quest Rules</button></li>
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


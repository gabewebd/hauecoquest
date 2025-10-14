//Josh Andrei Aguiluz
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, User, Calendar, Tag, Eye, X } from 'lucide-react';
import { useUser } from '../context/UserContext';

// Helper function to get avatar image
const getAvatarImage = (avatarTheme) => {
  const avatarMap = {
    'Leaf': '/assets/avatars-headers/leaf-avatar.png',
    'Sun': '/assets/avatars-headers/sun-avatar.png', 
    'Tree': '/assets/avatars-headers/tree-avatar.png',
    'Water': '/assets/avatars-headers/water-avatar.png'
  };
  return avatarMap[avatarTheme] || '/assets/avatars-headers/leaf-avatar.png';
};

// Image Modal Component
const ImageModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-2 sm:p-4" onClick={onClose}>
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute -top-8 sm:-top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
        <img
          src={imageUrl}
          alt="Full size"
          className="max-w-full max-h-full object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

const PostDetailsPage = ({ onPageChange, postId }) => {
  const { user } = useUser();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (postId) {
      fetchPostDetails();
    }
  }, [postId]);

  const fetchPostDetails = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      const data = await response.json();
      setPost(data);
      setLikeCount(data.likes?.length || 0);
      setIsLiked(data.likes?.includes(user?._id) || false);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post details:', error);
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      onPageChange('login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'x-auth-token': token
        }
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setLikeCount(updatedPost.likes?.length || 0);
        setIsLiked(updatedPost.likes?.includes(user._id) || false);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      onPageChange('login');
      return;
    }

    if (!commentText.trim()) return;

    setSubmittingComment(true);
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
        const updatedPost = await response.json();
        setPost(updatedPost);
        setCommentText('');
      }
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
    setSubmittingComment(false);
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      alert('Post link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy link. Please try again.');
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-600 mb-4">Post Not Found</h1>
          <button
            onClick={() => onPageChange('community')}
            className="bg-green-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-600 text-sm sm:text-base"
          >
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-50 text-gray-800 min-h-screen">
      <div className="container mx-auto px-4 pt-16 sm:pt-24 pb-6 sm:pb-8">
        {/* Header */}
        <div className="sticky top-16 sm:top-20 z-30 bg-gray-50 py-3 sm:py-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => onPageChange('community')}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Back to Community
            </button>
          </div>
        </div>

        {/* Post Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-8 mb-6 sm:mb-8">
          {/* Author Info */}
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <img
              src={getAvatarImage(post.author?.avatar_theme)}
              alt={post.author?.username}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
              onError={(e) => {
                e.target.src = `https://i.pravatar.cc/150?u=${post.author?.username || 'user'}`;
              }}
            />
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2">
                <button
                  onClick={() => onPageChange('profile', { userId: post.author?._id })}
                  className="font-bold text-base sm:text-lg hover:text-green-600 transition-colors text-left"
                >
                  {post.author?.username || 'Anonymous'}
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">✔️</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${post.author?.role === 'admin' ? 'bg-red-100 text-red-700' :
                      post.author?.role === 'partner' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                    }`}>
                    {post.author?.role === 'admin' ? 'Admin' :
                      post.author?.role === 'partner' ? 'Partner' : 'Student'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  {post.views} views
                </div>
              </div>
            </div>
          </div>

          {/* Post Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>

          {/* Post Content */}
          <div className="prose max-w-none mb-4 sm:mb-6">
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Post Image */}
          {post.image_url && (
            <div className="mb-4 sm:mb-6">
              <img
                src={`${post.image_url}`}
                alt="Post content"
                className="rounded-lg w-full max-h-64 sm:max-h-96 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setShowImageModal(true)}
              />
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 sm:pt-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 hover:text-red-500 transition ${isLiked ? 'text-red-500' : 'text-gray-500'
                  }`}
              >
                <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-semibold text-sm sm:text-base">{likeCount}</span>
              </button>
              <div className="flex items-center gap-2 text-gray-500">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="font-semibold text-sm sm:text-base">{post.comments?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
            Comments ({post.comments?.length || 0})
          </h2>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleComment} className="mb-6 sm:mb-8">
              <div className="flex gap-3 sm:gap-4">
                <img
                  src={getAvatarImage(user.avatar_theme)}
                  alt={user.username}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://i.pravatar.cc/150?u=${user.username}`;
                  }}
                />
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm sm:text-base"
                    rows="3"
                    required
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={submittingComment || !commentText.trim()}
                      className="bg-green-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {submittingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <p className="text-gray-500 mb-4 text-sm sm:text-base">Please log in to comment</p>
              <button
                onClick={() => onPageChange('login')}
                className="bg-green-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-600 text-sm sm:text-base"
              >
                Login
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4 sm:space-y-6">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <div key={index} className="flex gap-3 sm:gap-4">
                  <img
                    src={getAvatarImage(comment.user?.avatar_theme)}
                    alt={comment.user?.username}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://i.pravatar.cc/150?u=${comment.user?.username || 'user'}`;
                    }}
                  />
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                        <button
                          onClick={() => onPageChange('profile', { userId: comment.user?._id })}
                          className="font-semibold text-gray-800 hover:text-green-600 transition-colors text-left text-sm sm:text-base"
                        >
                          {comment.user?.username || 'Anonymous'}
                        </button>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm sm:text-base">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm sm:text-base">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <ImageModal imageUrl={post.image_url} onClose={() => setShowImageModal(false)} />
      )}
    </div>
  );
};

export default PostDetailsPage;

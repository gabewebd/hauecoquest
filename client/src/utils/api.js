// API Utility for HAU Eco-Quest
const API_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('token');

// Helper function to create headers
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['x-auth-token'] = token;
    }
  }
  
  return headers;
};

// Auth APIs
export const authAPI = {
  signup: async (userData) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  requestPartnerAccess: async () => {
    const response = await fetch(`${API_URL}/auth/request-partner-access`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return response.json();
  },
};

// User APIs
export const userAPI = {
  getProfile: async () => {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    return response.json();
  },

  getLeaderboard: async () => {
    const response = await fetch(`${API_URL}/users/leaderboard`, {
      headers: getHeaders(false),
    });
    return response.json();
  },

  getUserStats: async (userId) => {
    const response = await fetch(`${API_URL}/users/${userId}/stats`, {
      headers: getHeaders(false),
    });
    return response.json();
  },

  deleteAccount: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },
};

// Quest APIs
export const questAPI = {
  getAllQuests: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/quests?${params}`, {
      headers: getHeaders(false),
    });
    return response.json();
  },

  getQuestById: async (questId) => {
    const response = await fetch(`${API_URL}/quests/${questId}`, {
      headers: getHeaders(false),
    });
    return response.json();
  },

  createQuest: async (questData) => {
    const response = await fetch(`${API_URL}/quests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(questData),
    });
    return response.json();
  },

  updateQuest: async (questId, questData) => {
    const response = await fetch(`${API_URL}/quests/${questId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(questData),
    });
    return response.json();
  },

  deleteQuest: async (questId) => {
    const response = await fetch(`${API_URL}/quests/${questId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },

  submitQuest: async (questId, formData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/quests/${questId}/submit`, {
      method: 'POST',
      headers: {
        'x-auth-token': token,
      },
      body: formData, // FormData for file upload
    });
    return response.json();
  },

  getMySubmissions: async () => {
    const response = await fetch(`${API_URL}/quests/submissions/my`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  getPendingSubmissions: async () => {
    const response = await fetch(`${API_URL}/quests/submissions/pending`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  reviewSubmission: async (submissionId, status, rejection_reason = '') => {
    const response = await fetch(`${API_URL}/quests/submissions/${submissionId}/review`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, rejection_reason }),
    });
    return response.json();
  },
};

// Post/Community APIs
export const postAPI = {
  getAllPosts: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/posts?${params}`, {
      headers: getHeaders(false),
    });
    return response.json();
  },

  getPostById: async (postId) => {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      headers: getHeaders(false),
    });
    return response.json();
  },

  createPost: async (postData) => {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(postData),
    });
    return response.json();
  },

  updatePost: async (postId, postData) => {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(postData),
    });
    return response.json();
  },

  deletePost: async (postId) => {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },

  likePost: async (postId) => {
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return response.json();
  },

  commentOnPost: async (postId, text) => {
    const response = await fetch(`${API_URL}/posts/${postId}/comment`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text }),
    });
    return response.json();
  },
};

// Admin APIs
export const adminAPI = {
  getAllUsers: async () => {
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  updateUserRole: async (userId, role) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ role }),
    });
    return response.json();
  },

  approvePartner: async (userId) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}/approve`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return response.json();
  },

  deleteUser: async (userId) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },

  getPartnerRequests: async () => {
    const response = await fetch(`${API_URL}/admin/partner-requests`, {
      headers: getHeaders(),
    });
    return response.json();
  },
};

export default {
  auth: authAPI,
  user: userAPI,
  quest: questAPI,
  post: postAPI,
  admin: adminAPI,
};


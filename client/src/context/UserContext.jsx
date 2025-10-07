//Josh Andrei Aguiluz
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, userAPI } from '../utils/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }

    // Set up periodic checking for approval status changes (every 30 seconds)
    let intervalId;
    if (token) {
      intervalId = setInterval(() => {
        fetchUser();
      }, 30000); // Check every 30 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await authAPI.getCurrentUser();

      // Check if approval status changed
      if (user && userData) {
        // User was pending and now approved (role changed from user to partner/admin)
        if (user.requested_role && !user.is_approved && userData.is_approved && userData.role !== 'user' && userData.role !== user.role) {
          const roleTitle = userData.role === 'partner' ? 'Partner' : 'Admin';
          alert(`🎉 Congratulations! Your ${roleTitle} request has been approved! You now have access to additional features. Redirecting to your dashboard...`);

          // Redirect to appropriate dashboard
          setTimeout(() => {
            if (userData.role === 'admin') {
              window.location.href = '/admin-dashboard';
            } else if (userData.role === 'partner') {
              window.location.href = '/partner-dashboard';
            }
          }, 2000);
          return; // Don't continue with normal user setting
        }
        // User request was rejected (had requested_role, now null and still user)
        else if (user.requested_role && !userData.requested_role && userData.role === 'user') {
          const roleTitle = user.requested_role === 'partner' ? 'Partner' : 'Admin';
          alert(`Your ${roleTitle} request was not approved at this time. You can still enjoy all the regular user features!`);
        }
      }

      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authAPI.login({ email, password });

      if (data.success) {
        localStorage.setItem('token', data.token);
        // Use the user data from the login response instead of making another API call
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  };

  const signup = async (username, email, password, role = 'user', department) => {
    try {
      console.log('Attempting signup with:', { username, email, role, department });
      const data = await authAPI.signup({ username, email, password, role, department });
      console.log('Signup response data:', data);

      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return {
          success: true,
          message: data.message,
          user: data.user,
          pendingApproval: data.user.requested_role && !data.user.is_approved
        };
      } else {
        console.error('Signup failed:', data.error);
        return { success: false, error: data.error || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = async (updatedData) => {
    try {
      // Update in backend (MongoDB)
      const result = await userAPI.updateProfile(updatedData);

      // Update local state
      setUser(prev => ({ ...prev, ...result }));

      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const deleteAccount = async () => {
    try {
      await userAPI.deleteAccount();
      localStorage.removeItem('token');
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Error deleting account:', error);
      return { success: false, error: 'Failed to delete account' };
    }
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  const requestRole = async (roleRequested) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('/api/auth/request-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ roleRequested })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update user state with new requested_role
        setUser(prev => ({
          ...prev,
          requested_role: data.user.requested_role,
          is_approved: data.user.is_approved
        }));
        return { success: true, message: data.msg };
      } else {
        return { success: false, error: data.msg || 'Role request failed' };
      }
    } catch (error) {
      console.error('Role request error:', error);
      return { success: false, error: `Network error: ${error.message}` };
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      updateUser,
      deleteAccount,
      setUser,
      refreshUser: fetchUser,
      notification,
      dismissNotification,
      requestRole
    }}>
      {children}
    </UserContext.Provider>
  );
};

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

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await authAPI.getCurrentUser();
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
      return { success: false, error: 'Network error' };
    }
  };

  const signup = async (username, email, password, role = 'user') => {
    try {
      console.log('Attempting signup with:', { username, email, role });
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role }),
      });
      
      const data = await response.json();
      console.log('Signup response status:', response.status);
      console.log('Signup response data:', data);

      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return { success: true, message: data.message, user: data.user };
      } else {
        console.error('Signup failed:', data.error);
        return { success: false, error: data.error || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Network error' };
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
      refreshUser: fetchUser 
    }}>
      {children}
    </UserContext.Provider>
  );
};

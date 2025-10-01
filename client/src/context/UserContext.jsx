//Josh Andrei Aguiluz
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Function to set the auth token for all future axios requests
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      localStorage.removeItem('token');
    }
  };

  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      const res = await axios.get('http://localhost:5000/api/auth/user');
      setUser(res.data);
    } catch (err) {
      console.error('Failed to load user', err);
      setAuthToken(null); // Clear token if it's invalid
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    const body = { email, password };
    const res = await axios.post('http://localhost:5000/api/auth/login', body);
    setAuthToken(res.data.token);
    await loadUser(); // Load user data after setting token
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };
  
  const value = {
    user,
    token,
    isLoggedIn: !!user,
    loading,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
// Josh Andrei Aguiluz
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

// This is a mock user for demonstration purposes.
const mockUser = {
  name: 'Shirley A.',
  email: 'shirley.a@example.com',
  points: 1250,
  role: 'user', // 'user', 'partner', or 'admin'
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Set to null for logged-out, or mockUser for logged-in

  const login = () => setUser(mockUser);
  const logout = () => setUser(null);

  // Derived permissions
  const canManageContent = user?.role === 'admin' || user?.role === 'partner';
  const canSubmitProposals = user?.role === 'partner';

  const value = {
    user,
    login,
    logout,
    canManageContent,
    canSubmitProposals,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
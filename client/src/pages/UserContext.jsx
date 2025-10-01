import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

// Key used to store user data in Local Storage
const USER_STORAGE_KEY = 'hauEcoQuestUser';

export const UserProvider = ({ children }) => {
  
  // 1. Initialize state by checking Local Storage first.
  // This function only runs once when the component mounts (on page load/refresh).
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Error reading user data from Local Storage:", error);
    }
    
    // Fallback to the default initial state if no data is found or an error occurs.
    return {
      username: "Maria Student",
      avatar: "Girl Avatar 1", // This is the default if no preference is saved
      headerTheme: "orange",
      points: 450,
      badges: 2,
      friends: 3,
      role: "student"
    };
  });

  // 2. The updateUser function is modified to save the new state to Local Storage
  const updateUser = (updates) => {
    setUser((prev) => {
      // Merge previous state with new updates
      const newState = { ...prev, ...updates };
      
      // Save the updated state to Local Storage immediately
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newState));
      } catch (error) {
        console.error("Error saving user data to Local Storage:", error);
      }
      
      return newState;
    });
  };

  // 3. The logout function is modified to remove the user data from Local Storage
  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error("Error removing user data from Local Storage:", error);
    }
  };

  // Optional: A useEffect hook to sync state changes to Local Storage, 
  // though it's already covered in setUser/updateUser/logout logic above. 
  // Leaving it out for simplicity unless complex async operations are needed.

  return (
    <UserContext.Provider value={{ user, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
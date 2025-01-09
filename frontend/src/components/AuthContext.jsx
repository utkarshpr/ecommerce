import React, { createContext, useState, useContext, useEffect } from 'react';

// Create AuthContext
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // To store user data

  // Login function
  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData); // Set the logged-in user's data
  };

  // Logout function
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null); // Clear user data
    document.cookie = 'authToken=; Max-Age=0; path=/'; // Clear auth token
    document.cookie = 'refreshToken=; Max-Age=0; path=/'; // Clear refresh token
  };

  // Function to fetch user data from the server
  const fetchUserData = async () => {
    const token = getTokenFromCookies();
    // console.log("TOKEN ",token);
    
    if (token) {
      try {
        const response = await fetch('http://localhost:8081/auth/getUserData', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        // console.log("loogedin result ",result)
        if (result.Status) {
          login(result.data); // Store user data after successful fetch
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        logout();
      }
    }
  };

  // Helper function to get token from cookies
  const getTokenFromCookies = () => {
    const match = document.cookie.match('(^|;)\\s*' + 'authToken' + '=([^;]+)');
    return match ? match[2] : null;
  };

  // Fetch user data when the component mounts
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData(); // Fetch user data after logging in
      
    }
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // for navigation after logout
import { useAuth } from './AuthContext';

const Logout = () => {
  const [error, setError] = useState('');
  const { logout } = useAuth(); 
  const navigate = useNavigate();


  const getTokenFromCookies = () => {
    const match = document.cookie.match('(^|;)\\s*' + 'authToken' + '=([^;]+)');
    return match ? match[2] : null;
  };

  const handleLogout = async () => {
    const token = getTokenFromCookies(); // Retrieve token from cookies

    if (!token) {
      setError('No token found');
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.Status) {
        // Clear token from cookies
        document.cookie = 'authToken=; Max-Age=0; path=/'; // Clear authToken cookie
        document.cookie = 'refreshToken=; Max-Age=0; path=/'; // Clear refreshToken cookie

        // Optionally, clear from localStorage if you use it
        localStorage.removeItem('username');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        logout();
        // Redirect to the homepage or login page after logout
        navigate('/login');
      } else {
        setError('Failed to log out');
      }
    } catch (error) {
      setError('An error occurred during logout');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Logging Out...</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // for navigation after logout
import { useAuth } from './AuthContext';

const Logout = () => {
  const [showModal, setShowModal] = useState(false); // For modal visibility
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const getTokenFromCookies = () => {
    const match = document.cookie.match('(^|;)\\s*' + 'authToken' + '=([^;]+)');
    return match ? match[2] : null;
  };

  const handleLogout = async () => {
    const token = getTokenFromCookies();

    if (!token) {
      setError('No token found');
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.Status) {
        // Clear cookies and local storage
        document.cookie = 'authToken=; Max-Age=0; path=/';
        document.cookie = 'refreshToken=; Max-Age=0; path=/';
        localStorage.removeItem('username');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        logout();
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
      <h1 className="text-3xl font-bold mb-6">Logout</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <button
        onClick={() => setShowModal(true)}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
      >
        Logout
      </button>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to log out?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logout;

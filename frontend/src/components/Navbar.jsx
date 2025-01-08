import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility
  const [showModal, setShowModal] = useState(false); // Logout confirmation modal visibility
  const navigate = useNavigate();

  const handleHome = () => navigate('/');
  const handleProfile = () => {
    navigate(`/profile/${user?.id}`);
    setShowDropdown(false); // Close dropdown
  };
  const handleNotifications = () => {
    navigate('/notifications');
    setShowDropdown(false); // Close dropdown
  };
  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 sticky top-0 z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold cursor-pointer" onClick={handleHome}>
          MyApp
        </div>

        <div className="space-x-4 flex items-center">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-700 transition duration-300"
              >
                Signup
              </button>
            </>
          ) : (
            <div className="relative">
              <div
                className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center cursor-pointer"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {user?.first_name?.charAt(0)}
              </div>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded-lg shadow-lg">
                  <ul className="py-2">
                    <li
                      onClick={handleProfile}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition duration-300"
                    >
                      Profile
                    </li>
                    <li
                      onClick={handleNotifications}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition duration-300"
                    >
                      Notifications
                    </li>
                    <li
                      onClick={() => {
                        setShowModal(true);
                        setShowDropdown(false);
                      }}
                      className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer transition duration-300"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl text-gray-700 font-bold mb-4">
                Are you sure you want to log out?
              </h2>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300"
                >
                  Confirm Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

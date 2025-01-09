import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

const Navbar = () => {
  const { isLoggedIn, logout, user, login } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility
  const [showModal, setShowModal] = useState(false); // Logout confirmation modal visibility
  const [cartItemCount, setCartItemCount] = useState(0); // Track number of items in the cart
  const navigate = useNavigate();
 
  // Handle home navigation
  const handleHome = () => navigate('/');

  // Handle profile navigation
  const handleProfile = () => {
    navigate(`/profile/${user?.id}`);
    setShowDropdown(false); // Close dropdown
  };

  // Handle notifications navigation
  const handleNotifications = () => {
    navigate('/notifications');
    setShowDropdown(false); // Close dropdown
  };

  // Handle logout
  const handleLogout = async () => {
    setShowModal(false);
    logout();
    navigate('/login');
  };

  // Handle cart page navigation
  const handleCart = () => {
    navigate('/cart'); // Navigate to the cart page
  };

  return (
    <nav className="bg-gray-800 text-white p-4 sticky top-0 z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold cursor-pointer" onClick={handleHome}>
          MyApp
        </div>

        <div className="space-x-4 flex items-center">
          {/* Show cart icon and item count only when logged in */}
          {isLoggedIn && (
            <div className="relative cursor-pointer" onClick={handleCart}>
              <svg
                className="w-8 h-8 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h18l-1.5 9H4.5L3 3zM6 19a2 2 0 114 0 2 2 0 01-4 0zm12 0a2 2 0 114 0 2 2 0 01-4 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 rounded-full bg-red-500 text-white text-xs px-2 py-1">
                  {cartItemCount}
                </span>
              )}
            </div>
          )}

          {/* Conditional render based on authentication */}
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

        {/* Logout Confirmation Modal */}
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

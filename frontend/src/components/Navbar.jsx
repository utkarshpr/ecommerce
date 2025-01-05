import React from 'react';
import { useAuth } from './AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { isLoggedIn} = useAuth();
  const navigate = useNavigate();
    const handleLoginClick = () => {
      navigate('/login'); // Navigate to login page
    };
  
    const handleSignupClick = () => {
      navigate('/signup'); // Navigate to signup page
    };
    const handleLogoutClick = () => {
      navigate('/logout'); // Navigate to signup page
    };
  return (
    <nav className="bg-gray-800 text-white p-4 sticky top-0 z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">MyApp</div>

        <div className="space-x-4">
          {!isLoggedIn ? (
            <>
              <button
                onClick={handleLoginClick}
                className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
              >
                Login
              </button>
              <button
                onClick={handleSignupClick}
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
              >
                Signup
              </button>
            </>
          ) : (
            <button
             onClick={handleLogoutClick}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

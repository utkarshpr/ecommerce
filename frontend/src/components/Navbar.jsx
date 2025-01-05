import React ,{useState}from 'react';
import { useAuth } from './AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { isLoggedIn , logout} = useAuth();
   const [showModal, setShowModal] = useState(false); // For modal visibility
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
          setShowModal(false)
          navigate('/login');
        } else {
          setError('Failed to log out');
        }
      } catch (error) {
        setError('An error occurred during logout');
      }
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
            onClick={() => setShowModal(true)}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          )}
          {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl text-gray-700 font-bold mb-4">Are you sure you want to log out?</h2>
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
      </div>
    </nav>
  );
};

export default Navbar;

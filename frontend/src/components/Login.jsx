import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Login= () => {

 
  const { login } = useAuth(); 
  const navigate = useNavigate(); 
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8081/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to login');
      } else {
        const data = await response.json();
        if (data.Status) {
          // Save tokens in cookies
          document.cookie = `authToken=${data.data.token}; path=/; Secure; SameSite=Strict`;
          document.cookie = `refreshToken=${data.data.refreshtoken}; path=/; Secure; SameSite=Strict`;
  
          // Call login to update state in context
          login();
  
          // Redirect to home page after successful login
          navigate('/home');
        } else {
          setError('Login failed');
        }
      }
    } catch (error) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

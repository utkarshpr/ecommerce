import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import Alerts from "../Fragments/Alert";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [alert, setAlert] = useState({
    severity: "", // 'success', 'error', etc.
    message: "",
  });
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ severity: '', message: '' });
      }, 5000); // 5 seconds

      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [alert]);
   const [showPassword, setShowPassword] = useState(false);
  
    const togglePasswordVisibility = () => {
      setShowPassword((prevState) => !prevState);
    };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const data = await response.json();
        setAlert({
          severity: "error",
          message: data.message || "Failed to login",
        });
      } else {
        const data = await response.json();
        if (data.Status) {
          // Save tokens in cookies
          document.cookie = `authToken=${data.data.token}; path=/; Secure; SameSite=Strict`;
          document.cookie = `refreshToken=${data.data.refreshtoken}; path=/; Secure; SameSite=Strict`;

          // Call login to update state in context
          login();

          setAlert({
            severity: "success",
            message: "Login successful! Redirecting...",
          });

          // Redirect to home page after a short delay
          setTimeout(() => navigate("/home"), 1500);
        } else {
          setAlert({
            severity: "error",
            message: "Login failed",
          });
        }
      }
    } catch (error) {
      setError("An error occurred during login");
    }
  };

  return (
    <div className="">
      <div className="flex flex-col items-center justify-center p-5 ">
        {alert.message && (
          <div className="mb-4">
            <Alerts severity={alert.severity} message={alert.message} />
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4  w-1/2 shadow-md p-5 bg-gray-200" >
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6 font-sans">
            Login 
          </h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <div className="">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <div className=" flex flex-row justify-end items-end">
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="mt-2 text-blue-700 text-sm"
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </button>
            </div>
          </div>
          <div className=" flex flex-row justify-center items-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 border border-transparent hover:bg-white hover:text-blue-500 hover:border-blue-500 transition-colors duration-200"
          >
            Login
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

import React, { useEffect, useState } from "react";
import Alerts from "../Fragments/Alert";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar_url: "",
    status_message: "",
    last_seen: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    role: "",
    gender: "",
    phone_number: "",
    address: [
      {
        street: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
      },
    ],
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    severity: "", // 'success', 'error', etc.
    message: "",
  });

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ severity: "", message: "" });
      }, 5000); // 5 seconds

      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [alert]);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const [_, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        address: [
          {
            ...prev.address[0],
            [field]: value,
          },
        ],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8081/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Validation Error:",
          errorData.message || "Unknown error"
        );
        setAlert({
          severity: "error",
          message: errorData.message || " : Validation Error",
        });
        return;
      }

      const data = await response.json();
      // console.log(data.message);

      // alert("Signup successful: ",data );
      setAlert({
        severity: "success",
        message: "Signup successful! Redirecting...",
      });

      // Redirect to home page after a short delay
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Error:", error);
      // alert("Signup failed: " + error.message);
      setAlert({
        severity: "error",
        message: error.message,
      });
    }
  };

  return (
    <div className=" ">
      <div className="flex flex-col items-center justify-center p-5">
        {alert.message && (
          <div className="mb-4">
            <Alerts severity={alert.severity} message={alert.message} />
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className=" space-y-4  w-1/2 shadow-md p-5  bg-gray-200"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6 font-sans">
            Signup 
          </h2>

          <div>
            {/* <label className="block text-gray-700 font-medium">Username</label> */}
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            {/* <label className="block text-gray-700 font-medium">Email</label> */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            {/* <label className="block text-gray-700 font-medium">Password</label> */}
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
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

          <div>
            {/* <label className="block text-gray-700 font-medium">First Name</label> */}
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            {/* <label className="block text-gray-700 font-medium">Last Name</label> */}
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            {/* <label className="block text-gray-700 font-medium">Last Name</label> */}
            <input
              type="number"
              name="phone_number"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            {/* <label className="block text-gray-700 font-medium">Role</label> */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Select Role</option>
              <option value="ADMIN">Admin</option>
              <option value="CLIENT">Client</option>
            </select>
          </div>

          <div className="mb-4">
            {/* <label className="block text-gray-700">Gender</label> */}
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">Address</h3>

          <div>
            {/* <label className="block text-gray-700 font-medium">Street</label> */}
            <input
              type="text"
              placeholder="Street or Landmark"
              name="address.street"
              value={formData.address[0].street}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            {/* <label className="block text-gray-700 font-medium">City</label> */}
            <input
              type="text"
              name="address.city"
              placeholder="City and State"
              value={formData.address[0].city}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            {/* <label className="block text-gray-700 font-medium">Country</label> */}
            <input
              type="text"
              name="address.country"
              placeholder="Country"
              value={formData.address[0].country}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className=" flex flex-row justify-center items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4 border border-transparent hover:bg-white hover:text-blue-500 hover:border-blue-500 transition-colors duration-200"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;

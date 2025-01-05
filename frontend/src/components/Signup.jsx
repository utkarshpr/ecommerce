import React, { useState } from "react";

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
        console.error("Validation Error:", errorData.message || "Unknown error");
        alert(errorData.message || "Validation failed!");
       return
      }

      const data = await response.json();
      console.log(data.message);
      
      alert("Signup successful: ",data );
    } catch (error) {
      console.error("Error:", error);
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <div className=" bg-gray-500 ">
      <div className="flex flex-row items-center justify-center p-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Signup Form
        </h2>

        <div>
          <label className="block text-gray-700 font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

       

        <div>
          <label className="block text-gray-700 font-medium">First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Last Name</label>
          <input
            type="number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          >
             <option value="">Select Role</option>
            <option value="ADMIN">Admin</option>
            <option value="CLIENT">Client</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Gender</label>
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
          <label className="block text-gray-700 font-medium">Street</label>
          <input
            type="text"
            name="address.street"
            value={formData.address[0].street}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">City</label>
          <input
            type="text"
            name="address.city"
            value={formData.address[0].city}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Country</label>
          <input
            type="text"
            name="address.country"
            value={formData.address[0].country}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
      </div>
    </div>
  );
}

export default SignupPage;

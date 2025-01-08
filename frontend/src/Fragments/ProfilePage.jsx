import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import Alerts from './Alert';



const ProfilePage = () => {
  const { user, login } = useAuth(); // Fetch user from AuthContext
  const [profileData, setProfileData] = useState(user);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
  });
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const [alert, setAlert] = useState(null); // State for alert messages

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const addAddress = () => {
    setProfileData({
      ...profileData,
      address: [...(profileData.address || []), newAddress],
    });
    setNewAddress({
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    });
  };

  const getTokenFromCookies = () => {
    const match = document.cookie.match('(^|;)\\s*' + 'authToken' + '=([^;]+)');
    return match ? match[2] : null;
  };


  const saveProfile = async () => {
    scrollToTop()
    const token = getTokenFromCookies(); // Retrieve the authToken from cookies
  
    if (!token) {
        setAlertWithTimeout({ severity: 'error', message: 'You are not logged in!' });
      return;
    }
  
    // Send updated profile data to the server
    try {
      const response = await fetch('http://localhost:8081/auth/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData), // Sending updated profile data
      });
  
      const result = await response.json();
      if (result.Status) {
        login(result.data);
        setAlertWithTimeout({ severity: 'success', message: 'Profile updated successfully!' });
      } else {
        setAlertWithTimeout({ severity: 'error', message: 'Failed to update profile.' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setAlertWithTimeout({ severity: 'error', message: 'Error updating profile.' });
    }
  };

  const setAlertWithTimeout = (alertData) => {
    setAlert(alertData);
    setTimeout(() => {
      setAlert(null);
    }, 5000); // Alert will disappear after 5 seconds
  };
  return (
    <div className="container mx-auto p-6 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 text-white rounded-lg shadow-lg max-w-3xl mt-8 animate__animated animate__fadeIn">
      <h1 className="text-3xl font-semibold text-center mb-6">Profile</h1>

      {alert && <Alerts severity={alert.severity} message={alert.message} />}

      <div className="space-y-6 mt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-lg">First Name:</label>
            <input
              type="text"
              name="first_name"
              value={profileData.first_name}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition ease-in-out duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg">Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={profileData.last_name}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition ease-in-out duration-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-lg">Email:</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition ease-in-out duration-200"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-lg">Phone Number:</label>
          <input
            type="text"
            name="phone_number"
            value={profileData.phone_number}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition ease-in-out duration-200"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-lg">Role:</label>
          <input
            type="text"
            name="role"
            value={profileData.role}
            disabled
            className="w-full p-3 rounded-lg bg-gray-600 text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-lg">Gender:</label>
          <input
            type="text"
            name="gender"
            value={profileData.gender}
            disabled
            className="w-full p-3 rounded-lg bg-gray-600 text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <h2 className="text-2xl font-semibold mt-8">Addresses:</h2>
        {profileData.address?.map((addr, index) => (
          <div
            key={index}
            className="bg-gray-700 p-4 rounded-lg shadow-md mb-4 animate__animated animate__fadeInUp"
          >
            <p><strong>Street:</strong> {addr.street}</p>
            <p><strong>City:</strong> {addr.city}</p>
            <p><strong>State:</strong> {addr.state}</p>
            <p><strong>Postal Code:</strong> {addr.postal_code}</p>
            <p><strong>Country:</strong> {addr.country}</p>
          </div>
        ))}

        <h3 className="text-xl font-semibold mt-8">Add New Address:</h3>
        <div className="space-y-4">
          <input
            type="text"
            name="street"
            placeholder="Street"
            value={newAddress.street}
            onChange={handleAddressChange}
            className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition ease-in-out duration-200"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={newAddress.city}
            onChange={handleAddressChange}
            className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition ease-in-out duration-200"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={newAddress.state}
            onChange={handleAddressChange}
            className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition ease-in-out duration-200"
          />
          <input
            type="text"
            name="postal_code"
            placeholder="Postal Code"
            value={newAddress.postal_code}
            onChange={handleAddressChange}
            className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition ease-in-out duration-200"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={newAddress.country}
            onChange={handleAddressChange}
            className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition ease-in-out duration-200"
          />

          <button
            onClick={addAddress}
            className="w-full py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Add Address
          </button>
        </div>

        <div className="mt-8 text-center" >
          <button
            onClick={saveProfile}
            className="w-full py-3 text-white bg-green-500 hover:bg-green-600 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

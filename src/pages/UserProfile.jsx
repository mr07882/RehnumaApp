import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import '../styles/UserProfile.css';
import Header from '../components/Header';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserData(response.data);
        setEditedData(response.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
    setIsChanged(true);
  };

  const handleSave = async () => {
    if (window.confirm('Are you sure you want to save changes?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
          'http://localhost:5000/api/auth/profile',
          {
            name: editedData.name,
            address: editedData.address,
            phone: editedData.phone,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setUserData(response.data);
        setEditedData(response.data);
        setIsChanged(false);
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Profile update failed:', error.response?.data || error.message);
        alert('Something went wrong while updating profile.');
      }
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    navigate('/'); // Redirect to the home page
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div>
      <Header />
      <div className="user-profile-container">
        <img src="/DummyProfile.png" alt="User" className="user-image" />
        <form className="user-form">
          <label>Name</label>
          <input type="text" name="name" value={editedData.name} onChange={handleChange} />
          <label>Address</label>
          <input type="text" name="address" value={editedData.address} onChange={handleChange} />
          <label>Phone</label>
          <input type="text" name="phone" value={editedData.phone} onChange={handleChange} />
          <label>Email</label>
          <input type="text" value={editedData.email} disabled />
          <button type="button" className={`save-button ${isChanged ? 'enabled' : ''}`} onClick={handleSave} disabled={!isChanged}>
            Save Changes
          </button>
          <button type="button" className="signout-button" onClick={handleSignOut}>
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;

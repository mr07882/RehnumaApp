import React, { useState } from 'react';
import '../styles/UserProfile.css';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: 'XYZ',
    address: '123 DreamLand St',
    number: '123-456-7890',
    password: 'passwordxyz',
  });

  const [editedData, setEditedData] = useState({ ...userData });
  const [isChanged, setIsChanged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
    setIsChanged(true);
  };

  const handleSave = () => {
    if (window.confirm('Are you sure you want to save changes?')) {
      setUserData({ ...editedData });
      setIsChanged(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <Header />
      <div className="user-profile-container">
        <img
          src="/DummyProfile.png" 
          alt="User"
          className="user-image"
        />
        <form className="user-form">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={editedData.name}
            onChange={handleChange}
          />
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={editedData.address}
            onChange={handleChange}
          />
          <label>Number</label>
          <input
            type="text"
            name="number"
            value={editedData.number}
            onChange={handleChange}
          />
          <label>Password</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={editedData.password}
              onChange={handleChange}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{
                marginLeft: '10px',
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <button
            type="button"
            className={`save-button ${isChanged ? 'enabled' : ''}`}
            onClick={handleSave}
            disabled={!isChanged}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
import React from 'react';
import '../styles/UserProfile.css';
import Header from '../components/Header'; // Import Header
import { Link } from 'react-router-dom';

const UserProfile = () => {
  return (
    <div>
      <Header /> {/* Add Header */}
      <div style={{ paddingTop: '100px' }}> {/* Add padding to prevent overlap */}
        <h1>THIS IS USER PROFILE PAGE</h1>
      </div>
    </div>
  );
};

export default UserProfile;
import React from 'react';
import '../styles/Output.css';
import Header from '../components/Header'; // Import Header
import { Link } from 'react-router-dom';

const Output = () => {
  return (
    <div>
      <Header /> {/* Add Header */}
      <div style={{ paddingTop: '100px' }}> {/* Add padding to prevent overlap */}
        <h1>THIS IS THE OPTIMISED OUTPUT PAGE</h1>
      </div>
    </div>
  );
};

export default Output;
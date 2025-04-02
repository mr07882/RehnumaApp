import React from 'react';
import '../styles/GeneratePlan.css';
import Header from '../components/Header'; // Import Header
import { Link } from 'react-router-dom';

const GeneratePlan = () => {
  return (
    <div>
      <Header /> {/* Add Header */}
      <div style={{ paddingTop: '100px' }}> {/* Add padding to prevent overlap */}
        <h1>THIS IS GeneratePlan PAGE</h1>
      </div>
    </div>
  );
};

export default GeneratePlan;
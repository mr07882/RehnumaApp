import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setIsExiting(true);
    setTimeout(() => navigate(path), 500); 
  };

  return (
    <div className={`home-container ${isExiting ? 'exit-animation' : ''}`}>
      <h1 className="app-logo">رَہنُما</h1>
      <div className="cta-buttons">
        <button
          onClick={() => handleNavigation('/Login')}
          className="cta-button login-btn"
        >
          Login
        </button>
        <button
          onClick={() => handleNavigation('/SignUp')}
          className="cta-button signup-btn"
        >
          Sign Up
        </button>
      </div>

      
      <div className="app-description">
        <h2 className="description-title">Your Smart Shopping Companion</h2>
        <div className="description-content">
          <p className="animated-text">
            Rehnuma helps you save time and money through:
          </p>
          <ul className="features-list">
            <li>Real-time price comparison</li>
            <li>Optimal shopping routes</li>
            <li>Fuel cost calculations</li>
            <li>Inventory updates</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
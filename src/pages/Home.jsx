import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="app-logo">رَہنُما</h1>
          <div className="cta-buttons">
            <Link to="/Page2" className="cta-button login-btn">
              Login
            </Link>
            <Link to="/Page3" className="cta-button signup-btn">
              Sign Up
            </Link>
          </div>
  
          {/* New description section */}
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
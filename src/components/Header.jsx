import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaPlusCircle, FaHistory } from 'react-icons/fa';
import '../styles/Header.css';

const Header = () => {
  const location = useLocation();
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const checkScrollability = () => {
      setIsScrollable(document.documentElement.scrollHeight > window.innerHeight);
    };

    checkScrollability();
    window.addEventListener('resize', checkScrollability);

    return () => {
      window.removeEventListener('resize', checkScrollability);
    };
  }, []);

  return (
    <header className={`main-header ${!isScrollable ? 'no-scroll' : ''}`}>
      <nav className="nav-container">
        <Link 
          to="/UserProfile" 
          className={`nav-item ${location.pathname === '/UserProfile' ? 'active' : ''}`}
        >
          <FaUser className="nav-icon" />
          <span className="nav-text">Profile</span>
        </Link>
        
        <Link 
          to="/GeneratePlan" 
          className={`nav-item ${location.pathname === '/GeneratePlan' ? 'active' : ''}`}
        >
          <FaPlusCircle className="nav-icon" />
          <span className="nav-text">New Plan</span>
        </Link>
        
        <Link 
          to="/History" 
          className={`nav-item ${location.pathname === '/History' ? 'active' : ''}`}
        >
          <FaHistory className="nav-icon" />
          <span className="nav-text">History</span>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LocationHandler from '../components/LocationHandler';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const [error, setError] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [isLocationAllowed, setIsLocationAllowed] = useState(false);
  const navigate = useNavigate();

  const handleAllowLocation = () => {
    LocationHandler(
      (lat, lng, supermarkets) => {
        setLocationData({ lat, lng, supermarkets });
        setIsLocationAllowed(true);
        setError('');
      },
      (errorMessage) => {
        setError(errorMessage);
        setIsLocationAllowed(false);
      }
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (locationData) {
        await axios.put(
          'http://localhost:5000/api/auth/profile',
          {
            location: {
              lat: locationData.lat,
              lng: locationData.lng
            },
            nearbySupermarkets: locationData.supermarkets
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }

      navigate('/UserProfile');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRedirectToSignUp = () => {
    setIsSwiping(true);
    setTimeout(() => {
      navigate('/SignUp');
    }, 500);
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className={`login-container ${isSwiping ? 'swipe-right' : ''}`}>
      <div className="login-left" onClick={handleRedirectToSignUp}>
        <div className="login-arrow">←</div>
        <div className="left-content">
          <h2>New Here?</h2>
          <p>Click anywhere in this area to create a new account</p>
        </div>
      </div>
      <div className="login-right">
        <h1 className="login-heading">Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
            <p className="forgot-password-link" onClick={handleForgotPassword}>
              Forgot Password?
            </p>
          </div>
          
          <button
            type="button"
            className="location-button"
            onClick={handleAllowLocation}
          >
            Allow Location Track
          </button>

          {error && <p className="error-message">{error}</p>}

          <button 
            type="submit" 
            className="login-button"
            disabled={!email || !password || !isLocationAllowed}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
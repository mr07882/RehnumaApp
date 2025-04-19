import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import '../styles/SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    password: '',
    confirmPassword: '',
    locationPermission: false,
  });

  const [error, setError] = useState('');
  const [isSwiping, setIsSwiping] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { name, email, address, phone, password, confirmPassword, locationPermission } = formData;

    if (!name || !email || !address || !phone || !password || !confirmPassword || !locationPermission) {
      setError('Please fill all fields and agree to location tracking.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        address,
        phone,
        password,
      });

      console.log('Signup successful:', response.data);
      setError('');
      navigate('/login'); // ✅ Redirect to login after successful signup
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleRedirectToLogin = () => {
    setIsSwiping(true);
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  return (
    <div className={`signup-container ${isSwiping ? 'swipe-left' : ''}`}>
      <div className="signup-left">
        <h1 className="signup-heading">Welcome to Rehnuma</h1>
        <form onSubmit={handleSignUp} className="signup-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="signup-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="signup-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="signup-input"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            className="signup-input"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              className="signup-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <div className="password-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="signup-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <div className="signup-checkbox">
            <input
              type="checkbox"
              name="locationPermission"
              checked={formData.locationPermission}
              onChange={handleChange}
              required
            />
            <label>I agree to location tracking to use the services</label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="signup-button">Create Account</button>
        </form>
      </div>

      <div className="signup-right" onClick={handleRedirectToLogin}>
        <div className="signup-arrow">→</div>
        <div className="right-content">
          <h2>Already a Member?</h2>
          <p>Click anywhere in this area to sign in to your existing account</p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

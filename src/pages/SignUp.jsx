import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    locationPermission: false,
  });

  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate function

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    const { name, email, address, phone, locationPermission } = formData;

    if (!name || !email || !address || !phone || !locationPermission) {
      setError('Please fill all fields and agree to location tracking.');
      return;
    }

    setError('');
    console.log('Sign-up successful:', formData);
    navigate('/GeneratePlan'); // Redirect to GeneratePlan page
  };

  return (
    <div className="signup-container">
      <h1 className="signup-heading">Sign Up</h1>
      <form onSubmit={handleSignUp}>
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
        {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
      <Link to="/login" className="signup-link">Already have an account? Log in</Link>
    </div>
  );
};

export default SignUp;
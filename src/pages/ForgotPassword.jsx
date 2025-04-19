import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/forgetPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(res.data.message);
      setError('');
      localStorage.setItem('resetEmail', email);
      setTimeout(() => {
        navigate('/reset-password');
      }, 1500);
    } catch (err) {
      setMessage('');
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSendCode} className="auth-form">
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="auth-input"
        />
        <button class="auth-button" type="submit" className="auth-button">Send Reset Code</button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <p
        style={{ marginTop: '1rem', cursor: 'pointer', color: '#007bff' }}
        onClick={() => navigate('/login')}
      >
        ← Back to Login
      </p>
    </div>
  );
};

export default ForgotPassword;

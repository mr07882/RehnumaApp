import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const ResetPassword = () => {
  const [form, setForm] = useState({ code: '', newPassword: '' });
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    if (!storedEmail) {
      setError('No email found. Please restart password reset.');
    } else {
      setEmail(storedEmail);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        code: form.code,
        newPassword: form.newPassword,
      });

      setMessage(res.data.message);
      setError('');
      localStorage.removeItem('resetEmail'); // ✅ cleanup

      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
      setMessage('');
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleReset} className="auth-form">
        <input
          type="text"
          name="code"
          placeholder="Enter 6-digit OTP"
          value={form.code}
          onChange={handleChange}
          required
          className="auth-input"
        />
        <input
          type="password"
          name="newPassword"
          placeholder="Enter new password"
          value={form.newPassword}
          onChange={handleChange}
          required
          className="auth-input"
        />
        <button type="submit" className="auth-button">Reset Password</button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ResetPassword;

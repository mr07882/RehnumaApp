import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [isSwiping, setIsSwiping] = useState(false); // State to control swipe animation
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Add login logic here
    console.log('Email:', email, 'Password:', password);
    navigate('/GeneratePlan'); // Redirect to GeneratePlan page
  };

  const handleRedirectToSignUp = () => {
    setIsSwiping(true); // Trigger swipe animation
    setTimeout(() => {
      navigate('/SignUp'); // Redirect after animation
    }, 500); // Match the duration of the CSS transition
  };

  return (
    <div className={`login-container ${isSwiping ? 'swipe-right' : ''}`}>
      <div className="login-left" onClick={handleRedirectToSignUp}>
        <div className="login-arrow">←</div> {/* Left-pointing arrow */}
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
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        
      </div>
    </div>
  );
};

export default Login;




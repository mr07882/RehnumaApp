import React, { useState } from 'react';
import '../styles/GeneratePlan.css';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GeneratePlan = () => {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      setItems([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleGeneratePlan = async () => {
    if (items.length === 0) {
      setErrorMessage('Please add some items before generating a plan.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/plan/generate',
        { items },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate('/Output', { state: response.data });
    } catch (error) {
      console.error('Plan generation error:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to generate plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="generate-plan-container">
      <Header />
      <div className="content-wrapper">
        <h1 className="heading">PLAN YOUR SHOPPING LIST</h1>
        
        <div className="input-section">
          <input
            type="text"
            className="search-box"
            placeholder="Enter Grocery Item..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <p className="instruction-text">Press Enter to add items</p>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="item-list">
          {items.map((item, index) => (
            <div key={index} className="item-card">
              <span className="item-text">{item}</span>
              <button
                className="remove-button"
                onClick={() => handleRemoveItem(index)}
                disabled={isLoading}
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <button
          className={`generate-plan-button ${isLoading ? 'loading' : ''}`}
          onClick={handleGeneratePlan}
          disabled={isLoading || items.length === 0}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              GENERATING PLAN...
            </>
          ) : (
            'GENERATE MY PLAN'
          )}
        </button>
      </div>
    </div>
  );
};

export default GeneratePlan;
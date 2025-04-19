import React, { useState } from 'react';
import '../styles/GeneratePlan.css';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';

const GeneratePlan = () => {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
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

  const handleGeneratePlan = () => {
    if (items.length === 0) {
      alert("Please enter some grocery items before generating the plan.");
      return;
    }
    navigate('/Output');
  };

  return (
    <div>
      <Header />
      <div style={{ paddingTop: '100px' }}>
        <h1 className="heading">PLAN YOUR SHOPPING LIST</h1>
        <input
          type="text"
          className="search-box"
          placeholder="Enter Grocery Item..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <div className="item-list">
          {items.map((item, index) => (
            <div key={index} className="item">
              {item}
              <button
                className="remove-button"
                onClick={() => handleRemoveItem(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <button
          className="generate-plan-button"
          onClick={handleGeneratePlan}
        >
          GENERATE MY PLAN
        </button>
      </div>
    </div>
  );
};

export default GeneratePlan;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/Output.css';
import axios from 'axios';

const Output = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [planData, setPlanData] = useState({
    itinerary: [],
    totalCost: 0,
    unavailableItems: []
  });

  useEffect(() => {
    if (state) {
      setPlanData({
        itinerary: state.itinerary || [],
        totalCost: state.totalCost || 0,
        unavailableItems: state.unavailableItems || []
      });
    }
  }, [state]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev === planData.itinerary.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? planData.itinerary.length - 1 : prev - 1));
  };

  const handleSavePlan = async () => {
    const planName = window.prompt('Enter a name for your plan:');
    if (!planName?.trim()) return;
  
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
  
      const response = await axios.post(
        'http://localhost:5000/api/auth/save-plan',
        {
          planName: planName.trim(),
          planData: {
            itinerary: planData.itinerary,
            totalCost: planData.totalCost,
            unavailableItems: planData.unavailableItems
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      if (response.data.message) {
        alert('Plan saved successfully!');
        navigate('/History');
      }
    } catch (error) {
      console.error('Save plan error:', error);
      const errorMessage = error.response?.data?.error || error.message;
      alert(`Failed to save plan: ${errorMessage}`);
    }
  };

  return (
    <div className="output-container">
      <Header />
      <div className="output-content">
        <h1 className="output-heading">YOUR OPTIMIZED SHOPPING PLAN</h1>

        <div className="savings-banner">
          <div className="savings-item highlight">
            <span className="savings-label">Total Estimated Cost:</span>
            <span className="savings-value">Rs. {planData.totalCost}</span>
          </div>
        </div>

        {planData.itinerary.length === 0 ? (
          <div className="no-stores-message">
            <h2>No collaborating supermarkets found in your area</h2>
            <p>Please try again later or expand your search range</p>
          </div>
        ) : (
          <>
            <div className="carousel-container">
              <button className="carousel-arrow left" onClick={prevSlide}>
                <FaChevronLeft />
              </button>

              <div className="carousel-slides">
                {planData.itinerary.map((stop, index) => (
                  <div
                    key={stop.store}
                    className={`itinerary-stop ${index === currentSlide ? 'active' : ''}`}
                  >
                    <div className="stop-header">
                      <div className="stop-number">{index + 1}</div>
                      <div className="stop-info">
                        <h3 className="store-name">{stop.store}</h3>
                        <p className="store-address">{stop.address}</p>
                        <div className="transport-details">
                          <span>Distance: {stop.distance.toFixed(1)} km</span>
                          <span>⏱️ {stop.travelTime}</span>
                        </div>
                      </div>
                      <div className="stop-total">
                        <div className="cost-breakdown">
                          <span className="total-label">Items Total:</span>
                          <span className="total-amount">Rs. {stop.storeTotal}</span>
                        </div>
                        <div className="cost-breakdown">
                          <span className="total-label">Transport Cost:</span>
                          <span className="total-amount">Rs. {stop.transportCost}</span>
                        </div>
                      </div>
                    </div>

                    <ul className="item-list">
                      {stop.items.map((item, itemIndex) => (
                        <li key={`${stop.store}-${itemIndex}`} className="item">
                          <span className="item-bullet">➔</span>
                          <div className="item-details">
                            <span className="matched-item">{item.itemName}</span>
                            {item.originalSearch.toLowerCase() !== item.itemName.toLowerCase() && (
                              <span className="original-search">(Searched for: {item.originalSearch})</span>
                            )}
                            <span className="item-price">Rs. {item.price}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <button className="carousel-arrow right" onClick={nextSlide}>
                <FaChevronRight />
              </button>
            </div>

            <div className="carousel-dots">
              {planData.itinerary.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </>
        )}

        {planData.unavailableItems.length > 0 && (
          <div className="unavailable-section">
            <h3>⚠️ The following items were not found in nearby stores:</h3>
            <ul>
              {planData.unavailableItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="action-buttons">
          <button className="save-button" onClick={handleSavePlan}>
            SAVE THIS PLAN
          </button>
          <Link to="/GeneratePlan" className="edit-button">
            EDIT MY LIST
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Output;
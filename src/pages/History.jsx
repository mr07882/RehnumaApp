import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/History.css';

const History = () => {
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [shoppingPlans, setShoppingPlans] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cutoffItems, setCutoffItems] = useState({}); // State to track cut-off items
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setShoppingPlans(response.data.plans || []);
      } catch (error) {
        console.error('Error fetching plans:', error);
        alert('Failed to load plans. Please try again.');
      }
    };
    fetchPlans();
  }, []);

  const togglePlanSelection = (planId) => {
    setSelectedPlans(prev => 
      prev.includes(planId) ? prev.filter(id => id !== planId) : [...prev, planId]
    );
  };

  const deleteSelectedPlans = async () => {
    if (!window.confirm("Delete selected plans permanently?")) return;

    try {
      const token = localStorage.getItem('token');
      // Send a request to the backend to delete the selected plans
      await axios.delete('http://localhost:5000/api/auth/delete-plans', {
        headers: { Authorization: `Bearer ${token}` },
        data: { planIds: selectedPlans }, // Pass the selected plan IDs
      });

      // Update the frontend state to reflect the deletion
      setShoppingPlans(prev => prev.filter(p => !selectedPlans.includes(p._id)));
      setSelectedPlans([]);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete plans');
    }
  };

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % expandedPlan.data.itinerary.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + expandedPlan.data.itinerary.length) % expandedPlan.data.itinerary.length);

  const toggleItemCutoff = (store, itemIndex) => {
    setCutoffItems((prev) => ({
      ...prev,
      [store]: {
        ...prev[store],
        [itemIndex]: !prev[store]?.[itemIndex],
      },
    }));
  };

  const filteredPlans = shoppingPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="history-container">
      <Header />
      <h1 className="history-heading">YOUR SAVED SHOPPING PLANS</h1>
      
      <div className="controls">
        <input
          type="text"
          placeholder="Search plans..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
          className="delete-button"
          onClick={deleteSelectedPlans}
          disabled={selectedPlans.length === 0}
        >
          DELETE SELECTED
        </button>
      </div>

      <div className="plans-list">
        {filteredPlans.map(plan => (
          <div 
            key={plan._id}
            className={`plan-item ${expandedPlan?._id === plan._id ? 'expanded' : ''}`}
          >
            <div 
              className="plan-header"
              onClick={() => setExpandedPlan(expandedPlan?._id === plan._id ? null : plan)}
            >
              <input
                type="checkbox"
                checked={selectedPlans.includes(plan._id)}
                onChange={(e) => {
                  e.stopPropagation();
                  togglePlanSelection(plan._id);
                }}
              />
              <h3>{plan.name}</h3>
              <span className="toggle-icon">
                {expandedPlan?._id === plan._id ? '−' : '+'}
              </span>
            </div>

            {expandedPlan?._id === plan._id && (
              <div className="plan-details">
                <div className="savings-banner">
                  <div className="savings-item highlight">
                    <span className="savings-label">Total Cost:</span>
                    <span className="savings-value">Rs. {plan.data.totalCost}</span>
                  </div>
                </div>

                <div className="carousel-container">
                  

                  <div className="carousel-slides">
                    {plan.data.itinerary.map((stop, index) => (
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
                              <div
                                className="item-details"
                                onClick={() => toggleItemCutoff(stop.store, itemIndex)}
                                style={{
                                  textDecoration: cutoffItems[stop.store]?.[itemIndex] ? "line-through" : "none",
                                  cursor: "pointer",
                                }}
                              >
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

                </div>

                {plan.data.unavailableItems.length > 0 && (
                  <div className="unavailable-section">
                    <h3>⚠️ Unavailable Items:</h3>
                    <ul>
                      {plan.data.unavailableItems.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;


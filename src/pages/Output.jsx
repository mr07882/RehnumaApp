import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/Output.css';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const Output = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [selections, setSelections] = useState({});
  const [planData, setPlanData] = useState({
    itinerary: [],
    totalCost: 0,
    unavailableItems: []
  });

  useEffect(() => {
    if (state) {
      const validatedItinerary = state.itinerary?.map(stop => ({
        ...stop,
        items: stop.items?.map(item => ({
          ...item,
          options: item.options || [{
            itemName: item.itemName,
            price: item.price,
            supermarket: stop.store,
            transportCost: stop.transportCost,
            distance: stop.distance,
            address: stop.address
          }]
        })) || []
      })) || [];
      
      setPlanData({
        itinerary: validatedItinerary,
        totalCost: state.totalCost || 0,
        unavailableItems: state.unavailableItems || []
      });
    }
  }, [state]);

  const calculateTravelTime = (distance) => {
    const avgSpeed = 40;
    const timeHours = distance / avgSpeed;
    return `${Math.round(timeHours * 60)} min`;
  };

  const handleEditPlan = () => {
    const initialSelections = {};
    planData.itinerary.forEach((stop, stopIndex) => {
      stop.items.forEach((item, itemIndex) => {
        const itemId = `${stopIndex}-${itemIndex}`;
        const selectedOptionIndex = item.options.findIndex(opt => 
          opt.supermarket === stop.store && 
          opt.itemName === item.itemName
        );
        initialSelections[itemId] = Math.max(selectedOptionIndex, 0);
      });
    });
    setSelections(initialSelections);
    setIsEditing(true);
  };

  const handleRemoveItem = (stopIndex, itemIndex) => {
    const newItinerary = [...planData.itinerary];
    newItinerary[stopIndex].items.splice(itemIndex, 1);
    
    const filteredItinerary = newItinerary
      .map(stop => ({
        ...stop,
        items: stop.items.filter(item => item)
      }))
      .filter(stop => stop.items.length > 0);

    const totalTransportCost = filteredItinerary.reduce((acc, stop) => acc + stop.transportCost, 0);
    const totalItemsCost = filteredItinerary.reduce((acc, stop) => acc + stop.storeTotal, 0);
    const newTotalCost = Math.round(totalTransportCost + totalItemsCost);

    setPlanData(prev => ({
      ...prev,
      itinerary: filteredItinerary,
      totalCost: newTotalCost
    }));
  };

  const handleDoneEditing = () => {
    const allSelectedOptions = [];
    
    planData.itinerary.forEach((stop, stopIndex) => {
      stop.items.forEach((item, itemIndex) => {
        const itemId = `${stopIndex}-${itemIndex}`;
        const selectedIndex = selections[itemId] ?? 0;
        const selectedOption = item.options[selectedIndex];
        
        allSelectedOptions.push({
          originalSearch: item.originalSearch,
          originalOptions: item.options,
          ...selectedOption
        });
      });
    });

    const supermarketsMap = {};
    allSelectedOptions.forEach(({ 
      originalSearch,
      originalOptions,
      itemName, 
      price, 
      supermarket, 
      address,
      transportCost,
      distance 
    }) => {
      if (!supermarketsMap[supermarket]) {
        supermarketsMap[supermarket] = {
          store: supermarket,
          address: address,
          transportCost: transportCost,
          distance: distance,
          items: [],
          storeTotal: 0
        };
      }
      
      supermarketsMap[supermarket].items.push({
        itemName: itemName,
        originalSearch: originalSearch,
        price: price,
        options: originalOptions
      });
      
      supermarketsMap[supermarket].storeTotal += price;
    });

    const newItinerary = Object.values(supermarketsMap).map(stop => ({
      ...stop,
      travelTime: calculateTravelTime(stop.distance),
      items: stop.items.map(item => ({
        ...item,
        options: item.options
      }))
    }));

    const totalTransportCost = newItinerary.reduce((acc, stop) => acc + stop.transportCost, 0);
    const totalItemsCost = newItinerary.reduce((acc, stop) => acc + stop.storeTotal, 0);
    const newTotalCost = Math.round(totalTransportCost + totalItemsCost);

    setPlanData({
      itinerary: newItinerary,
      totalCost: newTotalCost,
      unavailableItems: planData.unavailableItems
    });

    setIsEditing(false);
  };

  const handleSavePlan = async () => {
    const planName = window.prompt('Enter a name for your plan:');
    if (!planName?.trim()) return;

    try {
      const token = localStorage.getItem('token');
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
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.message) {
        alert('Plan saved successfully!');
        navigate('/History');
      }
    } catch (error) {
      console.error('Save plan error:', error);
      alert(`Failed to save plan: ${error.response?.data?.error || error.message}`);
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
            {isEditing ? (
              <div className="edit-itinerary-list">
                {planData.itinerary.map((stop, stopIndex) => (
                  <div key={stop.store} className="itinerary-stop">
                    <div className="stop-header">
                      <h3 className="store-name">{stop.store}</h3>
                      <p className="store-address">{stop.address}</p>
                      <div className="transport-details">
                        <span>Distance: {stop.distance.toFixed(1)} km</span>
                        <span>Transport Cost: Rs. {stop.transportCost}</span>
                      </div>
                    </div>
                    <ul className="item-list">
                      {stop.items.map((item, itemIndex) => {
                        const itemId = `${stopIndex}-${itemIndex}`;
                        const selectedIndex = selections[itemId] ?? 0;
                        const currentOption = item.options[selectedIndex];
                        
                        return (
                          <li key={`${stop.store}-${itemIndex}`} className="item">
                            <div className="item-edit-container">
                              <select
                                value={selectedIndex}
                                onChange={(e) => setSelections(prev => ({
                                  ...prev,
                                  [itemId]: parseInt(e.target.value)
                                }))}
                                className="item-dropdown"
                              >
                                {item.options.map((option, idx) => (
                                  <option key={idx} value={idx}>
                                    {option.itemName} ({option.supermarket}) - Rs. {option.price}
                                  </option>
                                ))}
                              </select>
                              <button 
                                className="remove-item-button"
                                onClick={() => handleRemoveItem(stopIndex, itemIndex)}
                              >
                                <FaTimes />
                              </button>
                              <div className="price-comparison">
                                {currentOption.price !== item.price && (
                                  <span className={`price-change ${
                                    currentOption.price < item.price ? 'decrease' : 'increase'
                                  }`}>
                                    {currentOption.price < item.price ? '↓' : '↑'}
                                    Rs. {Math.abs(currentOption.price - item.price)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="original-search">
                              Originally searched for: {item.originalSearch}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="carousel-container">
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
                <div className="carousel-dots">
                  {planData.itinerary.map((_, index) => (
                    <span
                      key={index}
                      className={`dot ${index === currentSlide ? 'active' : ''}`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              </div>
            )}
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
          {isEditing ? (
            <button className="save-button" onClick={handleDoneEditing}>
              DONE EDITING
            </button>
          ) : (
            <button className="edit-button" onClick={handleEditPlan}>
              EDIT PLAN
            </button>
          )}
          <button className="save-button" onClick={handleSavePlan}>
            SAVE THIS PLAN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Output;
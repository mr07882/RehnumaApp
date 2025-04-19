import React, { useState } from 'react';
import '../styles/Output.css';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Output = () => {
  const navigate = useNavigate();
  const [savingAmount] = useState(1250);
  const [totalCost] = useState(3750);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const itinerary = [
    {
      store: 'Naheed Super Market',
      address: '123 Main St, 5km away',
      items: [
        'XYZ Ketchup - Rs. 250',
        'AB Shampoo - Rs. 450',
        'Quinoa 1kg - Rs. 600'
      ],
      storeTotal: 1300,
      travelTime: '15 min'
    },
    {
      store: 'Imtiaz Super Market',
      address: '456 Market Ave, 3km away',
      items: [
        'PQ Lotion - Rs. 350',
        'HX Cooking Oil - Rs. 800',
        'Hi Ariel Powder - Rs. 550'
      ],
      storeTotal: 1700,
      travelTime: '10 min'
    },
    {
      store: 'SPAR Super Market',
      address: '789 Mall Rd, 7km away',
      items: [
        'X Microwave - Rs. 750'
      ],
      storeTotal: 750,
      travelTime: '20 min'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === itinerary.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? itinerary.length - 1 : prev - 1));
  };

  const handleSavePlan = () => {
    alert('Your shopping plan has been saved to your history!');
    navigate('/History');
  };

  return (
    <div className="output-container">
      <Header />
      <div className="output-content">
        <h1 className="output-heading">YOUR OPTIMIZED SHOPPING PLAN</h1>
        
        <div className="savings-banner">
          <div className="savings-item">
            <span className="savings-label">Total Estimated Cost:</span>
            <span className="savings-value">Rs. {totalCost}</span>
          </div>
          <div className="savings-item highlight">
            <span className="savings-label">You Save:</span>
            <span className="savings-value">Rs. {savingAmount}</span>
          </div>
        </div>

        <div className="carousel-container">
          <button className="carousel-arrow left" onClick={prevSlide}>
            <FaChevronLeft />
          </button>
          
          <div className="carousel-slides">
            {itinerary.map((stop, index) => (
              <div 
                key={index}
                className={`itinerary-stop ${index === currentSlide ? 'active' : ''}`}
              >
                <div className="stop-header">
                  <div className="stop-number">{index + 1}</div>
                  <div className="stop-info">
                    <h3 className="store-name">{stop.store}</h3>
                    <p className="store-address">{stop.address}</p>
                    <p className="travel-time">⏱️ {stop.travelTime}</p>
                  </div>
                  <div className="stop-total">
                    <span className="total-label">Store Total:</span>
                    <span className="total-amount">Rs. {stop.storeTotal}</span>
                  </div>
                </div>
                
                <ul className="item-list">
                  {stop.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="item">
                      <span className="item-bullet">➔</span>
                      {item}
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
          {itinerary.map((_, index) => (
            <span 
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

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

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/History.css';
import Header from '../components/Header';

const History = () => {
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedPlans, setSelectedPlans] = useState([]); // State for selected plans
  const [shoppingPlans, setShoppingPlans] = useState([ // Convert to state
    {
      id: 1,
      name: "Weekly Grocery Plan",
      details: [
        {
          store: "Naheed Supermarket",
          items: ["Soap", "XYZ Microwave", "Quinoa", "Olive Oil", "Toothpaste"]
        },
        {
          store: "Imtiaz",
          items: ["Daal Grinder", "Washing Powder", "Rice 5kg", "Disinfectant Spray"]
        },
        {
          store: "Spar",
          items: ["Chocolates", "Ice Cream", "Frozen Pizza", "Soft Drinks"]
        }
      ]
    },
    {
      id: 2,
      name: "Emergency Purchase",
      details: [
        {
          store: "Hyperstar",
          items: ["Laptop Bag", "USB Cable", "Notebooks", "Pens"]
        }
      ]
    },
    {
      id: 3,
      name: "Purchase 1",
      details: [
        {
          store: "Hyperstar",
          items: ["Laptop Bag", "USB Cable", "Notebooks", "Pens"]
        }
      ]
    },
    {
      id: 4,
      name: "Purchase 2",
      details: [
        {
          store: "Hyperstar",
          items: ["Laptop Bag", "USB Cable", "Notebooks", "Pens"]
        }
      ]
    },
    {
      id: 5,
      name: "Purchase 3",
      details: [
        {
          store: "Hyperstar",
          items: ["Laptop Bag", "USB Cable", "Notebooks", "Pens"]
        }
      ]
    },
    {
      id: 6,
      name: "Purchase 4",
      details: [
        {
          store: "Hyperstar",
          items: ["Laptop Bag", "USB Cable", "Notebooks", "Pens"]
        }
      ]
    },
    {
      id: 7,
      name: "Purchase 6",
      details: [
        {
          store: "Hyperstar",
          items: ["Laptop Bag", "USB Cable", "Notebooks", "Pens"]
        }
      ]
    }
  ]); // End of shoppingPlans state
  const navigate = useNavigate(); // Initialize navigate function

  // Filter plans based on search query
  const filteredPlans = shoppingPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to toggle plan selection
  const togglePlanSelection = (planId) => {
    setSelectedPlans((prevSelected) =>
      prevSelected.includes(planId)
        ? prevSelected.filter((id) => id !== planId)
        : [...prevSelected, planId]
    );
  };

  // Function to delete selected plans
  const deleteSelectedPlans = () => {
    setShoppingPlans((prevPlans) =>
      prevPlans.filter((plan) => !selectedPlans.includes(plan.id))
    );
    setSelectedPlans([]); // Clear selection
  };

  return (
    <div className="history-container">
      <Header />
      <h1 className="history-heading">YOUR PAST SHOPPING PLANS</h1>
      <input 
        type="text" 
        placeholder="Search plans..." 
        className="search-bar" 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
      />
      <button 
        className="generate-plan-button" 
        onClick={deleteSelectedPlans} // Update button to delete selected plans
      >
        DELETE SELECTED PLANS
      </button>
      <img 
      src="/Im1_History.png" 
      alt="Decorative history" 
      className="history-background-image"
      />
      <div className="plans-list">
        {filteredPlans.map((plan) => (
          <div 
            key={plan.id}
            className={`plan-item ${expandedPlan === plan.id ? 'expanded' : ''}`}
          >
            <div 
              className="plan-header"
              onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
            >
              <input 
                type="checkbox" 
                checked={selectedPlans.includes(plan.id)} 
                onChange={() => togglePlanSelection(plan.id)} 
              />
              <h3>{plan.name}</h3>
              <span className="toggle-icon">
                {expandedPlan === plan.id ? '−' : '+'}
              </span>
            </div>
            
            {expandedPlan === plan.id && (
              <div className="plan-details">
                {plan.details.map((store, index) => (
                  <div key={index} className="store-section">
                    <h4 className="store-name">
                      {index === 0 ? 'First Go To: ' : 
                       index === plan.details.length - 1 ? 'Finally Go To: ' : 
                       'Then Go To: '}
                      {store.store}
                    </h4>
                    <ul className="item-list">
                      {store.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="item">
                          ➔ {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
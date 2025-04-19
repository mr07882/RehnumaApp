// import React from 'react';
// import '../styles/Output.css';
// import Header from '../components/Header'; // Import Header
// import { Link } from 'react-router-dom';

// const Output = () => {
//   return (
//     <div>
//       <Header /> {/* Add Header */}
//       <div style={{ paddingTop: '100px' }}> {/* Add padding to prevent overlap */}
//         <h1>THIS IS THE OPTIMISED OUTPUT PAGE</h1>
//       </div>
//     </div>
//   );
// };

// export default Output;

import React from 'react';
import '../styles/Output.css';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import googleMapsImage from './googlemaps.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

const Output = () => {
  return (
    <div>
      <Header />
      <div style={{ 
        paddingTop: '100px', 
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '100px 20px 20px'
      }}>
        {/* Map Image */}
        <img 
          src={googleMapsImage} 
          alt="Optimized Route" 
          style={{ 
            width: '100%', 
            maxWidth: '600px', 
            marginBottom: '30px', 
            borderRadius: '10px' 
          }}
        />
        
        {/* Title
        <h2 style={{ textAlign: 'left', margin: '0 auto 20px', maxWidth: '600px' }}>New Plan</h2> */}
        
        {/* Store List */}
        <div style={{
          textAlign: 'left',
          margin: '0 auto',
          maxWidth: '600px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          border: '2px solid #6a3d94',
          borderRadius: '8px'
        }}>
          {/* Store 1 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                fontWeight: 'bold',
                marginRight: '15px',
                width: '50px',
                textAlign: 'center'
              }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: '#4a2b7a', 
                  color: 'white', 
                  lineHeight: '40px', 
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '0 auto'
                }}>
                  1
                </div>
                <div style={{ marginTop: '16px' }}>
                  <FontAwesomeIcon icon={faArrowDown} size="2x" style={{ color: '#4a2b7a' }} />
                </div>
              </div>
              <div>
                <strong>Imtiaz Store</strong>
                <ul style={{ 
                  listStyleType: 'none',
                  paddingLeft: '0',
                  marginTop: '5px',
                  marginBottom: '15px'
                }}>
                  <li>- Item 1</li>
                  <li>- Item 2</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Store 2 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                fontWeight: 'bold',
                marginRight: '15px',
                width: '50px',
                textAlign: 'center'
              }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: '#4a2b7a', 
                  color: 'white', 
                  lineHeight: '40px', 
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '0 auto'
                }}>
                  2
                </div>
                <div style={{ marginTop: '17px' }}>
                  <FontAwesomeIcon icon={faArrowDown} size="2x" style={{ color: '#4a2b7a' }} />
                </div>
              </div>
              <div>
                <strong>Spar Store</strong>
                <ul style={{ 
                  listStyleType: 'none',
                  paddingLeft: '0',
                  marginTop: '5px',
                  marginBottom: '15px'
                }}>
                  <li>- Item 3</li>
                  <li>- Item 4</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Store 3 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                fontWeight: 'bold',
                marginRight: '15px',
                width: '50px',
                textAlign: 'center'
              }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: '#4a2b7a', 
                  color: 'white', 
                  lineHeight: '40px', 
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '0 auto'
                }}>
                  3
                </div>
                <div style={{ marginTop: '10px' }}>
                  <FontAwesomeIcon icon={faArrowDown} size="2x" style={{ color: '#ffff' }} />
                </div>
              </div>
              <div>
                <strong>Naheed Store</strong>
                <ul style={{ 
                  listStyleType: 'none',
                  paddingLeft: '0',
                  marginTop: '5px',
                  marginBottom: '15px'
                }}>
                  <li>- Item 5</li>
                  <li>- Item 6</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Save Plan Button */}
        <Link to="/save" style={{ textDecoration: 'none' }}>
          <button 
            style={{
              backgroundColor: '#4a2b7a', 
              color: 'white', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '30px'
            }}>
            Save Plan
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Output;

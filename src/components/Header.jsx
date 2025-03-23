import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaShoppingCart,
  FaCreditCard,
  FaEnvelope,
  FaSearch
} from 'react-icons/fa';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header" style={{ width: '99.2%' }}>
      <div className="header-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-2 text-center text-lg-left">
              <Link to="/" className="site-logo">
                <img src="Logos/logo.png" alt="Fashion Hub Logo" style={{ width: '200px', height: 'auto' }} />
              </Link>
            </div>
            <div className="col-xl-6 col-lg-5">
              <form className="header-search-form">
                <input type="text" placeholder="Search on fashion hub ...." />
                <button type="submit">
                  <FaSearch className="search-icon" />
                </button>
              </form>
            </div>
            <div className="col-xl-4 col-lg-5">
              <div className="user-panel d-flex align-items-center justify-content-end">
                <div className="up-item me-3">
                  <Link to="/cart" className="nav-link">
                    <FaShoppingCart className="nav-icon" />
                    <span>Cart</span>
                  </Link>
                </div>
                <div className="up-item me-3">
                  <Link to="/checkout" className="nav-link">
                    <FaCreditCard className="nav-icon" />
                    <span>Checkout</span>
                  </Link>
                </div>
                <div className="up-item">
                  <Link to="/contact" className="nav-link">
                    <FaEnvelope className="nav-icon" />
                    <span>Contact</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="main-navbar">
        <div className="container">
          <ul className="main-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/category">Women</Link>
            <ul className="sub-menu">
                <li><Link to="/category/women/Tops">Tops</Link></li>
                <li><Link to="/category/women/Bottoms">Bottoms</Link></li>
                <li><Link to="/category/women/Undergarments">Undergarments</Link></li>
                <li><Link to="/category/women/Partywear">Party Wear</Link></li>
                <li><Link to="/category/women/Oversized">Oversized</Link></li>
            </ul>
            </li>
            <li><Link to="/category">Men</Link>
            <ul className="sub-menu">
                <li><Link to="/category/men/T-Shirts">T-Shirts</Link></li>
                <li><Link to="/category/men/FormalShirt">Formal Shirts</Link></li>
                <li><Link to="/category/men/FormalBottoms">Formal Bottoms</Link></li>
                <li><Link to="/category/men/Joggers">Joggers</Link></li>
                <li><Link to="/category/men/oversized">Oversized</Link></li>
            </ul>
            </li>
            <li>
                <Link to="/category">Jewelry <span className="new">New</span></Link>
                <ul className="sub-menu">
                <li><Link to="/category/HandWear">HandWear</Link></li>
                <li><Link to="/category/NeckWear">NeckWear</Link></li>
                <li><Link to="/category/BottomWear">BottomWear</Link></li>
                <li><Link to="/category/HeadWear">HeadWear</Link></li>
                <li><Link to="/category/EyeWear">EyeWear</Link></li>
              </ul>
            
            </li>
            <li>
              <Link to="/category/shoes">Shoes</Link>
              <ul className="sub-menu">
                <li><Link to="/category/sneakers">Sneakers</Link></li>
                <li><Link to="/category/sandals">Sandals</Link></li>
                <li><Link to="/category/formal-shoes">Formal Shoes</Link></li>
                <li><Link to="/category/boots">Boots</Link></li>
                <li><Link to="/category/flip-flops">Flip Flops</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
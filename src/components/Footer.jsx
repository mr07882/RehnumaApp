import React from 'react';
import {
  FaInstagram, FaGooglePlusG, FaPinterest,
  FaFacebookF, FaTwitter, FaYoutube
} from 'react-icons/fa';



import '../styles/Footer.css';



const Footer = () => {
  return (
    <section className="footer-section">
      {/* Full-width background */}
      <div className="footer-top-bg">
        <div className="container">
          <div className="footer-logo text-center">
            <a href="/"><img src="Logos/logo-light.png" alt="Logo" /></a>
          </div>

          <div className="row">
            {/* About Us */}
            <div className="col-lg-3 col-sm-6">
              <div className="footer-widget about-widget">
                <h2>About Us</h2>
                <p>
                  We bring you stylish, high-quality apparel designed for comfort and performance.
                </p>
                <img src="Logos/cards.png" alt="Payment Methods" />
              </div>
            </div>

            {/* Links */}
            <div className="col-lg-3 col-sm-6">
              <div className="footer-widget about-widget">
                <h2>Links</h2>
                <ul>
                  <li><a href="/">About Us</a></li>
                  <li><a href="/">Track Orders</a></li>
                  <li><a href="/">Returns</a></li>
                  <li><a href="/">Jobs</a></li>
                  <li><a href="/">Shipping</a></li>
                  <li><a href="/">Blog</a></li>
                </ul>
                <ul>
                  <li><a href="/">Partners</a></li>
                  <li><a href="/">Bloggers</a></li>
                  <li><a href="/">Support</a></li>
                  <li><a href="/">Terms of Use</a></li>
                  <li><a href="/">Press</a></li>
                </ul>
              </div>
            </div>

            {/* Blogs */}
            <div className="col-lg-3 col-sm-6">
              <div className="footer-widget about-widget">
                <h2>Blogs</h2>
                <div className="fw-latest-post-widget">
                  <div className="lp-item">
                    <div className="lp-thumb"><img src="Thumbnails/1.jpeg" alt="Blog 1" /></div>
                    <div className="lp-content">
                      <h6>What shoes to wear</h6>
                      <span>Oct 21, 2018</span>
                      <a href="#" className="readmore">Read More</a>
                    </div>
                  </div>
                  <div className="lp-item">
                    <div className="lp-thumb"><img src="Thumbnails/2.png" alt="Blog 2" /></div>
                    <div className="lp-content">
                      <h6>Trends this year</h6>
                      <span>Oct 21, 2018</span>
                      <a href="#" className="readmore">Read More</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Us */}
            <div className="col-lg-3 col-sm-6">
              <div className="footer-widget contact-widget">
                <h2>Contact Us</h2>
                <div className="con-info"><span>C.</span><p>Fashion Hub</p></div>
                <div className="con-info"><span>B.</span><p>DreamLand, Karachi</p></div>
                <div className="con-info"><span>T.</span><p>+92 300 3333333</p></div>
                <div className="con-info"><span>E.</span><p>fashion-hub@gmail.com</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social links full-width */}
      <div className="social-links-warp-bg">
        <div className="container">
          <div className="social-links">
            <a href="#" className="instagram"><FaInstagram /> <span>Instagram</span></a>
            <a href="#" className="google-plus"><FaGooglePlusG /> <span>Google+</span></a>
            <a href="#" className="pinterest"><FaPinterest /> <span>Pinterest</span></a>
            <a href="#" className="facebook"><FaFacebookF /> <span>Facebook</span></a>
            <a href="#" className="twitter"><FaTwitter /> <span>Twitter</span></a>
            <a href="#" className="youtube"><FaYoutube /> <span>YouTube</span></a>
          </div>
          <p className="footer-copy text-center">
            &copy; {new Date().getFullYear()} | All rights reserved
          </p>
        </div>
      </div>
    </section>
  );
};

export default Footer;

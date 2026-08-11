import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="modern-footer mt-5">
      <Container>
        <Row className="g-4 mb-4">
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center gap-2 mb-3">
              {/* Logo SVG */}
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="footerOrchidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>
                <path d="M16 3C16 3 9.5 10 9.5 16C9.5 19.58 12.42 22.5 16 22.5C19.58 22.5 22.5 19.58 22.5 16C22.5 10 16 3 16 3Z" fill="url(#footerOrchidGrad)" />
                <path d="M16 7.5C16 7.5 12 12.5 12 16.5C12 18.7 13.8 20.5 16 20.5C18.2 20.5 20 18.7 20 16.5C20 12.5 16 7.5 16 7.5Z" fill="#ffffff" opacity="0.4" />
                <path d="M8 14C5 16 4.5 20 7 23C9.5 26 14 24.5 16 22C13 22 10 19 8 14Z" fill="url(#footerOrchidGrad)" opacity="0.9" />
                <path d="M24 14C27 16 27.5 20 25 23C22.5 26 17 24.5 16 22C19 22 22 19 24 14Z" fill="url(#footerOrchidGrad)" opacity="0.9" />
                <circle cx="16" cy="17.5" r="2" fill="#fef08a" />
              </svg>
              <h4 className="fw-bolder mb-0 text-premium-color" style={{ letterSpacing: '-0.5px' }}>Orchid Haven</h4>
            </div>
            <p className="text-muted small mb-4 pe-lg-4 lh-lg">
              Discover the world's most exquisite and rare orchids. Our digital archive brings botanical beauty to your fingertips with detailed records, stunning visuals, and an interactive community.
            </p>
            <div className="d-flex gap-2 social-links">
              <a href="#" className="social-icon" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </Col>

          <Col lg={2} md={3} sm={6}>
            <h6 className="fw-bold mb-3 footer-heading">Explore</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="/">Home Collection</Link></li>
              <li><Link to="/natural">Natural Orchids</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </Col>

          <Col lg={2} md={3} sm={6}>
            <h6 className="fw-bold mb-3 footer-heading">Support</h6>
            <ul className="list-unstyled footer-links">
              <li><a href="#">FAQ & Guides</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Report an Issue</a></li>
            </ul>
          </Col>

          <Col lg={4} md={12}>
            <h6 className="fw-bold mb-3 footer-heading">Stay Updated</h6>
            <p className="text-muted small mb-3">Subscribe to our newsletter for the latest additions and orchid care tips.</p>
            <div className="newsletter-input-group d-flex">
              <input type="email" className="form-control rounded-start-pill border-end-0 shadow-sm px-4" placeholder="Enter your email" style={{ fontSize: '0.9rem' }} />
              <button className="btn btn-premium-action rounded-end-pill px-4 shadow-sm" style={{ minWidth: '110px' }}>Subscribe</button>
            </div>
          </Col>
        </Row>

        <div className="footer-bottom pt-4 pb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <p className="mb-0 text-muted small">© {new Date().getFullYear()} Orchid Database. All rights reserved.</p>
            <p className="mb-0 text-muted small mt-2 mt-md-0 d-flex align-items-center gap-1">
              Designed with <svg width="14" height="14" fill="#ef4444" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg> for Lab FER
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

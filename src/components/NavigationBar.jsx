import React from 'react';
import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NavigationBar = ({ isLoggedIn, setIsLoggedIn, userProfile, setUserProfile, darkMode, toggleTheme }) => {
  const navigate = useNavigate();
  // Hàm xử lý Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserProfile(null);
    navigate('/login');
  };

  const isAdmin = !!(userProfile?.isAdmin || userProfile?.admin);

  return (
    <Navbar expand="lg" sticky="top" className="navbar-custom">
      <Container className="d-flex align-items-center">
        {/* Sleek brand logo + name */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="brand-logo-icon">
            <defs>
              <linearGradient id="navOrchidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
            <path d="M16 3C16 3 9.5 10 9.5 16C9.5 19.58 12.42 22.5 16 22.5C19.58 22.5 22.5 19.58 22.5 16C22.5 10 16 3 16 3Z" fill="url(#navOrchidGrad)" />
            <path d="M16 7.5C16 7.5 12 12.5 12 16.5C12 18.7 13.8 20.5 16 20.5C18.2 20.5 20 18.7 20 16.5C20 12.5 16 7.5 16 7.5Z" fill="#ffffff" opacity="0.4" />
            <path d="M8 14C5 16 4.5 20 7 23C9.5 26 14 24.5 16 22C13 22 10 19 8 14Z" fill="url(#navOrchidGrad)" opacity="0.9" />
            <path d="M24 14C27 16 27.5 20 25 23C22.5 26 17 24.5 16 22C19 22 22 19 24 14Z" fill="url(#navOrchidGrad)" opacity="0.9" />
            <circle cx="16" cy="17.5" r="2" fill="#fef08a" />
          </svg>
          <span className="fw-bolder" style={{ letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Orchid Haven</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto align-items-center mt-2 mt-lg-0">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            {isLoggedIn && isAdmin && (
              <Nav.Link as={NavLink} to="/management">
                Management
              </Nav.Link>
            )}
            <Nav.Link as={NavLink} to="/natural">
              Natural
            </Nav.Link>
            <Nav.Link as={NavLink} to="/favorites">
              Favorites
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about">
              About
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact">
              Contact
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center gap-2 ms-lg-auto mt-3 mt-lg-0">
            {/* Elegant Theme Toggle Icon Button */}
            <button
              type="button"
              className="theme-toggle-btn d-flex align-items-center justify-content-center"
              onClick={toggleTheme}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                </svg>
              ) : (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998z" />
                </svg>
              )}
            </button>

            {/* User Profile */}
            {isLoggedIn && userProfile ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" id="dropdown-profile" className="d-flex align-items-center gap-2 rounded-pill px-2 py-1 shadow-sm border-0" style={{ background: darkMode ? '#374151' : '#ffffff' }}>
                  <div className="avatar text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', background: 'var(--bs-primary)' }}>
                    {userProfile.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="d-none d-sm-flex flex-column align-items-start" style={{ lineHeight: '1.2' }}>
                    <span className="fw-semibold text-truncate" style={{ maxWidth: '100px', color: darkMode ? '#f9fafb' : '#374151', fontSize: '0.9rem' }}>{userProfile.name}</span>
                    <span style={{ fontSize: '0.7rem', color: userProfile.isAdmin ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                      {userProfile.isAdmin ? 'ADMIN' : 'MEMBER'}
                    </span>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className={darkMode ? 'dropdown-menu-dark shadow border-0' : 'shadow border-0'}>
                  <Dropdown.Item as={Link} to="/profile" className="d-flex align-items-center gap-2">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                    My Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger d-flex align-items-center gap-2">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button as={Link} to="/login" variant="light" className="google-login-btn px-3 py-1.5 d-flex align-items-center gap-2">
                <span>Sign in</span>
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;



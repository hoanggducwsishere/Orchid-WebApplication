import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrchids } from '../redux/orchidSlice';
import { Row, Col, Card, Alert, Badge, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { resolveOrchidImage } from '../utils/imageHelper';
import StarRating from '../components/StarRating';

const Home = () => {
  const dispatch = useDispatch();
  const { data: orchids = [], status } = useSelector((state) => state.orchids);
  const orchidList = Array.isArray(orchids) ? orchids : [];
  
  const specialCount = orchidList.filter((orchid) => orchid.isSpecial).length;
  const naturalCount = orchidList.filter((orchid) => orchid.isNatural).length;

  const [favorites, setFavorites] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Extract unique categories for the filter dropdown
  const categories = [...new Set(orchidList.map(o => o.category).filter(Boolean))];

  // Filter the orchids based on search and category
  const filteredOrchids = orchidList.filter(orchid => {
    const matchSearch = orchid.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === '' || orchid.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  useEffect(() => {
    dispatch(fetchOrchids());
  }, [dispatch]);

  // Load favorites from localStorage
  useEffect(() => {
    const favMap = {};
    orchidList.forEach((o) => {
      favMap[o.id] = localStorage.getItem(`orchid_fav_${o.id}`) === 'true';
    });
    setFavorites(favMap);
  }, [orchids]);

  const handleToggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    const current = !!favorites[id];
    const newVal = !current;
    localStorage.setItem(`orchid_fav_${id}`, String(newVal));
    setFavorites((prev) => ({ ...prev, [id]: newVal }));
  };

  if (status === 'loading') {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-2">Loading Orchid collection...</p>
      </div>
    );
  }

  return (
    <div className="pb-4">
      {/* Hero Banner Section */}
      <div className="home-hero">
        <div className="home-hero-glow"></div>
        <div className="position-relative z-1 text-start">
          <h1 className="home-hero-title">Discover the World of Rare & Exotic Orchids</h1>
          <p className="home-hero-subtitle mb-0">
            Welcome to the Orchid Collection. Explore our preserved natural database of orchid species, hybrid creations, and award-winning collections.
          </p>
        </div>
      </div>

      {/* Stats Counters (Glassmorphic) */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <div className="stat-glass-card p-3 h-100 d-flex align-items-center gap-3">
            <div className="stat-card-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M12 3l4 4M12 3L8 7M12 21l4-4M12 21l-4-4"/>
              </svg>
            </div>
            <div>
              <div className="stat-card-label">Total Species</div>
              <div className="stat-card-value">{orchidList.length}</div>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div className="stat-glass-card p-3 h-100 d-flex align-items-center gap-3">
            <div className="stat-card-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.176-.412.764-.412.94 0l1.83 4.288 4.606.398c.453.039.635.602.298.924l-3.535 3.376.993 4.542c.1.455-.407.825-.793.585L12 16.035l-3.927 2.577c-.386.24-.892-.13-.793-.585l.993-4.542-3.535-3.376c-.337-.322-.155-.885.298-.924l4.606-.398 1.83-4.288z"/>
              </svg>
            </div>
            <div>
              <div className="stat-card-label">Special Rare</div>
              <div className="stat-card-value">{specialCount}</div>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div className="stat-glass-card p-3 h-100 d-flex align-items-center gap-3">
            <div className="stat-card-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15z"/>
              </svg>
            </div>
            <div>
              <div className="stat-card-label">Wild Natural</div>
              <div className="stat-card-value">{naturalCount}</div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Search and Filter Section */}
      <div className="mb-4 d-flex flex-column flex-md-row gap-3">
        <InputGroup className="shadow-sm" style={{ flex: 1, borderRadius: '0.75rem', overflow: 'hidden' }}>
          <InputGroup.Text className="bg-white border-0 text-muted ps-3">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </InputGroup.Text>
          <Form.Control 
            className="border-0 bg-white py-2 shadow-none"
            placeholder="Search by orchid name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Form.Select 
          className="shadow-sm border-0 py-2" 
          style={{ width: '100%', maxWidth: '250px', borderRadius: '0.75rem' }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </Form.Select>
      </div>

      {/* Grid of Orchid Cards */}
      {!filteredOrchids.length ? (
        <Alert variant="info" className="rounded-3 shadow-sm">No orchids match your search or filter.</Alert>
      ) : (
        <Row xs={1} sm={2} lg={4} className="g-4">
          {filteredOrchids.map((orchid) => (
            <Col key={orchid.id}>
              <Card className="orchid-card-premium border-0">
                {/* Image Container with floating buttons */}
                <div className="card-img-container">
                  <img src={resolveOrchidImage(orchid.img)} alt={orchid.name} />
                  
                  {/* Floating favorite button */}
                  <button
                    type="button"
                    className={`favorite-btn-floating ${favorites[orchid.id] ? 'is-favorite' : ''}`}
                    onClick={(e) => handleToggleFavorite(orchid.id, e)}
                    title={favorites[orchid.id] ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>

                  {/* Badge Overlays */}
                  <div className="position-absolute bottom-0 start-0 m-2 d-flex gap-1.5 flex-wrap">
                    {orchid.isSpecial && (
                      <Badge bg="warning" text="dark" className="px-2 py-1.5 fs-8 shadow-sm rounded-2">
                        Special
                      </Badge>
                    )}
                    {orchid.isNatural && (
                      <Badge bg="success" className="px-2 py-1.5 fs-8 shadow-sm rounded-2 text-white border-0" style={{ background: '#10b981' }}>
                        Natural
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Card Body content */}
                <div className="card-body-content text-start">
                  <div className="mb-2">
                    <h3 className="card-title-text text-truncate">{orchid.name}</h3>
                  </div>

                  <div className="card-meta-row mt-auto">
                    <StarRating rating={orchid.rating} size={14} />
                  </div>

                  <Link to={`/detail/${orchid.id}`} className="btn btn-premium-action btn-sm w-100 py-2">
                    View Details
                  </Link>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Home;
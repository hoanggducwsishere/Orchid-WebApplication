import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Badge, Card, Form, Button, Alert } from 'react-bootstrap';
import { fetchOrchids, editOrchid } from '../redux/orchidSlice';
import { resolveOrchidImage } from '../utils/imageHelper';
import StarRating from '../components/StarRating';
import ConfirmModal from '../components/ConfirmModal';

const Detail = ({ isLoggedIn, userProfile }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { data: orchids = [], status } = useSelector(state => state.orchids);
  const orchid = orchids.find(o => String(o.id) === String(id));

  const [isFavorite, setIsFavorite] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  // Feedback state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [isEditingFeedback, setIsEditingFeedback] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingFeedback, setIsDeletingFeedback] = useState(false);

  // Fetch orchids if not loaded (e.g. on direct page refresh)
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOrchids());
    }
  }, [status, dispatch]);

  // Load favorite status from localStorage
  useEffect(() => {
    if (id) {
      const fav = localStorage.getItem(`orchid_fav_${id}`) === 'true';
      setIsFavorite(fav);
    }
  }, [id]);

  if (status === 'idle' || status === 'loading') {
    return (
      <Container className="mt-5 text-center py-5">
        <div className="py-5 bg-light rounded-4 shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h4 className="text-muted mb-3">Loading orchid details...</h4>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (status === 'succeeded' && !orchid) {
    return (
      <Container className="mt-5 text-center py-5">
        <div className="py-5 bg-light rounded-4 shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 className="text-danger mb-3">Orchid not found!</h2>
          <p className="text-muted mb-4">The orchid you are looking for might have been deleted or does not exist.</p>
          <Link to="/" className="btn btn-premium-action px-4 py-2">Back to Home</Link>
        </div>
      </Container>
    );
  }

  if (status === 'failed') {
    return (
      <Container className="mt-5 text-center py-5">
        <div className="py-5 bg-light rounded-4 shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 className="text-danger mb-3">Error loading orchid</h2>
          <p className="text-muted mb-4">Failed to fetch the orchid data from the server.</p>
          <Link to="/" className="btn btn-premium-action px-4 py-2">Back to Home</Link>
        </div>
      </Container>
    );
  }

  // Toggle favorite status
  const handleToggleFavorite = () => {
    const newVal = !isFavorite;
    setIsFavorite(newVal);
    localStorage.setItem(`orchid_fav_${id}`, String(newVal));
  };

  // Convert watch/share youtube URLs to embed format for iframe
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('/embed/')) return url;

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }

    const lastSlash = url.lastIndexOf('/');
    const possibleId = url.substring(lastSlash + 1);
    if (possibleId.length === 11) {
      return `https://www.youtube.com/embed/${possibleId}`;
    }

    return url;
  };

  const handleEditClick = (feedback) => {
    setRating(feedback.rating);
    setComment(feedback.comment);
    setIsAnonymous(feedback.isAnonymous || false);
    setIsEditingFeedback(true);
    setFeedbackMsg(null);
  };

  const doDeleteFeedback = async () => {
    const updatedFeedbackList = orchid.feedback.filter(f => f.author !== userProfile.email);
    const totalRating = updatedFeedbackList.reduce((sum, f) => sum + f.rating, 0);
    const newAvgRating = updatedFeedbackList.length > 0 ? (totalRating / updatedFeedbackList.length).toFixed(1) : 0;

    const updatedOrchid = {
      ...orchid,
      feedback: updatedFeedbackList,
      rating: parseFloat(newAvgRating)
    };

    setIsDeletingFeedback(true);
    try {
      await dispatch(editOrchid({ id: orchid.id, data: updatedOrchid })).unwrap();
      setFeedbackMsg({ type: 'success', text: 'Review deleted successfully.' });
      setIsEditingFeedback(false);
      setComment('');
      setRating(5);
      setShowDeleteConfirm(false);
    } catch {
      setFeedbackMsg({ type: 'danger', text: 'Failed to delete review.' });
    } finally {
      setIsDeletingFeedback(false);
    }
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setFeedbackMsg({ type: 'danger', text: 'Please enter a comment.' });
      return;
    }

    const newFeedback = {
      rating: Number(rating),
      comment: comment.trim(),
      author: userProfile.email,
      isAnonymous: isAnonymous,
      date: new Date().toISOString()
    };

    let updatedFeedbackList;
    if (isEditingFeedback) {
      updatedFeedbackList = orchid.feedback.map(f => 
        f.author === userProfile.email ? newFeedback : f
      );
    } else {
      updatedFeedbackList = orchid.feedback ? [...orchid.feedback, newFeedback] : [newFeedback];
    }

    // Calculate new average rating
    const totalRating = updatedFeedbackList.reduce((sum, f) => sum + f.rating, 0);
    const newAvgRating = (totalRating / updatedFeedbackList.length).toFixed(1);

    const updatedOrchid = {
      ...orchid,
      feedback: updatedFeedbackList,
      rating: parseFloat(newAvgRating)
    };

    dispatch(editOrchid({ id: orchid.id, data: updatedOrchid }))
      .unwrap()
      .then(() => {
        setFeedbackMsg({ type: 'success', text: isEditingFeedback ? 'Review updated successfully!' : 'Thank you for your review!' });
        if (!isEditingFeedback) {
          setComment('');
          setRating(5);
          setIsAnonymous(false);
        }
        setIsEditingFeedback(false);
      })
      .catch((err) => {
        setFeedbackMsg({ type: 'danger', text: 'Failed to submit review. Try again.' });
      });
  };

  const userHasReviewed = orchid?.feedback?.some(f => f.author === userProfile?.email);

  const maskEmail = (email) => {
    if (!email || !email.includes('@')) return email;
    const [name, domain] = email.split('@');
    if (name.length <= 3) return `${name.charAt(0)}***@${domain}`;
    return `${name.substring(0, 3)}***@${domain}`;
  };

  return (
    <Container className="detail-container py-2">
      {/* Back Button */}
      <div className="mb-3 d-flex align-items-center">
        <Link to="/" className="btn btn-outline-premium px-3 py-2 d-flex align-items-center gap-2">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Collection
        </Link>
      </div>

      {/* Row 1: Image & Video song song bên trên */}
      <Row className="g-3 mb-3 justify-content-center">
        {/* Cột 1: Hình ảnh */}
        <Col md={orchid.videoUrl ? 6 : 8} lg={orchid.videoUrl ? 6 : 6}>
          <div className="detail-img-wrapper" onClick={() => setShowLightbox(true)}>
            <img
              src={resolveOrchidImage(orchid.img)}
              alt={orchid.name}
            />

            {/* Visual hint on hover */}
            <div className="img-overlay-hint">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="me-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
              </svg>
              Click to zoom
            </div>

            {/* Floating favorite button */}
            <button
              type="button"
              className={`favorite-btn-floating ${isFavorite ? 'is-favorite' : ''}`}
              onClick={(e) => {
                e.stopPropagation(); // Avoid opening lightbox
                handleToggleFavorite();
              }}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
        </Col>

        {/* Cột 2: Video (nếu có) */}
        {orchid.videoUrl && (
          <Col md={6} lg={6}>
            <div className="video-tour-container">
              <iframe
                src={getYouTubeEmbedUrl(orchid.videoUrl)}
                title={`${orchid.name} clip`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Col>
        )}
      </Row>

      {/* Row 2: Thông tin chi tiết bên dưới dàn ngang */}
      <Row className="g-3">
        <Col xs={12}>
          <Card className="detail-card-premium border-0 p-3">
            <Card.Body className="p-0">
              {/* Header: Title, badges, rating */}
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  {orchid.isSpecial && (
                    <Badge bg="warning" text="dark" className="px-2.5 py-1 fs-8 rounded-pill d-flex align-items-center gap-1 shadow-sm">
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                      </svg>
                      Special
                    </Badge>
                  )}
                  {orchid.isNatural ? (
                    <Badge bg="success" className="px-2.5 py-1 fs-8 rounded-pill shadow-sm" style={{ background: '#10b981' }}>Natural</Badge>
                  ) : (
                    <Badge bg="info" className="px-2.5 py-1.5 fs-8 rounded-pill text-white shadow-sm">Hybrid</Badge>
                  )}
                </div>

                <h1 className="text-start mb-2 fw-bolder" style={{ fontSize: '2rem', letterSpacing: '-0.02em', color: 'var(--text-h)' }}>
                  {orchid.name}
                </h1>

                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex align-items-center">
                    <StarRating rating={orchid.rating} size={18} />
                  </div>
                  <span className="text-muted small">({orchid.feedback?.length || 0} reviews)</span>
                </div>
              </div>

              {/* Specs Grid xếp ngang */}
              <div className="spec-grid">
                <div className="spec-card">
                  <span className="spec-icon">
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z" />
                    </svg>
                  </span>
                  <div className="spec-info-text">
                    <span className="spec-label">Origin</span>
                    <span className="spec-val text-truncate" style={{ maxWidth: '140px' }}>{orchid.origin || 'Unknown'}</span>
                  </div>
                </div>

                <div className="spec-card">
                  <span className="spec-icon">
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122A3 3 0 0 0 10.5 21.5h3a3 3 0 0 0 1-5.836V15H8v1.122zM12 3a9 9 0 0 0-9 9c0 2.21.8 4.23 2.12 5.81l1.42-1.42A7 7 0 0 1 5 12a7 7 0 0 1 10.5-6.06l1.42-1.42A8.96 8.96 0 0 0 12 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6a6 6 0 0 0-6 6c0 1.25.38 2.4 1.03 3.37l1.42-1.42A3.98 3.98 0 0 1 8 12a4 4 0 0 1 6.83-2.83l1.42-1.42A5.96 5.96 0 0 0 12 6z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 12a7 7 0 0 1-1.08 3.73l1.42 1.42A9 9 0 0 0 21 12a9 9 0 0 0-2-5.63l-1.42 1.42A7 7 0 0 1 19 12z" />
                    </svg>
                  </span>
                  <div className="spec-info-text">
                    <span className="spec-label">Color</span>
                    <span className="spec-val text-truncate" style={{ maxWidth: '140px' }}>{orchid.color || 'N/A'}</span>
                  </div>
                </div>

                <div className="spec-card">
                  <span className="spec-icon">
                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 0 0 3.182 0l4.318-4.318a2.25 2.25 0 0 0 0-3.182L11.16 3.659A2.25 2.25 0 0 0 9.568 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                  </span>
                  <div className="spec-info-text">
                    <span className="spec-label">Category</span>
                    <span className="spec-val text-truncate" style={{ maxWidth: '140px' }}>{orchid.category || 'Orchid'}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-3">
                <h6 className="fw-bold mb-1" style={{ color: 'var(--text-h)', fontSize: '0.95rem' }}>Description</h6>
                <div className="detail-description-container" style={{ maxHeight: '120px' }}>
                  <p className="lh-base mb-0 text-muted" style={{ fontSize: '0.95rem' }}>
                    {orchid.description || 'No description available for this orchid species yet. Feel free to browse details or check external database records.'}
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Feedback Section */}
      <Row className="g-3 mt-2">
        <Col xs={12}>
          <Card className="detail-card-premium border-0 p-3">
            <Card.Body>
              <h4 className="fw-bold mb-4" style={{ color: 'var(--text-h)' }}>Reviews & Feedback</h4>

              {/* Feedback Form */}
              {isLoggedIn ? (
                userProfile?.isAdmin ? (
                  <Alert variant="secondary" className="rounded-3 shadow-sm py-2 border-0" style={{ background: 'rgba(0,0,0,0.04)' }}>
                    <span className="fw-semibold text-muted">Admin Accounts</span> are not permitted to submit reviews. Only members can leave feedback.
                  </Alert>
                ) : userHasReviewed && !isEditingFeedback ? (
                  <Alert variant="info" className="rounded-3 shadow-sm py-2 d-flex justify-content-between align-items-center">
                    <span>You have already reviewed this orchid. Thank you for your feedback!</span>
                    <Button variant="outline-primary" size="sm" onClick={() => {
                        const myReview = orchid.feedback.find(f => f.author === userProfile.email);
                        if (myReview) handleEditClick(myReview);
                    }}>
                      Edit My Review
                    </Button>
                  </Alert>
                ) : (
                  <div className="feedback-form-container mb-4 p-4 rounded-4" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-semibold mb-0">{isEditingFeedback ? 'Edit Your Review' : 'Write a Review'}</h6>
                      {isEditingFeedback && (
                        <Button variant="link" className="text-muted p-0 text-decoration-none" onClick={() => {
                          setIsEditingFeedback(false);
                          setComment('');
                          setRating(5);
                          setIsAnonymous(false);
                        }}>
                          Cancel
                        </Button>
                      )}
                    </div>
                    {feedbackMsg && <Alert variant={feedbackMsg.type} className="py-2">{feedbackMsg.text}</Alert>}
                    <Form onSubmit={handleFeedbackSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-semibold text-muted">Rating</Form.Label>
                        <div className="d-flex align-items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div
                              key={star}
                              onClick={() => setRating(star)}
                              style={{ cursor: 'pointer', color: star <= rating ? '#fbbf24' : '#e5e7eb', fontSize: '1.5rem' }}
                            >
                              ★
                            </div>
                          ))}
                          <span className="ms-2 fw-semibold">{rating} / 5</span>
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-semibold text-muted">Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Share your thoughts about this orchid..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="border-0 shadow-sm"
                        />
                      </Form.Group>

                      <Form.Group className="mb-4 d-flex align-items-center gap-2">
                        <Form.Check
                          type="checkbox"
                          id="anonymous-check"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                        />
                        <Form.Label htmlFor="anonymous-check" className="mb-0 small text-muted cursor-pointer" style={{ cursor: 'pointer' }}>
                          Post anonymously
                        </Form.Label>
                      </Form.Group>

                      <Button variant="premium-action" type="submit" className="px-4 py-2 fw-semibold rounded-pill">
                        {isEditingFeedback ? 'Update Review' : 'Submit Review'}
                      </Button>
                    </Form>
                  </div>
                )
              ) : (
                <Alert variant="warning" className="rounded-3 shadow-sm py-2">
                  Please log in to write a review.
                </Alert>
              )}

              {/* Feedback List */}
              <div className="feedback-list mt-4">
                {orchid.feedback && orchid.feedback.length > 0 ? (
                  orchid.feedback.map((f, idx) => (
                    <div key={idx} className="feedback-item mb-3 pb-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px', background: f.isAnonymous ? '#9ca3af' : 'var(--bs-primary)' }}>
                            {f.isAnonymous ? 'A' : f.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-semibold small text-truncate" style={{ maxWidth: '200px', color: f.isAnonymous ? '#6b7280' : 'inherit' }}>
                              {f.isAnonymous ? 'Anonymous User' : maskEmail(f.author)}
                            </div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(f.date).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                          <StarRating rating={f.rating} size={14} />
                          {isLoggedIn && userProfile?.email === f.author && (
                             <div className="d-flex gap-3 mt-2">
                               <span 
                                 className="fw-semibold" 
                                 style={{cursor: 'pointer', fontSize: '0.8rem', color: '#3b82f6', letterSpacing: '0.01em'}} 
                                 onClick={() => handleEditClick(f)}
                               >
                                 Edit
                               </span>
                               <span 
                                 className="fw-semibold" 
                                 style={{cursor: 'pointer', fontSize: '0.8rem', color: '#ef4444', letterSpacing: '0.01em'}} 
                                 onClick={() => setShowDeleteConfirm(true)}
                               >
                                 Delete
                               </span>
                             </div>
                          )}
                        </div>
                      </div>
                      <p className="mb-0 text-muted small ps-5">{f.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted small">No reviews yet. Be the first to review this orchid!</p>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Lightbox / Zoom modal */}
      <div className={`lightbox-modal ${showLightbox ? 'show' : ''}`} onClick={() => setShowLightbox(false)}>
        <button type="button" className="lightbox-close" onClick={() => setShowLightbox(false)}>&times;</button>
        <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
          <img src={resolveOrchidImage(orchid.img)} alt={orchid.name} />
          <div className="lightbox-title">{orchid.name}</div>
        </div>
      </div>

      <ConfirmModal
        show={showDeleteConfirm}
        handleClose={() => setShowDeleteConfirm(false)}
        handleConfirm={doDeleteFeedback}
        title="Delete your review?"
        message="Your rating and comment will be removed, and this orchid's average score will be recalculated. This cannot be undone."
        isProcessing={isDeletingFeedback}
      />
    </Container>
  );
};

export default Detail;
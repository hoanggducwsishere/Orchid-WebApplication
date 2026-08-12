import React from 'react';
import { Spinner } from 'react-bootstrap';

const PageLoader = ({ message = 'Loading...', fullPage = false, overlay = false }) => {
  const content = (
    <div className="loader-content text-center p-4">
      <div className="loader-icon-wrapper mb-3">
        <svg width="48" height="48" fill="none" stroke="var(--bs-primary, #7c3aed)" strokeWidth="2" viewBox="0 0 24 24" className="loader-pulse">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21V9.75M12 9.75a3 3 0 1 1 6 0M12 9.75a3 3 0 1 0-6 0M6 9.75a6 6 0 0 1 12 0" />
        </svg>
        <Spinner animation="border" className="loader-spinner-ring" />
      </div>
      <h6 className="fw-semibold text-dark mb-1 loader-message">{message}</h6>
      <p className="text-muted small mb-0">Please wait a moment...</p>
    </div>
  );

  if (fullPage) {
    return <div className="page-loader-fullpage">{content}</div>;
  }

  if (overlay) {
    return <div className="page-loader-overlay">{content}</div>;
  }

  return <div className="page-loader-inline my-4">{content}</div>;
};

export default PageLoader;

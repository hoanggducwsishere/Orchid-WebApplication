import React from 'react';
import { Modal, Button } from 'react-bootstrap';

// Shared confirmation dialog for destructive actions. It knows nothing about what
// is being deleted: the caller supplies the wording and the action, which is why
// the same component covers orchids, categories and reviews.
//
// Header/Body/Footer are deliberate. app.scss already styles those three parts of
// .modal-content (tinted header, footer border, dark mode), so this dialog matches
// the add/edit modals without needing any CSS of its own.
const ConfirmModal = ({
  show,
  handleClose,
  handleConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  isProcessing = false,
}) => (
  <Modal show={show} onHide={handleClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>

    <Modal.Body className="d-flex align-items-start gap-3">
      <div className="d-inline-flex p-2 rounded-circle bg-danger-subtle text-danger flex-shrink-0">
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374l7.108-12.32c.866-1.5 3.032-1.5 3.898 0l7.108 12.32zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p className="mb-0 text-body-secondary">{message}</p>
    </Modal.Body>

    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose} disabled={isProcessing}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleConfirm} disabled={isProcessing}>
        {isProcessing ? 'Deleting...' : confirmLabel}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmModal;

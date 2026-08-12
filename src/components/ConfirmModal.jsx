import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmModal = ({ show, onHide, onConfirm, title, message, confirmLabel = 'Delete' }) => (
    <Modal show={show} onHide={onHide} centered>
        <Modal.Body className="text-center p-4">
            {/* p-3 bao quanh svg 28px -> tu thanh hinh tron, khong can set width/height */}
            <div className="d-inline-flex p-3 mb-3 rounded-circle bg-danger-subtle text-danger">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            </div>

            <h5 className="fw-bold mb-2">{title}</h5>
            <p className="text-body-secondary small mb-4">{message}</p>

            <div className="d-flex gap-2">
                <Button variant="outline-secondary" className="flex-fill py-2 fw-semibold" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="danger" className="flex-fill py-2 fw-semibold" onClick={onConfirm}>
                    {confirmLabel}
                </Button>
            </div>
        </Modal.Body>
    </Modal>
);

export default ConfirmModal;
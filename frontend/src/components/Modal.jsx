import React from 'react';
import { CloseIcon } from './Icons';

/**
 * ==========================================================
 * REUSABLE MODAL COMPONENT
 * ==========================================================
 * Provides a clean dialog window for adding/editing records
 * and confirmation prompts.
 */
function Modal({ isOpen, title, onClose, children, footer, size }) {
  if (!isOpen) return null;

  const sizeClass = size === 'xl' ? 'modal-content-xl' : size === 'lg' ? 'modal-content-lg' : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content ${sizeClass}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <CloseIcon size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;

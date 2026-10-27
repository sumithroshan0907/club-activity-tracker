import React from 'react';
import { CheckIcon, AlertIcon, CloseIcon } from './Icons.jsx';

/**
 * ==========================================================
 * NOTIFICATION BANNER COMPONENT
 * ==========================================================
 * Displays user-friendly alert messages (success, danger, warning)
 * for API actions, validation notices, and errors.
 */
function Notification({ notification, onClose }) {
  if (!notification || !notification.message) return null;

  const typeClass =
    notification.type === 'success'
      ? 'alert-banner-success'
      : notification.type === 'warning'
      ? 'alert-banner-warning'
      : 'alert-banner-danger';

  const icon =
    notification.type === 'success' ? (
      <CheckIcon size={16} color="var(--success)" />
    ) : notification.type === 'warning' ? (
      <AlertIcon size={16} color="var(--warning)" />
    ) : (
      <CloseIcon size={16} color="var(--danger)" />
    );

  return (
    <div className={`alert-banner ${typeClass}`} role="alert">
      <div className="alert-banner-content">
        <span className="alert-banner-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
          {icon}
        </span>
        <span className="alert-banner-text">{notification.message}</span>
      </div>
      <button
        type="button"
        className="alert-banner-close"
        onClick={onClose}
        aria-label="Close notification"
        style={{ display: 'inline-flex', alignItems: 'center' }}
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
}

export default Notification;

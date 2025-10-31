import React from 'react';
import ReactDOM from 'react-dom';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import '../../styles/components/common/ResultModal.css';

/**
 * ResultModal – compact confirmation/feedback modal used after submit actions
 * Props:
 * - open: boolean
 * - type: 'success' | 'error'
 * - title: string
 * - message?: string
 * - confirmLabel?: string (default: 'Tutup')
 * - onClose: () => void
 */
export default function ResultModal({ open, type = 'success', title, message, confirmLabel = 'Tutup', onClose }) {
  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="resultmodal__backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className="resultmodal" role="dialog" aria-modal="true">
        <div className={`resultmodal__icon ${type === 'success' ? 'is-success' : 'is-error'}`} aria-hidden="true">
          {type === 'success' ? (
            <CheckCircleRoundedIcon sx={{ fontSize: 32, color: '#ffffff' }} />
          ) : (
            <CancelRoundedIcon sx={{ fontSize: 32, color: '#ffffff' }} />
          )}
        </div>
        <div className="resultmodal__content">
          {title && <h3 className="resultmodal__title">{title}</h3>}
          {message && <p className="resultmodal__message">{message}</p>}
        </div>
        <div className="resultmodal__actions">
          <button className="resultmodal__btn" onClick={onClose}>{confirmLabel}</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

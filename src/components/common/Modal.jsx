import React, { useEffect } from 'react';
import {createPortal} from 'react-dom';
import '../../styles/components/common/Modal.css';

/**
 * Modal - lightweight modal using a portal to body
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - title?: string | ReactNode
 * - footer?: ReactNode (custom footer actions)
 * - width?: number | string
 */
export default function Modal({ open, onClose, title, subtitle, footer, width = 640, children }) {
  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="adminmodal__backdrop" onClick={(e) => {
      // only close if clicking the backdrop, not inside the panel
      if (e.target === e.currentTarget) onClose?.();
    }}>
      <div className="adminmodal" style={{ maxWidth: width }} role="dialog" aria-modal="true">
        <div className="adminmodal__header">
          <div className="adminmodal__headings">
            <h3 className="adminmodal__title">{title}</h3>
            {subtitle && <p className="adminmodal__subtitle">{subtitle}</p>}
          </div>
          <button className="adminmodal__close" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div className="adminmodal__body">{children}</div>
        {footer && (
          <div className="adminmodal__footer">{footer}</div>
        )}
      </div>
    </div>,
    document.body
  );
}

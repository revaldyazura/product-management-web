import React from 'react';
import { useToast } from '../../context/ToastContext';
import '../../styles/components/common/Toast.css';

export default function ToastContainer() {
  const { toasts, remove } = useToast();

  return (
    <div className="toast__container" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <div className="toast__msg">{t.message}</div>
          <button className="toast__close" onClick={() => remove(t.id)} aria-label="Close">×</button>
        </div>
      ))}
    </div>
  );
}

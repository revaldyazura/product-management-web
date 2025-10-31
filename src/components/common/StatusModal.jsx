import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import Switch from '@mui/material/Switch';
import '../../styles/components/common/StatusModal.css';

/**
 * StatusModal
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - value: 'active'|'inactive'
 * - onSave: (newValue) => void
 * - title?: string
 */
export default function StatusModal({ open, onClose, value = 'inactive', onSave, title = 'Ubah Status' }) {
  const [checked, setChecked] = useState(value === 'active');

  useEffect(() => {
    if (open) setChecked(value === 'active');
  }, [open, value]);

  const handleSave = () => {
    const newValue = checked ? 'active' : 'inactive';
    onSave?.(newValue);
    onClose?.();
  };

  const footer = (
    <div className="status-modal__footer">
      <button className="btn" onClick={onClose}>Batal</button>
      <button className="btn btn--primary" onClick={handleSave}>Simpan</button>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title={title} subtitle="Ganti status aktif/nonaktif." footer={footer} width={420}>
      <div className="status-modal__body">
        <div className="status-modal__text">
          <div className="status-modal__title">{checked ? 'Active' : 'Nonaktif'}</div>
          <div className="status-modal__subtitle">Gunakan switch untuk mengubah status item ini.</div>
        </div>
        <div className="status-modal__switch">
          <Switch checked={checked} onChange={(e) => setChecked(e.target.checked)} />
        </div>
      </div>
    </Modal>
  );
}

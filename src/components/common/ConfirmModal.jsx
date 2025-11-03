import {React, useState} from 'react';
import Modal from './Modal';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import '../../styles/components/common/ConfirmModal.css';

/**
 * ConfirmModal - simple confirmation dialog
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - title?: string
 * - message?: string
 * - onConfirm: () => Promise|void
 * - confirmLabel?: string
 */
export default function ConfirmModal({ open, onClose, title = 'Konfirmasi', message = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.', onConfirm, confirmLabel = 'Hapus' }) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await onConfirm?.();
        } catch (e) {
            // swallow; caller handles toast/errors
        } finally {
            setLoading(false);
            onClose?.();
        }
    };

    const footer = (
        <div className="confirm-modal__footer">
            <button className="btn" onClick={onClose} disabled={loading}>Batal</button>
            <button className="btn btn--primary" onClick={handleConfirm} disabled={loading}>
                {confirmLabel}
            </button>
        </div>
    );

    return (
        <Modal open={open} onClose={onClose} title='Konfirmasi' footer={footer} width={520}>
            <div className="confirm-modal__body">
                    <div className="confirm-modal__icon">
                        <CloseRoundedIcon />
                    </div>
                    <div className="confirm-modal__content">
                        <div className="confirm-modal__title">{title}</div>
                        <div className="confirm-modal__message">{message}</div>
                    </div>
                </div>
        </Modal>
    );
}

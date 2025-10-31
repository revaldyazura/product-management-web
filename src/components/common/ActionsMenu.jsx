import React, { useEffect, useRef, useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import '../../styles/components/common/ActionsMenu.css';

/**
 * ActionsMenu - tombol titik tiga + popover menu kecil
 * Props:
 * - onEdit?: () => void
 * - onChangeStatus?: () => void
 * - onDelete?: () => void
 */
export default function ActionsMenu({ onEdit, onChangeStatus, onDelete }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="rowactions" ref={wrapRef}>
      <button className="iconbtn" aria-label="aksi lainnya" onClick={() => setOpen((v) => !v)}>
        <MoreHorizIcon />
      </button>
      {open && (
        <div className="actionmenu" role="menu">
          <button className="actionmenu__item" onClick={() => { setOpen(false); onEdit?.(); }}>
            <EditOutlinedIcon className="actionmenu__icon" />
            <span>Edit</span>
          </button>
          <button className="actionmenu__item" onClick={() => { setOpen(false); onChangeStatus?.(); }}>
            <AutorenewIcon className="actionmenu__icon" />
            <span>Ubah Status</span>
            <ChevronRightIcon className="actionmenu__arrow" />
          </button>
          <button className="actionmenu__item actionmenu__item--danger" onClick={() => { setOpen(false); onDelete?.(); }}>
            <DeleteOutlineIcon className="actionmenu__icon" />
            <span>Hapus</span>
          </button>
        </div>
      )}
    </div>
  );
}

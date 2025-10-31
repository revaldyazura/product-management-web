import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import '../../styles/components/common/SectionManagement.css';

/**
 * SectionManagement (formerly PageHeader for admin pages)
 * Props:
 * - title: string
 * - subtitle?: string
 * - right?: ReactNode (actions area on the right)
 * - addLabel?: string (optional label for default add button)
 * - onAdd?: () => void (show default add button when provided)
 */
export default function SectionManagement({ title, subtitle, right, addLabel, onAdd }) {
  // Rendered as a div to live inside page body (not a semantic <header>)
  return (
    <div className="adminph header">
      <div className="adminph__left">
        <h1 className="adminph__title">{title}</h1>
        {subtitle && <p className="adminph__subtitle">{subtitle}</p>}
      </div>
      {(right || onAdd) && (
        <div className="adminph__right">
          {right}
          {onAdd && (
            <button className="admintb__btn admintb__btn--primary" onClick={onAdd}>
              <AddIcon />
              <span>{addLabel || 'Tambah'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

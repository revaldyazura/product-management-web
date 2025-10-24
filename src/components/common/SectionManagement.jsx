import React from 'react';
import '../../styles/components/common/SectionManagement.css';

/**
 * SectionManagement (formerly PageHeader for admin pages)
 * Props:
 * - title: string
 * - subtitle?: string
 * - right?: ReactNode (actions area on the right)
 */
export default function SectionManagement({ title, subtitle, right }) {
  // Rendered as a div to live inside page body (not a semantic <header>)
  return (
    <div className="adminph header">
      <div className="adminph__left">
        <h1 className="adminph__title">{title}</h1>
        {subtitle && <p className="adminph__subtitle">{subtitle}</p>}
      </div>
      {right && <div className="adminph__right">{right}</div>}
    </div>
  );
}

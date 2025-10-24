import React from 'react';
import { ReactComponent as BrandLogo } from '../../assets/logo.svg';
import { NavLink } from 'react-router-dom';

export default function Logo({ size = 120, title = 'Company logo', className = '' }) {
  return (
    <NavLink to="/home">
      <BrandLogo
        className={`brand-logo ${className}`.trim()}
        aria-label={title}
        focusable="false"
        style={{ width: size, height: 'auto' }}
      />
    </NavLink>

  );
}
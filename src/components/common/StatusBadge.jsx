import React from 'react';
import '../../styles/components/common/StatusBadge.css';

/**
 * StatusBadge - small pill for active/inactive
 * Props: status: 'active' | 'inactive' | string
 */
export default function StatusBadge({ status }) {
  const normalized = (status || '').toLowerCase();
  const isActive = normalized === 'active' || normalized === 'aktif';
  const cls = `statuspill ${isActive ? 'statuspill--active' : 'statuspill--inactive'}`;
  return <span className={cls}>{isActive ? 'Active' : 'Nonaktif'}</span>;
}

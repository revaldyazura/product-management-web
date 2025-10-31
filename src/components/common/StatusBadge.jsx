import React from 'react';
import '../../styles/components/common/StatusBadge.css';

/**
 * StatusBadge - small pill for status display
 * Props: status: 'active' | 'inactive' | 'menipis' | string
 */
export default function StatusBadge({ status }) {
  const normalized = (status || '').toLowerCase();
  let cls = 'statuspill statuspill--inactive';
  let label = 'Nonaktif';

  if (normalized === 'menipis' || normalized === 'low') {
    cls = 'statuspill statuspill--low';
    label = 'Menipis';
  } else if (normalized === 'active' || normalized === 'aktif') {
    cls = 'statuspill statuspill--active';
    label = 'Aktif';
  }

  return <span className={cls}>{label}</span>;
}

// src/services/userService.js
import { apiClient } from './apiClient';

export async function getUsers({ page = 1, size = 10, search = '', status = 'all', roles = [] } = {}) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('size', String(size));
  if (search && search.trim()) params.set('name', search.trim()); // backend: name can search name/email/phone
  if (status && status !== 'all') params.set('status', status);
  if (Array.isArray(roles)) {
    roles.filter(Boolean).forEach((r) => params.append('roles', r));
  }
  const path = `/user/controller/api/v1/users?${params.toString()}`;
  return apiClient(path, { method: 'GET' });
}

export async function deleteUser(userId) {
  if (!userId) throw new Error('userId is required');
  const path = `/user/controller/api/v1/${userId}`;
  // apiClient will throw on non-2xx
  return apiClient(path, { method: 'DELETE' });
}

// Update a user partially (PUT) — send only defined, non-empty fields
// payload can include: { name, email, phone, status, roles, password }
export async function updateUser(userId, payload = {}) {
  if (!userId) throw new Error('userId is required');

  // Build body by removing null/undefined and empty-string fields
  const body = Object.entries(payload).reduce((acc, [k, v]) => {
    if (v === undefined || v === null) return acc;
    if (typeof v === 'string' && v.trim() === '') return acc;
    acc[k] = v;
    return acc;
  }, {});

  const path = `/user/controller/api/v1/${encodeURIComponent(userId)}`;
  return apiClient(path, { method: 'PUT', body });
}

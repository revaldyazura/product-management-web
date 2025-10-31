// src/services/authService.js
import { apiClient, injectGetAccessToken } from './apiClient';
import { storeEncryptedToken, loadDecryptedToken, clearStoredToken } from '../utils/encrypt';

let accessToken = null; // simpan di memori (aman dari pencurian via XSS yang baca storage)

export function getAccessToken() { return accessToken; }
function setAccessToken(token) { accessToken = token; }
export function clearAccessToken() { accessToken = null; }

injectGetAccessToken(getAccessToken);

export async function initTokenFromStorage() {
  try {
    const token =
      (await loadDecryptedToken({ storage: 'session' })) ||
      (await loadDecryptedToken({ storage: 'local' }));
    if (token) setAccessToken(token);
    return !!token;
  } catch (error) {
    console.log(error);
    return false
  }
}

export async function login(username, password, persistMode = 'session') {
  const form = new URLSearchParams();
  form.set('username', username);
  form.set('password', password);

  // Opsional sesuai OAuth2 spec / FastAPI OAuth2PasswordRequestForm:
  // - grant_type biasanya 'password' (beberapa backend mengharuskannya)
  // - scope bisa dikosongkan atau diisi "read write" sesuai kebutuhan
  form.set('grant_type', 'password');
  form.set('scope', '');

  const data = await apiClient('/auth/controller/api/v1/login', {
    method: 'POST',
    // Penting: override default 'application/json' di apiClient
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    // Bisa kirim URLSearchParams langsung atau .toString(); keduanya valid
    body: form.toString(),
  });
  const token = data?.access_token || null;
  setAccessToken(token);

  await storeEncryptedToken(token, { storage: persistMode, persistenceKey: persistMode });

  return data
}

export async function logout() {
  try {
    await apiClient('/auth/controller/api/v1/logout', { method: 'POST' });
  } finally {
    clearAccessToken();
    clearStoredToken();
  }
}

export function getMe() {
  return apiClient('/auth/controller/api/v1/me');
}

// Register a new user according to FastAPI schema
// payload: { name, email, password, phone?, status? ('active'|'inactive'), roles?: string[] }
export async function registerUser(payload) {
  const body = {
    name: (payload.name || '').trim(),
    email: (payload.email || '').trim().toLowerCase(),
    password: payload.password || '',
    phone: payload.phone ? String(payload.phone).trim() : null,
    status: payload.status || 'active',
    roles: Array.isArray(payload.roles) && payload.roles.length ? payload.roles : undefined,
  };

  return apiClient('/auth/controller/api/v1/register', {
    method: 'POST',
    body,
  });
}

// Upload avatar for a specific user
export async function uploadAvatar(userId, file) {
  if (!userId || !file) throw new Error('userId and file are required');
  const form = new FormData();
  form.append('file', file);
  return apiClient(`/user/controller/api/v1/${encodeURIComponent(userId)}/avatar`, {
    method: 'POST',
    body: form,
  });
}
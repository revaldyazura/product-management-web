// src/services/apiClient.js

let getAccessToken = () => null; // akan di-inject dari auth.js
export function injectGetAccessToken(fn) { getAccessToken = fn; }

export async function apiClient(path, { method = 'GET', headers = {}, body, ...rest } = {}) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL || '';
  const token = getAccessToken && getAccessToken();

  const isForm = body instanceof FormData || body instanceof URLSearchParams;
  const finalHeaders = {
    ...(isForm ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const finalBody =
    body && !isForm && typeof body === 'object' ? JSON.stringify(body) : body;

  const res = await fetch(baseUrl + path, {
    method,
    headers: finalHeaders,
    credentials: 'include',
    body: finalBody,
    ...rest,
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const err = new Error((data && data.message) || res.statusText);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
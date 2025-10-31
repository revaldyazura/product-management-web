
export function withBaseUrl(path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    const base = (process.env.REACT_APP_API_BASE_URL || '').replace(/\/+$/, '');
    const p = String(path).startsWith('/') ? path : `/${path}`;
    return `${base}${p}`;
}

export function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('id-ID', {dateStyle: 'medium', timeStyle: 'short'})
}
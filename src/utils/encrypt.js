const TOKEN_STORAGE_KEY = 'AUTH_TOKEN_ENCRYPTED';
const KEY_STORAGE_KEY = 'AUTH_AES_KEY_B64';

// base64 encoding and decoding
const toBase64 = (arrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
const fromBase64 = (base64) => Uint8Array.from(atob(base64), c => c.charCodeAt(0));

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function getStorageSession(kind = 'session') {
    return kind === 'local' ? localStorage : sessionStorage;
}

async function getAesKey(persistenceKey = 'session') {
    const storage = getStorageSession(persistenceKey);
    let keyB64 = storage.getItem(KEY_STORAGE_KEY);
    if (!keyB64) {
        const raw = crypto.getRandomValues(new Uint8Array(32));
        keyB64 = toBase64(raw.buffer);
        storage.setItem(KEY_STORAGE_KEY, keyB64);
    }
    const rawKey = fromBase64(keyB64);
    return crypto.subtle.importKey('raw', rawKey, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

async function importKeyFromAnySource(prefer = 'session') {
    const order = prefer === 'local' ? ['local', 'session'] : ['session', 'local'];
    for (const source of order) {
        const base64 = getStorageSession(source).getItem(KEY_STORAGE_KEY);
        if (base64) {
            const rawKey = fromBase64(base64);
            try {
                return await crypto.subtle.importKey('raw', rawKey, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
            } catch (error) {
                console.log(error);
            }
        }
    }
    return null;
}

export async function encryptString(plainText, { persistenceKey = 'session' } = {}) {
    const key = await getAesKey(persistenceKey)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cipher_text = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(plainText));

    return `${toBase64(iv.buffer)}.${toBase64(cipher_text)}`;
}

export async function decryptString(payload, { preferredKeyStore = 'session' } = {}) {
    if (!payload) throw new Error('No payload to decrypt');
    const [ivB64, cipher_text_b64] = payload.split('.');
    if (!ivB64 || !cipher_text_b64) throw new Error('Invalid payload format');
    const key = await importKeyFromAnySource(preferredKeyStore);
    if (!key) throw new Error('No key available for decryption');
    const iv = fromBase64(ivB64);
    const cipher_text = fromBase64(cipher_text_b64);
    const plain_buffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher_text);
    return decoder.decode(plain_buffer);
}

export async function storeEncryptedToken(token, { storage = 'session', persistenceKey = 'session' } = {}) {
    if (!token) throw new Error('No token to store');
    const payload = await encryptString(token, { persistenceKey });
    getStorageSession(storage).setItem(TOKEN_STORAGE_KEY, payload);
    const other = storage === 'session' ? 'local' : 'session';
    getStorageSession(other).removeItem(TOKEN_STORAGE_KEY);
  }

export async function loadDecryptedToken({ storage = 'session' } = {}) {
    const primary = getStorageSession(storage).getItem(TOKEN_STORAGE_KEY);
    const fallback = getStorageSession(storage === 'session' ? 'local' : 'session').getItem(TOKEN_STORAGE_KEY);
    if (primary) {
        try {
            return await decryptString(primary, { preferredKeyStore: storage });
        } catch {

        }
    }

    if (fallback) {
        try {
            const fallbackStore = storage === 'session' ? 'local' : 'session';
            return await decryptString(fallback, { preferredKeyStore: fallbackStore });
        } catch {
            // ignore
        }
    }

    return null;
}

export function clearStoredToken({ clearKeys = false } = {}) {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);

    if (clearKeys) {
        sessionStorage.removeItem(KEY_STORAGE_KEY);
        localStorage.removeItem(KEY_STORAGE_KEY);
    };
}
export const CryptoStorageKeys = {
    TOKEN_STORAGE_KEY,
    KEY_STORAGE_KEY,
};

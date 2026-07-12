export interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: string;
  roleId: string | null;
  institutionId: string;
  createdAt: number;
}

const COOKIE_NAME = 'mphm_session';

function getResolvedSecret(): string {
  // Try process.env first (Cloudflare Workers via nodejs_compat shim)
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;

  // Deterministic fallback — MUST match between backend & frontend workers
  console.warn('WARNING: SESSION_SECRET not found in process.env. Using hardcoded fallback.');
  return 'mphm-portal-secure-production-session-secret-token';
}

/**
 * Helper to generate HMAC signature for a message.
 */
async function generateSignature(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Creates a signed session token.
 */
export async function createSessionToken(session: UserSession): Promise<string> {
  const serialized = btoa(JSON.stringify(session))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  const signature = await generateSignature(serialized, getResolvedSecret());
  return `${serialized}.${signature}`;
}

/**
 * Verifies and decodes a session token. Returns null if invalid or expired.
 */
export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [serialized, signature] = parts;
    const expectedSignature = await generateSignature(serialized, getResolvedSecret());

    if (signature !== expectedSignature) {
      return null;
    }

    // Pad base64 back for decoding
    let base64 = serialized.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    const decodedStr = atob(base64);
    const session = JSON.parse(decodedStr) as UserSession;

    // session expiry check (e.g. 7 days)
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - session.createdAt > sevenDaysMs) {
      return null;
    }

    return session;
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}


// Custom resolver hook for pure Worker/Hono context
let honoSessionResolver: (() => Promise<UserSession | null>) | null = null;

export function setHonoSessionResolver(resolver: (() => Promise<UserSession | null>) | null) {
  honoSessionResolver = resolver;
}

/**
 * Gets the current active session from cookies.
 */
export async function getSession(): Promise<UserSession | null> {
  if (honoSessionResolver) {
    return honoSessionResolver();
  }
  // Di backend (Hono), kita wajib mendaftarkan honoSessionResolver melalui middleware.
  // Tidak ada next/headers di sini.
  return null;
}

/**
 * Helper to generate raw Set-Cookie header string for login
 */
export async function createSessionCookieHeader(session: UserSession): Promise<string> {
  const token = await createSessionToken(session);
  const isProd = process.env.NODE_ENV === 'production';
  return `${COOKIE_NAME}=${token}; HttpOnly; ${isProd ? 'Secure; ' : ''}SameSite=Lax; Path=/; ${isProd ? 'Domain=.m.p3hm.my.id; ' : ''}Max-Age=604800`;
}

/**
 * Helper to generate raw Set-Cookie header string for logout
 */
export function createClearSessionCookieHeader(): string {
  const isProd = process.env.NODE_ENV === 'production';
  return `${COOKIE_NAME}=; HttpOnly; ${isProd ? 'Secure; ' : ''}SameSite=Lax; Path=/; ${isProd ? 'Domain=.m.p3hm.my.id; ' : ''}Max-Age=0`;
}

// Backwards compatibility functions matching old exports
export async function setSessionCookie(session: UserSession) {
  throw new Error('setSessionCookie is not supported in the backend. Use createSessionCookieHeader instead.');
}

export async function clearSessionCookie() {
  throw new Error('clearSessionCookie is not supported in the backend. Use createClearSessionCookieHeader instead.');
}

export async function createSession(token: string) {
  throw new Error('createSession is not supported in the backend.');
}

export async function clearSession() {
  throw new Error('clearSession is not supported in the backend.');
}

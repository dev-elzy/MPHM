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
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    console.warn('WARNING: SESSION_SECRET environment variable is missing. Using fallback secret.');
    return 'default-fallback-insecure-secret-for-production-please-change-me';
  }
  return secret;
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
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    if (!cookie?.value) return null;
    return verifySessionToken(cookie.value);
  } catch {
    return null;
  }
}

/**
 * Sets a session cookie for login.
 */
export async function setSessionCookie(session: UserSession) {
  const token = await createSessionToken(session);
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? '.m.p3hm.my.id' : undefined,
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

/**
 * Clears the session cookie on logout.
 */
export async function clearSessionCookie() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Backwards compatibility functions matching old exports
export async function createSession(token: string) {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  await clearSessionCookie();
}

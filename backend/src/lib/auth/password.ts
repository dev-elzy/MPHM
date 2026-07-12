/**
 * Web Crypto API-based password hashing for edge runtime compatibility.
 * Works natively in standard Node.js, Next.js Edge Runtime, and Cloudflare Workers.
 */

// PBKDF2 configuration (Cloudflare Workers max limit is 100,000)
const ITERATIONS = 100000;
const KEY_LEN = 32; // 256 bits
const ALGORITHM = 'SHA-256';

/**
 * Converts a buffer to a hex string.
 */
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Converts a hex string to a buffer.
 */
function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

/**
 * Securely hashes a password using PBKDF2.
 * Returns formatted hash string: `$pbkdf2$SHA-256$iterations$salt$hash`
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: ITERATIONS,
      hash: ALGORITHM,
    },
    baseKey,
    KEY_LEN * 8
  );

  const saltHex = bufferToHex(salt.buffer);
  const hashHex = bufferToHex(derivedBits);

  return `$pbkdf2$${ALGORITHM}$${ITERATIONS}$${saltHex}$${hashHex}`;
}

/**
 * Verifies a password against a stored PBKDF2 hash.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const parts = storedHash.split('$');
    if (parts.length !== 6 || parts[1] !== 'pbkdf2') {
      return false;
    }

    const [, , algo, iterStr, saltHex, hashHex] = parts;
    const iterations = parseInt(iterStr, 10);
    
    const encoder = new TextEncoder();
    const salt = hexToBuffer(saltHex);

    const baseKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt.buffer as ArrayBuffer,
        iterations: iterations,
        hash: algo,
      },
      baseKey,
      KEY_LEN * 8
    );

    const verifyHex = bufferToHex(derivedBits);
    return verifyHex === hashHex;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

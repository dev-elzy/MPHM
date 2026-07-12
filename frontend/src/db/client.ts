import { getCloudflareContext } from '@opennextjs/cloudflare';
import { createDb } from './index';

/**
 * Returns Drizzle ORM database instance using Cloudflare D1 binding.
 * Falls back to check globalThis and @opennextjs/cloudflare context.
 */
export function getDb() {
  let d1: D1Database | undefined;

  try {
    // Attempt to get context via @opennextjs/cloudflare
    const cfContext = getCloudflareContext();
    const env = cfContext?.env as Record<string, D1Database | undefined> | undefined;
    if (env?.DB) {
      d1 = env.DB;
    }
  } catch {
    // Ignore error in non-cloudflare environments (e.g. build time or local scripting)
  }

  if (!d1) {
    d1 = (process.env.DB || 
          (globalThis as Record<string, unknown>).DB || 
          ((process.env as Record<string, unknown>).var as Record<string, unknown>)?.DB) as D1Database;
  }
  
  if (!d1) {
    throw new Error(
      'D1 Database binding is missing. Please ensure Cloudflare D1 is configured in wrangler.jsonc and the binding is named "DB".'
    );
  }
  
  return createDb(d1);
}

import { createDb } from './index';

/**
 * Returns Drizzle ORM database instance using Cloudflare D1 binding.
 * Falls back to check globalThis and @opennextjs/cloudflare context.
 */
export function getDb() {
  let d1: D1Database | undefined;

  if (!d1) {
    d1 = ((globalThis as Record<string, unknown>).DB ||
          process.env.DB || 
          ((process.env as Record<string, unknown>).var as Record<string, unknown>)?.DB) as D1Database;
  }
  
  if (!d1) {
    throw new Error(
      'D1 Database binding is missing. Please ensure Cloudflare D1 is configured in wrangler.jsonc and the binding is named "DB".'
    );
  }
  
  return createDb(d1);
}

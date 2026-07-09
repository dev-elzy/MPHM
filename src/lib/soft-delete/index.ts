import { isNull, isNotNull, Column } from 'drizzle-orm';

/**
 * Common soft-delete columns interface
 */
export interface SoftDeleteColumns {
  deletedAt: Column;
  deletedBy: Column;
}

/**
 * Returns condition to filter out soft-deleted records from standard queries.
 * E.g., `and(eq(table.status, 'active'), notDeleted(table))`
 */
export function notDeleted(table: { deletedAt: Column }) {
  return isNull(table.deletedAt);
}

/**
 * Returns condition to select only soft-deleted records (for Recycle Bin queries).
 */
export function onlyDeleted(table: { deletedAt: Column }) {
  return isNotNull(table.deletedAt);
}

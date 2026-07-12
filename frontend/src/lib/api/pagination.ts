import { SQL, asc, desc } from 'drizzle-orm';
import { AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
  sortBy: string;
  order: 'asc' | 'desc';
}

/**
 * Parses query parameters from URL into standardized pagination and sorting parameters.
 */
export function getPaginationParams(
  url: string,
  defaultSort = 'createdAt',
  defaultLimit = 25
): PaginationParams {
  const { searchParams } = new URL(url);

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.max(1, Math.min(500, parseInt(searchParams.get('limit') || String(defaultLimit), 10)));
  const offset = (page - 1) * limit;
  
  const sortBy = searchParams.get('sort') || defaultSort;
  const rawOrder = searchParams.get('order')?.toLowerCase();
  const order = rawOrder === 'asc' ? 'asc' : 'desc';

  return {
    page,
    limit,
    offset,
    sortBy,
    order,
  };
}

/**
 * Helper to build Drizzle order by clauses from parsed pagination parameters.
 */
export function getOrderByExpression(
  column: AnySQLiteColumn,
  order: 'asc' | 'desc'
): SQL {
  return order === 'asc' ? asc(column) : desc(column);
}

/**
 * Builds standard paginated meta response object
 */
export function getPaginationMeta(
  totalItems: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    totalItems,
    itemCount: limit,
    itemsPerPage: limit,
    totalPages,
    currentPage: page,
  };
}

import { UserSession } from './session';
import { apiError } from '../api/response';

/**
 * Validates if the user session has the required roles.
 * Returns { authorized: true } or { authorized: false, response: Response }.
 */
export function checkRole(session: UserSession, allowedRoles: string[]) {
  if (!allowedRoles.includes(session.role)) {
    return {
      authorized: false,
      response: apiError('Anda tidak memiliki hak akses untuk aksi ini', 403)
    };
  }
  return { authorized: true };
}

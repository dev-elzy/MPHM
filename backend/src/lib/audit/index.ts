import { getDb } from '@/db/client';
import { auditLogs } from '@/db/schema/audit-logs';

export interface AuditLogParams {
  userId?: string;
  userName?: string;
  userRole?: string;
  module: string;
  action: string;
  entityId?: string;
  entityType?: string;
  oldData?: unknown;
  newData?: unknown;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
  institutionId?: string;
}

/**
 * Inserts a new audit log record into the database.
 */
export async function logActivity(
  _d1: unknown,
  params: AuditLogParams
) {
  try {
    const db = getDb();
    
    // Safely stringify objects
    const oldDataStr = params.oldData ? JSON.stringify(params.oldData) : null;
    const newDataStr = params.newData ? JSON.stringify(params.newData) : null;

    await db.insert(auditLogs).values({
      id: crypto.randomUUID(),
      institutionId: params.institutionId || 'default',
      userId: params.userId || null,
      userName: params.userName || null,
      userRole: params.userRole || null,
      module: params.module,
      action: params.action,
      entityId: params.entityId || null,
      entityType: params.entityType || null,
      oldData: oldDataStr,
      newData: newDataStr,
      description: params.description || null,
      ipAddress: params.ipAddress || null,
      userAgent: params.userAgent || null,
    });
  } catch (error) {
    // Fail-silent or log to server console to prevent database logging issues from breaking core transactions
    console.error('Failed to log audit activity:', error);
  }
}

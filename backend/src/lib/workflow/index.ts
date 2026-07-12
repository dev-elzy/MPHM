import {
  ACADEMIC_YEAR_STATUS,
  SCORE_SESSION_STATUS,
  REPORT_STATUS,
  PROMOTION_PERIOD_STATUS,
} from '../constants/academic';

// Define state transition rules for each module/workflow
const TRANSITIONS: Record<string, Record<string, string[]>> = {
  academic_year: {
    [ACADEMIC_YEAR_STATUS.DRAFT]: [ACADEMIC_YEAR_STATUS.PUBLISHED],
    [ACADEMIC_YEAR_STATUS.PUBLISHED]: [ACADEMIC_YEAR_STATUS.ACTIVE, ACADEMIC_YEAR_STATUS.DRAFT],
    [ACADEMIC_YEAR_STATUS.ACTIVE]: [ACADEMIC_YEAR_STATUS.ARCHIVED],
    [ACADEMIC_YEAR_STATUS.ARCHIVED]: [], // Final state
  },
  score_session: {
    [SCORE_SESSION_STATUS.DRAFT]: [SCORE_SESSION_STATUS.READY],
    [SCORE_SESSION_STATUS.READY]: [SCORE_SESSION_STATUS.FINAL, SCORE_SESSION_STATUS.DRAFT],
    [SCORE_SESSION_STATUS.FINAL]: [SCORE_SESSION_STATUS.LOCKED, SCORE_SESSION_STATUS.READY], // Unlock action returns it to ready
    [SCORE_SESSION_STATUS.LOCKED]: [], // Locked
  },
  report: {
    [REPORT_STATUS.DRAFT]: [REPORT_STATUS.VERIFIED],
    [REPORT_STATUS.VERIFIED]: [REPORT_STATUS.PUBLISHED, REPORT_STATUS.DRAFT],
    [REPORT_STATUS.PUBLISHED]: [REPORT_STATUS.VERIFIED], // Rollback published
  },
  promotion_period: {
    [PROMOTION_PERIOD_STATUS.DRAFT]: [PROMOTION_PERIOD_STATUS.PROCESSING],
    [PROMOTION_PERIOD_STATUS.PROCESSING]: [PROMOTION_PERIOD_STATUS.WAITING_APPROVAL, PROMOTION_PERIOD_STATUS.DRAFT],
    [PROMOTION_PERIOD_STATUS.WAITING_APPROVAL]: [PROMOTION_PERIOD_STATUS.APPROVED, PROMOTION_PERIOD_STATUS.PROCESSING],
    [PROMOTION_PERIOD_STATUS.APPROVED]: [PROMOTION_PERIOD_STATUS.LOCKED],
    [PROMOTION_PERIOD_STATUS.LOCKED]: [],
  },
};

/**
 * Validates if a state transition is allowed within a specific module's workflow.
 */
export function isValidTransition(
  module: 'academic_year' | 'score_session' | 'report' | 'promotion_period',
  currentStatus: string,
  targetStatus: string
): boolean {
  const allowed = TRANSITIONS[module]?.[currentStatus];
  if (!allowed) return false;
  return allowed.includes(targetStatus);
}

/**
 * Returns list of target statuses that can be transitioned to from the current status.
 */
export function getAllowedTransitions(
  module: 'academic_year' | 'score_session' | 'report' | 'promotion_period',
  currentStatus: string
): string[] {
  return TRANSITIONS[module]?.[currentStatus] || [];
}

import { ZodSchema, ZodError, ZodIssue } from 'zod';
import { apiValidationError } from './response';

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errorResponse: Response };

/**
 * Validates request JSON body against a Zod schema.
 * Returns the parsed data or a standard 400 validation error response.
 */
export async function validateBody<T>(
  req: Request,
  schema: ZodSchema<T>
): Promise<ValidationResult<T>> {
  try {
    const body = await req.json();
    const parsed = schema.parse(body);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors: Record<string, string[]> = {};
      error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join('.');
        if (!formattedErrors[path]) {
          formattedErrors[path] = [];
        }
        formattedErrors[path].push(err.message);
      });
      return {
        success: false,
        errorResponse: apiValidationError(formattedErrors),
      };
    }
    return {
      success: false,
      errorResponse: new Response(
        JSON.stringify({ success: false, message: 'Invalid JSON body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }
}

/**
 * Validates search parameters / query strings against a Zod schema.
 */
export function validateQueryParams<T>(
  url: string,
  schema: ZodSchema<T>
): ValidationResult<T> {
  try {
    const { searchParams } = new URL(url);
    const paramsObj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      paramsObj[key] = value;
    });
    
    const parsed = schema.parse(paramsObj);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors: Record<string, string[]> = {};
      error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join('.');
        if (!formattedErrors[path]) {
          formattedErrors[path] = [];
        }
        formattedErrors[path].push(err.message);
      });
      return {
        success: false,
        errorResponse: apiValidationError(formattedErrors),
      };
    }
    return {
      success: false,
      errorResponse: new Response(
        JSON.stringify({ success: false, message: 'Invalid query parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export function apiSuccess<T>(data: T, message = 'Success', status = 200) {
  return Response.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function apiValidationError(
  errors: Record<string, string[]>,
  message = 'Validation Failed'
) {
  return Response.json(
    {
      success: false,
      message,
      errors,
    },
    { status: 400 }
  );
}

export function apiError(message = 'Internal Server Error', status = 500) {
  return Response.json(
    {
      success: false,
      message,
    },
    { status }
  );
}

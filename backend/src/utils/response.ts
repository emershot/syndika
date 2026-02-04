import { Response } from 'express';

// ============================================================================
// Standardized API Response Format
// ============================================================================

/**
 * Standard success response format
 */
export interface SuccessResponse<T = any> {
  success: true;
  message?: string;
  data?: T;
  timestamp: string;
}

/**
 * Standard error response format
 */
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// ============================================================================
// Response Helper Functions
// ============================================================================

/**
 * Send a standardized success response
 *
 * @example
 * sendSuccess(res, { user: userData }, 201, 'User created successfully');
 */
export function sendSuccess<T = any>(
  res: Response,
  data?: T,
  statusCode: number = 200,
  message?: string
): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  } as SuccessResponse<T>);
}

/**
 * Send a standardized error response
 *
 * @example
 * sendError(res, { code: 'INVALID_INPUT', message: 'Email is required' }, 400);
 */
export function sendError(
  res: Response,
  error: {
    code: string;
    message: string;
    details?: any;
  },
  statusCode: number = 400
): Response {
  return res.status(statusCode).json({
    success: false,
    error,
    timestamp: new Date().toISOString(),
  } as ErrorResponse);
}

/**
 * Send paginated response
 */
export function sendPaginated<T = any>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  statusCode: number = 200,
  message?: string
): Response {
  const pages = Math.ceil(total / limit);

  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      pages,
      hasMore: page < pages,
    },
    timestamp: new Date().toISOString(),
  });
}

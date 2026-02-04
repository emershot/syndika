import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { sendError } from './response';

// ============================================================================
// Zod Schemas for Input Validation
// ============================================================================

/**
 * Auth Schemas
 */
export const authSchemas = {
  register: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one digit'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(255),
    tenantSlug: z.string().min(1, 'Tenant slug is required'),
    unit_number: z.string().optional().nullable(),
  }),

  login: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
    tenantSlug: z.string().min(1, 'Tenant slug is required'),
  }),
};

/**
 * Ticket Schemas
 */
export const ticketSchemas = {
  create: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(255),
    description: z.string().optional().nullable(),
    category: z.enum(['maintenance', 'complaint', 'request', 'emergency', 'other']).optional(),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  }),

  update: z.object({
    title: z.string().min(5).max(255).optional(),
    description: z.string().optional().nullable(),
    category: z.enum(['maintenance', 'complaint', 'request', 'emergency', 'other']).optional(),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
    status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
    assigned_to: z.string().uuid().optional().nullable(),
  }),
};

/**
 * Reservation Schemas
 */
export const reservationSchemas = {
  create: z.object({
    area_name: z.string().min(1, 'Area name is required'),
    reserved_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
    start_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Time must be HH:MM:SS format'),
    end_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Time must be HH:MM:SS format'),
    reason: z.string().optional().nullable(),
  }).refine(
    (data) => data.start_time < data.end_time,
    {
      message: 'Start time must be before end time',
      path: ['end_time'],
    }
  ),
};

/**
 * Announcement Schemas
 */
export const announcementSchemas = {
  create: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(255),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
    expires_at: z.string().datetime().optional().nullable(),
  }),
};

// ============================================================================
// Validation Middleware Factory
// ============================================================================

/**
 * Create a validation middleware for request body
 *
 * @example
 * router.post('/tickets', validateRequest(ticketSchemas.create), handler);
 */
export function validateRequest<T extends z.ZodSchema>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        sendError(
          res,
          {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request body',
            details: formattedErrors,
          },
          400
        );
      } else {
        sendError(
          res,
          {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
          },
          400
        );
      }
    }
  };
}

/**
 * Validate query parameters
 *
 * @example
 * router.get('/tickets', validateQuery(z.object({ page: z.coerce.number().optional() })), handler);
 */
export function validateQuery<T extends z.ZodSchema>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        sendError(
          res,
          {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: formattedErrors,
          },
          400
        );
      } else {
        sendError(
          res,
          {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
          },
          400
        );
      }
    }
  };
}

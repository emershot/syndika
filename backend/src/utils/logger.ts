import { Request, Response, NextFunction } from 'express';

// ============================================================================
// Structured Logger
// ============================================================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production';

  /**
   * Log message with structured context
   */
  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(context && { context }),
    };

    // In production, output as JSON for log aggregation services
    // In development, output pretty-printed
    if (this.isDevelopment) {
      console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, context || '');
    } else {
      console.log(JSON.stringify(logEntry));
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext | Error): void {
    if (context instanceof Error) {
      this.log('error', message, {
        error: context.message,
        stack: this.isDevelopment ? context.stack : undefined,
      });
    } else {
      this.log('error', message, context);
    }
  }
}

export const logger = new Logger();

// ============================================================================
// Request Logger Middleware
// ============================================================================

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = Date.now();
  const requestId = req.headers['x-request-id'] || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Attach requestId to request for logging in route handlers
  (req as any).requestId = requestId;

  // Log incoming request
  logger.debug(`Incoming request`, {
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
  });

  // Override res.json to log response
  const originalJson = res.json.bind(res);
  res.json = function (body: any) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Log response
    logger.debug(`Response sent`, {
      requestId,
      method: req.method,
      path: req.path,
      statusCode,
      duration: `${duration}ms`,
    });

    return originalJson(body);
  };

  next();
}

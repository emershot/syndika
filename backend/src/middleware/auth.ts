import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload, AuthenticatedRequest, UserRole } from '../types/index';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// ============================================================================
// JWT Token Creation
// ============================================================================

export function generateToken(
  userId: string,
  tenantId: string,
  email: string,
  role: UserRole,
  expiresIn: string = '24h'
): string {
  const payload: JWTPayload = {
    userId,
    tenantId,
    email,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: 0, // Will be set by jwt.sign
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

// ============================================================================
// JWT Token Verification
// ============================================================================

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('[JWT] Token verification failed:', error);
    return null;
  }
}

// ============================================================================
// Middleware: Authentication (verifies JWT)
// ============================================================================

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'Authorization token not provided',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      tenantId: decoded.tenantId,
      email: decoded.email,
      role: decoded.role as UserRole,
    };

    next();
  } catch (error) {
    console.error('[AUTH] Middleware error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Authentication error',
      },
      timestamp: new Date().toISOString(),
    });
  }
}

// ============================================================================
// Middleware: Tenant Check (verifies user belongs to tenant)
// ============================================================================

export function tenantCheckMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'NO_AUTH',
          message: 'User not authenticated',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Get tenant slug from URL params
    const tenantSlug = req.params.tenantSlug;
    if (!tenantSlug) {
      res.status(400).json({
        success: false,
        error: {
          code: 'NO_TENANT_PARAM',
          message: 'Tenant slug not provided in URL',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // In a real app, you'd look up tenant by slug and verify user belongs to it
    // For now, we'll just attach the tenantSlug to request
    (req as any).tenantSlug = tenantSlug;

    next();
  } catch (error) {
    console.error('[TENANT_CHECK] Middleware error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'TENANT_CHECK_ERROR',
        message: 'Tenant check failed',
      },
      timestamp: new Date().toISOString(),
    });
  }
}

// ============================================================================
// Middleware: Role Check (verifies user has required role)
// ============================================================================

export function roleCheckMiddleware(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'NO_AUTH',
            message: 'User not authenticated',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: `This action requires one of these roles: ${allowedRoles.join(', ')}`,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      next();
    } catch (error) {
      console.error('[ROLE_CHECK] Middleware error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'ROLE_CHECK_ERROR',
          message: 'Role check failed',
        },
        timestamp: new Date().toISOString(),
      });
    }
  };
}

// ============================================================================
// Middleware: Error Handler (for async routes)
// ============================================================================

export function asyncHandler(
  fn: (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => Promise<void>
) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

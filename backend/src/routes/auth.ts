import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest, AuthRequest, RegisterRequest } from '../types/index';
import { generateToken, asyncHandler, authMiddleware } from '../middleware/auth';
import * as db from '../config/database';

const router = Router();

// ============================================================================
// POST /api/auth/register - Create new user in tenant
// ============================================================================

router.post(
  '/register',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { email, password, name, unit_number, tenantSlug } = req.body as RegisterRequest & { tenantSlug: string };

    // Validate input
    if (!email || !password || !name || !tenantSlug) {
      res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Missing required fields: email, password, name, tenantSlug',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        error: {
          code: 'WEAK_PASSWORD',
          message: 'Password must be at least 6 characters',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      // Get tenant by slug
      const tenant = await db.getOne(
        'SELECT id FROM tenants WHERE slug = $1',
        [tenantSlug]
      );

      if (!tenant) {
        res.status(404).json({
          success: false,
          error: {
            code: 'TENANT_NOT_FOUND',
            message: `Tenant with slug "${tenantSlug}" not found`,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const tenantId = tenant.id;

      // Check if user already exists in this tenant
      const existingUser = await db.getOne(
        'SELECT id FROM users WHERE tenant_id = $1 AND email = $2',
        [tenantId, email]
      );

      if (existingUser) {
        res.status(409).json({
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'User with this email already exists in this tenant',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const userId = uuidv4();
      await db.query(
        `INSERT INTO users (id, tenant_id, name, email, password_hash, role, unit_number, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [userId, tenantId, name, email, passwordHash, 'resident', unit_number || null, true]
      );

      // Generate JWT token
      const token = generateToken(userId, tenantId, email, 'resident');

      // Log activity
      await db.query(
        `INSERT INTO activity_log (id, tenant_id, user_id, action, entity_type, entity_id, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [uuidv4(), tenantId, userId, 'USER_CREATED', 'user', userId, `User registered: ${email}`]
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          token,
          user: {
            id: userId,
            name,
            email,
            role: 'resident',
            tenantId,
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[AUTH] Register error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'REGISTRATION_ERROR',
          message: 'Failed to register user',
          details: error instanceof Error ? error.message : undefined,
        },
        timestamp: new Date().toISOString(),
      });
    }
  })
);

// ============================================================================
// POST /api/auth/login - Login with email/password
// ============================================================================

router.post(
  '/login',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { email, password, tenantSlug } = req.body as AuthRequest & { tenantSlug: string };

    // Validate input
    if (!email || !password || !tenantSlug) {
      res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Missing required fields: email, password, tenantSlug',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      // Get tenant by slug
      const tenant = await db.getOne(
        'SELECT id FROM tenants WHERE slug = $1',
        [tenantSlug]
      );

      if (!tenant) {
        res.status(404).json({
          success: false,
          error: {
            code: 'TENANT_NOT_FOUND',
            message: `Tenant with slug "${tenantSlug}" not found`,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const tenantId = tenant.id;

      // Get user from this tenant
      const user = await db.getOne(
        'SELECT id, name, email, password_hash, role, is_active FROM users WHERE tenant_id = $1 AND email = $2',
        [tenantId, email]
      );

      if (!user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (!user.is_active) {
        res.status(403).json({
          success: false,
          error: {
            code: 'USER_INACTIVE',
            message: 'User account is inactive',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Generate JWT token
      const token = generateToken(user.id, tenantId, email, user.role);

      // Update last_login
      await db.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      // Log activity
      await db.query(
        `INSERT INTO activity_log (id, tenant_id, user_id, action, entity_type, description)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [uuidv4(), tenantId, user.id, 'USER_LOGIN', 'user', `User logged in: ${email}`]
      );

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            tenantId,
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[AUTH] Login error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'LOGIN_ERROR',
          message: 'Failed to login',
          details: error instanceof Error ? error.message : undefined,
        },
        timestamp: new Date().toISOString(),
      });
    }
  })
);

// ============================================================================
// GET /api/auth/me - Get current user info (requires authentication)
// ============================================================================

router.get(
  '/me',
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
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

      const user = await db.getOne(
        `SELECT id, name, email, role, unit_number, phone, is_active, created_at
         FROM users WHERE id = $1`,
        [req.user.userId]
      );

      if (!user) {
        res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[AUTH] Get user error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'GET_USER_ERROR',
          message: 'Failed to get user info',
        },
        timestamp: new Date().toISOString(),
      });
    }
  })
);

export default router;

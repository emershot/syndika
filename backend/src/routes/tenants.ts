import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest, CreateTicketRequest, UpdateTicketRequest } from '../types/index';
import { authMiddleware, tenantCheckMiddleware, asyncHandler, roleCheckMiddleware } from '../middleware/auth';
import * as db from '../config/database';

const router = Router();

// ============================================================================
// GET /api/tenants/:tenantSlug/users - List users in tenant
// ============================================================================

router.get(
  '/:tenantSlug/users',
  authMiddleware,
  tenantCheckMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantSlug = req.params.tenantSlug;
      const { page = 1, limit = 50 } = req.query;

      // Get tenant
      const tenant = await db.getOne(
        'SELECT id FROM tenants WHERE slug = $1',
        [tenantSlug]
      );

      if (!tenant) {
        res.status(404).json({
          success: false,
          error: {
            code: 'TENANT_NOT_FOUND',
            message: 'Tenant not found',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Verify user belongs to this tenant
      if (req.user?.tenantId !== tenant.id) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have access to this tenant',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const offset = ((page as number) - 1) * (limit as number);

      // Get users
      const users = await db.getAll(
        `SELECT id, name, email, role, unit_number, phone, is_active, created_at
         FROM users WHERE tenant_id = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [tenant.id, limit, offset]
      );

      // Get total count
      const countResult = await db.getOne(
        'SELECT COUNT(*) as total FROM users WHERE tenant_id = $1',
        [tenant.id]
      );

      res.status(200).json({
        success: true,
        data: {
          users,
          pagination: {
            total: countResult.total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(countResult.total / (limit as number)),
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[TENANTS] List users error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'LIST_USERS_ERROR',
          message: 'Failed to list users',
        },
        timestamp: new Date().toISOString(),
      });
    }
  })
);

// ============================================================================
// POST /api/tenants/:tenantSlug/tickets - Create ticket
// ============================================================================

router.post(
  '/:tenantSlug/tickets',
  authMiddleware,
  tenantCheckMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantSlug = req.params.tenantSlug;
      const { title, description, category, priority } = req.body as CreateTicketRequest;

      // Validate input
      if (!title) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Title is required',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

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

      // Get tenant
      const tenant = await db.getOne(
        'SELECT id FROM tenants WHERE slug = $1',
        [tenantSlug]
      );

      if (!tenant) {
        res.status(404).json({
          success: false,
          error: {
            code: 'TENANT_NOT_FOUND',
            message: 'Tenant not found',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Verify user belongs to this tenant
      if (req.user.tenantId !== tenant.id) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have access to this tenant',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Create ticket
      const ticketId = uuidv4();
      await db.query(
        `INSERT INTO tickets (id, tenant_id, title, description, category, priority, status, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          ticketId,
          tenant.id,
          title,
          description || null,
          category || 'other',
          priority || 'normal',
          'open',
          req.user.userId,
        ]
      );

      // Get created ticket
      const ticket = await db.getOne(
        'SELECT * FROM tickets WHERE id = $1',
        [ticketId]
      );

      // Log activity
      await db.query(
        `INSERT INTO activity_log (id, tenant_id, user_id, action, entity_type, entity_id, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [uuidv4(), tenant.id, req.user.userId, 'TICKET_CREATED', 'ticket', ticketId, `Ticket created: ${title}`]
      );

      res.status(201).json({
        success: true,
        message: 'Ticket created successfully',
        data: ticket,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[TENANTS] Create ticket error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_TICKET_ERROR',
          message: 'Failed to create ticket',
        },
        timestamp: new Date().toISOString(),
      });
    }
  })
);

// ============================================================================
// GET /api/tenants/:tenantSlug/tickets - List tickets
// ============================================================================

router.get(
  '/:tenantSlug/tickets',
  authMiddleware,
  tenantCheckMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tenantSlug = req.params.tenantSlug;
      const { page = 1, limit = 50, status, priority } = req.query;

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

      // Get tenant
      const tenant = await db.getOne(
        'SELECT id FROM tenants WHERE slug = $1',
        [tenantSlug]
      );

      if (!tenant) {
        res.status(404).json({
          success: false,
          error: {
            code: 'TENANT_NOT_FOUND',
            message: 'Tenant not found',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Verify user belongs to this tenant
      if (req.user.tenantId !== tenant.id) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have access to this tenant',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const offset = ((page as number) - 1) * (limit as number);

      // Build query
      let whereClause = 'WHERE t.tenant_id = $1';
      const params: any[] = [tenant.id];

      if (status) {
        whereClause += ` AND t.status = $${params.length + 1}`;
        params.push(status);
      }

      if (priority) {
        whereClause += ` AND t.priority = $${params.length + 1}`;
        params.push(priority);
      }

      // Get tickets with user info
      const tickets = await db.getAll(
        `SELECT t.*, 
                u_creator.name as creator_name, u_creator.email as creator_email,
                u_assigned.name as assignee_name
         FROM tickets t
         LEFT JOIN users u_creator ON t.created_by = u_creator.id
         LEFT JOIN users u_assigned ON t.assigned_to = u_assigned.id
         ${whereClause}
         ORDER BY t.created_at DESC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, limit, offset]
      );

      // Get total count
      const countResult = await db.getOne(
        `SELECT COUNT(*) as total FROM tickets t ${whereClause}`,
        params
      );

      res.status(200).json({
        success: true,
        data: {
          tickets,
          pagination: {
            total: countResult.total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(countResult.total / (limit as number)),
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[TENANTS] List tickets error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'LIST_TICKETS_ERROR',
          message: 'Failed to list tickets',
        },
        timestamp: new Date().toISOString(),
      });
    }
  })
);

// ============================================================================
// GET /api/tenants/:tenantSlug/tickets/:ticketId - Get single ticket
// ============================================================================

router.get(
  '/:tenantSlug/tickets/:ticketId',
  authMiddleware,
  tenantCheckMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { tenantSlug, ticketId } = req.params;

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

      // Get tenant
      const tenant = await db.getOne(
        'SELECT id FROM tenants WHERE slug = $1',
        [tenantSlug]
      );

      if (!tenant) {
        res.status(404).json({
          success: false,
          error: {
            code: 'TENANT_NOT_FOUND',
            message: 'Tenant not found',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Verify user belongs to this tenant
      if (req.user.tenantId !== tenant.id) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have access to this tenant',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Get ticket
      const ticket = await db.getOne(
        'SELECT * FROM tickets WHERE id = $1 AND tenant_id = $2',
        [ticketId, tenant.id]
      );

      if (!ticket) {
        res.status(404).json({
          success: false,
          error: {
            code: 'TICKET_NOT_FOUND',
            message: 'Ticket not found',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: ticket,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[TENANTS] Get ticket error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'GET_TICKET_ERROR',
          message: 'Failed to get ticket',
        },
        timestamp: new Date().toISOString(),
      });
    }
  })
);

export default router;

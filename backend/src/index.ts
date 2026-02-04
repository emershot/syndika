import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import tenantRoutes from './routes/tenants';
import { testConnection } from './config/database';
import { logger, requestLogger } from './utils/logger';
import { sendError } from './utils/response';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================================================
// Environment Validation - CRITICAL
// ============================================================================

const requiredEnvVars = ['JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  logger.error(`Missing critical environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// ============================================================================
// Security Middleware
// ============================================================================

// Helmet: Set security HTTP headers
app.use(helmet());

// Rate Limiting - Global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate Limiting - Auth endpoints (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login/register attempts
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true, // Don't count successful requests
});

app.use(globalLimiter);

// ============================================================================
// CORS Configuration
// ============================================================================

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// ============================================================================
// Body Parser Middleware
// ============================================================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================================================
// Request Logging & Tracing
// ============================================================================

app.use(requestLogger);

// ============================================================================
// Routes
// ============================================================================

// GET /health - Health Check Endpoint
app.get('/health', async (_req: Request, res: Response) => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      res.status(503).json({
        status: 'degraded',
        service: 'syndika-api',
        version: '2.0.0',
        environment: NODE_ENV,
        message: 'Database connection failed',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(200).json({
      status: 'ok',
      service: 'syndika-api',
      version: '2.0.0',
      environment: NODE_ENV,
      features: ['multi-tenant', 'jwt-auth', 'postgresql'],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      service: 'syndika-api',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
});

// GET / - Root Endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to SYNDIKA API',
    version: '2.0.0',
    description: 'Multi-tenant SaaS API for Condominium Management',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      tenants: '/api/tenants',
      api_v1: '/api/v1',
    },
    docs: '/docs',
  });
});

// GET /api/v1 - API v1 Base
app.get('/api/v1', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'SYNDIKA API v1',
    modules: {
      auth: '/api/auth',
      tenants: '/api/tenants/:tenantSlug',
    },
  });
});

// ============================================================================
// Route Handlers
// ============================================================================

// Authentication Routes (with stricter rate limiting)
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth', authRoutes);

// Tenant Routes
app.use('/api/tenants', tenantRoutes);

// ============================================================================
// 404 Handler
// ============================================================================

app.use((req: Request, res: Response) => {
  sendError(res, {
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
  }, 404);
});

// ============================================================================
// Error Handling Middleware
// ============================================================================

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error:', {
    message: err.message,
    stack: NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  const statusCode = (err as any).statusCode || 500;
  const code = (err as any).code || 'INTERNAL_SERVER_ERROR';
  const message = NODE_ENV === 'development' ? err.message : 'Internal server error';

  sendError(res, { code, message }, statusCode);
});

// ============================================================================
// Server Startup
// ============================================================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║  🚀 SYNDIKA API v2.0.0 (Multi-Tenant)                ║
║                                                        ║
║  Server:  http://localhost:${PORT}                       ║
║  Health:  http://localhost:${PORT}/health               ║
║  Status:  ${NODE_ENV.toUpperCase()}                           ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});

export default app;

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import tenantRoutes from './routes/tenants';
import { testConnection } from './config/database';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================================================
// CORS Configuration
// ============================================================================

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// ============================================================================
// Body Parser Middleware
// ============================================================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================================================
// Request Logging
// ============================================================================

app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// Routes
// ============================================================================

// GET /health - Health Check Endpoint
app.get('/health', async (req: Request, res: Response) => {
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
app.get('/', (req: Request, res: Response) => {
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
app.get('/api/v1', (req: Request, res: Response) => {
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

// Authentication Routes
app.use('/api/auth', authRoutes);

// Tenant Routes
app.use('/api/tenants', tenantRoutes);

// ============================================================================
// 404 Handler
// ============================================================================

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    statusCode: 404,
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// Error Handling Middleware
// ============================================================================

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERROR]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: NODE_ENV === 'development' ? err.message : 'Something went wrong',
    statusCode: 500,
    timestamp: new Date().toISOString(),
  });
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

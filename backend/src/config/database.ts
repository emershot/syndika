import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// ============================================================================
// Database Pool Configuration
// ============================================================================

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// ============================================================================
// Event Listeners
// ============================================================================

pool.on('connect', () => {
  console.log('[DB] Connection established');
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client', err);
});

// ============================================================================
// Query Execution Functions
// ============================================================================

/**
 * Execute a single query
 */
export async function query(sql: string, params?: any[]) {
  const start = Date.now();
  try {
    const result = await pool.query(sql, params);
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.log(`[DB] Executed query (${duration}ms)`, sql);
    }
    return result;
  } catch (error) {
    console.error('[DB] Query error:', error);
    throw error;
  }
}

/**
 * Get a single row from query
 */
export async function getOne(sql: string, params?: any[]) {
  const result = await query(sql, params);
  return result.rows[0] || null;
}

/**
 * Get multiple rows from query
 */
export async function getAll(sql: string, params?: any[]) {
  const result = await query(sql, params);
  return result.rows;
}

/**
 * Execute insert/update/delete
 */
export async function execute(sql: string, params?: any[]) {
  const result = await query(sql, params);
  return result.rowCount || 0;
}

/**
 * Get a client from pool for transactions
 */
export async function getClient(): Promise<PoolClient> {
  const client = await pool.connect();
  return client;
}

/**
 * Initialize database with schema
 */
export async function initializeDatabase() {
  console.log('[DB] Initializing database...');
  
  try {
    // Read schema.sql
    const schemaPath = path.join(__dirname, '../../db/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    await query(schemaSql);
    
    console.log('[DB] ✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('[DB] ❌ Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Truncate all tables (for testing/resetting)
 */
export async function truncateAllTables() {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    
    const tables = [
      'activity_log',
      'announcements',
      'reservations',
      'tickets',
      'users',
      'tenants',
    ];
    
    for (const table of tables) {
      await client.query(`TRUNCATE TABLE ${table} CASCADE`);
    }
    
    await client.query('COMMIT');
    console.log('[DB] ✅ All tables truncated');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[DB] ❌ Failed to truncate tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Test database connection
 */
export async function testConnection() {
  try {
    const result = await query('SELECT NOW()');
    console.log('[DB] ✅ Connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('[DB] ❌ Connection test failed:', error);
    return false;
  }
}

/**
 * Close pool connection
 */
export async function closePool() {
  try {
    await pool.end();
    console.log('[DB] ✅ Connection pool closed');
  } catch (error) {
    console.error('[DB] ❌ Failed to close pool:', error);
  }
}

// ============================================================================
// Export pool for direct access if needed
// ============================================================================

export { pool };

// ============================================================================
// Health check function
// ============================================================================

export async function getPoolStats() {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
  };
}

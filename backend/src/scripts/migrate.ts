import { initializeDatabase, testConnection, closePool } from '../config/database';

// ============================================================================
// Migration Script: Initialize Database Schema
// ============================================================================

async function migrate() {
  try {
    console.log('\n📦 Starting database migration...\n');

    // Test connection
    console.log('1️⃣  Testing database connection...');
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }

    // Initialize database (run schema.sql)
    console.log('\n2️⃣  Initializing database schema...');
    await initializeDatabase();

    console.log('\n✅ Migration completed successfully!\n');
    console.log('📊 Tables created:');
    console.log('   - tenants');
    console.log('   - users');
    console.log('   - tickets');
    console.log('   - reservations');
    console.log('   - announcements');
    console.log('   - activity_log\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await closePool();
  }
}

// Run migration
migrate();

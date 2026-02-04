import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import * as db from '../config/database';

// ============================================================================
// Seed Script: Populate Database with Mock Data
// ============================================================================

async function seed() {
  try {
    console.log('\n🌱 Starting database seeding...\n');

    // 1. Truncate tables
    console.log('1️⃣  Clearing existing data...');
    await db.truncateAllTables();

    // 2. Create tenants
    console.log('\n2️⃣  Creating tenants...');
    const tenant1Id = uuidv4();
    const tenant2Id = uuidv4();

    await db.query(
      `INSERT INTO tenants (id, name, slug, description) 
       VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)`,
      [
        tenant1Id,
        'Condomínio Esperança',
        'esperanca',
        'Edifício residencial na zona norte',
        tenant2Id,
        'Condomínio Fênix',
        'fenix',
        'Edifício residencial na zona sul',
      ]
    );

    console.log(`   ✅ Created 2 tenants`);

    // 3. Create users for tenant 1
    console.log('\n3️⃣  Creating users for Condomínio Esperança...');
    const user1Id = uuidv4();
    const user2Id = uuidv4();
    const user3Id = uuidv4();

    const passwordHash1 = await bcrypt.hash('senha123', 10);
    const passwordHash2 = await bcrypt.hash('senha456', 10);
    const passwordHash3 = await bcrypt.hash('senha789', 10);

    await db.query(
      `INSERT INTO users (id, tenant_id, name, email, password_hash, role, unit_number, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8),
              ($9, $10, $11, $12, $13, $14, $15, $16),
              ($17, $18, $19, $20, $21, $22, $23, $24)`,
      [
        user1Id,
        tenant1Id,
        'Síndico João Silva',
        'sindico@esperanca.com',
        passwordHash1,
        'admin',
        '101',
        true,
        user2Id,
        tenant1Id,
        'Gerente Carlos Oliveira',
        'gerente@esperanca.com',
        passwordHash2,
        'manager',
        '102',
        true,
        user3Id,
        tenant1Id,
        'Residente Maria Santos',
        'maria@esperanca.com',
        passwordHash3,
        'resident',
        '103',
        true,
      ]
    );

    console.log(`   ✅ Created 3 users (1 admin, 1 manager, 1 resident)`);

    // 4. Create tickets for tenant 1
    console.log('\n4️⃣  Creating tickets...');
    const tickets = [];
    const statuses = ['open', 'in_progress', 'resolved'];
    const categories = ['maintenance', 'complaint', 'request'];
    const priorities = ['low', 'normal', 'high'];

    for (let i = 1; i <= 5; i++) {
      const ticketId = uuidv4();
      const status = statuses[i % statuses.length];
      const category = categories[i % categories.length];
      const priority = priorities[i % priorities.length];

      await db.query(
        `INSERT INTO tickets (id, tenant_id, title, description, category, priority, status, created_by, assigned_to)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          ticketId,
          tenant1Id,
          `Chamado #${i}`,
          `Descrição do chamado ${i}`,
          category,
          priority,
          status,
          user3Id, // Created by resident
          status === 'open' ? null : user2Id, // Assigned to manager if not open
        ]
      );

      tickets.push(ticketId);
    }

    console.log(`   ✅ Created 5 tickets with different statuses`);

    // 5. Create announcements
    console.log('\n5️⃣  Creating announcements...');
    for (let i = 1; i <= 3; i++) {
      const announcementId = uuidv4();
      await db.query(
        `INSERT INTO announcements (id, tenant_id, title, content, author_id, priority, is_active, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          announcementId,
          tenant1Id,
          `Aviso ${i}`,
          `Conteúdo do aviso ${i}. Este é um comunicado importante para todos os residentes.`,
          user1Id,
          i === 1 ? 'urgent' : i === 2 ? 'high' : 'normal',
          true,
          new Date(),
        ]
      );
    }

    console.log(`   ✅ Created 3 announcements`);

    // 6. Create activity log entries
    console.log('\n6️⃣  Logging activity...');
    for (let i = 0; i < 5; i++) {
      await db.query(
        `INSERT INTO activity_log (id, tenant_id, user_id, action, entity_type, entity_id, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          uuidv4(),
          tenant1Id,
          user1Id,
          'SEED_DATA',
          'seed',
          uuidv4(),
          `Seed data entry ${i + 1}`,
        ]
      );
    }

    console.log(`   ✅ Created activity log entries`);

    // 7. Print summary
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ SEEDING COMPLETED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('📊 MOCK DATA CREATED:');
    console.log(`   • 2 Tenants`);
    console.log(`   • 3 Users (in Tenant 1: "esperanca")`);
    console.log(`   • 5 Tickets (various statuses and priorities)`);
    console.log(`   • 3 Announcements`);
    console.log(`   • 5 Activity Log entries\n`);

    console.log('🔑 CREDENCIAIS DE TESTE (Tenant: "esperanca"):\n');
    console.log('   Admin (Síndico):');
    console.log('   • Email: sindico@esperanca.com');
    console.log('   • Password: senha123\n');

    console.log('   Manager (Gerente):');
    console.log('   • Email: gerente@esperanca.com');
    console.log('   • Password: senha456\n');

    console.log('   Resident (Residente):');
    console.log('   • Email: maria@esperanca.com');
    console.log('   • Password: senha789\n');

    console.log('═══════════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await db.closePool();
  }
}

// Run seed
seed();

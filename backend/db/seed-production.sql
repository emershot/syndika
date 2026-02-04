-- ============================================================
-- SYNDIKA - Production Seed Data
-- Tenant demo + usuário admin para validação
-- ============================================================

-- Limpar dados existentes (apenas em fresh install)
-- TRUNCATE TABLE activity_log, announcements, reservations, tickets, users, tenants CASCADE;

-- ============================================================
-- 1. TENANT DEMO
-- ============================================================

INSERT INTO tenants (id, name, slug, created_at)
VALUES (
  'demo-tenant-001',
  'Condomínio Demo',
  'demo',
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 2. USUÁRIO ADMIN DEMO
-- ============================================================

-- Senha: demo123
-- Hash gerado com: bcrypt.hash('demo123', 10)
INSERT INTO users (
  id, 
  tenant_id, 
  email, 
  password_hash, 
  name, 
  role, 
  unit_number,
  phone,
  is_active,
  created_at
)
VALUES (
  'demo-user-001',
  'demo-tenant-001',
  'admin@demo.com',
  '$2a$10$EixZaYVK1fsbw1ZfbX3OXe.DWGnZnI7aAqMJFLZTJBQWKPy7nqLqG', -- demo123
  'Admin Demo',
  'admin',
  '101',
  '(11) 99999-9999',
  true,
  NOW()
)
ON CONFLICT (email, tenant_id) DO NOTHING;

-- ============================================================
-- 3. USUÁRIO GERENTE DEMO
-- ============================================================

-- Senha: gerente123
INSERT INTO users (
  id, 
  tenant_id, 
  email, 
  password_hash, 
  name, 
  role, 
  unit_number,
  phone,
  is_active,
  created_at
)
VALUES (
  'demo-user-002',
  'demo-tenant-001',
  'gerente@demo.com',
  '$2a$10$N9qo8uLOickgx2ZtQBFqb.AMbQQqH3cKfIXFqBqFJvhQZfFqHJRgW', -- gerente123
  'Gerente Demo',
  'manager',
  '102',
  '(11) 98888-8888',
  true,
  NOW()
)
ON CONFLICT (email, tenant_id) DO NOTHING;

-- ============================================================
-- 4. USUÁRIO MORADOR DEMO
-- ============================================================

-- Senha: morador123
INSERT INTO users (
  id, 
  tenant_id, 
  email, 
  password_hash, 
  name, 
  role, 
  unit_number,
  phone,
  is_active,
  created_at
)
VALUES (
  'demo-user-003',
  'demo-tenant-001',
  'morador@demo.com',
  '$2a$10$3euPcmQFCjlcXRrgfRqT1.2KzYNqH3b8LwAYqVPXPwGZuN9YNu7FW', -- morador123
  'Maria Silva',
  'resident',
  '201',
  '(11) 97777-7777',
  true,
  NOW()
)
ON CONFLICT (email, tenant_id) DO NOTHING;

-- ============================================================
-- 5. TICKETS DEMO
-- ============================================================

INSERT INTO tickets (
  id,
  tenant_id,
  title,
  description,
  category,
  priority,
  status,
  created_by,
  created_at,
  updated_at
)
VALUES
  (
    'demo-ticket-001',
    'demo-tenant-001',
    'Vazamento na piscina',
    'Há um vazamento visível próximo ao filtro da piscina.',
    'maintenance',
    'high',
    'open',
    'demo-user-003',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),
  (
    'demo-ticket-002',
    'demo-tenant-001',
    'Lâmpada queimada no corredor',
    'Lâmpada do corredor do 3º andar está queimada.',
    'maintenance',
    'low',
    'in_progress',
    'demo-user-002',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '1 day'
  ),
  (
    'demo-ticket-003',
    'demo-tenant-001',
    'Barulho excessivo à noite',
    'Apartamento 305 com barulho após 22h.',
    'noise',
    'medium',
    'open',
    'demo-user-003',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 6. ANÚNCIOS DEMO
-- ============================================================

INSERT INTO announcements (
  id,
  tenant_id,
  title,
  content,
  type,
  author_id,
  created_at,
  updated_at
)
VALUES
  (
    'demo-announcement-001',
    'demo-tenant-001',
    'Manutenção do elevador',
    'No dia 10/02 haverá manutenção preventiva nos elevadores das 8h às 12h.',
    'important',
    'demo-user-001',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
  ),
  (
    'demo-announcement-002',
    'demo-tenant-001',
    'Assembleia geral',
    'Fica convocada assembleia geral para o dia 15/02 às 19h no salão de festas.',
    'urgent',
    'demo-user-001',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 7. LOGS DE ATIVIDADE
-- ============================================================

INSERT INTO activity_log (
  id,
  tenant_id,
  user_id,
  action,
  entity_type,
  entity_id,
  details,
  created_at
)
VALUES
  (
    'demo-log-001',
    'demo-tenant-001',
    'demo-user-001',
    'create',
    'announcement',
    'demo-announcement-001',
    '{"title": "Manutenção do elevador"}',
    NOW() - INTERVAL '3 days'
  ),
  (
    'demo-log-002',
    'demo-tenant-001',
    'demo-user-003',
    'create',
    'ticket',
    'demo-ticket-001',
    '{"title": "Vazamento na piscina", "priority": "high"}',
    NOW() - INTERVAL '2 days'
  ),
  (
    'demo-log-003',
    'demo-tenant-001',
    'demo-user-002',
    'update',
    'ticket',
    'demo-ticket-002',
    '{"status": "in_progress"}',
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 8. VALIDAÇÃO
-- ============================================================

-- Contar registros criados
SELECT 
  'Tenants' as entity,
  COUNT(*) as count
FROM tenants
WHERE slug = 'demo'

UNION ALL

SELECT 
  'Users' as entity,
  COUNT(*) as count
FROM users
WHERE tenant_id = 'demo-tenant-001'

UNION ALL

SELECT 
  'Tickets' as entity,
  COUNT(*) as count
FROM tickets
WHERE tenant_id = 'demo-tenant-001'

UNION ALL

SELECT 
  'Announcements' as entity,
  COUNT(*) as count
FROM announcements
WHERE tenant_id = 'demo-tenant-001'

UNION ALL

SELECT 
  'Activity Logs' as entity,
  COUNT(*) as count
FROM activity_log
WHERE tenant_id = 'demo-tenant-001';

-- ============================================================
-- RESULTADO ESPERADO:
-- ============================================================
-- Tenants: 1
-- Users: 3 (admin, gerente, morador)
-- Tickets: 3
-- Announcements: 2
-- Activity Logs: 3
-- ============================================================

-- ============================================================
-- CREDENCIAIS PARA TESTES:
-- ============================================================
-- Tenant: demo
--
-- Admin:
--   Email: admin@demo.com
--   Senha: demo123
--
-- Gerente:
--   Email: gerente@demo.com
--   Senha: gerente123
--
-- Morador:
--   Email: morador@demo.com
--   Senha: morador123
-- ============================================================

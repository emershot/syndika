-- =====================================================
-- SYNDIKA PRODUCTION SEED - VERSÃO FINAL CORRIGIDA
-- UUIDs auto-gerados + tenant dinâmico
-- =====================================================

-- 1. LIMPAR DEMO ANTIGO (seguro)
DELETE FROM activity_log WHERE tenant_id IN (SELECT id FROM tenants WHERE slug = 'demo');
DELETE FROM announcements WHERE tenant_id IN (SELECT id FROM tenants WHERE slug = 'demo');
DELETE FROM tickets WHERE tenant_id IN (SELECT id FROM tenants WHERE slug = 'demo');
DELETE FROM reservations WHERE tenant_id IN (SELECT id FROM tenants WHERE slug = 'demo');
DELETE FROM users WHERE tenant_id IN (SELECT id FROM tenants WHERE slug = 'demo');
DELETE FROM tenants WHERE slug = 'demo';

-- 2. CRIAR TENANT DEMO
INSERT INTO tenants (name, slug) 
VALUES ('Condomínio Demo Esperança', 'demo')
ON CONFLICT (slug) DO NOTHING;

-- 3. USERS (2 apenas: admin + morador)
INSERT INTO users (tenant_id, email, password_hash, name, role, unit_number, phone, created_at) VALUES
-- Admin: demo123
((SELECT id FROM tenants WHERE slug = 'demo'), 'admin@demo.com', 
 '$2a$10$EixZaYVK1fsbw1ZfbX3OXe.DWGnZnI7aAqMJFLZTJBQWKPy7nqLqG', 
 'Síndico Carlos', 'admin', '101', '(11) 99999-9999', NOW()),

-- Morador: morador123
((SELECT id FROM tenants WHERE slug = 'demo'), 'morador@demo.com', 
 '$2a$10$3euPcmQFCjlcXRrgfRqT1.2KzYNqH3b8LwAYqVPXPwGZuN9YNu7FW', 
 'Maria Silva', 'resident', '202', '(11) 97777-7777', NOW())
ON CONFLICT (tenant_id, email) DO NOTHING;

-- 4. TICKETS DEMO
INSERT INTO tickets (tenant_id, title, description, category, priority, status, created_by, created_at) VALUES
((SELECT id FROM tenants WHERE slug = 'demo'), 'Vazamento piscina', 'Filtro vazando desde ontem', 'maintenance', 'high', 'open', 
 (SELECT id FROM users WHERE tenant_id IN (SELECT id FROM tenants WHERE slug = 'demo') AND email = 'morador@demo.com'), NOW() - INTERVAL '2 days'),

((SELECT id FROM tenants WHERE slug = 'demo'), 'Lâmpada corredor 3º', 'Queimada ontem', 'maintenance', 'low', 'in_progress', 
 (SELECT id FROM users WHERE tenant_id IN (SELECT id FROM tenants WHERE slug = 'demo') AND email = 'morador@demo.com'), NOW() - INTERVAL '1 day');

-- 5. ANNOUNCEMENTS
INSERT INTO announcements (tenant_id, title, content, author_id, priority, created_at) VALUES
((SELECT id FROM tenants WHERE slug = 'demo'), 'Manutenção elevador 10/02', '8h-12h sem funcionamento', 
 (SELECT id FROM users WHERE email = 'admin@demo.com'), 'important', NOW() - INTERVAL '3 days'),

((SELECT id FROM tenants WHERE slug = 'demo'), 'Assembleia 15/02 19h', 'Salão de festas - convocatória', 
 (SELECT id FROM users WHERE email = 'admin@demo.com'), 'urgent', NOW());

-- 6. VERIFICAÇÃO FINAL
SELECT 
  '✅ SEED EXECUTADO' as status,
  (SELECT COUNT(*) FROM tenants WHERE slug = 'demo') as tenants,
  (SELECT COUNT(*) FROM users WHERE tenant_id IN (SELECT id FROM tenants WHERE slug = 'demo')) as users,
  (SELECT COUNT(*) FROM tickets WHERE tenant_id IN (SELECT id FROM tenants WHERE slug = 'demo')) as tickets,
  (SELECT COUNT(*) FROM announcements WHERE tenant_id IN (SELECT id FROM tenants WHERE slug = 'demo')) as announcements;

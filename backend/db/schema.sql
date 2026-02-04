-- ============================================================================
-- SYNDIKA - PostgreSQL Schema Multi-Tenant
-- ============================================================================
-- Criado: 02/02/2026
-- Versão: 1.0.0
-- ============================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. TABELA: TENANTS (Condomínios)
-- ============================================================================
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_created_at ON tenants(created_at DESC);

-- ============================================================================
-- 2. TABELA: USERS/RESIDENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'resident',
  -- Roles: admin, manager, resident, guest
  unit_number VARCHAR(20),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT uc_users_email_tenant UNIQUE(tenant_id, email)
);

CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_tenant_id_created_at ON users(tenant_id, created_at DESC);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(tenant_id, role);

-- ============================================================================
-- 3. TABELA: TICKETS (Chamados/Solicitações)
-- ============================================================================
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  -- Categories: maintenance, complaint, request, emergency, other
  priority VARCHAR(50) DEFAULT 'normal',
  -- Priorities: low, normal, high, urgent
  status VARCHAR(50) DEFAULT 'open',
  -- Statuses: open, in_progress, resolved, closed
  created_by UUID NOT NULL,
  assigned_to UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  CONSTRAINT fk_tickets_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT fk_tickets_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_tickets_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_tickets_tenant_id ON tickets(tenant_id);
CREATE INDEX idx_tickets_tenant_id_created_at ON tickets(tenant_id, created_at DESC);
CREATE INDEX idx_tickets_tenant_id_status ON tickets(tenant_id, status);
CREATE INDEX idx_tickets_created_by ON tickets(created_by);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);

-- ============================================================================
-- 4. TABELA: RESERVATIONS (Reservas de áreas comuns)
-- ============================================================================
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  area_name VARCHAR(255) NOT NULL,
  -- Areas: salão de festas, churrasqueira, piscina, academia, etc
  reserved_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'confirmed',
  -- Statuses: pending, confirmed, cancelled
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reservations_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT fk_reservations_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_reservations_tenant_id ON reservations(tenant_id);
CREATE INDEX idx_reservations_tenant_id_reserved_date ON reservations(tenant_id, reserved_date);
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_status ON reservations(tenant_id, status);

-- ============================================================================
-- 5. TABELA: ANNOUNCEMENTS (Avisos/Comunicados)
-- ============================================================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID,
  priority VARCHAR(50) DEFAULT 'normal',
  -- Priorities: low, normal, high, urgent
  published_at TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_announcements_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT fk_announcements_author_id FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_announcements_tenant_id ON announcements(tenant_id);
CREATE INDEX idx_announcements_tenant_id_created_at ON announcements(tenant_id, created_at DESC);
CREATE INDEX idx_announcements_is_active ON announcements(tenant_id, is_active);
CREATE INDEX idx_announcements_published_at ON announcements(published_at DESC);

-- ============================================================================
-- 6. TABELA: ACTIVITY_LOG (Auditoria)
-- ============================================================================
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  user_id UUID,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  description TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_activity_log_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT fk_activity_log_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_activity_log_tenant_id ON activity_log(tenant_id);
CREATE INDEX idx_activity_log_tenant_id_created_at ON activity_log(tenant_id, created_at DESC);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);

-- ============================================================================
-- 7. VIEW: ACTIVE_ANNOUNCEMENTS (Avisos ativos)
-- ============================================================================
CREATE OR REPLACE VIEW active_announcements AS
SELECT *
FROM announcements
WHERE is_active = true
  AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
ORDER BY created_at DESC;

-- ============================================================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- ============================================================================
COMMENT ON TABLE tenants IS 'Multi-tenant: cada condomínio é um tenant isolado';
COMMENT ON TABLE users IS 'Usuários/Residentes com isolamento por tenant';
COMMENT ON TABLE tickets IS 'Chamados/Solicitações de manutenção com suporte a atribuição';
COMMENT ON TABLE reservations IS 'Reservas de áreas comuns com controle de horários';
COMMENT ON TABLE announcements IS 'Avisos e comunicados do condomínio';
COMMENT ON TABLE activity_log IS 'Registro de auditoria de todas as ações';

COMMENT ON COLUMN users.role IS 'Roles: admin (full access), manager (gerenciamento), resident (acesso limitado), guest (somente leitura)';
COMMENT ON COLUMN tickets.status IS 'Workflow: open → in_progress → resolved → closed';
COMMENT ON COLUMN reservations.status IS 'Estatuses: pending (aguardando), confirmed (confirmada), cancelled (cancelada)';

-- ============================================================================
-- FIM DO SCHEMA
-- ============================================================================

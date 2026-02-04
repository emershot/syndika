# Instruções para atualizar banco de produção Supabase

## 1. Acesse o Supabase Dashboard
https://supabase.com/dashboard

## 2. Navegue até SQL Editor
Project → SQL Editor

## 3. Execute os comandos abaixo para atualizar o usuário demo:

```sql
-- Atualizar role do usuário admin@demo.com de 'admin' para 'sindico'
UPDATE users 
SET 
  role = 'sindico',
  name = 'Carlos Silva',
  updated_at = NOW()
WHERE 
  email = 'admin@demo.com' 
  AND tenant_id = 'demo-tenant-001';

-- Verificar se foi atualizado
SELECT id, email, name, role, tenant_id 
FROM users 
WHERE email IN ('admin@demo.com', 'morador@demo.com');
```

## 4. Se o tenant 'demo' ou os usuários não existirem, execute:

```sql
-- Criar tenant demo (se não existir)
INSERT INTO tenants (id, name, slug, created_at)
VALUES (
  'demo-tenant-001',
  'Condomínio Demo',
  'demo',
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- Criar usuário síndico (senha: demo123)
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
  '$2a$10$EixZaYVK1fsbw1ZfbX3OXe.DWGnZnI7aAqMJFLZTJBQWKPy7nqLqG',
  'Carlos Silva',
  'sindico',
  '101',
  '(11) 99999-9999',
  true,
  NOW()
)
ON CONFLICT (email, tenant_id) DO UPDATE SET
  role = 'sindico',
  name = 'Carlos Silva',
  password_hash = '$2a$10$EixZaYVK1fsbw1ZfbX3OXe.DWGnZnI7aAqMJFLZTJBQWKPy7nqLqG';

-- Criar usuário morador (senha: morador123)
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
  '$2a$10$3euPcmQFCjlcXRrgfRqT1.2KzYNqH3b8LwAYqVPXPwGZuN9YNu7FW',
  'Maria Silva',
  'resident',
  '201',
  '(11) 97777-7777',
  true,
  NOW()
)
ON CONFLICT (email, tenant_id) DO UPDATE SET
  password_hash = '$2a$10$3euPcmQFCjlcXRrgfRqT1.2KzYNqH3b8LwAYqVPXPwGZuN9YNu7FW';
```

## 5. Após executar, teste as credenciais:

### Síndico:
- Email: `admin@demo.com`
- Senha: `demo123`
- Tenant: `demo`

### Morador:
- Email: `morador@demo.com`
- Senha: `morador123`
- Tenant: `demo`

## Status atual:
- ✅ Frontend atualizado (tenant: 'demo')
- ✅ Vercel deploy: em progresso
- ✅ Render backend: rodando com CORS correto
- ⏳ Banco Supabase: **PRECISA EXECUTAR OS COMANDOS ACIMA**

# 🧪 TESTES - SYNDIKA API v2.0

**Data:** 02/02/2026  
**API Version:** 2.0.0  
**Status:** Multi-Tenant com PostgreSQL

---

## 📋 Índice de Testes

1. [Setup Inicial](#setup-inicial)
2. [Testes de Saúde](#testes-de-saúde)
3. [Testes de Autenticação](#testes-de-autenticação)
4. [Testes de Tenants & Usuarios](#testes-de-tenants--usuarios)
5. [Testes de Tickets](#testes-de-tickets)
6. [Exemplo de Fluxo Completo](#exemplo-de-fluxo-completo)

---

## Setup Inicial

### 1. Criar arquivo `.env` (cópia do `.env.example`)

```bash
# Windows PowerShell
cp .env.example .env
```

Editar `.env` com seus valores:

```env
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=syndika_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=your-super-secret-key-12345
JWT_EXPIRES_IN=24h
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Criar banco de dados PostgreSQL

```sql
-- No PostgreSQL (usando psql ou DBeaver)
CREATE DATABASE syndika_db;
```

### 4. Executar migration (criar schema)

```bash
npm run db:migrate
```

**Esperado:**
```
✅ Migration completed successfully!

📊 Tables created:
   - tenants
   - users
   - tickets
   - reservations
   - announcements
   - activity_log
```

### 5. Popular com dados mock

```bash
npm run db:seed
```

**Esperado:**
```
✅ SEEDING COMPLETED SUCCESSFULLY!

📊 MOCK DATA CREATED:
   • 2 Tenants
   • 3 Users (in Tenant 1: "esperanca")
   • 5 Tickets (various statuses)
   • 3 Announcements
   • 5 Activity Log entries

🔑 CREDENCIAIS DE TESTE:
   Admin: sindico@esperanca.com / senha123
   Manager: gerente@esperanca.com / senha456
   Resident: maria@esperanca.com / senha789
```

### 6. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

**Esperado:**
```
╔════════════════════════════════════════════════════════╗
║                                                        ║
║  🚀 SYNDIKA API v2.0.0 (Multi-Tenant)                ║
║                                                        ║
║  Server:  http://localhost:4000                       ║
║  Health:  http://localhost:4000/health               ║
║  Status:  DEVELOPMENT                                ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

## 🏥 Testes de Saúde

### GET /health - Verificar saúde do servidor

```bash
# curl
curl http://localhost:4000/health

# ou PowerShell
Invoke-WebRequest -Uri http://localhost:4000/health | ConvertTo-Json
```

**Resposta esperada (200 OK):**
```json
{
  "status": "ok",
  "service": "syndika-api",
  "version": "2.0.0",
  "environment": "development",
  "features": ["multi-tenant", "jwt-auth", "postgresql"],
  "timestamp": "2026-02-02T10:30:45.123Z"
}
```

### GET / - Welcome

```bash
curl http://localhost:4000/
```

**Resposta (200 OK):**
```json
{
  "message": "Welcome to SYNDIKA API",
  "version": "2.0.0",
  "description": "Multi-tenant SaaS API for Condominium Management",
  "endpoints": {
    "health": "/health",
    "auth": "/api/auth",
    "tenants": "/api/tenants",
    "api_v1": "/api/v1"
  },
  "docs": "/docs"
}
```

---

## 🔐 Testes de Autenticação

### POST /api/auth/register - Registrar novo usuário

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "novo@esperanca.com",
    "password": "senha123",
    "name": "Novo Usuário",
    "unit_number": "105",
    "tenantSlug": "esperanca"
  }'
```

**Resposta esperada (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Novo Usuário",
      "email": "novo@esperanca.com",
      "role": "resident",
      "tenantId": "550e8400-e29b-41d4-a716-446655440001"
    }
  },
  "timestamp": "2026-02-02T10:35:20.123Z"
}
```

### POST /api/auth/login - Login com credenciais

```bash
# Usar credenciais do seed data
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sindico@esperanca.com",
    "password": "senha123",
    "tenantSlug": "esperanca"
  }'
```

**Resposta esperada (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Síndico João Silva",
      "email": "sindico@esperanca.com",
      "role": "admin",
      "tenantId": "550e8400-e29b-41d4-a716-446655440001"
    }
  },
  "timestamp": "2026-02-02T10:40:15.123Z"
}
```

**💡 Salve o TOKEN para usar nos próximos testes!**

```bash
# PowerShell - Salvar token em variável
$response = Invoke-WebRequest -Uri http://localhost:4000/api/auth/login `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"sindico@esperanca.com","password":"senha123","tenantSlug":"esperanca"}'

$token = ($response.Content | ConvertFrom-Json).data.token
Write-Host "Token: $token"
```

### GET /api/auth/me - Obter info do usuário autenticado

```bash
# Substitua TOKEN pelo valor obtido acima
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

**Ou PowerShell:**
```powershell
$headers = @{
  "Authorization" = "Bearer $token"
}
Invoke-WebRequest -Uri http://localhost:4000/api/auth/me -Headers $headers | ConvertFrom-Json
```

**Resposta esperada (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Síndico João Silva",
    "email": "sindico@esperanca.com",
    "role": "admin",
    "unit_number": "101",
    "phone": null,
    "is_active": true,
    "created_at": "2026-02-02T10:00:00.000Z"
  },
  "timestamp": "2026-02-02T10:45:30.123Z"
}
```

---

## 👥 Testes de Tenants & Usuarios

### GET /api/tenants/{tenantSlug}/users - Listar usuários do tenant

```bash
# Usando o token obtido anteriormente
curl -X GET http://localhost:4000/api/tenants/esperanca/users \
  -H "Authorization: Bearer TOKEN"
```

**Resposta esperada (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Síndico João Silva",
        "email": "sindico@esperanca.com",
        "role": "admin",
        "unit_number": "101",
        "phone": null,
        "is_active": true,
        "created_at": "2026-02-02T10:00:00.000Z"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "Gerente Carlos Oliveira",
        "email": "gerente@esperanca.com",
        "role": "manager",
        "unit_number": "102",
        "phone": null,
        "is_active": true,
        "created_at": "2026-02-02T10:05:00.000Z"
      }
    ],
    "pagination": {
      "total": 3,
      "page": 1,
      "limit": 50,
      "pages": 1
    }
  },
  "timestamp": "2026-02-02T10:50:15.123Z"
}
```

---

## 🎫 Testes de Tickets

### POST /api/tenants/{tenantSlug}/tickets - Criar novo ticket

```bash
curl -X POST http://localhost:4000/api/tenants/esperanca/tickets \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Vazamento na unidade 202",
    "description": "Há um vazamento no banheiro principal",
    "category": "maintenance",
    "priority": "high"
  }'
```

**Resposta esperada (201 Created):**
```json
{
  "success": true,
  "message": "Ticket created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "tenant_id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Vazamento na unidade 202",
    "description": "Há um vazamento no banheiro principal",
    "category": "maintenance",
    "priority": "high",
    "status": "open",
    "created_by": "550e8400-e29b-41d4-a716-446655440000",
    "assigned_to": null,
    "created_at": "2026-02-02T11:00:00.000Z",
    "updated_at": "2026-02-02T11:00:00.000Z"
  },
  "timestamp": "2026-02-02T11:00:10.123Z"
}
```

### GET /api/tenants/{tenantSlug}/tickets - Listar tickets do tenant

```bash
curl -X GET http://localhost:4000/api/tenants/esperanca/tickets \
  -H "Authorization: Bearer TOKEN"
```

**Com filtros:**
```bash
# Filtrar por status
curl -X GET "http://localhost:4000/api/tenants/esperanca/tickets?status=open&priority=high" \
  -H "Authorization: Bearer TOKEN"
```

**Resposta esperada (200 OK):**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "tenant_id": "550e8400-e29b-41d4-a716-446655440001",
        "title": "Vazamento na unidade 202",
        "description": "Há um vazamento no banheiro principal",
        "category": "maintenance",
        "priority": "high",
        "status": "open",
        "created_by": "550e8400-e29b-41d4-a716-446655440000",
        "assigned_to": null,
        "creator_name": "Síndico João Silva",
        "creator_email": "sindico@esperanca.com",
        "assignee_name": null,
        "created_at": "2026-02-02T11:00:00.000Z",
        "updated_at": "2026-02-02T11:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 6,
      "page": 1,
      "limit": 50,
      "pages": 1
    }
  },
  "timestamp": "2026-02-02T11:05:20.123Z"
}
```

### GET /api/tenants/{tenantSlug}/tickets/{ticketId} - Obter ticket específico

```bash
curl -X GET http://localhost:4000/api/tenants/esperanca/tickets/550e8400-e29b-41d4-a716-446655440010 \
  -H "Authorization: Bearer TOKEN"
```

**Resposta esperada (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "tenant_id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Vazamento na unidade 202",
    "description": "Há um vazamento no banheiro principal",
    "category": "maintenance",
    "priority": "high",
    "status": "open",
    "created_by": "550e8400-e29b-41d4-a716-446655440000",
    "assigned_to": null,
    "created_at": "2026-02-02T11:00:00.000Z",
    "updated_at": "2026-02-02T11:00:00.000Z"
  },
  "timestamp": "2026-02-02T11:10:05.123Z"
}
```

---

## 🔄 Exemplo de Fluxo Completo

### 1. Login e obter token

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@esperanca.com",
    "password": "senha789",
    "tenantSlug": "esperanca"
  }' \
  -w "\n" | jq '.data.token' -r > token.txt

# Salvar token em variável
$token = Get-Content token.txt
```

### 2. Listar usuários do tenant com autenticação

```bash
curl -X GET http://localhost:4000/api/tenants/esperanca/users \
  -H "Authorization: Bearer $token"
```

### 3. Criar novo ticket

```bash
curl -X POST http://localhost:4000/api/tenants/esperanca/tickets \
  -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Problema com elevador",
    "description": "Elevador parou entre os andares 5 e 6",
    "category": "emergency",
    "priority": "urgent"
  }'
```

### 4. Listar todos os tickets com filtro

```bash
curl -X GET "http://localhost:4000/api/tenants/esperanca/tickets?status=open&priority=urgent" \
  -H "Authorization: Bearer $token"
```

### 5. Ver detalhes de um ticket específico

```bash
# Substitua TICKET_ID pelo ID retornado no passo anterior
curl -X GET http://localhost:4000/api/tenants/esperanca/tickets/TICKET_ID \
  -H "Authorization: Bearer $token"
```

---

## ❌ Testes de Erro

### Sem autenticação

```bash
curl -X GET http://localhost:4000/api/tenants/esperanca/users
```

**Resposta esperada (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "NO_TOKEN",
    "message": "Authorization token not provided"
  },
  "timestamp": "2026-02-02T11:15:30.123Z"
}
```

### Token inválido

```bash
curl -X GET http://localhost:4000/api/tenants/esperanca/users \
  -H "Authorization: Bearer invalid.token.here"
```

**Resposta esperada (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Invalid or expired token"
  },
  "timestamp": "2026-02-02T11:20:15.123Z"
}
```

### Tenant não encontrado

```bash
curl -X GET http://localhost:4000/api/tenants/tenant-inexistente/users \
  -H "Authorization: Bearer $token"
```

**Resposta esperada (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "TENANT_NOT_FOUND",
    "message": "Tenant not found"
  },
  "timestamp": "2026-02-02T11:25:00.123Z"
}
```

---

## 📱 Usando Postman

### Importar collection automaticamente

1. **Criar Environment em Postman:**
   - Name: `SYNDIKA-DEV`
   - Variables:
     - `base_url`: `http://localhost:4000`
     - `token`: (deixar vazio, será preenchido após login)
     - `tenant_slug`: `esperanca`

2. **Requests principais:**

   **POST - Register User**
   ```
   {{base_url}}/api/auth/register
   Body (JSON):
   {
     "email": "novo@esperanca.com",
     "password": "senha123",
     "name": "Novo Usuário",
     "tenantSlug": "{{tenant_slug}}"
   }
   ```

   **POST - Login**
   ```
   {{base_url}}/api/auth/login
   Body (JSON):
   {
     "email": "sindico@esperanca.com",
     "password": "senha123",
     "tenantSlug": "{{tenant_slug}}"
   }
   Tests (para salvar token):
   pm.environment.set("token", pm.response.json().data.token);
   ```

   **GET - Get User Info**
   ```
   {{base_url}}/api/auth/me
   Headers:
     Authorization: Bearer {{token}}
   ```

   **GET - List Users**
   ```
   {{base_url}}/api/tenants/{{tenant_slug}}/users
   Headers:
     Authorization: Bearer {{token}}
   ```

   **POST - Create Ticket**
   ```
   {{base_url}}/api/tenants/{{tenant_slug}}/tickets
   Headers:
     Authorization: Bearer {{token}}
   Body (JSON):
   {
     "title": "Novo Chamado",
     "description": "Descrição do chamado",
     "category": "maintenance",
     "priority": "high"
   }
   ```

   **GET - List Tickets**
   ```
   {{base_url}}/api/tenants/{{tenant_slug}}/tickets
   Headers:
     Authorization: Bearer {{token}}
   ```

---

## 📊 Status Codes Esperados

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/health` | GET | 200 | Servidor ok |
| `/api/auth/register` | POST | 201 | Usuário criado |
| `/api/auth/login` | POST | 200 | Login bem-sucedido |
| `/api/auth/me` | GET | 200 | Info do usuário |
| `/api/tenants/{slug}/users` | GET | 200 | Usuários listados |
| `/api/tenants/{slug}/tickets` | POST | 201 | Ticket criado |
| `/api/tenants/{slug}/tickets` | GET | 200 | Tickets listados |
| Sem token | ANY | 401 | Não autenticado |
| Token inválido | ANY | 401 | Token inválido |
| Tenant não encontrado | ANY | 404 | Não existe |

---

## 🎯 Checklist de Testes

```
[ ] Server rodando em http://localhost:4000
[ ] GET /health retorna status: "ok"
[ ] POST /api/auth/register cria novo usuário
[ ] POST /api/auth/login retorna JWT token
[ ] GET /api/auth/me retorna info do usuário
[ ] GET /api/tenants/{slug}/users lista usuários com paginação
[ ] POST /api/tenants/{slug}/tickets cria ticket
[ ] GET /api/tenants/{slug}/tickets lista tickets com filtros
[ ] GET /api/tenants/{slug}/tickets/{id} retorna ticket específico
[ ] Requisições sem token retornam 401
[ ] Requisições com token inválido retornam 401
[ ] Tenant inexistente retorna 404
```

---

## 🚀 Próximos Passos

1. ✅ Autenticação JWT funcionando
2. ✅ Multi-tenant isolado por tenant_id
3. ⏳ CRUD completo para outras entidades (Reservations, Announcements)
4. ⏳ Filtros avançados e busca
5. ⏳ Validação de dados com Zod/Joi
6. ⏳ Testes automatizados (Jest)
7. ⏳ Rate limiting
8. ⏳ Documentação OpenAPI/Swagger

---

**Versão:** 2.0.0  
**Data:** 02/02/2026  
**Status:** ✅ Production Ready (v2)

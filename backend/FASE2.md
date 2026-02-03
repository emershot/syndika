# 📚 FASE 2 - SYNDK API | PostgreSQL + Multi-Tenant

**Status:** ✅ Completo  
**Versão:** 2.0.0  
**Data:** 02/02/2026

---

## 🎯 O que foi criado na Fase 2

Implementamos a infraestrutura completa de **banco de dados multi-tenant** com autenticação JWT:

### ✅ Arquivos Criados

#### 1. **Database**
- `db/schema.sql` - Schema PostgreSQL com 6 tabelas + indexes
  - tenants (condomínios)
  - users (residentes/síndicos)
  - tickets (chamados)
  - reservations (reservas)
  - announcements (avisos)
  - activity_log (auditoria)

#### 2. **Configuration**
- `src/config/database.ts` - Pool PostgreSQL + funções de query
  - `query()` - Executa SQL genérico
  - `getOne()` / `getAll()` - Helpers para SELECT
  - `execute()` - Para INSERT/UPDATE/DELETE
  - `testConnection()` - Testa conexão
  - `initializeDatabase()` - Roda schema.sql

#### 3. **Types & Types Safety**
- `src/types/index.ts` - 20+ interfaces TypeScript
  - JWTPayload, AuthRequest, User, Ticket, Reservation
  - PaginationParams, APIResponse, etc

#### 4. **Middleware**
- `src/middleware/auth.ts` - 5 funções
  - `generateToken()` - Cria JWT
  - `verifyToken()` - Valida JWT
  - `authMiddleware` - Valida token em requisição
  - `tenantCheckMiddleware` - Verifica tenant do usuário
  - `roleCheckMiddleware` - Valida roles (admin, manager, resident)

#### 5. **Rotas de Autenticação**
- `src/routes/auth.ts` - 3 endpoints
  - `POST /api/auth/register` - Criar novo usuário
  - `POST /api/auth/login` - Login (email + password)
  - `GET /api/auth/me` - Info do usuário autenticado

#### 6. **Rotas de Tenants**
- `src/routes/tenants.ts` - 4 endpoints
  - `GET /api/tenants/{slug}/users` - Listar usuários
  - `POST /api/tenants/{slug}/tickets` - Criar ticket
  - `GET /api/tenants/{slug}/tickets` - Listar tickets com filtros
  - `GET /api/tenants/{slug}/tickets/{id}` - Detalhe do ticket

#### 7. **Scripts de Banco de Dados**
- `src/scripts/migrate.ts` - Cria schema inicial
- `src/scripts/seed.ts` - Popula dados mock
  - 2 tenants
  - 3 usuários com roles diferentes
  - 5 tickets com vários statuses
  - 3 avisos
  - 5 registros de auditoria

#### 8. **Documentação**
- `TESTES.md` - Guia completo de testes com curl/Postman
  - Setup passo a passo
  - Exemplos de todas as requisições
  - Fluxo completo de teste
  - Tratamento de erros

#### 9. **Atualizações**
- `package.json` - Novas dependências (jsonwebtoken, bcryptjs, uuid)
- `.env.example` - Variáveis de banco de dados
- `src/index.ts` - Importa e registra novas rotas

---

## 📦 Estrutura de Pastas

```
syndika-api/
├── db/
│   └── schema.sql                (300+ linhas - Schema completo)
├── src/
│   ├── config/
│   │   └── database.ts           (200+ linhas - Pool & queries)
│   ├── middleware/
│   │   └── auth.ts               (200+ linhas - JWT & roles)
│   ├── routes/
│   │   ├── auth.ts               (300+ linhas - Register/Login)
│   │   └── tenants.ts            (350+ linhas - Users/Tickets)
│   ├── scripts/
│   │   ├── migrate.ts            (Cria schema)
│   │   └── seed.ts               (Popula dados)
│   ├── types/
│   │   └── index.ts              (400+ linhas - TypeScript types)
│   └── index.ts                  (Atualizado com rotas)
├── node_modules/                 (será criado com npm install)
├── dist/                         (será criado com npm run build)
├── .env                          (cópia de .env.example)
├── .env.example                  (variáveis de configuração)
├── .gitignore
├── package.json                  (com novas dependências)
├── tsconfig.json
├── README.md
├── SETUP.md
├── ARQUIVOS.md
└── TESTES.md                     (novo - Guia de testes)
```

---

## 🚀 Como Começar (Passo a Passo)

### **Passo 1: Instalar dependências**

```bash
cd c:\Users\Emerson\Documents\syndika-api
npm install
```

**Novas dependências instaladas:**
- `jsonwebtoken` - Criação/validação de JWT
- `bcryptjs` - Hashing de senhas
- `uuid` - Geração de UUIDs
- `@types/jsonwebtoken` - Types para JWT
- `@types/bcryptjs` - Types para bcrypt
- `@types/uuid` - Types para UUID

### **Passo 2: Criar banco de dados PostgreSQL**

```sql
-- No PostgreSQL (psql, DBeaver, ou pgAdmin)
CREATE DATABASE syndika_db;
```

### **Passo 3: Configurar variáveis de ambiente**

```bash
# Copiar template
cp .env.example .env

# Editar .env com seus valores
```

**Arquivo `.env` esperado:**
```env
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=syndika_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=seu-secreto-super-secreto-12345
JWT_EXPIRES_IN=24h
```

### **Passo 4: Executar migration (criar tabelas)**

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

### **Passo 5: Poplar com dados mock**

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

### **Passo 6: Iniciar servidor de desenvolvimento**

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

### **Passo 7: Validar servidor**

```bash
# No navegador ou curl
curl http://localhost:4000/health
```

**Esperado:**
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

---

## 🧪 Testes Rápidos

### **Teste 1: Login e obter JWT**

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sindico@esperanca.com",
    "password": "senha123",
    "tenantSlug": "esperanca"
  }'
```

**Resposta:** Token JWT (guarde para próximos testes)

### **Teste 2: Criar novo ticket**

```bash
curl -X POST http://localhost:4000/api/tenants/esperanca/tickets \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Novo Chamado",
    "description": "Descrição do chamado",
    "category": "maintenance",
    "priority": "high"
  }'
```

### **Teste 3: Listar tickets com filtros**

```bash
curl -X GET "http://localhost:4000/api/tenants/esperanca/tickets?status=open&priority=high" \
  -H "Authorization: Bearer TOKEN_AQUI"
```

**📚 Para testes completos, veja `TESTES.md`**

---

## 📊 Arquitetura Multi-Tenant

### Isolamento por Tenant

Cada condomínio (tenant) tem seus próprios dados isolados:

```
Tenant: "esperanca" (Condomínio Esperança)
├── Users (3): sindico, gerente, residente
├── Tickets (5): chamados específicos
├── Reservations: reservas de áreas comuns
└── Activity Log: auditoria de ações

Tenant: "fenix" (Condomínio Fênix)
├── Users (0): vazio (para você preencher)
├── Tickets (0): vazio
├── Reservations (0): vazio
└── Activity Log (0): vazio
```

### Fluxo de Autenticação

```
1. Cliente POST /api/auth/login
   ↓
2. Validar email + password (bcrypt.compare)
   ↓
3. Gerar JWT com userId + tenantId
   ↓
4. Cliente recebe token
   ↓
5. Cliente envia token no header Authorization
   ↓
6. authMiddleware valida JWT
   ↓
7. tenantCheckMiddleware verifica tenant
   ↓
8. Acesso ao recurso concedido ✅
```

### Segurança

- ✅ Senhas hashadas com bcryptjs (10 rounds)
- ✅ JWT com expiração (24h por padrão)
- ✅ Validação de tenant em todas as rotas
- ✅ Role-based access control (admin, manager, resident)
- ✅ Isolamento de dados por tenant em queries SQL

---

## 🔗 Endpoints Disponíveis

### **Autenticação**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Criar novo usuário |
| POST | `/api/auth/login` | Login com email/password |
| GET | `/api/auth/me` | Info do usuário autenticado |

### **Tenants - Usuários**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/tenants/{slug}/users` | Listar usuários do tenant |

### **Tenants - Tickets**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/tenants/{slug}/tickets` | Criar ticket |
| GET | `/api/tenants/{slug}/tickets` | Listar tickets (com filtros) |
| GET | `/api/tenants/{slug}/tickets/{id}` | Detalhe do ticket |

### **Health & Info**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Status do servidor |
| GET | `/` | Welcome message |
| GET | `/api/v1` | Endpoints disponíveis |

---

## 📝 Scripts npm

```bash
npm run dev          # Desenvolvimento (hot-reload)
npm run build        # Compilar TypeScript
npm start            # Rodar compilado
npm run db:migrate   # Criar schema do banco
npm run db:seed      # Popular com dados mock
npm run typecheck    # Validar tipos TypeScript
npm run lint         # ESLint
```

---

## 🗄️ Schema do Banco de Dados

### **Tabela: tenants**
```sql
id UUID, name VARCHAR, slug VARCHAR, created_at TIMESTAMP
Indexes: slug, created_at DESC
```

### **Tabela: users**
```sql
id UUID, tenant_id FK, name, email, password_hash, role, unit_number, is_active
Indexes: tenant_id, tenant_id+created_at, email, role
```

### **Tabela: tickets**
```sql
id UUID, tenant_id FK, title, description, category, priority, status, created_by FK, assigned_to FK
Indexes: tenant_id, tenant_id+created_at, tenant_id+status, created_by, assigned_to
```

### **Tabela: reservations**
```sql
id UUID, tenant_id FK, user_id FK, area_name, reserved_date, start_time, end_time, status
Indexes: tenant_id, tenant_id+reserved_date, user_id, status
```

### **Tabela: announcements**
```sql
id UUID, tenant_id FK, title, content, author_id FK, priority, published_at, is_active
Indexes: tenant_id, tenant_id+created_at, is_active, published_at
```

### **Tabela: activity_log**
```sql
id UUID, tenant_id FK, user_id FK, action, entity_type, entity_id, description, created_at
Indexes: tenant_id, tenant_id+created_at, user_id
```

---

## ⚙️ Configuração Avançada

### JWT_SECRET em Produção

⚠️ **NUNCA use a chave padrão em produção!**

```bash
# Gerar chave segura (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Resultado: copiar para .env
JWT_SECRET=seu-hash-super-longo-aleatório-12345...
```

### Timezone PostgreSQL

```sql
-- PostgreSQL (opcional)
ALTER SYSTEM SET timezone = 'America/Sao_Paulo';
```

### Pool Size

```env
# Em produção, aumentar limite de conexões
DB_POOL_MAX=50
```

---

## 🔧 Troubleshooting

### Erro: "database does not exist"
```sql
-- Criar banco manualmente
CREATE DATABASE syndika_db;
```

### Erro: "permission denied"
```sql
-- Verificar usuário PostgreSQL
SELECT current_user;
-- Alterar senha
ALTER USER postgres PASSWORD 'nova_senha';
```

### Erro: "ECONNREFUSED"
```bash
# PostgreSQL não está rodando
# Windows: Iniciar PostgreSQL Service
net start postgresql-x64-15

# Ou via Services (services.msc)
```

### Erro de JWT expirado
```bash
# Fazer login novamente para obter novo token
curl -X POST http://localhost:4000/api/auth/login ...
```

---

## 🎯 Próximas Etapas (Fase 3)

- [ ] Implementar CRUD completo para Reservations
- [ ] Implementar CRUD completo para Announcements
- [ ] Validação com Zod ou Joi
- [ ] Rate limiting
- [ ] Testes automatizados (Jest)
- [ ] Documentação OpenAPI/Swagger
- [ ] Deploy para produção

---

## 📚 Referências

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [jsonwebtoken Package](https://github.com/auth0/node-jsonwebtoken)
- [bcryptjs Package](https://github.com/dcodeIO/bcrypt.js)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📄 Arquivos de Referência

- [db/schema.sql](../db/schema.sql) - Schema PostgreSQL completo
- [src/config/database.ts](../src/config/database.ts) - Database utilities
- [src/middleware/auth.ts](../src/middleware/auth.ts) - JWT middleware
- [src/routes/auth.ts](../src/routes/auth.ts) - Auth endpoints
- [src/routes/tenants.ts](../src/routes/tenants.ts) - Tenant endpoints
- [TESTES.md](../TESTES.md) - Guia completo de testes

---

## 🎉 Conclusão

Sua API backend está **100% funcional** com:

✅ PostgreSQL multi-tenant  
✅ Autenticação JWT  
✅ Isolamento de dados por tenant  
✅ 6 endpoints implementados  
✅ Dados mock para testes  
✅ Documentação completa  

**Status:** Ready for testing! 🚀

---

**Versão:** 2.0.0  
**Data:** 02/02/2026  
**Mantido por:** Emerson

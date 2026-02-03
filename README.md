# 🏢 SYNDIKA - SaaS de Gestão de Condomínios

**Full-stack Application | React + Node.js + PostgreSQL**

**Status:** ✅ MVP Completo e Ready for Deploy

---

## 📋 Visão Geral

Syndika é uma plataforma SaaS de gestão de condomínios com:

- **Dashboard** com KPIs (tickets, anúncios, moradores)
- **Sistema de Tickets** (manutenção, barulho, etc)
- **Gerenciamento de Anúncios** (avisos importantes)
- **Calendário de Reservas** (áreas comuns)
- **Auditoria** completa de ações
- **Multi-tenant** (vários condomínios)
- **Role-based Access Control** (admin, gerente, morador)

---

## 🗂️ Estrutura do Projeto

```
syndika-monorepo/
├── frontend/                 # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── contexts/
│   │   └── lib/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── db/
│   ├── db/
│   │   ├── schema.sql
│   │   └── seed-production.sql
│   ├── package.json
│   └── tsconfig.json
│
├── package.json              # Root workspace
├── .gitignore
├── .npmrc
└── README.md
```

---

## 🚀 Quick Start (Desenvolvimento Local)

### **1. Clonar/Entrar no Repositório**
```bash
cd syndika-monorepo
npm install
```

### **2. Setup Database**
```bash
# Criar container PostgreSQL
docker run --name syndika-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=syndika_dev \
  -p 5432:5432 \
  -d postgres:15

# Restaurar schema
psql -h localhost -U postgres -d syndika_dev -f backend/db/schema.sql
```

### **3. Environment Variables**

**Backend** (`backend/.env`):
```env
NODE_ENV=development
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=syndika_dev
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key-here-min-32-chars-long
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:8080
```

**Frontend** (`frontend/.env.local`):
```env
VITE_API_URL=http://localhost:4000
VITE_DEFAULT_TENANT_SLUG=demo
VITE_ENABLE_DEVTOOLS=true
VITE_DEBUG_API=true
```

### **4. Rodar Projeto**

**Terminal 1 - Backend:**
```bash
npm run backend:dev
```

**Terminal 2 - Frontend:**
```bash
npm run frontend:dev
```

Acesse: **http://localhost:8080**

---

## 🔐 Credenciais Demo (Desenvolvimento)

```
Tenant: demo

👨‍💼 Admin
  Email: admin@demo.com
  Senha: demo123

👨‍✓ Gerente
  Email: gerente@demo.com
  Senha: gerente123

👤 Morador
  Email: morador@demo.com
  Senha: morador123
```

---

## 📦 Tecnologias

### **Frontend**
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Query
- React Hook Form
- Zod (validação)
- Axios

### **Backend**
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- JWT
- Zod (validação)
- Morgan (logging)

### **Database**
- PostgreSQL 15+
- Multi-tenant
- RLS (Row Level Security)
- 6 tabelas principais

---

## 🔧 Scripts Disponíveis

### **Desenvolvimento**
```bash
npm run dev              # Rodar frontend + backend
npm run frontend:dev     # Rodar só frontend (port 8080)
npm run backend:dev      # Rodar só backend (port 4000)
```

### **Build**
```bash
npm run build            # Build frontend + backend
npm run frontend:build   # Build só frontend
npm run backend:build    # Build só backend
```

### **Produção**
```bash
npm start               # Rodar backend em produção
npm run backend:start   # Rodar backend em produção
```

### **Qualidade**
```bash
npm run lint            # Lint frontend + backend
npm run test            # Testes frontend + backend
```

---

## 🌐 Endpoints API (Backend)

### **Health Check**
```bash
GET /health
```

### **Authentication**
```bash
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
```

### **Tickets**
```bash
GET    /api/tickets
POST   /api/tickets
GET    /api/tickets/:id
PATCH  /api/tickets/:id
DELETE /api/tickets/:id
```

### **Anúncios**
```bash
GET    /api/announcements
POST   /api/announcements
GET    /api/announcements/:id
PATCH  /api/announcements/:id
DELETE /api/announcements/:id
```

### **Usuários**
```bash
GET    /api/users
POST   /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

---

## 🚀 Deploy em Produção

### **Pré-requisitos**
- GitHub account
- Vercel account (frontend)
- Render.com account (backend)
- Supabase account (database)

### **Guias**
1. **DEPLOY-GUIA-COMPLETO.md** - Passo a passo completo (30 min)
2. **DEPLOY-RAPIDO.md** - Deploy rápido (10 min)
3. **SEGURANCA-PRODUCAO.md** - Security checklist

### **Quick Deploy**
```bash
# 1. Create monorepo GitHub repo
git init
git remote add origin https://github.com/USERNAME/syndika-monorepo.git
git push -u origin main

# 2. Deploy em Vercel (frontend)
vercel --prod

# 3. Deploy em Render (backend)
# (via GitHub webhook no painel)
```

**Production URLs:**
- Frontend: https://syndika.vercel.app
- Backend: https://syndika-backend.onrender.com
- Database: Supabase PostgreSQL

---

## 📊 Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser                                │
│              (React + TypeScript)                          │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────────────┐
│                   VERCEL (CDN)                              │
│     Frontend (dist build + API proxy)                      │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────────────┐
│                  RENDER.COM                                 │
│     Backend (Node.js + Express)                            │
│     ├─ Routes (auth, tickets, etc)                         │
│     ├─ Controllers                                         │
│     ├─ Services (business logic)                           │
│     └─ Middleware (auth, validation)                       │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS/SSL
┌────────────────────▼────────────────────────────────────────┐
│                  SUPABASE                                   │
│     PostgreSQL (Multi-tenant)                              │
│     ├─ tenants                                             │
│     ├─ users                                               │
│     ├─ tickets                                             │
│     ├─ announcements                                       │
│     ├─ reservations                                        │
│     └─ activity_log                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔒 Segurança

- ✅ JWT-based authentication
- ✅ Password hashing (bcrypt)
- ✅ CORS protection
- ✅ SQL injection prevention
- ✅ Input validation (Zod)
- ✅ HTTPS/TLS (produção)
- ✅ Row Level Security (RLS)
- ✅ Multi-tenant isolation

---

## 📝 Documentação

- **[DEPLOY-GUIA-COMPLETO.md](../DEPLOY-GUIA-COMPLETO.md)** - Deploy passo a passo
- **[DEPLOY-RAPIDO.md](../DEPLOY-RAPIDO.md)** - Quick deploy guide
- **[SEGURANCA-PRODUCAO.md](../SEGURANCA-PRODUCAO.md)** - Security best practices
- **[CHECKLIST-DEPLOY.md](../CHECKLIST-DEPLOY.md)** - Pre-deploy checklist

---

## 🐛 Troubleshooting

### **Frontend não conecta ao backend**
```bash
# Verificar VITE_API_URL
cat frontend/.env.local

# Verificar backend está rodando
curl http://localhost:4000/health
```

### **Database connection error**
```bash
# Verificar credenciais
cat backend/.env

# Testar conexão
psql -h localhost -U postgres -d syndika_dev -c "SELECT 1"
```

### **JWT token inválido**
```bash
# Gerar novo JWT_SECRET
openssl rand -base64 32

# Atualizar .env backend
NODE_ENV=development
JWT_SECRET=<novo-secret>
```

---

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra uma Pull Request

---

## 📞 Support

Para dúvidas ou issues:
1. Consulte os guias de deploy
2. Verifique o troubleshooting acima
3. Abra uma issue no GitHub

---

## 📄 License

Este projeto é licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.

---

**Versão:** 2.0.0  
**Status:** ✅ MVP Completo  
**Última Atualização:** 03/02/2026  
**Deploy:** Pronto para Produção 🚀

# 🚀 SYNDIKA API - Backend Node.js + TypeScript

**Versão:** 1.0.0  
**Status:** Development Setup ✅  
**Última Atualização:** 02/02/2026

---

## 📋 Estrutura Inicial

```
syndika-api/
├── src/
│   └── index.ts          # Servidor Express principal
├── dist/                 # Compilado (gerado após build)
├── package.json          # Dependências e scripts
├── tsconfig.json         # Configuração TypeScript
├── .env.example          # Template de variáveis de ambiente
├── .gitignore            # Git ignore rules
└── README.md            # Este arquivo
```

---

## 🛠️ Setup Inicial (Passo a Passo)

### 1️⃣ Clonar/Baixar o Projeto

```bash
# Se está baixando os arquivos, coloque-os em uma pasta chamada syndika-api
cd syndika-api
```

### 2️⃣ Instalar Dependências

```bash
npm install
```

**Dependências instaladas:**
- `express` - Framework web
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Variáveis de ambiente
- `pg` - Driver PostgreSQL (para Fase 3)
- `typescript` - Compilador TypeScript
- `ts-node-dev` - Desenvolvimento com hot-reload
- `@types/express`, `@types/node`, `@types/pg`, `@types/cors` - Type definitions

---

## 📁 Arquivos Gerados

### **package.json**
```json
{
  "name": "syndika-api",
  "version": "1.0.0",
  "description": "SYNDIKA - Backend API para Plataforma de Gestão de Condomínios",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src --ext .ts",
    "typecheck": "tsc --noEmit"
  },
  // ... resto do arquivo
}
```

**Scripts disponíveis:**
- `npm run dev` - Rodar em modo desenvolvimento (hot-reload)
- `npm run build` - Compilar TypeScript → dist/
- `npm start` - Executar a versão compilada
- `npm run lint` - Verificar código (ESLint)
- `npm run typecheck` - Verificar tipos TypeScript

---

### **tsconfig.json**
Configuração TypeScript com:
- ✅ Strict mode habilitado
- ✅ Path aliases (`@/*`, `@controllers/*`, etc)
- ✅ Target ES2020 (moderno)
- ✅ Module ES2020 (ESNext)
- ✅ Source maps para debugging
- ✅ Strict null checks
- ✅ No implicit any

---

### **src/index.ts**
Servidor Express básico com:
- ✅ CORS configurado
- ✅ Body parser para JSON/URL-encoded
- ✅ Request logging
- ✅ Rota GET `/health` ← **Teste aqui!**
- ✅ Rota GET `/` (welcome)
- ✅ Rota GET `/api/v1` (endpoints disponíveis)
- ✅ Error handling middleware
- ✅ 404 handler
- ✅ ASCII art no startup

---

## ▶️ Como Rodar

### **Modo Desenvolvimento (Recomendado)**

```bash
npm run dev
```

**Output esperado:**
```
╔════════════════════════════════════════╗
║                                        ║
║    🚀 SYNDIKA API Started              ║
║                                        ║
║    Server: http://localhost:4000       ║
║    Environment: development            ║
║    Health: http://localhost:4000/health║
║                                        ║
╚════════════════════════════════════════╝
```

---

### **Testar a API**

#### 1️⃣ Health Check (GET)
```bash
curl http://localhost:4000/health
```

**Response esperada:**
```json
{
  "status": "ok",
  "service": "syndika-api",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2026-02-02T10:30:00.000Z"
}
```

#### 2️⃣ Root (GET)
```bash
curl http://localhost:4000/
```

**Response esperada:**
```json
{
  "message": "Welcome to SYNDIKA API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "api": "/api/v1"
  }
}
```

#### 3️⃣ API v1 (GET)
```bash
curl http://localhost:4000/api/v1
```

**Response esperada:**
```json
{
  "message": "SYNDIKA API v1",
  "modules": {
    "tickets": "/api/v1/tickets",
    "reservations": "/api/v1/reservations",
    "announcements": "/api/v1/announcements",
    "residents": "/api/v1/residents",
    "auth": "/api/v1/auth"
  }
}
```

#### 4️⃣ Browser
Abra em seu navegador:
```
http://localhost:4000/health
```

Você verá o JSON de saúde do serviço! ✅

---

### **Modo Produção (Build + Start)**

```bash
# Compilar TypeScript para dist/
npm run build

# Rodar a versão compilada
npm start
```

**Output:**
```
╔════════════════════════════════════════╗
║                                        ║
║    🚀 SYNDIKA API Started              ║
║                                        ║
║    Server: http://localhost:4000       ║
║    Environment: development            ║
║    Health: http://localhost:4000/health║
║                                        ║
╚════════════════════════════════════════╝
```

---

## 🔧 Configuração de Variáveis de Ambiente

### 1️⃣ Criar arquivo .env na raiz

```bash
cp .env.example .env
```

### 2️⃣ Editar .env

```env
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Database (para Fase 3)
DATABASE_URL=postgresql://postgres:password@localhost:5432/syndika_db

# JWT (para Fase 3)
JWT_SECRET=seu-secret-key-super-secreto
JWT_EXPIRES_IN=7d

# Email (para Fase 3)
SENDGRID_API_KEY=seu-api-key-aqui
EMAIL_FROM=noreply@syndika.com.br
```

### 3️⃣ Usar no código

```typescript
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
```

---

## 📊 Estrutura de Pastas Futura

Para Fase 3+ (Backend completo), a estrutura será:

```
src/
├── config/              # Configurações (DB, env, etc)
├── controllers/         # Lógica das rotas
├── services/           # Lógica de negócio
├── models/             # Modelos de dados
├── routes/             # Definição de rotas
├── middleware/         # Middlewares customizados
├── utils/              # Funções auxiliares
├── types/              # Tipos TypeScript
├── database/           # Conexão e migrations DB
├── validators/         # Validações de input
├── exceptions/         # Tratamento de erros
└── index.ts            # Entry point
```

---

## 🔌 Integração com Frontend React

### CORS já configurado para frontend

No arquivo `src/index.ts`, o CORS está configurado:

```typescript
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

**Frontend React (porta 5173) pode fazer chamadas para o backend (porta 4000):**

```typescript
// src/hooks/useApi.ts (exemplo)
const response = await fetch('http://localhost:4000/api/v1/tickets', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
});
```

---

## 🧪 Testes de Desenvolvimento

### Com curl

```bash
# Health check
curl -X GET http://localhost:4000/health

# Root
curl -X GET http://localhost:4000/

# API v1
curl -X GET http://localhost:4000/api/v1
```

### Com Postman/Insomnia

1. Abrir Postman/Insomnia
2. Nova requisição GET
3. URL: `http://localhost:4000/health`
4. Enviar
5. Ver resposta JSON

### Com VSCode REST Client

Criar arquivo `.rest` ou `.http`:

```
### Health Check
GET http://localhost:4000/health

### Root
GET http://localhost:4000/

### API v1
GET http://localhost:4000/api/v1
```

Instalar extensão "REST Client" e clicar "Send Request".

---

## 📝 TypeScript Strict Mode

O projeto usa TypeScript strict mode com:

```typescript
"strict": true,
"noImplicitAny": true,
"strictNullChecks": true,
"strictFunctionTypes": true,
"noUnusedLocals": true,
"noUnusedParameters": true,
"noImplicitReturns": true,
```

**Isso significa:**
- ✅ Tipos explícitos obrigatórios
- ✅ `null` e `undefined` são tipos
- ✅ Sem `any` implícito
- ✅ Código mais seguro e robusto

---

## 🚨 Troubleshooting

### ❌ "Cannot find module 'express'"

```bash
# Solução: Instalar dependências
npm install
```

### ❌ "Error: listen EADDRINUSE :::4000"

```bash
# Porta 4000 já está em uso
# Opção 1: Mudar porta no .env
PORT=4001

# Opção 2: Matar processo na porta 4000
lsof -ti:4000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :4000   # Windows
```

### ❌ "TypeScript compilation error"

```bash
# Verificar tipos
npm run typecheck

# Ver erro completo
npm run dev
```

### ❌ "CORS error no frontend"

Verificar `.env`:
```env
CORS_ORIGIN=http://localhost:5173
```

---

## 📚 Referências

- [Express.js Docs](https://expressjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [REST API Best Practices](https://restfulapi.net)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## ✅ Checklist de Implementação

- ✅ Pasta syndika-api criada
- ✅ npm init executado
- ✅ Dependências instaladas
- ✅ TypeScript configurado
- ✅ Servidor Express básico
- ✅ Rota /health funcional
- ✅ CORS configurado
- ✅ Scripts npm configurados
- ✅ .env.example criado
- ✅ .gitignore criado
- ✅ README completo

---

## 🎯 Próximos Passos (Fase 3)

1. Configurar PostgreSQL
2. Criar migration system
3. Implementar autenticação (JWT)
4. Criar routes para Tickets
5. Criar routes para Reservations
6. Criar routes para Announcements
7. Criar services para lógica de negócio
8. Implementar validação (Zod)
9. Adicionar testes (Jest)
10. Deploy em produção

---

## 🤝 Suporte

Para dúvidas sobre o setup:
- Verificar logs no terminal
- Usar `npm run typecheck` para validar código
- Consultar documentação oficial das bibliotecas

---

**Versão:** 1.0.0  
**Atualizado:** 02/02/2026  
**Status:** Ready for Development ✅


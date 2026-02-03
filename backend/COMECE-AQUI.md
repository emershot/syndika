# 🚀 GUIA RÁPIDO - COMEÇAR AGORA

**Tempo estimado:** 10 minutos  
**Pré-requisitos:** Node.js 18+, PostgreSQL

---

## ✅ CHECKLIST PRÉ-INSTALAÇÃO

```
[ ] Node.js 18+ instalado?
    → Verificar: node --version
    
[ ] npm 9+ instalado?
    → Verificar: npm --version
    
[ ] PostgreSQL instalado e rodando?
    → Verificar: no Services (Windows) ou psql --version
    
[ ] Pasta syndika-api existe?
    → c:\Users\Emerson\Documents\syndika-api\
```

---

## 🔧 INSTALAÇÃO (7 PASSOS)

### **PASSO 1: Abrir PowerShell**

```powershell
# Windows PowerShell ou PowerShell Core
cd c:\Users\Emerson\Documents\syndika-api
```

### **PASSO 2: Instalar dependências npm**

```powershell
npm install
```

**Tempo esperado:** 2-3 minutos  
**Output esperado:**
```
added 150+ packages in 2m 30s
```

### **PASSO 3: Criar banco de dados PostgreSQL**

```powershell
# Opção A: Usando pgAdmin (interface gráfica)
# 1. Abrir pgAdmin
# 2. Right-click em Databases → Create → Database
# 3. Name: syndika_db
# 4. Click Save

# Opção B: Usando psql (linha de comando)
psql -U postgres
# Digite senha do postgres
# Execute:
CREATE DATABASE syndika_db;
\q
```

**Ou usar PowerShell:**
```powershell
# Se tem psql no PATH
psql -U postgres -c "CREATE DATABASE syndika_db;"
```

### **PASSO 4: Criar arquivo .env**

```powershell
# Copiar template
Copy-Item .env.example .env

# Abrir em editor (escolha um)
code .env              # VS Code
notepad .env           # Notepad
```

**Editar `.env` com seus valores:**
```env
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=syndika_db
DB_USER=postgres
DB_PASSWORD=postgres          ← Sua senha do PostgreSQL

JWT_SECRET=seu-secreto-super-secreto-12345
JWT_EXPIRES_IN=24h
```

**Salvar arquivo (Ctrl+S)**

### **PASSO 5: Rodar migration (criar tabelas)**

```powershell
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

Se der erro → Verificar conexão PostgreSQL no `.env`

### **PASSO 6: Popular banco com dados de teste**

```powershell
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

### **PASSO 7: Iniciar servidor**

```powershell
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

**Se chegou aqui:** 🎉 SUCESSO!

---

## 🧪 TESTES IMEDIATOS

### **Teste 1: Verificar servidor online**

Abrir no navegador:
```
http://localhost:4000/health
```

**Esperado:** JSON com status ok

### **Teste 2: Login e obter token**

No PowerShell (nova aba):
```powershell
$response = Invoke-WebRequest -Uri http://localhost:4000/api/auth/login `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"sindico@esperanca.com","password":"senha123","tenantSlug":"esperanca"}'

$token = ($response.Content | ConvertFrom-Json).data.token
Write-Host "Token: $token"
```

**Salvar o token em variável:**
```powershell
$token = "COPIAR TOKEN AQUI"
```

### **Teste 3: Criar ticket**

```powershell
Invoke-WebRequest -Uri http://localhost:4000/api/tenants/esperanca/tickets `
  -Method POST `
  -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
  } `
  -Body '{"title":"Novo Chamado","category":"maintenance","priority":"high"}'
```

**Esperado:** JSON com ticket criado

### **Teste 4: Listar tickets**

```powershell
Invoke-WebRequest -Uri "http://localhost:4000/api/tenants/esperanca/tickets" `
  -Headers @{"Authorization" = "Bearer $token"} | ConvertFrom-Json | ConvertTo-Json
```

**Esperado:** Lista de tickets com paginação

---

## 📊 USANDO POSTMAN (Alternativa)

Se preferir interface gráfica:

### **1. Importar Environment**

Criar environment com variáveis:
```
base_url = http://localhost:4000
tenant_slug = esperanca
token = (será preenchido após login)
```

### **2. Requests Principais**

**Request 1: Login**
```
POST {{base_url}}/api/auth/login
Body (JSON):
{
  "email": "sindico@esperanca.com",
  "password": "senha123",
  "tenantSlug": "{{tenant_slug}}"
}

Tests (copiar em aba "Tests"):
pm.environment.set("token", pm.response.json().data.token);
```

**Request 2: List Tickets**
```
GET {{base_url}}/api/tenants/{{tenant_slug}}/tickets
Headers:
  Authorization: Bearer {{token}}
```

**Request 3: Create Ticket**
```
POST {{base_url}}/api/tenants/{{tenant_slug}}/tickets
Headers:
  Authorization: Bearer {{token}}
Body (JSON):
{
  "title": "Novo Chamado",
  "category": "maintenance",
  "priority": "high"
}
```

---

## ⚠️ PROBLEMAS COMUNS

### **Erro: "ECONNREFUSED 127.0.0.1:5432"**

```
❌ Erro: connect ECONNREFUSED
```

**Solução:** PostgreSQL não está rodando

```powershell
# Windows - Iniciar PostgreSQL
net start postgresql-x64-15

# Ou abrir Services.msc e iniciar postgresql-x64-15
```

### **Erro: "database does not exist"**

```
❌ Erro: does not exist
```

**Solução:** Banco não foi criado

```powershell
# Criar manualmente
psql -U postgres -c "CREATE DATABASE syndika_db;"
```

### **Erro: "password authentication failed"**

```
❌ Erro: password authentication failed
```

**Solução:** Senha do PostgreSQL incorreta no `.env`

```powershell
# Verificar senha ou resetar
# Resetar senha (no psql):
ALTER USER postgres PASSWORD 'nova_senha';

# Depois atualizar .env
```

### **Erro: "port 4000 is already in use"**

```
❌ Erro: listen EADDRINUSE :::4000
```

**Solução:** Outra aplicação está usando porta 4000

```powershell
# Matar processo na porta 4000
netstat -ano | findstr :4000
taskkill /PID XXXX /F

# Ou usar porta diferente
# Editar .env: PORT=4001
```

### **Erro: "Cannot find module..."**

```
❌ Erro: Cannot find module 'express'
```

**Solução:** Dependências não foram instaladas

```powershell
npm install
```

---

## 🎯 PRÓXIMAS AÇÕES

Após instalação bem-sucedida:

### **1. Explorar a API**
- [ ] Testar endpoints com curl/Postman
- [ ] Ver em `TESTES.md` para exemplos completos
- [ ] Criar novos tickets, usuários, etc

### **2. Integrar com Frontend**
- [ ] Frontend React em `../SaaS Condominio`
- [ ] Atualizar CORS_ORIGIN se necessário
- [ ] Chamar endpoints da API pelo fetch/axios

### **3. Adicionar Dados Reais**
- [ ] Criar novo tenant (condomínio)
- [ ] Adicionar usuários reais
- [ ] Popular com dados do sistema

### **4. Customizar**
- [ ] Adicionar mais campos nas tabelas
- [ ] Criar novos endpoints
- [ ] Implementar validações
- [ ] Adicionar autenticação social

---

## 📚 DOCUMENTAÇÃO

Depois de instalar, ler em ordem:

1. **TESTES.md** (400+ linhas)
   - Como testar cada endpoint
   - Exemplos curl/PowerShell/Postman
   - Fluxo completo de teste

2. **FASE2.md** (600+ linhas)
   - Explicação técnica detalhada
   - Arquitetura multi-tenant
   - Schema do banco
   - Troubleshooting

3. **FASE2-MAPA.md** (500+ linhas)
   - Mapa completo da estrutura
   - Descrição de cada arquivo
   - Fluxos de negócio

4. **FASE2-SUMARIO.md**
   - Resumo visual do que foi criado
   - Checklist
   - Status geral

---

## 🆘 SUPORTE

Se não conseguir instalar:

1. **Verificar pré-requisitos:**
   ```powershell
   node --version    # Deve ser v18+
   npm --version     # Deve ser v9+
   psql --version    # Deve estar instalado
   ```

2. **Limpar cache npm:**
   ```powershell
   npm cache clean --force
   rm node_modules -r
   npm install
   ```

3. **Verificar porta:**
   ```powershell
   netstat -ano | findstr :4000
   ```

4. **Ver logs do servidor:**
   - Server roda em terminal que abriu
   - Logs mostram em tempo real
   - Erros aparecem em vermelho

5. **Consultar arquivo específico:**
   - `db/schema.sql` - Schema do banco
   - `src/index.ts` - Código principal
   - `.env.example` - Variáveis esperadas

---

## ✅ VALIDAÇÃO FINAL

Você sabe que tudo funcionou quando:

```
✅ npm run dev inicia sem erros
✅ GET /health retorna status ok
✅ POST /api/auth/login retorna token
✅ POST /api/tenants/esperanca/tickets cria ticket
✅ GET /api/tenants/esperanca/tickets lista tickets
```

---

## 🎉 CONCLUSÃO

Se chegou aqui: **PARABÉNS!** 🚀

Você tem um backend profissional funcionando localmente!

**Próximo passo:**
1. Explorar a API com TESTES.md
2. Integrar com frontend React
3. Customizar para seus dados

---

**Tempo de setup:** 10 minutos ⏱️  
**Dificuldade:** Iniciante 😊  
**Status:** Pronto para desenvolvimento 🚀


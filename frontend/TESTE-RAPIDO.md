# 🚀 TESTE RÁPIDO - Frontend + Backend

## ⚡ 3 PASSOS PARA TESTAR

### 1️⃣ Backend (Terminal 1)

```powershell
cd c:\Users\Emerson\Documents\syndika-api
npm run dev
```

✅ Aguarde: `Server running on http://localhost:4000`

---

### 2️⃣ Frontend (Terminal 2)

```powershell
cd "c:\Users\Emerson\Documents\SaaS Condominio"
npm run dev
```

✅ Aguarde: `Local: http://localhost:8080/`

---

### 3️⃣ Testar no Browser

1. **Abra:** http://localhost:8080/login

2. **Login:**
   - E-mail: `sindico@esperanca.com`
   - Senha: `senha123`
   - Clique em "Entrar"

3. **Dashboard:**
   - ✅ Veja tickets reais do banco
   - ✅ Números atualizados
   - ✅ Gráficos funcionando

4. **Criar Ticket:**
   - Vá para "Chamados"
   - Clique "Novo Chamado"
   - Preencha formulário
   - Clique "Criar"
   - ✅ Aparece na lista instantaneamente

---

## 🔍 VALIDAÇÃO RÁPIDA

### Console do Browser (F12)

**Deve aparecer:**
```
[AuthContext] Tentando login via API...
[API Response] 200 /api/auth/login
[AuthContext] Login via API bem-sucedido
[Dashboard] Usando tickets da API: 5
```

### Console do Backend

**Deve aparecer:**
```
POST /api/auth/login 200
GET /api/tenants/esperanca/tickets 200
```

### React Query Devtools

**Ícone flutuante no canto inferior esquerdo**
- Clique para expandir
- Veja query: `['tickets', 'list', {}]`
- Status: `success`

---

## 🐛 SE ALGO DER ERRADO

### Backend não inicia?
```powershell
# Verifique se PostgreSQL está rodando
# Teste: http://localhost:4000/health
```

### Frontend não carrega dados?
```powershell
# Verifique console do browser (F12)
# Veja se aparece erro de CORS ou Network
```

### Login não funciona?
```powershell
# Certifique-se que rodou:
cd c:\Users\Emerson\Documents\syndika-api
npm run db:seed
```

---

## ✅ TUDO FUNCIONANDO?

**Parabéns! Você tem:**

✅ Backend Node.js + PostgreSQL  
✅ Frontend React + TypeScript  
✅ Integração completa com JWT  
✅ React Query gerenciando estado  
✅ Dados sincronizados em tempo real  

**Próximo:** Veja `INTEGRACAO-FRONTEND-BACKEND.md` para testes avançados

---

**Tempo esperado:** 2-3 minutos  
**Dificuldade:** ⭐ Fácil

# 🚀 GUIA DE INSTALAÇÃO - SYNDIKA API

**Objetivo:** Setup completo do backend Node.js + TypeScript  
**Tempo Estimado:** 5-10 minutos  
**Data:** 02/02/2026

---

## 📝 Passo a Passo Completo

### **PASSO 1: Verificar Node.js instalado**

```powershell
# Windows PowerShell
node --version
npm --version

# Versões mínimas necessárias:
# Node.js ≥ 18.0.0
# npm ≥ 9.0.0
```

**Se não tiver Node.js:**
- Baixar em https://nodejs.org (LTS)
- Instalar
- Fechar e reabrir PowerShell

---

### **PASSO 2: Criar pasta do projeto**

```powershell
# Ir para Documents
cd $HOME\Documents

# Verificar que a pasta syndika-api já foi criada
ls -la syndika-api

# Entrar na pasta
cd syndika-api

# Verificar os arquivos (devem estar lá)
ls
```

**Arquivos esperados:**
```
package.json
tsconfig.json
.env.example
.gitignore
README.md
src/
  └── index.ts
```

---

### **PASSO 3: Instalar dependências**

```powershell
# Dentro de syndika-api/
npm install

# Isso vai:
# 1. Ler package.json
# 2. Baixar todas as dependências
# 3. Criar pasta node_modules/
# 4. Gerar package-lock.json
```

**Tempo:** ~30-60 segundos

**Output esperado:**
```
up to date, audited 45 packages in 2.5s
```

---

### **PASSO 4: Verificar instalação**

```powershell
# Verificar que node_modules foi criado
ls -la

# Verificar que dependências foram instaladas
npm list express cors dotenv typescript

# Output esperado: Pacotes listados com versões
```

---

### **PASSO 5: Criar arquivo .env (opcional, mas recomendado)**

```powershell
# Copiar .env.example para .env
Copy-Item .env.example .env

# Verificar que foi criado
ls .env
```

**Conteúdo padrão do .env:**
```env
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

---

### **PASSO 6: Rodar em desenvolvimento**

```powershell
# Comando mágico!
npm run dev

# Isso executa:
# ts-node-dev --respawn --transpile-only src/index.ts

# Saída esperada (logo abaixo):
```

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

[2026-02-02T10:30:00.000Z] GET /health
```

**✅ Se ver isso, o servidor está rodando!**

---

### **PASSO 7: Testar a API (novo terminal)**

```powershell
# Abrir outro PowerShell (o primeiro continua rodando)
# Ou use: Ctrl + Shift + ` no VSCode

# Teste 1: Health Check
curl http://localhost:4000/health

# Teste 2: Root
curl http://localhost:4000/

# Teste 3: API v1
curl http://localhost:4000/api/v1
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "service": "syndika-api",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2026-02-02T10:30:00.000Z"
}
```

---

### **PASSO 8: Testar no navegador**

1. Abrir navegador (Chrome, Edge, Firefox, etc)
2. Digitar: `http://localhost:4000/health`
3. Você verá o JSON formatado automaticamente!

**✅ Sucesso! O backend está funcionando!**

---

## 🎯 Validação Final

### ✅ Checklist de Sucesso

```
[✓] Node.js instalado
[✓] npm funcionando
[✓] Pasta syndika-api criada
[✓] package.json presente
[✓] npm install executado
[✓] node_modules criado (1000+ arquivos)
[✓] npm run dev executado sem erros
[✓] Servidor escutando em :4000
[✓] GET /health retorna JSON
[✓] Navegador abre http://localhost:4000/health com sucesso
```

---

## 🔄 Usar o Backend com Frontend React

### **Terminal 1: Backend (já rodando)**
```powershell
cd $HOME\Documents\syndika-api
npm run dev
# Escutando em http://localhost:4000
```

### **Terminal 2: Frontend**
```powershell
cd $HOME\Documents\'SaaS Condominio'
npm run dev
# Escutando em http://localhost:5173
```

### **Fazer requisições do Frontend**

No código React:
```typescript
// src/hooks/useApi.ts (exemplo)
const response = await fetch('http://localhost:4000/health', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});

const data = await response.json();
console.log(data); // Verá o JSON do backend!
```

---

## 📁 Estrutura Criada

```
syndika-api/
├── src/
│   └── index.ts                    # Servidor Express (88 linhas)
├── dist/                           # (gerado após npm run build)
├── node_modules/                   # (gerado após npm install)
├── package.json                    # Dependências e scripts
├── tsconfig.json                   # Configuração TypeScript
├── .env                            # Variáveis de ambiente (criar)
├── .env.example                    # Template .env
├── .gitignore                      # Git ignore rules
└── README.md                       # Documentação
```

---

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento com hot-reload (USAR ESTE!)
npm run build        # Compilar TypeScript → dist/
npm start            # Rodar versão compilada
npm run typecheck    # Validar tipos TypeScript
npm run lint         # Verificar código (ESLint)
```

---

## 🐛 Troubleshooting

### ❌ "npm: command not found"
```powershell
# Node.js não está instalado
# Solução: Instalar Node.js de https://nodejs.org
# Depois reabrir PowerShell
```

### ❌ "PORT 4000 already in use"
```powershell
# Outra aplicação está usando porta 4000
# Opção 1: Mudar porta no .env
# PORT=4001

# Opção 2: Matar o processo
Get-Process | Where-Object {$_.Port -eq 4000}
```

### ❌ "ENOENT: no such file or directory"
```powershell
# Certifique-se que está na pasta syndika-api/
cd $HOME\Documents\syndika-api
npm install
```

### ❌ "TypeScript error" ao rodar
```powershell
# Verificar tipos
npm run typecheck

# Se houver erro, verificar src/index.ts
# ou rodar novamente: npm install
```

---

## 📚 Arquivos Completos (Copiar/Colar se necessário)

### **package.json**
[Veja acima no README.md]

### **tsconfig.json**
[Veja acima no README.md]

### **src/index.ts**
[Veja acima no README.md]

---

## ✅ Próximos Passos

1. **✅ Setup completo** ← Você está aqui
2. Familiarizar com a estrutura
3. Entender arquitetura Express
4. Fase 3: Adicionar routes CRUD
5. Fase 3: Conectar PostgreSQL
6. Fase 3: Implementar autenticação

---

## 💡 Dicas Profissionais

### VSCode Extensions Recomendadas
- Thunder Client (testar API)
- Thunder Client REST Client
- Prettier (formatter)
- ESLint

### Hot-Reload
- Ao modificar `src/index.ts`, o servidor reinicia automaticamente
- Graças ao `ts-node-dev --respawn`
- Nenhum `npm run dev` necessário novamente!

### Debugging
```powershell
# Se quiser mais logs, adicione no .env:
LOG_LEVEL=debug
```

---

## 🎉 Parabéns!

Você agora tem um backend Node.js + TypeScript profissional rodando! 🚀

**Próximo:** Integrar com frontend React e criar rotas CRUD.

---

**Data:** 02/02/2026  
**Versão:** 1.0.0  
**Status:** Ready ✅


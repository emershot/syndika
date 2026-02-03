# 🚀 GUIA DE DESENVOLVIMENTO - SYNDIKA

**Versão:** 1.0.0  
**Atualizado:** 02/02/2026

---

## 📋 Índice

1. [Setup Inicial](#setup-inicial)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Desenvolvimento Local](#desenvolvimento-local)
4. [Convenções de Código](#convenções-de-código)
5. [Adicionar Novas Features](#adicionar-novas-features)
6. [Troubleshooting](#troubleshooting)

---

## 🛠️ Setup Inicial

### Pré-requisitos

```bash
# Verificar versão Node.js
node --version  # ≥ 18.0.0

# Verificar npm
npm --version   # ≥ 9.0.0
```

### Instalação

```bash
# 1. Clonar repositório
git clone <repo-url>
cd syndika

# 2. Instalar dependências
npm install

# 3. Verificar instalação
npm run build
```

### Configuração VSCode (Recomendado)

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### Extensões VSCode
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin

---

## 📁 Estrutura do Projeto

### Diretórios Principais

```
syndika/
├── src/
│   ├── App.tsx                    # Root component
│   ├── main.tsx                   # Vite entry
│   ├── index.css                  # Estilos globais
│   │
│   ├── components/                # Componentes
│   │   ├── dashboard/             # Dashboard específico
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DashboardFilters.tsx
│   │   │   ├── KPICard.tsx
│   │   │   ├── ChartCard.tsx
│   │   │   └── InsightCard.tsx
│   │   ├── common/                # Reutilizáveis
│   │   ├── forms/                 # Form components
│   │   ├── layout/                # Layout
│   │   └── ui/                    # Radix UI (30+)
│   │
│   ├── contexts/                  # Context API
│   │   ├── AuthContext.tsx
│   │   ├── useAuth.ts
│   │   ├── ThemeContext.tsx
│   │   ├── NotificationContext.tsx
│   │   └── TimezoneContext.tsx
│   │
│   ├── hooks/                     # Custom hooks
│   │   ├── useExport.ts
│   │   ├── useActivityLog.ts
│   │   ├── useKeyboardShortcuts.ts
│   │   ├── useLastUpdate.ts
│   │   └── ... (10+ total)
│   │
│   ├── pages/                     # Route pages
│   │   ├── Dashboard.tsx
│   │   ├── Tickets.tsx
│   │   ├── Reservations.tsx
│   │   ├── Announcements.tsx
│   │   ├── Residents.tsx
│   │   ├── Auditoria.tsx
│   │   ├── Settings.tsx
│   │   ├── Login.tsx
│   │   └── NotFound.tsx
│   │
│   ├── types/
│   │   └── condominium.ts         # Tipos (300+ linhas)
│   │
│   ├── lib/
│   │   ├── dashboardUtils.ts
│   │   ├── permissionUtils.ts
│   │   ├── validationSchemas.ts
│   │   ├── utils.ts
│   │   └── phoneUtils.ts
│   │
│   └── data/
│       └── mockData.ts
│
├── docs/                          # Documentação
│   ├── ARCHITECTURE.md
│   ├── COMPONENTS.md
│   ├── FEATURES.md
│   ├── DEVELOPMENT.md (você está aqui)
│   └── ROADMAP.md
│
├── public/                        # Assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
├── eslint.config.js
└── postcss.config.js
```

---

## 💻 Desenvolvimento Local

### Iniciar Servidor de Desenvolvimento

```bash
# Terminal 1: Vite dev server
npm run dev

# Output:
# ➜  Local:   http://localhost:5173/
# ➜  Press h + enter to show help

# Abrir no navegador: http://localhost:5173
```

### Build Otimizado

```bash
# Build para produção
npm run build

# Output: dist/ (pronto para deploy)

# Preview do build
npm run preview
```

### Linting e Verificação de Erros

```bash
# Verificar erros TypeScript
npx tsc --noEmit

# ESLint
npm run lint

# Ambos
npm run lint && npx tsc --noEmit
```

---

## 📝 Convenções de Código

### 1. TypeScript Strict Mode

```typescript
// ✅ BOM: Tipos explícitos
interface TicketProps {
  ticket: Ticket;
  onUpdate: (ticket: Ticket) => void;
}

// ❌ RUIM: Sem tipos
const MyComponent = (props: any) => {
  return <div />;
};
```

### 2. Naming Conventions

```typescript
// Componentes: PascalCase
function MyComponent() {}
export const DashboardFilter = () => {};

// Hooks: camelCase com 'use'
export function useTickets() {}
export function useDashboardAlerts() {}

// Utilities: camelCase
export const calculateDashboardStats = () => {};
export const cn = (...classes) => {};

// Constants: UPPER_SNAKE_CASE
const MAX_NOTIFICATIONS = 50;
const DEFAULT_TIMEOUT_MS = 3000;

// Tipos: PascalCase
interface Ticket { }
type TicketStatus = 'aberto' | 'resolvido';
```

### 3. File Organization

```
components/
├── dashboard/
│   ├── Dashboard.tsx          # Page component
│   ├── Dashboard.module.css   # Se necessário
│   ├── DashboardFilters.tsx
│   ├── KPICard.tsx
│   └── index.ts               # Exports (opcional)
```

### 4. Import Order

```typescript
// 1. React/externals
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. UI/components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// 3. Local components
import DashboardFilters from './DashboardFilters';
import KPICard from './KPICard';

// 4. Hooks/utils
import { useAuth } from '@/contexts/useAuth';
import { cn } from '@/lib/utils';

// 5. Types
import type { Ticket, Reservation } from '@/types/condominium';

// 6. Data/constants (last)
import { mockTickets } from '@/data/mockData';
```

### 5. Component Template

```typescript
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  title: string;
  children?: ReactNode;
  loading?: boolean;
  className?: string;
  onAction?: () => void;
}

/**
 * MyComponent - Brief description
 * 
 * @example
 * <MyComponent title="Hello" onAction={() => {}} />
 */
export function MyComponent({
  title,
  children,
  loading = false,
  className,
  onAction,
}: MyComponentProps) {
  return (
    <div className={cn('base-class', className)}>
      <h2>{title}</h2>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        children
      )}
      {onAction && (
        <button onClick={onAction}>Action</button>
      )}
    </div>
  );
}
```

### 6. Styling Guidelines

```typescript
// ✅ BOM: Usar Tailwind
<div className="flex items-center justify-between gap-4 p-4 rounded-lg border">
  <h3 className="text-lg font-semibold">Title</h3>
  <Button>Action</Button>
</div>

// ✅ BOM: Variações com cn()
const baseClass = "flex items-center gap-2";
const variantClass = variant === 'danger' ? 'text-destructive' : 'text-primary';
<div className={cn(baseClass, variantClass)} />

// ❌ RUIM: Inline styles
<div style={{ display: 'flex', gap: '16px' }}>

// ❌ RUIM: CSS modules sem necessidade
// Usar CSS modules apenas para:
// - Animações complexas
// - Estilos dinâmicos em runtime
```

### 7. Error Handling

```typescript
// ✅ BOM: Try-catch com types
try {
  const result = await apiCall();
  return result;
} catch (error) {
  if (error instanceof TypeError) {
    // Handle type error
  } else if (error instanceof Error) {
    console.error(error.message);
  }
  throw error;
}

// ✅ BOM: Validação com Zod
const result = createTicketSchema.safeParse(data);
if (!result.success) {
  console.error(result.error.errors);
  return;
}

// ❌ RUIM: Catch genérico
try {
  // ...
} catch (e) {
  console.log('error');
}
```

---

## 🆕 Adicionar Novas Features

### Exemplo: Criar Nova Page (Status)

#### 1. Criar tipos (src/types/condominium.ts)

```typescript
export interface Status {
  id: string;
  condominiumId: string;
  name: string;
  color: string;
  createdAt: Date;
}
```

#### 2. Criar mock data (src/data/mockData.ts)

```typescript
export const mockStatuses: Status[] = [
  {
    id: 'status-1',
    condominiumId: 'condo-1',
    name: 'Ativo',
    color: '#10b981',
    createdAt: new Date(),
  },
  // ...
];
```

#### 3. Criar validation schema (src/lib/validationSchemas.ts)

```typescript
import { z } from 'zod';

export const createStatusSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
});

export type CreateStatusInput = z.infer<typeof createStatusSchema>;
```

#### 4. Criar page component (src/pages/Status.tsx)

```typescript
import { AppLayout } from '@/components/layout/AppLayout';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/useAuth';
import { useState } from 'react';
import { mockStatuses } from '@/data/mockData';
import type { Status } from '@/types/condominium';

export default function StatusPage() {
  const { user } = useAuth();
  const [statuses, setStatuses] = useLocalStorage<Status[]>('syndika_statuses', mockStatuses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState({ name: '', color: '#000000' });

  const handleCreate = () => {
    const status: Status = {
      id: `status-${Date.now()}`,
      condominiumId: 'condo-1',
      name: newStatus.name,
      color: newStatus.color,
      createdAt: new Date(),
    };

    setStatuses([status, ...statuses]);
    setIsDialogOpen(false);
    setNewStatus({ name: '', color: '#000000' });
  };

  const columns = [
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'color', label: 'Cor' },
    { key: 'createdAt', label: 'Criado em', sortable: true },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Status</h1>
          <Button onClick={() => setIsDialogOpen(true)}>Novo Status</Button>
        </div>

        <DataTable
          columns={columns}
          data={statuses}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome"
              value={newStatus.name}
              onChange={(e) => setNewStatus({ ...newStatus, name: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="color"
              value={newStatus.color}
              onChange={(e) => setNewStatus({ ...newStatus, color: e.target.value })}
              className="w-full"
            />
            <Button onClick={handleCreate} className="w-full">
              Criar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
```

#### 5. Adicionar rota (src/App.tsx)

```typescript
import StatusPage from './pages/Status';

// Em routes:
{
  path: '/status',
  element: <StatusPage />,
},
```

#### 6. Adicionar link na navbar (src/components/layout/Sidebar.tsx)

```typescript
<NavLink to="/status" icon={<Settings />}>
  Status
</NavLink>
```

---

## 🐛 Troubleshooting

### Erro: "Module not found"

```bash
# Verificar imports
# ✅ Correto
import { Button } from '@/components/ui/button';

# ❌ Errado
import Button from '@/components/ui/button';  // Button é nomeado export
```

### Erro: "Cannot find module" após npm install

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### TypeScript Error: "Property does not exist"

```typescript
// ❌ Erro
const ticket: Ticket = { /* ... */ };
console.log(ticket.invalidProperty);

// ✅ Solução: Verificar tipos
interface Ticket {
  id: string;
  title: string;
  // invalidProperty não existe aqui
}
```

### Tailwind Classes Não Funcionam

```bash
# Verificar tailwind.config.ts
# content deve incluir todos os arquivos

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',  // ✅ Importante
  ],
};

# Ou, reconstruir CSS
npm run build
```

### Erro de Build em Produção

```bash
# Verificar erros TypeScript
npx tsc --noEmit

# Verificar ESLint
npm run lint

# Limpar dist
rm -rf dist
npm run build
```

---

## 🔍 Debugging

### Browser DevTools

```typescript
// Console
console.log('Value:', myVar);
console.error('Error:', error);
console.warn('Warning:', warning);
console.table(data);

// React DevTools (extensão)
// Inspecionar componentes, props, state

// Redux DevTools (futuro)
// Monitorar state management
```

### VSCode Debugging

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

---

## 📦 Dependências Principais

### Para Adicionar Novo Pacote

```bash
# Adicionar
npm install package-name

# Remover
npm uninstall package-name

# Atualizar
npm update package-name

# Verificar versões desatualizadas
npm outdated
```

### Pacotes Recomendados (Não Instalados)

```bash
# Animações
npm install framer-motion

# API HTTP
npm install axios

# State management avançado
npm install zustand

# Testing
npm install vitest @testing-library/react

# Type checking
npm install prettier
```

---

## 📋 Checklist para Novo Commit

Antes de fazer push:

```bash
# ✅ Verificar tipos
npx tsc --noEmit

# ✅ Linting
npm run lint

# ✅ Build
npm run build

# ✅ Testar manualmente
npm run dev

# ✅ Git
git add .
git commit -m "feat: descrição clara"
git push
```

---

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Seguir prompts
```

### GitHub Pages

```bash
# Adicionar ao package.json
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

---

## 📚 Referências Úteis

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Components](https://radix-ui.com/docs/primitives/overview/introduction)
- [Vite Documentation](https://vitejs.dev)
- [ESLint Rules](https://eslint.org/docs/rules)

---

## 💡 Tips & Tricks

### Fast Refresh
Vite suporta Hot Module Replacement (HMR). Salve um arquivo e ele atualiza automaticamente.

### VS Code Shortcuts
- `Ctrl + K Ctrl + X`: Remover espaços em branco
- `Ctrl + Shift + P`: Paleta de comandos
- `Ctrl + /`: Toggle comentário
- `Ctrl + D`: Próxima ocorrência

### Git Aliases
```bash
# Adicionar no ~/.bashrc ou ~/.zshrc
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline -10'
```

---

**Versão:** 1.0.0  
**Atualizado:** 02/02/2026  
**Próxima Review:** 16/02/2026


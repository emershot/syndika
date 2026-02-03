# 📐 ARQUITETURA TÉCNICA - SYNDIKA

**Versão:** 1.0.0  
**Atualizado:** 02/02/2026

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura em Camadas](#arquitetura-em-camadas)
3. [Context API](#context-api)
4. [Custom Hooks](#custom-hooks)
5. [Padrões de Dados](#padrões-de-dados)
6. [Fluxo de Dados](#fluxo-de-dados)
7. [Estrutura de Tipos](#estrutura-de-tipos)
8. [Performance & Otimizações](#performance--otimizações)

---

## 🎯 Visão Geral

SYNDIKA utiliza uma arquitetura **component-based** com **Context API** para state management, seguindo as melhores práticas de React moderno.

```
User Interface Layer (React Components)
        ↓
State Management Layer (Context + Hooks)
        ↓
Business Logic Layer (Custom Hooks + Utils)
        ↓
Data Layer (localStorage Mock / Future: REST API)
```

---

## 🏗️ Arquitetura em Camadas

### Layer 1: Presentation Layer
**Localização:** `src/components/` e `src/pages/`

#### Pages (Routes)
```typescript
// src/pages/Dashboard.tsx (728 linhas)
- Componente principal com lógica complexa
- 11 useMemo para memoização
- 4 gráficos Recharts
- 11 KPIs calculados dinamicamente
- Filtros de data range
- Drill-down modals

// src/pages/Tickets.tsx
- CRUD de tickets
- Comentários em tempo real
- Filtros multi-select
- Sorting dinâmico
- Validação Zod

// src/pages/Reservations.tsx
- Solicitar/aprovar/rejeitar reservas
- Mini calendário com conflitos
- Validações de horário
- Timeline de aprovações

// src/pages/Announcements.tsx
- Publicar avisos
- Filtros por tipo
- Controle de permissões
```

#### Components (UI + Features)
```
components/
├── dashboard/         # Dashboard-specific
├── common/           # Reutilizáveis
├── forms/            # Form components
├── layout/           # Layout structure
└── ui/               # Radix UI primitives (30+)
```

### Layer 2: State Management Layer
**Localização:** `src/contexts/`

```typescript
// AuthContext.tsx
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

// ThemeContext.tsx
export interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  systemTheme: 'light' | 'dark';
  effectiveTheme: 'light' | 'dark';
}

// NotificationContext.tsx
export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

// TimezoneContext.tsx
export interface TimezoneContextType {
  timezone: string;
  setTimezone: (tz: string) => void;
  localTime: Date;
}
```

### Layer 3: Business Logic Layer
**Localização:** `src/hooks/`

```typescript
// useAuth.ts - 1 arquivo
// Acesso ao contexto de autenticação

// useNotifications.ts - 1 arquivo
// Gerenciar notificações (toast center)

// useActivityLog.ts (154 linhas)
// Logging de atividades com tipagem forte
- logTicketCreated()
- logTicketUpdated()
- logReservationApproved()
- logAnnouncementDeleted()
- E mais 10+

// useEmailService.ts (208 linhas)
// Simulação de envio de emails
- sendTicketCreatedEmail()
- sendReservationApprovedEmail()
- sendAnnouncementPublishedEmail()
- getEmailHistory()

// useExport.ts (147 linhas)
// Export CSV e PDF
- exportTicketsToCSV()
- exportReservationsToCSV()
- exportTicketsToCSV()
- exportAnnouncementsToPDF()

// useReservationValidator.ts (177 linhas)
// Validações complexas de reserva
- validateReservation()
- isStartTimeValid()
- isEndTimeValid()
- hasConflict()
- getAvailableSlots()

// useKeyboardShortcuts.ts
// Atalhos globais (R, F, E, ?)

// useLastUpdate.ts
// Timestamp de última atualização

// useDashboardAlerts.ts
// Alertas inteligentes do dashboard

// usePushNotifications.ts (Future)
// Notificações push

// useFormError.ts
// Tratamento de erros em formulários

// useLocalStorage.ts
// Hook persistência localStorage

// use-mobile.tsx
// Detectar device mobile
```

### Layer 4: Data Layer
**Localização:** `src/lib/` e `src/data/`

```typescript
// src/lib/dashboardUtils.ts (184 linhas)
// Cálculos e transformações
- calculateDashboardStats()
- calculateTrend()
- getTicketStatusTrendData()
- getTicketPriorityDistribution()
- getAnnouncementTypeDistribution()
- getTicketResolutionTimeDistribution()

// src/lib/permissionUtils.ts
// Verificação de permissões
- canCreateTicket()
- canApproveReservation()
- canCreateAnnouncement()
- canAccessAuditoria()

// src/lib/validationSchemas.ts
// Zod schemas para validação
- createTicketSchema
- updateTicketSchema
- createReservationSchema
- createAnnouncementSchema

// src/lib/utils.ts
// Utilidades
- cn() - merge classnames

// src/data/mockData.ts
// Dados mock para desenvolvimento
- mockUsers (3 perfis)
- mockTickets (10+)
- mockReservations (8+)
- mockAnnouncements (5+)
- mockUnits (5 apartamentos)
```

---

## 🔄 Context API

### 1. AuthContext

```typescript
// src/contexts/AuthContext.tsx
interface User {
  id: string;
  name: string;
  email: string;
  role: 'residente' | 'sindico' | 'gerente';
  unitNumber?: string;
  avatar?: string;
}

type Permission = 
  | 'create_ticket'
  | 'update_ticket'
  | 'delete_ticket'
  | 'approve_reservation'
  | 'create_announcement'
  | 'view_auditoria'
  | 'manage_residents';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  hasPermission: (permission: Permission) => boolean;
}
```

**Como usar:**
```typescript
const { user, login, logout, hasPermission } = useAuth();

// Verificar role
if (user?.role === 'sindico') { /* ... */ }

// Verificar permissão específica
if (hasPermission('approve_reservation')) { /* ... */ }
```

**Implementação:**
- localStorage: `syndika_user` (persistência)
- Mock users com 3 perfis
- Simulação de login/logout
- Verificação de permissões dinâmica

---

### 2. ThemeContext

```typescript
// src/contexts/ThemeContext.tsx
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  systemTheme: 'light' | 'dark'; // Sistema operacional
  effectiveTheme: 'light' | 'dark'; // Tema ativo
  isDark: boolean; // Conveniência
}
```

**Recursos:**
- Detecção automática de preferência do sistema
- Toggle manual light/dark
- Persistência em localStorage
- 100% coverage com Tailwind dark mode
- CSS class `dark` no root

**Como usar:**
```typescript
const { theme, setTheme, isDark } = useTheme();

// Mudar tema
setTheme('dark');

// Aplicar estilos
<div className={isDark ? 'bg-slate-900' : 'bg-white'} />
```

---

### 3. NotificationContext

```typescript
interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'destructive';
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  duration?: number; // ms
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (config: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  markAsRead: (id: string) => void;
}
```

**Localização:** `src/contexts/NotificationContext.tsx`

**Como usar:**
```typescript
const { addNotification } = useNotifications();

addNotification({
  type: 'success',
  title: 'Ticket criado!',
  description: 'ID: ticket-123',
  duration: 3000,
});
```

---

### 4. TimezoneContext

**Status:** Futuro para internacionalização

---

## 🎣 Custom Hooks

### useAuth()

```typescript
// src/contexts/useAuth.tsx
function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### useNotifications()

```typescript
// src/hooks/useNotifications.ts
export function useNotifications() {
  const context = useContext(NotificationContext);
  
  return {
    notifications: context.notifications,
    addNotification: context.addNotification,
    removeNotification: context.removeNotification,
  };
}
```

### useLocalStorage()

```typescript
// src/hooks/useLocalStorage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
```

### useExport()

```typescript
// src/hooks/useExport.ts
export function useExport() {
  const exportToCSV = useCallback((data: any[], filename: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}-${Date.now()}.csv`;
    link.click();
  }, []);

  const exportToPDF = useCallback((data: any[], title: string, columns: any[]) => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [columns.map(c => c.label)],
      body: data.map(row => columns.map(c => row[c.key])),
      title,
    });
    doc.save(`${title}-${Date.now()}.pdf`);
  }, []);

  return { exportToCSV, exportToPDF };
}
```

### useActivityLog()

```typescript
// src/hooks/useActivityLog.ts
export function useActivityLog() {
  const logActivity = useCallback((
    userId: string,
    userName: string,
    action: string,
    entityType: string,
    entityId: string,
    metadata?: object
  ) => {
    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      userId,
      userName,
      action,
      entityType,
      entityId,
      timestamp: new Date(),
      metadata,
    };

    // Store em localStorage
    const logs = JSON.parse(localStorage.getItem('syndika_activity_log') || '[]');
    logs.push(log);
    localStorage.setItem('syndika_activity_log', JSON.stringify(logs));

    return log;
  }, []);

  const logTicketCreated = useCallback((
    userId: string,
    userName: string,
    ticket: Ticket
  ) => {
    return logActivity(userId, userName, 'create', 'ticket', ticket.id, {
      title: ticket.title,
      priority: ticket.priority,
    });
  }, [logActivity]);

  // ... mais 15+ funções específicas

  return {
    logActivity,
    logTicketCreated,
    logTicketUpdated,
    logReservationApproved,
    // ...
  };
}
```

### useKeyboardShortcuts()

```typescript
// src/hooks/useKeyboardShortcuts.ts
export function useKeyboardShortcuts() {
  const { addNotification } = useNotifications();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorar se em input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'r':
          window.location.reload();
          break;
        case 'f':
          // Focus filters
          document.querySelector('[data-focus-filters]')?.focus();
          break;
        case 'e':
          // Open export menu
          document.querySelector('[data-export-menu]')?.click();
          break;
        case '?':
          // Show help
          addNotification({
            type: 'info',
            title: 'Atalhos de Teclado',
            description: 'R=Refresh, F=Filters, E=Export, ?=Help',
          });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addNotification]);
}
```

---

## 📊 Padrões de Dados

### Ticket Flow
```
User fills form
  ↓ Validation (Zod)
  ↓ Create ticket object
  ↓ Save to localStorage
  ↓ Update Dashboard stats (useMemo)
  ↓ Trigger notification
  ↓ Log activity
  ↓ Send email (mock)
  ↓ UI reflects changes
```

### Reservation Flow
```
User selects date/time
  ↓ Validate against hours (area openTime/closeTime)
  ↓ Check for conflicts
  ↓ Submit request
  ↓ Status = 'solicitada'
  ↓ Síndico receives notification
  ↓ Síndico approves/rejects
  ↓ User receives email notification
  ↓ Activity logged
  ↓ Dashboard updated
```

### Notification Flow
```
Action triggered (ticket created, reservation approved, etc)
  ↓ useNotificationTrigger() creates notification object
  ↓ addNotification() adds to context
  ↓ NotificationContext updates
  ↓ Components re-render
  ↓ Toast appears
  ↓ After 3-5s, auto-dismiss
  ↓ History maintained in localStorage
```

---

## 🔄 Fluxo de Dados

### 1. Dados → Store → UI

```typescript
// Mock data -> localStorage
const [tickets, setTickets] = useLocalStorage<Ticket[]>('syndika_tickets', mockTickets);

// Update on user action
const newTicket: Ticket = { ... };
setTickets([newTicket, ...tickets]);

// localStorage automatically syncs
```

### 2. UI Update → Trigger Notification

```typescript
// Criar ticket
const ticket = { ... };
setTickets([ticket, ...tickets]);

// Notificar
const notification = ticketCreated(ticket);
addNotification(notification);

// Log activity
logTicketCreated(user?.id || '', user?.name || '', ticket);
```

### 3. Real-time Memoization

```typescript
// Dashboard.tsx
const stats = useMemo(() => 
  calculateDashboardStats(tickets, announcements, reservations),
  [tickets, announcements, reservations]
);

// Quando tickets mudam → stats recalculam → UI atualiza
```

---

## 🏷️ Estrutura de Tipos

### Core Types (src/types/condominium.ts)

```typescript
// ===== USERS & AUTH =====
interface User {
  id: string;
  name: string;
  email: string;
  role: 'residente' | 'sindico' | 'gerente';
  unitNumber?: string;
  avatar?: string;
}

type Permission = 
  | 'create_ticket'
  | 'update_ticket'
  | 'delete_ticket'
  | 'approve_reservation'
  | 'create_announcement'
  | 'view_auditoria'
  | 'manage_residents';

// ===== TICKETS (Chamados) =====
type TicketStatus = 'aberto' | 'em_andamento' | 'aguardando' | 'resolvido' | 'arquivado';
type TicketPriority = 'baixa' | 'media' | 'alta' | 'urgente';
type TicketCategory = 'manutencao' | 'reparo' | 'limpeza' | 'seguranca';

interface TicketComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

interface Ticket {
  id: string;
  condominiumId: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  location?: string;
  assignedTo?: string;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
  comments?: TicketComment[];
}

// ===== RESERVATIONS (Áreas Comuns) =====
type ReservationStatus = 'solicitada' | 'aprovada' | 'recusada' | 'cancelada';

interface Reservation {
  id: string;
  condominiumId: string;
  commonAreaId: string;
  commonAreaName: string;
  unitId: string;
  unitNumber: string;
  requestedBy: string;
  requestedByName: string;
  date: Date;
  startTime: string;
  endTime: string;
  purpose?: string;
  status: ReservationStatus;
  approvedBy?: string;
  approvedByName?: string;
  approvalDate?: Date;
  rejectedBy?: string;
  rejectedByName?: string;
  rejectionDate?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===== ANNOUNCEMENTS (Avisos) =====
type AnnouncementType = 'urgente' | 'importante' | 'informativo';

interface Announcement {
  id: string;
  condominiumId: string;
  title: string;
  content: string;
  type: AnnouncementType;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===== RESIDENTS (Moradores) =====
interface Resident {
  id: string;
  condominiumId: string;
  name: string;
  email: string;
  phone: string;
  unitId: string;
  unitNumber: string;
  role: 'residente' | 'sindico' | 'gerente';
  createdAt: Date;
  updatedAt: Date;
}

// ===== COMMON AREAS =====
interface CommonArea {
  id: string;
  condominiumId: string;
  name: string;
  description?: string;
  openTime: string; // HH:mm
  closeTime: string; // HH:mm
  capacity?: number;
  image?: string;
}

// ===== DASHBOARD =====
interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  totalReservations: number;
  pendingReservations: number;
  approvedReservations: number;
  avgResolutionTime: number;
  ticketsByCategory: Record<TicketCategory, number>;
  reservationsByArea: Record<string, number>;
}

// ===== NOTIFICATIONS =====
type NotificationType = 'info' | 'warning' | 'urgent' | 'system';
type NotificationAction = 
  | 'announcement_created'
  | 'ticket_created'
  | 'ticket_status_changed'
  | 'reservation_status_changed'
  | 'resident_created'
  | 'system';

interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  action: NotificationAction;
  title: string;
  message: string;
  relatedId?: string;
  relatedType?: 'announcement' | 'ticket' | 'reservation' | 'resident';
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

// ===== ACTIVITY LOG =====
interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string; // 'create', 'update', 'delete', 'approve', 'reject'
  entityType: string; // 'ticket', 'reservation', 'announcement', 'resident'
  entityId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
```

---

## ⚡ Performance & Otimizações

### 1. Memoization (Dashboard.tsx)

```typescript
// 11 useMemo para evitar recálculos desnecessários

const stats = useMemo(() => 
  calculateDashboardStats(tickets, announcements, reservations),
  [tickets, announcements, reservations]
);

const urgentTickets = useMemo(() => 
  tickets.filter(t => t.priority === 'urgente').length,
  [tickets]
);

const chartData = useMemo(() => 
  getTicketStatusTrendData(filteredTickets),
  [filteredTickets]
);

// ... e mais 8
```

### 2. Lazy Component Loading

```typescript
// React.lazy() para code splitting (future)
const Auditoria = React.lazy(() => import('../pages/Auditoria'));

<Suspense fallback={<LoadingSkeleton />}>
  <Auditoria />
</Suspense>
```

### 3. Event Delegation

```typescript
// Usar event delegation em listas grandes
<div onClick={(e) => {
  const ticketId = (e.target as HTMLElement).closest('[data-ticket-id]')?.getAttribute('data-ticket-id');
  if (ticketId) handleTicketClick(ticketId);
}}>
  {tickets.map(ticket => (
    <div key={ticket.id} data-ticket-id={ticket.id}>
      {/* ... */}
    </div>
  ))}
</div>
```

### 4. localStorage Optimization

```typescript
// Usar JSON.stringify() uma vez
const data = { tickets, reservations, announcements };
localStorage.setItem('syndika_bulk', JSON.stringify(data));

// Ao invés de:
localStorage.setItem('tickets', JSON.stringify(tickets));
localStorage.setItem('reservations', JSON.stringify(reservations));
localStorage.setItem('announcements', JSON.stringify(announcements));
```

### 5. Build Optimization

```typescript
// Tailwind: Purge CSS não utilizado
// Recharts: Tree-shaking dos gráficos não usados
// Radix UI: Import apenas componentes necessários
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Não import all
```

---

## 🔐 Segurança

### Estratégias Implementadas

1. **Type Safety:** TypeScript strict mode
2. **Input Validation:** Zod schemas
3. **RBAC:** Role-based access control
4. **XSS Prevention:** React auto-escaping
5. **CSRF:** localStorage token validation (future)
6. **Data Sanitization:** Sanitize user inputs

---

## 📈 Escalabilidade Futura

### Preparações para Backend

```typescript
// Infraestrutura pronta para migração

// 1. Separar mock data
src/data/mockData.ts → Será substituído por API calls

// 2. Abstract data layer
src/lib/api.ts (será criado)
export const ticketAPI = {
  create: (ticket: Ticket) => fetch('/api/tickets', { method: 'POST', body: JSON.stringify(ticket) }),
  list: () => fetch('/api/tickets'),
  update: (id: string, ticket: Partial<Ticket>) => fetch(`/api/tickets/${id}`, { method: 'PUT' }),
  delete: (id: string) => fetch(`/api/tickets/${id}`, { method: 'DELETE' }),
};

// 3. React Query ready
import { useQuery, useMutation } from '@tanstack/react-query';

export function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketAPI.list(),
  });
}
```

---

## 📚 Referências

- [React Hooks Documentation](https://react.dev)
- [Zod Validation](https://zod.dev)
- [Radix UI Primitives](https://radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts Documentation](https://recharts.org)

---

**Versão:** 1.0.0  
**Atualizado:** 02/02/2026  
**Próxima Review:** 16/02/2026


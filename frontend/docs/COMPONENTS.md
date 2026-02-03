# 🧩 COMPONENTES - SYNDIKA

**Versão:** 1.0.0  
**Atualizado:** 02/02/2026

---

## 📋 Índice

1. [Dashboard Components](#dashboard-components)
2. [Layout Components](#layout-components)
3. [Common Components](#common-components)
4. [Form Components](#form-components)
5. [UI Primitives](#ui-primitives)
6. [Componentes Customizados](#componentes-customizados)

---

## 🎛️ Dashboard Components

### Dashboard.tsx (728 linhas)

**Localização:** `src/pages/Dashboard.tsx`  
**Status:** ✅ Production-Ready  
**Complexidade:** Alta (11 useMemo, 4 gráficos)

#### Características
- 11 KPIs (Total Chamados, Abertos, Em Andamento, Resolvidos, Taxa Resolução, etc)
- 4 Gráficos (Evolução, Prioridades, Tempo Resolução, Avisos por Tipo)
- Filtro de data range (1/7/30/90/365 dias + customizado)
- Drill-down modals para exploração
- Alerts inteligentes
- Última atualização timestamp

#### Estrutura
```tsx
<AppLayout>
  {/* Header com data range */}
  <DashboardFilters />
  
  {/* Insights */}
  <InsightCard[] />
  
  {/* KPIs */}
  <KPICard[] />
  
  {/* Charts em grid 2x2 */}
  <ChartCard>
    <LineChart /> {/* Evolução */}
  </ChartCard>
  <ChartCard>
    <PieChart /> {/* Prioridades */}
  </ChartCard>
  <ChartCard>
    <BarChart /> {/* Tempo Resolução */}
  </ChartCard>
  <ChartCard>
    <BarChart /> {/* Avisos por Tipo */}
  </ChartCard>
  
  {/* Listas */}
  <RecentTickets />
  <PendingReservations />
  
  {/* Modals */}
  <DrilldownModal />
  <DateRangePickerModal />
</AppLayout>
```

#### Props
Nenhuma (page component)

#### Hooks Utilizados
```typescript
useAuth()
useLocalStorage()
useMemo (11x)
useState (5x)
useCallback (1x)
useNotifications()
useDashboardAlerts()
useLastUpdate()
useKeyboardShortcuts()
```

#### Dados Utilizados
```typescript
tickets: Ticket[]
announcements: Announcement[]
reservations: Reservation[]
stats: DashboardStats
```

---

### DashboardFilters.tsx

**Localização:** `src/components/dashboard/DashboardFilters.tsx`  
**Status:** ✅ Production-Ready

#### Props
```typescript
interface DashboardFiltersProps {
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  onDateRangeCustom?: (startDate: Date, endDate: Date) => void;
  onRefresh?: () => void;
  onExport?: (format: 'csv' | 'pdf') => void;
  isLoading?: boolean;
  className?: string;
}
```

#### Características
- Select com 5 opções pré-definidas
- Customizado com calendário duplo (DateRangePickerModal)
- Botão refresh com loading spinner
- Dropdown export (CSV/PDF) com Radix DropdownMenu
- Responsivo (oculta textos em mobile)

#### Uso
```tsx
<DashboardFilters
  dateRange={dateRange}
  onDateRangeChange={setDateRange}
  onDateRangeCustom={handleCustomDate}
  onRefresh={() => window.location.reload()}
  onExport={handleExport}
  isLoading={refreshing}
/>
```

---

### KPICard.tsx

**Localização:** `src/components/dashboard/KPICard.tsx`  
**Status:** ✅ Production-Ready

#### Props
```typescript
interface KPICardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon?: ReactNode;
  trend?: number; // % de mudança
  trendLabel?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}
```

#### Características
- Exibição de métrica com valor grande
- Ícone customizável (lucide-react)
- Trend indicator (↑ ou ↓ com %)
- Click handler para drill-down
- Variantes de cor
- Skeleton loading

#### Exemplo
```tsx
<KPICard
  title="Chamados Abertos"
  value={stats.openTickets}
  icon={<AlertCircle />}
  trend={-12}
  trendLabel="vs última semana"
  onClick={() => openDrilldown('openTickets')}
/>
```

---

### ChartCard.tsx

**Localização:** `src/components/dashboard/ChartCard.tsx`  
**Status:** ✅ Production-Ready

#### Props
```typescript
interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: string;
  className?: string;
  loading?: boolean;
}
```

#### Características
- Container para gráficos Recharts
- Título e descrição
- Footer com informação adicional
- Skeleton loading
- Consistência visual

#### Exemplo
```tsx
<ChartCard
  title="Evolução de Chamados"
  description="Últimos 30 dias"
  footer="Dados atualizados em tempo real"
>
  <LineChart data={chartData}>
    {/* ... */}
  </LineChart>
</ChartCard>
```

---

### InsightCard.tsx

**Localização:** `src/components/dashboard/InsightCard.tsx`  
**Status:** ✅ Production-Ready (Enhanced)

#### Props
```typescript
interface InsightCardProps {
  type: 'info' | 'warning' | 'success' | 'tip';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}
```

#### Características
- 4 tipos com cores distintas
- Ícone e badge
- Descrição opcional
- Botão de ação
- Dark mode suportado
- Border-2 para destaque
- Hover effects

#### Exemplo
```tsx
<InsightCard
  type="warning"
  title="Chamados Urgentes"
  description={`${urgentCount} chamados aguardando atendimento`}
  action={{
    label: 'Ver Todos',
    onClick: () => navigate('/tickets?filter=urgente'),
  }}
/>
```

---

### DateRangePickerModal.tsx

**Localização:** `src/components/dashboard/DateRangePickerModal.tsx`  
**Status:** ✅ Production-Ready

#### Props
```typescript
interface DateRangePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (startDate: Date, endDate: Date) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
}
```

#### Características
- Calendário duplo (date-fns + react-day-picker)
- Seleção de período
- Validação de datas
- Botões confirmar/cancelar
- Locale pt-BR

#### Uso
```tsx
<DateRangePickerModal
  open={showCustomDatePicker}
  onOpenChange={setShowCustomDatePicker}
  onConfirm={handleCustomDateConfirm}
/>
```

---

### DrilldownModal.tsx

**Localização:** `src/components/common/DrilldownModal.tsx`  
**Status:** ✅ Production-Ready

#### Props
```typescript
interface DrilldownModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'tickets' | 'reservations' | 'announcements';
  title: string;
  data: any[];
}
```

#### Características
- Modal para explorar dados do KPI
- Tabela interna com dados filtrados
- Paginação
- Search
- Close button

---

### LastUpdateDisplay.tsx

**Localização:** `src/components/dashboard/LastUpdateDisplay.tsx`  
**Status:** ✅ Production-Ready

#### Props
```typescript
interface LastUpdateDisplayProps {
  timestamp?: Date;
  className?: string;
}
```

#### Características
- Exibe "Atualizado há X minutos"
- Atualização automática a cada 30s
- Refresh automático de dados
- Locale pt-BR

#### Exemplo
```tsx
<LastUpdateDisplay timestamp={lastUpdate} />
// Output: "Atualizado há 5 minutos"
```

---

## 🎨 Layout Components

### AppLayout.tsx

**Localização:** `src/components/layout/AppLayout.tsx`  
**Status:** ✅ Production-Ready

#### Props
```typescript
interface AppLayoutProps {
  children: ReactNode;
  className?: string;
}
```

#### Estrutura
```tsx
<div className="flex h-screen">
  <Sidebar /> {/* Navegação lateral */}
  <div className="flex-1 flex flex-col">
    <Header /> {/* Logo, breadcrumb */}
    <main className="flex-1 overflow-auto">
      {children}
    </main>
  </div>
</div>
```

---

### Sidebar.tsx

**Localização:** `src/components/layout/Sidebar.tsx`  
**Status:** ✅ Production-Ready

#### Características
- Navegação principal
- Links para todas as páginas
- Theme toggle
- User profile dropdown
- Logout button
- Logo/branding
- Responsivo (collapse em mobile)

#### Links Disponíveis
- Dashboard
- Tickets
- Reservations
- Announcements
- Residents
- Auditoria
- Settings

---

### NotificationBell.tsx

**Localização:** `src/components/layout/NotificationBell.tsx`  
**Status:** ✅ Production-Ready

#### Características
- Ícone de sino com badge de contagem
- Dropdown com histórico
- Mark as read / Clear all
- Filtros por tipo
- Timestamps relativos

---

## 📋 Common Components

### DataTable.tsx

**Localização:** `src/components/common/DataTable.tsx`  
**Status:** ✅ Production-Ready

#### Props
```typescript
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  paginationSize?: number;
  loading?: boolean;
  emptyMessage?: string;
}
```

#### Características
- Sorting por coluna
- Search/filtro
- Paginação customizável
- Multi-select
- Row click handlers
- Skeleton loading
- Empty state

---

### AlertComponent.tsx

**Localização:** `src/components/common/AlertComponent.tsx`  
**Status:** ✅ Production-Ready

#### Tipos
```typescript
type AlertType = 'info' | 'warning' | 'error' | 'success';
```

#### Props
```typescript
interface AlertComponentProps {
  type: AlertType;
  title: string;
  message?: string;
  onClose?: () => void;
  dismissible?: boolean;
  action?: { label: string; onClick: () => void };
}
```

---

### ConfirmDialog.tsx

**Localização:** `src/components/common/ConfirmDialog.tsx`  
**Status:** ✅ Production-Ready

#### Props
```typescript
interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
  isLoading?: boolean;
}
```

---

### EmptyState.tsx

**Localização:** `src/components/common/EmptyState.tsx`  
**Status:** ✅ Production-Ready

#### Props
```typescript
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}
```

#### Exemplo
```tsx
<EmptyState
  icon={<InboxIcon />}
  title="Nenhum Ticket"
  description="Crie um novo ticket para começar"
  action={{
    label: 'Criar Ticket',
    onClick: () => setIsDialogOpen(true),
  }}
/>
```

---

### LoadingSkeleton.tsx

**Localização:** `src/components/common/LoadingSkeleton.tsx`  
**Status:** ✅ Production-Ready

#### Variantes
```typescript
type SkeletonType = 'card' | 'table' | 'chart' | 'text' | 'avatar';
```

#### Props
```typescript
interface LoadingSkeletonProps {
  type?: SkeletonType;
  count?: number;
  className?: string;
}
```

---

### ActivityTimeline.tsx

**Localização:** `src/components/common/ActivityTimeline.tsx`  
**Status:** ✅ Production-Ready

#### Props
```typescript
interface ActivityTimelineProps {
  activities: ActivityLog[];
  loading?: boolean;
  className?: string;
}
```

---

## 📝 Form Components

### FormField.tsx

**Localização:** `src/components/forms/FormField.tsx`  
**Status:** ✅ Production-Ready

#### Props
```typescript
interface FormFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  className?: string;
}
```

---

### PhoneInput.tsx

**Localização:** `src/components/forms/PhoneInput.tsx`  
**Status:** ✅ Production-Ready

#### Props
```typescript
interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  countryCode?: string;
  error?: string;
  disabled?: boolean;
}
```

#### Características
- Máscara automática
- Suporte a vários formatos
- Validação integrada
- Locale pt-BR

---

## 🎭 UI Primitivos (Radix UI)

### Disponíveis (30+ componentes)

| Categoria | Componentes |
|-----------|------------|
| **Input** | Button, Input, Select, Checkbox, Radio, Toggle, Textarea |
| **Layout** | Card, Separator, AspectRatio, Scroll Area |
| **Overlay** | Dialog, Alert Dialog, Drawer, Popover, Tooltip, Hover Card |
| **Menu** | Dropdown Menu, Navigation Menu, Context Menu, Command |
| **Display** | Badge, Avatar, Progress, Alert, Tabs |
| **Form** | Label, FormField (via React Hook Form) |
| **Carousel** | Carousel (embla) |

### Importação
```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// ... etc
```

---

## 🎨 Componentes Customizados

### ReservationFullCalendar.tsx

**Localização:** `src/components/common/ReservationFullCalendar.tsx`  
**Status:** ✅ Production-Ready

#### Características
- Calendário completo com reservas
- Cores por status
- Click para detalhes
- Legenda de status

---

### ReservationMiniCalendar.tsx

**Localização:** `src/components/common/ReservationMiniCalendar.tsx`  
**Status:** ✅ Production-Ready

#### Características
- Mini calendário na sidebar
- Indicadores de reservas
- Click para ir à data

---

### TimeSlotGrid.tsx

**Localização:** `src/components/common/TimeSlotGrid.tsx`  
**Status:** ✅ Production-Ready

#### Props
```typescript
interface TimeSlotGridProps {
  date: Date;
  openTime: string;
  closeTime: string;
  reservations: Reservation[];
  onSelectSlot: (startTime: string, endTime: string) => void;
  slotDuration?: number; // minutes
}
```

---

### MultiSelectFilter.tsx

**Localização:** `src/components/common/MultiSelectFilter.tsx`  
**Status:** ✅ Production-Ready

#### Props
```typescript
interface MultiSelectFilterProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}
```

---

### AdvancedFilterBar.tsx

**Localização:** `src/components/common/AdvancedFilterBar.tsx`  
**Status:** ✅ Production-Ready

#### Props
```typescript
interface AdvancedFilterBarProps {
  filters: FilterConfig[];
  onApply: (filters: Record<string, any>) => void;
  onClear: () => void;
  className?: string;
}
```

---

### NewReservationModal.tsx

**Localização:** `src/components/common/NewReservationModal.tsx`  
**Status:** ✅ Production-Ready

#### Props
```typescript
interface NewReservationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reservation: Partial<Reservation>) => void;
  commonAreas: CommonArea[];
  existingReservations: Reservation[];
}
```

---

### AccessCheck.tsx

**Localização:** `src/components/common/AccessCheck.tsx`  
**Status:** ✅ Production-Ready

#### Props
```typescript
interface AccessCheckProps {
  permission: Permission;
  fallback?: ReactNode;
  children: ReactNode;
}
```

#### Uso
```tsx
<AccessCheck permission="create_announcement">
  <Button onClick={createAnnouncement}>Criar Aviso</Button>
  <span slot="fallback">Sem permissão</span>
</AccessCheck>
```

---

### ConflictAlert.tsx

**Localização:** `src/components/common/ConflictAlert.tsx`  
**Status:** ✅ Production-Ready

#### Props
```typescript
interface ConflictAlertProps {
  conflictingReservation: Reservation;
  onClose: () => void;
}
```

---

### EmailTemplates.tsx

**Localização:** `src/components/common/EmailTemplates.tsx`  
**Status:** ✅ Production-Ready

#### Tipos Disponíveis
- ticket_created
- ticket_updated
- ticket_assigned
- announcement_published
- reservation_approved
- reservation_rejected

---

### NotificationCenter.tsx

**Localização:** `src/components/common/NotificationCenter.tsx`  
**Status:** ✅ Production-Ready

#### Características
- Histórico completo
- Filtros por tipo
- Mark as read
- Clear all
- Timestamps relativos
- Inline actions

---

## 🔐 Access Control Components

### RouteGuard.tsx

**Localização:** `src/components/RouteGuard.tsx`  
**Status:** ✅ Production-Ready

#### Props
```typescript
interface RouteGuardProps {
  children: ReactNode;
  requiredRole?: string;
  requiredPermission?: Permission;
  fallback?: ReactNode;
}
```

#### Uso
```tsx
<RouteGuard requiredRole="sindico">
  <AdminPanel />
  <AccessDenied slot="fallback" />
</RouteGuard>
```

---

## 📊 Component Composition Example

### Tickets Page

```tsx
export default function Tickets() {
  return (
    <AppLayout>
      {/* Header */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1>Chamados</h1>
          <Button onClick={createTicket}>Novo Chamado</Button>
        </div>

        {/* Filters */}
        <AdvancedFilterBar
          filters={[status, priority, category]}
          onApply={applyFilters}
          onClear={clearFilters}
        />

        {/* Data */}
        {loading ? (
          <LoadingSkeleton type="table" />
        ) : tickets.length === 0 ? (
          <EmptyState
            title="Nenhum chamado"
            action={{ label: 'Criar', onClick: createTicket }}
          />
        ) : (
          <DataTable
            columns={columns}
            data={filteredTickets}
            onRowClick={selectTicket}
          />
        )}
      </div>

      {/* Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          {/* Form fields */}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
```

---

## 🚀 Best Practices

### 1. Props Interface
```typescript
interface ComponentProps {
  required: string;
  optional?: number;
  className?: string;
  children?: ReactNode;
}
```

### 2. Componente Funcional
```typescript
export function MyComponent({ required, optional, className }: ComponentProps) {
  return <div className={cn('base-class', className)} />;
}
```

### 3. Memoization (se necessário)
```typescript
export const MyComponent = memo(function MyComponent(props: ComponentProps) {
  return <div />;
});
```

### 4. TypeScript Strict
```typescript
// ✅ Bom
const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
  event.preventDefault();
};

// ❌ Evitar
const handleClick = (event: any) => {
  event.preventDefault();
};
```

---

## 📚 Documentação Componentes

Cada componente deve ter:
- [ ] PropTypes/Interface documentada
- [ ] Exemplos de uso
- [ ] Estados (default, loading, error)
- [ ] Acessibilidade (ARIA labels)
- [ ] TypeScript types
- [ ] Stories (Storybook - futuro)

---

**Versão:** 1.0.0  
**Atualizado:** 02/02/2026  
**Total de Componentes:** 30+


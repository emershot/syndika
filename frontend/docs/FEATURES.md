# 🎯 FEATURES DETALHADAS - SYNDIKA

**Versão:** 1.0.0  
**Atualizado:** 02/02/2026

---

## 📋 Índice

1. [Dashboard Analytics](#dashboard-analytics)
2. [Gestão de Tickets](#gestão-de-tickets)
3. [Gestão de Reservas](#gestão-de-reservas)
4. [Sistema de Avisos](#sistema-de-avisos)
5. [Sistema de Auditoria](#sistema-de-auditoria)
6. [Autenticação & Autorização](#autenticação--autorização)
7. [Sistema de Notificações](#sistema-de-notificações)
8. [Tema Claro/Escuro](#tema-claroescuro)
9. [Export de Dados](#export-de-dados)

---

## 📊 Dashboard Analytics

### O Que É?
Visualização centralizada de métricas, KPIs e tendências do condomínio em tempo real.

### Como Funciona?

#### 1. KPIs (11 Métricas)
```
Linha 1: Total Chamados | Abertos | Em Andamento | Resolvidos
Linha 2: Taxa Resolução | Total Reservas | Pendentes | Avisos
Linha 3: Último Atualizado | ... | ... | ...
```

**Cálculo dos KPIs:**
```typescript
// calculateDashboardStats(tickets, announcements, reservations)

totalTickets = tickets.length
openTickets = tickets.filter(t => t.status === 'aberto').length
inProgressTickets = tickets.filter(t => t.status === 'em_andamento').length
resolvedTickets = tickets.filter(t => t.status === 'resolvido').length
resolutionRate = (resolvedTickets / totalTickets) * 100

totalReservations = reservations.length
pendingReservations = reservations.filter(r => r.status === 'solicitada').length
approvedReservations = reservations.filter(r => r.status === 'aprovada').length

avgResolutionTime = calcularMediaHoras(resolvedTickets)
```

#### 2. Gráficos (4 visualizações)

**Gráfico 1: Evolução de Chamados**
```
Type: Line Chart
Data: Últimos 30 dias
Eixo X: Dias
Eixo Y: Quantidade de chamados
Cores: Linha azul #3b82f6
Mostra: Tendência de criação de chamados
```

**Gráfico 2: Distribuição por Prioridade**
```
Type: Pie Chart
Data: Total de chamados agrupados
Segmentos: Baixa (10%), Média (30%), Alta (40%), Urgente (20%)
Cores: Verde, Amarelo, Laranja, Vermelho
Interativo: Clique para drill-down
```

**Gráfico 3: Tempo Médio de Resolução**
```
Type: Bar Chart (Horizontal)
Data: Distribuição por range de horas
Barras: 0-2h, 2-8h, 8-24h, 24h+
Mostra: Quantos chamados foram resolvidos em cada faixa
```

**Gráfico 4: Avisos por Tipo**
```
Type: Bar Chart (Vertical)
Data: Avisos publicados
Categorias: Urgente, Importante, Informativo
Cores: Vermelho, Amarelo, Azul
```

#### 3. Insights (Alertas Inteligentes)

```
┌─────────────────────────────┐
│ ⚠️ CHAMADOS URGENTES        │
│ 3 chamados aguardando       │
│ [ Ver Todos ]               │
└─────────────────────────────┘

┌─────────────────────────────┐
│ ✅ TAXA DE RESOLUÇÃO        │
│ 85% dos chamados resolvidos │
│ Acima da média              │
└─────────────────────────────┘

┌─────────────────────────────┐
│ 📅 RESERVAS PENDENTES       │
│ 2 solicitações aguardando   │
│ [ Aprovar ]                 │
└─────────────────────────────┘

┌─────────────────────────────┐
│ 💡 AVISO IMPORTANTE         │
│ Manutenção da caixa d'água  │
│ [ Ler Completo ]            │
└─────────────────────────────┘
```

### Filtros de Data

```
Select: [Hoje v]
  └─ Hoje
  └─ Últimos 7 dias
  └─ Últimos 30 dias (default)
  └─ Últimos 90 dias
  └─ Último ano
  └─ Personalizado

Botão: [Atualizar]  [Exportar v]
```

**Funcionamento do Filtro Customizado:**
- Clique em "Personalizado"
- Abre calendário duplo (data início + data fim)
- Selecione range de datas
- Clique em "Confirmar"
- Dashboard atualiza com dados do período

### Componentes Utilizados

| Componente | Descrição | Arquivo |
|------------|-----------|---------|
| KPICard | Card de métrica com trend | KPICard.tsx |
| ChartCard | Container para gráficos | ChartCard.tsx |
| InsightCard | Alerta com ação | InsightCard.tsx |
| LineChart | Gráfico de evolução | Recharts |
| PieChart | Gráfico de distribuição | Recharts |
| BarChart | Gráfico de barras | Recharts |
| DashboardFilters | Filtros e exportar | DashboardFilters.tsx |
| DateRangePickerModal | Seletor de data | DateRangePickerModal.tsx |
| DrilldownModal | Explorar dados | DrilldownModal.tsx |
| LastUpdateDisplay | Timestamp atualização | LastUpdateDisplay.tsx |

### Ações Disponíveis

- ✅ **Clique em KPI** → Abre modal com detalhes
- ✅ **Clique em Gráfico** → Drill-down para dados específicos
- ✅ **Filtro de data** → Re-calcula todas as métricas
- ✅ **Botão Atualizar** → Recarrega dados (F ou Ctrl+R)
- ✅ **Botão Exportar** → CSV ou PDF

---

## 🎫 Gestão de Tickets

### O Que É?
Sistema de gestão de chamados de manutenção, reparos, limpeza e segurança.

### Estrutura de Ticket

```typescript
interface Ticket {
  id: string;                    // ticket-1234567890
  condominiumId: string;         // condo-1
  title: string;                 // "Vazamento na cozinha"
  description: string;           // Descrição detalhada
  category: TicketCategory;      // 'manutencao' | 'reparo' | 'limpeza' | 'seguranca'
  priority: TicketPriority;      // 'baixa' | 'media' | 'alta' | 'urgente'
  status: TicketStatus;          // 'aberto' | 'em_andamento' | 'aguardando' | 'resolvido' | 'arquivado'
  location?: string;             // "Apt 101 - Cozinha"
  assignedTo?: string;           // ID do síndico/gerente
  createdBy: string;             // ID do morador
  createdByName: string;         // "João Silva"
  createdAt: Date;               // Data/hora criação
  updatedAt: Date;               // Data/hora última atualização
  comments?: TicketComment[];    // Comentários
}

interface TicketComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}
```

### Estados do Ticket

```
┌─────────────┐
│   ABERTO    │ ← Criado, aguardando análise
└─────┬───────┘
      │
      ↓
┌─────────────────┐
│ EM ANDAMENTO    │ ← Síndico atribuindo à equipe
└─────┬───────────┘
      │
      ├─→ ┌───────────┐
      │   │ AGUARDANDO│ ← Aguardando material/autorização
      │   └─────┬─────┘
      │         │
      │         ↓
      └────→ [Volta para EM ANDAMENTO]
      │
      ↓
┌─────────────┐
│ RESOLVIDO   │ ← Problema solucionado
└─────┬───────┘
      │
      ↓
┌─────────────┐
│ ARQUIVADO   │ ← Finalizado permanentemente
└─────────────┘
```

### Fluxo de Criação

```
1. Clique [Novo Chamado]
   ↓
2. Preencha formulário
   - Título (obrigatório)
   - Descrição (obrigatório)
   - Categoria (dropdown)
   - Prioridade (dropdown)
   - Localização (opcional)
   ↓
3. Validação (Zod schema)
   ✓ Título: min 5, max 100 chars
   ✓ Descrição: min 10, max 1000 chars
   ✓ Categoria: enum validado
   ✓ Prioridade: enum validado
   ↓
4. Sucesso
   - Ticket criado com ID único
   - Notificação para síndico
   - Email de confirmação (mock)
   - Log de atividade
   ↓
5. Aparece na lista e dashboard
```

### Filtros Disponíveis

```
┌─────────────────┐
│ Status          │
│ ☑ Todos         │
│ ☐ Aberto        │
│ ☐ Em Andamento  │
│ ☐ Resolvido     │
└─────────────────┘

┌─────────────────┐
│ Prioridade      │
│ ☑ Todos         │
│ ☐ Baixa         │
│ ☐ Média         │
│ ☐ Alta          │
│ ☐ Urgente       │
└─────────────────┘

┌─────────────────┐
│ Categoria       │
│ ☑ Todos         │
│ ☐ Manutenção    │
│ ☐ Reparo        │
│ ☐ Limpeza       │
│ ☐ Segurança     │
└─────────────────┘

[Buscar...]  [Limpar Filtros]
```

### Sorting

- **Recente** (padrão) - Mais novos primeiro
- **Prioridade** - Urgente → Baixa
- **Criador** - Alfabético por criador
- **Status** - Agrupado por status

### Comentários

```
Ticket: "Vazamento na cozinha"

Comments:
├─ João Silva (Criador) - 10:30
│  "Está vazando desde ontem"
│
├─ Carlos (Síndico) - 11:00
│  "Vou verificar hoje"
│
└─ João Silva (Criador) - 14:30
   "Obrigado, já foi resolvido!"
```

### Ações

- ✅ **Criar** - Novo ticket
- ✅ **Comentar** - Adicionar mensagens
- ✅ **Editar** - Mudar status/prioridade (síndico)
- ✅ **Atribuir** - Assign para equipe (síndico)
- ✅ **Arquivar** - Finalizar permanentemente
- ✅ **Filtrar** - Status, prioridade, categoria
- ✅ **Buscar** - Por título/descrição
- ✅ **Exportar** - CSV/PDF

---

## 📅 Gestão de Reservas

### O Que É?
Sistema para gerenciar reservas de áreas comuns (salão, piscina, academia, etc).

### Estrutura de Reserva

```typescript
interface Reservation {
  id: string;
  commonAreaId: string;          // 'area-1'
  commonAreaName: string;        // "Salão de Festas"
  date: Date;                    // Data da reserva
  startTime: string;             // "14:00"
  endTime: string;               // "18:00"
  requestedBy: string;           // ID do morador
  requestedByName: string;       // "Maria Silva"
  unitNumber: string;            // "Apt 202"
  purpose?: string;              // "Aniversário"
  status: ReservationStatus;     // 'solicitada' | 'aprovada' | 'recusada' | 'cancelada'
  // Aprovação
  approvedBy?: string;           // ID do síndico
  approvedByName?: string;       // "Carlos (Síndico)"
  approvalDate?: Date;
  // Rejeição
  rejectedBy?: string;
  rejectedByName?: string;
  rejectionDate?: Date;
  rejectionReason?: string;      // "Conflito com outro evento"
  createdAt: Date;
  updatedAt: Date;
}
```

### Estados da Reserva

```
┌───────────────┐
│  SOLICITADA   │ ← Morador solicita
└────────┬──────┘
         │
         ├──→ ┌──────────┐
         │    │ APROVADA │ ← Síndico aprova
         │    └──────────┘
         │
         └──→ ┌─────────┐
              │ RECUSADA│ ← Síndico rejeita (com motivo)
              └─────────┘
```

### Validações Automáticas

**1. Horário de Funcionamento**
```
Área: Salão de Festas
Aberto: 08:00 - 22:00

Validações:
✓ Hora início >= 08:00
✓ Hora fim <= 22:00
✓ Duração >= 1 hora
✓ Duração <= 8 horas
```

**2. Detecção de Conflitos**
```
Nova reserva: 14:00 - 18:00
Existentes:
  • 12:00 - 16:00 ❌ CONFLITA!
  • 10:00 - 12:00 ✓ OK
  • 19:00 - 21:00 ✓ OK

Ação: Mostrar alerta + sugerir horários disponíveis
```

**3. Grid de Horários**
```
08:00 [ ][ ][ ][ ][ ]
09:00 [ ][ ][ ][ ][ ]
10:00 [ ][ ][X][X][ ]  ← Ocupado
11:00 [ ][ ][X][X][ ]
12:00 [ ][ ][ ][ ][ ]
...
```

### Fluxo de Solicitação

```
1. Clique [Nova Reserva]
   ↓
2. Selecione área comum
   ↓
3. Escolha data no calendário
   ↓
4. Selecione hora início/fim
   (Grid mostra disponibilidade)
   ↓
5. Preencha (opcional) propósito
   ↓
6. Validação automática
   ✓ Horário válido?
   ✓ Não conflita?
   ↓
7. Confirmar
   ↓
8. Notificação para síndico
   ↓
9. Aguarda aprovação
```

### Ações do Síndico

**Aprovar:**
```
[ Reserva Pendente ]
Data: 15/02/2026, 14:00-18:00
Morador: Maria Silva - Apt 202
Propósito: Aniversário

[✓ Aprovar] [✗ Rejeitar]
```

**Rejeitar:**
```
Modal de Rejeição:
┌──────────────────────────┐
│ Motivo de Rejeição       │
│ ◉ Conflito com evento    │
│ ◉ Manutenção em andamento│
│ ◉ Outro motivo           │
│ [Descrever]              │
│                          │
│ [Cancelar] [Rejeitar]    │
└──────────────────────────┘
```

### Visualizações

**Vista em Lista:**
```
Data | Área | Morador | Hora | Status | Ações
─────────────────────────────────────────────
15/02│Salão │ Maria  │14-18 │ ✓Aprov │[Detalhes]
16/02│Piscina│ João  │10-12 │ ⏳Pend │[Aprov][Rej]
17/02│Acad. │ Paula  │ 6-8  │ ✗Rejeit│[Motivo]
```

**Vista em Calendário:**
```
       Fevereiro 2026
Dom Seg Ter Qua Qui Sex Sab
                       1   2
3   4   5   6   7   8   9
10  11  12  13  14  15* 16*
17  18  19* 20  21  22  23
24  25  26  27  28  3/1 3/2

* = Com reservas (clique para detalhes)
```

### Mini Calendário (Sidebar)
```
Próximas Reservas
┌──────────────────┐
│ [ ← ] Feb [ → ]  │
│ D S T Q Q S S    │
│   1 2 3 4 5 6    │
│ 7 8 9 10 11*12   │
│ 14 15*16 17 18 19│
└──────────────────┘
* = Tem reserva
```

---

## 📢 Sistema de Avisos

### O Que É?
Sistema para publicar comunicados para todos os moradores.

### Estrutura de Aviso

```typescript
interface Announcement {
  id: string;
  condominiumId: string;
  title: string;                 // "Manutenção da Caixa D'água"
  content: string;               // Texto completo
  type: AnnouncementType;        // 'urgente' | 'importante' | 'informativo'
  authorId: string;              // ID do síndico
  authorName: string;            // "Carlos Silva"
  createdAt: Date;
  updatedAt: Date;
}
```

### Tipos de Aviso

```
┌────────────────────────┐
│ 🔴 URGENTE             │
│ Manutenção imediata    │
│ da caixa d'água        │
│ Cor: Vermelho          │
│ Prioridade: Crítica    │
└────────────────────────┘

┌────────────────────────┐
│ 🟠 IMPORTANTE          │
│ Eleição do novo        │
│ síndico em 15 dias     │
│ Cor: Laranja           │
│ Prioridade: Alta       │
└────────────────────────┘

┌────────────────────────┐
│ 🔵 INFORMATIVO         │
│ Reunião condominial    │
│ próxima semana         │
│ Cor: Azul              │
│ Prioridade: Normal     │
└────────────────────────┘
```

### Permissões

| Role | Criar | Editar | Deletar |
|------|-------|--------|---------|
| Residente | ❌ | ❌ | ❌ |
| Síndico | ✅ | ✅ | ✅ |
| Gerente | ✅ | ✅ | ✅ |

### Fluxo de Publicação

```
1. Clique [Novo Aviso]
   ↓
2. Preencha formulário
   ├─ Título (obrigatório)
   ├─ Conteúdo (obrigatório)
   └─ Tipo (dropdown)
   ↓
3. Preview do aviso
   ↓
4. [Publicar]
   ↓
5. Ações automáticas:
   ✓ Notificação para todos
   ✓ Email para moradores (mock)
   ✓ Alerta no dashboard
   ✓ Log de atividade
```

### Contagem de Avisos

```
NotificationBell
├─ Badge: 3 (avisos não lidos)
└─ Dropdown ao clicar
   ├─ Aviso Urgente (2 horas atrás)
   │  [ Marcar como lido ]
   ├─ Aviso Importante (1 dia atrás)
   │  [ Marcar como lido ]
   └─ Aviso Informativo (3 dias atrás)
      [ Marcar como lido ]
```

### Filtros

```
┌────────────────┐
│ Tipo           │
│ ☑ Todos        │
│ ☐ Urgente      │
│ ☐ Importante   │
│ ☐ Informativo  │
└────────────────┘

[Buscar...]  [Limpar Filtros]
```

---

## 📋 Sistema de Auditoria

### O Que É?
Log centralizado de todas as ações executadas no sistema.

### Tipos de Ação

```
CREATE   - Novo ticket, reserva, aviso, morador
UPDATE   - Editar dados
DELETE   - Remover
APPROVE  - Aprovar reserva
REJECT   - Rejeitar reserva
COMMENT  - Adicionar comentário
ASSIGN   - Atribuir ticket
STATUS   - Mudar status
LOGIN    - Acesso ao sistema
LOGOUT   - Saída do sistema
```

### Estrutura de Log

```typescript
interface ActivityLog {
  id: string;                    // log-1234567890
  userId: string;                // ID do usuário
  userName: string;              // Nome do usuário
  action: string;                // 'create', 'update', 'approve'
  entityType: string;            // 'ticket', 'reservation', 'announcement'
  entityId: string;              // ID da entidade afetada
  timestamp: Date;               // Quando aconteceu
  metadata?: Record<string, any>; // Dados adicionais
}

// Exemplo de metadata:
{
  entityTitle: "Vazamento na cozinha",
  description: "Novo ticket urgente criado",
  priority: "urgente",
  category: "manutencao"
}
```

### Visualização Timeline

```
┌─────────────────────────────────────────┐
│ CARLOS SILVA - 14:30 (Hoje)            │
│ Criou novo TICKET                       │
│ "Vazamento na cozinha"                  │
│ [Prioridade: Urgente]                   │
│ ─────────────────────────────────────── │
│ JOÃO MORADOR - 14:35                    │
│ Comentou em TICKET                      │
│ "Está piorando, favor priorizar"        │
│ ─────────────────────────────────────── │
│ CARLOS SILVA - 15:00                    │
│ Mudou status de TICKET                  │
│ [Aberto → Em Andamento]                 │
│ ─────────────────────────────────────── │
│ MARIA GERENTE - 17:30                   │
│ Resolveu TICKET                         │
│ "Problema solucionado"                  │
└─────────────────────────────────────────┘
```

### Filtros Avançados

```
┌──────────────────┐
│ Filtrar por      │
├──────────────────┤
│ Entidade:        │
│ ☑ Todos          │
│ ☐ Ticket         │
│ ☐ Reserva        │
│ ☐ Aviso          │
│ ☐ Morador        │
│                  │
│ Ação:            │
│ ☑ Todas          │
│ ☐ Create         │
│ ☐ Update         │
│ ☐ Delete         │
│ ☐ Approve        │
│                  │
│ Usuário:         │
│ [Selecionar...]  │
│                  │
│ Data:            │
│ [De] [Até]       │
│                  │
│ [Aplicar] [Limpar]
└──────────────────┘
```

### Relatórios

```
Relatório: Atividades de Carlos Silva - Fevereiro 2026

Total de Ações: 24
├─ Create: 8
├─ Update: 10
├─ Approve: 4
├─ Reject: 2

Entidades Afetadas:
├─ Tickets: 15
├─ Reservas: 6
├─ Avisos: 3

Timeline:
├─ 01/02: 2 ações
├─ 02/02: 3 ações
...
└─ 29/02: 1 ação

[Exportar PDF]
```

---

## 🔐 Autenticação & Autorização

### Login

```
Login Page
┌──────────────────┐
│ SYNDIKA          │
│                  │
│ Email            │
│ [user@...]       │
│                  │
│ Senha            │
│ [••••••••]       │
│                  │
│ [Entrar]         │
│                  │
│ Demo Users:      │
│ • maria@... Res. │
│ • carlos@... Sínd│
│ • gerente@... Ger
└──────────────────┘
```

### Perfis (Roles)

**1. Residente**
- Criar tickets
- Solicitar reservas
- Ler avisos
- Ver próprios dados
- Não pode: criar avisos, aprovar

**2. Síndico**
- Acesso total
- Aprovar/rejeitar reservas
- Criar avisos
- Gerenciar residentes
- Ver auditoria

**3. Gerente**
- Gerenciar condomínios
- Relatórios avançados
- Configurações
- Tudo que síndico faz

### Token (Mock)

```typescript
// localStorage: syndika_user
{
  id: "user-1",
  name: "Carlos Silva",
  email: "carlos@condominio.com.br",
  role: "sindico",
  unitNumber: "Apt 101",
  avatar?: "https://avatar-url.jpg"
}

// localStorage: syndika_session
{
  token: "jwt-mock-token",
  expiresAt: "2026-02-03T10:30:00Z"
}
```

### RouteGuard

```typescript
<RouteGuard requiredRole="sindico">
  <AdminPanel />
</RouteGuard>

// Se não tiver role: redirect para /access-denied
```

### AccessCheck

```typescript
<AccessCheck permission="create_announcement">
  <Button onClick={createAnnouncement}>
    Criar Aviso
  </Button>
  <span slot="fallback">Sem permissão</span>
</AccessCheck>
```

---

## 🔔 Sistema de Notificações

### Tipos de Notificação

```
┌────────────────────────────┐
│ 🔵 INFO                    │
│ "Ticket comentado"         │
│ Ação: ticket_comment_added │
└────────────────────────────┘

┌────────────────────────────┐
│ ⚠️ WARNING                  │
│ "Ticket urgente aberto"    │
│ Ação: ticket_created       │
└────────────────────────────┘

┌────────────────────────────┐
│ 🔴 URGENT                  │
│ "Manutenção imedita"       │
│ Ação: announcement_created │
└────────────────────────────┘

┌────────────────────────────┐
│ ✅ SYSTEM                  │
│ "Reserva aprovada"         │
│ Ação: reservation_approved │
└────────────────────────────┘
```

### Triggers de Notificação

```
Evento                          → Notificação
─────────────────────────────────────────────
Ticket criado                   → "Novo chamado criado"
Ticket comentado               → "Novo comentário"
Ticket mudou status            → "Status alterado"
Reserva solicitada             → "Nova solicitação"
Reserva aprovada               → "Reserva aprovada"
Reserva rejeitada              → "Reserva rejeitada"
Aviso publicado                → "Novo aviso"
Morador cadastrado             → "Novo morador"
```

### Toast Notification

```
┌─────────────────────────────┐
│ ✓ Ticket criado com sucesso │
│ ID: ticket-1234567890       │
│ [Fechar]         [Desfazer] │
└─────────────────────────────┘
Auto-dismiss em 3 segundos
```

### Notification Center

```
NotificationBell (🔔)
  Badge: 5
  
Ao clicar:
┌──────────────────────────────┐
│ Notificações                 │
├──────────────────────────────┤
│ ☐ Novo ticket comentado      │ ← 2 min atrás
│   "Vazamento na cozinha"     │
├──────────────────────────────┤
│ ☑ Reserva aprovada           │ ← 1 hora atrás
│   "Salão de Festas 15/02"    │
├──────────────────────────────┤
│ ☑ Aviso importante          │ ← 3 horas atrás
│   "Eleição do novo síndico"  │
├──────────────────────────────┤
│ [Marcar tudo como lido]      │
│ [Limpar tudo]                │
└──────────────────────────────┘
```

### localStorage Deduplication

```
Problema: Mesma notificação n vezes

Solução: localStorage syndika_notifications_seen
{
  "ticket_created_ticket-123": true,
  "reservation_approved_res-456": true,
  "announcement_created_ann-789": true
}

Ao adicionar notificação:
if (notificationSeen[notification.relatedId]) {
  return; // Já foi mostrada
}
```

---

## 🌙 Tema Claro/Escuro

### Sistema de Tema

**Detecção Automática:**
```javascript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
// true se SO está em dark mode
```

**Toggle Manual:**
```
Sidebar → User Menu
  ├─ 🌙 Light
  ├─ 🌞 Dark
  └─ 💻 System (padrão)
```

**Persistência:**
```
localStorage: syndika_theme
├─ "light"
├─ "dark"
└─ "system"
```

**HTML Root Class:**
```html
<!-- Dark mode ativado -->
<html class="dark">
  <!-- Tailwind aplica classes dark: -->
  <div class="bg-white dark:bg-slate-900">
</html>
```

**Tailwind Config:**
```javascript
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      // Cores dark mode customizadas
    }
  }
}
```

### Cores Dark Mode

```
Light Mode          Dark Mode
─────────────────────────────────
bg-white            bg-slate-900
text-slate-900      text-slate-50
border-slate-200    border-slate-700
bg-slate-50         bg-slate-800
```

---

## 📥 Export de Dados

### Formatos Disponíveis

**CSV:**
```
Tickets_2026-02-02.csv

ID,Título,Descrição,Categoria,Prioridade,Status,Criador,Data Criação
ticket-1,Vazamento,Cozinha vazando,manutencao,urgente,em_andamento,João,01/02/2026
ticket-2,Lâmpada,Luz da sala,manutencao,baixa,resolvido,Maria,02/02/2026
```

**PDF:**
```
┌─────────────────────────────────┐
│     RELATÓRIO DE CHAMADOS       │
│     SYNDIKA - Condomínio ABC    │
│     Gerado em 02/02/2026        │
├─────────────────────────────────┤
│ Total de Chamados: 45           │
│ Resolvidos: 35 (77%)            │
│ Em Andamento: 8 (18%)           │
│ Abertos: 2 (5%)                 │
├─────────────────────────────────┤
│ ID    │ Título │ Status  │ Data │
│─────────────────────────────────│
│ 001   │ Vazame │ Resolvi │ 1fev│
│ 002   │ Lâmpda │ Abelto  │ 2fev│
└─────────────────────────────────┘
```

### Botão de Export

```
Dashboard Filters Bar:
[Date Range] [Refresh] [Export ▼]

Dropdown:
├─ 📊 Exportar CSV
└─ 📄 Exportar PDF
```

### Atalho de Teclado

```
Pressione: E

Resultado: Abre dropdown de export
```

---

## 🎨 Componentes Visuais

### Cores Principais

```
Primary: #3b82f6 (Azul)
Success: #10b981 (Verde)
Warning: #f59e0b (Amarelo)
Danger:  #ef4444 (Vermelho)
Info:    #06b6d4 (Ciano)
```

### Animações

```
fade-in     - Entrada suave
slide       - Deslize lateral
pulse       - Pulsação
spin        - Rotação (loading)
bounce      - Bounce (alerta)
```

### Tamanhos

```
Pequeno (sm):   32px
Médio (md):     40px
Grande (lg):    48px
Extra (xl):     64px
```

---

**Versão:** 1.0.0  
**Atualizado:** 02/02/2026  
**Total de Features:** 30+


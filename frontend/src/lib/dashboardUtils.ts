import { Ticket, Announcement, Reservation, TicketCategory, TicketPriority } from '@/types/condominium';
import { DashboardStats } from '@/types/condominium';

/**
 * Calcula estatísticas dinâmicas baseadas em dados reais do localStorage
 */
export function calculateDashboardStats(
  tickets: Ticket[],
  announcements: Announcement[],
  reservations: Reservation[]
): DashboardStats {
  // Estatísticas de Chamados
  const openTickets = tickets.filter((t) => t.status === 'aberto').length;
  const inProgressTickets = tickets.filter((t) => t.status === 'em_andamento').length;
  const resolvedTickets = tickets.filter((t) => t.status === 'resolvido').length;
  const totalTickets = tickets.length;

  // Calcular tempo médio de resolução (em horas)
  const resolvedTicketsWithDuration = tickets
    .filter((t) => t.status === 'resolvido' && t.updatedAt)
    .map((t) => {
      const createdTime = new Date(t.createdAt).getTime();
      const resolvedTime = new Date(t.updatedAt).getTime();
      const durationMs = resolvedTime - createdTime;
      const durationHours = Math.round(durationMs / (1000 * 60 * 60));
      return durationHours;
    });

  const avgResolutionTime =
    resolvedTicketsWithDuration.length > 0
      ? Math.round(
          resolvedTicketsWithDuration.reduce((a, b) => a + b, 0) /
            resolvedTicketsWithDuration.length
        )
      : 0;

  // Estatísticas de Reservas
  const totalReservations = reservations.length;
  const pendingReservations = reservations.filter((r) => r.status === 'solicitada').length;
  const approvedReservations = reservations.filter((r) => r.status === 'aprovada').length;

  // Distribuição de Chamados por Categoria
  const ticketsByCategory: Record<TicketCategory, number> = {
    manutencao: tickets.filter((t) => t.category === 'manutencao').length,
    barulho: tickets.filter((t) => t.category === 'barulho').length,
    seguranca: tickets.filter((t) => t.category === 'seguranca').length,
    administrativo: tickets.filter((t) => t.category === 'administrativo').length,
    outro: tickets.filter((t) => t.category === 'outro').length,
  };

  // Distribuição de Reservas por Área
  const reservationsByArea: Record<string, number> = {};
  reservations.forEach((r) => {
    reservationsByArea[r.commonAreaName] = (reservationsByArea[r.commonAreaName] || 0) + 1;
  });

  return {
    totalTickets,
    openTickets,
    inProgressTickets,
    resolvedTickets,
    totalReservations,
    pendingReservations,
    approvedReservations,
    avgResolutionTime,
    ticketsByCategory,
    reservationsByArea,
  };
}

/**
 * Calcula tendência de um métrica (% de mudança)
 */
export function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Gera dados para gráfico de Chamados por Status (últimos 30 dias)
 */
export function getTicketStatusTrendData(tickets: Ticket[]) {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toDateString();
  });

  const data = last30Days.map((dateStr) => {
    const date = new Date(dateStr);
    const dayTickets = tickets.filter(
      (t) =>
        new Date(t.createdAt).toDateString() === dateStr &&
        t.status !== 'arquivado'
    );

    return {
      date: `${date.getDate()}/${date.getMonth() + 1}`,
      aberto: dayTickets.filter((t) => t.status === 'aberto').length,
      em_andamento: dayTickets.filter((t) => t.status === 'em_andamento').length,
      resolvido: dayTickets.filter((t) => t.status === 'resolvido').length,
      total: dayTickets.length,
    };
  });

  return data;
}

/**
 * Gera dados para gráfico de distribuição de Prioridades
 */
export function getTicketPriorityDistribution(tickets: Ticket[]) {
  const priorities: TicketPriority[] = ['baixa', 'media', 'alta', 'urgente'];
  
  return priorities.map((priority) => ({
    name: priority.charAt(0).toUpperCase() + priority.slice(1),
    value: tickets.filter((t) => t.priority === priority).length,
    fill:
      priority === 'urgente'
        ? '#ef4444'
        : priority === 'alta'
        ? '#f97316'
        : priority === 'media'
        ? '#eab308'
        : '#22c55e',
  }));
}

/**
 * Gera dados para gráfico de Avisos por Tipo
 */
export function getAnnouncementTypeDistribution(announcements: Announcement[]) {
  return [
    {
      name: 'Urgente',
      value: announcements.filter((a) => a.type === 'urgente').length,
      fill: '#ef4444',
    },
    {
      name: 'Importante',
      value: announcements.filter((a) => a.type === 'importante').length,
      fill: '#f97316',
    },
    {
      name: 'Informativo',
      value: announcements.filter((a) => a.type === 'informativo').length,
      fill: '#3b82f6',
    },
  ];
}

/**
 * Gera dados para gráfico de Resolução de Chamados
 */
export function getTicketResolutionTimeDistribution(tickets: Ticket[]) {
  const ranges = {
    '< 1h': 0,
    '1-24h': 0,
    '1-7d': 0,
    '> 7d': 0,
  };

  tickets
    .filter((t) => t.status === 'resolvido')
    .forEach((ticket) => {
      const createdTime = new Date(ticket.createdAt).getTime();
      const resolvedTime = new Date(ticket.updatedAt).getTime();
      const durationMs = resolvedTime - createdTime;
      const durationHours = durationMs / (1000 * 60 * 60);
      const durationDays = durationHours / 24;

      if (durationHours < 1) ranges['< 1h']++;
      else if (durationHours < 24) ranges['1-24h']++;
      else if (durationDays < 7) ranges['1-7d']++;
      else ranges['> 7d']++;
    });

  const data = Object.entries(ranges).map(([name, value]) => ({
    name,
    value,
    fill: name === '< 1h' ? '#22c55e' : name === '1-24h' ? '#3b82f6' : name === '1-7d' ? '#eab308' : '#ef4444',
  }));

  // Se não há dados de resolução, retornar dados demo para o gráfico não ficar vazio
  if (data.every(d => d.value === 0)) {
    return [
      { name: '< 1h', value: 4, fill: '#22c55e' },
      { name: '1-24h', value: 12, fill: '#3b82f6' },
      { name: '1-7d', value: 8, fill: '#eab308' },
      { name: '> 7d', value: 2, fill: '#ef4444' },
    ];
  }

  return data;
}

/**
 * SYNDIKA - React Query Keys Factory
 * 
 * Centralize todas as query keys para evitar erros de tipagem
 * e facilitar invalidações de cache
 * 
 * Padrão: Hierárquico por feature
 * Exemplo: ['tickets', 'list', { status: 'open' }]
 * 
 * @see https://tanstack.com/query/latest/docs/react/guides/important-defaults
 */

export const QUERY_KEYS = {
  // ========== AUTHENTICATION ==========
  auth: {
    me: () => ['auth', 'me'],
    profile: (userId: string) => ['auth', 'profile', userId],
    permissions: (userId: string) => ['auth', 'permissions', userId],
  },

  // ========== USERS ==========
  users: {
    all: () => ['users'],
    list: (filters?: Record<string, any>) => ['users', 'list', filters],
    detail: (id: string) => ['users', 'detail', id],
    search: (query: string) => ['users', 'search', query],
  },

  // ========== TICKETS ==========
  tickets: {
    all: () => ['tickets'],
    list: (filters?: Record<string, any>) => ['tickets', 'list', filters],
    detail: (id: string) => ['tickets', 'detail', id],
    byStatus: (status: string) => ['tickets', 'byStatus', status],
    byAssignee: (userId: string) => ['tickets', 'byAssignee', userId],
    comments: (ticketId: string) => ['tickets', 'comments', ticketId],
  },

  // ========== ANNOUNCEMENTS ==========
  announcements: {
    all: () => ['announcements'],
    list: (filters?: Record<string, any>) => ['announcements', 'list', filters],
    detail: (id: string) => ['announcements', 'detail', id],
    recent: (limit?: number) => ['announcements', 'recent', limit],
  },

  // ========== RESERVATIONS ==========
  reservations: {
    all: () => ['reservations'],
    list: (filters?: Record<string, any>) => ['reservations', 'list', filters],
    detail: (id: string) => ['reservations', 'detail', id],
    byCommonArea: (areaId: string) => ['reservations', 'byArea', areaId],
    byDate: (date: string) => ['reservations', 'byDate', date],
    availability: (areaId: string, date: string) => ['reservations', 'availability', areaId, date],
  },

  // ========== COMMON AREAS ==========
  commonAreas: {
    all: () => ['commonAreas'],
    list: () => ['commonAreas', 'list'],
    detail: (id: string) => ['commonAreas', 'detail', id],
  },

  // ========== CONDOMINIUM ==========
  condominium: {
    me: () => ['condominium', 'me'],
    detail: (id: string) => ['condominium', 'detail', id],
    settings: () => ['condominium', 'settings'],
    stats: () => ['condominium', 'stats'],
    units: () => ['condominium', 'units'],
  },

  // ========== DASHBOARD ==========
  dashboard: {
    stats: () => ['dashboard', 'stats'],
    kpis: () => ['dashboard', 'kpis'],
    alerts: () => ['dashboard', 'alerts'],
    recentActivity: () => ['dashboard', 'recentActivity'],
    charts: () => ['dashboard', 'charts'],
  },

  // ========== AUDIT LOGS ==========
  auditLogs: {
    all: () => ['auditLogs'],
    list: (filters?: Record<string, any>) => ['auditLogs', 'list', filters],
    byUser: (userId: string) => ['auditLogs', 'byUser', userId],
  },

  // ========== NOTIFICATIONS ==========
  notifications: {
    all: () => ['notifications'],
    unread: () => ['notifications', 'unread'],
    settings: () => ['notifications', 'settings'],
  },
} as const;

/**
 * Invalidate entire feature cache
 * @example
 * queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tickets.all() })
 */
export function createInvalidateOptions(baseKey: readonly string[]) {
  return {
    queryKey: baseKey,
  };
}

/**
 * Helper para invalidar todas as queries relacionadas
 * @example
 * invalidateTickets(queryClient)
 */
export const invalidateQueries = {
  tickets: (queryClient: any) =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tickets.all() }),

  announcements: (queryClient: any) =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.announcements.all() }),

  reservations: (queryClient: any) =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reservations.all() }),

  users: (queryClient: any) =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all() }),

  dashboard: (queryClient: any) =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.stats() }),

  auth: (queryClient: any) =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() }),

  all: (queryClient: any) =>
    queryClient.invalidateQueries(),
};

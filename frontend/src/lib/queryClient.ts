/**
 * SYNDIKA - React Query Client Configuration
 * Configuração global do QueryClient com defaults e devtools
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Configuração do React Query Client
 * 
 * - staleTime: Tempo que os dados são considerados "frescos" (5 minutos)
 * - cacheTime: Tempo que dados inativos ficam em cache (10 minutos)
 * - refetchOnWindowFocus: Revalida ao focar na janela
 * - retry: Tenta 1 vez antes de falhar (padrão é 3)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Dados são considerados frescos por 5 minutos
      staleTime: 5 * 60 * 1000, // 5 minutos
      
      // Cache persiste por 10 minutos após inatividade
      gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
      
      // Revalidar ao focar na janela (útil para dashboards)
      refetchOnWindowFocus: true,
      
      // Não revalidar automaticamente ao montar componente (já temos staleTime)
      refetchOnMount: false,
      
      // Revalidar ao reconectar à internet
      refetchOnReconnect: true,
      
      // Apenas 1 retry automático em caso de erro
      retry: 1,
      
      // Delay exponencial entre retries (1s, 2s, 4s...)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    
    mutations: {
      // Apenas 1 retry para mutations (POST, PUT, DELETE)
      retry: 0,
      
      // Tempo de cache para resultado de mutations (não usado frequentemente)
      gcTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

/**
 * Query Keys - Chaves padronizadas para organização
 * 
 * Uso:
 * - queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tickets.all })
 * - useQuery({ queryKey: QUERY_KEYS.tickets.detail(id) })
 */
export const QUERY_KEYS = {
  // Auth
  auth: {
    me: ['auth', 'me'] as const,
  },
  
  // Tickets
  tickets: {
    all: ['tickets'] as const,
    list: (filters?: Record<string, string | number | undefined>) => ['tickets', 'list', filters] as const,
    detail: (id: string) => ['tickets', 'detail', id] as const,
  },
  
  // Reservations
  reservations: {
    all: ['reservations'] as const,
    list: (filters?: Record<string, string | number | undefined>) => ['reservations', 'list', filters] as const,
    detail: (id: string) => ['reservations', 'detail', id] as const,
  },
  
  // Announcements
  announcements: {
    all: ['announcements'] as const,
    list: (filters?: Record<string, string | number | undefined>) => ['announcements', 'list', filters] as const,
    detail: (id: string) => ['announcements', 'detail', id] as const,
  },
  
  // Users
  users: {
    all: ['users'] as const,
    list: (page?: number) => ['users', 'list', page] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },
  
  // Health
  health: ['health'] as const,
} as const;

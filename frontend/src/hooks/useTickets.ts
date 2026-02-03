/**
 * SYNDIKA - useTickets Hook
 * React Query hook para listar tickets com cache e revalidação automática
 */

import { useQuery } from '@tanstack/react-query';
import { ticketsAPI, ListTicketsParams } from '@/lib/api';
import { Ticket } from '@/types/condominium';
import { QUERY_KEYS } from '@/lib/queryClient';

export interface UseTicketsOptions extends ListTicketsParams {
  enabled?: boolean;
}

/**
 * Hook para listar tickets do tenant atual
 * 
 * Uso:
 * ```tsx
 * const { data: tickets, isLoading, error } = useTickets();
 * const { data: openTickets } = useTickets({ status: 'open' });
 * const { data: urgentTickets } = useTickets({ priority: 'urgent' });
 * ```
 */
export function useTickets(options: UseTicketsOptions = {}) {
  const { enabled = true, ...params } = options;

  return useQuery<Ticket[], Error>({
    queryKey: QUERY_KEYS.tickets.list(params),
    queryFn: () => ticketsAPI.list(params),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutos (tickets mudam com frequência)
  });
}

/**
 * Hook para buscar um ticket específico
 * 
 * Uso:
 * ```tsx
 * const { data: ticket, isLoading } = useTicket(ticketId);
 * ```
 */
export function useTicket(id: string, options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;

  return useQuery<Ticket, Error>({
    queryKey: QUERY_KEYS.tickets.detail(id),
    queryFn: () => ticketsAPI.get(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * SYNDIKA - useTickets Hook
 * React Query hook para listar tickets com cache e revalidação automática
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { ticketsAPI, ListTicketsParams } from '@/lib/api';
import { Ticket } from '@/types/condominium';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { queryClient } from '@/lib/queryClient';

export interface UseTicketsOptions extends ListTicketsParams {
  enabled?: boolean;
}

/**
 * Hook para listar tickets do tenant atual
 *
 * Uso:
 * ```tsx
 * const { data: tickets, isLoading, error } = useTickets();
 * const { data: openTickets } = useTickets({ status: 'aberto' });
 * const { data: urgentTickets } = useTickets({ priority: 'urgente' });
 * ```
 *
 * Cache strategy:
 * - staleTime: 2 minutos (tickets mudam com frequência)
 * - gcTime: 10 minutos (garante que dados não stale continuam disponíveis)
 */
export function useTickets(options: UseTicketsOptions = {}) {
  const { enabled = true, ...params } = options;

  return useQuery<Ticket[], Error>({
    queryKey: QUERY_KEYS.tickets.list(params),
    queryFn: () => ticketsAPI.list(params),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

/**
 * Hook para buscar um ticket específico
 *
 * Uso:
 * ```tsx
 * const { data: ticket, isLoading } = useTicket(ticketId);
 * ```
 *
 * Cache strategy:
 * - staleTime: 5 minutos (ticket detail pode ficar um pouco mais no cache)
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

/**
 * Hook para criar novo ticket
 *
 * Uso:
 * ```tsx
 * const { mutate: createTicket, isPending } = useCreateTicket();
 * createTicket({
 *   title: 'Vazamento no apto 101',
 *   description: '...',
 *   category: 'manutencao',
 *   priority: 'alta'
 * });
 * ```
 */
export function useCreateTicket() {
  return useMutation({
    mutationFn: (data: Parameters<typeof ticketsAPI.create>[0]) =>
      ticketsAPI.create(data),
    onSuccess: () => {
      // Invalidar cache de tickets ao criar novo
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tickets.all() });
    },
  });
}

/**
 * Hook para atualizar ticket
 */
export function useUpdateTicket(ticketId: string) {
  return useMutation({
    mutationFn: (data: Parameters<typeof ticketsAPI.update>[1]) =>
      ticketsAPI.update(ticketId, data),
    onSuccess: () => {
      // Invalidar cache específico do ticket e lista
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tickets.detail(ticketId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tickets.all() });
    },
  });
}

/**
 * Hook para deletar ticket
 */
export function useDeleteTicket() {
  return useMutation({
    mutationFn: (ticketId: string) =>
      ticketsAPI.delete(ticketId),
    onSuccess: () => {
      // Invalidar cache de tickets ao deletar
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tickets.all() });
    },
  });
}

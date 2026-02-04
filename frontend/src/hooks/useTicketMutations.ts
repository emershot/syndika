/**
 * SYNDIKA - useCreateTicket Hook
 * React Query mutation hook para criar tickets
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsAPI, CreateTicketRequest, UpdateTicketRequest } from '@/lib/api';
import { Ticket } from '@/types/condominium';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para criar novo ticket
 * 
 * Uso:
 * ```tsx
 * const createTicket = useCreateTicket();
 * 
 * const handleSubmit = async (data) => {
 *   await createTicket.mutateAsync(data);
 * };
 * ```
 */
export function useCreateTicket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Ticket, Error, CreateTicketRequest>({
    mutationFn: (data) => ticketsAPI.create(data),
    
    onSuccess: (newTicket) => {
      // Invalida cache de tickets para recarregar lista
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tickets.all() });
      
      // Feedback visual
      toast({
        title: 'Ticket criado!',
        description: `Ticket "${newTicket.title}" foi criado com sucesso.`,
        variant: 'default',
      });
    },
    
    onError: (error) => {
      console.error('[useCreateTicket] Erro ao criar ticket:', error);
      
      toast({
        title: 'Erro ao criar ticket',
        description: error.message || 'Não foi possível criar o ticket. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook para atualizar ticket existente
 * 
 * Uso:
 * ```tsx
 * const updateTicket = useUpdateTicket();
 * 
 * const handleUpdate = async (ticketId, data) => {
 *   await updateTicket.mutateAsync({ id: ticketId, data });
 * };
 * ```
 */
export function useUpdateTicket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Ticket, Error, { id: string; data: UpdateTicketRequest }>({
    mutationFn: ({ id, data }) => ticketsAPI.update(id, data),
    
    onSuccess: (updatedTicket, variables) => {
      // Invalida cache de tickets
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tickets.all() });
      
      // Atualiza cache específico do ticket
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tickets.detail(variables.id)
      });
      
      toast({
        title: 'Ticket atualizado!',
        description: `Ticket "${updatedTicket.title}" foi atualizado.`,
        variant: 'default',
      });
    },
    
    onError: (error) => {
      console.error('[useUpdateTicket] Erro ao atualizar ticket:', error);
      
      toast({
        title: 'Erro ao atualizar ticket',
        description: error.message || 'Não foi possível atualizar o ticket.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook para deletar ticket
 * 
 * Uso:
 * ```tsx
 * const deleteTicket = useDeleteTicket();
 * 
 * const handleDelete = async (ticketId) => {
 *   await deleteTicket.mutateAsync(ticketId);
 * };
 * ```
 */
export function useDeleteTicket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, string>({
    mutationFn: (id) => ticketsAPI.delete(id),
    
    onSuccess: (_, deletedId) => {
      // Invalida cache de tickets
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tickets.all() });
      
      // Remove do cache específico
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.tickets.detail(deletedId)
      });
      
      toast({
        title: 'Ticket removido!',
        description: 'O ticket foi removido com sucesso.',
        variant: 'default',
      });
    },
    
    onError: (error) => {
      console.error('[useDeleteTicket] Erro ao deletar ticket:', error);
      
      toast({
        title: 'Erro ao remover ticket',
        description: error.message || 'Não foi possível remover o ticket.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Permission Utils
 * 
 * Funções para validar permissões de usuário em operações específicas
 * Centraliza toda lógica de autorização
 */

import { User, Ticket, Announcement, Reservation } from '@/types/condominium';

// ===== TICKETS / CHAMADOS =====

/**
 * Valida se o usuário pode editar um chamado
 * 
 * Síndico/Superadmin: Pode editar qualquer chamado
 * Morador: Só pode editar o próprio e apenas se ainda estiver "aberto"
 * Conselho: Não pode editar (apenas comentar)
 */
export function canEditTicket(ticket: Ticket, user: User | null): boolean {
  if (!user) return false;

  // Síndico e Superadmin podem editar qualquer chamado
  if (user.role === 'sindico' || user.role === 'superadmin') {
    return true;
  }

  // Morador só pode editar o próprio e se estiver aberto
  if (user.role === 'morador') {
    return ticket.createdBy === user.id && ticket.status === 'aberto';
  }

  // Conselho não pode editar
  return false;
}

/**
 * Valida se o usuário pode deletar um chamado
 * 
 * Síndico/Superadmin: Pode deletar qualquer chamado
 * Outros: Não podem deletar
 */
export function canDeleteTicket(ticket: Ticket, user: User | null): boolean {
  if (!user) return false;

  // Apenas síndico e superadmin podem deletar
  return user.role === 'sindico' || user.role === 'superadmin';
}

/**
 * Valida se o usuário pode mudar status de um chamado
 * 
 * Síndico/Superadmin: Podem mudar para qualquer status
 * Morador: Não podem mudar status
 * Conselho: Não podem mudar status
 */
export function canChangeTicketStatus(ticket: Ticket, user: User | null): boolean {
  if (!user) return false;

  return user.role === 'sindico' || user.role === 'superadmin';
}

/**
 * Valida quais campos de um chamado o usuário pode editar
 * 
 * Retorna array de campos permitidos
 */
export function getEditableTicketFields(user: User | null): string[] {
  if (!user) return [];

  if (user.role === 'sindico' || user.role === 'superadmin') {
    return ['title', 'description', 'category', 'priority', 'status', 'location'];
  }

  if (user.role === 'morador') {
    return ['title', 'description', 'location'];
  }

  return [];
}

// ===== ANNOUNCEMENTS / AVISOS =====

/**
 * Valida se o usuário pode criar um aviso
 * 
 * Síndico/Superadmin: Podem criar
 * Outros: Não podem
 */
export function canCreateAnnouncement(user: User | null): boolean {
  if (!user) return false;

  return user.role === 'sindico' || user.role === 'superadmin';
}

/**
 * Valida se o usuário pode editar um aviso
 * 
 * Síndico/Superadmin: Podem editar qualquer aviso
 * Outros: Não podem editar
 */
export function canEditAnnouncement(announcement: Announcement, user: User | null): boolean {
  if (!user) return false;

  // Apenas síndico pode editar (qualquer um)
  return user.role === 'sindico' || user.role === 'superadmin';
}

/**
 * Valida se o usuário pode deletar um aviso
 * 
 * Síndico/Superadmin: Podem deletar
 * Outros: Não podem
 */
export function canDeleteAnnouncement(announcement: Announcement, user: User | null): boolean {
  if (!user) return false;

  return user.role === 'sindico' || user.role === 'superadmin';
}

// ===== RESERVATIONS / RESERVAS =====

/**
 * Valida se o usuário pode aprovar/recusar uma reserva
 * 
 * Síndico/Superadmin: Podem aprovar/recusar
 * Outros: Não podem
 */
export function canApproveReservation(reservation: Reservation, user: User | null): boolean {
  if (!user) return false;

  return user.role === 'sindico' || user.role === 'superadmin';
}

/**
 * Valida se o usuário pode editar uma reserva
 * 
 * Síndico/Superadmin: Podem editar qualquer reserva
 * Morador: Pode editar a própria apenas se pendente
 */
export function canEditReservation(reservation: Reservation, user: User | null): boolean {
  if (!user) return false;

  // Síndico pode editar qualquer uma
  if (user.role === 'sindico' || user.role === 'superadmin') {
    return true;
  }

  // Morador pode editar a sua própria se ainda estiver pendente
  if (user.role === 'morador') {
    return reservation.requestedBy === user.id && reservation.status === 'solicitada';
  }

  return false;
}

/**
 * Valida se o usuário pode cancelar uma reserva
 * 
 * Síndico/Superadmin: Podem cancelar qualquer uma
 * Morador: Pode cancelar a própria
 */
export function canCancelReservation(reservation: Reservation, user: User | null): boolean {
  if (!user) return false;

  // Síndico pode cancelar qualquer uma
  if (user.role === 'sindico' || user.role === 'superadmin') {
    return true;
  }

  // Morador pode cancelar a sua própria
  if (user.role === 'morador') {
    return reservation.requestedBy === user.id;
  }

  return false;
}

/**
 * Valida se o usuário pode ver uma reserva específica
 * 
 * Síndico/Superadmin: Veem todas
 * Morador: Vê apenas as suas
 * Conselho: Vê todas
 */
export function canViewReservation(reservation: Reservation, user: User | null): boolean {
  if (!user) return false;

  // Síndico, Superadmin e Conselho veem todas
  if (['sindico', 'superadmin', 'conselho'].includes(user.role)) {
    return true;
  }

  // Morador vê apenas as suas
  if (user.role === 'morador') {
    return reservation.requestedBy === user.id;
  }

  return false;
}

// ===== RESIDENTS / MORADORES =====

/**
 * Valida se o usuário pode acessar página de moradores
 * 
 * Síndico/Superadmin: Podem acessar
 * Outros: Não podem
 */
export function canViewResidents(user: User | null): boolean {
  if (!user) return false;

  return user.role === 'sindico' || user.role === 'superadmin';
}

/**
 * Valida se o usuário pode criar um morador
 * 
 * Síndico/Superadmin: Podem criar
 * Outros: Não podem
 */
export function canCreateResident(user: User | null): boolean {
  if (!user) return false;

  return user.role === 'sindico' || user.role === 'superadmin';
}

/**
 * Valida se o usuário pode editar um morador
 * 
 * Síndico/Superadmin: Podem editar
 * Outros: Não podem
 */
export function canEditResident(user: User | null): boolean {
  if (!user) return false;

  return user.role === 'sindico' || user.role === 'superadmin';
}

/**
 * Valida se o usuário pode deletar um morador
 * 
 * Síndico/Superadmin: Podem deletar
 * Outros: Não podem
 */
export function canDeleteResident(user: User | null): boolean {
  if (!user) return false;

  return user.role === 'sindico' || user.role === 'superadmin';
}

// ===== SETTINGS / CONFIGURAÇÕES =====

/**
 * Valida se o usuário pode acessar configurações
 * 
 * Síndico/Superadmin: Podem acessar
 * Outros: Não podem
 */
export function canViewSettings(user: User | null): boolean {
  if (!user) return false;

  return user.role === 'sindico' || user.role === 'superadmin';
}

/**
 * Valida se o usuário pode editar configurações
 * 
 * Síndico/Superadmin: Podem editar
 * Outros: Não podem
 */
export function canEditSettings(user: User | null): boolean {
  if (!user) return false;

  return user.role === 'sindico' || user.role === 'superadmin';
}

// ===== DASHBOARD =====

/**
 * Valida se o usuário pode acessar dashboard
 * 
 * Síndico/Superadmin/Conselho: Podem acessar
 * Morador: Não pode (vai para página específica de morador)
 */
export function canViewDashboard(user: User | null): boolean {
  if (!user) return false;

  return ['sindico', 'superadmin', 'conselho'].includes(user.role);
}

// ===== UTILITY FUNCTIONS =====

/**
 * Valida se um usuário é gestor (síndico ou superadmin)
 */
export function isManager(user: User | null): boolean {
  if (!user) return false;

  return user.role === 'sindico' || user.role === 'superadmin';
}

/**
 * Valida se um usuário é residente (morador)
 */
export function isResident(user: User | null): boolean {
  if (!user) return false;

  return user.role === 'morador';
}

/**
 * Valida se um usuário tem acesso administrativo
 */
export function isAdmin(user: User | null): boolean {
  if (!user) return false;

  return user.role === 'superadmin';
}

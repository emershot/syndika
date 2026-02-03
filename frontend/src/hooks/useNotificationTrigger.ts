import { useNotifications } from '@/hooks/useNotifications';
import { NotificationType, NotificationAction, Notification } from '@/types/condominium';

export function useNotificationTrigger() {
  const { addNotification } = useNotifications();

  const triggerNotification = (config: {
    type: NotificationType;
    action: NotificationAction;
    title: string;
    message: string;
    relatedId?: string;
    relatedType?: 'announcement' | 'ticket' | 'reservation' | 'resident';
  }) => {
    addNotification({
      userId: '', // Will be set by system
      type: config.type,
      action: config.action,
      title: config.title,
      message: config.message,
      relatedId: config.relatedId,
      relatedType: config.relatedType,
      isRead: false,
    });
  };

  // Announcement notifications
  const announceCreated = (title: string, id: string) => {
    triggerNotification({
      type: 'system',
      action: 'announcement_created',
      title: 'Novo Aviso Publicado',
      message: title,
      relatedId: id,
      relatedType: 'announcement',
    });
  };

  const announceUpdated = (title: string, id: string) => {
    triggerNotification({
      type: 'warning',
      action: 'announcement_updated',
      title: 'Aviso Atualizado',
      message: title,
      relatedId: id,
      relatedType: 'announcement',
    });
  };

  const announceDeleted = (title: string) => {
    triggerNotification({
      type: 'info',
      action: 'announcement_deleted',
      title: 'Aviso Removido',
      message: title,
    });
  };

  // Ticket notifications
  const ticketCreated = (title: string, id: string) => {
    triggerNotification({
      type: 'info',
      action: 'ticket_created',
      title: 'Novo Chamado',
      message: title,
      relatedId: id,
      relatedType: 'ticket',
    });
  };

  const ticketUpdated = (title: string, id: string) => {
    triggerNotification({
      type: 'info',
      action: 'ticket_updated',
      title: 'Chamado Atualizado',
      message: title,
      relatedId: id,
      relatedType: 'ticket',
    });
  };

  const ticketStatusChanged = (title: string, newStatus: string, id: string) => {
    triggerNotification({
      type: 'warning',
      action: 'ticket_status_changed',
      title: 'Chamado - Status Alterado',
      message: `${title} - ${newStatus}`,
      relatedId: id,
      relatedType: 'ticket',
    });
  };

  const ticketCommentAdded = (title: string, id: string) => {
    triggerNotification({
      type: 'info',
      action: 'ticket_comment_added',
      title: 'Novo Comentário',
      message: `Comentário adicionado a: ${title}`,
      relatedId: id,
      relatedType: 'ticket',
    });
  };

  // Reservation notifications
  const reservationCreated = (area: string, date: string, id: string) => {
    triggerNotification({
      type: 'info',
      action: 'reservation_created',
      title: 'Reserva Solicitada',
      message: `${area} - ${date}`,
      relatedId: id,
      relatedType: 'reservation',
    });
  };

  const reservationStatusChanged = (area: string, newStatus: string, id: string) => {
    const statusLabel = newStatus === 'aprovada' ? 'Aprovada' : 
                       newStatus === 'recusada' ? 'Recusada' :
                       'Cancelada';
    
    const type = newStatus === 'aprovada' ? 'system' : 
                newStatus === 'recusada' ? 'warning' : 'info';

    triggerNotification({
      type: type as NotificationType,
      action: 'reservation_status_changed',
      title: `Reserva ${statusLabel}`,
      message: area,
      relatedId: id,
      relatedType: 'reservation',
    });
  };

  // Resident notifications
  const residentCreated = (name: string, id: string) => {
    triggerNotification({
      type: 'system',
      action: 'resident_created',
      title: 'Novo Morador Cadastrado',
      message: name,
      relatedId: id,
      relatedType: 'resident',
    });
  };

  const residentUpdated = (name: string, id: string) => {
    triggerNotification({
      type: 'info',
      action: 'resident_updated',
      title: 'Dados do Morador Atualizados',
      message: name,
      relatedId: id,
      relatedType: 'resident',
    });
  };

  return {
    triggerNotification,
    announceCreated,
    announceUpdated,
    announceDeleted,
    ticketCreated,
    ticketUpdated,
    ticketStatusChanged,
    ticketCommentAdded,
    reservationCreated,
    reservationStatusChanged,
    residentCreated,
    residentUpdated,
  };
}

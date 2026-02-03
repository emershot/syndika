import { useCallback } from 'react';
import { ActivityLog, ActivityAction, ActivityEntity } from '@/types/condominium';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook para gerenciar logs de atividade (auditoria)
 * Registra todas as ações CRUD em localStorage
 * Usa chave: syndika_activity_logs
 */
export const useActivityLog = () => {
  // Recuperar histórico de logs do localStorage
  const getActivityLogs = useCallback((): ActivityLog[] => {
    const stored = localStorage.getItem('syndika_activity_logs');
    return stored ? JSON.parse(stored) : [];
  }, []);

  // Salvar novo log no histórico
  const saveActivityLog = useCallback((log: ActivityLog) => {
    const logs = getActivityLogs();
    logs.push(log);
    localStorage.setItem('syndika_activity_logs', JSON.stringify(logs));
  }, [getActivityLogs]);

  // Registrar atividade genérica
  const logActivity = useCallback(
    (
      userId: string,
      userName: string,
      action: ActivityAction,
      entity: ActivityEntity,
      entityId: string,
      options?: {
        entityTitle?: string;
        description?: string;
        changes?: ActivityLog['changes'];
      }
    ) => {
      const log: ActivityLog = {
        id: uuidv4(),
        userId,
        userName,
        action,
        entity,
        entityId,
        entityTitle: options?.entityTitle,
        description: options?.description,
        changes: options?.changes,
        timestamp: new Date(),
      };

      saveActivityLog(log);
      console.log('📝 Log de atividade registrado:', log);
      return log;
    },
    [saveActivityLog]
  );

  // ===== MÉTODOS ESPECÍFICOS POR ENTIDADE =====

  // Ticket: Novo chamado criado
  const logTicketCreated = useCallback(
    (userId: string, userName: string, ticketData: Record<string, unknown>) => {
      return logActivity(userId, userName, 'create', 'ticket', String(ticketData.id), {
        entityTitle: String(ticketData.title),
        description: `Novo chamado criado: ${ticketData.title}`,
      });
    },
    [logActivity]
  );

  // Ticket: Status alterado
  const logTicketStatusChanged = useCallback(
    (
      userId: string,
      userName: string,
      ticketId: string,
      ticketTitle: string,
      oldStatus: string,
      newStatus: string
    ) => {
      return logActivity(userId, userName, 'status_change', 'ticket', ticketId, {
        entityTitle: ticketTitle,
        description: `Status alterado: ${oldStatus} → ${newStatus}`,
        changes: [
          {
            field: 'status',
            oldValue: oldStatus,
            newValue: newStatus,
          },
        ],
      });
    },
    [logActivity]
  );

  // Ticket: Comentário adicionado
  const logTicketCommentAdded = useCallback(
    (userId: string, userName: string, ticketId: string, ticketTitle: string) => {
      return logActivity(userId, userName, 'comment_added', 'ticket', ticketId, {
        entityTitle: ticketTitle,
        description: `Comentário adicionado ao chamado`,
      });
    },
    [logActivity]
  );

  // Announcement: Novo aviso criado
  const logAnnouncementCreated = useCallback(
    (userId: string, userName: string, announcementData: Record<string, unknown>) => {
      return logActivity(userId, userName, 'create', 'announcement', String(announcementData.id), {
        entityTitle: String(announcementData.title),
        description: `Novo aviso publicado: ${announcementData.title}`,
      });
    },
    [logActivity]
  );

  // Announcement: Aviso editado
  const logAnnouncementUpdated = useCallback(
    (userId: string, userName: string, announcementId: string, announcementTitle: string) => {
      return logActivity(userId, userName, 'update', 'announcement', announcementId, {
        entityTitle: announcementTitle,
        description: `Aviso editado: ${announcementTitle}`,
      });
    },
    [logActivity]
  );

  // Announcement: Aviso deletado
  const logAnnouncementDeleted = useCallback(
    (userId: string, userName: string, announcementId: string, announcementTitle: string) => {
      return logActivity(userId, userName, 'delete', 'announcement', announcementId, {
        entityTitle: announcementTitle,
        description: `Aviso deletado: ${announcementTitle}`,
      });
    },
    [logActivity]
  );

  // Reservation: Reserva aprovada
  const logReservationApproved = useCallback(
    (userId: string, userName: string, reservationId: string, areaName: string) => {
      return logActivity(userId, userName, 'approved', 'reservation', reservationId, {
        entityTitle: areaName,
        description: `Reserva aprovada: ${areaName}`,
      });
    },
    [logActivity]
  );

  // Reservation: Reserva rejeitada
  const logReservationRejected = useCallback(
    (userId: string, userName: string, reservationId: string, areaName: string, reason?: string) => {
      return logActivity(userId, userName, 'rejected', 'reservation', reservationId, {
        entityTitle: areaName,
        description: `Reserva rejeitada: ${areaName}${reason ? ` (${reason})` : ''}`,
      });
    },
    [logActivity]
  );

  // Resident: Novo morador
  const logResidentCreated = useCallback(
    (userId: string, userName: string, residentData: Record<string, unknown>) => {
      return logActivity(userId, userName, 'create', 'resident', String(residentData.id), {
        entityTitle: String(residentData.name),
        description: `Novo morador adicionado: ${residentData.name}`,
      });
    },
    [logActivity]
  );

  // Resident: Morador atualizado
  const logResidentUpdated = useCallback(
    (userId: string, userName: string, residentId: string, residentName: string) => {
      return logActivity(userId, userName, 'update', 'resident', residentId, {
        entityTitle: residentName,
        description: `Morador atualizado: ${residentName}`,
      });
    },
    [logActivity]
  );

  // Resident: Morador deletado
  const logResidentDeleted = useCallback(
    (userId: string, userName: string, residentId: string, residentName: string) => {
      return logActivity(userId, userName, 'delete', 'resident', residentId, {
        entityTitle: residentName,
        description: `Morador deletado: ${residentName}`,
      });
    },
    [logActivity]
  );

  // Filtrar logs por usuário
  const getLogsByUser = useCallback(
    (userId: string): ActivityLog[] => {
      return getActivityLogs().filter((log) => log.userId === userId);
    },
    [getActivityLogs]
  );

  // Filtrar logs por entidade
  const getLogsByEntity = useCallback(
    (entity: ActivityEntity): ActivityLog[] => {
      return getActivityLogs().filter((log) => log.entity === entity);
    },
    [getActivityLogs]
  );

  // Filtrar logs por ação
  const getLogsByAction = useCallback(
    (action: ActivityAction): ActivityLog[] => {
      return getActivityLogs().filter((log) => log.action === action);
    },
    [getActivityLogs]
  );

  // Filtrar logs por date range
  const getLogsByDateRange = useCallback(
    (startDate: Date, endDate: Date): ActivityLog[] => {
      return getActivityLogs().filter((log) => {
        const logDate = new Date(log.timestamp);
        return logDate >= startDate && logDate <= endDate;
      });
    },
    [getActivityLogs]
  );

  // Filtro combinado
  const filterLogs = useCallback(
    (options?: {
      userId?: string;
      entity?: ActivityEntity;
      action?: ActivityAction;
      startDate?: Date;
      endDate?: Date;
    }): ActivityLog[] => {
      let logs = getActivityLogs();

      if (options?.userId) {
        logs = logs.filter((l) => l.userId === options.userId);
      }
      if (options?.entity) {
        logs = logs.filter((l) => l.entity === options.entity);
      }
      if (options?.action) {
        logs = logs.filter((l) => l.action === options.action);
      }
      if (options?.startDate && options?.endDate) {
        logs = logs.filter((l) => {
          const logDate = new Date(l.timestamp);
          return logDate >= options.startDate! && logDate <= options.endDate!;
        });
      }

      // Retornar ordenado por timestamp descrescente (mais recentes primeiro)
      return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },
    [getActivityLogs]
  );

  return {
    logActivity,
    logTicketCreated,
    logTicketStatusChanged,
    logTicketCommentAdded,
    logAnnouncementCreated,
    logAnnouncementUpdated,
    logAnnouncementDeleted,
    logReservationApproved,
    logReservationRejected,
    logResidentCreated,
    logResidentUpdated,
    logResidentDeleted,
    getActivityLogs,
    getLogsByUser,
    getLogsByEntity,
    getLogsByAction,
    getLogsByDateRange,
    filterLogs,
  };
};

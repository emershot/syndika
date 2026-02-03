import { useCallback } from 'react';
import { EmailType, EmailNotification } from '@/types/condominium';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook para gerenciar envios de email
 * Simula envios com Resend (sem backend real)
 * Armazena histórico em localStorage
 */
export const useEmailService = () => {
  // Recuperar histórico de emails do localStorage
  const getEmailHistory = useCallback((): EmailNotification[] => {
    const stored = localStorage.getItem('syndika_email_history');
    return stored ? JSON.parse(stored) : [];
  }, []);

  // Salvar novo email no histórico
  const saveEmailToHistory = useCallback((email: EmailNotification) => {
    const history = getEmailHistory();
    history.push(email);
    localStorage.setItem('syndika_email_history', JSON.stringify(history));
  }, [getEmailHistory]);

  // Enviar email (simula com localStorage)
  const sendEmail = useCallback(
    async (
      to: string,
      subject: string,
      type: EmailType,
      templateData: Record<string, unknown>
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        // Validação básica
        if (!to || !to.includes('@')) {
          return { success: false, error: 'Email inválido' };
        }

        // Criar registro de email
        const emailNotification: EmailNotification = {
          id: uuidv4(),
          type,
          to,
          subject,
          templateData,
          sentAt: new Date(),
          deliveryStatus: 'sent', // Simula sucesso
        };

        // Salvar no histórico
        saveEmailToHistory(emailNotification);

        // Log para debug
        console.log('📧 Email enviado:', {
          to,
          subject,
          type,
          timestamp: new Date().toISOString(),
        });

        // Simula delay de envio (50ms)
        await new Promise((resolve) => setTimeout(resolve, 50));

        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar email';
        console.error('❌ Erro ao enviar email:', errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [saveEmailToHistory]
  );

  // Enviar email para síndico quando novo chamado
  const sendTicketCreatedEmail = useCallback(
    async (sindicoEmail: string, ticketData: unknown) => {
      const ticket = ticketData as Record<string, unknown>;
      return sendEmail(
        sindicoEmail,
        `🆕 Novo Chamado: ${ticket.title}`,
        'ticket_created',
        {
          ticketId: ticket.id,
          title: ticket.title,
          category: ticket.category,
          priority: ticket.priority,
          createdBy: ticket.createdBy,
          description: ticket.description,
          location: ticket.location,
        }
      );
    },
    [sendEmail]
  );

  // Enviar email quando chamado é atualizado
  const sendTicketUpdatedEmail = useCallback(
    async (sindicoEmail: string, ticketData: unknown) => {
      const ticket = ticketData as Record<string, unknown>;
      return sendEmail(
        sindicoEmail,
        `✏️ Chamado Atualizado: ${ticket.title}`,
        'ticket_updated',
        {
          ticketId: ticket.id,
          title: ticket.title,
          newStatus: ticket.status,
          updatedAt: new Date().toISOString(),
        }
      );
    },
    [sendEmail]
  );

  // Enviar email quando chamado é atribuído
  const sendTicketAssignedEmail = useCallback(
    async (assigneeEmail: string, ticketData: unknown) => {
      const ticket = ticketData as Record<string, unknown>;
      return sendEmail(
        assigneeEmail,
        `📌 Chamado Atribuído a Você: ${ticket.title}`,
        'ticket_assigned',
        {
          ticketId: ticket.id,
          title: ticket.title,
          category: ticket.category,
          priority: ticket.priority,
          description: ticket.description,
        }
      );
    },
    [sendEmail]
  );

  // Enviar email para todos moradores quando novo aviso
  const sendAnnouncementPublishedEmail = useCallback(
    async (moradoresEmails: string[], announcementData: unknown) => {
      const announcement = announcementData as Record<string, unknown>;
      const emailPromises = moradoresEmails.map((email) =>
        sendEmail(
          email,
          `📢 Novo Aviso: ${announcement.title}`,
          'announcement_published',
          {
            announcementId: announcement.id,
            title: announcement.title,
            type: announcement.type,
            content: announcement.content,
            publishedAt: new Date().toISOString(),
          }
        )
      );

      const results = await Promise.all(emailPromises);
      const successCount = results.filter((r) => r.success).length;

      return {
        success: results.every((r) => r.success),
        successCount,
        totalCount: moradoresEmails.length,
      };
    },
    [sendEmail]
  );

  // Enviar email de aprovação de reserva
  const sendReservationApprovedEmail = useCallback(
    async (moradorEmail: string, reservationData: unknown) => {
      const reservation = reservationData as Record<string, unknown>;
      return sendEmail(
        moradorEmail,
        `✅ Reserva Aprovada: ${reservation.area}`,
        'reservation_approved',
        {
          reservationId: reservation.id,
          area: reservation.area,
          date: reservation.date,
          timeSlot: reservation.timeSlot,
        }
      );
    },
    [sendEmail]
  );

  // Enviar email de rejeição de reserva
  const sendReservationRejectedEmail = useCallback(
    async (moradorEmail: string, reservationData: unknown, reason?: string) => {
      const reservation = reservationData as Record<string, unknown>;
      return sendEmail(
        moradorEmail,
        `❌ Reserva Recusada: ${reservation.area}`,
        'reservation_rejected',
        {
          reservationId: reservation.id,
          area: reservation.area,
          date: reservation.date,
          reason: reason || 'Sem motivo especificado',
        }
      );
    },
    [sendEmail]
  );

  return {
    sendEmail,
    sendTicketCreatedEmail,
    sendTicketUpdatedEmail,
    sendTicketAssignedEmail,
    sendAnnouncementPublishedEmail,
    sendReservationApprovedEmail,
    sendReservationRejectedEmail,
    getEmailHistory,
  };
};

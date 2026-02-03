import React, { useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react';

export interface DashboardAlert {
  type: 'error' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  id: string;
}

interface UseDashboardAlertsProps {
  openTickets: number;
  urgentTickets: number;
  pendingReservations: number;
  avgResolutionTime: number;
  unreadAnnouncements: number;
}

export function useDashboardAlerts({
  openTickets,
  urgentTickets,
  pendingReservations,
  avgResolutionTime,
  unreadAnnouncements,
}: UseDashboardAlertsProps) {
  // Track shown alerts to avoid duplicates
  const shownAlertsKey = 'syndika_shown_alerts';
  
  const getShownAlerts = useCallback((): Set<string> => {
    try {
      const stored = localStorage.getItem(shownAlertsKey);
      return new Set(stored ? JSON.parse(stored) : []);
    } catch {
      return new Set();
    }
  }, []);

  const saveShownAlert = useCallback((alertId: string) => {
    const shown = getShownAlerts();
    shown.add(alertId);
    localStorage.setItem(shownAlertsKey, JSON.stringify(Array.from(shown)));
  }, [getShownAlerts]);

  const clearOldAlerts = useCallback(() => {
    const now = Date.now();
    const lastClear = localStorage.getItem('syndika_alerts_last_clear');
    
    // Clear shown alerts every 24 hours
    if (!lastClear || now - parseInt(lastClear) > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(shownAlertsKey);
      localStorage.setItem('syndika_alerts_last_clear', now.toString());
    }
  }, []);

  useEffect(() => {
    clearOldAlerts();
    const shownAlerts = getShownAlerts();

    // Alert 1: Urgent Tickets
    if (urgentTickets > 0) {
      const alertId = `urgent-tickets-${urgentTickets}`;
      if (!shownAlerts.has(alertId)) {
        toast.error(
          `${urgentTickets} chamado${urgentTickets > 1 ? 's' : ''} urgente${urgentTickets > 1 ? 's' : ''}!`,
          {
            description: 'Há chamados marcados como urgentes aguardando atenção imediata.',
            icon: React.createElement(AlertTriangle, { className: 'h-4 w-4' }),
            duration: 6000,
          }
        );
        saveShownAlert(alertId);
      }
    }

    // Alert 2: High Open Tickets
    if (openTickets > 10) {
      const alertId = `high-open-tickets-${openTickets}`;
      if (!shownAlerts.has(alertId)) {
        toast.warning(
          `Volume alto de chamados (${openTickets})`,
          {
            description: 'Você tem muitos chamados abertos. Considere priorizar ou distribuir.',
            icon: React.createElement(AlertCircle, { className: 'h-4 w-4' }),
            duration: 5000,
          }
        );
        saveShownAlert(alertId);
      }
    }

    // Alert 3: Slow Resolution Time
    if (avgResolutionTime > 48) {
      const alertId = `slow-resolution-${Math.floor(avgResolutionTime)}`;
      if (!shownAlerts.has(alertId)) {
        toast.warning(
          `Tempo de resolução elevado (${Math.round(avgResolutionTime)}h)`,
          {
            description: 'O tempo médio de resolução está acima da meta. Revise os chamados bloqueados.',
            icon: React.createElement(AlertCircle, { className: 'h-4 w-4' }),
            duration: 5000,
          }
        );
        saveShownAlert(alertId);
      }
    }

    // Alert 4: Pending Reservations
    if (pendingReservations > 5) {
      const alertId = `pending-reservations-${pendingReservations}`;
      if (!shownAlerts.has(alertId)) {
        toast.info(
          `${pendingReservations} reservas aguardando aprovação`,
          {
            description: 'Há solicitações de reserva pendentes de análise. Verifique o calendário.',
            icon: React.createElement(Info, { className: 'h-4 w-4' }),
            duration: 4000,
          }
        );
        saveShownAlert(alertId);
      }
    }

    // Alert 5: Unread Announcements
    if (unreadAnnouncements > 0) {
      const alertId = `unread-announcements-${unreadAnnouncements}`;
      if (!shownAlerts.has(alertId)) {
        toast.info(
          `${unreadAnnouncements} aviso${unreadAnnouncements > 1 ? 's' : ''} não lido${unreadAnnouncements > 1 ? 's' : ''}`,
          {
            description: 'Há avisos novos para revisar.',
            icon: React.createElement(Info, { className: 'h-4 w-4' }),
            duration: 3000,
          }
        );
        saveShownAlert(alertId);
      }
    }

    // Alert 6: Everything Good
    if (
      urgentTickets === 0 &&
      openTickets <= 5 &&
      avgResolutionTime <= 24 &&
      pendingReservations <= 2
    ) {
      const alertId = 'all-good';
      if (!shownAlerts.has(alertId)) {
        toast.success(
          'Tudo em ordem! 🎉',
          {
            description: 'Sua gestão está em dia e o fluxo de trabalho está normalizado.',
            icon: React.createElement(CheckCircle, { className: 'h-4 w-4' }),
            duration: 3000,
          }
        );
        saveShownAlert(alertId);
      }
    }
  }, [openTickets, urgentTickets, pendingReservations, avgResolutionTime, unreadAnnouncements, getShownAlerts, saveShownAlert, clearOldAlerts]);
}

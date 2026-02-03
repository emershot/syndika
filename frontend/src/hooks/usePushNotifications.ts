import { useEffect } from 'react';
import { useNotifications } from './useNotifications';

/**
 * Hook para ativar Web Push Notifications
 * - Solicita permissão do navegador para notificações
 * - Registra service worker para notificações push
 * - Funciona apenas em HTTPS ou localhost
 */
export const usePushNotifications = () => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Verificar suporte a notifications
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta Web Notifications');
      return;
    }

    // Solicitar permissão se ainda não tiver
    if (Notification.permission === 'granted') {
      // Já tem permissão
      registerServiceWorker();
    } else if (Notification.permission !== 'denied') {
      // Solicitar permissão
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          registerServiceWorker();
        }
      });
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      // Registrar service worker (se houver)
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        
        // Adicionar listener para mensagens do service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data.type === 'RESERVATION_CREATED') {
            // Notificação de nova reserva
            new Notification('🎉 Nova Reserva Solicitada', {
              body: event.data.message,
              icon: '/vite.svg',
              badge: '/vite.svg',
              tag: 'reservation-notification',
            });
          }
        });
      }
    } catch (error) {
      console.error('Erro ao registrar service worker:', error);
    }
  };

  /**
   * Enviar notificação push para síndicos
   * Uso: sendPushNotification('Nova reserva de João Silva', 'Salão de Festas')
   */
  const sendPushNotification = (title: string, body: string, icon?: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/vite.svg',
        badge: '/vite.svg',
        tag: 'app-notification',
      });
    }
  };

  return { sendPushNotification };
};

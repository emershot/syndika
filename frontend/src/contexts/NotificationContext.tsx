import { useState, ReactNode, useEffect, createContext, useCallback, useMemo } from 'react';
import { Notification } from '@/types/condominium';

const STORAGE_KEY = 'syndika_notifications';
const MAX_NOTIFICATIONS = 100; // Limitar a 100 notificações máximo

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAll: () => void;
  getUnreadNotifications: () => Notification[];
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * DateReviver para JSON.parse com datas automaticamente convertidas
 */
const dateReviver = (_key: string, value: any): any => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    return new Date(value);
  }
  return value;
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Restore notifications from localStorage on mount
  useEffect(() => {
    const storedNotifications = localStorage.getItem(STORAGE_KEY);
    if (storedNotifications) {
      try {
        const parsed = JSON.parse(storedNotifications, dateReviver) as Notification[];
        // Limpar notificações expiradas
        const now = new Date();
        const filtered = parsed.filter(
          (n) => !n.expiresAt || new Date(n.expiresAt) > now
        );
        setNotifications(filtered.slice(0, MAX_NOTIFICATIONS));
      } catch (error) {
        console.error('[NotificationContext] Error parsing stored notifications:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // Auto-cleanup de notificações expiradas a cada 1 minuto
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setNotifications((prev) => {
        const now = new Date();
        return prev.filter((n) => !n.expiresAt || new Date(n.expiresAt) > now);
      });
    }, 60 * 1000); // 1 minuto

    return () => clearInterval(cleanupInterval);
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'createdAt'>) => {
      const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
      };

      setNotifications((prev) => {
        // Manter apenas MAX_NOTIFICATIONS mais recentes
        const updated = [newNotification, ...prev];
        return updated.slice(0, MAX_NOTIFICATIONS);
      });
    },
    []
  );

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Memoizar getUnreadNotifications para evitar recálculo a cada render
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter((n) => !n.isRead);
  }, [notifications]);

  // Memoizar unreadCount
  const unreadCount = useMemo(
    () => getUnreadNotifications().length,
    [getUnreadNotifications]
  );

  const value: NotificationContextType = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      getUnreadNotifications,
    }),
    [
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      getUnreadNotifications,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

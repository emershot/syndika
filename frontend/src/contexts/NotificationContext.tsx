import { useState, ReactNode, useEffect, createContext } from 'react';
import { Notification } from '@/types/condominium';

const STORAGE_KEY = 'syndika_notifications';

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

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Restore notifications from localStorage on mount
  useEffect(() => {
    const storedNotifications = localStorage.getItem(STORAGE_KEY);
    if (storedNotifications) {
      try {
        const parsed = JSON.parse(storedNotifications) as Array<Record<string, unknown>>;
        // Convert date strings back to Date objects
        const hydrated = parsed.map((n) => ({
          ...n,
          createdAt: new Date(String(n.createdAt)),
          expiresAt: n.expiresAt ? new Date(String(n.expiresAt)) : undefined,
        })) as Notification[];
        setNotifications(hydrated);
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date(),
    };
    setNotifications([newNotification, ...notifications]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getUnreadNotifications = () => {
    return notifications.filter(n => !n.isRead);
  };

  const unreadCount = getUnreadNotifications().length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        getUnreadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

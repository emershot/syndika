import { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification, NotificationType } from '@/types/condominium';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Settings,
  Trash2,
  Check,
  Search,
  Bell,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface NotificationCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  info: <Info className="h-4 w-4 text-blue-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  urgent: <AlertCircle className="h-4 w-4 text-red-500" />,
  system: <Settings className="h-4 w-4 text-gray-500" />,
};

const notificationColors: Record<NotificationType, string> = {
  info: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
  urgent: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
  system: 'bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800',
};

export function NotificationCenter({ open, onOpenChange }: NotificationCenterProps) {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | NotificationType>('all');

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      (notif.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (notif.message?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'unread' && !notif.isRead) ||
      (filterType !== 'unread' && notif.type === filterType);

    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[90vh] max-h-[90vh]">
        <DrawerHeader className="space-y-4 border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </DrawerTitle>
              <DrawerDescription>
                {unreadCount > 0
                  ? `${unreadCount} não lida${unreadCount !== 1 ? 's' : ''}`
                  : 'Todas as notificações lidas'}
              </DrawerDescription>
            </div>
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Marcar tudo como lido
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar notificações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </DrawerHeader>

        {/* Filters */}
        <div className="border-b px-6 py-3">
          <Tabs value={filterType} onValueChange={(v) => setFilterType(v as 'all' | 'unread' | NotificationType)}>
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="all" className="text-xs">
                Todas
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                Não lidas
              </TabsTrigger>
              <TabsTrigger value="urgent" className="text-xs">
                Urgentes
              </TabsTrigger>
              <TabsTrigger value="warning" className="text-xs">
                Avisos
              </TabsTrigger>
              <TabsTrigger value="info" className="text-xs">
                Info
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-2 opacity-50" />
              <p className="text-muted-foreground">
                {searchTerm || filterType !== 'all'
                  ? 'Nenhuma notificação encontrada'
                  : 'Você não tem notificações no momento'}
              </p>
            </div>
          ) : (
            <div className="space-y-2 px-4 py-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    'p-4 rounded-lg border cursor-pointer transition-colors',
                    notificationColors[notification.type],
                    !notification.isRead && 'ring-1 ring-primary/50 font-medium'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {notificationIcons[notification.type]}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-medium text-sm">
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(notification.createdAt, "dd 'de' MMM 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>

                    {/* Actions */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-3 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => {
                if (
                  confirm('Tem certeza que deseja limpar todas as notificações?')
                ) {
                  notifications.forEach(n => deleteNotification(n.id));
                }
              }}
            >
              Limpar tudo
            </Button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

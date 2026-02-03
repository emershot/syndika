import { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationCenter } from '@/components/common/NotificationCenter';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative h-10 w-10"
        onClick={() => setOpen(true)}
      >
        <Bell className="h-5 w-5 text-sidebar-foreground" />
        {unreadCount > 0 && (
          <span
            className={cn(
              'absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center',
              unreadCount > 9 && 'text-[0.65rem] p-0'
            )}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>
      <NotificationCenter open={open} onOpenChange={setOpen} />
    </>
  );
}

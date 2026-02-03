import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/useAuth';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();
  const { sendPushNotification } = usePushNotifications();

  // Ativar push notifications apenas para síndicos
  useEffect(() => {
    if (user?.role === 'sindico' || user?.role === 'superadmin') {
      // Push notifications já ativado automaticamente pelo hook
      // Esta linha existe só para confirmar que síndico tem push enabled
      console.log('Push Notifications ativadas para síndico');
    }
  }, [user?.role]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

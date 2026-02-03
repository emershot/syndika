import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LastUpdateDisplayProps {
  lastUpdate?: Date;
  isRefreshing?: boolean;
  className?: string;
}

export function LastUpdateDisplay({
  lastUpdate,
  isRefreshing = false,
  className,
}: LastUpdateDisplayProps) {
  const [relativeTime, setRelativeTime] = useState<string>('');

  useEffect(() => {
    if (!lastUpdate) return;

    const updateRelativeTime = () => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);

      if (diff < 60) {
        setRelativeTime('há alguns segundos');
      } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        setRelativeTime(`há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`);
      } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        setRelativeTime(`há ${hours} ${hours === 1 ? 'hora' : 'horas'}`);
      } else {
        const days = Math.floor(diff / 86400);
        setRelativeTime(`há ${days} ${days === 1 ? 'dia' : 'dias'}`);
      }
    };

    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 30000); // Atualizar a cada 30 segundos

    return () => clearInterval(interval);
  }, [lastUpdate]);

  if (!lastUpdate || !relativeTime) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-xs text-muted-foreground',
        isRefreshing && 'opacity-50',
        className
      )}
      title={lastUpdate.toLocaleString('pt-BR')}
    >
      <Clock className={cn('h-3 w-3', isRefreshing && 'animate-spin')} />
      <span>Atualizado {relativeTime}</span>
    </div>
  );
}

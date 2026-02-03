import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Lightbulb, AlertCircle, CheckCircle, Info } from 'lucide-react';

type InsightType = 'info' | 'warning' | 'success' | 'tip';

interface InsightCardProps {
  type: InsightType;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const stylesByType = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-100 dark:bg-blue-900/50',
    Icon: Info,
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    icon: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-100 dark:bg-amber-900/50',
    Icon: AlertCircle,
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    badge: 'bg-green-100 dark:bg-green-900/50',
    Icon: CheckCircle,
  },
  tip: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-800',
    icon: 'text-purple-600 dark:text-purple-400',
    badge: 'bg-purple-100 dark:bg-purple-900/50',
    Icon: Lightbulb,
  },
};

export function InsightCard({ type, title, message, action }: InsightCardProps) {
  const style = stylesByType[type];
  const Icon = style.Icon;

  return (
    <div
      className={cn(
        'p-4 rounded-lg border-2 flex gap-3 transition-all hover:shadow-md',
        style.bg,
        style.border
      )}
    >
      <div className={cn('p-2 rounded-lg flex-shrink-0', style.badge)}>
        <Icon className={cn('h-5 w-5', style.icon)} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{title}</h4>
        <p className="text-sm text-gray-700 dark:text-gray-400 mt-1 leading-relaxed">{message}</p>
        {action && (
          <button
            onClick={action.onClick}
            className={cn(
              'text-sm font-medium mt-3 transition-colors',
              style.icon,
              'hover:brightness-110'
            )}
          >
            {action.label} →
          </button>
        )}
      </div>
    </div>
  );
}

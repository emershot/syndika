import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger';
  onClick?: () => void;
  footer?: ReactNode;
  className?: string;
  isLoading?: boolean;
}

const variantStyles = {
  default: 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200',
  primary: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
  success: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
  warning: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
  info: 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200',
  danger: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
};

const iconStyles = {
  default: 'bg-slate-200 text-slate-700',
  primary: 'bg-blue-200 text-blue-700',
  success: 'bg-green-200 text-green-700',
  warning: 'bg-amber-200 text-amber-700',
  info: 'bg-cyan-200 text-cyan-700',
  danger: 'bg-red-200 text-red-700',
};

const trendStyles = {
  positive: 'text-green-700 bg-green-100',
  negative: 'text-red-700 bg-red-100',
};

export function KPICard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  variant = 'default',
  onClick,
  footer,
  className,
  isLoading = false,
}: KPICardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-lg border p-5 transition-all duration-200',
        'hover:shadow-lg hover:-translate-y-0.5',
        onClick && 'cursor-pointer',
        variantStyles[variant],
        isLoading && 'opacity-60 pointer-events-none',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold font-heading text-gray-900">
              {isLoading ? '—' : value}
            </p>
            {trend && !isLoading && (
              <div
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold',
                  trend.isPositive ? trendStyles.positive : trendStyles.negative
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {trend.isPositive ? '+' : '−'}{Math.abs(trend.value)}%
              </div>
            )}
          </div>
          {description && (
            <p className="mt-2 text-xs text-gray-600">{description}</p>
          )}
        </div>
        <div
          className={cn(
            'rounded-lg p-3 flex-shrink-0',
            iconStyles[variant]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {footer && (
        <>
          <div className="mt-4 pt-4 border-t border-gray-200">
            {footer}
          </div>
        </>
      )}
    </div>
  );
}

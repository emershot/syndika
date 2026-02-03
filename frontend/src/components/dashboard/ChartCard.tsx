import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: ReactNode;
  isLoading?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  }>;
  className?: string;
  compact?: boolean;
}

export function ChartCard({
  title,
  subtitle,
  icon: Icon,
  children,
  isLoading = false,
  actions,
  className,
  compact = false,
}: ChartCardProps) {
  return (
    <Card className={cn('shadow-card hover:shadow-lg transition-shadow', className)}>
      <CardHeader className={cn('pb-2', !compact && 'pb-4')}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {Icon && <Icon className="h-5 w-5 text-primary" />}
              <CardTitle className="text-base lg:text-lg">{title}</CardTitle>
            </div>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {actions && actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actions.map((action, idx) => (
                  <DropdownMenuItem key={idx} onClick={action.onClick}>
                    {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className={cn(isLoading && 'opacity-50 pointer-events-none')}>
        {children}
      </CardContent>
    </Card>
  );
}

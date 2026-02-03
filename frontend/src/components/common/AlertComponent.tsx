import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertComponentProps {
  type: AlertType;
  title?: string;
  message: string;
  closeable?: boolean;
  onClose?: () => void;
}

export function AlertComponent({
  type,
  title,
  message,
  closeable = true,
  onClose,
}: AlertComponentProps) {
  const iconMap = {
    success: <CheckCircle2 className="h-4 w-4" />,
    error: <AlertCircle className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
  };

  const typeMap = {
    success: 'border-success/20 bg-success/10 text-success-foreground',
    error: 'border-destructive/20 bg-destructive/10 text-destructive-foreground',
    warning: 'border-warning/20 bg-warning/10 text-warning-foreground',
    info: 'border-info/20 bg-info/10 text-info-foreground',
  };

  return (
    <Alert className={`${typeMap[type]} flex items-start gap-3`}>
      {iconMap[type]}
      <div className="flex-1">
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{message}</AlertDescription>
      </div>
      {closeable && (
        <button
          onClick={onClose}
          className="text-current opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      )}
    </Alert>
  );
}

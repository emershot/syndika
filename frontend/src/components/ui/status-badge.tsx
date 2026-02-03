import { cn } from "@/lib/utils";
import { 
  TicketStatus, 
  TicketPriority, 
  AnnouncementType, 
  ReservationStatus 
} from "@/types/condominium";

interface StatusBadgeProps {
  status?: TicketStatus | ReservationStatus;
  priority?: TicketPriority;
  type?: AnnouncementType;
  className?: string;
}

const ticketStatusConfig: Record<TicketStatus, { label: string; className: string }> = {
  aberto: { label: 'Aberto', className: 'bg-info-light text-info' },
  em_andamento: { label: 'Em andamento', className: 'bg-warning-light text-warning' },
  aguardando: { label: 'Aguardando', className: 'bg-accent-light text-accent' },
  resolvido: { label: 'Resolvido', className: 'bg-success-light text-success' },
  arquivado: { label: 'Arquivado', className: 'bg-muted text-muted-foreground' },
};

const priorityConfig: Record<TicketPriority, { label: string; className: string }> = {
  baixa: { label: 'Baixa', className: 'bg-muted text-muted-foreground' },
  media: { label: 'Média', className: 'bg-info-light text-info' },
  alta: { label: 'Alta', className: 'bg-warning-light text-warning' },
  urgente: { label: 'Urgente', className: 'bg-destructive-light text-destructive' },
};

const announcementTypeConfig: Record<AnnouncementType, { label: string; className: string }> = {
  urgente: { label: 'Urgente', className: 'bg-destructive-light text-destructive' },
  importante: { label: 'Importante', className: 'bg-warning-light text-warning' },
  informativo: { label: 'Informativo', className: 'bg-info-light text-info' },
};

const reservationStatusConfig: Record<ReservationStatus, { label: string; className: string }> = {
  solicitada: { label: 'Solicitada', className: 'bg-warning-light text-warning' },
  aprovada: { label: 'Aprovada', className: 'bg-success-light text-success' },
  recusada: { label: 'Recusada', className: 'bg-destructive-light text-destructive' },
  cancelada: { label: 'Cancelada', className: 'bg-muted text-muted-foreground' },
};

export function StatusBadge({ status, priority, type, className }: StatusBadgeProps) {
  let config: { label: string; className: string } | undefined;

  if (status) {
    config = ticketStatusConfig[status as TicketStatus] || reservationStatusConfig[status as ReservationStatus];
  } else if (priority) {
    config = priorityConfig[priority];
  } else if (type) {
    config = announcementTypeConfig[type];
  }

  if (!config) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

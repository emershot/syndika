import { Reservation } from '@/types/condominium';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Clock, User, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConflictAlertProps {
  conflictingReservation: Reservation | undefined;
  selectedDate: Date | undefined;
}

/**
 * Exibe informações sobre reserva conflitante
 */
export const ConflictAlert: React.FC<ConflictAlertProps> = ({
  conflictingReservation,
  selectedDate,
}) => {
  if (!conflictingReservation || !selectedDate) {
    return null;
  }

  return (
    <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Período conflita com outra reserva</AlertTitle>
      <AlertDescription className="mt-3 space-y-2">
        <p className="text-sm">
          Essa data/hora já possui uma reserva aprovada:
        </p>
        
        <div className="bg-background/50 rounded-lg p-3 space-y-2 border border-destructive/30 mt-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>
              <strong>{conflictingReservation.requestedByName}</strong> • Apt {conflictingReservation.unitNumber}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>
              {conflictingReservation.startTime} às {conflictingReservation.endTime}
            </span>
          </div>

          {conflictingReservation.purpose && (
            <div className="text-sm text-muted-foreground mt-2">
              <span className="font-medium">Finalidade:</span> {conflictingReservation.purpose}
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          💡 Dica: Escolha outro horário ou data disponível
        </p>
      </AlertDescription>
    </Alert>
  );
};

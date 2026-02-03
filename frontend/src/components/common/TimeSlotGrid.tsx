import React from 'react';
import { ReservationAvailability } from '@/types/condominium';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface TimeSlotGridProps {
  availability: ReservationAvailability | null;
  selectedStartTime: string;
  selectedEndTime: string;
  onSelectSlot: (startTime: string, endTime: string) => void;
  maxDurationMinutes?: number;
}

/**
 * Grid visual de horários (slots de 30min)
 * Mostra em VERDE horários disponíveis, em VERMELHO os ocupados
 */
export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  availability,
  selectedStartTime,
  selectedEndTime,
  onSelectSlot,
  maxDurationMinutes,
}) => {
  if (!availability) {
    return null;
  }

  const slots = availability.availableSlots || [];

  // Agrupar slots em linhas de 4 colunas para melhor visualização
  const rows: (typeof availability.availableSlots[0])[][] = [];
  for (let i = 0; i < slots.length; i += 4) {
    rows.push(slots.slice(i, i + 4));
  }

  const handleQuickSelect = (startTime: string, endTime: string) => {
    onSelectSlot(startTime, endTime);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Horários disponíveis:</span>
        <div className="flex gap-2 ml-auto">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-xs">Livre</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span className="text-xs">Ocupado</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-4 gap-2">
            {row.map((slot) => {
              const isSelected = selectedStartTime === slot.startTime && selectedEndTime === slot.endTime;
              const isAvailable = slot.isAvailable;
              const bgColor = isSelected
                ? 'bg-primary text-primary-foreground'
                : isAvailable
                  ? 'bg-green-100 hover:bg-green-200 dark:bg-green-950 dark:hover:bg-green-900 text-foreground'
                  : 'bg-red-100 dark:bg-red-950 text-muted-foreground cursor-not-allowed opacity-50';

              return (
                <Button
                  key={`${slot.startTime}-${slot.endTime}`}
                  variant="outline"
                  size="sm"
                  disabled={!isAvailable}
                  onClick={() => handleQuickSelect(slot.startTime, slot.endTime)}
                  className={`text-xs h-8 ${bgColor}`}
                >
                  {slot.startTime}
                </Button>
              );
            })}
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        💡 Clique em um horário para selecioná-lo automaticamente
      </p>
    </div>
  );
};

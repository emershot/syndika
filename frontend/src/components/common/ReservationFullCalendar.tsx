import React, { useMemo, useState } from 'react';
import { Reservation } from '@/types/condominium';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  getDaysInMonth,
  startOfMonth,
  getMonth,
  getYear,
  addMonths,
  subMonths,
  format,
  isSameDay,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ReservationFullCalendarProps {
  reservations: Reservation[];
  commonAreas?: { id: string; name: string }[];
}

/**
 * Calendário mensal completo mostrando todas as reservas
 * - Grid 7 colunas (seg-dom)
 * - Cada dia mostra lista de reservas com cores por status
 * - Clicável para detalhar
 */
export const ReservationFullCalendar: React.FC<ReservationFullCalendarProps> = ({
  reservations,
  commonAreas = [],
}) => {
  const [displayDate, setDisplayDate] = useState<Date>(new Date());

  // Agrupar reservas por dia
  const reservationsByDay = useMemo(() => {
    const grouped: { [key: string]: Reservation[] } = {};

    reservations.forEach((reservation) => {
      const dateKey = format(reservation.date, 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(reservation);
    });

    return grouped;
  }, [reservations]);

  const month = getMonth(displayDate);
  const year = getYear(displayDate);
  const daysInMonth = getDaysInMonth(displayDate);
  const firstDayOfMonth = startOfMonth(displayDate);
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Criar array de dias para exibição no grid
  const days: (number | null)[] = [];

  // Preencher espaços vazios antes do primeiro dia (ajustar para começar em DOM=0)
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }

  // Adicionar todos os dias do mês
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    setDisplayDate(subMonths(displayDate, 1));
  };

  const handleNextMonth = () => {
    setDisplayDate(addMonths(displayDate, 1));
  };

  const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'aprovada':
        return 'bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-300';
      case 'solicitada':
        return 'bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-300';
      case 'recusada':
        return 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300';
      case 'cancelada':
        return 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'aprovada':
        return 'Aprv';
      case 'solicitada':
        return 'Pend';
      case 'recusada':
        return 'Rec';
      case 'cancelada':
        return 'Can';
      default:
        return status;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {format(displayDate, 'MMMM yyyy', { locale: ptBR })}
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="space-y-4">
          {/* Legenda */}
          <div className="flex flex-wrap gap-3 text-xs border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-green-100 dark:bg-green-950" />
              <span>Aprovada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-yellow-100 dark:bg-yellow-950" />
              <span>Pendente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-red-100 dark:bg-red-950" />
              <span>Recusada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-gray-100 dark:bg-gray-800" />
              <span>Cancelada</span>
            </div>
          </div>

          {/* Grid dos dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-muted-foreground py-2 border-b"
              >
                {day.substring(0, 3)}
              </div>
            ))}
          </div>

          {/* Grid dos dias */}
          <div className="grid grid-cols-7 gap-1 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border">
            {days.map((day, index) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="aspect-square min-h-[120px] bg-slate-100 dark:bg-slate-900 rounded"
                  />
                );
              }

              const dateStr = format(new Date(year, month, day), 'yyyy-MM-dd');
              const dayReservations = reservationsByDay[dateStr] || [];
              const date = new Date(year, month, day);
              const isToday = isSameDay(date, new Date());

              return (
                <div
                  key={day}
                  className={cn(
                    'aspect-square min-h-[120px] p-2 rounded border transition-colors bg-background',
                    isToday && 'ring-2 ring-primary bg-primary/5'
                  )}
                >
                  {/* Número do dia */}
                  <div
                    className={cn(
                      'text-sm font-semibold mb-1',
                      isToday && 'text-primary'
                    )}
                  >
                    {day}
                  </div>

                  {/* Lista de reservas */}
                  {dayReservations.length > 0 ? (
                    <ScrollArea className="h-[calc(100%-20px)] pr-2">
                      <div className="space-y-1">
                        {dayReservations.map((reservation, idx) => (
                          <div key={idx} className="space-y-0.5">
                            {/* Badge de status + horário */}
                            <div className="flex items-center gap-1">
                              <Badge
                                variant="secondary"
                                className={cn(
                                  'text-xs px-1 py-0',
                                  getStatusColor(reservation.status)
                                )}
                              >
                                {getStatusLabel(reservation.status)}
                              </Badge>
                              <span className="text-xs font-medium text-muted-foreground">
                                {reservation.startTime}
                              </span>
                            </div>
                            {/* Área e solicitante */}
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              <span className="font-medium">{reservation.commonAreaName}</span>
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {reservation.requestedByName}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="h-[calc(100%-20px)] flex items-center justify-center text-xs text-muted-foreground">
                      -
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Estatísticas do mês */}
          <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t">
            <div className="text-center p-2 bg-green-50 dark:bg-green-950 rounded">
              <div className="text-xs text-muted-foreground">Aprovadas</div>
              <div className="text-lg font-bold text-green-700 dark:text-green-300">
                {reservations.filter((r) => r.status === 'aprovada').length}
              </div>
            </div>
            <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-950 rounded">
              <div className="text-xs text-muted-foreground">Pendentes</div>
              <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                {reservations.filter((r) => r.status === 'solicitada').length}
              </div>
            </div>
            <div className="text-center p-2 bg-red-50 dark:bg-red-950 rounded">
              <div className="text-xs text-muted-foreground">Recusadas</div>
              <div className="text-lg font-bold text-red-700 dark:text-red-300">
                {reservations.filter((r) => r.status === 'recusada').length}
              </div>
            </div>
            <div className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
              <div className="text-xs text-muted-foreground">Canceladas</div>
              <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                {reservations.filter((r) => r.status === 'cancelada').length}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

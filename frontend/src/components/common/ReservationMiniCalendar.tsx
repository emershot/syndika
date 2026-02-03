import React, { useMemo, useState } from 'react';
import { Reservation, CommonArea } from '@/types/condominium';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  getDaysInMonth,
  startOfMonth,
  getMonth,
  getYear,
  addMonths,
  subMonths,
  format,
  isSameDay,
  startOfDay,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ReservationMiniCalendarProps {
  reservations: Reservation[];
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
  commonAreas?: CommonArea[];
  selectedCommonArea?: string;
  onSelectCommonArea?: (areaId: string | undefined) => void;
}

/**
 * Mini-calendário interativo com filtros de área e seleção de data
 * - Clique no dia para filtrar reservas daquela data específica
 * - Clique novamente para desselecionar
 * - Filtro de área comum integrado
 * - Tooltip mostra detalhes das reservas ao passar o mouse
 * - Indicadores visuais por status: aprovada, pendente, recusada, cancelada
 */
export const ReservationMiniCalendar: React.FC<ReservationMiniCalendarProps> = ({
  reservations,
  selectedDate,
  onSelectDate,
  commonAreas = [],
  selectedCommonArea,
  onSelectCommonArea,
}) => {
  const [displayDate, setDisplayDate] = useState<Date>(new Date());

  // Agrupar reservas por dia
  const reservationsByDay = useMemo(() => {
    const grouped: { [key: string]: Reservation[] } = {};

    reservations.forEach((reservation) => {
      // Filtrar por área se especificada
      if (selectedCommonArea && reservation.commonAreaId !== selectedCommonArea) {
        return;
      }

      const dateKey = format(startOfDay(reservation.date), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(reservation);
    });

    return grouped;
  }, [reservations, selectedCommonArea]);

  // Calcular contadores por dia e status
  const reservationCounts = useMemo(() => {
    const counts: {
      [key: string]: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        canceled: number;
      };
    } = {};

    Object.entries(reservationsByDay).forEach(([dateKey, reservs]) => {
      const approved = reservs.filter((r) => r.status === 'aprovada').length;
      const pending = reservs.filter((r) => r.status === 'solicitada').length;
      const rejected = reservs.filter((r) => r.status === 'recusada').length;
      const canceled = reservs.filter((r) => r.status === 'cancelada').length;
      
      counts[dateKey] = {
        total: reservs.length,
        pending,
        approved,
        rejected,
        canceled,
      };
    });
    return counts;
  }, [reservationsByDay]);

  // Calcular total de reservas no mês exibido
  const monthTotal = useMemo(() => {
    return Object.values(reservationCounts).reduce((sum, count) => sum + count.total, 0);
  }, [reservationCounts]);

  const month = getMonth(displayDate);
  const year = getYear(displayDate);
  const daysInMonth = getDaysInMonth(displayDate);
  const firstDayOfMonth = startOfMonth(displayDate);
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Criar array de dias para exibição no grid
  const days: (number | null)[] = [];
  
  // Preencher espaços vazios antes do primeiro dia
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

  const handleSelectDay = (day: number) => {
    const newDate = new Date(year, month, day);
    onSelectDate(newDate);
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Determinar cor de fundo baseado em intensidade de reservas
  const getColorClass = (count: number, hasApproved: boolean, hasPending: boolean, hasRejected: boolean): string => {
    if (count === 0) return 'bg-background hover:bg-muted/50';
    
    // Verde se tem aprovadas
    if (hasApproved && !hasPending && !hasRejected) {
      if (count === 1) return 'bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-900/40';
      if (count === 2) return 'bg-green-100 dark:bg-green-900/40 hover:bg-green-200 dark:hover:bg-green-800/50';
      return 'bg-green-200 dark:bg-green-800/50 hover:bg-green-300 dark:hover:bg-green-700/60';
    }
    
    // Amarelo se tem pendentes
    if (hasPending && !hasRejected) {
      return 'bg-yellow-50 dark:bg-yellow-950/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/40';
    }
    
    // Vermelho se tem recusadas
    if (hasRejected) {
      return 'bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40';
    }
    
    // Cinza para outros casos (canceladas)
    return 'bg-muted/50 hover:bg-muted';
  };

  // Renderizar tooltip com detalhes das reservas do dia
  const renderTooltipContent = (dayReservations: Reservation[]) => {
    if (dayReservations.length === 0) return null;

    return (
      <div className="space-y-2 max-w-xs">
        <p className="font-semibold text-sm">{dayReservations.length} reserva(s):</p>
        {dayReservations.slice(0, 3).map((res, idx) => (
          <div key={idx} className="text-xs space-y-1 pb-2 border-b last:border-0">
            <p className="font-medium">{res.commonAreaName}</p>
            <p className="text-muted-foreground">
              {res.startTime} - {res.endTime}
            </p>
            <p className="text-muted-foreground">{res.requestedByName}</p>
            <Badge
              variant={
                res.status === 'aprovada'
                  ? 'default'
                  : res.status === 'solicitada'
                  ? 'secondary'
                  : 'destructive'
              }
              className="text-xs"
            >
              {res.status}
            </Badge>
          </div>
        ))}
        {dayReservations.length > 3 && (
          <p className="text-xs text-muted-foreground italic">
            +{dayReservations.length - 3} mais...
          </p>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-3 space-y-3">
        {/* Header com navegação de mês */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold capitalize">
              {format(displayDate, 'MMMM yyyy', { locale: ptBR })}
            </CardTitle>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevMonth}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Total de reservas do mês */}
        {monthTotal > 0 && (
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Badge variant="secondary" className="font-normal">
              {monthTotal} reserva{monthTotal !== 1 ? 's' : ''} neste mês
            </Badge>
          </div>
        )}

        {/* Filtro de área comum */}
        {commonAreas.length > 0 && onSelectCommonArea && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Filtrar por área:
            </label>
            <Select
              value={selectedCommonArea || 'all'}
              onValueChange={(value) => onSelectCommonArea(value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Todas as áreas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as áreas</SelectItem>
                {commonAreas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>

      <CardContent className="pb-4">
        <TooltipProvider>
          <div className="space-y-3">

            {/* Grid dos dias da semana */}
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs font-bold text-muted-foreground py-2">
                  {day}
                </div>
              ))}

              {/* Grid dos dias com tooltips */}
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const dateStr = format(new Date(year, month, day), 'yyyy-MM-dd');
                const dayData = reservationCounts[dateStr];
                const count = dayData?.total || 0;
                const dayReservations = reservationsByDay[dateStr] || [];

                const date = new Date(year, month, day);
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const isToday = isSameDay(date, new Date());

                const hasApproved = (dayData?.approved || 0) > 0;
                const hasPending = (dayData?.pending || 0) > 0;
                const hasRejected = (dayData?.rejected || 0) > 0;

                const buttonContent = (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectDay(day)}
                    className={cn(
                      'h-16 w-full flex-col items-center justify-center p-1 rounded-md border transition-all relative',
                      getColorClass(count, hasApproved, hasPending, hasRejected),
                      isSelected && 'ring-2 ring-primary ring-offset-2 scale-105',
                      isToday && 'border-primary border-2',
                      count > 0 && 'cursor-pointer hover:scale-105'
                    )}
                  >
                    {/* Número do dia */}
                    <div
                      className={cn(
                        'text-sm font-medium leading-none',
                        isToday && 'text-primary font-bold text-base',
                        isSelected && 'font-bold'
                      )}
                    >
                      {day}
                    </div>

                    {/* Indicadores de status (bolinhas coloridas) */}
                    {count > 0 && (
                      <div className="flex gap-1 mt-1.5">
                        {hasApproved && (
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500" title="Aprovada(s)" />
                        )}
                        {hasPending && (
                          <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" title="Pendente(s)" />
                        )}
                        {hasRejected && (
                          <div className="h-1.5 w-1.5 rounded-full bg-red-500" title="Recusada(s)" />
                        )}
                        {dayData?.canceled > 0 && (
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-400" title="Cancelada(s)" />
                        )}
                      </div>
                    )}

                    {/* Badge com total */}
                    {count > 0 && (
                      <Badge
                        variant="secondary"
                        className="h-4 px-1.5 text-[10px] font-semibold mt-1 absolute -top-1 -right-1"
                      >
                        {count}
                      </Badge>
                    )}
                  </Button>
                );

                // Se tem reservas, adicionar tooltip
                if (count > 0) {
                  return (
                    <Tooltip key={day} delayDuration={200}>
                      <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                      <TooltipContent side="right" className="p-3">
                        {renderTooltipContent(dayReservations)}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return <div key={day}>{buttonContent}</div>;
              })}
            </div>

            {/* Legenda de status */}
            <div className="grid grid-cols-2 gap-2 text-xs border-t pt-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Aprovada</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="text-muted-foreground">Pendente</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-muted-foreground">Recusada</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-gray-400" />
                <span className="text-muted-foreground">Cancelada</span>
              </div>
            </div>

            {/* Dica de uso */}
            {selectedDate && (
              <div className="text-xs text-center text-muted-foreground italic border-t pt-2">
                💡 Clique na data selecionada novamente para desmarcar
              </div>
            )}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

import React, { useState, useMemo } from 'react';
import { CommonArea, Reservation } from '@/types/condominium';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Clock, AlertTriangle, Info, CheckCircle, Home } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface NewReservationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  commonAreas: CommonArea[];
  reservations: Reservation[];
  userId: string;
  userName: string;
  onSubmit: (data: {
    commonAreaId: string;
    date: Date;
    startTime: string;
    endTime: string;
    purpose: string;
  }) => void;
}

/**
 * Modal PROFISSIONAL - Formulário Único de Reserva
 * - Todos os campos em uma única tela
 * - Validação em tempo real
 * - Feedback visual imediato
 * - Interface limpa e objetiva
 */
export const NewReservationModal: React.FC<NewReservationModalProps> = ({
  isOpen,
  onOpenChange,
  commonAreas,
  reservations,
  userId,
  userName,
  onSubmit,
}) => {
  const [commonAreaId, setCommonAreaId] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [purpose, setPurpose] = useState('');

  const selectedArea = commonAreas.find((a) => a.id === commonAreaId);

  // Verificar disponibilidade da data
  const isDateAvailable = useMemo(() => {
    if (!commonAreaId || !selectedDate) return true;

    const hasConflict = reservations.some(
      (res) =>
        res.commonAreaId === commonAreaId &&
        res.status === 'aprovada' &&
        isSameDay(res.date, selectedDate)
    );

    return !hasConflict;
  }, [commonAreaId, selectedDate, reservations]);

  // Calcular dias até a reserva
  const daysUntilReservation = useMemo(() => {
    if (!selectedDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reservationDate = new Date(selectedDate);
    reservationDate.setHours(0, 0, 0, 0);
    const diffTime = reservationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [selectedDate]);

  const canSubmit = !!commonAreaId && !!selectedDate && isDateAvailable;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !selectedDate || !selectedArea) return;

    onSubmit({
      commonAreaId,
      date: selectedDate,
      startTime: selectedArea.openTime,
      endTime: selectedArea.closeTime,
      purpose: purpose.trim(),
    });

    // Reset
    setCommonAreaId('');
    setSelectedDate(undefined);
    setPurpose('');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setCommonAreaId('');
    setSelectedDate(undefined);
    setPurpose('');
    onOpenChange(false);
  };

  // Formatação do dia da semana
  const dayOfWeekLabel = selectedDate
    ? new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(selectedDate).charAt(0).toUpperCase() +
      new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(selectedDate).slice(1)
    : '';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleCancel();
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Solicitar Reserva</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para solicitar sua reserva
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Área */}
          <div className="space-y-2">
            <Label htmlFor="area">Área <span className="text-destructive">*</span></Label>
            <Select value={commonAreaId} onValueChange={setCommonAreaId}>
              <SelectTrigger id="area">
                <SelectValue placeholder="Escolha a área..." />
              </SelectTrigger>
              <SelectContent>
                {commonAreas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data */}
          <div className="space-y-2">
            <Label htmlFor="date">Data <span className="text-destructive">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left',
                    !selectedDate && 'text-muted-foreground'
                  )}
                  disabled={!selectedArea}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : 'Escolha a data...'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    if (!selectedArea) return true;
                    if (date <= new Date()) return true;
                    if (selectedArea.blockedDates?.includes(format(date, 'yyyy-MM-dd'))) return true;
                    if (selectedArea.minAdvanceDays) {
                      const daysFromNow = Math.floor((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      return daysFromNow < selectedArea.minAdvanceDays;
                    }
                    return false;
                  }}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
            {!isDateAvailable && selectedDate && (
              <p className="text-xs text-destructive">Data já reservada</p>
            )}
          </div>

          {/* Finalidade */}
          <div className="space-y-2">
            <Label htmlFor="purpose">Finalidade</Label>
            <Textarea
              id="purpose"
              placeholder="Descreva o motivo da reserva..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={2}
            />
          </div>

          {/* Botões */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              Solicitar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

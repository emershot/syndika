import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DateRangePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (startDate: Date, endDate: Date) => void;
  startDate?: Date;
  endDate?: Date;
}

export function DateRangePickerModal({
  open,
  onOpenChange,
  onConfirm,
  startDate,
  endDate,
}: DateRangePickerModalProps) {
  const [start, setStart] = useState<Date | undefined>(startDate);
  const [end, setEnd] = useState<Date | undefined>(endDate);

  const handleConfirm = () => {
    if (start && end) {
      // Ensure start is before end
      const [minDate, maxDate] = start <= end ? [start, end] : [end, start];
      onConfirm(minDate, maxDate);
      onOpenChange(false);
    }
  };

  const handleReset = () => {
    setStart(undefined);
    setEnd(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Selecionar Intervalo de Datas</DialogTitle>
          <DialogDescription>
            Escolha a data de início e fim para filtrar os dados do dashboard
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          {/* Data de Início */}
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-700">Data de Início</h3>
              <p className="text-xs text-muted-foreground">
                {start
                  ? format(start, 'd \\d\\e MMMM \\d\\e yyyy', { locale: ptBR })
                  : 'Nenhuma data selecionada'}
              </p>
            </div>
            <Calendar
              mode="single"
              selected={start}
              onSelect={setStart}
              disabled={(date) => end ? date > end : false}
              className="rounded-md border"
            />
          </div>

          {/* Data de Fim */}
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-700">Data de Fim</h3>
              <p className="text-xs text-muted-foreground">
                {end
                  ? format(end, 'd \\d\\e MMMM \\d\\e yyyy', { locale: ptBR })
                  : 'Nenhuma data selecionada'}
              </p>
            </div>
            <Calendar
              mode="single"
              selected={end}
              onSelect={setEnd}
              disabled={(date) => start ? date < start : false}
              className="rounded-md border"
            />
          </div>
        </div>

        {/* Resumo do Intervalo */}
        {start && end && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <strong>Intervalo selecionado:</strong>{' '}
              {format(start, 'd MMM yyyy', { locale: ptBR })} até{' '}
              {format(end, 'd MMM yyyy', { locale: ptBR })} (
              {Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))} dias)
            </p>
          </div>
        )}

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleReset} disabled={!start && !end}>
            Limpar
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!start || !end}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

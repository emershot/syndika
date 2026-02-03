import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, RotateCw, Download, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DateRangePickerModal } from './DateRangePickerModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardFiltersProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onDateRangeCustom?: (startDate: Date, endDate: Date) => void;
  onRefresh?: () => void;
  onExport?: (format: 'csv' | 'pdf') => void;
  isLoading?: boolean;
  className?: string;
}

export function DashboardFilters({
  dateRange,
  onDateRangeChange,
  onDateRangeCustom,
  onRefresh,
  onExport,
  isLoading = false,
  className,
}: DashboardFiltersProps) {
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  const handleDateRangeChange = (value: string) => {
    if (value === 'customizado') {
      setShowCustomDatePicker(true);
    } else {
      onDateRangeChange(value);
    }
  };

  const handleCustomDateConfirm = (startDate: Date, endDate: Date) => {
    onDateRangeCustom?.(startDate, endDate);
    onDateRangeChange('customizado');
  };

  const getDateRangeLabel = (value: string) => {
    const labels: Record<string, string> = {
      '1': 'Hoje',
      '7': 'Últimos 7 dias',
      '30': 'Últimos 30 dias',
      '90': 'Últimos 90 dias',
      '365': 'Último ano',
      'customizado': 'Personalizado',
    };
    return labels[value] || labels['30'];
  };

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row gap-3 items-start sm:items-center',
        className
      )}
    >
      <div className="flex items-center gap-2 flex-1 sm:flex-initial">
        <CalendarDays className="h-4 w-4 text-primary" />
        <Select value={dateRange} onValueChange={handleDateRangeChange}>
          <SelectTrigger className="w-full sm:w-[180px] border-border/60 hover:border-primary/50 transition-colors">
            <SelectValue placeholder={getDateRangeLabel(dateRange)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1" className="cursor-pointer">
              Hoje
            </SelectItem>
            <SelectItem value="7" className="cursor-pointer">
              Últimos 7 dias
            </SelectItem>
            <SelectItem value="30" className="cursor-pointer">
              Últimos 30 dias
            </SelectItem>
            <SelectItem value="90" className="cursor-pointer">
              Últimos 90 dias
            </SelectItem>
            <SelectItem value="365" className="cursor-pointer">
              Último ano
            </SelectItem>
            <SelectItem value="customizado" className="cursor-pointer border-t mt-1 pt-2">
              <span className="font-medium">Personalizado</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DateRangePickerModal
        open={showCustomDatePicker}
        onOpenChange={setShowCustomDatePicker}
        onConfirm={handleCustomDateConfirm}
      />

      <div className="flex gap-2 w-full sm:w-auto ml-auto">
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all"
          >
            <RotateCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
            <span className="hidden sm:inline">Atualizar</span>
          </Button>
        )}
        {onExport && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={() => onExport('csv')} 
                className="cursor-pointer gap-2"
              >
                <span className="text-base">📊</span>
                <span>Exportar CSV</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onExport('pdf')} 
                className="cursor-pointer gap-2"
              >
                <span className="text-base">📄</span>
                <span>Exportar PDF</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

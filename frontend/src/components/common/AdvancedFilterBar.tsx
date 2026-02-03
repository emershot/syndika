import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface AdvancedFilterBarProps {
  searchPlaceholder?: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortValue?: string;
  onSortChange?: (value: string) => void;
  expandedContent?: React.ReactNode;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function AdvancedFilterBar({
  searchPlaceholder = 'Buscar...',
  searchTerm,
  onSearchChange,
  sortValue,
  onSortChange,
  expandedContent,
  onClearFilters,
  hasActiveFilters,
}: AdvancedFilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Toggle & Options */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <span className="ml-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
              !
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-1"
          >
            <X className="h-4 w-4" />
            Limpar filtros
          </Button>
        )}

        {sortValue && onSortChange && (
          <Select value={sortValue} onValueChange={onSortChange}>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Ordenar por..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Mais recentes</SelectItem>
              <SelectItem value="oldest">Mais antigos</SelectItem>
              <SelectItem value="name">Nome (A-Z)</SelectItem>
              <SelectItem value="priority">Por prioridade</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Expandable Filter Section */}
      {showFilters && expandedContent && (
        <Card className="p-4 bg-muted/50">
          <div className="space-y-3">{expandedContent}</div>
        </Card>
      )}
    </div>
  );
}

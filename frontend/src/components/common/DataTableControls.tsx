import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Filter, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SortOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface DataTableControlsProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  
  sortOptions?: SortOption[];
  sortValue?: string;
  onSortChange?: (value: string) => void;
  
  filterContent?: React.ReactNode;
  activeFilterCount?: number;
  
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}

export function DataTableControls({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  sortOptions = [],
  sortValue = '',
  onSortChange,
  filterContent,
  activeFilterCount = 0,
  onClearFilters,
  hasActiveFilters = false,
}: DataTableControlsProps) {
  const [showFilters, setShowFilters] = useState(false);
  const currentSort = sortOptions.find(o => o.value === sortValue);

  return (
    <div className="space-y-3">
      {/* Primary Controls Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search Input - Always visible, takes priority */}
        <div className="relative flex-1">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-3"
          />
        </div>

        {/* Sort Buttons - Always visible, horizontal */}
        {sortOptions.length > 0 && onSortChange && (
          <div className="flex gap-1 flex-wrap sm:flex-nowrap">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant={sortValue === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSortChange(option.value)}
                className="gap-1 flex-1 sm:flex-none"
              >
                {option.icon && <span className="text-xs">{option.icon}</span>}
                <span className="text-xs sm:text-sm">{option.label}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Filters Toggle Button */}
        {filterContent && (
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'gap-2 relative',
              hasActiveFilters && 'ring-2 ring-primary/50'
            )}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filtros</span>
            
            {hasActiveFilters && activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-destructive text-background text-xs font-bold">
                {activeFilterCount > 9 ? '9+' : activeFilterCount}
              </span>
            )}
          </Button>
        )}

        {/* Clear Filters Quick Action */}
        {hasActiveFilters && onClearFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-1"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Limpar</span>
          </Button>
        )}
      </div>

      {/* Expandable Filter Panel */}
      {showFilters && filterContent && (
        <Card className="p-4 bg-muted/50 border border-border/50 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-4">
            {filterContent}
          </div>
        </Card>
      )}

      {/* Active Filters Summary (Optional) */}
      {hasActiveFilters && activeFilterCount > 0 && (
        <div className="text-xs text-muted-foreground px-1">
          {activeFilterCount} filtro{activeFilterCount !== 1 ? 's' : ''} ativo{activeFilterCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface MultiSelectFilterProps {
  options: Array<{ label: string; value: string }>;
  selected: string[];
  onChange: (values: string[]) => void;
}

export function MultiSelectFilter({
  options,
  selected,
  onChange,
}: MultiSelectFilterProps) {
  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const clearAll = () => onChange([]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => toggleValue(option.value)}
            className={cn(
              'px-3 py-1 rounded-full text-sm font-medium transition-colors border',
              selected.includes(option.value)
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:border-primary/50'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-2 border-t">
          {selected.map((value) => {
            const option = options.find((o) => o.value === value);
            return (
              <Badge key={value} variant="secondary" className="gap-1">
                {option?.label}
                <button
                  onClick={() => toggleValue(value)}
                  className="ml-1 hover:bg-background/20 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}

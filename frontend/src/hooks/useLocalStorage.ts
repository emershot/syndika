import { useState, useEffect, useCallback } from 'react';
import { Reservation } from '@/types/condominium';

/**
 * Hook para gerenciar estado com persistência em localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return initialValue;
      
      const parsed = JSON.parse(item);
      
      // Se for array de reservas, converter datas de string para Date
      if (Array.isArray(parsed) && parsed.length > 0 && 'commonAreaId' in parsed[0]) {
        return parsed.map((r: any) => ({
          ...r,
          date: typeof r.date === 'string' ? new Date(r.date) : r.date,
          createdAt: typeof r.createdAt === 'string' ? new Date(r.createdAt) : r.createdAt,
          updatedAt: typeof r.updatedAt === 'string' ? new Date(r.updatedAt) : r.updatedAt,
          approvalDate: r.approvalDate ? (typeof r.approvalDate === 'string' ? new Date(r.approvalDate) : r.approvalDate) : undefined,
          rejectionDate: r.rejectionDate ? (typeof r.rejectionDate === 'string' ? new Date(r.rejectionDate) : r.rejectionDate) : undefined,
        })) as T;
      }
      
      return parsed;
    } catch (error) {
      console.error(`Error reading from localStorage with key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error writing to localStorage with key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
}

/**
 * Hook para gerenciar paginação
 */
export function usePagination<T>(items: T[], pageSize: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
  };
}

/**
 * Hook para debounce de valores
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook para gerenciar filtros
 */
interface FilterState {
  [key: string]: string;
}

export function useFilters(initialFilters: FilterState = {}) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return {
    filters,
    updateFilter,
    resetFilters,
  };
}

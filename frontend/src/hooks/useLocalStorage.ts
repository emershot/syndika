import { useState, useEffect, useCallback, useRef } from 'react';
import { Reservation } from '@/types/condominium';

/**
 * Reviver function para JSON.parse que converte strings de data para Date
 */
const dateReviver = (_key: string, value: any): any => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    return new Date(value);
  }
  return value;
};

/**
 * Hook para gerenciar estado com persistência em localStorage
 * 
 * @param key - Chave no localStorage
 * @param initialValue - Valor inicial se não houver no localStorage
 * @returns [storedValue, setValue] - Tupla com valor e setter
 * 
 * @example
 * ```tsx
 * const [todos, setTodos] = useLocalStorage('todos', []);
 * setTodos([...todos, newTodo]); // Persiste automaticamente
 * ```
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Usar useRef para rastrear se é primeira render (evita bugs de hydration)
  const isFirstRender = useRef(true);

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return initialValue;

      // Usar reviver para converter datas automaticamente
      return JSON.parse(item, dateReviver) as T;
    } catch (error) {
      console.error(`[useLocalStorage] Error reading key "${key}":`, error);
      return initialValue;
    }
  });

  // setValue com memoização corrigida
  // Não incluir storedValue na dependency para evitar ciclos infinitos
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Permitir function para manter padrão do useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        // Serializar com replacer para garantir ISO dates
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`[useLocalStorage] Error writing key "${key}":`, error);
      }
    },
    [key, storedValue] // NOTA: storedValue é necessário aqui para updater functions
  );

  // Sincronizar com alterações de outra aba/window
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue, dateReviver));
        } catch (error) {
          console.error(`[useLocalStorage] Error syncing from storage event:`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue] as const;
}

/**
 * Hook para gerenciar paginação
 * 
 * @example
 * ```tsx
 * const { currentItems, currentPage, totalPages, goToPage } = usePagination(items, 10);
 * ```
 */
export function usePagination<T>(items: T[], pageSize: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);

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
 * Hook para debounce de valores com cleanup
 * 
 * @param value - Valor a debounce
 * @param delay - Delay em ms (default: 500)
 * @returns Valor debounced
 * 
 * @example
 * ```tsx
 * const debouncedSearch = useDebounce(searchTerm, 300);
 * useEffect(() => {
 *   api.search(debouncedSearch);
 * }, [debouncedSearch]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Delay antes de atualizar
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancela se valor mudar antes do delay
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook para gerenciar filtros
 * 
 * @example
 * ```tsx
 * const { filters, updateFilter, resetFilters } = useFilters({ status: 'open' });
 * ```
 */
interface FilterState {
  [key: string]: string | string[];
}

export function useFilters(initialFilters: FilterState = {}) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const updateFilter = useCallback((key: string, value: string | string[]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const clearFilter = useCallback((key: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
    clearFilter,
  };
}

import React, { createContext, useContext, useState, useEffect } from 'react';

interface TimezoneContextType {
  timezone: string;
  setTimezone: (tz: string) => void;
  offset: number;
}

const TimezoneContext = createContext<TimezoneContextType | undefined>(undefined);

export const TimezoneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timezone, setTimezone] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    // Detectar timezone do navegador
    const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(detectedTz || 'America/Sao_Paulo');

    // Calcular offset em minutos
    const now = new Date();
    const jan = new Date(now.getFullYear(), 0, 1);
    const july = new Date(now.getFullYear(), 6, 1);
    const stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), july.getTimezoneOffset());
    const isDST = now.getTimezoneOffset() < stdTimezoneOffset;
    
    setOffset(isDST ? -(stdTimezoneOffset - 60) : -stdTimezoneOffset);
  }, []);

  const value: TimezoneContextType = {
    timezone,
    setTimezone,
    offset,
  };

  return (
    <TimezoneContext.Provider value={value}>
      {children}
    </TimezoneContext.Provider>
  );
};

export const useTimezone = () => {
  const context = useContext(TimezoneContext);
  if (!context) {
    throw new Error('useTimezone deve ser usado dentro de TimezoneProvider');
  }
  return context;
};

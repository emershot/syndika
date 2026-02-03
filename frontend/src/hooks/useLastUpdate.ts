import { useState, useCallback } from 'react';

const LAST_UPDATE_KEY = 'syndika_dashboard_last_update';

export function useLastUpdate() {
  const [lastUpdate, setLastUpdate] = useState<Date>(() => {
    const stored = localStorage.getItem(LAST_UPDATE_KEY);
    return stored ? new Date(stored) : new Date();
  });

  const updateTimestamp = useCallback(() => {
    const now = new Date();
    setLastUpdate(now);
    localStorage.setItem(LAST_UPDATE_KEY, now.toISOString());
  }, []);

  const getLastUpdate = useCallback(() => {
    const stored = localStorage.getItem(LAST_UPDATE_KEY);
    return stored ? new Date(stored) : lastUpdate;
  }, [lastUpdate]);

  return {
    lastUpdate: getLastUpdate(),
    updateTimestamp,
  };
}

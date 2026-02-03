import { useEffect, useRef } from 'react';
import { useToast } from './use-toast';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const { toast } = useToast();
  const shortcutsRef = useRef(shortcuts);

  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore shortcuts if user is typing in an input/textarea
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      shortcutsRef.current.forEach((shortcut) => {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = (shortcut.ctrl || false) === (event.ctrlKey || event.metaKey);
        const shiftMatch = (shortcut.shift || false) === event.shiftKey;
        const altMatch = (shortcut.alt || false) === event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.callback();
        }
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return {
    showHelp: () => {
      const shortcutsList = shortcutsRef.current
        .filter((s) => s.description)
        .map((s) => {
          let keys = s.key.toUpperCase();
          if (s.ctrl) keys = 'Ctrl + ' + keys;
          if (s.shift) keys = 'Shift + ' + keys;
          if (s.alt) keys = 'Alt + ' + keys;
          return `${keys}: ${s.description}`;
        })
        .join('\n');

      toast({
        title: 'Atalhos de Teclado',
        description: shortcutsList || 'Nenhum atalho disponível',
      });
    },
  };
}

import { useCallback, useState } from 'react';

export type Theme = 'light' | 'dark';
const KEY = 'glynet_theme';

/** Safari's view-transition snapshots drop backdrop blur (the glass bars), so there the colours fade instead. */
const isWebKit = /AppleWebKit/.test(navigator.userAgent) && !/Chrome\/|Chromium|Edg\//.test(navigator.userAgent);

/** Light ↔ dark as one soft dissolve of the page (as in the GlyNet panel). */
const smoothSwitch = (apply: () => void) => {
  const root = document.documentElement;
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return apply();
  if (typeof doc.startViewTransition !== 'function' || isWebKit) {
    root.classList.add('theme-transition');
    apply();
    window.setTimeout(() => root.classList.remove('theme-transition'), 800);
    return;
  }
  root.classList.add('vt-theme');
  doc.startViewTransition(apply).finished.finally(() => root.classList.remove('vt-theme'));
};

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.getAttribute('data-mode') === 'dark' ? 'dark' : 'light'));
  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    smoothSwitch(() => {
      document.documentElement.setAttribute('data-mode', next);
      setTheme(next);
    });
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // ignore
    }
  }, [theme]);
  return [theme, toggle];
}

import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import { useTheme } from '../lib/theme';

/** Glass top bar as in the GlyNet panel: logo and name, and a glass capsule with the theme switch. */
export function Header() {
  const [theme, toggle] = useTheme();
  const Icon = theme === 'dark' ? MoonIcon : SunIcon;
  return (
    <header className="glass-header sticky top-0 z-20">
      <div className="mx-auto flex h-14 max-w-xl items-center justify-between gap-3 px-4">
        <a href="https://t.me/GlyNetBot" target="_blank" rel="noreferrer" className="flex items-center gap-3">
          <img src="/images/logo.svg" alt="گلاینت" width={40} height={40} className="shrink-0 rounded-full" />
          <span className="text-lg font-semibold text-kumo-default">گلاینت</span>
        </a>
        <div className="island-pill flex items-center rounded-full p-1">
          <button
            type="button"
            onClick={toggle}
            aria-label="حالت نمایش"
            title="حالت نمایش"
            className="flex size-8 items-center justify-center rounded-full text-kumo-strong transition-transform duration-150 hover:bg-kumo-tint active:scale-90"
          >
            <span key={theme} className="icon-swap-in flex">
              <Icon size={20} />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

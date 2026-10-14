import { useState } from 'react';
import { Button } from '@cloudflare/kumo';
import { CheckIcon, CompassIcon, CopyIcon } from '@phosphor-icons/react';

/**
 * Helpful tip at the bottom of the page recommending Safari for a smoother installation on iOS,
 * with a quick copy link button.
 */
export function SafariTip() {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-kumo-base p-4 text-xs sm:text-sm ring ring-kumo-hairline">
      <div className="flex items-start sm:items-center gap-3">
        <CompassIcon size={22} weight="duotone" className="mt-0.5 sm:mt-0 shrink-0 text-kumo-link" />
        <p className="leading-6 text-kumo-subtle">
          برای دانلود و نصب آسان‌تر پروفایل روی آیفون، پیشنهاد می‌شود این صفحه را در مرورگر <strong className="font-semibold text-kumo-default">Safari</strong> باز کنید.
        </p>
      </div>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        icon={copied ? CheckIcon : CopyIcon}
        className="shrink-0 self-end sm:self-auto"
        onClick={() => void copyLink()}
      >
        {copied ? 'کپی شد' : 'کپی لینک'}
      </Button>
    </div>
  );
}

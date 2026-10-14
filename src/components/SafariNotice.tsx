import { useEffect, useState } from 'react';
import { Button, Dialog } from '@cloudflare/kumo';
import { CompassIcon, CopyIcon, DeviceMobileIcon, WarningIcon, XIcon } from '@phosphor-icons/react';
import type { BrowserInfo } from '../lib/browser';

const SEEN_KEY = 'apn_safari_notice_seen';
const NON_IOS_KEY = 'apn_non_ios_notice_seen';

const seen = () => {
  try {
    return localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
};

const nonIosSeen = () => {
  try {
    return localStorage.getItem(NON_IOS_KEY) === '1';
  } catch {
    return false;
  }
};

/**
 * "Profiles only download in Safari": a dialog on the first visit (and on every visit from another iOS browser),
 * plus a lasting banner when the page is open somewhere it can't install a profile.
 */
export function SafariNotice({ browser }: { browser: BrowserInfo }) {
  const wrongBrowser = browser.ios && !browser.safari;
  const [open, setOpen] = useState(() => wrongBrowser || !seen());
  const [showNonIos, setShowNonIos] = useState(() => !browser.ios && !nonIosSeen());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!browser.ios) {
      try {
        localStorage.setItem(NON_IOS_KEY, '1');
      } catch {
        // ignore
      }
    }
  }, [browser.ios]);

  const dismissNonIos = () => {
    setShowNonIos(false);
    try {
      localStorage.setItem(NON_IOS_KEY, '1');
    } catch {
      // ignore
    }
  };

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(SEEN_KEY, '1');
    } catch {
      // ignore
    }
  };
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      // ignore
    }
  };

  return (
    <>
      {wrongBrowser && (
        <div className="mb-4 flex items-start gap-3 rounded-2xl bg-kumo-warning-tint p-4 text-sm ring ring-kumo-warning/30">
          <WarningIcon size={20} weight="fill" className="mt-0.5 shrink-0 text-kumo-warning" />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-kumo-default">این صفحه را در Safari باز کنید</div>
            <p className="mt-1 leading-6 text-kumo-subtle">این مرورگر نمی‌تواند پروفایل را نصب کند. لینک را کپی کنید و در Safari باز کنید.</p>
            <Button size="sm" variant="secondary" icon={CopyIcon} className="mt-3" onClick={() => void copyLink()}>
              {copied ? 'کپی شد' : 'کپی لینک صفحه'}
            </Button>
          </div>
        </div>
      )}
      {showNonIos && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-kumo-base p-4 text-sm ring ring-kumo-hairline">
          <div className="flex items-start gap-3">
            <DeviceMobileIcon size={20} className="mt-0.5 shrink-0 text-kumo-link" />
            <p className="leading-6 text-kumo-subtle">این پروفایل مخصوص آیفون و آیپد است. این صفحه را روی آیفون و با Safari باز کنید.</p>
          </div>
          <button
            type="button"
            onClick={dismissNonIos}
            aria-label="بستن پیام"
            className="shrink-0 rounded-lg p-1 text-kumo-subtle transition-colors hover:bg-kumo-tint hover:text-kumo-default"
          >
            <XIcon size={18} />
          </button>
        </div>
      )}

      <Dialog.Root open={open} onOpenChange={(next) => !next && close()}>
        <Dialog size="sm" className="w-[calc(100vw-2rem)] p-6 text-center">
          <span className="icon-bubble mx-auto flex size-14 items-center justify-center rounded-full bg-kumo-tint text-kumo-link">
            <CompassIcon size={28} />
          </span>
          <Dialog.Title className="mt-4 text-lg font-bold">فقط با مرورگر Safari</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm leading-7 text-kumo-subtle">
            پروفایل APN فقط با <b className="text-kumo-default">Safari</b> آیفون دانلود و نصب می‌شود. اگر این صفحه را در Chrome، تلگرام یا مرورگر دیگری باز کرده‌اید، لینک را در
            Safari باز کنید.
          </Dialog.Description>
          {wrongBrowser && (
            <Button variant="secondary" icon={CopyIcon} className="mt-4 w-full justify-center" onClick={() => void copyLink()}>
              {copied ? 'کپی شد' : 'کپی لینک صفحه'}
            </Button>
          )}
          <Button variant="primary" className="mt-3 h-11 w-full justify-center rounded-xl text-base font-bold" onClick={close}>
            متوجه شدم
          </Button>
        </Dialog>
      </Dialog.Root>
    </>
  );
}

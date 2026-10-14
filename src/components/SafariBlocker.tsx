import { useState } from 'react';
import { Button } from '@cloudflare/kumo';
import { ArrowSquareOutIcon, CheckIcon, CompassIcon, CopyIcon, WarningCircleIcon } from '@phosphor-icons/react';
import type { BrowserInfo } from '../lib/browser';

/**
 * Full blocker displayed when the site is opened in any browser other than Safari.
 * iOS configuration profiles (.mobileconfig) cannot be installed via other browsers or in-app WebViews.
 */
export function SafariBlocker({ browser, onBypass }: { browser: BrowserInfo; onBypass?: () => void }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // fallback
    }
  };

  const safariUrl = window.location.href.replace(/^https?:\/\//, 'x-safari-https://');

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="rounded-3xl bg-kumo-base p-6 sm:p-8 text-center ring ring-kumo-hairline shadow-sm">
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-kumo-brand/12 text-kumo-brand">
          <CompassIcon size={36} weight="fill" />
        </span>

        <h2 className="mt-5 text-xl font-extrabold tracking-tight text-kumo-default">فقط با مرورگر Safari</h2>

        <p className="mt-3 text-sm leading-7 text-kumo-subtle">
          پروفایل‌های شبکه و <bdi>APN</bdi> آیفون فقط از طریق مرورگر <b className="text-kumo-default font-semibold">Safari</b> قابل دانلود و نصب مستقیم بر روی گوشی هستند. استفاده از این ابزار با سایر مرورگرها امکان‌پذیر نیست.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <Button
            variant="primary"
            icon={copied ? CheckIcon : CopyIcon}
            className="h-12 w-full justify-center rounded-xl text-base font-bold"
            onClick={() => void copyLink()}
          >
            {copied ? 'لینک با موفقیت کپی شد' : 'کپی لینک صفحه'}
          </Button>

          {browser.ios && (
            <a
              href={safariUrl}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-kumo-tint text-sm font-bold text-kumo-link hover:bg-kumo-hairline transition-colors"
            >
              <span>باز کردن در Safari</span>
              <ArrowSquareOutIcon size={18} />
            </a>
          )}
        </div>

        <div className="mt-6 rounded-2xl bg-kumo-tint/60 p-4 text-start text-xs leading-6 text-kumo-subtle ring ring-kumo-hairline">
          <div className="flex items-center gap-1.5 font-bold text-kumo-default mb-1.5">
            <WarningCircleIcon size={16} className="text-kumo-link" weight="fill" />
            <span>نحوهٔ استفاده در آیفون:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1">
            <li>دکمهٔ «کپی لینک صفحه» را لمس کنید.</li>
            <li>برنامهٔ <b className="text-kumo-default">Safari</b> را در آیفون خود باز کنید.</li>
            <li>لینک را در نوار جستجو Paste کرده و پروفایل را نصب کنید.</li>
          </ol>
        </div>

        {import.meta.env.DEV && onBypass && (
          <div className="mt-6 pt-4 border-t border-kumo-hairline">
            <button
              type="button"
              onClick={onBypass}
              className="text-xs text-kumo-subtle hover:text-kumo-default underline underline-offset-4"
            >
              ادامه در حالت توسعه (Development Bypass)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

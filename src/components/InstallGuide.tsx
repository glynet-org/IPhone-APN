import { cn } from '@cloudflare/kumo';

const STEPS = [
  'در پیام Safari روی «Allow» بزنید تا پروفایل دانلود شود.',
  'به «Settings» بروید؛ بالای صفحه «Profile Downloaded» را بزنید.',
  'روی «Install» بزنید، رمز گوشی را وارد کنید و دوباره «Install» را تأیید کنید.',
  'یک بار حالت هواپیما را روشن و خاموش کنید تا اینترنت با تنظیمات جدید وصل شود.',
];

/** How to install the profile after downloading it, and how to remove it. */
export function InstallGuide({ highlight }: { highlight: boolean }) {
  return (
    <section className={cn('rounded-2xl bg-kumo-base p-5 ring transition-shadow duration-500', highlight ? 'ring-2 ring-kumo-brand' : 'ring-kumo-hairline')}>
      <h2 className="text-base font-bold text-kumo-default">نصب پروفایل روی آیفون</h2>
      <ol className="mt-4 space-y-3">
        {STEPS.map((step, index) => (
          <li key={step} className="flex items-start gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-kumo-tint text-sm font-bold text-kumo-link">
              {(index + 1).toLocaleString('fa-IR')}
            </span>
            <span className="pt-0.5 text-sm leading-6 text-kumo-strong">{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 border-t border-kumo-hairline pt-4 text-xs leading-6 text-kumo-subtle">
        حذف پروفایل: Settings ← General ← VPN &amp; Device Management ← نام پروفایل ← Remove Profile.
      </p>
    </section>
  );
}

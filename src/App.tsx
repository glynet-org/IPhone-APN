import { useMemo, useRef, useState } from 'react';
import { Button, cn } from '@cloudflare/kumo';
import { DirectionProvider } from '@cloudflare/kumo/primitives/direction-provider';
import { DownloadSimpleIcon, GlobeHemisphereEastIcon, LockSimpleIcon, PencilSimpleLineIcon, SimCardIcon } from '@phosphor-icons/react';
import { Header } from './components/Header';
import { InstallGuide } from './components/InstallGuide';
import { EMPTY_MANUAL, ManualForm, validateManual, type ManualValues } from './components/ManualForm';
import { OperatorPicker } from './components/OperatorPicker';
import { PageHero } from './components/PageHero';
import { SafariNotice } from './components/SafariNotice';
import { OPERATORS, type Operator } from './data/operators';
import { detectBrowser } from './lib/browser';
import { downloadProfile } from './lib/download';
import { buildProfile, safeSlug } from './lib/mobileconfig';

type Mode = 'operator' | 'manual';

/**
 * The whole site: pick your operator (or enter your own APN), download an iPhone profile with IPv4 and IPv6 on,
 * then follow the install steps.
 */
export function App() {
  const browser = useMemo(() => detectBrowser(), []);
  const [mode, setMode] = useState<Mode>('operator');
  const [operator, setOperator] = useState<Operator | null>(OPERATORS[0]);
  const [manual, setManual] = useState<ManualValues>(EMPTY_MANUAL);
  const [showErrors, setShowErrors] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const guideRef = useRef<HTMLDivElement>(null);

  const ready = mode === 'operator' ? operator !== null : Object.keys(validateManual(manual)).length === 0;

  const download = () => {
    if (browser.ios && !browser.safari && !window.confirm('این مرورگر نمی‌تواند پروفایل را نصب کند. صفحه را در Safari باز کنید. باز هم دانلود شود؟')) return;
    if (mode === 'operator') {
      if (!operator) return;
      // A real file with the profile MIME type: Safari offers to install it.
      window.location.href = `/profiles/${operator.slug}.mobileconfig`;
    } else {
      if (!ready) {
        setShowErrors(true);
        return;
      }
      const apn = manual.apn.trim();
      downloadProfile(
        buildProfile({
          apn,
          username: manual.username.trim(),
          password: manual.password,
          authType: manual.authType,
          displayName: manual.displayName.trim() || `APN ${apn} (IPv4/IPv6) – گلاینت`,
          slug: `custom-${apn}`,
        }),
        `${safeSlug(apn)}.mobileconfig`,
      );
    }
    setDownloaded(true);
    window.setTimeout(() => guideRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
  };

  return (
    <DirectionProvider direction="rtl">
      <div className="min-h-dvh bg-kumo-canvas">
        <Header />
        <main className="mx-auto max-w-xl space-y-5 px-4 pt-4 pb-16">
          <SafariNotice browser={browser} />

          <PageHero title="پروفایل APN آیفون" description="اپراتورت را انتخاب کن یا تنظیمات را خودت وارد کن و پروفایل آماده را نصب کن.">
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-kumo-tint/80 px-3 py-1.5 text-xs font-semibold text-kumo-default ring ring-kumo-hairline backdrop-blur-sm">
                <LockSimpleIcon size={14} weight="fill" className="text-kumo-link" />
                <bdi>IPv4 + IPv6</bdi> فعال
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-kumo-tint/80 px-3 py-1.5 text-xs font-semibold text-kumo-default ring ring-kumo-hairline backdrop-blur-sm">
                <GlobeHemisphereEastIcon size={14} className="text-kumo-link" />
                مخصوص iOS و iPadOS
              </span>
            </div>
          </PageHero>

          {/* How to make the profile: two big choices */}
          <div className="grid grid-cols-2 gap-2.5" role="tablist">
            {(
              [
                ['operator', SimCardIcon, 'اپراتور من', 'تنظیمات آماده'],
                ['manual', PencilSimpleLineIcon, 'تنظیم دستی', 'مقادیر دلخواه'],
              ] as const
            ).map(([value, Icon, title, hint]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={mode === value}
                onClick={() => setMode(value)}
                className={cn(
                  'flex items-center gap-3 rounded-2xl p-3.5 text-start ring transition-[background-color,box-shadow] duration-200',
                  mode === value ? 'bg-kumo-brand/12 ring-2 ring-kumo-brand' : 'bg-kumo-base ring-kumo-hairline hover:bg-kumo-tint',
                )}
              >
                <span
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-xl',
                    mode === value ? 'bg-kumo-brand text-white' : 'bg-kumo-tint text-kumo-link',
                  )}
                >
                  <Icon size={22} weight={mode === value ? 'fill' : 'regular'} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-kumo-default">{title}</span>
                  <span className="block truncate text-xs text-kumo-subtle">{hint}</span>
                </span>
              </button>
            ))}
          </div>

          {mode === 'operator' ? (
            <div className="space-y-3">
              <OperatorPicker selected={operator} onSelect={setOperator} />
              {operator && (
                <dl className="divide-y divide-kumo-hairline rounded-2xl bg-kumo-base text-sm ring ring-kumo-hairline">
                  {(
                    [
                      ['APN', operator.apn, true],
                      ['نام کاربری و رمز', 'خالی', false],
                      ['پروتکل', 'IPv4 + IPv6', true],
                    ] as const
                  ).map(([label, value, latin]) => (
                    <div key={label} className="flex items-center justify-between gap-4 px-4 py-3">
                      <dt className="text-kumo-subtle">{label}</dt>
                      <dd className={latin ? 'ltr font-mono font-medium text-kumo-default' : 'font-medium text-kumo-default'}>{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <button
                type="button"
                className="px-1 text-sm font-medium text-kumo-link"
                onClick={() => {
                  if (operator) setManual({ ...EMPTY_MANUAL, apn: operator.apn, displayName: `APN ${operator.name} (IPv4/IPv6) – گلاینت` });
                  setMode('manual');
                }}
              >
                ویرایش این تنظیمات ←
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-kumo-base p-5 ring ring-kumo-hairline">
              <ManualForm values={manual} onChange={setManual} showErrors={showErrors} />
            </div>
          )}

          <Button variant="primary" icon={DownloadSimpleIcon} className="h-12 w-full justify-center rounded-xl text-base font-bold" onClick={download}>
            دانلود پروفایل
          </Button>

          <div ref={guideRef} className="scroll-mt-20">
            <InstallGuide highlight={downloaded} />
          </div>

        </main>
      </div>
    </DirectionProvider>
  );
}

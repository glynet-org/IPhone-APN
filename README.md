# پروفایل APN آیفون — گلاینت

سایت تک‌صفحه‌ای (Vite + React + Kumo، ظاهر پنل گلاینت) که برای اپراتورهای ایرانی یا تنظیمات دلخواه، پروفایل `.mobileconfig` آیفون با **IPv4 + IPv6 فعال** می‌سازد.

## اجرا
- `npm install` · `npm run dev` · `npm test` · `npm run build` (خروجی: `dist/`)

## انتشار روی Cloudflare Pages
- Build command: `npm run build` · Output directory: `dist`
- `public/_headers` نوع فایل `/profiles/*.mobileconfig` را `application/x-apple-aspen-config` می‌کند (برای نصب در Safari لازم است).

## نکته‌ها
- پروفایل هر اپراتور هنگام build در `dist/profiles/` ساخته می‌شود (`vite.config.ts`)؛ تنظیم دستی در خود مرورگر ساخته می‌شود.
- اپراتورها و APNها: `src/data/operators.ts`. لوگوها را به‌صورت `public/operators/{id}.svg` بگذارید (mci, irancell, rightel, shatel, aptel)؛ تا نباشند، حرف اول با رنگ اپراتور نمایش داده می‌شود.
- پروفایل‌های آیفون فیلدی برای MMS ندارند؛ تنظیم MMS فقط دستی در گوشی ممکن است.
- منابع APN: Zoomit، Digikala Mag، Digiato. قبل از انتشار روی سیم‌کارت واقعی تست شود.

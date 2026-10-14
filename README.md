# GlyNet iPhone APN Generator

A lightweight web app that generates iOS `.mobileconfig` cellular profiles with dual-stack **IPv4 + IPv6** (`AllowedProtocolMask = 3`) enabled for Iranian mobile carriers and custom APN settings.

## Features

- **Pre-configured carriers**: Ready-to-install profiles for MCI (همراه اول), MTN Irancell (ایرانسل), RighTel (رایتل), Shatel Mobile (شاتل موبایل), and ApTel (آپتل).
- **Custom APN builder**: Generate tailored profiles with custom APN names, authentication (PAP / CHAP), credentials, and HTTP proxy parameters.
- **Dual-stack by default**: Forces IPv4 and IPv6 for network attach, cellular data, and roaming.
- **Direct Safari installation**: Static carrier profiles served with `application/x-apple-aspen-config` MIME type so Safari prompts native iOS installation.
- **GlyNet panel UI**: Built with React 19, TypeScript, Tailwind CSS v4, `@cloudflare/kumo` semantic tokens, and Vazirmatn font.

## Quick Start

```bash
npm install
npm run dev       # Start local dev server
npm test          # Run Vitest test suite
npm run build     # Type-check and build to dist/
```

## Deployment (Cloudflare Pages)

- **Build command**: `npm run build`
- **Output directory**: `dist`

Carrier profiles are pre-built at compile time into `dist/profiles/*.mobileconfig`, while custom configs are assembled in-browser via Blob download. `public/_headers` configures the MIME type required by iOS Safari.

## License

MIT

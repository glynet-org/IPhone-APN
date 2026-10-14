import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { OPERATORS } from './src/data/operators';
import { buildProfile, stableUuid } from './src/lib/mobileconfig';

/**
 * Each operator's profile as a real file (/profiles/{slug}.mobileconfig), served with the profile MIME type
 * (public/_headers on Cloudflare Pages): the most dependable way for Safari to offer installing it.
 */
const operatorProfiles = (): Plugin => {
  const files = new Map(
    OPERATORS.map((op) => [
      `profiles/${op.slug}.mobileconfig`,
      buildProfile({
        apn: op.apn,
        slug: op.slug,
        displayName: `${op.nameEn} APN (IPv4/IPv6) – GlyNet`,
        uuids: [stableUuid(`${op.slug}-cellular`), stableUuid(`${op.slug}-profile`)],
      }),
    ]),
  );
  return {
    name: 'operator-profiles',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const file = files.get((req.url ?? '').split('?')[0].replace(/^\//, ''));
        if (!file) return next();
        res.setHeader('Content-Type', 'application/x-apple-aspen-config');
        res.end(file);
      });
    },
    generateBundle() {
      for (const [fileName, source] of files) this.emitFile({ type: 'asset', fileName, source });
    },
  };
};

export default defineConfig({
  plugins: [react(), tailwindcss(), operatorProfiles()],
  build: { chunkSizeWarningLimit: 1000 },
});

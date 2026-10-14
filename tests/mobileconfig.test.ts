import { describe, expect, it } from 'vitest';
import { buildProfile, escapeXml, stableUuid } from '../src/lib/mobileconfig';
import { detectBrowser } from '../src/lib/browser';

describe('buildProfile', () => {
  const xml = buildProfile({ apn: 'mcinet', slug: 'MCI', displayName: 'APN & <test>', uuids: ['A', 'B'] });

  it('allows IPv4 + IPv6 (mask 3) everywhere', () => {
    expect(xml.match(/<integer>3<\/integer>/g)).toHaveLength(5);
    expect(xml).not.toMatch(/ProtocolMask[^<]*<\/key><integer>[12]</);
  });
  it('uses the cellular payload with the APN for attach and data', () => {
    expect(xml).toContain('<string>com.apple.cellular</string>');
    expect(xml.match(/<key>Name<\/key><string>mcinet<\/string>/g)).toHaveLength(2);
  });
  it('escapes user text and keeps a stable identifier', () => {
    expect(xml).toContain('APN &amp; &lt;test&gt;');
    expect(xml).toContain('<string>com.glynet.apn.mci</string>');
  });
  it('adds a proxy only when given', () => {
    expect(xml).not.toContain('ProxyServer');
    expect(buildProfile({ apn: 'x', slug: 'x', displayName: 'x', proxyServer: '10.0.0.1', proxyPort: 8080 })).toContain('<integer>8080</integer>');
  });
});

it('escapeXml', () => expect(escapeXml(`a&b<"'>`)).toBe('a&amp;b&lt;&quot;&apos;&gt;'));
it('stableUuid is stable and UUID-shaped', () => {
  expect(stableUuid('x')).toBe(stableUuid('x'));
  expect(stableUuid('x')).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-A[0-9A-F]{3}-[0-9A-F]{12}$/);
});

describe('detectBrowser', () => {
  const safari = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
  it('Safari on iPhone', () => expect(detectBrowser(safari, 5)).toEqual({ ios: true, safari: true }));
  it('Chrome on iPhone', () => expect(detectBrowser(safari.replace('Version/18.0', 'CriOS/130.0'), 5)).toEqual({ ios: true, safari: false }));
  it('Telegram in-app', () => expect(detectBrowser(safari.replace('Safari/604.1', 'Telegram'), 5).safari).toBe(false));
  it('Android', () => expect(detectBrowser('Mozilla/5.0 (Linux; Android 14) Chrome/130 Mobile Safari/537.36', 5).ios).toBe(false));
});

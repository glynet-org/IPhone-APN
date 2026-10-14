/**
 * Builds an iOS configuration profile (.mobileconfig) with one cellular (APN) payload. IPv4 and IPv6 are both
 * allowed everywhere (protocol mask 3 = IPv4 + IPv6), for the attach APN, data, roaming and domestic roaming.
 */
export interface ApnInput {
  apn: string;
  username?: string;
  password?: string;
  authType?: 'CHAP' | 'PAP';
  proxyServer?: string;
  proxyPort?: number;
  /** Shown in Settings as the profile's name. */
  displayName: string;
  /** Stable id part, so installing again replaces the earlier profile instead of adding another. */
  slug: string;
  /** Fixed UUIDs (for pre-built files); random when left out. */
  uuids?: [string, string];
}

/** IPv4 = 1, IPv6 = 2: both. */
export const PROTOCOL_MASK_IPV4_IPV6 = 3;

export const escapeXml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const str = (key: string, value: string) => `<key>${key}</key><string>${escapeXml(value)}</string>`;
const int = (key: string, value: number) => `<key>${key}</key><integer>${value}</integer>`;

/** Letters, digits and . - _ only (for identifiers and file names). */
export const safeSlug = (value: string): string => value.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'apn';

export function buildProfile(input: ApnInput): string {
  const [cellularUuid, profileUuid] = input.uuids ?? [crypto.randomUUID(), crypto.randomUUID()];
  const id = `com.glynet.apn.${safeSlug(input.slug).toLowerCase()}`;
  const mask = PROTOCOL_MASK_IPV4_IPV6;
  const auth = input.authType ?? 'CHAP';
  const credentials = [str('AuthenticationType', auth), str('Username', input.username ?? ''), str('Password', input.password ?? '')];
  const proxy =
    input.proxyServer?.trim() && input.proxyPort ? [str('ProxyServer', input.proxyServer.trim()), int('ProxyPort', input.proxyPort)] : [];

  const attach = ['<dict>', str('Name', input.apn), ...credentials, int('AllowedProtocolMask', mask), '</dict>'];
  const data = [
    '<dict>',
    str('Name', input.apn),
    ...credentials,
    ...proxy,
    int('DefaultProtocolMask', mask),
    int('AllowedProtocolMask', mask),
    int('AllowedProtocolMaskInRoaming', mask),
    int('AllowedProtocolMaskInDomesticRoaming', mask),
    '</dict>',
  ];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
    '<plist version="1.0">',
    '<dict>',
    '<key>PayloadContent</key>',
    '<array>',
    '<dict>',
    str('PayloadType', 'com.apple.cellular'),
    int('PayloadVersion', 1),
    str('PayloadIdentifier', `${id}.cellular`),
    str('PayloadUUID', cellularUuid),
    str('PayloadDisplayName', `Cellular (${input.apn})`),
    '<key>AttachAPN</key>',
    ...attach,
    '<key>APNs</key>',
    '<array>',
    ...data,
    '</array>',
    '</dict>',
    '</array>',
    str('PayloadType', 'Configuration'),
    int('PayloadVersion', 1),
    str('PayloadIdentifier', id),
    str('PayloadUUID', profileUuid),
    str('PayloadDisplayName', input.displayName),
    str('PayloadDescription', 'تنظیم APN با IPv4 و IPv6 فعال — گلاینت'),
    str('PayloadOrganization', 'GlyNet'),
    '<key>PayloadRemovalDisallowed</key><false/>',
    '</dict>',
    '</plist>',
    '',
  ].join('\n');
}

/** A stable UUID-shaped string from text (FNV-1a), for pre-built profiles. */
export function stableUuid(seed: string): string {
  let hex = '';
  for (let round = 0; hex.length < 32; round += 1) {
    let h = 0x811c9dc5 ^ round;
    for (const ch of `${seed}:${round}`) h = Math.imul(h ^ ch.charCodeAt(0), 0x01000193);
    hex += (h >>> 0).toString(16).padStart(8, '0');
  }
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`.toUpperCase();
}

export const MOBILECONFIG_TYPE = 'application/x-apple-aspen-config';

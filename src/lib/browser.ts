/** Where the page is open: iPhone / iPad, and whether in Safari itself (other iOS browsers and in-app views can't install profiles). */
export interface BrowserInfo {
  ios: boolean;
  safari: boolean;
}

const OTHER_IOS_BROWSERS = /CriOS|FxiOS|EdgiOS|OPiOS|OPT\/|YaBrowser|DuckDuckGo|GSA\/|Telegram|Instagram|FBAN|FBAV|Line\/|WhatsApp|Snapchat|Twitter/i;

export function detectBrowser(ua = navigator.userAgent, touchPoints = navigator.maxTouchPoints ?? 0): BrowserInfo {
  const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && touchPoints > 1);
  const safari = ios && /Safari\//.test(ua) && !OTHER_IOS_BROWSERS.test(ua);
  return { ios, safari };
}

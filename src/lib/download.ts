import { MOBILECONFIG_TYPE } from './mobileconfig';

/** Downloads a profile made in the page (Safari shows its "configuration profile" prompt). */
export function downloadProfile(xml: string, fileName: string): void {
  const url = URL.createObjectURL(new Blob([xml], { type: MOBILECONFIG_TYPE }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

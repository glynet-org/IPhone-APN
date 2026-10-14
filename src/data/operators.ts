/**
 * Iranian mobile operators and the APN each one recommends for iPhone (no username / password).
 * Sources: the operators' own guides as reported by Zoomit, Digikala Mag and Digiato (see README).
 */
export interface Operator {
  id: string;
  name: string;
  /** Short English name, used in file names and the profile identifier. */
  slug: string;
  apn: string;
  /** Brand colour (the mark's background, and the fallback when the logo can't load). */
  color: string;
  /** Logo file in public/operators/ (empty or missing → a mark in the brand colour). */
  logo: string;
}

export const OPERATORS: Operator[] = [
  { id: 'mci', name: 'همراه اول', slug: 'MCI', apn: 'mcinet', color: '#2ea8d6', logo: '/operators/mci.svg' },
  { id: 'irancell', name: 'ایرانسل', slug: 'Irancell', apn: 'mtnirancell', color: '#f5b400', logo: '/operators/irancell.svg' },
  { id: 'rightel', name: 'رایتل', slug: 'RighTel', apn: 'RighTel', color: '#8a1c7c', logo: '/operators/rightel.svg' },
  { id: 'shatel', name: 'شاتل موبایل', slug: 'ShatelMobile', apn: 'shatelmobile', color: '#e2231a', logo: '/operators/shatel.svg' },
  { id: 'aptel', name: 'آپتل', slug: 'Aptel', apn: 'aptel', color: '#1f6fb2', logo: '/operators/aptel.svg' },
];

export const BRAND_ACCENT = '#635bff';

const HEX_RE = /^#([0-9A-Fa-f]{6})$/;

export function parseThemeColor(hex?: string | null): string {
  if (!hex || !HEX_RE.test(hex)) {
    return BRAND_ACCENT;
  }
  return hex;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = parseThemeColor(hex);
  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  };
}

export function contrastColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#0f172a' : '#ffffff';
}

export type AccentCssVars = Record<string, string>;

export function buildAccentCssVars(baseColor: string): AccentCssVars {
  const accent = parseThemeColor(baseColor);
  const mix = (pct: number, target: 'white' | 'black') =>
    `color-mix(in oklch, ${accent} ${pct}%, ${target})`;

  return {
    '--accent': accent,
    '--accent-fg': contrastColor(accent),
    '--accent-50': mix(12, 'white'),
    '--accent-100': mix(22, 'white'),
    '--accent-200': mix(35, 'white'),
    '--accent-300': mix(50, 'white'),
    '--accent-400': mix(68, 'white'),
    '--accent-500': accent,
    '--accent-600': mix(82, 'black'),
    '--accent-700': mix(70, 'black'),
  };
}

export function hexToRgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

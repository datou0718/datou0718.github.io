import type { Theme } from './types/theme';

// Shared by the visitor widget parameters and the travel map's CSS variables.
export const mapThemes: Record<Theme, { land: string; background: string; text: string; marker: string }> = {
  light: { land: '#002147', background: '#fefefe', text: '#002147', marker: '#d4af37' },
  dark: { land: '#d4af37', background: '#001938', text: '#ffffff', marker: '#ffffff' },
};

export type Theme = 'light' | 'dark';

export interface ThemeControls {
  theme: Theme;
  toggleTheme: () => void;
}

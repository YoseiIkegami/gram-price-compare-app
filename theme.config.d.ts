export const themeColors: {
  primary: string;
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
};

declare const themeConfig: {
  themeColors: typeof themeColors;
};

export default themeConfig;

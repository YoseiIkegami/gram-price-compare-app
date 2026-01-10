import { createContext, useContext, useEffect, useLayoutEffect, useMemo } from "react";
import { Appearance, View } from "react-native";
import { vars } from "nativewind";

import { SchemeColors } from "@/constants/theme";

type ThemeContextValue = Record<string, never>;

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 常にライトモードの色を使用
  const palette = SchemeColors.light;

  // 初期化時に即座に背景色を設定（白色フラッシュを防ぐ）- useLayoutEffectで同期的に実行
  useLayoutEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      const body = document.body;
      // 同期的に背景色を設定
      root.style.backgroundColor = palette.background;
      if (body) {
        body.style.backgroundColor = palette.background;
      }
      if (root.parentElement) {
        root.parentElement.style.backgroundColor = palette.background;
      }
    }
  }, [palette.background]);

  // テーマを適用
  useEffect(() => {
    Appearance.setColorScheme?.("light");
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      const body = document.body;
      root.dataset.theme = "light";
      // ダーククラスを確実に削除
      root.classList.remove("dark");
      // カラー変数を設定
      Object.entries(palette).forEach(([token, value]) => {
        root.style.setProperty(`--color-${token}`, value);
      });
      // 背景色を設定して白色フラッシュを防ぐ
      root.style.backgroundColor = palette.background;
      if (body) {
        body.style.backgroundColor = palette.background;
      }
      if (root.parentElement) {
        root.parentElement.style.backgroundColor = palette.background;
      }
    }
  }, [palette]);

  const themeVariables = useMemo(
    () =>
      vars({
        "color-primary": palette.primary,
        "color-background": palette.background,
        "color-surface": palette.surface,
        "color-foreground": palette.foreground,
        "color-muted": palette.muted,
        "color-border": palette.border,
        "color-success": palette.success,
        "color-warning": palette.warning,
        "color-error": palette.error,
      }),
    [palette],
  );

  const value = useMemo(() => ({}), []);

  return (
    <ThemeContext.Provider value={value}>
      <View style={[{ flex: 1 }, themeVariables]}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return ctx;
}

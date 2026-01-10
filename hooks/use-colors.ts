import { Colors, type ThemeColorPalette } from "@/constants/theme";

/**
 * Returns the current theme's color palette.
 * 常にライトモードの色を返します（ダークモード対応なし）
 * Usage: const colors = useColors(); then colors.text, colors.background, etc.
 */
export function useColors(): ThemeColorPalette {
  // 常にライトモードの色を返す
  return Colors.light;
}

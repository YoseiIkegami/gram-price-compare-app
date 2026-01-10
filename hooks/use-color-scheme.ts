/**
 * 常にライトモードを返します（ダークモード対応なし）
 */
export function useColorScheme() {
  return "light" as const;
}

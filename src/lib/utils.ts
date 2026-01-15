import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge.
 * This ensures Tailwind classes are properly merged without conflicts.
 *
 * Usage:
 * ```tsx
 * cn("px-4 py-2", isActive && "bg-primary", className)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 数値入力を正規化して文字列として返す（正の浮動小数のみ、最大8桁）
 * 入力中の小数点も保持する
 * @param text - 入力テキスト
 * @returns 正規化された文字列（0以上の浮動小数、最大8桁）
 *
 * 例:
 * - "12345678" → "12345678" (8桁)
 * - "1234567.8" → "1234567.8" (8桁)
 * - "123456.78" → "123456.78" (8桁)
 * - "100." → "100." (入力中の小数点を保持)
 */
export function normalizeNumericInputText(text: string): string {
  // 空文字列の場合は空文字列を返す
  if (!text || text.trim() === '') return '';

  // 数字、小数点のみを許可する正規表現
  let cleaned = text
    .replace(/[^\d.]/g, '') // 数字と小数点以外を削除
    .replace(/^\./, '0.') // 先頭の小数点を0.に変換
    .replace(/\./g, (match, offset, string) => {
      // 最初の小数点のみ保持、2つ目以降は削除
      const firstDotIndex = string.indexOf('.');
      return offset === firstDotIndex ? match : '';
    });

  // 8桁を超える場合は切り詰め（小数点は桁数に含めない）
  // 整数部と小数部の数字の合計が8桁まで
  let normalized = cleaned;
  if (cleaned.includes('.')) {
    const [integerPart, decimalPart = ''] = cleaned.split('.');
    const totalDigits = integerPart.length + decimalPart.length;

    if (totalDigits > 8) {
      // 8桁を超える場合、小数部から優先的に削減
      const availableDigits = 8;
      if (integerPart.length >= availableDigits) {
        // 整数部だけで8桁を超える場合
        normalized = integerPart.slice(0, availableDigits);
      } else {
        // 整数部 + 小数部で8桁まで
        const decimalLength = availableDigits - integerPart.length;
        normalized = `${integerPart}.${decimalPart.slice(0, decimalLength)}`;
      }
    }
  } else {
    // 小数点なしの場合、8桁まで
    normalized = cleaned.slice(0, 8);
  }

  return normalized;
}

/**
 * 正規化された文字列を数値に変換（計算用）
 * @param text - 正規化された文字列
 * @returns 正規化された数値（0以上の浮動小数）
 */
export function normalizeNumericInput(text: string): number {
  const normalizedText = normalizeNumericInputText(text);

  // 空文字列の場合は0を返す
  if (!normalizedText || normalizedText.trim() === '') return 0;

  // 数値に変換（NaNの場合は0）
  const num = parseFloat(normalizedText) || 0;

  // 負の値は0に変換（正の値のみ許可）
  return Math.max(0, num);
}

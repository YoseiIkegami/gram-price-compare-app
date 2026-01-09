/**
 * グラム単価計算ロジック
 */

export interface Product {
  id: string;
  label: string;
  price: number;
  weight: number;
  pricePerGram: number;
}

export interface ComparisonResult {
  products: Product[];
  cheapestId: string | null;
}

/**
 * グラム単価を計算
 * @param price - 価格（円）
 * @param weight - 内容量（g）
 * @returns グラム単価（円/g）、小数第2位まで
 */
export function calculatePricePerGram(price: number, weight: number): number {
  if (weight === 0 || !price || !weight) return 0;
  return Math.round((price / weight) * 100) / 100;
}

/**
 * 複数商品の中から最安商品を特定
 * @param products - 商品配列
 * @returns 最安商品のID、複数同価格の場合は最初のID
 */
export function findCheapest(products: Product[]): string | null {
  const validProducts = products.filter((p) => p.pricePerGram > 0);
  if (validProducts.length === 0) return null;

  return validProducts.reduce((cheapest, current) =>
    current.pricePerGram < cheapest.pricePerGram ? current : cheapest
  ).id;
}

/**
 * 商品リストを比較
 * @param products - 商品配列
 * @returns 比較結果（最安商品ID含む）
 */
export function compareProducts(products: Product[]): ComparisonResult {
  return {
    products,
    cheapestId: findCheapest(products),
  };
}

/**
 * 商品IDを生成
 * @param index - インデックス
 * @returns 商品ID（A, B, C, D...）
 */
export function generateProductId(index: number): string {
  return String.fromCharCode(65 + index); // A=65
}

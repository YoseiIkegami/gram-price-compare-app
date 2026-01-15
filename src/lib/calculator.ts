/**
 * グラム単価計算ロジック
 */

export interface Product {
  label: string;
  index: number; // 商品番号（1, 2, 3, 4...）一意の識別子としても使用
  price: number;
  weight: number;
  pricePerGram: number;
}

export interface ComparisonResult {
  products: Product[];
  cheapestIndex: number | null; // 最初の最安商品のindex
  cheapestIndexes: number[]; // すべての最安商品のindex（同率の場合も含む）
}

/**
 * グラム単価を計算
 * @param price - 価格（円）
 * @param weight - 内容量（g）
 * @returns グラム単価（円/g）、小数第2位まで
 */
export function calculatePricePerGram(price: number, weight: number): number {
  // 価格または内容量が0以下の場合は0を返す
  if (price <= 0 || weight <= 0) return 0;
  // 小数第2位で四捨五入
  return Math.round((price / weight) * 100) / 100;
}

/**
 * 複数商品の中から最安商品を特定（最初の一つ）
 * @param products - 商品配列
 * @returns 最安商品のindex、複数同価格の場合は最初のindex
 */
export function findCheapest(products: Product[]): number | null {
  const validProducts = products.filter((p) => p.pricePerGram > 0);
  if (validProducts.length === 0) return null;

  return validProducts.reduce((cheapest, current) =>
    current.pricePerGram < cheapest.pricePerGram ? current : cheapest
  ).index;
}

/**
 * 複数商品の中からすべての最安商品を特定（同率も含む）
 * @param products - 商品配列
 * @param tolerance - 価格比較の許容誤差（デフォルト: 0.01）
 * @returns すべての最安商品のindexの配列
 */
export function findCheapestIndexes(products: Product[], tolerance: number = 0.01): number[] {
  const validProducts = products.filter((p) => p.pricePerGram > 0);
  if (validProducts.length === 0) return [];

  // 最安価格を取得
  const cheapestPrice = validProducts.reduce((min, current) =>
    current.pricePerGram < min ? current.pricePerGram : min
  , Infinity);

  // 最安価格と許容誤差内の商品のindexをすべて返す
  return validProducts
    .filter((p) => Math.abs(p.pricePerGram - cheapestPrice) < tolerance)
    .map((p) => p.index);
}

/**
 * 商品リストを比較
 * @param products - 商品配列
 * @param tolerance - 価格比較の許容誤差（デフォルト: 0.01）
 * @returns 比較結果（最安商品のindex含む）
 */
export function compareProducts(products: Product[], tolerance: number = 0.01): ComparisonResult {
  const cheapestIndex = findCheapest(products);
  const cheapestIndexes = findCheapestIndexes(products, tolerance);

  return {
    products,
    cheapestIndex, // 最初の最安商品のindex
    cheapestIndexes, // すべての最安商品のindex
  };
}

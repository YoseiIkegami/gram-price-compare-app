import { describe, it, expect } from "vitest";
import {
  calculatePricePerGram,
  findCheapest,
  compareProducts,
  generateProductId,
  type Product,
} from "./calculator";

describe("Calculator", () => {
  describe("calculatePricePerGram", () => {
    it("計算が正しく行われること", () => {
      const result = calculatePricePerGram(100, 500);
      expect(result).toBe(0.2);
    });

    it("小数第2位で四捨五入されること", () => {
      const result = calculatePricePerGram(100, 3);
      expect(result).toBe(33.33);
    });

    it("内容量が0の場合は0を返すこと", () => {
      const result = calculatePricePerGram(100, 0);
      expect(result).toBe(0);
    });

    it("価格が0の場合は0を返すこと", () => {
      const result = calculatePricePerGram(0, 100);
      expect(result).toBe(0);
    });

    it("小数値の価格と内容量で正しく計算されること", () => {
      const result = calculatePricePerGram(99.99, 250);
      expect(result).toBe(0.4);
    });
  });

  describe("findCheapest", () => {
    it("最安商品を正しく特定すること", () => {
      const products: Product[] = [
        {
          id: "A",
          label: "A",
          price: 100,
          weight: 500,
          pricePerGram: 0.2,
        },
        {
          id: "B",
          label: "B",
          price: 200,
          weight: 500,
          pricePerGram: 0.4,
        },
      ];
      const result = findCheapest(products);
      expect(result).toBe("A");
    });

    it("複数の最安商品がある場合は最初のものを返すこと", () => {
      const products: Product[] = [
        {
          id: "A",
          label: "A",
          price: 100,
          weight: 500,
          pricePerGram: 0.2,
        },
        {
          id: "B",
          label: "B",
          price: 100,
          weight: 500,
          pricePerGram: 0.2,
        },
      ];
      const result = findCheapest(products);
      expect(result).toBe("A");
    });

    it("有効な商品がない場合はnullを返すこと", () => {
      const products: Product[] = [
        {
          id: "A",
          label: "A",
          price: 0,
          weight: 0,
          pricePerGram: 0,
        },
      ];
      const result = findCheapest(products);
      expect(result).toBeNull();
    });

    it("空配列ではnullを返すこと", () => {
      const result = findCheapest([]);
      expect(result).toBeNull();
    });
  });

  describe("compareProducts", () => {
    it("比較結果に最安商品IDが含まれること", () => {
      const products: Product[] = [
        {
          id: "A",
          label: "A",
          price: 100,
          weight: 500,
          pricePerGram: 0.2,
        },
        {
          id: "B",
          label: "B",
          price: 200,
          weight: 500,
          pricePerGram: 0.4,
        },
      ];
      const result = compareProducts(products);
      expect(result.cheapestId).toBe("A");
      expect(result.products).toEqual(products);
    });

    it("有効な商品がない場合はnullを返すこと", () => {
      const products: Product[] = [
        {
          id: "A",
          label: "A",
          price: 0,
          weight: 0,
          pricePerGram: 0,
        },
      ];
      const result = compareProducts(products);
      expect(result.cheapestId).toBeNull();
    });
  });

  describe("generateProductId", () => {
    it("インデックス0でAを返すこと", () => {
      expect(generateProductId(0)).toBe("A");
    });

    it("インデックス1でBを返すこと", () => {
      expect(generateProductId(1)).toBe("B");
    });

    it("インデックス2でCを返すこと", () => {
      expect(generateProductId(2)).toBe("C");
    });

    it("インデックス3でDを返すこと", () => {
      expect(generateProductId(3)).toBe("D");
    });
  });
});

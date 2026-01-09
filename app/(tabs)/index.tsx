import { ScrollView, View, Text, Pressable, Alert } from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { ProductCard } from "@/components/product-card";
import {
  calculatePricePerGram,
  compareProducts,
  generateProductId,
  type Product,
} from "@/lib/calculator";
import { cn } from "@/lib/utils";
import { useColors } from "@/hooks/use-colors";
import { useHistory } from "@/lib/history-context";

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "A",
    label: "A",
    price: 0,
    weight: 0,
    pricePerGram: 0,
  },
  {
    id: "B",
    label: "B",
    price: 0,
    weight: 0,
    pricePerGram: 0,
  },
];

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { saveEntry } = useHistory();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // 商品の価格を更新
  const handlePriceChange = useCallback((index: number, price: number) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[index].price = price;
      updated[index].pricePerGram = calculatePricePerGram(
        price,
        updated[index].weight
      );
      return updated;
    });
  }, []);

  // 商品の内容量を更新
  const handleWeightChange = useCallback((index: number, weight: number) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[index].weight = weight;
      updated[index].pricePerGram = calculatePricePerGram(
        updated[index].price,
        weight
      );
      return updated;
    });
  }, []);

  // 商品を追加
  const handleAddProduct = useCallback(() => {
    if (products.length < 4) {
      const newId = generateProductId(products.length);
      setProducts((prev) => [
        ...prev,
        {
          id: newId,
          label: newId,
          price: 0,
          weight: 0,
          pricePerGram: 0,
        },
      ]);
    }
  }, [products.length]);

  // 商品を削除
  const handleRemoveProduct = useCallback((index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // すべてクリア
  const handleClear = useCallback(() => {
    const validProducts = products.filter((p) => p.price > 0 && p.weight > 0);
    if (validProducts.length > 0) {
      const cheapest = validProducts.reduce((prev, current) =>
        current.pricePerGram < prev.pricePerGram ? current : prev
      );

      saveEntry({
        title: "",
        products: validProducts.map((p) => ({
          label: p.label,
          price: p.price,
          weight: p.weight,
          pricePerGram: p.pricePerGram,
        })),
        cheapestLabel: cheapest.label,
      });
    }
    setProducts(INITIAL_PRODUCTS);
  }, [products, saveEntry]);

  // 最安商品を特定
  const comparison = compareProducts(products);

  return (
    <ScreenContainer className="bg-background">
      {/* ヘッダー */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground">
          グラム単価比較
        </Text>
        <Pressable
          onPress={() => router.push("../history" as any)}
          className="px-3 py-2 rounded-lg"
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text className="text-primary font-semibold">履歴</Text>
        </Pressable>
      </View>

      {/* コンテンツ */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        {/* 商品カード */}
        <View className="gap-2">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              label={product.label}
              price={product.price}
              weight={product.weight}
              pricePerGram={product.pricePerGram}
              isCheapest={product.id === comparison.cheapestId}
              onPriceChange={(price) => handlePriceChange(index, price)}
              onWeightChange={(weight) => handleWeightChange(index, weight)}
              onRemove={() => handleRemoveProduct(index)}
              showRemove={products.length > 2}
            />
          ))}
        </View>

        {/* スペーサー */}
        <View className="flex-1" />

        {/* アクションボタン */}
        <View className="gap-3 mt-6">
          {/* 商品追加ボタン */}
          {products.length < 4 && (
            <Pressable
              onPress={handleAddProduct}
              className="py-3 px-4 rounded-lg border border-primary items-center"
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                backgroundColor: pressed ? `${colors.primary}10` : "transparent",
              })}
            >
              <Text className="text-primary font-semibold">
                + 商品を追加
              </Text>
            </Pressable>
          )}

          {/* クリアボタン */}
          <Pressable
            onPress={handleClear}
            className="py-3 px-4 rounded-lg items-center"
            style={({ pressed }) => ({
              backgroundColor: colors.primary,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text className="text-background font-semibold">
              クリア
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

import { ScrollView, View, Text, Pressable, TextInput, Platform } from "react-native";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import type React from "react";
import { ScreenContainer } from "@/components/screen-container";
import { ProductCard } from "@/components/product-card";
import {
  calculatePricePerGram,
  compareProducts,
  type Product,
} from "@/lib/calculator";
import { useColors } from "@/hooks/use-colors";
import { triggerLightHaptic } from "@/lib/haptics";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const INITIAL_PRODUCTS: Product[] = [
  {
    label: "商品1",
    index: 1,
    price: 0,
    weight: 0,
    pricePerGram: 0,
  },
  {
    label: "商品2",
    index: 2,
    price: 0,
    weight: 0,
    pricePerGram: 0,
  },
];

// 価格比較の許容誤差（円/g）
const PRICE_COMPARISON_TOLERANCE = 0.01;


// 入力フォーカスの遅延時間（ms）
const INPUT_FOCUS_DELAY_MS = 100;

export default function HomeScreen() {
  const colors = useColors();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [editingLabel, setEditingLabel] = useState<number | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // 入力フィールドのRef
  const priceInputRefs = useRef<{ [key: number]: React.RefObject<TextInput | null> }>({});
  const weightInputRefs = useRef<{ [key: number]: React.RefObject<TextInput | null> }>({});
  
  // 商品ごとのrefを初期化
  useEffect(() => {
    products.forEach((product) => {
      if (!priceInputRefs.current[product.index]) {
        priceInputRefs.current[product.index] = { current: null } as React.RefObject<TextInput | null>;
      }
      if (!weightInputRefs.current[product.index]) {
        weightInputRefs.current[product.index] = { current: null } as React.RefObject<TextInput | null>;
      }
    });
  }, [products]);

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

  // 商品名を更新
  const handleLabelChange = useCallback((index: number, label: string) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[index].label = label;
      return updated;
    });
  }, []);

  // 商品を追加
  const handleAddProduct = useCallback(() => {
    // 連打防止: 処理中の場合は処理しない
    if (isAddingProduct) {
      return;
    }
    
    setIsAddingProduct(true);
    triggerLightHaptic();
    
    setProducts((prev) => {
      // 上限チェック（コールバック内で最新の状態を確認）
      if (prev.length >= 4) {
        // 上限に達している場合はフラグをリセットして終了
        setTimeout(() => setIsAddingProduct(false), 0);
        return prev;
      }
      
      // 現在の商品の最大indexを取得して＋１
      const maxIndex = prev.reduce((max, product) => 
        product.index > max ? product.index : max, 0
      );
      const nextIndex = maxIndex + 1;
      
      const newProduct = {
        label: `商品${nextIndex}`,
        index: nextIndex,
        price: 0,
        weight: 0,
        pricePerGram: 0,
      };
      const updated = [...prev, newProduct];
      
      // フォーカス処理を非同期で実行
      setTimeout(() => {
        try {
          const inputRef = priceInputRefs.current[nextIndex];
          if (inputRef?.current) {
            inputRef.current.focus();
          }
        } catch {
          // フォーカスエラーは無視
        } finally {
          // 処理完了後にフラグをリセット
          setIsAddingProduct(false);
        }
      }, INPUT_FOCUS_DELAY_MS);
      
      return updated;
    });
  }, [isAddingProduct]);

  // 商品を削除
  const handleRemoveProduct = useCallback((index: number) => {
    triggerLightHaptic();
    
    setProducts((prev) => {
      const removed = prev.filter((_, i) => i !== index);
      const removedIndex = prev[index]?.index;
      
      // 削除された商品のRefをクリーンアップ
      if (removedIndex !== undefined) {
        delete priceInputRefs.current[removedIndex];
        delete weightInputRefs.current[removedIndex];
      }
      
      return removed;
    });
  }, []);

  // すべてクリア
  const handleClear = useCallback(() => {
    triggerLightHaptic();
    
    // 既存の商品をすべて削除し、Refもクリーンアップ
    setProducts((prev) => {
      // 既存の商品のRefをすべてクリーンアップ
      prev.forEach((product) => {
        delete priceInputRefs.current[product.index];
        delete weightInputRefs.current[product.index];
      });
      
      // 商品1,2を初期化（新しい配列として作成してReactに変更を確実に検出させる）
      const resetProducts: Product[] = [
        {
          label: "商品1",
          index: 1,
          price: 0,
          weight: 0,
          pricePerGram: 0,
        },
        {
          label: "商品2",
          index: 2,
          price: 0,
          weight: 0,
          pricePerGram: 0,
        },
      ];
      
      return resetProducts;
    });
    setEditingLabel(null);
  }, []);

  // 最安商品を特定（メモ化でパフォーマンス最適化）
  const comparison = useMemo(() => compareProducts(products, PRICE_COMPARISON_TOLERANCE), [products]);

  return (
    <ScreenContainer className="bg-background flex-col p-0">
      {/* ヘッダー: クリア・追加ボタン */}
      <View
        className="flex-row items-center justify-between"
        style={{
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          paddingHorizontal: 24,
          paddingVertical: 16,
        }}
      >
        {/* 左側: クリアボタン */}
        <Pressable
          onPress={handleClear}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 10,
            paddingHorizontal: 16,
            backgroundColor: `${colors.error}15`,
            borderWidth: 1,
            borderColor: colors.error,
            borderRadius: 8,
            opacity: pressed ? 0.7 : 1,
            marginRight: 8,
          })}
        >
          <MaterialIcons
            name="clear"
            size={16}
            color={colors.error}
            style={{ marginRight: 6 }}
          />
          <Text
            style={{
              color: colors.error,
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            クリア
          </Text>
        </Pressable>

        {/* 右側: 追加ボタン */}
        {products.length < 4 && (
          <Pressable
            onPress={handleAddProduct}
            disabled={isAddingProduct}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 10,
              paddingHorizontal: 16,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              opacity: isAddingProduct || pressed ? 0.5 : 1,
              marginLeft: 8,
            })}
          >
            <MaterialIcons
              name="add"
              size={16}
              color={colors.primary}
              style={{ marginRight: 6 }}
            />
            <Text
              style={{
                color: colors.primary,
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              追加
            </Text>
          </Pressable>
        )}
      </View>

      {/* コンテンツ - グラデーション背景 */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: colors.background,
        }}
      >
        <View className="px-6 py-6">
          {/* 商品カードリスト */}
          <View className="mb-4 gap-4">
            {products.map((item, index) => (
            <ProductCard
              key={item.index}
              label={item.label}
              price={item.price}
              weight={item.weight}
              pricePerGram={item.pricePerGram}
              isCheapest={comparison.cheapestIndexes.includes(item.index)}
              isEditing={editingLabel === item.index}
              onPriceChange={(price) => handlePriceChange(index, price)}
              onWeightChange={(weight) => handleWeightChange(index, weight)}
              onLabelChange={(label) => {
                handleLabelChange(index, label);
              }}
              onRemove={() => handleRemoveProduct(index)}
              onEditLabel={() => {
                setEditingLabel(
                  editingLabel === item.index ? null : item.index
                );
              }}
              showRemove={products.length > 2}
              priceInputRef={priceInputRefs.current[item.index]}
              weightInputRef={weightInputRefs.current[item.index]}
            />
            ))}
          </View>

          {/* 最安商品サマリー */}
          {comparison.cheapestIndexes.length > 0 && (() => {
            const cheapestProducts = products.filter((p) =>
              comparison.cheapestIndexes.includes(p.index)
            );
            const cheapestPricePerGram = cheapestProducts[0]?.pricePerGram || 0;
            const cheapestLabels = cheapestProducts.map((p) => p.label).join("・");

            const summaryShadowStyle = Platform.OS === "web"
              ? { boxShadow: `0 4px 8px ${colors.primary}26` }
              : {
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 4,
                };

            return (
              <View
                className="rounded-2xl p-5 mb-4"
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 2,
                  borderColor: colors.primary,
                  ...summaryShadowStyle,
                }}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <Text className="text-2xl">👑</Text>
                  <Text className="text-sm font-semibold text-muted">最安商品</Text>
                </View>
                <View className="flex-row items-baseline gap-2 flex-wrap">
                  <Text className="text-3xl font-bold text-primary">
                    {cheapestLabels}
                  </Text>
                  <Text className="text-xl font-semibold text-primary">
                    {cheapestPricePerGram.toFixed(2)}
                  </Text>
                  <Text className="text-base text-primary">円/g</Text>
                </View>
              </View>
            );
          })()}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

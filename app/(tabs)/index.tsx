import { ScrollView, View, Text, Pressable, FlatList, TextInput } from "react-native";
import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { ProductCardHorizontal } from "@/components/product-card-horizontal";
import {
  calculatePricePerGram,
  compareProducts,
  generateProductId,
  type Product,
} from "@/lib/calculator";
import { cn } from "@/lib/utils";
import { useColors } from "@/hooks/use-colors";
import { useHistory } from "@/lib/history-context";
import { triggerLightHaptic } from "@/lib/haptics";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

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
  const params = useLocalSearchParams();
  const { saveEntry } = useHistory();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [editingLabel, setEditingLabel] = useState<string | null>(null);

  // 履歴から復元
  useEffect(() => {
    if (params.restore) {
      try {
        const entry = JSON.parse(params.restore as string);
        const restoredProducts = entry.products.map((p: any, index: number) => ({
          id: generateProductId(index),
          label: p.label,
          price: p.price,
          weight: p.weight,
          pricePerGram: p.pricePerGram,
        }));
        setProducts(restoredProducts);
      } catch (error) {
        console.error("Failed to restore history:", error);
      }
    }
  }, [params.restore]);

  // 入力フィールドのRef
  const priceInputRefs = useRef<{ [key: string]: TextInput | null }>({});
  const weightInputRefs = useRef<{ [key: string]: TextInput | null }>({});

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
    if (products.length < 4) {
      triggerLightHaptic();
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
    triggerLightHaptic();
    setProducts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // すべてクリア
  const handleClear = useCallback(() => {
    triggerLightHaptic();
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
    setEditingLabel(null);
  }, [products, saveEntry]);

  // 最安商品を特定
  const comparison = compareProducts(products);

  return (
    <ScreenContainer className="bg-background flex-col">
      {/* ヘッダー */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
        <Text className="text-xl font-bold text-foreground">
          グラム単価比較
        </Text>
        <Pressable
          onPress={() => {
            triggerLightHaptic();
            router.push("../history" as any);
          }}
          className="px-3 py-2 rounded-lg"
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <MaterialIcons
            name="history"
            size={24}
            color={colors.primary}
          />
        </Pressable>
      </View>

      {/* アクションバー（上部） */}
      <View className="flex-row gap-2 px-4 py-3 border-b border-border">
        {/* クリアボタン */}
        <Pressable
          onPress={handleClear}
          className="flex-1 py-2 px-3 rounded-lg flex-row items-center justify-center gap-1"
          style={({ pressed }) => ({
            backgroundColor: colors.primary,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <MaterialIcons
            name="clear"
            size={18}
            color="white"
          />
          <Text className="text-white font-semibold text-sm">
            クリア
          </Text>
        </Pressable>

        {/* 商品追加ボタン */}
        {products.length < 4 && (
          <Pressable
            onPress={handleAddProduct}
            className="flex-1 py-2 px-3 rounded-lg flex-row items-center justify-center gap-1 border"
            style={({ pressed }) => ({
              borderColor: colors.primary,
              backgroundColor: pressed ? `${colors.primary}10` : "transparent",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <MaterialIcons
              name="add"
              size={18}
              color={colors.primary}
            />
            <Text className="text-primary font-semibold text-sm">
              追加
            </Text>
          </Pressable>
        )}
      </View>

      {/* コンテンツ */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        {/* 商品カード横並びスクロール */}
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ProductCardHorizontal
              label={item.label}
              price={item.price}
              weight={item.weight}
              pricePerGram={item.pricePerGram}
              isCheapest={item.id === comparison.cheapestId}
              isEditing={editingLabel === item.id}
              onPriceChange={(price) => handlePriceChange(index, price)}
              onWeightChange={(weight) => handleWeightChange(index, weight)}
              onLabelChange={(label) => {
                handleLabelChange(index, label);
              }}
              onRemove={() => handleRemoveProduct(index)}
              onEditLabel={() => {
                setEditingLabel(
                  editingLabel === item.id ? null : item.id
                );
              }}
              showRemove={products.length > 2}
              priceInputRef={priceInputRefs.current[item.id] as any}
              weightInputRef={weightInputRefs.current[item.id] as any}
            />
          )}
          horizontal
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
          snapToInterval={280}
          decelerationRate="fast"
        />
      </ScrollView>
    </ScreenContainer>
  );
}

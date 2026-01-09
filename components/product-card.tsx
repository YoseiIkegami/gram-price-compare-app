import { View, TextInput, Pressable, Text } from "react-native";
import { cn } from "@/lib/utils";
import { useColors } from "@/hooks/use-colors";

export interface ProductCardProps {
  label: string;
  price: number;
  weight: number;
  pricePerGram: number;
  isCheapest: boolean;
  onPriceChange: (price: number) => void;
  onWeightChange: (weight: number) => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

export function ProductCard({
  label,
  price,
  weight,
  pricePerGram,
  isCheapest,
  onPriceChange,
  onWeightChange,
  onRemove,
  showRemove = false,
}: ProductCardProps) {
  const colors = useColors();

  return (
    <View
      className={cn(
        "rounded-2xl p-4 border mb-4",
        isCheapest ? "bg-primary/10 border-primary" : "bg-surface border-border"
      )}
      style={{
        backgroundColor: isCheapest ? `${colors.primary}15` : colors.surface,
        borderColor: isCheapest ? colors.primary : colors.border,
      }}
    >
      {/* ヘッダー */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-foreground">
          商品 {label}
        </Text>
        {isCheapest && (
          <Text className="text-xl">👑</Text>
        )}
      </View>

      {/* 入力フィールド */}
      <View className="gap-3 mb-4">
        {/* 価格入力 */}
        <View>
          <Text className="text-sm font-medium text-muted mb-1">
            価格
          </Text>
          <View className="flex-row items-center border border-border rounded-lg px-3 py-2 bg-background">
            <TextInput
              className="flex-1 text-foreground text-base"
              placeholder="0"
              placeholderTextColor={colors.muted}
              keyboardType="decimal-pad"
              value={price === 0 ? "" : price.toString()}
              onChangeText={(text) => {
                const num = parseFloat(text) || 0;
                onPriceChange(num);
              }}
              returnKeyType="done"
            />
            <Text className="text-foreground ml-2">円</Text>
          </View>
        </View>

        {/* 内容量入力 */}
        <View>
          <Text className="text-sm font-medium text-muted mb-1">
            内容量
          </Text>
          <View className="flex-row items-center border border-border rounded-lg px-3 py-2 bg-background">
            <TextInput
              className="flex-1 text-foreground text-base"
              placeholder="0"
              placeholderTextColor={colors.muted}
              keyboardType="decimal-pad"
              value={weight === 0 ? "" : weight.toString()}
              onChangeText={(text) => {
                const num = parseFloat(text) || 0;
                onWeightChange(num);
              }}
              returnKeyType="done"
            />
            <Text className="text-foreground ml-2">g</Text>
          </View>
        </View>
      </View>

      {/* 計算結果 */}
      <View className="border-t border-border pt-4">
        <Text className="text-xs text-muted mb-1">1g単価</Text>
        <View className="flex-row items-baseline justify-between">
          <Text
            className={cn(
              "text-2xl font-bold",
              isCheapest ? "text-primary" : "text-foreground"
            )}
            style={{
              color: isCheapest ? colors.primary : colors.foreground,
            }}
          >
            {pricePerGram === 0 ? "—" : pricePerGram.toFixed(2)}
          </Text>
          <Text className="text-sm text-muted">円/g</Text>
        </View>
      </View>

      {/* 削除ボタン */}
      {showRemove && onRemove && (
        <Pressable
          onPress={onRemove}
          className="mt-4 py-2 px-3 bg-error/10 rounded-lg"
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text className="text-center text-error text-sm font-medium">
            削除
          </Text>
        </Pressable>
      )}
    </View>
  );
}

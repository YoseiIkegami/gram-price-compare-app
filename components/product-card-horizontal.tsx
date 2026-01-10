import { View, TextInput, Pressable, Text } from "react-native";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useColors } from "@/hooks/use-colors";
import { triggerLightHaptic } from "@/lib/haptics";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export interface ProductCardHorizontalProps {
  label: string;
  price: number;
  weight: number;
  pricePerGram: number;
  isCheapest: boolean;
  isEditing: boolean;
  onPriceChange: (price: number) => void;
  onWeightChange: (weight: number) => void;
  onLabelChange?: (label: string) => void;
  onRemove?: () => void;
  onEditLabel?: () => void;
  showRemove?: boolean;
  priceInputRef?: React.RefObject<TextInput>;
  weightInputRef?: React.RefObject<TextInput>;
}

export function ProductCardHorizontal({
  label,
  price,
  weight,
  pricePerGram,
  isCheapest,
  isEditing,
  onPriceChange,
  onWeightChange,
  onLabelChange,
  onRemove,
  onEditLabel,
  showRemove = false,
  priceInputRef,
  weightInputRef,
}: ProductCardHorizontalProps) {
  const colors = useColors();
  const labelInputRef = useRef<TextInput>(null);

  return (
    <View
      className={cn(
        "rounded-xl p-3 border min-w-fit",
        isCheapest ? "bg-primary/10 border-primary" : "bg-surface border-border"
      )}
      style={{
        backgroundColor: isCheapest ? `${colors.primary}15` : colors.surface,
        borderColor: isCheapest ? colors.primary : colors.border,
      }}
    >
      {/* ヘッダー：商品名と削除ボタン */}
      <View className="flex-row items-center justify-between mb-2">
        <Pressable
          onPress={() => {
            triggerLightHaptic();
            onEditLabel?.();
            labelInputRef.current?.focus();
          }}
          className="flex-row items-center gap-1"
        >
          {isEditing ? (
            <TextInput
              ref={labelInputRef}
              value={label}
              onChangeText={onLabelChange}
              placeholder="商品名"
              placeholderTextColor={colors.muted}
              className="text-base font-semibold text-foreground px-2 py-1 border border-primary rounded"
              style={{ color: colors.foreground, borderColor: colors.primary }}
              maxLength={10}
            />
          ) : (
            <>
              <Text className="text-base font-semibold text-foreground">
                {label}
              </Text>
              <MaterialIcons
                name="edit"
                size={14}
                color={colors.muted}
              />
            </>
          )}
        </Pressable>

        {/* 削除ボタン */}
        {showRemove && onRemove && (
          <Pressable
            onPress={() => {
              triggerLightHaptic();
              onRemove();
            }}
            className="p-1"
          >
            <MaterialIcons
              name="delete-outline"
              size={18}
              color={colors.error}
            />
          </Pressable>
        )}

        {/* 最安アイコン */}
        {isCheapest && (
          <Text className="text-lg ml-1">👑</Text>
        )}
      </View>

      {/* 入力フィールド */}
      <View className="gap-2">
        {/* 価格入力 */}
        <TextInput
          ref={priceInputRef}
          className="border border-border rounded px-2 py-1.5 text-foreground text-sm"
          placeholder="100"
          placeholderTextColor={colors.muted}
          keyboardType="decimal-pad"
          value={price === 0 ? "" : price.toString()}
          onChangeText={(text) => {
            const num = parseFloat(text) || 0;
            onPriceChange(num);
          }}
          returnKeyType="next"
          onSubmitEditing={() => weightInputRef?.current?.focus()}
          style={{
            color: colors.foreground,
            borderColor: colors.border,
          }}
        />

        {/* 内容量入力 */}
        <TextInput
          ref={weightInputRef}
          className="border border-border rounded px-2 py-1.5 text-foreground text-sm"
          placeholder="500"
          placeholderTextColor={colors.muted}
          keyboardType="decimal-pad"
          value={weight === 0 ? "" : weight.toString()}
          onChangeText={(text) => {
            const num = parseFloat(text) || 0;
            onWeightChange(num);
          }}
          returnKeyType="done"
          style={{
            color: colors.foreground,
            borderColor: colors.border,
          }}
        />
      </View>

      {/* 計算結果 */}
      <View className="border-t border-border pt-2 mt-2">
        <Text className="text-xs text-muted mb-0.5">単価</Text>
        <Text
          className={cn(
            "text-lg font-bold",
            isCheapest ? "text-primary" : "text-foreground"
          )}
          style={{
            color: isCheapest ? colors.primary : colors.foreground,
          }}
        >
          {pricePerGram === 0 ? "—" : pricePerGram.toFixed(2)}
        </Text>
        <Text className="text-xs text-muted">円/g</Text>
      </View>
    </View>
  );
}

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
        "rounded-lg p-2.5 border w-32",
        isCheapest ? "bg-primary/10 border-primary" : "bg-surface border-border"
      )}
      style={{
        backgroundColor: isCheapest ? `${colors.primary}15` : colors.surface,
        borderColor: isCheapest ? colors.primary : colors.border,
      }}
    >
      {/* ヘッダー：商品名と削除ボタン */}
      <View className="flex-row items-center justify-between mb-1.5">
        <Pressable
          onPress={() => {
            triggerLightHaptic();
            onEditLabel?.();
            labelInputRef.current?.focus();
          }}
          className="flex-row items-center gap-0.5 flex-1"
        >
          {isEditing ? (
            <TextInput
              ref={labelInputRef}
              value={label}
              onChangeText={onLabelChange}
              placeholder="名前"
              placeholderTextColor={colors.muted}
              className="text-xs font-semibold text-foreground px-1.5 py-0.5 border border-primary rounded flex-1"
              style={{ color: colors.foreground, borderColor: colors.primary }}
              maxLength={8}
            />
          ) : (
            <>
              <Text className="text-sm font-semibold text-foreground">
                {label}
              </Text>
              <MaterialIcons
                name="edit"
                size={12}
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
            className="p-0.5"
          >
            <MaterialIcons
              name="delete-outline"
              size={14}
              color={colors.error}
            />
          </Pressable>
        )}

        {/* 最安アイコン */}
        {isCheapest && (
          <Text className="text-base ml-0.5">👑</Text>
        )}
      </View>

      {/* 入力フィールド */}
      <View className="gap-1">
        {/* 価格入力 */}
        <TextInput
          ref={priceInputRef}
          className="border border-border rounded px-1.5 py-1 text-foreground text-xs"
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
          className="border border-border rounded px-1.5 py-1 text-foreground text-xs"
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
      <View className="border-t border-border pt-1 mt-1">
        <Text className="text-xs text-muted mb-0.5">単価</Text>
        <Text
          className={cn(
            "text-base font-bold leading-tight",
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

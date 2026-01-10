import { View, TextInput, Pressable, Text, Platform } from "react-native";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { cn, normalizeNumericInput, normalizeNumericInputText } from "@/lib/utils";
import { useColors } from "@/hooks/use-colors";
import { triggerLightHaptic } from "@/lib/haptics";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export interface ProductCardProps {
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
  priceInputRef?: React.RefObject<TextInput | null>;
  weightInputRef?: React.RefObject<TextInput | null>;
}

export function ProductCard({
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
}: ProductCardProps) {
  const colors = useColors();
  const labelInputRef = useRef<TextInput>(null);
  
  // 入力テキストを文字列として保持（小数点入力中も保持）
  const [priceText, setPriceText] = useState<string>(price === 0 ? "" : price.toString());
  const [weightText, setWeightText] = useState<string>(weight === 0 ? "" : weight.toString());
  
  // フォーカス状態を管理
  const [isPriceFocused, setIsPriceFocused] = useState(false);
  const [isWeightFocused, setIsWeightFocused] = useState(false);
  
  // requestAnimationFrame IDを追跡するrefs
  const priceRafIdRef = useRef<number | null>(null);
  const weightRafIdRef = useRef<number | null>(null);
  
  // price/weightが外部から変更された場合（クリア時など）にテキストを更新
  useEffect(() => {
    if (price === 0) {
      setPriceText("");
    } else {
      const currentPrice = parseFloat(priceText) || 0;
      // 外部から変更された場合のみ更新（入力中の場合は更新しない）
      // 許容誤差を考慮して比較
      if (Math.abs(currentPrice - price) > 0.0001) {
        setPriceText(price.toString());
      }
    }
    // priceTextは依存配列に含めない（無限ループを防ぐ）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price]);
  
  useEffect(() => {
    if (weight === 0) {
      setWeightText("");
    } else {
      const currentWeight = parseFloat(weightText) || 0;
      // 外部から変更された場合のみ更新（入力中の場合は更新しない）
      // 許容誤差を考慮して比較
      if (Math.abs(currentWeight - weight) > 0.0001) {
        setWeightText(weight.toString());
      }
    }
    // weightTextは依存配列に含めない（無限ループを防ぐ）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weight]);
  
  const handlePriceSubmit = () => {
    if (weightInputRef?.current) {
      weightInputRef.current.focus();
    }
  };
  
  const handleWeightSubmit = () => {
    if (weightInputRef?.current) {
      weightInputRef.current.blur();
    }
  };
  
  const handlePriceTextChange = (text: string) => {
    const normalizedText = normalizeNumericInputText(text);
    setPriceText(normalizedText);
    const num = normalizeNumericInput(normalizedText);
    onPriceChange(num);
  };
  
  const handleWeightTextChange = (text: string) => {
    const normalizedText = normalizeNumericInputText(text);
    setWeightText(normalizedText);
    const num = normalizeNumericInput(normalizedText);
    onWeightChange(num);
  };

  // requestAnimationFrameのクリーンアップ
  useEffect(() => {
    return () => {
      if (priceRafIdRef.current !== null) {
        cancelAnimationFrame(priceRafIdRef.current);
        priceRafIdRef.current = null;
      }
      if (weightRafIdRef.current !== null) {
        cancelAnimationFrame(weightRafIdRef.current);
        weightRafIdRef.current = null;
      }
    };
  }, []);

  // フォーカスハンドラーを最適化（useCallbackでメモ化）
  const handlePriceFocus = useCallback(() => {
    setIsPriceFocused(true);
  }, []);

  const handlePriceBlur = useCallback(() => {
    setIsPriceFocused(false);
  }, []);

  const handleWeightFocus = useCallback(() => {
    setIsWeightFocused(true);
  }, []);

  const handleWeightBlur = useCallback(() => {
    setIsWeightFocused(false);
  }, []);

  // タップ時にrequestAnimationFrameでフォーカスをスケジュール
  // フォーカス状態はTextInputのonFocus/onBlurハンドラーで管理
  const handlePriceContainerPress = useCallback(() => {
    // 既存のRAFをキャンセル
    if (priceRafIdRef.current !== null) {
      cancelAnimationFrame(priceRafIdRef.current);
    }
    // 次フレームでTextInputにフォーカスを当てる
    priceRafIdRef.current = requestAnimationFrame(() => {
      priceInputRef?.current?.focus();
      priceRafIdRef.current = null;
    });
  }, [priceInputRef]);

  const handleWeightContainerPress = useCallback(() => {
    // 既存のRAFをキャンセル
    if (weightRafIdRef.current !== null) {
      cancelAnimationFrame(weightRafIdRef.current);
    }
    // 次フレームでTextInputにフォーカスを当てる
    weightRafIdRef.current = requestAnimationFrame(() => {
      weightInputRef?.current?.focus();
      weightRafIdRef.current = null;
    });
  }, [weightInputRef]);

  // スタイル定数を定義
  const cardBackgroundColor = isCheapest ? `${colors.primary}15` : colors.surface;
  const cardBorderColor = isCheapest ? colors.primary : colors.border;
  const cardClassName = cn(
    "rounded-2xl p-4 border-2",
    isCheapest ? "bg-primary/10 border-primary" : "bg-surface border-border"
  );

  // シャドウスタイルを定義
  const shadowStyle = Platform.OS === "web"
    ? {
        boxShadow: isCheapest
          ? `0 2px 6px ${colors.primary}33`
          : `0 2px 6px ${colors.border}1A`,
      }
    : {
        shadowColor: isCheapest ? colors.primary : colors.border,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isCheapest ? 0.2 : 0.1,
        shadowRadius: 6,
        elevation: isCheapest ? 4 : 2,
      };

  // 入力フィールドのスタイル（メモ化で最適化）
  const inputTextStyle = useMemo(
    () => ({
      flex: 1,
      color: colors.foreground,
      fontSize: 14,
      fontWeight: "500" as const,
      paddingVertical: 10,
      paddingLeft: 12,
      paddingRight: 8,
    }),
    [colors.foreground]
  );

  // Webでのフォーカス時のアウトラインを削除
  const webInputStyle = useMemo(
    () =>
      Platform.OS === "web"
        ? ({
            outlineStyle: "none" as const,
            outlineWidth: 0,
            outlineColor: "transparent",
          } as unknown as React.ComponentProps<typeof TextInput>["style"])
        : {},
    []
  );

  // 入力フィールドの行スタイル
  const inputRowStyle = useMemo(
    () => ({
      flexDirection: "row" as const,
      alignItems: "center" as const,
      flex: 1,
    }),
    []
  );

  // フォーカス状態に応じたスタイルを事前計算（メモ化）
  const priceContainerStyle = useMemo(
    () => ({
      flexDirection: "row" as const,
      alignItems: "center" as const,
      borderWidth: 2,
      borderColor: isPriceFocused ? colors.primary : colors.border,
      borderRadius: 12,
      backgroundColor: colors.background,
    }),
    [isPriceFocused, colors.primary, colors.border, colors.background]
  );

  const weightContainerStyle = useMemo(
    () => ({
      flexDirection: "row" as const,
      alignItems: "center" as const,
      borderWidth: 2,
      borderColor: isWeightFocused ? colors.primary : colors.border,
      borderRadius: 12,
      backgroundColor: colors.background,
    }),
    [isWeightFocused, colors.primary, colors.border, colors.background]
  );

  const priceUnitStyle = useMemo(
    () => ({
      color: isPriceFocused ? colors.primary : colors.muted,
      fontSize: 14,
      fontWeight: "500" as const,
      paddingRight: 12,
    }),
    [isPriceFocused, colors.primary, colors.muted]
  );

  const weightUnitStyle = useMemo(
    () => ({
      color: isWeightFocused ? colors.primary : colors.muted,
      fontSize: 14,
      fontWeight: "500" as const,
      paddingRight: 12,
    }),
    [isWeightFocused, colors.primary, colors.muted]
  );

  return (
    <View
      className={cardClassName}
      style={{
        width: "100%",
        backgroundColor: cardBackgroundColor,
        borderColor: cardBorderColor,
        ...shadowStyle,
      }}
    >
      {/* 商品名ヘッダー */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2 flex-1">
          {isCheapest && (
            <Text className="text-xl">👑</Text>
          )}
          {isEditing ? (
            <TextInput
              ref={labelInputRef}
              value={label}
              onChangeText={onLabelChange}
              placeholder="名前"
              placeholderTextColor={colors.muted}
              className="text-sm font-semibold text-foreground px-2 py-1 border border-primary rounded flex-1"
              style={{ color: colors.foreground, borderColor: colors.primary }}
              maxLength={8}
            />
          ) : (
            <>
              <Text className="text-base font-semibold text-foreground">
                {label}
              </Text>
              <Pressable
                onPress={() => {
                  triggerLightHaptic();
                  onEditLabel?.();
                  labelInputRef.current?.focus();
                }}
              >
                <MaterialIcons
                  name="edit"
                  size={16}
                  color={colors.muted}
                />
              </Pressable>
            </>
          )}
        </View>

        {showRemove && onRemove && (
          <Pressable
            onPress={() => {
              // ハプティックはhandleRemoveProduct内で実行されるため、ここでは呼ばない
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
      </View>

      {/* 入力フィールドセクション */}
      <View className="gap-2">
        {/* 金額入力フィールド */}
        <Pressable
          style={priceContainerStyle}
          onPress={handlePriceContainerPress}
        >
          <View style={inputRowStyle}>
            <TextInput
              ref={priceInputRef}
              placeholder="金額"
              placeholderTextColor={colors.muted}
              keyboardType="decimal-pad"
              value={priceText}
              onChangeText={handlePriceTextChange}
              onFocus={handlePriceFocus}
              onBlur={handlePriceBlur}
              returnKeyType="next"
              onSubmitEditing={handlePriceSubmit}
              style={[inputTextStyle, webInputStyle]}
              underlineColorAndroid="transparent"
              selectionColor={colors.primary}
            />
            <Text style={priceUnitStyle}>円</Text>
          </View>
        </Pressable>

        {/* 内容量入力フィールド */}
        <Pressable
          style={weightContainerStyle}
          onPress={handleWeightContainerPress}
        >
          <View style={inputRowStyle}>
            <TextInput
              ref={weightInputRef}
              placeholder="内容量"
              placeholderTextColor={colors.muted}
              keyboardType="decimal-pad"
              value={weightText}
              onChangeText={handleWeightTextChange}
              onFocus={handleWeightFocus}
              onBlur={handleWeightBlur}
              returnKeyType="done"
              onSubmitEditing={handleWeightSubmit}
              style={[inputTextStyle, webInputStyle]}
              underlineColorAndroid="transparent"
              selectionColor={colors.primary}
            />
            <Text style={weightUnitStyle}>g</Text>
          </View>
        </Pressable>
      </View>

      {/* 計算結果セクション */}
      <View className="border-t-2 border-border pt-3 mt-3">
        <Text className="text-xs font-semibold text-muted mb-2">単価</Text>
        <View className="flex-row items-baseline gap-1">
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
    </View>
  );
}

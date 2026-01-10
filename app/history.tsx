import { ScrollView, View, Text, Pressable, FlatList } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useHistory, type HistoryEntry } from "@/lib/history-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { triggerLightHaptic } from "@/lib/haptics";

export default function HistoryScreen() {
  const colors = useColors();
  const router = useRouter();
  const { history, deleteEntry } = useHistory();
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);

  // 履歴を削除
  const handleDelete = async (id: string) => {
    triggerLightHaptic();
    await deleteEntry(id);
    setSelectedEntry(null);
  };

  // 日時をフォーマット
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${month}/${day} ${hours}:${minutes}`;
  };

  // 履歴から復元して計算画面に遷移
  const handleRestoreAndNavigate = (entry: HistoryEntry) => {
    triggerLightHaptic();
    // 履歴データを一時保存してから計算画面に遷移
    router.push({
      pathname: "/(tabs)",
      params: {
        restore: JSON.stringify(entry),
      },
    } as any);
  };

  if (selectedEntry) {
    return (
      <ScreenContainer className="bg-background">
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
          <Pressable
            onPress={() => {
              triggerLightHaptic();
              setSelectedEntry(null);
            }}
            className="px-3 py-2"
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={colors.primary}
            />
          </Pressable>
          <Text className="text-xl font-bold text-foreground flex-1 ml-2">
            {selectedEntry.title || "計算結果"}
          </Text>
          <View className="w-10" />
        </View>

        {/* 詳細内容 */}
        <ScrollView className="px-4 py-4" showsVerticalScrollIndicator={false}>
          <Text className="text-xs text-muted mb-4">
            {formatDate(selectedEntry.timestamp)}
          </Text>

          {/* 商品一覧 */}
          <View className="gap-3 mb-6">
            {selectedEntry.products.map((product, index) => (
              <View
                key={index}
                className="rounded-lg p-4 bg-surface border border-border"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-lg font-semibold text-foreground">
                    商品 {product.label}
                  </Text>
                  {product.label === selectedEntry.cheapestLabel && (
                    <Text className="text-xl">👑</Text>
                  )}
                </View>
                <Text className="text-sm text-muted mb-2">
                  {product.price}円 / {product.weight}g
                </Text>
                <Text
                  className="text-xl font-bold"
                  style={{
                    color:
                      product.label === selectedEntry.cheapestLabel
                        ? colors.primary
                        : colors.foreground,
                  }}
                >
                  {product.pricePerGram.toFixed(2)}円/g
                </Text>
              </View>
            ))}
          </View>

          {/* アクションボタン */}
          <View className="gap-3">
            {/* 復元ボタン */}
            <Pressable
              onPress={() => handleRestoreAndNavigate(selectedEntry)}
              className="py-3 px-4 rounded-lg items-center flex-row justify-center gap-2"
              style={({ pressed }) => ({
                backgroundColor: colors.primary,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <MaterialIcons
                name="restore"
                size={18}
                color="white"
              />
              <Text className="text-white font-semibold">
                この結果を復元
              </Text>
            </Pressable>

            {/* 削除ボタン */}
            <Pressable
              onPress={() => handleDelete(selectedEntry.id)}
              className="py-3 px-4 rounded-lg items-center flex-row justify-center gap-2 bg-error/10"
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <MaterialIcons
                name="delete-outline"
                size={18}
                color={colors.error}
              />
              <Text className="text-error font-semibold">
                削除
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      {/* ヘッダー */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
        <Text className="text-xl font-bold text-foreground">
          履歴
        </Text>
        <Pressable
          onPress={() => {
            triggerLightHaptic();
            router.back();
          }}
          className="px-3 py-2"
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <MaterialIcons
            name="close"
            size={24}
            color={colors.muted}
          />
        </Pressable>
      </View>

      {/* 履歴リスト */}
      {history.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <MaterialIcons
            name="history"
            size={48}
            color={colors.muted}
          />
          <Text className="text-lg text-muted text-center mt-4">
            まだ履歴がありません
          </Text>
          <Text className="text-sm text-muted text-center mt-2">
            計算結果を保存するとここに表示されます
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedEntry(item)}
              className="px-4 py-3 border-b border-border flex-row items-center justify-between"
              style={({ pressed }) => ({
                backgroundColor: pressed ? `${colors.primary}05` : "transparent",
              })}
            >
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">
                  {item.title || "計算結果"}
                </Text>
                <Text className="text-xs text-muted mt-1">
                  {formatDate(item.timestamp)}
                </Text>
                <Text className="text-sm text-primary font-semibold mt-1">
                  最安: {item.cheapestLabel} (
                  {
                    item.products.find((p) => p.label === item.cheapestLabel)
                      ?.pricePerGram.toFixed(2)
                  }
                  円/g)
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={colors.muted}
              />
            </Pressable>
          )}
          contentContainerStyle={{ flexGrow: 1 }}
          scrollEnabled={true}
        />
      )}
    </ScreenContainer>
  );
}

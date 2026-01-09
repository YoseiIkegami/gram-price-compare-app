import { ScrollView, View, Text, Pressable, Linking } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function AboutScreen() {
  const colors = useColors();

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        {/* ロゴ・タイトル */}
        <View className="items-center py-8">
          <Text className="text-4xl mb-4">💰</Text>
          <Text className="text-2xl font-bold text-foreground">
            グラム単価比較
          </Text>
          <Text className="text-sm text-muted mt-2">
            v1.0.0
          </Text>
        </View>

        {/* 説明 */}
        <View className="bg-surface rounded-2xl p-4 mb-6 border border-border">
          <Text className="text-base text-foreground leading-relaxed">
            スーパーやコンビニで一瞬でどれが一番お得か分かる、超軽量グラム単価比較アプリです。
          </Text>
          <Text className="text-base text-foreground leading-relaxed mt-3">
            複数の商品の価格と内容量を入力するだけで、自動的にグラム単価を計算し、最安商品を視覚的に強調表示します。
          </Text>
        </View>

        {/* 使い方 */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            使い方
          </Text>
          <View className="gap-3">
            {/* ステップ1 */}
            <View className="flex-row gap-3">
              <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-background font-bold">1</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">
                  商品を入力
                </Text>
                <Text className="text-sm text-muted mt-1">
                  商品の価格と内容量を入力します
                </Text>
              </View>
            </View>

            {/* ステップ2 */}
            <View className="flex-row gap-3">
              <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-background font-bold">2</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">
                  自動計算
                </Text>
                <Text className="text-sm text-muted mt-1">
                  グラム単価が自動的に計算されます
                </Text>
              </View>
            </View>

            {/* ステップ3 */}
            <View className="flex-row gap-3">
              <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-background font-bold">3</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">
                  最安を確認
                </Text>
                <Text className="text-sm text-muted mt-1">
                  最安商品が👑で強調表示されます
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 機能 */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            機能
          </Text>
          <View className="gap-2">
            <View className="flex-row gap-2">
              <Text className="text-foreground">✓</Text>
              <Text className="flex-1 text-foreground">
                複数商品の比較（最大4つまで）
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Text className="text-foreground">✓</Text>
              <Text className="flex-1 text-foreground">
                計算結果の履歴保存
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Text className="text-foreground">✓</Text>
              <Text className="flex-1 text-foreground">
                ダークモード対応
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Text className="text-foreground">✓</Text>
              <Text className="flex-1 text-foreground">
                オフライン完全対応
              </Text>
            </View>
          </View>
        </View>

        {/* スペーサー */}
        <View className="flex-1" />

        {/* 寄付セクション */}
        <View className="bg-primary/10 rounded-2xl p-4 mb-4 border border-primary">
          <Text className="text-base font-semibold text-foreground mb-2">
            このアプリを気に入りましたか？
          </Text>
          <Text className="text-sm text-muted mb-4">
            継続的な開発をサポートしていただけると幸いです
          </Text>
          <Pressable
            onPress={() =>
              openLink("https://buymeacoffee.com")
            }
            className="py-3 px-4 rounded-lg items-center"
            style={({ pressed }) => ({
              backgroundColor: colors.primary,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text className="text-background font-semibold">
              ☕ Buy Me a Coffee
            </Text>
          </Pressable>
        </View>

        {/* フッター */}
        <View className="items-center py-4 border-t border-border">
          <Text className="text-xs text-muted">
            © 2024 グラム単価比較アプリ
          </Text>
          <Text className="text-xs text-muted mt-2">
            Made with ❤️ for smart shopping
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

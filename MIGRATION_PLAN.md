# React Native Web → 純粋なReactへの移行計画

## 目的

Webアプリのみになったため、React Native Webを削除し、純粋なReactで書き直すことで：
- React error #418を解消
- よりシンプルで保守しやすいコード
- パフォーマンスの向上
- ビルドサイズの削減

## 移行内容

### 1. ビルドツールの変更
- **現在**: Expo + Metro Bundler
- **変更後**: Vite（高速でシンプル）

### 2. ルーティングの変更
- **現在**: Expo Router
- **変更後**: React Router またはシンプルなSPA（タブ切り替え）

### 3. コンポーネントの置き換え
- `View` → `div`
- `Text` → `span` / `p`
- `ScrollView` → `div` with `overflow-y-auto`
- `Pressable` → `button` / `div` with `onClick`
- `TextInput` → `input`
- `SafeAreaView` → `div` with CSS `env(safe-area-inset-*)`

### 4. 削除する依存関係
- `react-native` 関連すべて
- `expo-router`
- `@react-navigation/*`
- `react-native-safe-area-context`
- `react-native-gesture-handler`
- `react-native-reanimated`
- `react-native-web`
- `nativewind`（Tailwind CSSのみ使用）

### 5. 保持する機能
- 計算ロジック（`lib/calculator.ts`）
- テーマシステム（Tailwind CSSで再実装）
- ローカルストレージ（`localStorage` API）

## 新しいプロジェクト構造

```
gram-price-compare-app/
├── src/
│   ├── App.tsx              # メインアプリコンポーネント
│   ├── pages/
│   │   ├── Calculator.tsx    # 計算画面
│   │   └── About.tsx         # About画面
│   ├── components/
│   │   └── ProductCard.tsx   # 商品カード
│   ├── lib/
│   │   ├── calculator.ts    # 計算ロジック（変更なし）
│   │   └── storage.ts        # localStorageラッパー
│   └── styles/
│       └── index.css         # Tailwind CSS
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

## 移行手順

1. Viteプロジェクトのセットアップ
2. 既存の計算ロジックを移行
3. コンポーネントをHTML要素に置き換え
4. スタイリングをTailwind CSSで再実装
5. ルーティングを実装
6. ビルド設定を更新
7. Vercelデプロイ設定を更新

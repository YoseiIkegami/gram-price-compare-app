# API仕様書

## 1. 概要

本ドキュメントは「どち得？ グラム単価比較アプリ」のAPI仕様を定義します。

**注意**: 現在、本アプリはフロントエンドのみのアプリケーションであり、バックエンドAPIは存在しません。本ドキュメントは、将来の拡張を想定した仕様を定義しています。

## 2. アーキテクチャ

### 2.1 現在の実装

- **アーキテクチャ**: クライアントサイドのみ（SPA）
- **データ保存**: ローカルストレージ（将来の拡張）
- **API**: なし

### 2.2 将来の拡張予定

- **バックエンドAPI**: RESTful API
- **認証**: JWT（将来の拡張）
- **データベース**: PostgreSQL（将来の拡張）

## 3. 内部API（ライブラリ関数）

### 3.1 計算API

#### 3.1.1 `calculatePricePerGram`

**説明**: グラム単価を計算します。

**定義**:
```typescript
function calculatePricePerGram(price: number, weight: number): number
```

**パラメータ**:
- `price` (number): 価格（円）
- `weight` (number): 内容量（g）

**戻り値**:
- `number`: グラム単価（円/g）、小数第2位まで

**例**:
```typescript
const pricePerGram = calculatePricePerGram(100, 200);
// 戻り値: 0.5
```

**実装ファイル**: `src/lib/calculator.ts`

---

#### 3.1.2 `compareProducts`

**説明**: 複数商品を比較し、最安商品を特定します。

**定義**:
```typescript
function compareProducts(
  products: Product[],
  tolerance?: number
): ComparisonResult
```

**パラメータ**:
- `products` (Product[]): 商品配列
- `tolerance` (number, オプション): 価格比較の許容誤差（デフォルト: 0.01）

**戻り値**:
```typescript
interface ComparisonResult {
  products: Product[];
  cheapestIndex: number | null;
  cheapestIndexes: number[];
}
```

**例**:
```typescript
const products: Product[] = [
  { label: '商品1', index: 1, price: 100, weight: 200, pricePerGram: 0.5 },
  { label: '商品2', index: 2, price: 150, weight: 300, pricePerGram: 0.5 },
];
const result = compareProducts(products);
// 戻り値: { products, cheapestIndex: 1, cheapestIndexes: [1, 2] }
```

**実装ファイル**: `src/lib/calculator.ts`

---

#### 3.1.3 `findCheapest`

**説明**: 最安商品のindexを取得します（最初の一つ）。

**定義**:
```typescript
function findCheapest(products: Product[]): number | null
```

**パラメータ**:
- `products` (Product[]): 商品配列

**戻り値**:
- `number | null`: 最安商品のindex、存在しない場合はnull

**実装ファイル**: `src/lib/calculator.ts`

---

#### 3.1.4 `findCheapestIndexes`

**説明**: すべての最安商品のindexを取得します（同率も含む）。

**定義**:
```typescript
function findCheapestIndexes(
  products: Product[],
  tolerance?: number
): number[]
```

**パラメータ**:
- `products` (Product[]): 商品配列
- `tolerance` (number, オプション): 価格比較の許容誤差（デフォルト: 0.01）

**戻り値**:
- `number[]`: すべての最安商品のindexの配列

**実装ファイル**: `src/lib/calculator.ts`

---

## 4. 将来の拡張: RESTful API

### 4.1 ベースURL

```
https://api.example.com/v1
```

### 4.2 認証

**方式**: JWT（JSON Web Token）

**ヘッダー**:
```
Authorization: Bearer <token>
```

---

### 4.3 エンドポイント一覧

#### 4.3.1 履歴の取得

**エンドポイント**: `GET /history`

**説明**: ユーザーの計算履歴を取得します。

**認証**: 必須

**レスポンス**:
```json
{
  "data": [
    {
      "id": "uuid",
      "timestamp": 1234567890,
      "products": [
        {
          "label": "商品1",
          "price": 100,
          "weight": 200,
          "pricePerGram": 0.5
        }
      ],
      "cheapestIndex": 1
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "perPage": 20
  }
}
```

**ステータスコード**:
- `200`: 成功
- `401`: 認証エラー
- `500`: サーバーエラー

---

#### 4.3.2 履歴の保存

**エンドポイント**: `POST /history`

**説明**: 計算結果を履歴として保存します。

**認証**: 必須

**リクエストボディ**:
```json
{
  "products": [
    {
      "label": "商品1",
      "price": 100,
      "weight": 200,
      "pricePerGram": 0.5
    }
  ],
  "cheapestIndex": 1
}
```

**レスポンス**:
```json
{
  "data": {
    "id": "uuid",
    "timestamp": 1234567890,
    "products": [...],
    "cheapestIndex": 1
  }
}
```

**ステータスコード**:
- `201`: 作成成功
- `400`: リクエストエラー
- `401`: 認証エラー
- `500`: サーバーエラー

---

#### 4.3.3 履歴の削除

**エンドポイント**: `DELETE /history/:id`

**説明**: 指定した履歴を削除します。

**認証**: 必須

**パスパラメータ**:
- `id` (string): 履歴ID

**レスポンス**:
```json
{
  "message": "履歴を削除しました"
}
```

**ステータスコード**:
- `200`: 削除成功
- `404`: 履歴が見つからない
- `401`: 認証エラー
- `500`: サーバーエラー

---

### 4.4 エラーレスポンス

**形式**:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": {}
  }
}
```

**エラーコード一覧**:
- `VALIDATION_ERROR`: バリデーションエラー
- `AUTHENTICATION_ERROR`: 認証エラー
- `AUTHORIZATION_ERROR`: 認可エラー
- `NOT_FOUND`: リソースが見つからない
- `INTERNAL_SERVER_ERROR`: サーバーエラー

---

## 5. データ型定義

### 5.1 Product

```typescript
interface Product {
  label: string;
  index: number;
  price: number;
  weight: number;
  pricePerGram: number;
}
```

### 5.2 ComparisonResult

```typescript
interface ComparisonResult {
  products: Product[];
  cheapestIndex: number | null;
  cheapestIndexes: number[];
}
```

### 5.3 HistoryItem（将来の拡張）

```typescript
interface HistoryItem {
  id: string;
  userId: string;
  timestamp: number;
  products: Product[];
  cheapestIndex: number | null;
}
```

---

## 6. ローカルストレージAPI（将来の拡張）

### 6.1 履歴の保存

**キー**: `gram-price-compare-history`

**値**: `HistoryItem[]`（JSON文字列）

**例**:
```typescript
const history: HistoryItem[] = [
  {
    id: 'uuid',
    timestamp: 1234567890,
    products: [...],
    cheapestIndex: 1,
  },
];
localStorage.setItem('gram-price-compare-history', JSON.stringify(history));
```

---

### 6.2 履歴の取得

**例**:
```typescript
const historyJson = localStorage.getItem('gram-price-compare-history');
const history: HistoryItem[] = historyJson ? JSON.parse(historyJson) : [];
```

---

### 6.3 履歴の削除

**例**:
```typescript
localStorage.removeItem('gram-price-compare-history');
```

---

## 7. バージョニング

### 7.1 APIバージョン

- **現在**: v1（未実装）
- **将来**: v2, v3...

### 7.2 互換性

- **後方互換性**: 維持（可能な限り）
- **非推奨**: 1バージョン前の警告

---

## 8. レート制限（将来の拡張）

### 8.1 制限

- **リクエスト数**: 100リクエスト/分
- **バースト**: 10リクエスト/秒

### 8.2 レスポンスヘッダー

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

---

## 9. セキュリティ

### 9.1 HTTPS

- **必須**: すべてのAPIリクエストはHTTPSを使用

### 9.2 CORS

- **許可オリジン**: アプリのドメインのみ
- **メソッド**: GET, POST, DELETE
- **ヘッダー**: Authorization, Content-Type

### 9.3 入力検証

- **必須**: すべての入力値を検証
- **型チェック**: TypeScriptの型定義に準拠

---

## 10. ドキュメント

### 10.1 APIドキュメント

- **形式**: OpenAPI 3.0（Swagger）
- **場所**: `/api-docs`（将来の拡張）

### 10.2 サンプルコード

- **言語**: TypeScript, JavaScript
- **場所**: APIドキュメント内

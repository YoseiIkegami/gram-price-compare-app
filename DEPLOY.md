# Webアプリとして公開する方法

> **方針:** ネイティブアプリ（iOS/Android）のリリースは複雑で時間がかかるため、**Webアプリとして公開することを優先**します。
> ユーザーはブラウザからすぐにアクセスでき、更新も即座に反映されます。

## 方法1: ローカルで開発サーバーを起動

```bash
pnpm dev
```

ブラウザで `http://localhost:8081` にアクセスします。

## 方法2: 静的サイトとしてビルド

### ビルドコマンド

```bash
pnpm build:web
```

これで `dist/` ディレクトリに静的ファイルが生成されます。

### デプロイ方法

#### GitHub Pages（自動デプロイ）

1. GitHubリポジトリのSettings → Pages
2. Source を "GitHub Actions" に設定
3. `main` ブランチにプッシュすると自動的にデプロイされます

`.github/workflows/deploy.yml` が既に設定されているので、プッシュするだけで自動デプロイされます。

#### Vercel

詳細な手順は [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) を参照してください。

**クイックスタート:**
1. [Vercel](https://vercel.com) にGitHubアカウントでログイン
2. **Add New...** → **Project** をクリック
3. GitHubリポジトリ **gram-price-compare-app** を選択
4. **Import** をクリック
5. ビルド設定を確認（自動検出されます）:
   - Build Command: `pnpm build:web`
   - Output Directory: `dist`
6. **Deploy** をクリック

`vercel.json` が設定済みなので、自動的に最適な設定が適用されます。

#### Netlify

1. [Netlify](https://www.netlify.com) にサインアップ
2. GitHubリポジトリを接続
3. Build command: `pnpm build:web`
4. Publish directory: `dist`
5. Deploy

#### 手動デプロイ

```bash
# ビルド
pnpm build:web

# distディレクトリの内容を任意のWebサーバーにアップロード
```

## 方法3: Expoのホスティングサービス

Expoの公式ホスティングサービス（有料）も利用できます。

```bash
npx expo publish
```

## 注意事項

- ビルド前に `pnpm install` を実行してください
- 本番環境では環境変数が必要な場合は設定してください
- 静的サイトとしてビルドする場合、一部のExpo機能（カメラ、位置情報など）は動作しない可能性があります

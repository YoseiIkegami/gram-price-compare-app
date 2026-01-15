# Vercelへのデプロイ手順

このドキュメントでは、VercelにWebアプリをデプロイする手順を説明します。

## 📋 前提条件

- [x] GitHubリポジトリにコードがプッシュされている
- [x] Vercelアカウント（[https://vercel.com](https://vercel.com)）

## 🚀 デプロイ手順

### 方法1: Vercelダッシュボードからデプロイ（推奨）

#### ステップ1: Vercelにログイン

1. [Vercel](https://vercel.com) にアクセス
2. **Continue with GitHub** をクリックしてGitHubアカウントでログイン

#### ステップ2: プロジェクトをインポート

1. Vercelダッシュボードで **Add New...** → **Project** をクリック
2. GitHubリポジトリ一覧から **gram-price-compare-app** を選択
3. **Import** をクリック

#### ステップ3: ビルド設定を確認

Vercelが自動的に以下の設定を検出します：

- **Framework Preset**: Other
- **Build Command**: `pnpm build:web`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`
- **Root Directory**: `./` (プロジェクトルート)

**確認事項:**
- ✅ Build Command が `pnpm build:web` になっているか
- ✅ Output Directory が `dist` になっているか
- ✅ Install Command が `pnpm install` になっているか

#### ステップ4: 環境変数の設定（必要な場合）

このプロジェクトでは環境変数は不要ですが、将来的に必要になった場合は：

1. **Environment Variables** セクションで追加
2. キーと値を入力
3. **Save** をクリック

#### ステップ5: デプロイ

1. **Deploy** ボタンをクリック
2. ビルドが開始されます（通常1〜3分）
3. ビルドが完了すると、自動的にURLが生成されます

#### ステップ6: カスタムドメインの設定（オプション）

1. プロジェクトの **Settings** → **Domains** を開く
2. カスタムドメインを入力
3. DNS設定に従ってドメインを設定

---

### 方法2: Vercel CLIを使用

#### ステップ1: Vercel CLIをインストール

```bash
pnpm add -g vercel
```

#### ステップ2: ログイン

```bash
vercel login
```

#### ステップ3: デプロイ

```bash
cd gram-price-compare-app
vercel
```

初回デプロイ時は、いくつか質問されます：

- **Set up and deploy?** → `Y`
- **Which scope?** → アカウントを選択
- **Link to existing project?** → `N` (初回)
- **What's your project's name?** → `gram-price-compare-app` または任意の名前
- **In which directory is your code located?** → `./`

#### ステップ4: 本番環境にデプロイ

```bash
vercel --prod
```

---

## 🔄 自動デプロイの設定

### GitHub連携による自動デプロイ

Vercelダッシュボードからプロジェクトをインポートすると、自動的にGitHub連携が設定されます。

**動作:**
- `main` ブランチにプッシュすると、自動的に本番環境にデプロイ
- その他のブランチにプッシュすると、プレビュー環境にデプロイ

### プレビューデプロイ

プルリクエストを作成すると、自動的にプレビューデプロイが作成されます。

---

## ⚙️ ビルド設定のカスタマイズ

### vercel.json

プロジェクトルートに `vercel.json` が作成されています。必要に応じてカスタマイズできます。

```json
{
  "buildCommand": "pnpm build:web",
  "outputDirectory": "dist",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 環境変数

Vercelダッシュボードの **Settings** → **Environment Variables** で設定できます。

---

## 🐛 トラブルシューティング

### ビルドエラーが発生する場合

1. **ログを確認**
   - Vercelダッシュボードの **Deployments** → 失敗したデプロイをクリック
   - **Build Logs** を確認

2. **ローカルでビルドを確認**
   ```bash
   pnpm install
   pnpm build:web
   ```
   - ローカルでビルドが成功するか確認

3. **Node.jsバージョンを確認**
   - Vercelの **Settings** → **General** → **Node.js Version** を確認
   - 推奨: Node.js 20.x

### 404エラーが発生する場合

- `vercel.json` の `rewrites` 設定を確認
- SPA（Single Page Application）の場合は、すべてのルートを `index.html` にリライトする必要があります

### パスの問題

- `app.config.ts` の `baseUrl` が空文字列になっているか確認
- Vercelのルートドメインで公開する場合は `baseUrl: ""` に設定

---

## 📚 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)

---

**最終更新日:** 2026年1月12日

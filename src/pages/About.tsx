export default function About() {
  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 overflow-y-auto px-4 py-4">
        {/* ロゴ・タイトル */}
        <div className="flex flex-col items-center py-8">
          <span className="text-4xl mb-4">💰</span>
          <h1 className="text-2xl font-bold text-foreground">どち得？ グラム単価比較アプリ</h1>
          <p className="text-sm text-muted mt-2">v1.0.0</p>
        </div>

        {/* 説明 */}
        <div className="bg-surface rounded-2xl p-4 mb-6 border border-border">
          <p className="text-base text-foreground leading-relaxed">
            スーパーやコンビニで一瞬でどれが一番お得か分かる、超軽量グラム単価比較アプリです。
          </p>
          <p className="text-base text-foreground leading-relaxed mt-3">
            複数の商品の価格と内容量を入力するだけで、自動的にグラム単価を計算し、最安商品を視覚的に強調表示します。
          </p>
        </div>

        {/* 使い方 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">使い方</h2>
          <div className="space-y-3">
            {/* ステップ1 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-background font-bold">1</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">商品を入力</p>
                <p className="text-sm text-muted mt-1">商品の価格と内容量を入力します</p>
              </div>
            </div>

            {/* ステップ2 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-background font-bold">2</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">自動計算</p>
                <p className="text-sm text-muted mt-1">グラム単価が自動的に計算されます</p>
              </div>
            </div>

            {/* ステップ3 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-background font-bold">3</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">最安を確認</p>
                <p className="text-sm text-muted mt-1">最安商品が👑で強調表示されます</p>
              </div>
            </div>
          </div>
        </div>

        {/* 機能 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">機能</h2>
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="text-foreground">✓</span>
              <p className="flex-1 text-foreground">複数商品の比較（最大4つまで）</p>
            </div>
            <div className="flex gap-2">
              <span className="text-foreground">✓</span>
              <p className="flex-1 text-foreground">リアルタイム計算</p>
            </div>
            <div className="flex gap-2">
              <span className="text-foreground">✓</span>
              <p className="flex-1 text-foreground">オフライン完全対応</p>
            </div>
          </div>
        </div>

        {/* スペーサー */}
        <div className="flex-1" />

        {/* 寄付セクション */}
        <div className="bg-primary/10 rounded-2xl p-4 mb-4 border border-primary">
          <p className="text-base font-semibold text-foreground mb-2">
            このアプリを気に入りましたか？
          </p>
          <p className="text-sm text-muted mb-4">
            継続的な開発をサポートしていただけると幸いです
          </p>
          <button
            onClick={() => openLink('https://buymeacoffee.com/yoseiikegami')}
            className="w-full py-3 px-4 rounded-lg bg-primary text-background font-semibold transition-opacity hover:opacity-80 active:opacity-70"
          >
            ☕ Buy Me a Coffee
          </button>
        </div>

        {/* フッター */}
        <div className="flex flex-col items-center py-4 border-t border-border">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} どち得？ グラム単価比較アプリ
          </p>
          <p className="text-xs text-muted mt-2">Made by YoseiIkegami</p>
        </div>
      </main>
    </div>
  );
}

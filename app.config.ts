// Load environment variables with proper priority (system > .env)
import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

const env = {
  // App branding - update these values directly (do not use env vars)
  appName: "どち得？ グラム単価比較アプリ",
  appSlug: "gram-price-compare-app",
  // S3 URL of the app logo - set this to the URL returned by generate_image when creating custom logo
  // Leave empty to use the default icon from assets/images/icon.png
  logoUrl: "",
};

const config: ExpoConfig = {
  name: env.appName,
  slug: env.appSlug,
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  web: {
    bundler: "metro",
    output: "static",
    // Vercelでルートドメインとして公開する場合は baseUrl を空文字列に
    // GitHub Pagesで公開する場合は "/gram-price-compare-app" に設定
    baseUrl: "",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-asset",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#F9FAFB",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;

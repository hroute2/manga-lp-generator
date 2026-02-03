# 漫画LP Generator 📚✨

商品情報を入力するだけで、AIが4コマ漫画形式のランディングページを自動生成するツールです。

![漫画LP Generator](https://via.placeholder.com/800x400/18181b/f59e0b?text=漫画LP+Generator)

## 🌟 特徴

- **🚀 瞬時に生成** - 商品情報を入力するだけで数秒でLPが完成
- **🎨 自由なスタイル** - コメディ、シリアス、ほのぼの、熱血など選択可能
- **📥 すぐに使える** - HTMLでダウンロードしてそのまま使用可能
- **🔄 再生成機能** - 気に入らないコマだけ再生成可能

## 🛠️ 技術スタック

- **Frontend**: Next.js 15 + React + TypeScript
- **Styling**: Tailwind CSS
- **AI (テキスト)**: Google Gemini API
- **AI (画像)**: Nano Banana Pro API
- **Hosting**: Vercel

## 📦 セットアップ

### 1. リポジトリのクローン

```bash
git clone <your-repo-url>
cd manga-lp-generator
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、以下の内容を追加：

```env
# Gemini API Key (Google AI Studio から取得)
# https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Nano Banana Pro API Key
# https://nano-banana-pro.com または公式サイトから取得
NANO_BANANA_API_KEY=your_nano_banana_api_key_here

# Nano Banana API Base URL (必要に応じて変更)
NANO_BANANA_API_URL=https://api.nanobanana.io/v1
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 🚀 Vercel へのデプロイ

### 1. GitHub にプッシュ

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Vercel でプロジェクトをインポート

1. [Vercel](https://vercel.com) にログイン
2. "New Project" をクリック
3. GitHub リポジトリを選択
4. Environment Variables に以下を追加：
   - `GEMINI_API_KEY`
   - `NANO_BANANA_API_KEY`
   - `NANO_BANANA_API_URL`
5. "Deploy" をクリック

## 📖 使い方

### Step 1: 商品情報を入力

- 商品・サービス名
- 商品の説明
- ターゲット顧客
- 顧客が抱える課題
- 解決策・ベネフィット

### Step 2: 漫画スタイルを選択

- 🤣 コメディ - 笑いを交えて楽しく
- 😤 シリアス - 真剣に問題提起
- 🥰 ほのぼの - 温かい雰囲気で
- 🔥 熱血 - 情熱的に訴求

### Step 3: 生成 & ダウンロード

「4コマ漫画LPを生成する」ボタンをクリックすると、AIが自動で：

1. Gemini がストーリーとセリフを生成
2. Nano Banana Pro が各コマの画像を生成
3. 完成したLPをプレビュー
4. HTMLファイルでダウンロード

## 📁 プロジェクト構成

```
manga-lp-generator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate-prompts/   # Gemini API 連携
│   │   │   └── generate-manga/     # Nano Banana API 連携
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── InputForm.tsx           # 入力フォーム
│   │   └── MangaPreview.tsx        # 漫画プレビュー & エクスポート
│   └── types/
│       └── index.ts                # 型定義
├── .env.local                      # 環境変数（要作成）
├── package.json
└── README.md
```

## ⚠️ 注意事項

- **API使用量**: Gemini API と Nano Banana API の利用制限に注意してください
- **著作権**: 生成されたコンテンツの著作権は各APIの利用規約に従います
- **商用利用**: 商用利用する場合は各APIの利用規約を確認してください

## 🔧 Nano Banana API について

Nano Banana Pro APIの仕様は公式ドキュメントを参照してください。
このプロジェクトのAPIエンドポイントは一般的なREST API形式を想定しています。
実際のAPIエンドポイントやパラメータは、Nano Banana Proの公式ドキュメントに合わせて `src/app/api/generate-manga/route.ts` を調整してください。

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

Issue や Pull Request は歓迎します！

---

Made with ❤️ using Next.js, Gemini & Nano Banana Pro

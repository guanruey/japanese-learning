# 日本語学習プラットフォーム

JLPT N5/N4 対応のインタラクティブな日本語学習プラットフォーム

## 機能

- 📝 **文法ブラウザ** - 110+ の文法点を詳細な説明付きで学習
- 📖 **語彙ブラウザ** - N5/N4 の全単語（準備中）
- 💬 **会話フレーズ** - 実用的なフレーズ集（準備中）
- 🔍 **検索・フィルタ機能** - 素早く学習内容を探せる
- 🎯 **会話学習に最適化** - 実践的な使用例を中心に

## 技術スタック

- **フロントエンド**: Vite + React 18
- **データベース**: Supabase
- **デプロイ**: Vercel
- **CSS**: カスタム CSS（フレームワーク不要）

## セットアップ

### 前提条件
- Node.js 16+
- npm または yarn
- Supabase プロジェクト

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/guanruey/japanese-learning.git
cd japanese-learning

# 依存関係をインストール
npm install

# .env ファイルをセットアップ
cp .env.example .env.local
# .env.local を編集して Supabase の認証情報を入力
```

### ローカル実行

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開きます

### ビルド

```bash
npm run build
npm run preview
```

## Supabase セットアップ

### 必要なテーブル

#### 1. grammar テーブル

```sql
create table if not exists public.grammar (
  id text primary key,
  level text not null,
  pattern text not null,
  meaning_en text,
  meaning_zh text,
  casual_variant text,
  formal_variant text,
  example_ja text,
  example_zh text,
  explanation text,
  common_mistakes text[],
  related_patterns text[],
  created_at timestamptz default timezone('utc', now())
);
```

#### 2. vocabulary テーブル（準備中）

```sql
create table if not exists public.vocabulary (
  id text primary key,
  level text not null,
  kanji text,
  reading text not null,
  pos text,
  meaning_zh text,
  meaning_en text,
  example_ja text,
  example_zh text,
  synonyms text[],
  antonyms text[],
  collocations text[],
  conversation_freq text,
  created_at timestamptz default timezone('utc', now())
);
```

#### 3. phrases テーブル（準備中）

```sql
create table if not exists public.phrases (
  id text primary key,
  phrase_ja text not null,
  formal text,
  casual text,
  meaning_zh text,
  meaning_en text,
  context text,
  example text,
  related text[],
  created_at timestamptz default timezone('utc', now())
);
```

## 環境変数

`.env.local` に以下を設定してください：

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## デプロイ（Vercel）

```bash
# vercel CLI をインストール
npm i -g vercel

# デプロイ
vercel

# 環境変数を設定
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

## プロジェクト構造

```
japanese-learning/
├── src/
│   ├── components/
│   │   ├── GrammarBrowser.jsx
│   │   ├── VocabularyBrowser.jsx
│   │   └── PhrasesLibrary.jsx
│   ├── App.jsx
│   ├── supabase.js
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

## ライセンス

MIT

## サポート

問題が発生した場合は、GitHub Issues で報告してください。

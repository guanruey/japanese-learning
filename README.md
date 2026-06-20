# 日本語学習プラットフォーム

JLPT N5/N4 対応のインタラクティブな日本語学習プラットフォーム

## 機能

- 📝 **文法ブラウザ** - 110+ の文法点を詳細な説明付きで学習
- 📖 **語彙ブラウザ** - N5/N4 の語彙を読み方つきで学習
- 💬 **会話フレーズ** - 実用的なフレーズ集を読み方つきで練習
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
  reading text,
  meaning_en text,
  meaning_zh text,
  casual_variant text,
  formal_variant text,
  example_ja text,
  example_reading text,
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
  example_reading text,
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
  reading text,
  formal text,
  casual text,
  meaning_zh text,
  meaning_en text,
  context text,
  example text,
  example_reading text,
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

`supabase/add_reading_columns.sql` を Supabase SQL Editor で実行すると、既存環境に `reading` / `example_reading` を追加できます。
`supabase/seed_phrase_readings.sql` では、現在の会話フレーズ 30 件にふりがなを一括で入れられます。
`supabase/seed_generated_readings.sql` は、文法と語彙の自動生成済み読み方データを Supabase に反映するための SQL です。
`supabase/fix_grammar_example_naturalness.sql` は、人工修正した文法例句 4 筆を正式環境へ反映するための SQL です。

必要なら次のコマンドで読み方データを再生成できます：

```bash
npm run generate:readings
```

このコマンドは以下を更新します：

- `src/data/generatedReadings.js`
- `supabase/seed_generated_readings.sql`

教材の自然さを優先して先に画面表示を守るため、`src/data/grammarOverrides.js` で一部の文法例句を前端側から上書きしています。長期的には同内容を `supabase/fix_grammar_example_naturalness.sql` で DB 側にも反映してください。

画面上部の `読み方` ボタンは `ふりがな` → `ローマ字` → `OFF` の順で切り替わります。

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

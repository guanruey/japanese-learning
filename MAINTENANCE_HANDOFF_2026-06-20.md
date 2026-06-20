# Japanese Learning 維護交接摘要

日期：2026-06-20

## 目前狀態

- 正式站：[https://japanese-learning-weld.vercel.app](https://japanese-learning-weld.vercel.app)
- GitHub：[https://github.com/guanruey/japanese-learning](https://github.com/guanruey/japanese-learning)
- 已知基準 commit：`8c021523bb049da497c14c64bed8ad987f510234`
- 正式環境已接通 Vercel + Supabase

## 這次已完成

- 修正正式環境的 `VITE_SUPABASE_URL`
- 修正正式環境的 `VITE_SUPABASE_ANON_KEY`
- 重新部署正式站
- 建立讀音引導切換：`ふりがな` / `ローマ字` / `OFF`
- 文法、語彙、片語支援讀音顯示
- 建立前端 fallback，避免 Supabase 個別欄位缺漏時整體功能失效
- 建立可重跑的讀音生成流程：`npm run generate:readings`
- 補上教材自然度修正保險：
  - 前端 `src/data/grammarOverrides.js`
  - SQL `supabase/fix_grammar_example_naturalness.sql`

## 資料覆蓋狀態

- `grammar`：110 筆
- `vocabulary`：430 筆
- `phrases`：30 筆

## 目前資料流

### grammar

- 先從 Supabase `grammar` 取資料
- 若 `reading` 或 `example_reading` 缺漏，前端以 `src/data/generatedReadings.js` fallback 補上
- 若是已知不自然例句，前端再以 `src/data/grammarOverrides.js` 覆寫顯示

### vocabulary

- 從 Supabase `vocabulary` 取資料
- 若 `example_reading` 缺漏，以 `src/data/generatedReadings.js` fallback 補上

### phrases

- 優先讀 Supabase `phrases`
- 若表為空或讀取失敗，退回 `src/data/phrases.js`

## 常用指令

```bash
npm install
npm run dev
npm run build
npm run generate:readings
vercel deploy --prod --yes
git push origin master
```

## Supabase 後續操作順序

新環境重建時，依序執行：

1. `supabase/apply_reading_support.sql`
2. `supabase/seed_generated_readings.sql`
3. `supabase/seed_phrases_full.sql`
4. `supabase/fix_grammar_example_naturalness.sql`

若只是更新讀音或教材：

1. `npm run generate:readings`
2. `supabase/seed_generated_readings.sql`
3. 如本次也調整教材自然度，再執行 `supabase/fix_grammar_example_naturalness.sql`

## 關鍵檔案

### 前端

- `src/App.jsx`
- `src/components/FuriganaText.jsx`
- `src/components/GrammarBrowser.jsx`
- `src/components/VocabularyBrowser.jsx`
- `src/components/PhrasesLibrary.jsx`
- `src/utils/reading.js`
- `src/data/generatedReadings.js`
- `src/data/grammarOverrides.js`
- `src/data/phrases.js`

### 腳本

- `scripts/generate-readings.mjs`

### Supabase SQL

- `supabase/apply_reading_support.sql`
- `supabase/seed_generated_readings.sql`
- `supabase/seed_phrases_full.sql`
- `supabase/fix_grammar_example_naturalness.sql`
- `supabase/OPERATIONS_CARD.md`

## 已知值得人工再潤的內容

這次已先收斂四筆最明顯的句子：

- `N4_050`
- `N4_056`
- `N5_031`
- `N5_050`

後續仍建議持續人工巡修整批教材，尤其是文法例句的自然度與教學聚焦度。

## 下一位協作者需要知道的重點

- 這個專案技術上已穩定可用
- 正式站與 Supabase 都已接通
- 現階段最值得投入的是教材品質與學習體驗，不是基礎功能修 bug
- 若重新生成讀音，優先使用 `npm run generate:readings`
- 若動到 Supabase，先看 `supabase/OPERATIONS_CARD.md`

# Supabase 操作卡

## 一次性初始化

1. 在 Supabase SQL Editor 執行：
   - `supabase/apply_reading_support.sql`
2. 如果要把文法與語彙的自動讀音正式寫回資料庫，再執行：
   - `supabase/seed_generated_readings.sql`
3. 如果要把片語資料正式放進 `phrases` 表，再執行：
   - `supabase/seed_phrases_full.sql`
4. 如果要同步套用目前已人工潤過的文法例句，再執行：
   - `supabase/fix_grammar_example_naturalness.sql`

## 之後資料更新時

1. 重新抓 Supabase 現有內容並生成前端 fallback：
   - `npm run generate:readings`
2. 若要同步把生成結果寫回資料庫：
   - 執行 `supabase/seed_generated_readings.sql`
3. 若本次也有調整教材自然度：
   - 再執行 `supabase/fix_grammar_example_naturalness.sql`

## 現在網站已具備的保險

- `grammar` 和 `vocabulary` 已有前端 fallback 讀音
- `phrases` 會先讀 Supabase，空表時自動退回本地資料
- `grammar` 另有前端教材覆寫，可先保護少數已知不自然例句

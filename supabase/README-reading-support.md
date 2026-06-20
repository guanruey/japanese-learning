Use this file in Supabase SQL Editor:

`supabase/apply_reading_support.sql`

What it does:
- adds reading columns needed by the new furigana/romaji UI
- creates supporting indexes
- fills phrase readings for ids `1` to `30`

Notes:
- safe to run multiple times
- this does not yet auto-fill grammar or vocabulary readings; those can be added later as data work

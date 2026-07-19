-- Godan (Group 1) verb conjugation reference: nai-form and te-form euphony.
-- Sourced from user's own study notes; fills a gap not covered by existing
-- N5/N4 grammar entries (which teach usage patterns, not the raw stem
-- conjugation rules).

INSERT INTO public.grammar (
  id, level, pattern, reading, meaning_en, meaning_zh,
  casual_variant, formal_variant, example_ja, example_reading, example_zh,
  explanation, common_mistakes, related_patterns
) VALUES
('N5_101', 'N5', '～ない（五段動詞の否定形）', '～ない（ごだんどうしのひていけい）',
 'negative form of Group 1 (u-verb) verbs: u-row stem shifts to a-row',
 '第一類動詞（五段動詞）否定形變化規則',
 '～ない', '～ません',
 'お酒は飲まないでください。', 'おさけはのまないでください。', '請不要喝酒。',
 '第一類動詞（五段動詞）將字尾由「い段音」改為「あ段音」再加上ない。例如：待つ→待たない、飲む→飲まない、書く→書かない、話す→話さない。',
 ARRAY['字尾為「う」的動詞是特例：買う→買わない（不是"買あない"），言う→言わない、使う→使わない', '「ある」的否定形是「ない」，不是「あらない」'],
 ARRAY['～ます', '～て', '～た']
),
('N5_102', 'N5', '～て（五段動詞の音便）', '～て（ごだんどうしのおんびん）',
 'te-form sound changes (euphony) for Group 1 (u-verb) verbs',
 '第一類動詞（五段動詞）て形音便規則',
 '～て', '～てください / ～ています',
 '友達を待って、一緒に映画を見ます。', 'ともだちをまって、いっしょにえいがをみます。', '等朋友，然後一起看電影。',
 '第一類動詞て形依字尾產生音便：う・つ・る→って（促音便，如待つ→待って）；む・ぶ・ぬ→んで（撥音便，如飲む→飲んで）；く→いて（い音便，如書く→書いて）；ぐ→いで（い音便濁化，如泳ぐ→泳いで）；す→して（無音便，如話す→話して）。',
 ARRAY['行く是唯一特例：行って（不是「行いて」）', 'ぐ結尾要記得濁化成んで／いで而非して'],
 ARRAY['～ない', '～た', '～ている']
)
ON CONFLICT (id) DO UPDATE SET
  pattern = EXCLUDED.pattern,
  reading = EXCLUDED.reading,
  meaning_en = EXCLUDED.meaning_en,
  meaning_zh = EXCLUDED.meaning_zh,
  casual_variant = EXCLUDED.casual_variant,
  formal_variant = EXCLUDED.formal_variant,
  example_ja = EXCLUDED.example_ja,
  example_reading = EXCLUDED.example_reading,
  example_zh = EXCLUDED.example_zh,
  explanation = EXCLUDED.explanation,
  common_mistakes = EXCLUDED.common_mistakes,
  related_patterns = EXCLUDED.related_patterns,
  updated_at = timezone('utc', now());

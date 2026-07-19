-- Two travel vocabulary words missing from the current vocabulary set,
-- surfaced from the user's "日本旅遊必備實戰常用語講義" notes.

INSERT INTO public.vocabulary (
  id, level, kanji, reading, pos,
  meaning_zh, meaning_en,
  example_ja, example_reading, example_zh,
  synonyms, antonyms, collocations, conversation_freq
) VALUES
('N4_V_101', 'N4', '窓口', 'まどぐち', 'noun',
 '服務窗口／櫃檯', 'service window / counter',
 '切符売り場の窓口で聞いてください。', 'きっぷうりばのまどぐちできいてください。', '請在售票處的窗口詢問。',
 '{"カウンター"}'::text[], NULL, '{"窓口で聞く","受付窓口"}'::text[], 'high'
),
('N5_V_101', 'N5', '乗り場', 'のりば', 'noun',
 '候車處／搭乘處', 'boarding point / platform (bus, taxi, etc.)',
 'バスの乗り場はあそこです。', 'バスののりばはあそこです。', '巴士的搭乘處在那裡。',
 NULL, NULL, '{"バス乗り場","1番のりば"}'::text[], 'high'
)
ON CONFLICT (id) DO UPDATE SET
  kanji = EXCLUDED.kanji,
  reading = EXCLUDED.reading,
  pos = EXCLUDED.pos,
  meaning_zh = EXCLUDED.meaning_zh,
  meaning_en = EXCLUDED.meaning_en,
  example_ja = EXCLUDED.example_ja,
  example_reading = EXCLUDED.example_reading,
  example_zh = EXCLUDED.example_zh,
  synonyms = EXCLUDED.synonyms,
  antonyms = EXCLUDED.antonyms,
  collocations = EXCLUDED.collocations,
  conversation_freq = EXCLUDED.conversation_freq,
  updated_at = timezone('utc', now());

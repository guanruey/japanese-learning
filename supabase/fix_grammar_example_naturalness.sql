-- Curated grammar example fixes for sentences that were understandable
-- but not natural enough for a learner-facing教材.
-- Safe to re-run.

update public.grammar
set
  example_ja = 'テーブルの上に花が飾ってあります。',
  example_reading = 'てーぶるのうえにはながかざってあります。',
  example_zh = '桌上擺著花。'
where id = 'N4_050';

update public.grammar
set
  example_ja = '国ごとに文化が違います。',
  example_reading = 'くにごとにぶんかがちがいます。',
  example_zh = '每個國家的文化都不一樣。'
where id = 'N4_056';

update public.grammar
set
  example_ja = '私は猫を飼っています。/ テーブルの上に本があります。',
  example_reading = 'わたしはねこをかっています。/ てーぶるのうえにほんがあります。',
  example_zh = '我養了一隻貓。/ 桌子上有一本書。'
where id = 'N5_031';

update public.grammar
set
  example_ja = '忙しいから、来られない。',
  example_reading = 'いそがしいから、こられない。',
  example_zh = '因為忙，所以來不了。'
where id = 'N5_050';

-- 補充新會話フレーズ（來自 N5-N4 實戰總整理報告）
-- 新增分類：餐廳（飲食限制）、購物（超商）、交通、住宿、標示

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('31', '餐廳', 'この料理に〜が入っていますか', 'このりょうりに〜がはいっていますか', 'この料理に〜は含まれていますか', '〜入ってる？', '這道料理裡有〜嗎？', '詢問食材成分', 'この料理に牛肉が入っていますか？', 'このりょうりにぎゅうにくがはいっていますか？')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('32', '餐廳', '〜は食べられません', '〜はたべられません', '〜はいただけません', '〜食べられない', '我不能吃〜', '告知飲食限制', '牛肉は食べられません。魚の料理はありますか？', 'ぎゅうにくはたべられません。さかなのりょうりはありますか？')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('33', '購物', 'お弁当は温めますか', 'おべんとうはあたためますか', 'お弁当はお温めしますか', '温める？', '便當需要加熱嗎？', '超商結帳時店員詢問', 'お弁当は温めますか？袋はご利用ですか？', 'おべんとうはあたためますか？ふくろはごりようですか？')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('34', '購物', '袋はそのままで大丈夫です', 'ふくろはそのままでだいじょうぶです', '袋はそのままで結構です', '袋いらない', '袋子不用了，這樣就好', '謝絕塑膠袋', 'はい、お願いします。袋はそのままで大丈夫です。', 'はい、おねがいします。ふくろはそのままでだいじょうぶです。')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('35', '交通', '〜へのバスはどこから出ますか', '〜へのバスはどこからでますか', '〜への路線バスはどちらから出発しますか', '〜のバスどこから出る？', '往〜的巴士從哪裡出發？', '詢問交通起點', '空港へのバスはどこから出ますか？', 'くうこうへのバスはどこからでますか？')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('36', '交通', 'あそこの券売機で買えますよ', 'あそこのけんばいきでかえますよ', 'あちらの券売機でお求めいただけます', 'あそこで買えるよ', '在那邊的自動售票機可以買', '指引購票地點', 'あそこの券売機で切符が買えますよ。', 'あそこのけんばいきできっぷがかえますよ。')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('37', '交通', '片道をお願いします', 'かたみちをおねがいします', '片道でお願いいたします', '片道で', '我要一張單程票', '購票時指定票種', '片道をお願いします。領収書は出ますか？', 'かたみちをおねがいします。りょうしゅうしょはでますか？')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('38', '交通', '往復をお願いします', 'おうふくをおねがいします', '往復でお願いいたします', '往復で', '我要一張來回票', '購票時指定來回', '往復をお願いします。いくらですか？', 'おうふくをおねがいします。いくらですか？')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('39', '住宿', 'チェックインの前に荷物を預かってもらえますか', 'チェックインのまえににもつをあずかってもらえますか', 'チェックイン前に荷物をお預かりいただけますか', '荷物預かってもらえる？', '辦理入住前，能幫我寄放行李嗎？', '飯店辦理入住前寄放行李', 'チェックインの前に、荷物を預かってもらえますか。', 'チェックインのまえに、にもつをあずかってもらえますか。')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('40', '住宿', 'こちらでお預かりします', 'こちらでおあずかりします', 'こちらでお預かりいたします', 'ここで預かります', '我們在這裡為您保管', '飯店人員回應寄放請求', 'もちろんです。こちらでお預かりします。', 'もちろんです。こちらでおあずかりします。')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('41', '住宿', 'チェックアウトは何時ですか', 'チェックアウトはなんじですか', 'チェックアウトは何時になりますか', 'チェックアウト何時？', '退房時間是幾點？', '確認退房時間', 'チェックアウトは何時ですか？延長できますか？', 'チェックアウトはなんじですか？えんちょうできますか？')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('42', '標示', '土足禁止', 'どそくきんし', '靴でお入りにならないでください', '靴を脱いでください', '禁止穿鞋入內', '日本室內場所標示', '土足禁止です。靴を脱いでからお入りください。', 'どそくきんしです。くつをぬいでからおはいりください。')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('43', '標示', '関係者以外立入禁止', 'かんけいしゃいがいたちいりきんし', '関係者以外の方はご遠慮ください', 'スタッフのみ', '非相關人員禁止進入', '機構或建築物入口標示', 'このエリアは関係者以外立入禁止です。', 'このエリアはかんけいしゃいがいたちいりきんしです。')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('44', '標示', '持ち込み禁止', 'もちこみきんし', '外部からの飲食物の持ち込みはご遠慮ください', '持ち込みダメ', '禁止攜帶外食進入', '餐廳或場館標示', 'このエリアは持ち込み禁止です。', 'このエリアはもちこみきんしです。')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('45', '標示', '飲食禁止', 'いんしょくきんし', 'こちらでの飲食はご遠慮ください', '食べ飲みダメ', '禁止飲食', '圖書館或博物館等場所標示', 'ここは飲食禁止のエリアです。', 'ここはいんしょくきんしのエリアです。')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('46', '標示', '駆け込み禁止', 'かけこみきんし', '乗車時は走らないでください', '走らないで', '禁止衝進車廂', '月台或車廂入口標示', '駆け込み禁止。乗車時は走らないでください。', 'かけこみきんし。じょうしゃじははしらないでください。')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('47', '餐廳', 'ご注文はお決まりですか', 'ごちゅうもんはおきまりですか', 'ご注文はお決まりでしょうか', '何にする？', '您決定好要點什麼了嗎？', '店員詢問是否準備好點餐', 'ご注文はお決まりですか。少々お時間をいただけますか？', 'ごちゅうもんはおきまりですか。しょうしょうおじかんをいただけますか？')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('48', '餐廳', 'かしこまりました', 'かしこまりました', 'かしこまりました', 'わかりました', '好的，我明白了（敬語）', '店員確認點餐時使用，比はい更正式', 'ラーメンをひとつですね。かしこまりました。', 'ラーメンをひとつですね。かしこまりました。')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('49', '餐廳', 'お会計をお願いします', 'おかいけいをおねがいします', 'お会計をお願いいたします', 'お会計', '請幫我結帳', '用餐完畢要求結帳', 'すみません、お会計をお願いします。カードで払えますか？', 'すみません、おかいけいをおねがいします。カードではらえますか？')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('50', '餐廳', 'そのままで大丈夫です', 'そのままでだいじょうぶです', 'そのままで結構です', 'そのままでいい', 'これ樣就好了，不需要額外的', '拒絕袋子、餐具或加熱時', 'お箸はそのままで大丈夫です。フォークをいただけますか？', 'おはしはそのままでだいじょうぶです。フォークをいただけますか？')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('51', '餐廳', '領収書をお願いします', 'りょうしゅうしょをおねがいします', '領収書をお願いいたします', '領収書ください', '請給我正式收據（報帳用）', '需要可報帳的正式發票時（與レシート不同）', 'お会計をお願いします。領収書もいただけますか？', 'おかいけいをおねがいします。りょうしゅうしょもいただけますか？')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

insert into public.phrases (id, category, phrase_ja, reading, formal, casual, meaning_zh, context, example, example_reading) values
('52', '餐廳', '〜の料理はありますか', '〜のりょうりはありますか', '〜を使ったお料理はございますか', '〜の料理ある？', '有含〜的料理嗎？', '表達飲食限制後詢問替代菜色', '牛肉は食べられません。魚の料理はありますか？', 'ぎゅうにくはたべられません。さかなのりょうりはありますか？')
on conflict (id) do update set category=excluded.category, phrase_ja=excluded.phrase_ja, reading=excluded.reading, formal=excluded.formal, casual=excluded.casual, meaning_zh=excluded.meaning_zh, context=excluded.context, example=excluded.example, example_reading=excluded.example_reading;

export const scenarioTracks = {
  japanese: '日本語',
  english: 'English',
}

export const scenarioCategories = {
  daily: '常用場景',
  business: '公司商務',
}

export const scenarioModules = [
  {
    id: 'restaurant-order',
    category: 'daily',
    setting: 'Restaurant',
    label: '餐廳點餐',
    goal: '完成入座、點餐、詢問限制、確認結帳方式。',
    difficulty: 'Beginner to Intermediate',
    tags: ['ordering', 'politeness', 'clarification'],
    languages: {
      japanese: {
        opener: '店員與顧客的互動常有固定流程，先學會開口與確認句。',
        mission: '你和一位朋友走進餐廳，要入座、詢問有沒有無肉選項，最後要求分開結帳。',
        keyPatterns: [
          '二人です。',
          '予約していません。',
          'ベジタリアン向けの料理はありますか。',
          '別々にお願いします。',
        ],
        keyVocabulary: ['予約', '席', 'おすすめ', '会計', '別々'],
        exampleSets: [
          {
            title: '入店與等位',
            lines: [
              '二人です。',
              '予約していません。',
              'どのくらい待ちますか。',
              '今、空いていますか。',
            ],
          },
          {
            title: '點餐與需求',
            lines: [
              'おすすめは何ですか。',
              '辛くないものはありますか。',
              '肉が入っていない料理はありますか。',
              '水をもう一杯お願いします。',
            ],
          },
          {
            title: '結帳與收尾',
            lines: [
              '会計お願いします。',
              'カードは使えますか。',
              '別々にお願いします。',
              'ごちそうさまでした。',
            ],
          },
        ],
        responseBank: [
          'ただいま満席です。',
          '少々お待ちください。',
          'こちらへどうぞ。',
          'ご注文はお決まりですか。',
          'アレルギーはありますか。',
          'お会計はレジでお願いします。',
        ],
        steps: [
          {
            title: '進店與入座',
            learnerLine: '二人です。予約していません。',
            coachNote: '先表明人數，再補充沒有訂位。',
            branches: [
              '少々お待ちください。',
              'カウンター席でもよろしいですか。',
              '予約のお名前をお願いします。',
            ],
          },
          {
            title: '詢問餐點限制',
            learnerLine: 'ベジタリアン向けの料理はありますか。',
            coachNote: '用 〜向け 表示「適合某類人」。',
            branches: [
              'こちらのパスタは肉を抜けます。',
              'アレルギーはありますか。',
              'おすすめは本日のサラダです。',
            ],
          },
          {
            title: '結帳與收尾',
            learnerLine: '会計お願いします。別々にお願いします。',
            coachNote: '結帳請求與分開結帳可以拆兩句講，更自然。',
            branches: [
              '現金とカード、どちらになさいますか。',
              'レジでお願いします。',
              '領収書はご入用ですか。',
            ],
          },
        ],
        repairPoints: [
          {
            weak: '二人、予約ない。',
            better: '二人です。予約していません。',
            why: '補齊敬體與動詞，語氣自然很多。',
          },
          {
            weak: '肉ない料理あります？',
            better: '肉が入っていない料理はありますか。',
            why: '把條件說完整，店員比較容易理解。',
          },
        ],
      },
      english: {
        opener: 'Restaurant scenarios are ideal because the task flow is predictable but the responses can branch quickly.',
        mission: 'You and a friend walk into a restaurant, ask for a table, check whether there is a vegetarian option, and request separate checks.',
        keyPatterns: [
          'A table for two, please.',
          'We do not have a reservation.',
          'Do you have any vegetarian options.',
          'Could we get separate checks, please.',
        ],
        keyVocabulary: ['reservation', 'available', 'option', 'bill', 'separate checks'],
        exampleSets: [
          {
            title: 'Arrival and waiting',
            lines: [
              'A table for two, please.',
              'We do not have a reservation.',
              'How long is the wait.',
              'Do you have anything available right now.',
            ],
          },
          {
            title: 'Ordering and requests',
            lines: [
              'What do you recommend.',
              'Do you have anything that is not spicy.',
              'Could we get another glass of water, please.',
              'Can this be made without meat.',
            ],
          },
          {
            title: 'Paying and leaving',
            lines: [
              'Could we get the bill, please.',
              'Do you take credit cards.',
              'Could we get separate checks, please.',
              'Thank you. Everything was great.',
            ],
          },
        ],
        responseBank: [
          'It will be about a 20-minute wait.',
          'Right this way, please.',
          'Are you ready to order.',
          'Would you like anything to drink first.',
          'We can make that without meat.',
          'You can pay at the counter.',
        ],
        steps: [
          {
            title: 'Entering and getting seated',
            learnerLine: 'A table for two, please. We do not have a reservation.',
            coachNote: 'Keep the opening efficient and polite.',
            branches: [
              'It will be about a 20-minute wait.',
              'Would you prefer indoor or outdoor seating?',
              'Can I have your name, please?',
            ],
          },
          {
            title: 'Asking about food restrictions',
            learnerLine: 'Do you have any vegetarian options.',
            coachNote: 'This is a safer default than asking only for salad or side dishes.',
            branches: [
              'We can make the pasta without meat.',
              'Do you have any food allergies?',
              'Our special today is the mushroom risotto.',
            ],
          },
          {
            title: 'Paying and closing',
            learnerLine: 'Could we get the bill, please. Could we get separate checks.',
            coachNote: 'Two short polite questions are often clearer than one packed sentence.',
            branches: [
              'Are you paying by cash or card?',
              'You can pay at the counter.',
              'Would you like a receipt?',
            ],
          },
        ],
        repairPoints: [
          {
            weak: 'We are two people and no reserve.',
            better: 'A table for two, please. We do not have a reservation.',
            why: 'The improved version uses standard restaurant phrasing and complete grammar.',
          },
          {
            weak: 'Can separate pay?',
            better: 'Could we get separate checks, please.',
            why: 'This is the natural service-industry phrase in English.',
          },
        ],
      },
    },
  },
  {
    id: 'station-ticket',
    category: 'daily',
    setting: 'Station',
    label: '車站購票',
    goal: '詢問月台、車次、是否需要換車，以及票價。',
    difficulty: 'Beginner to Intermediate',
    tags: ['directions', 'ticketing', 'confirmation'],
    languages: {
      japanese: {
        opener: '車站情境特別需要「確認資訊」的能力，因為資訊量多且回覆可能很快。',
        mission: '你要去另一個城市，想問月台、發車時間，還要確認是否需要換車。',
        keyPatterns: ['この電車は台北まで行きますか。', '何番線ですか。', '乗り換えは必要ですか。', '片道はいくらですか。'],
        keyVocabulary: ['番線', '乗り換え', '片道', '往復', '快速'],
        steps: [],
        repairPoints: [],
      },
      english: {
        opener: 'Station tasks are useful because they force short, precise question forms.',
        mission: 'You need to ask which platform to use, when the train leaves, and whether you need to transfer.',
        keyPatterns: ['Does this train go to Taichung.', 'Which platform should I go to.', 'Do I need to transfer.', 'How much is a one-way ticket.'],
        keyVocabulary: ['platform', 'departure', 'transfer', 'one-way', 'express'],
        steps: [],
        repairPoints: [],
      },
    },
  },
  {
    id: 'hotel-checkin',
    category: 'daily',
    setting: 'Hotel',
    label: '飯店入住',
    goal: '辦理入住、確認訂單、詢問早餐與退房時間。',
    difficulty: 'Beginner to Intermediate',
    tags: ['hotel', 'check-in', 'travel'],
    languages: {
      japanese: {
        opener: '飯店入住是旅行中很高頻的情境，重點在姓名確認、訂單資訊與基本設施詢問。',
        mission: '你到飯店櫃檯辦理入住，確認訂單、早餐時間，並問退房是幾點。',
        keyPatterns: [
          'チェックインをお願いします。',
          '予約名は林です。',
          '朝食は何時からですか。',
          'チェックアウトは何時ですか。',
        ],
        keyVocabulary: ['予約名', '朝食', 'チェックアウト', '部屋番号', '鍵'],
        exampleSets: [
          {
            title: '辦理入住',
            lines: [
              'チェックインをお願いします。',
              '予約名は林です。',
              '一泊で予約しています。',
              'パスポートは必要ですか。',
            ],
          },
          {
            title: '詢問設施',
            lines: [
              '朝食は何時からですか。',
              'Wi-Fiはありますか。',
              'エレベーターはどこですか。',
              '部屋は何階ですか。',
            ],
          },
          {
            title: '退房與補充',
            lines: [
              'チェックアウトは何時ですか。',
              '荷物を預けられますか。',
              'このカードキーは一枚ですか。',
              'ありがとうございます。',
            ],
          },
        ],
        responseBank: [
          'ご予約を確認いたします。',
          '朝食は七時から十時までです。',
          'お部屋は八階です。',
          'こちらがルームキーです。',
          'チェックアウトは十一時です。',
        ],
        steps: [
          {
            title: '辦理入住',
            learnerLine: 'チェックインをお願いします。予約名は林です。',
            coachNote: '先說需求，再報名字，櫃檯會比較容易接。',
            branches: [
              'ご予約を確認いたします。',
              'パスポートを拝見してもよろしいですか。',
              '何泊のご予定でしょうか。',
            ],
          },
          {
            title: '確認設施資訊',
            learnerLine: '朝食は何時からですか。',
            coachNote: '旅行場景常用短問句，比一次問太多更自然。',
            branches: [
              '七時から十時までです。',
              '二階のレストランでお召し上がりいただけます。',
              '朝食券はこちらです。',
            ],
          },
          {
            title: '確認退房',
            learnerLine: 'チェックアウトは何時ですか。',
            coachNote: '入住時先問退房時間，行程安排會更順。',
            branches: [
              '十一時でございます。',
              '延長も可能ですが、追加料金がかかります。',
              '荷物はフロントでお預かりできます。',
            ],
          },
        ],
        repairPoints: [
          {
            weak: '泊まる、林です。',
            better: 'チェックインをお願いします。予約名は林です。',
            why: '完整表達需求與姓名，櫃檯比較容易理解。',
          },
          {
            weak: '何時までホテル出る？',
            better: 'チェックアウトは何時ですか。',
            why: '這是正式而自然的標準問法。',
          },
        ],
      },
      english: {
        opener: 'Hotel check-in is a useful travel situation because it combines identification, booking details, and simple service questions.',
        mission: 'You arrive at a hotel, check in under your name, and ask about breakfast and check-out time.',
        keyPatterns: [
          'I would like to check in.',
          'The reservation is under Lin.',
          'What time is breakfast.',
          'What time is check-out.',
        ],
        keyVocabulary: ['reservation', 'breakfast', 'check-out', 'room key', 'front desk'],
        exampleSets: [
          {
            title: 'Checking in',
            lines: [
              'I would like to check in.',
              'The reservation is under Lin.',
              'I booked one night.',
              'Do you need my passport.',
            ],
          },
          {
            title: 'Asking about facilities',
            lines: [
              'What time is breakfast.',
              'Is Wi-Fi included.',
              'Which floor is my room on.',
              'Where is the elevator.',
            ],
          },
          {
            title: 'Check-out and extras',
            lines: [
              'What time is check-out.',
              'Can you store my luggage after check-out.',
              'Is this the room key.',
              'Thank you for your help.',
            ],
          },
        ],
        responseBank: [
          'Let me check your reservation.',
          'Breakfast is served from seven to ten.',
          'Your room is on the eighth floor.',
          'Here is your room key.',
          'Check-out is at eleven.',
        ],
        steps: [
          {
            title: 'Checking in at the desk',
            learnerLine: 'I would like to check in. The reservation is under Lin.',
            coachNote: 'This is the cleanest basic hotel opening.',
            branches: [
              'Let me check your reservation.',
              'May I see your passport, please?',
              'How many nights will you be staying?',
            ],
          },
          {
            title: 'Asking about breakfast',
            learnerLine: 'What time is breakfast.',
            coachNote: 'One short question at a time is easier than stacking everything together.',
            branches: [
              'Breakfast is served from seven to ten.',
              'It is on the second floor.',
              'You can use this breakfast card.',
            ],
          },
          {
            title: 'Asking about check-out',
            learnerLine: 'What time is check-out.',
            coachNote: 'This question helps you plan the next day clearly.',
            branches: [
              'Check-out is at eleven.',
              'Late check-out is possible for an extra fee.',
              'We can store your luggage at the front desk.',
            ],
          },
        ],
        repairPoints: [
          {
            weak: 'I stay here. My name Lin.',
            better: 'I would like to check in. The reservation is under Lin.',
            why: 'The improved version uses standard hotel phrasing and clearer grammar.',
          },
          {
            weak: 'When leave room?',
            better: 'What time is check-out.',
            why: 'This is the normal hotel-service phrase in English.',
          },
        ],
      },
    },
  },
  {
    id: 'asking-directions',
    category: 'daily',
    setting: 'Street',
    label: '問路與找地點',
    goal: '詢問地點、確認方向、估計距離、確認是否要轉彎。',
    difficulty: 'Beginner to Intermediate',
    tags: ['directions', 'travel', 'navigation'],
    languages: {
      japanese: {
        opener: '問路情境的關鍵不是長句，而是用短句反覆確認方向。',
        mission: '你在路上找不到目的地，要問最近的車站、確認方向，並問大概需要走多久。',
        keyPatterns: [
          'すみません、駅はどこですか。',
          'ここから遠いですか。',
          'まっすぐ行けばいいですか。',
          '何分くらいかかりますか。',
        ],
        keyVocabulary: ['交差点', 'まっすぐ', '右', '左', '角'],
        exampleSets: [
          {
            title: '開口問路',
            lines: [
              'すみません、駅はどこですか。',
              'この住所を探しています。',
              '近くにコンビニはありますか。',
              'この道で合っていますか。',
            ],
          },
          {
            title: '確認方向',
            lines: [
              'まっすぐ行けばいいですか。',
              '次の角を右ですか。',
              '信号を渡りますか。',
              '左に曲がればいいですか。',
            ],
          },
          {
            title: '確認距離',
            lines: [
              'ここから遠いですか。',
              '何分くらいかかりますか。',
              '歩いて行けますか。',
              'ありがとうございます。',
            ],
          },
        ],
        responseBank: [
          'この道をまっすぐ行ってください。',
          '次の角を右に曲がってください。',
          '歩いて五分くらいです。',
          'あの信号を渡ると見えます。',
          'すぐ近くです。',
        ],
        steps: [
          {
            title: '開口問位置',
            learnerLine: 'すみません、駅はどこですか。',
            coachNote: '先用 すみません 開口，對陌生人更自然。',
            branches: [
              'この道をまっすぐ行ってください。',
              '次の角を右です。',
              '歩いて五分くらいです。',
            ],
          },
          {
            title: '確認方向',
            learnerLine: 'まっすぐ行けばいいですか。',
            coachNote: '聽到指示後，立即用短句複誦確認，很實用。',
            branches: [
              'はい、そのままで大丈夫です。',
              '二つ目の角で左に曲がってください。',
              '信号を渡ると見えます。',
            ],
          },
          {
            title: '確認距離',
            learnerLine: '何分くらいかかりますか。',
            coachNote: '除了方向，時間感也很重要。',
            branches: [
              '歩いて五分くらいです。',
              'そんなに遠くありません。',
              'すぐ着くと思います。',
            ],
          },
        ],
        repairPoints: [
          {
            weak: '駅、どこ？',
            better: 'すみません、駅はどこですか。',
            why: '多一個開場和完整句型，聽起來自然很多。',
          },
          {
            weak: 'どれくらい？',
            better: '何分くらいかかりますか。',
            why: '把你真正想知道的資訊說完整。',
          },
        ],
      },
      english: {
        opener: 'Asking for directions works best when you use short questions and keep confirming the route step by step.',
        mission: 'You are looking for a station and need to ask where it is, whether you should turn, and how long it will take on foot.',
        keyPatterns: [
          'Excuse me, where is the station.',
          'Is it far from here.',
          'Should I go straight.',
          'How long does it take on foot.',
        ],
        keyVocabulary: ['corner', 'straight', 'left', 'right', 'crosswalk'],
        exampleSets: [
          {
            title: 'Starting the question',
            lines: [
              'Excuse me, where is the station.',
              'I am looking for this address.',
              'Is there a convenience store nearby.',
              'Am I going the right way.',
            ],
          },
          {
            title: 'Checking the route',
            lines: [
              'Should I go straight.',
              'Do I turn right at the next corner.',
              'Should I cross the street here.',
              'Do I turn left after the light.',
            ],
          },
          {
            title: 'Checking the distance',
            lines: [
              'Is it far from here.',
              'How long does it take on foot.',
              'Can I walk there.',
              'Thank you very much.',
            ],
          },
        ],
        responseBank: [
          'Go straight down this road.',
          'Turn right at the next corner.',
          'It is about a five-minute walk.',
          'You will see it after the traffic light.',
          'It is very close from here.',
        ],
        steps: [
          {
            title: 'Asking where the place is',
            learnerLine: 'Excuse me, where is the station.',
            coachNote: 'A simple opening question is usually enough to get help.',
            branches: [
              'Go straight down this road.',
              'Turn right at the next corner.',
              'It is about a five-minute walk.',
            ],
          },
          {
            title: 'Confirming the route',
            learnerLine: 'Should I go straight.',
            coachNote: 'Repeat the key direction back as a question to avoid getting lost.',
            branches: [
              'Yes, just keep going straight.',
              'Then turn left at the second corner.',
              'Cross the street at the light.',
            ],
          },
          {
            title: 'Confirming the distance',
            learnerLine: 'How long does it take on foot.',
            coachNote: 'Time helps you judge whether you understood the route correctly.',
            branches: [
              'It takes about five minutes.',
              'It is not far at all.',
              'You should get there very soon.',
            ],
          },
        ],
        repairPoints: [
          {
            weak: 'Where station?',
            better: 'Excuse me, where is the station.',
            why: 'The improved version is complete and polite.',
          },
          {
            weak: 'How many time walking?',
            better: 'How long does it take on foot.',
            why: 'This is the natural English question for walking time.',
          },
        ],
      },
    },
  },
  {
    id: 'shopping-return',
    category: 'daily',
    setting: 'Store',
    label: '購物退換貨',
    goal: '說明問題、詢問可否退貨或更換、確認收據與流程。',
    difficulty: 'Intermediate',
    tags: ['shopping', 'return', 'exchange'],
    languages: {
      japanese: {
        opener: '退換貨情境重點在於清楚描述商品問題，並保持禮貌。',
        mission: '你買的商品尺寸不合或有瑕疵，想詢問能不能換貨或退貨。',
        keyPatterns: [
          'こちらを交換できますか。',
          'サイズが合いません。',
          'レシートはこちらです。',
          '返金は可能ですか。',
        ],
        keyVocabulary: ['交換', '返品', '返金', '不良品', 'レシート'],
        exampleSets: [
          {
            title: '說明問題',
            lines: [
              'サイズが合いません。',
              'こちらに傷があります。',
              '昨日購入しました。',
              'この商品について相談したいです。',
            ],
          },
          {
            title: '詢問退換',
            lines: [
              'こちらを交換できますか。',
              '別のサイズはありますか。',
              '返品は可能ですか。',
              '返金していただけますか。',
            ],
          },
          {
            title: '確認流程',
            lines: [
              'レシートはこちらです。',
              '手続きはどのくらいかかりますか。',
              'この場で対応できますか。',
              'ありがとうございます。',
            ],
          },
        ],
        responseBank: [
          'レシートを確認いたします。',
          '別のサイズをお持ちします。',
          '返品は七日以内で可能です。',
          '返金は同じ支払い方法で行います。',
          '少々お待ちください。',
        ],
        steps: [
          {
            title: '說明商品問題',
            learnerLine: 'サイズが合いません。こちらを交換できますか。',
            coachNote: '先說問題，再說需求，流程最順。',
            branches: [
              '別のサイズを確認いたします。',
              'レシートはお持ちですか。',
              '同じ商品でよろしいですか。',
            ],
          },
          {
            title: '詢問退貨或退款',
            learnerLine: '返品は可能ですか。返金もできますか。',
            coachNote: '如果不確定能不能換，直接一起確認退貨與退款。',
            branches: [
              '返品は七日以内で可能です。',
              '返金は可能ですが、レシートが必要です。',
              'カードでのお支払いでしたか。',
            ],
          },
          {
            title: '確認完成流程',
            learnerLine: 'レシートはこちらです。手続きはどのくらいかかりますか。',
            coachNote: '把收據和流程一起確認，避免中途又卡住。',
            branches: [
              '五分ほどで完了します。',
              'この場で対応いたします。',
              '少々お待ちください。',
            ],
          },
        ],
        repairPoints: [
          {
            weak: 'これ、だめ。変えたい。',
            better: 'サイズが合いません。こちらを交換できますか。',
            why: '自然說明問題後再提出請求，語氣會更好。',
          },
          {
            weak: 'お金返して？',
            better: '返金は可能ですか。',
            why: '正式問法比較不會顯得太直接。',
          },
        ],
      },
      english: {
        opener: 'Returns and exchanges are easier when you explain the problem clearly and ask one service question at a time.',
        mission: 'You bought an item that does not fit or has a defect, and you want to ask whether you can exchange it or get a refund.',
        keyPatterns: [
          'Could I exchange this item.',
          'The size does not fit.',
          'Here is the receipt.',
          'Is a refund possible.',
        ],
        keyVocabulary: ['exchange', 'return', 'refund', 'receipt', 'defect'],
        exampleSets: [
          {
            title: 'Explaining the problem',
            lines: [
              'The size does not fit.',
              'There is a small defect here.',
              'I bought this yesterday.',
              'I would like to ask about this item.',
            ],
          },
          {
            title: 'Asking for an exchange',
            lines: [
              'Could I exchange this item.',
              'Do you have this in another size.',
              'Is it possible to return it instead.',
              'Could I get a refund.',
            ],
          },
          {
            title: 'Confirming the process',
            lines: [
              'Here is the receipt.',
              'How long will the process take.',
              'Can this be handled here.',
              'Thank you for your help.',
            ],
          },
        ],
        responseBank: [
          'Let me check the receipt.',
          'We do have another size available.',
          'Returns are possible within seven days.',
          'The refund will go back to the original payment method.',
          'Please wait for a moment.',
        ],
        steps: [
          {
            title: 'Explaining the issue',
            learnerLine: 'The size does not fit. Could I exchange this item.',
            coachNote: 'State the problem first so the staff knows which process applies.',
            branches: [
              'Let me see what size you need.',
              'Do you have the receipt with you?',
              'Would you like the same item in a different size?',
            ],
          },
          {
            title: 'Asking about return or refund',
            learnerLine: 'Is it possible to return it instead. Is a refund possible.',
            coachNote: 'If exchange may not work, move calmly to the return option.',
            branches: [
              'Returns are possible within seven days.',
              'A refund is possible with the receipt.',
              'How did you pay for the item?',
            ],
          },
          {
            title: 'Confirming the process',
            learnerLine: 'Here is the receipt. How long will the process take.',
            coachNote: 'This helps you understand whether everything can be finished now.',
            branches: [
              'It should only take a few minutes.',
              'We can handle it here right away.',
              'Please wait while I process this.',
            ],
          },
        ],
        repairPoints: [
          {
            weak: 'This is bad. I want change.',
            better: 'The size does not fit. Could I exchange this item.',
            why: 'The revised version sounds clearer and more natural in a store.',
          },
          {
            weak: 'Give money back?',
            better: 'Is a refund possible.',
            why: 'This is the standard service question in English.',
          },
        ],
      },
    },
  },
  {
    id: 'clinic-visit',
    category: 'daily',
    setting: 'Clinic',
    label: '看診掛號',
    goal: '說明症狀、確認是否能掛號、回答基本問題。',
    difficulty: 'Intermediate',
    tags: ['clinic', 'health', 'symptoms'],
    languages: {
      japanese: {
        opener: '看診情境的重點是簡單、準確地描述症狀，不需要很複雜的句子。',
        mission: '你身體不舒服，到診所掛號並說明主要症狀，像是發燒、喉嚨痛、咳嗽或頭痛。',
        keyPatterns: [
          '診察を受けたいです。',
          '熱があります。',
          '喉が痛いです。',
          '今日、診てもらえますか。',
        ],
        keyVocabulary: ['受付', '症状', '熱', '咳', '頭痛'],
        exampleSets: [
          {
            title: '掛號與開場',
            lines: [
              '診察を受けたいです。',
              '今日、診てもらえますか。',
              '初めてです。',
              '保険証はこちらです。',
            ],
          },
          {
            title: '說明症狀',
            lines: [
              '熱があります。',
              '喉が痛いです。',
              '咳が出ます。',
              '昨日から頭痛があります。',
            ],
          },
          {
            title: '補充說明',
            lines: [
              '少しだるいです。',
              '食欲がありません。',
              '薬は飲んでいません。',
              'ありがとうございます。',
            ],
          },
        ],
        responseBank: [
          '受付はこちらです。',
          '保険証をお預かりします。',
          '症状はいつからですか。',
          '少々お待ちください。',
          '本日診察可能です。',
        ],
        steps: [
          {
            title: '掛號與說明需求',
            learnerLine: '診察を受けたいです。今日、診てもらえますか。',
            coachNote: '先確認能不能看診，再進入症狀描述。',
            branches: [
              'はい、本日診察可能です。',
              '初診ですか。',
              '保険証をお持ちですか。',
            ],
          },
          {
            title: '描述主要症狀',
            learnerLine: '熱があります。喉が痛いです。',
            coachNote: '先說最主要的兩個症狀就夠了。',
            branches: [
              '症状はいつからですか。',
              '咳や鼻水はありますか。',
              '昨日よりひどいですか。',
            ],
          },
          {
            title: '回答補充問題',
            learnerLine: '昨日からです。薬は飲んでいません。',
            coachNote: '時間點與是否已用藥，常常是診所會追問的資訊。',
            branches: [
              'わかりました。少々お待ちください。',
              '順番が来たらお呼びします。',
              '問診票の記入をお願いします。',
            ],
          },
        ],
        repairPoints: [
          {
            weak: '病気です。見て。',
            better: '診察を受けたいです。今日、診てもらえますか。',
            why: '更自然，也更符合掛號時的流程。',
          },
          {
            weak: '頭痛い、喉痛い。',
            better: '頭が痛いです。喉が痛いです。',
            why: '補齊助詞與敬體，醫療場合更清楚。',
          },
        ],
      },
      english: {
        opener: 'At a clinic, clear symptom phrases matter more than long explanations. Keep the message simple and direct.',
        mission: 'You feel unwell and need to check in at a clinic, explain your main symptoms, and answer a few follow-up questions.',
        keyPatterns: [
          'I would like to see a doctor.',
          'I have a fever.',
          'I have a sore throat.',
          'Could I be seen today.',
        ],
        keyVocabulary: ['reception', 'symptoms', 'fever', 'cough', 'headache'],
        exampleSets: [
          {
            title: 'Checking in',
            lines: [
              'I would like to see a doctor.',
              'Could I be seen today.',
              'This is my first visit.',
              'Here is my health card.',
            ],
          },
          {
            title: 'Describing symptoms',
            lines: [
              'I have a fever.',
              'I have a sore throat.',
              'I have been coughing.',
              'I have had a headache since yesterday.',
            ],
          },
          {
            title: 'Extra information',
            lines: [
              'I also feel tired.',
              'I do not have much appetite.',
              'I have not taken any medicine yet.',
              'Thank you.',
            ],
          },
        ],
        responseBank: [
          'Reception is over here.',
          'Could you show me your health card?',
          'When did the symptoms start?',
          'Please have a seat for a moment.',
          'Yes, the doctor can see you today.',
        ],
        steps: [
          {
            title: 'Checking in at the clinic',
            learnerLine: 'I would like to see a doctor. Could I be seen today.',
            coachNote: 'This gives the clinic both your need and your question right away.',
            branches: [
              'Yes, the doctor can see you today.',
              'Is this your first visit here?',
              'Could you show me your health card?',
            ],
          },
          {
            title: 'Explaining the main symptoms',
            learnerLine: 'I have a fever and a sore throat.',
            coachNote: 'Start with the main symptoms before adding details.',
            branches: [
              'When did the symptoms start?',
              'Do you also have a cough or a runny nose?',
              'Has it gotten worse since yesterday?',
            ],
          },
          {
            title: 'Answering follow-up questions',
            learnerLine: 'It started yesterday. I have not taken any medicine yet.',
            coachNote: 'Timing and medicine use are common questions in basic care.',
            branches: [
              'Thank you. Please have a seat.',
              'The doctor will call you shortly.',
              'Please fill out this form first.',
            ],
          },
        ],
        repairPoints: [
          {
            weak: 'I am sick. See doctor now.',
            better: 'I would like to see a doctor. Could I be seen today.',
            why: 'The improved version sounds calmer and more natural in a clinic.',
          },
          {
            weak: 'Head hurt and throat hurt.',
            better: 'I have a headache, and I have a sore throat.',
            why: 'This is the standard way to state symptoms clearly.',
          },
        ],
      },
    },
  },
  {
    id: 'pharmacy-help',
    category: 'daily',
    setting: 'Pharmacy',
    label: '藥局買藥',
    goal: '描述不適、詢問適合的藥、確認服用方式與次數。',
    difficulty: 'Intermediate',
    tags: ['pharmacy', 'medicine', 'health'],
    languages: {
      japanese: {
        opener: '藥局場景最常見的是描述症狀、詢問哪種藥合適，以及怎麼吃。',
        mission: '你到藥局想買成藥，說明症狀，並確認藥的使用方式。',
        keyPatterns: [
          '風邪薬はありますか。',
          '喉の痛みに効く薬はありますか。',
          'どうやって飲みますか。',
          '一日に何回ですか。',
        ],
        keyVocabulary: ['風邪薬', '痛み', '咳止め', '飲み方', '副作用'],
        exampleSets: [
          {
            title: '描述需求',
            lines: [
              '風邪薬はありますか。',
              '喉の痛みに効く薬はありますか。',
              '咳が続いています。',
              '眠くならないものがいいです。',
            ],
          },
          {
            title: '確認用法',
            lines: [
              'どうやって飲みますか。',
              '一日に何回ですか。',
              '食後ですか。',
              '子どもでも飲めますか。',
            ],
          },
          {
            title: '補充確認',
            lines: [
              '副作用はありますか。',
              '何日くらい飲めばいいですか。',
              'ほかの薬と一緒に飲めますか。',
              'ありがとうございます。',
            ],
          },
        ],
        responseBank: [
          'こちらがおすすめです。',
          '一日三回、食後に飲んでください。',
          '眠くなる可能性があります。',
          '三日ほど様子を見てください。',
          '心配なら病院も受診してください。',
        ],
        steps: [
          {
            title: '說明你想買什麼藥',
            learnerLine: '喉の痛みに効く薬はありますか。',
            coachNote: '直接說症狀，比只說「藥」更容易得到正確建議。',
            branches: [
              'こちらがおすすめです。',
              '熱や咳もありますか。',
              '眠くならないタイプもあります。',
            ],
          },
          {
            title: '確認怎麼服用',
            learnerLine: 'どうやって飲みますか。一日に何回ですか。',
            coachNote: '買藥後最重要的就是確認用法。',
            branches: [
              '一日三回、食後に飲んでください。',
              '水と一緒に飲んでください。',
              '子ども用ではありません。',
            ],
          },
          {
            title: '確認其他注意事項',
            learnerLine: '副作用はありますか。ほかの薬と一緒に飲めますか。',
            coachNote: '這兩句很實用，特別是對新藥不熟時。',
            branches: [
              '眠くなる可能性があります。',
              '現在飲んでいる薬によります。',
              '心配なら医師に相談してください。',
            ],
          },
        ],
        repairPoints: [
          {
            weak: '薬ある？喉痛い。',
            better: '喉の痛みに効く薬はありますか。',
            why: '把需求與症狀連在一起，店員更容易幫你找藥。',
          },
          {
            weak: 'これ、何回？',
            better: '一日に何回ですか。',
            why: '正式完整一點，回覆也會更清楚。',
          },
        ],
      },
      english: {
        opener: 'At a pharmacy, it helps to explain the symptom first, then ask how to take the medicine and how often.',
        mission: 'You go to a pharmacy to buy medicine for a sore throat or cough and need to confirm how to take it.',
        keyPatterns: [
          'Do you have cold medicine.',
          'Do you have something for a sore throat.',
          'How should I take this.',
          'How many times a day should I take it.',
        ],
        keyVocabulary: ['cold medicine', 'pain relief', 'cough medicine', 'dosage', 'side effects'],
        exampleSets: [
          {
            title: 'Explaining what you need',
            lines: [
              'Do you have cold medicine.',
              'Do you have something for a sore throat.',
              'I have been coughing a lot.',
              'I would prefer something that does not make me sleepy.',
            ],
          },
          {
            title: 'Checking how to use it',
            lines: [
              'How should I take this.',
              'How many times a day should I take it.',
              'Should I take it after meals.',
              'Is this okay for children too.',
            ],
          },
          {
            title: 'Checking extra details',
            lines: [
              'Are there any side effects.',
              'How many days should I take this for.',
              'Can I take this with other medicine.',
              'Thank you very much.',
            ],
          },
        ],
        responseBank: [
          'This one is a common choice.',
          'Take it three times a day after meals.',
          'It may make you feel sleepy.',
          'Try it for about three days first.',
          'If it gets worse, please see a doctor.',
        ],
        steps: [
          {
            title: 'Explaining the symptom',
            learnerLine: 'Do you have something for a sore throat.',
            coachNote: 'Giving the symptom first helps the staff recommend the right category.',
            branches: [
              'Yes, this one may help.',
              'Do you also have a cough or fever?',
              'We also have a non-drowsy option.',
            ],
          },
          {
            title: 'Checking the dosage',
            learnerLine: 'How should I take this. How many times a day should I take it.',
            coachNote: 'These two questions cover the most important usage details.',
            branches: [
              'Take it three times a day after meals.',
              'Please take it with water.',
              'This is not for children.',
            ],
          },
          {
            title: 'Checking other precautions',
            learnerLine: 'Are there any side effects. Can I take this with other medicine.',
            coachNote: 'This is especially useful if you already take something else.',
            branches: [
              'It may make you feel sleepy.',
              'That depends on what other medicine you are taking.',
              'You may want to ask a doctor if you are unsure.',
            ],
          },
        ],
        repairPoints: [
          {
            weak: 'Need medicine. Throat pain.',
            better: 'Do you have something for a sore throat.',
            why: 'The improved version sounds clearer and more natural in a pharmacy.',
          },
          {
            weak: 'This, how many?',
            better: 'How many times a day should I take it.',
            why: 'This is the natural full question for dosage frequency.',
          },
        ],
      },
    },
  },
  {
    id: 'emergency-help',
    category: 'daily',
    setting: 'Emergency',
    label: '緊急求助',
    goal: '描述問題、尋求協助、說明位置與狀況。',
    difficulty: 'Intermediate',
    tags: ['emergency', 'help', 'safety'],
    languages: {
      japanese: {
        opener: '緊急情況下最重要的是簡單、清楚、直接，不需要追求太複雜的句子。',
        mission: '你需要在緊急情況下求助，例如身體不舒服、有人跌倒，或你需要叫救護車。',
        keyPatterns: [
          '助けてください。',
          '救急車を呼んでください。',
          '気分が悪いです。',
          'ここに来てください。',
        ],
        keyVocabulary: ['救急車', '気分', '倒れる', '意識', '場所'],
        exampleSets: [
          {
            title: '直接求助',
            lines: [
              '助けてください。',
              '救急車を呼んでください。',
              '誰か倒れました。',
              'すぐ来てください。',
            ],
          },
          {
            title: '描述狀況',
            lines: [
              '気分が悪いです。',
              '息が苦しいです。',
              '意識がありません。',
              '血が出ています。',
            ],
          },
          {
            title: '說明位置',
            lines: [
              '駅の前にいます。',
              'この建物の一階です。',
              '入口の近くです。',
              'ありがとうございます。',
            ],
          },
        ],
        responseBank: [
          '落ち着いてください。',
          '今、救急車を呼びます。',
          '場所を教えてください。',
          '患者さんの意識はありますか。',
          'そのまま待っていてください。',
        ],
        steps: [
          {
            title: '先求助',
            learnerLine: '助けてください。救急車を呼んでください。',
            coachNote: '緊急時先說需求，不需要先鋪陳。',
            branches: [
              '今、救急車を呼びます。',
              '何がありましたか。',
              '場所を教えてください。',
            ],
          },
          {
            title: '描述狀況',
            learnerLine: '気分が悪いです。息が苦しいです。',
            coachNote: '只說最關鍵的症狀即可。',
            branches: [
              '意識はありますか。',
              '一人ですか。',
              '座れる場所はありますか。',
            ],
          },
          {
            title: '說明位置',
            learnerLine: '駅の前にいます。入口の近くです。',
            coachNote: '位置要越具體越好。',
            branches: [
              'わかりました。そのまま待っていてください。',
              '救急車が向かっています。',
              '近くに目印はありますか。',
            ],
          },
        ],
        repairPoints: [
          {
            weak: 'だめ、早く！',
            better: '助けてください。救急車を呼んでください。',
            why: '直接又清楚，對方更容易立刻行動。',
          },
          {
            weak: 'ここ！ここ！',
            better: '駅の前にいます。入口の近くです。',
            why: '具體位置資訊比重複喊叫更有用。',
          },
        ],
      },
      english: {
        opener: 'In an emergency, short clear phrases are best. The goal is to get help fast, not to sound perfect.',
        mission: 'You need to ask for urgent help, describe the problem, and tell people where you are.',
        keyPatterns: [
          'Please help me.',
          'Please call an ambulance.',
          'I do not feel well.',
          'Please come here.',
        ],
        keyVocabulary: ['ambulance', 'conscious', 'breathing', 'bleeding', 'location'],
        exampleSets: [
          {
            title: 'Calling for help',
            lines: [
              'Please help me.',
              'Please call an ambulance.',
              'Someone has fallen down.',
              'Please come quickly.',
            ],
          },
          {
            title: 'Describing the situation',
            lines: [
              'I do not feel well.',
              'I am having trouble breathing.',
              'The person is unconscious.',
              'There is bleeding.',
            ],
          },
          {
            title: 'Giving your location',
            lines: [
              'I am in front of the station.',
              'We are on the first floor of this building.',
              'We are near the entrance.',
              'Thank you.',
            ],
          },
        ],
        responseBank: [
          'Please stay calm.',
          'I am calling an ambulance now.',
          'Can you tell me your location?',
          'Is the person conscious?',
          'Please stay where you are.',
        ],
        steps: [
          {
            title: 'Asking for urgent help',
            learnerLine: 'Please help me. Please call an ambulance.',
            coachNote: 'Start with the action you need right away.',
            branches: [
              'I am calling an ambulance now.',
              'What happened?',
              'Can you tell me your location?',
            ],
          },
          {
            title: 'Describing the condition',
            learnerLine: 'I do not feel well. I am having trouble breathing.',
            coachNote: 'Give the most serious symptom first.',
            branches: [
              'Are you alone?',
              'Is the person conscious?',
              'Can you sit down safely?',
            ],
          },
          {
            title: 'Giving the location',
            learnerLine: 'I am in front of the station, near the entrance.',
            coachNote: 'Location details help emergency help reach you faster.',
            branches: [
              'Okay, please stay where you are.',
              'The ambulance is on the way.',
              'Is there a visible sign nearby?',
            ],
          },
        ],
        repairPoints: [
          {
            weak: 'Quick, quick, bad!',
            better: 'Please help me. Please call an ambulance.',
            why: 'The improved version gives a clear action immediately.',
          },
          {
            weak: 'I am here, here.',
            better: 'I am in front of the station, near the entrance.',
            why: 'Specific location language is much more useful in an emergency.',
          },
        ],
      },
    },
  },
  {
    id: 'business-meeting',
    category: 'business',
    setting: 'Office',
    label: '商務開會',
    goal: '開場、自我回應、確認進度、提出建議、收尾與後續。',
    difficulty: 'Intermediate',
    tags: ['business', 'meeting', 'follow-up'],
    languages: {
      japanese: {
        opener: '商務情境常需要更穩定的禮貌表達，重點不只是句子對，而是語氣要專業、清楚、可回應。',
        mission: '你要在會議中說明目前進度、提出一個建議，並在最後確認下一步。',
        keyPatterns: [
          '進捗を共有させてください。',
          '一つ提案があります。',
          'この点について確認したいです。',
          '次のステップを整理しましょう。',
        ],
        keyVocabulary: ['進捗', '提案', '確認', '締め切り', '次のステップ'],
        exampleSets: [
          {
            title: '會議開場',
            lines: [
              '本日はよろしくお願いします。',
              'まず、進捗を共有させてください。',
              '簡単に現状を説明します。',
              '先に結論からお話しします。',
            ],
          },
          {
            title: '提出建議',
            lines: [
              '一つ提案があります。',
              '別の進め方も考えられると思います。',
              'この方法のほうが効率的だと思います。',
              '念のため、リスクも確認したいです。',
            ],
          },
          {
            title: '確認與收尾',
            lines: [
              'この認識でよろしいでしょうか。',
              '締め切りは来週金曜日でよろしいですか。',
              '次の担当を確認しましょう。',
              '後ほど議事メモを共有します。',
            ],
          },
        ],
        responseBank: [
          '現状は理解しました。',
          'その案は現実的だと思います。',
          'もう少し具体的に説明していただけますか。',
          'スケジュールを再確認しましょう。',
          'では、その方向で進めましょう。',
          '後ほど資料を送ってください。',
        ],
        steps: [
          {
            title: '進度更新',
            learnerLine: 'まず、進捗を共有させてください。',
            coachNote: '會議裡先說明你要做什麼，對方比較容易跟上。',
            branches: [
              'はい、お願いします。',
              '特に遅れている点はありますか。',
              '現時点での課題は何ですか。',
            ],
          },
          {
            title: '提出建議',
            learnerLine: '一つ提案があります。この方法のほうが効率的だと思います。',
            coachNote: '先提示「有一個建議」，再補理由，語氣會比較穩。',
            branches: [
              '具体的にはどう進めますか。',
              'その場合のメリットは何ですか。',
              '他の選択肢と比べてどうですか。',
            ],
          },
          {
            title: '確認下一步',
            learnerLine: '次のステップを整理しましょう。締め切りは来週金曜日でよろしいですか。',
            coachNote: '商務場景收尾要把責任與時間點說清楚。',
            branches: [
              'はい、その予定で問題ありません。',
              '担当者も確認しましょう。',
              '会議後にメモを共有してください。',
            ],
          },
        ],
        repairPoints: [
          {
            weak: '今の仕事、だいたいできました。',
            better: '現時点の進捗としては、おおむね完了しています。',
            why: '商務日語需要更精確也更穩定的表達。',
          },
          {
            weak: 'これのほうがいいと思います。',
            better: 'この方法のほうが効率的だと思います。',
            why: '補出判斷標準，建議才更有說服力。',
          },
        ],
      },
      english: {
        opener: 'Business situations require clear, professional phrasing. The goal is not just to speak politely, but to update, propose, and confirm next steps efficiently.',
        mission: 'You need to give a progress update in a meeting, make one suggestion, and confirm the next step before the meeting ends.',
        keyPatterns: [
          'Let me give a quick progress update.',
          'I would like to suggest one adjustment.',
          'I would like to confirm this point.',
          'Let us clarify the next step.',
        ],
        keyVocabulary: ['progress update', 'proposal', 'deadline', 'follow-up', 'next step'],
        exampleSets: [
          {
            title: 'Opening the meeting',
            lines: [
              'Thank you everyone for joining.',
              'Let me give a quick progress update.',
              'I will start with the current status.',
              'Let me begin with the key point.',
            ],
          },
          {
            title: 'Making a suggestion',
            lines: [
              'I would like to suggest one adjustment.',
              'There may be a more efficient way to handle this.',
              'This approach may help us move faster.',
              'We should also review the possible risks.',
            ],
          },
          {
            title: 'Closing and follow-up',
            lines: [
              'Could we confirm the deadline.',
              'Let us clarify who will handle the next step.',
              'Does this match everyone’s understanding.',
              'I will send a follow-up note after the meeting.',
            ],
          },
        ],
        responseBank: [
          'Thanks for the update.',
          'That sounds reasonable.',
          'Could you explain that in a bit more detail?',
          'Let us review the schedule once more.',
          'Let us move forward with that plan.',
          'Please share the notes afterward.',
        ],
        steps: [
          {
            title: 'Giving an update',
            learnerLine: 'Let me give a quick progress update.',
            coachNote: 'A short framing line helps the room follow your role immediately.',
            branches: [
              'Sure, go ahead.',
              'Are there any delays at this point?',
              'What is the main issue right now?',
            ],
          },
          {
            title: 'Making a proposal',
            learnerLine: 'I would like to suggest one adjustment. This approach may help us move faster.',
            coachNote: 'In business English, softening the suggestion slightly often sounds more professional.',
            branches: [
              'How would that work in practice?',
              'What is the main advantage of that approach?',
              'How does that compare with the current plan?',
            ],
          },
          {
            title: 'Confirming the next step',
            learnerLine: 'Let us clarify the next step. Could we confirm the deadline.',
            coachNote: 'Meetings usually end better when ownership and timing are explicit.',
            branches: [
              'Yes, next Friday works for us.',
              'Let us confirm the person in charge as well.',
              'Please send a short summary after the meeting.',
            ],
          },
        ],
        repairPoints: [
          {
            weak: 'Our work is almost okay now.',
            better: 'At this point, most of the work is on schedule.',
            why: 'The revised version sounds more precise and more professional.',
          },
          {
            weak: 'I think this is better.',
            better: 'I would like to suggest this approach because it may be more efficient.',
            why: 'A business suggestion is stronger when it includes a reason.',
          },
        ],
      },
    },
  },
  {
    id: 'business-introduction',
    category: 'business',
    setting: 'Office',
    label: '商務自我介紹',
    goal: '打招呼、介紹部門與角色、說明合作期待、自然收尾。',
    difficulty: 'Beginner to Intermediate',
    tags: ['business', 'introduction', 'networking'],
    languages: {
      japanese: {
        opener: '商務自我介紹重點不是說很多，而是快速讓對方知道你是誰、做什麼，以及接下來怎麼合作。',
        mission: '你第一次和合作對象見面，需要簡潔介紹自己、所屬部門，以及你接下來會負責的內容。',
        keyPatterns: [
          'はじめまして、〇〇と申します。',
          '〇〇部で働いております。',
          'このプロジェクトを担当しております。',
          '今後ともよろしくお願いいたします。',
        ],
        keyVocabulary: ['担当', '部署', '連携', '支援', '今後'],
        exampleSets: [
          {
            title: '開場與身分',
            lines: [
              'はじめまして、林と申します。',
              '営業部で働いております。',
              '今回の窓口を担当しております。',
              '本日はお時間をいただき、ありがとうございます。',
            ],
          },
          {
            title: '說明角色',
            lines: [
              '主に進行管理を担当しております。',
              '技術面の調整もサポートいたします。',
              'ご不明点があれば、私にご連絡ください。',
              '今後の連携を円滑に進めたいと考えております。',
            ],
          },
          {
            title: '禮貌收尾',
            lines: [
              'どうぞよろしくお願いいたします。',
              '今後ともよろしくお願いいたします。',
              '引き続き、よろしくお願いいたします。',
              '本日はよろしくお願いいたします。',
            ],
          },
        ],
        responseBank: [
          'こちらこそ、よろしくお願いいたします。',
          'ご担当とのこと、承知しました。',
          '後ほど詳細を共有いたします。',
          '今後の進め方も相談できればと思います。',
          'よろしくお願いします。',
        ],
        steps: [
          {
            title: '打招呼與自我介紹',
            learnerLine: 'はじめまして、林と申します。営業部で働いております。',
            coachNote: '商務場合用 申します、働いております 會更穩重。',
            branches: [
              'はじめまして、よろしくお願いいたします。',
              '本日はどうぞよろしくお願いします。',
              'ご担当者でいらっしゃいますか。',
            ],
          },
          {
            title: '說明你的角色',
            learnerLine: '今回のプロジェクトでは、進行管理を担当しております。',
            coachNote: '角色說明越具體，對方越知道之後要找誰。',
            branches: [
              '技術面のご相談も可能でしょうか。',
              '今後の窓口は林様でよろしいですか。',
              'スケジュール調整もご担当ですか。',
            ],
          },
          {
            title: '禮貌收尾',
            learnerLine: '今後ともよろしくお願いいたします。',
            coachNote: '最後一句不是裝飾，而是把合作關係收穩。',
            branches: [
              'こちらこそ、よろしくお願いいたします。',
              'では、引き続き連携させていただきます。',
              '後ほど資料を共有いたします。',
            ],
          },
        ],
        repairPoints: [
          {
            weak: '私は林です。営業部です。',
            better: 'はじめまして、林と申します。営業部で働いております。',
            why: '商務日語需要更完整的敬體與更自然的職場表達。',
          },
          {
            weak: 'これからよろしく。',
            better: '今後ともよろしくお願いいたします。',
            why: '正式商務場景需要更完整、禮貌的收尾。',
          },
        ],
      },
      english: {
        opener: 'A business introduction should be short but useful. The aim is to identify your role, your responsibility, and how the other person can work with you.',
        mission: 'You are meeting a business partner for the first time and need to introduce yourself, explain your role, and close politely.',
        keyPatterns: [
          'It is a pleasure to meet you.',
          'I work with the operations team.',
          'I will be handling this project.',
          'I look forward to working with you.',
        ],
        keyVocabulary: ['point of contact', 'operations', 'coordination', 'support', 'collaboration'],
        exampleSets: [
          {
            title: 'Greeting and identity',
            lines: [
              'It is a pleasure to meet you.',
              'My name is Grace Lin.',
              'I work with the operations team.',
              'Thank you for taking the time to meet today.',
            ],
          },
          {
            title: 'Explaining your role',
            lines: [
              'I will be handling this project.',
              'I will be your main point of contact.',
              'I will also help coordinate the timeline.',
              'Please feel free to reach out if you have any questions.',
            ],
          },
          {
            title: 'Professional closing',
            lines: [
              'I look forward to working with you.',
              'It will be great to work together.',
              'Thank you again for your time.',
              'I am glad we could connect today.',
            ],
          },
        ],
        responseBank: [
          'It is nice to meet you as well.',
          'Thanks for the introduction.',
          'I understand that you will be leading the coordination.',
          'We look forward to working with you too.',
          'Please keep us updated as things move forward.',
        ],
        steps: [
          {
            title: 'Greeting and introducing yourself',
            learnerLine: 'It is a pleasure to meet you. My name is Grace Lin.',
            coachNote: 'A calm, professional opening is enough. There is no need to sound overly enthusiastic.',
            branches: [
              'It is nice to meet you too.',
              'Thank you for joining us today.',
              'Could you tell us a little about your role as well?',
            ],
          },
          {
            title: 'Explaining your responsibility',
            learnerLine: 'I work with the operations team, and I will be handling this project.',
            coachNote: 'Combine department plus responsibility so the other side knows where you fit.',
            branches: [
              'Will you also be our main point of contact?',
              'Will you be coordinating the schedule as well?',
              'Who should we contact about technical questions?',
            ],
          },
          {
            title: 'Closing the introduction',
            learnerLine: 'I look forward to working with you.',
            coachNote: 'This is the cleanest standard closing for a first business meeting.',
            branches: [
              'Likewise, we look forward to working with you.',
              'Thank you for the introduction.',
              'Let us stay in touch as the project moves forward.',
            ],
          },
        ],
        repairPoints: [
          {
            weak: 'I am Grace and I do this project.',
            better: 'My name is Grace Lin, and I will be handling this project.',
            why: 'The revised version sounds more complete and more professional.',
          },
          {
            weak: 'Please take care of me.',
            better: 'I look forward to working with you.',
            why: 'This is the natural business equivalent in English.',
          },
        ],
      },
    },
  },
  {
    id: 'business-scheduling',
    category: 'business',
    setting: 'Office',
    label: '安排會議',
    goal: '確認時間、提出替代時段、檢查可行性、敲定安排。',
    difficulty: 'Intermediate',
    tags: ['business', 'scheduling', 'coordination'],
    languages: {
      japanese: {
        opener: '安排會議的重點是給出明確時間選項，同時保留調整空間。',
        mission: '你需要安排下一次會議，提出兩個可行時段，並確認對方是否方便。',
        keyPatterns: [
          '来週の火曜日はいかがでしょうか。',
          '別の時間でも調整可能です。',
          'ご都合はいかがでしょうか。',
          'その時間で確定しましょう。',
        ],
        keyVocabulary: ['日程', '調整', '都合', '候補', '確定'],
        exampleSets: [
          {
            title: '提出時間',
            lines: [
              '来週の火曜日はいかがでしょうか。',
              '水曜日の午後も可能です。',
              '二つ候補をお送りします。',
              '午前十時から三十分ほどを想定しています。',
            ],
          },
          {
            title: '調整與替代',
            lines: [
              '別の時間でも調整可能です。',
              'もし難しければ、木曜日でも構いません。',
              'ご都合のよい時間を教えてください。',
              '社内で確認してからご連絡します。',
            ],
          },
          {
            title: '敲定安排',
            lines: [
              'では、その時間で確定しましょう。',
              'カレンダー招待をお送りします。',
              'オンライン会議のリンクも共有します。',
              'よろしくお願いいたします。',
            ],
          },
        ],
        responseBank: [
          '火曜日の午後なら可能です。',
          'その時間で問題ありません。',
          '水曜日のほうが都合がよいです。',
          '社内で確認のうえ、ご連絡します。',
          '招待をお待ちしております。',
        ],
        steps: [
          {
            title: '提出候選時段',
            learnerLine: '来週の火曜日はいかがでしょうか。水曜日の午後も可能です。',
            coachNote: '直接給兩個候選時段，比只問「什麼時候方便」更有效率。',
            branches: [
              '火曜日の午後なら可能です。',
              '午前中のほうが都合がよいです。',
              '木曜日に変更できますか。',
            ],
          },
          {
            title: '保留調整空間',
            learnerLine: '別の時間でも調整可能です。ご都合のよい時間を教えてください。',
            coachNote: '先給選項，再表示可調整，語氣會很體貼。',
            branches: [
              'では、水曜日の午前はいかがですか。',
              '一度社内で確認します。',
              '三十分ほどで大丈夫でしょうか。',
            ],
          },
          {
            title: '確認並定案',
            learnerLine: 'では、その時間で確定しましょう。カレンダー招待をお送りします。',
            coachNote: '定案後要補下一個具體動作，對方才知道安排已完成。',
            branches: [
              'ありがとうございます。お待ちしております。',
              '会議リンクも共有してください。',
              'では、その予定で進めましょう。',
            ],
          },
        ],
        repairPoints: [
          {
            weak: '来週どうですか。',
            better: '来週の火曜日はいかがでしょうか。',
            why: '具體時間選項比模糊提問更適合商務協調。',
          },
          {
            weak: 'じゃ、その時間で。',
            better: 'では、その時間で確定しましょう。',
            why: '正式商務場景需要更完整的定案說法。',
          },
        ],
      },
      english: {
        opener: 'Scheduling becomes much easier when you offer clear options instead of vague availability questions.',
        mission: 'You need to arrange the next meeting, offer two time options, and confirm which time works best.',
        keyPatterns: [
          'Would next Tuesday work for you.',
          'I can also do Wednesday afternoon.',
          'Please let me know what works best.',
          'Let us confirm that time.',
        ],
        keyVocabulary: ['availability', 'time slot', 'calendar invite', 'confirm', 'reschedule'],
        exampleSets: [
          {
            title: 'Offering time options',
            lines: [
              'Would next Tuesday work for you.',
              'I can also do Wednesday afternoon.',
              'I would like to propose two possible time slots.',
              'I expect the meeting to take about thirty minutes.',
            ],
          },
          {
            title: 'Adjusting the schedule',
            lines: [
              'Please let me know what works best.',
              'I am happy to adjust if needed.',
              'If that is difficult, Thursday would also be fine.',
              'I will confirm internally and get back to you.',
            ],
          },
          {
            title: 'Finalizing the meeting',
            lines: [
              'Let us confirm that time.',
              'I will send a calendar invite shortly.',
              'I will also include the meeting link.',
              'Thank you, and I look forward to speaking with you then.',
            ],
          },
        ],
        responseBank: [
          'Tuesday afternoon works for us.',
          'That time should be fine.',
          'Wednesday would be better on our side.',
          'Let me check with the team first.',
          'Please send the calendar invite once confirmed.',
        ],
        steps: [
          {
            title: 'Offering time choices',
            learnerLine: 'Would next Tuesday work for you. I can also do Wednesday afternoon.',
            coachNote: 'Giving two choices usually speeds up scheduling.',
            branches: [
              'Tuesday afternoon works for us.',
              'Would Wednesday morning be possible instead?',
              'Could you suggest one more option?',
            ],
          },
          {
            title: 'Keeping the schedule flexible',
            learnerLine: 'Please let me know what works best. I am happy to adjust if needed.',
            coachNote: 'This keeps the tone cooperative without sounding uncertain.',
            branches: [
              'Thanks, we will confirm shortly.',
              'Thursday may be easier for us.',
              'We should be able to finalize this today.',
            ],
          },
          {
            title: 'Confirming the arrangement',
            learnerLine: 'Let us confirm that time. I will send a calendar invite shortly.',
            coachNote: 'Always end with one concrete follow-up action.',
            branches: [
              'Perfect, we will look out for the invite.',
              'Please include the meeting link as well.',
              'Thanks, that works for us.',
            ],
          },
        ],
        repairPoints: [
          {
            weak: 'When are you free next week.',
            better: 'Would next Tuesday work for you. I can also do Wednesday afternoon.',
            why: 'Specific options sound more efficient and more businesslike.',
          },
          {
            weak: 'Okay, then see you.',
            better: 'Let us confirm that time. I will send a calendar invite shortly.',
            why: 'The improved version clearly closes the scheduling task.',
          },
        ],
      },
    },
  },
  {
    id: 'business-followup',
    category: 'business',
    setting: 'Office',
    label: '會後追蹤',
    goal: '簡短總結、確認決議、提醒責任與截止日、表達後續支援。',
    difficulty: 'Intermediate',
    tags: ['business', 'follow-up', 'summary'],
    languages: {
      japanese: {
        opener: '會後追蹤最重要的是清楚，不是長。讓對方一眼看到結論、負責人、截止日。',
        mission: '會議結束後，你要用簡短語句確認今天的決議、下一步，以及誰負責什麼。',
        keyPatterns: [
          '本日の内容を簡単に共有します。',
          '本日の合意事項は以下の通りです。',
          '次のアクションを確認いたします。',
          'ご不明点があればお知らせください。',
        ],
        keyVocabulary: ['合意事項', 'アクション', '共有', '担当', '期限'],
        exampleSets: [
          {
            title: '開頭總結',
            lines: [
              '本日の内容を簡単に共有します。',
              '本日の合意事項は以下の通りです。',
              '先ほどの会議内容を整理いたします。',
              '簡単に要点をまとめます。',
            ],
          },
          {
            title: '確認責任與時程',
            lines: [
              '次のアクションを確認いたします。',
              '田中様に資料作成をご担当いただきます。',
              '期限は来週金曜日です。',
              '必要であれば追加で調整いたします。',
            ],
          },
          {
            title: '禮貌結尾',
            lines: [
              'ご不明点があればお知らせください。',
              '補足があればご連絡ください。',
              '引き続きよろしくお願いいたします。',
              'どうぞよろしくお願いいたします。',
            ],
          },
        ],
        responseBank: [
          'ありがとうございます。内容を確認しました。',
          '認識に相違はありません。',
          '一点だけ補足があります。',
          '期限についても承知しました。',
          '引き続きよろしくお願いいたします。',
        ],
        steps: [
          {
            title: '先總結會議重點',
            learnerLine: '本日の合意事項は以下の通りです。',
            coachNote: '先給結構，對方比較容易接收後面的資訊。',
            branches: [
              'ありがとうございます。確認します。',
              '主な決定事項は何でしたか。',
              '簡潔にまとまっていて助かります。',
            ],
          },
          {
            title: '列出下一步',
            learnerLine: '次のアクションを確認いたします。期限は来週金曜日です。',
            coachNote: '把行動和期限放在一起，是最實用的 follow-up 核心。',
            branches: [
              '担当者もその認識で問題ありません。',
              'スケジュールも承知しました。',
              '必要であれば再度調整しましょう。',
            ],
          },
          {
            title: '保留補充空間',
            learnerLine: 'ご不明点があればお知らせください。',
            coachNote: '最後留一個溫和入口，方便對方補充或修正。',
            branches: [
              'ありがとうございます。今のところ問題ありません。',
              '一点だけ補足があります。',
              '後ほど確認のうえ、ご連絡します。',
            ],
          },
        ],
        repairPoints: [
          {
            weak: '今日のこと、こんな感じです。',
            better: '本日の内容を簡単に共有します。',
            why: 'Follow-up 需要更有結構、更像正式摘要。',
          },
          {
            weak: '何かあれば言ってください。',
            better: 'ご不明点があればお知らせください。',
            why: '商務收尾通常會用更柔和且標準的說法。',
          },
        ],
      },
      english: {
        opener: 'A follow-up message should reduce confusion, not repeat the whole meeting. Keep it short, structured, and action-focused.',
        mission: 'After a meeting, you need to summarize the key decision, confirm the next action, and remind everyone of the deadline.',
        keyPatterns: [
          'I would like to briefly summarize today’s discussion.',
          'The key decisions are as follows.',
          'Let me confirm the next action items.',
          'Please let me know if I missed anything.',
        ],
        keyVocabulary: ['action item', 'deadline', 'summary', 'alignment', 'follow-up'],
        exampleSets: [
          {
            title: 'Opening the summary',
            lines: [
              'I would like to briefly summarize today’s discussion.',
              'The key decisions are as follows.',
              'Here is a short summary of today’s meeting.',
              'Let me capture the main points before we move on.',
            ],
          },
          {
            title: 'Confirming actions',
            lines: [
              'Let me confirm the next action items.',
              'Alex will prepare the revised draft.',
              'The deadline is next Friday.',
              'We can adjust further if needed.',
            ],
          },
          {
            title: 'Closing professionally',
            lines: [
              'Please let me know if I missed anything.',
              'Feel free to add any clarification.',
              'Thanks again for your time today.',
              'I look forward to the next update.',
            ],
          },
        ],
        responseBank: [
          'Thanks, this summary is clear.',
          'That matches our understanding.',
          'I have one small addition.',
          'The deadline is noted on our side.',
          'Please keep us posted on the next update.',
        ],
        steps: [
          {
            title: 'Summarizing the meeting',
            learnerLine: 'I would like to briefly summarize today’s discussion. The key decisions are as follows.',
            coachNote: 'A good follow-up starts with structure before details.',
            branches: [
              'Thanks, that is helpful.',
              'Could you also include the timeline?',
              'That matches what we discussed.',
            ],
          },
          {
            title: 'Confirming action items',
            learnerLine: 'Let me confirm the next action items. The deadline is next Friday.',
            coachNote: 'The most useful part of a follow-up is who does what by when.',
            branches: [
              'That deadline works for us.',
              'Could we confirm the owner as well?',
              'We may need a small adjustment to the timing.',
            ],
          },
          {
            title: 'Leaving room for correction',
            learnerLine: 'Please let me know if I missed anything.',
            coachNote: 'This keeps the note collaborative instead of overly final.',
            branches: [
              'Everything looks fine on our side.',
              'I have one small clarification.',
              'We will review this internally and reply if needed.',
            ],
          },
        ],
        repairPoints: [
          {
            weak: 'Today we talked and this is it.',
            better: 'I would like to briefly summarize today’s discussion.',
            why: 'The improved version sounds clearer and more professional.',
          },
          {
            weak: 'Tell me if wrong.',
            better: 'Please let me know if I missed anything.',
            why: 'This is the standard polished phrasing for a follow-up message.',
          },
        ],
      },
    },
  },
]

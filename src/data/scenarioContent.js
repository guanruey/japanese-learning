export const scenarioTracks = {
  japanese: '日本語',
  english: 'English',
}

export const scenarioModules = [
  {
    id: 'restaurant-order',
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
]

/**
 * lessonData.js — Duolingo 風格課程資料結構
 * 
 * 架構：Section（章） → Unit（單元） → Node（關卡點） → Questions（題目）
 * 
 * 題型 (type)：
 *   'mc_text'   — 選擇題（文字選項）
 *   'mc_image'  — 選擇題（圖示選項）
 *   'translate' — 翻譯題（看中文說日文 or 看日文選中文）
 *   'arrange'   — 排列題（把詞卡拼成正確句子）
 *   'listen'    — 聽力選擇（播放音頻選答案）
 *   'speak'     — 口說題（跟著說）
 */

export const JLPT_COLORS = {
  N5: { bg: 'var(--n5-bg)', text: 'var(--n5-text)', border: 'var(--n5-border)' },
  N4: { bg: 'var(--n4-bg)', text: 'var(--n4-text)', border: 'var(--n4-border)' },
  N3: { bg: 'var(--n3-bg)', text: 'var(--n3-text)', border: 'var(--n3-border)' },
  N2: { bg: 'var(--n2-bg)', text: 'var(--n2-text)', border: 'var(--n2-border)' },
  N1: { bg: 'var(--n1-bg)', text: 'var(--n1-text)', border: 'var(--n1-border)' },
}

export const SECTIONS = [
  {
    id: 'sec-1',
    title: '基礎生活日語',
    subtitle: 'JLPT N5 基礎',
    level: 'N5',
    emoji: '🌱',
    units: [
      {
        id: 'unit-1-1',
        title: '問候與自我介紹',
        emoji: '👋',
        level: 'N5',
        status: 'completed',
        nodes: [
          {
            id: 'node-1-1-1',
            title: 'こんにちは',
            type: 'vocabulary',
            status: 'completed',
            xpReward: 10,
            questions: [
              {
                type: 'mc_text',
                prompt: '「こんにちは」是什麼意思？',
                japanese: 'こんにちは',
                romaji: 'Konnichiwa',
                options: ['早安', '你好', '晚安', '再見'],
                answer: '你好',
                explanation: '「こんにちは」用於白天打招呼，相當於「你好」或「午安」。',
                skill_key: 'vocab.greetings'
              },
              {
                type: 'translate',
                prompt: '把中文翻成日文',
                source: '早安',
                options: ['こんにちは', 'おはようございます', 'こんばんは', 'さようなら'],
                answer: 'おはようございます',
                japanese: 'おはようございます',
                romaji: 'Ohayou gozaimasu',
                skill_key: 'vocab.greetings'
              },
              {
                type: 'mc_text',
                prompt: '「こんばんは」是什麼時候說的？',
                japanese: 'こんばんは',
                romaji: 'Konbanwa',
                options: ['早上', '中午', '傍晚/晚上', '睡前'],
                answer: '傍晚/晚上',
                explanation: '「こんばんは」是晚上的問候語，相當於「晚安（打招呼）」。',
              },
              {
                type: 'arrange',
                prompt: '把詞語排成正確順序',
                instruction: '「我叫田中。」',
                pieces: ['田中', 'は', 'わたし', 'です', 'と', 'いいます'],
                answer: ['わたし', 'は', '田中', 'と', 'いいます', 'です'],
                answerText: 'わたしは田中といいます。',
                romaji: 'Watashi wa Tanaka to iimasu.',
              },
              {
                type: 'speak',
                prompt: '跟著說這句話',
                japanese: 'はじめまして。よろしくおねがいします。',
                romaji: 'Hajimemashite. Yoroshiku onegaishimasu.',
                translation: '初次見面，請多指教。',
              },
            ],
          },
          {
            id: 'node-1-1-2',
            title: '數字 1–10',
            type: 'vocabulary',
            status: 'completed',
            xpReward: 10,
            questions: [
              {
                type: 'mc_text',
                prompt: '「さん」是哪個數字？',
                japanese: 'さん',
                romaji: 'san',
                options: ['1', '2', '3', '4'],
                answer: '3',
              },
              {
                type: 'mc_text',
                prompt: '「なな」或「しち」都是哪個數字？',
                japanese: 'なな / しち',
                romaji: 'nana / shichi',
                options: ['5', '6', '7', '8'],
                answer: '7',
                explanation: '「7」有兩種讀法：「なな（nana）」和「しち（shichi）」，都正確。',
              },
              {
                type: 'translate',
                prompt: '「10」的日文是？',
                source: '10',
                options: ['きゅう', 'じゅう', 'はち', 'ろく'],
                answer: 'じゅう',
                japanese: 'じゅう',
                romaji: 'juu',
              },
            ],
          },
          {
            id: 'node-1-1-3',
            title: '課節測驗',
            type: 'review',
            status: 'completed',
            xpReward: 20,
            questions: [],
          },
        ],
      },
      {
        id: 'unit-1-2',
        title: '餐廳點餐',
        emoji: '☕',
        level: 'N5',
        status: 'active',
        nodes: [
          {
            id: 'node-1-2-1',
            title: '點餐基本句',
            type: 'vocabulary',
            status: 'active',
            xpReward: 10,
            questions: [
              {
                type: 'mc_text',
                prompt: '在餐廳說「請給我這個」日文是？',
                japanese: 'これをください。',
                romaji: 'Kore wo kudasai.',
                options: ['これをください。', 'ありがとうございます。', 'すみません。', 'いただきます。'],
                answer: 'これをください。',
                explanation: '「ください」表示「請給我」，「これ」是「這個」。',
              },
              {
                type: 'translate',
                prompt: '「不好意思（叫服務生）」日文是？',
                source: '不好意思！',
                options: ['どうぞ', 'すみません', 'おねがい', 'どうも'],
                answer: 'すみません',
                japanese: 'すみません',
                romaji: 'Sumimasen',
              },
              {
                type: 'mc_text',
                prompt: '開動前說的一句話是？',
                japanese: 'いただきます。',
                romaji: 'Itadakimasu.',
                options: ['ありがとう', 'いただきます', 'ごちそうさま', 'おねがい'],
                answer: 'いただきます',
                explanation: '「いただきます」在吃飯前說，感謝食物和準備食物的人。',
              },
              {
                type: 'arrange',
                prompt: '排成正確點餐句子',
                instruction: '「請給我一杯咖啡。」',
                pieces: ['を', 'コーヒー', 'ください', 'ひとつ'],
                answer: ['コーヒー', 'を', 'ひとつ', 'ください'],
                answerText: 'コーヒーをひとつください。',
                romaji: 'Kōhī wo hitotsu kudasai.',
              },
              {
                type: 'speak',
                prompt: '跟著說這句話',
                japanese: 'コーヒーをひとつください。',
                romaji: 'Kōhī wo hitotsu kudasai.',
                translation: '請給我一杯咖啡。',
              },
            ],
          },
          {
            id: 'node-1-2-2',
            title: '食物詞彙',
            type: 'vocabulary',
            status: 'locked',
            xpReward: 10,
            questions: [
              {
                type: 'mc_text',
                prompt: '「すし」是什麼食物？',
                japanese: 'すし',
                romaji: 'Sushi',
                options: ['拉麵', '壽司', '天婦羅', '丼飯'],
                answer: '壽司',
              },
              {
                type: 'mc_text',
                prompt: '「ラーメン」念什麼？',
                japanese: 'ラーメン',
                romaji: 'Rāmen',
                options: ['壽司', '烏龍麵', '拉麵', '蕎麥麵'],
                answer: '拉麵',
              },
            ],
          },
          {
            id: 'node-1-2-3',
            title: '數量詞',
            type: 'grammar',
            status: 'locked',
            xpReward: 10,
            questions: [],
          },
          {
            id: 'node-1-2-4',
            title: '單元測驗',
            type: 'review',
            status: 'locked',
            xpReward: 25,
            questions: [],
          },
        ],
      },
    ],
  },
  {
    id: 'sec-2',
    title: '出行與交通',
    subtitle: 'JLPT N4 進階',
    level: 'N4',
    emoji: '🚃',
    units: [
      {
        id: 'unit-2-1',
        title: '問路與交通',
        emoji: '🗺️',
        level: 'N4',
        status: 'locked',
        nodes: [
          { id: 'node-2-1-1', title: '電車指引', type: 'vocabulary', status: 'locked', xpReward: 10, questions: [] },
          { id: 'node-2-1-2', title: '問路句型', type: 'grammar', status: 'locked', xpReward: 10, questions: [] },
          { id: 'node-2-1-3', title: '計程車對話', type: 'vocabulary', status: 'locked', xpReward: 15, questions: [] },
        ],
      },
      {
        id: 'unit-2-2',
        title: '飯店入住',
        emoji: '🏨',
        level: 'N4',
        status: 'locked',
        nodes: [
          { id: 'node-2-2-1', title: 'Check-in 對話', type: 'vocabulary', status: 'locked', xpReward: 10, questions: [] },
          { id: 'node-2-2-2', title: '客房需求', type: 'vocabulary', status: 'locked', xpReward: 10, questions: [] },
        ],
      },
    ],
  },
]

// ─── XP 系統 ───
export const XP_STORAGE_KEY = 'app_total_xp'
export const STREAK_STORAGE_KEY = 'app_streak_days'
export const STREAK_LAST_KEY  = 'app_streak_last_date'

export function getTotalXP() {
  return parseInt(localStorage.getItem(XP_STORAGE_KEY) || '0', 10)
}
export function addXP(amount) {
  const current = getTotalXP()
  localStorage.setItem(XP_STORAGE_KEY, String(current + amount))
  return current + amount
}

export function getStreakDays() {
  return parseInt(localStorage.getItem(STREAK_STORAGE_KEY) || '0', 10)
}

export function updateStreak() {
  const today = new Date().toDateString()
  const last  = localStorage.getItem(STREAK_LAST_KEY)
  const days  = getStreakDays()

  if (last === today) return days // already done today

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const newStreak = last === yesterday.toDateString() ? days + 1 : 1
  localStorage.setItem(STREAK_STORAGE_KEY, String(newStreak))
  localStorage.setItem(STREAK_LAST_KEY, today)
  return newStreak
}

// Daily XP goal
export const DAILY_XP_GOAL = 50
export const DAILY_XP_KEY  = 'app_daily_xp'
export const DAILY_XP_DATE = 'app_daily_xp_date'

export function getDailyXP() {
  const today = new Date().toDateString()
  if (localStorage.getItem(DAILY_XP_DATE) !== today) {
    localStorage.setItem(DAILY_XP_KEY, '0')
    localStorage.setItem(DAILY_XP_DATE, today)
  }
  return parseInt(localStorage.getItem(DAILY_XP_KEY) || '0', 10)
}

export function addDailyXP(amount) {
  const today = new Date().toDateString()
  localStorage.setItem(DAILY_XP_DATE, today)
  const current = getDailyXP()
  const next = Math.min(current + amount, DAILY_XP_GOAL * 3)
  localStorage.setItem(DAILY_XP_KEY, String(next))
  return next
}

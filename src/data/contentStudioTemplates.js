export const STUDIO_TRACKS = {
  japanese: {
    label: '日本語',
    modules: {
      grammar: {
        label: '文法',
        fields: ['level', 'pattern', 'meaning_zh', 'meaning_en', 'example_ja', 'example_zh', 'explanation'],
        example: `level: N4
pattern: 〜ている
meaning_zh: 正在...；持續處於某狀態
meaning_en: be doing; be in a state
example_ja: 彼は本を読んでいる。
example_zh: 他正在看書。
explanation: 表示動作進行中或結果狀態持續。`,
      },
      vocabulary: {
        label: '語彙',
        fields: ['level', 'kanji', 'reading', 'meaning_zh', 'meaning_en', 'pos', 'example_ja', 'example_zh'],
        example: `level: N5
kanji: 学生
reading: がくせい
meaning_zh: 學生
meaning_en: student
pos: noun
example_ja: 彼は大学生です。
example_zh: 他是大學生。`,
      },
      phrases: {
        label: '會話',
        fields: ['phrase_ja', 'reading', 'meaning_zh', 'meaning_en', 'context', 'formal', 'casual', 'example'],
        example: `phrase_ja: お願いします
reading: おねがいします
meaning_zh: 麻煩你了；拜託
meaning_en: please
context: service
formal: お願いします
casual: お願い
example: コーヒーを一杯お願いします。`,
      },
    },
  },
  english: {
    label: 'English',
    modules: {
      vocabulary: {
        label: 'Vocabulary',
        fields: ['headword', 'category', 'focus', 'register', 'meaningZh', 'nuanceNote', 'collocations', 'examples'],
        example: `headword: significant / substantial / considerable
category: Evaluation
focus: Synonym nuance
register: Formal
meaningZh: 都有「相當大」的意思，但強調點不同
nuanceNote: significant 常帶有值得注意的意涵
collocations: significant effect | substantial investment | considerable support
examples: The change had a significant effect. | The company made a substantial investment.`,
      },
      expressions: {
        label: 'Expressions',
        fields: ['pattern', 'category', 'function', 'register', 'explanationZh', 'usageNote', 'exampleSentence', 'exampleZh'],
        example: `pattern: While it is true that ..., ...
category: Contrast
function: Concession
register: Formal
explanationZh: 先承認一部分事實，再提出主要觀點
usageNote: 適合平衡論述
exampleSentence: While it is true that online learning is flexible, it can reduce interaction.
exampleZh: 雖然線上學習很彈性，但可能降低互動。`,
      },
      writing: {
        label: 'Writing',
        fields: ['category', 'errorType', 'tone', 'weakSentence', 'betterSentence', 'betterSentenceZh', 'bestSentence', 'bestSentenceZh', 'explanationZh', 'coachingTip'],
        example: `category: Grammar
errorType: Double connector
tone: General
weakSentence: Because many students feel stressed, so they cannot focus.
betterSentence: Because many students feel stressed, they cannot focus.
betterSentenceZh: 因為許多學生感到壓力很大，所以他們無法專心。
bestSentence: When students are under too much stress, they often struggle to focus.
bestSentenceZh: 當學生承受太多壓力時，他們往往很難專心。
explanationZh: because 與 so 不會一起用在同一組因果
coachingTip: 先刪掉其中一個連接詞。`,
      },
      reading: {
        label: 'Reading',
        fields: ['title', 'topic', 'difficulty', 'questionFocus', 'passage', 'summaryZh'],
        example: `title: Why Shorter Meetings Can Improve Team Communication
topic: Work and communication
difficulty: GEPT Upper-Intermediate
questionFocus: Main idea
passage: Many organizations assume that longer meetings lead to better decisions...
summaryZh: 作者主張短會議在有背景資訊的情況下可能更清楚。`,
      },
    },
  },
}

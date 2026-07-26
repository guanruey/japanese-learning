export const CONTRASTIVE_ERRORS = {
  'zh-Hant': {
    'ja': [
      {
        skill_key: 'grammar.particles_wa_ga',
        error_type: 'topic_subject_confusion',
        native_hint_text: '在中文裡我們沒有「主題助詞」的概念，所以你很容易把「は(wa)」和「が(ga)」搞混。糾錯時請特別提醒：描述已知主題或大範圍用「は」，描述新發現或特定主語用「が」。'
      },
      {
        skill_key: 'grammar.verb_tense',
        error_type: 'missing_past_tense',
        native_hint_text: '中文動詞不會隨時間變形（我們只加「了」），因此你常忘記把日文動詞轉為過去式（如 〜ました）。糾錯時請明確指出時態的錯誤，並用中文的「了」來對比解釋。'
      },
      {
        skill_key: 'grammar.honorifics',
        error_type: 'casual_in_formal_setting',
        native_hint_text: '中文的敬語結構較單純，你可能會在需要用「です/ます」的場合不小心用了常體。糾錯時請溫和提醒社交場合的遠近感。'
      },
      {
        skill_key: 'grammar.transitive_intransitive',
        error_type: 'verb_type_confusion',
        native_hint_text: '中文的他動詞和自動詞經常是同一個字（例如：門「開」了 / 我「開」門），但日文通常是兩個不同的字（開く/開ける）。糾錯時請用「自動發生的狀態」與「人為造成的動作」來幫他區分。'
      }
    ]
  }
}

// Helper function to extract applicable rules
export function getContrastiveRules(nativeLang, targetLang, weaknesses) {
  if (!CONTRASTIVE_ERRORS[nativeLang] || !CONTRASTIVE_ERRORS[nativeLang][targetLang]) return [];
  
  const rules = CONTRASTIVE_ERRORS[nativeLang][targetLang];
  // Only return rules where weakness > 50
  return rules.filter(r => weaknesses[r.skill_key] && weaknesses[r.skill_key] > 50).map(r => r.native_hint_text);
}

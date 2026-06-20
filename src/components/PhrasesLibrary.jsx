import { useState, useMemo } from 'react'
import { speak } from '../utils/speech'
import './PhrasesLibrary.css'

const PHRASES = [
  { id: 1, category: '挨拶', phrase_ja: 'おはようございます', formal: 'おはようございます', casual: 'おはよう', meaning_zh: '早安', context: '早上問候', example: 'おはようございます！今日もよろしくお願いします。' },
  { id: 2, category: '挨拶', phrase_ja: 'こんにちは', formal: 'こんにちは', casual: 'やあ／こんにちは', meaning_zh: '你好', context: '白天問候', example: 'こんにちは、お元気ですか？' },
  { id: 3, category: '挨拶', phrase_ja: 'こんばんは', formal: 'こんばんは', casual: 'こんばんは', meaning_zh: '晚安（問候）', context: '晚上問候', example: 'こんばんは！今日はありがとうございました。' },
  { id: 4, category: '挨拶', phrase_ja: 'ありがとうございます', formal: 'ありがとうございます', casual: 'ありがとう／ありがとね', meaning_zh: '謝謝', context: '表達感謝', example: 'お手伝いいただき、ありがとうございます。' },
  { id: 5, category: '挨拶', phrase_ja: 'すみません', formal: 'すみません／失礼します', casual: 'ごめん', meaning_zh: '不好意思／對不起', context: '道歉或引起注意', example: 'すみません、駅はどこですか？' },
  { id: 6, category: '挨拶', phrase_ja: 'よろしくお願いします', formal: 'よろしくお願いします', casual: 'よろしく', meaning_zh: '請多多指教', context: '初次見面或請求幫助', example: 'はじめまして、田中です。よろしくお願いします。' },
  { id: 7, category: '挨拶', phrase_ja: 'お疲れ様です', formal: 'お疲れ様でした', casual: 'お疲れ', meaning_zh: '辛苦了', context: '工作結束時', example: 'お疲れ様です！今日もありがとうございました。' },
  { id: 8, category: '挨拶', phrase_ja: 'いただきます', formal: 'いただきます', casual: 'いただきます', meaning_zh: '我開動了', context: '用餐前', example: 'では、いただきます！' },
  { id: 9, category: '挨拶', phrase_ja: 'ごちそうさまでした', formal: 'ごちそうさまでした', casual: 'ごちそうさま', meaning_zh: '我吃飽了（謝謝款待）', context: '用餐後', example: 'ごちそうさまでした。とても美味しかったです。' },
  { id: 10, category: '買い物', phrase_ja: 'これをください', formal: 'これをいただけますか', casual: 'これください', meaning_zh: '請給我這個', context: '購物時', example: 'すみません、これをください。' },
  { id: 11, category: '買い物', phrase_ja: 'いくらですか', formal: 'お値段はいくらですか', casual: 'いくら？', meaning_zh: '多少錢？', context: '詢問價格', example: 'すみません、これはいくらですか？' },
  { id: 12, category: '買い物', phrase_ja: 'カードで払えますか', formal: 'カードでお支払いできますか', casual: 'カード使える？', meaning_zh: '可以刷卡嗎？', context: '付款時', example: 'カードで払えますか？' },
  { id: 13, category: '買い物', phrase_ja: '試着してもいいですか', formal: '試着してもよろしいですか', casual: '着てみていい？', meaning_zh: '可以試穿嗎？', context: '試穿衣服', example: 'この服、試着してもいいですか？' },
  { id: 14, category: '買い物', phrase_ja: 'レシートをください', formal: 'レシートをいただけますか', casual: 'レシートちょうだい', meaning_zh: '請給我收據', context: '結帳後', example: 'レシートをください。' },
  { id: 15, category: '道案内', phrase_ja: '〜はどこですか', formal: '〜はどちらでしょうか', casual: '〜どこ？', meaning_zh: '〜在哪裡？', context: '問路', example: '駅はどこですか？' },
  { id: 16, category: '道案内', phrase_ja: 'まっすぐ行ってください', formal: 'まっすぐお進みください', casual: 'まっすぐ行って', meaning_zh: '請直走', context: '指路', example: 'まっすぐ行って、右に曲がってください。' },
  { id: 17, category: '道案内', phrase_ja: '右／左に曲がってください', formal: '右／左にお曲がりください', casual: '右／左に曲がって', meaning_zh: '請右轉／左轉', context: '指路', example: '次の角を左に曲がってください。' },
  { id: 18, category: '道案内', phrase_ja: '歩いて何分かかりますか', formal: '徒歩で何分ほどかかりますか', casual: '歩いて何分？', meaning_zh: '走路需要幾分鐘？', context: '詢問距離', example: '駅まで歩いて何分かかりますか？' },
  { id: 19, category: 'レストラン', phrase_ja: '〜人です', formal: '〜名でございます', casual: '〜人', meaning_zh: '〜位（人數）', context: '餐廳預約或等位', example: '2人です。席はありますか？' },
  { id: 20, category: 'レストラン', phrase_ja: 'おすすめは何ですか', formal: 'おすすめのメニューはございますか', casual: 'おすすめ何？', meaning_zh: '推薦什麼？', context: '詢問推薦菜色', example: 'すみません、おすすめは何ですか？' },
  { id: 21, category: 'レストラン', phrase_ja: '〜をひとつお願いします', formal: '〜をひとつお願いします', casual: '〜ひとつ', meaning_zh: '請給我一個〜', context: '點餐', example: 'ラーメンをひとつお願いします。' },
  { id: 22, category: 'レストラン', phrase_ja: 'アレルギーがあります', formal: 'アレルギーがございます', casual: 'アレルギーある', meaning_zh: '我有過敏', context: '告知飲食限制', example: 'えびのアレルギーがあります。大丈夫ですか？' },
  { id: 23, category: '病院', phrase_ja: '〜が痛いです', formal: '〜が痛くて困っています', casual: '〜が痛い', meaning_zh: '〜很痛', context: '就醫時描述症狀', example: '頭が痛いです。熱もあります。' },
  { id: 24, category: '病院', phrase_ja: '薬をください', formal: 'お薬を処方していただけますか', casual: '薬ください', meaning_zh: '請給我藥', context: '取藥', example: '痛み止めの薬をください。' },
  { id: 25, category: '職場', phrase_ja: 'ご確認をお願いします', formal: 'ご確認のほどよろしくお願いします', casual: '確認して', meaning_zh: '請確認一下', context: '工作中請求確認', example: 'この書類をご確認をお願いします。' },
  { id: 26, category: '職場', phrase_ja: 'よろしいでしょうか', formal: 'よろしいでしょうか', casual: 'いい？', meaning_zh: '可以嗎？', context: '詢問許可', example: '少しよろしいでしょうか？ご相談があります。' },
  { id: 27, category: '職場', phrase_ja: 'お世話になっております', formal: 'お世話になっております', casual: 'お世話になっています', meaning_zh: '承蒙關照', context: '商業書信或電話開頭', example: 'いつもお世話になっております。田中でございます。' },
  { id: 28, category: '気持ち', phrase_ja: '大丈夫ですか', formal: 'ご体調はよろしいですか', casual: '大丈夫？', meaning_zh: '你還好嗎？', context: '關心對方', example: '顔色が悪いですね。大丈夫ですか？' },
  { id: 29, category: '気持ち', phrase_ja: '嬉しいです', formal: '大変嬉しく思います', casual: '嬉しい！', meaning_zh: '很高興', context: '表達喜悅', example: 'プレゼントをありがとう。とても嬉しいです。' },
  { id: 30, category: '気持ち', phrase_ja: 'すごいですね', formal: '素晴らしいですね', casual: 'すごい！', meaning_zh: '好厲害！', context: '表達讚嘆', example: 'N1に合格したんですか？すごいですね！' },
]

const CATEGORIES = ['すべて', '挨拶', '買い物', '道案内', 'レストラン', '病院', '職場', '気持ち']

export default function PhrasesLibrary() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('すべて')

  const filtered = useMemo(() => {
    let result = PHRASES
    if (filterCategory !== 'すべて') result = result.filter(p => p.category === filterCategory)
    if (searchTerm) {
      const t = searchTerm.toLowerCase()
      result = result.filter(p =>
        (p.phrase_ja || '').includes(searchTerm) ||
        (p.meaning_zh || '').includes(searchTerm) ||
        (p.context || '').includes(searchTerm)
      )
    }
    return result
  }, [searchTerm, filterCategory])

  return (
    <div className="phrases-library">
      <div className="browser-controls">
        <input
          type="text"
          placeholder="フレーズを検索（例：ありがとう、いくら）"
          className="search-input"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="filter-buttons">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="results-info">
        <p>{filtered.length} 件見つかりました</p>
      </div>

      <div className="phrase-cards">
        {filtered.map(p => (
          <div key={p.id} className="phrase-card">
            <div className="phrase-header">
              <div className="phrase-main">
                <button className="speak-btn" onClick={() => speak(p.phrase_ja)} title="読む">🔊</button>
                <h3 className="phrase-ja">{p.phrase_ja}</h3>
              </div>
              <span className="category-badge">{p.category}</span>
            </div>

            <div className="phrase-meaning">
              <span className="meaning-zh">{p.meaning_zh}</span>
              {p.context && <span className="context">（{p.context}）</span>}
            </div>

            <div className="phrase-variants">
              <div className="variant">
                <span className="variant-label">丁寧</span>
                <span className="variant-text">{p.formal}</span>
              </div>
              <div className="variant">
                <span className="variant-label">普通</span>
                <span className="variant-text">{p.casual}</span>
              </div>
            </div>

            {p.example && (
              <div className="phrase-example">
                <div className="example-header">
                  <p className="example-ja">{p.example}</p>
                  <button className="speak-btn" onClick={() => speak(p.example)} title="読む">🔊</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

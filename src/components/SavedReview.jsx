import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { fallbackPhrases } from '../data/phrases'
import { speak } from '../utils/speech'
import FuriganaText from './FuriganaText'
import './SavedReview.css'

export default function SavedReview({
  grammarData = [],
  savedGrammarIds = [],
  savedVocabularyIds = [],
  savedPhraseIds = [],
  readingMode = 'furigana',
  onToggleGrammarSave,
  onToggleVocabSave,
  onTogglePhraseSave,
  englishExpressionsData = [],
  englishVocabData = [],
  savedEnglishExpressionIds = [],
  savedEnglishVocabIds = [],
  onToggleEnglishExpressionSave,
  onToggleEnglishVocabSave,
}) {
  const [vocabData, setVocabData] = useState([])
  const [phraseData, setPhraseData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const fetchVocab = savedVocabularyIds.length > 0
      ? supabase.from('vocabulary').select('*').in('id', savedVocabularyIds)
      : Promise.resolve({ data: [] })

    const fetchPhrases = savedPhraseIds.length > 0
      ? supabase.from('phrases').select('*').in('id', savedPhraseIds.map(String))
      : Promise.resolve({ data: [] })

    Promise.all([fetchVocab, fetchPhrases]).then(([vRes, pRes]) => {
      if (cancelled) return
      const supabaseIds = new Set((pRes.data || []).map(p => String(p.id)))
      const localExtra = fallbackPhrases.filter(p =>
        savedPhraseIds.some(id => String(id) === String(p.id)) && !supabaseIds.has(String(p.id))
      )
      setVocabData(vRes.data || [])
      setPhraseData([...(pRes.data || []), ...localExtra])
      setLoading(false)
    }).catch(() => {
      if (cancelled) return
      const local = fallbackPhrases.filter(p => savedPhraseIds.some(id => String(id) === String(p.id)))
      setPhraseData(local)
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [savedVocabularyIds.join(','), savedPhraseIds.join(',')])

  const savedGrammar = grammarData.filter(g => savedGrammarIds.includes(g.id))
  const savedEnglishExpressions = englishExpressionsData.filter(e => savedEnglishExpressionIds.includes(e.id))
  const savedEnglishVocab = englishVocabData.filter(v => savedEnglishVocabIds.includes(v.id))
  const total = savedGrammar.length + vocabData.length + phraseData.length + savedEnglishExpressions.length + savedEnglishVocab.length

  if (loading) return <div className="loading">読み込み中...</div>

  if (total === 0) {
    return (
      <div className="saved-review saved-review--empty">
        <p className="saved-review__empty-title">尚未保存任何項目</p>
        <p className="saved-review__empty-hint">
          在文法、語彙、句型頁面點擊「☆ 保存」，即可將項目加入此處集中複習。
        </p>
      </div>
    )
  }

  return (
    <div className="saved-review">
      <p className="saved-review__summary">
        已保存：文法 {savedGrammar.length} 件・語彙 {vocabData.length} 件・句型 {phraseData.length} 件・英文表達 {savedEnglishExpressions.length} 件・英文詞組 {savedEnglishVocab.length} 件
      </p>

      {savedGrammar.length > 0 && (
        <section className="saved-section">
          <h2 className="saved-section__title">文法</h2>
          <div className="saved-section__cards">
            {savedGrammar.map(g => (
              <div key={g.id} className={`grammar-card ${g.level?.toLowerCase()}`}>
                <div className="card-header">
                  <div className="card-main">
                    <button className="speak-btn" onClick={() => speak(g.pattern)} title="読む">🔊</button>
                    <h3 className="pattern">
                      <FuriganaText text={g.pattern} reading={g.reading} mode={readingMode} />
                    </h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      className="save-btn is-saved"
                      onClick={() => onToggleGrammarSave?.(g.id)}
                      aria-pressed
                      title="取消保存"
                    >★ 保存済み</button>
                    <span className={`level-badge ${g.level?.toLowerCase()}`}>{g.level}</span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="field"><span className="label">意味</span><span className="content">{g.meaning_zh}</span></div>
                  {g.example_ja && (
                    <div className="field">
                      <span className="label">例</span>
                      <span className="content">
                        <FuriganaText text={g.example_ja} reading={g.example_reading} mode={readingMode} />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {vocabData.length > 0 && (
        <section className="saved-section">
          <h2 className="saved-section__title">語彙</h2>
          <div className="saved-section__cards">
            {vocabData.map(v => (
              <div key={v.id} className={`vocab-card ${v.level?.toLowerCase()}`}>
                <div className="card-header">
                  <div className="card-main">
                    <button className="speak-btn" onClick={() => speak(v.kanji || v.reading)} title="読む">🔊</button>
                    <h3 className="kanji">
                      <FuriganaText text={v.kanji || v.reading} reading={v.reading} mode={readingMode} />
                    </h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      className="save-btn is-saved"
                      onClick={() => onToggleVocabSave?.(v.id)}
                      aria-pressed
                      title="取消保存"
                    >★ 保存済み</button>
                    <span className={`level-badge ${v.level?.toLowerCase()}`}>{v.level}</span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="field"><span className="label">意味</span><span className="content">{v.meaning_zh}</span></div>
                  {v.example_ja && (
                    <div className="field">
                      <span className="label">例</span>
                      <span className="content">
                        <FuriganaText text={v.example_ja} reading={v.example_reading} mode={readingMode} />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {phraseData.length > 0 && (
        <section className="saved-section">
          <h2 className="saved-section__title">会話フレーズ</h2>
          <div className="saved-section__cards">
            {phraseData.map(p => (
              <div key={p.id} className="phrase-card">
                <div className="phrase-header">
                  <div className="phrase-main">
                    <button className="speak-btn" onClick={() => speak(p.phrase_ja)} title="読む">🔊</button>
                    <h3 className="phrase-ja">
                      <FuriganaText text={p.phrase_ja} reading={p.reading} mode={readingMode} />
                    </h3>
                  </div>
                  <div className="phrase-badges">
                    <button
                      className="save-btn is-saved"
                      onClick={() => onTogglePhraseSave?.(p.id)}
                      aria-pressed
                      title="取消保存"
                    >★ 保存済み</button>
                    <span className="category-badge">{p.category}</span>
                  </div>
                </div>
                <div className="phrase-meaning">
                  <span className="meaning-zh">{p.meaning_zh}</span>
                  {p.context && <span className="context">（{p.context}）</span>}
                </div>
                <div className="phrase-variants">
                  <div className="variant"><span className="variant-label">丁寧</span><span className="variant-text">{p.formal}</span></div>
                  <div className="variant"><span className="variant-label">普通</span><span className="variant-text">{p.casual}</span></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {savedEnglishExpressions.length > 0 && (
        <section className="saved-section">
          <h2 className="saved-section__title">英文表達句型</h2>
          <div className="saved-section__cards">
            {savedEnglishExpressions.map(e => (
              <div key={e.id} className="saved-english-card">
                <div className="saved-english-card__header">
                  <div>
                    <span className="saved-english-card__meta">{e.category} · {e.register}</span>
                    <h3 className="saved-english-card__pattern">{e.pattern}</h3>
                  </div>
                  <button
                    className="english-save-btn is-saved"
                    onClick={() => onToggleEnglishExpressionSave?.(e.id)}
                    title="取消儲存"
                  >★</button>
                </div>
                <p className="saved-english-card__zh">{e.explanationZh}</p>
                <blockquote className="saved-english-card__example">{e.exampleSentence}</blockquote>
                <p className="saved-english-card__example-zh">{e.exampleZh}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {savedEnglishVocab.length > 0 && (
        <section className="saved-section">
          <h2 className="saved-section__title">英文精準詞組</h2>
          <div className="saved-section__cards">
            {savedEnglishVocab.map(v => (
              <div key={v.id} className="saved-english-card">
                <div className="saved-english-card__header">
                  <div>
                    <span className="saved-english-card__meta">{v.category} · {v.register}</span>
                    <h3 className="saved-english-card__pattern">{v.headword}</h3>
                  </div>
                  <button
                    className="english-save-btn is-saved"
                    onClick={() => onToggleEnglishVocabSave?.(v.id)}
                    title="取消儲存"
                  >★</button>
                </div>
                <p className="saved-english-card__zh">{v.meaningZh}</p>
                <p className="saved-english-card__note">{v.nuanceNote}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../supabase'
import { speak } from '../utils/speech'
import { vocabularyReadings } from '../data/generatedReadings'
import FuriganaText from './FuriganaText'
import './VocabularyBrowser.css'

const POS_LABELS = {
  noun: '名詞',
  verb: '動詞',
  'i-adjective': 'い形容詞',
  'na-adjective': 'な形容詞',
  adverb: '副詞',
  particle: '助詞',
  expression: '表現',
  conjunction: '接続詞',
  counter: '助数詞',
}

function mergeVocabularyReadings(rows = []) {
  return rows.map((row) => {
    const fallback = vocabularyReadings[row.id] || {}
    return {
      ...row,
      example_reading: row.example_reading || fallback.example_reading || null,
    }
  })
}

export default function VocabularyBrowser({ initialLevel = 'all', initialPos = 'all', readingMode = 'furigana', savedIds = [], onToggleSave }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterPos, setFilterPos] = useState('all')

  useEffect(() => {
    loadVocabulary()
  }, [])

  useEffect(() => {
    setFilterLevel(initialLevel || 'all')
  }, [initialLevel])

  useEffect(() => {
    setFilterPos(initialPos || 'all')
  }, [initialPos])

  const loadVocabulary = async () => {
    try {
      const { data: rows, error } = await supabase
        .from('vocabulary')
        .select('*')
        .order('level, id')
      if (error) throw error
      setData(mergeVocabularyReadings(rows || []))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    let result = data
    if (filterLevel !== 'all') result = result.filter(v => v.level === filterLevel)
    if (filterPos !== 'all') result = result.filter(v => v.pos === filterPos)
    if (searchTerm) {
      const t = searchTerm.toLowerCase()
      result = result.filter(v =>
        (v.kanji || '').toLowerCase().includes(t) ||
        (v.reading || '').includes(searchTerm) ||
        (v.meaning_zh || '').includes(searchTerm) ||
        (v.meaning_en || '').toLowerCase().includes(t) ||
        (v.example_reading || '').includes(searchTerm)
      )
    }
    return result
  }, [data, searchTerm, filterLevel, filterPos])

  if (loading) return <div className="loading">読み込み中...</div>

  return (
    <div className="vocabulary-browser">
      <div className="browser-controls">
        <input
          type="text"
          placeholder="単語を検索（例：学生、がくせい、student）"
          className="search-input"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="filter-buttons">
          {['all', 'N5', 'N4'].map(lvl => (
            <button
              key={lvl}
              className={`filter-btn ${filterLevel === lvl ? 'active' : ''}`}
              onClick={() => setFilterLevel(lvl)}
            >
              {lvl === 'all' ? 'すべて' : `${lvl} のみ`}
            </button>
          ))}
          <span className="filter-divider">|</span>
          {['all', 'noun', 'verb', 'i-adjective', 'na-adjective', 'adverb'].map(pos => (
            <button
              key={pos}
              className={`filter-btn ${filterPos === pos ? 'active' : ''}`}
              onClick={() => setFilterPos(pos)}
            >
              {pos === 'all' ? '品詞すべて' : POS_LABELS[pos] || pos}
            </button>
          ))}
        </div>
      </div>

      <div className="results-info">
        <p>{filtered.length} 件見つかりました</p>
      </div>

      <div className="vocab-cards">
        {filtered.length === 0 ? (
          <div className="no-results">検索結果がありません</div>
        ) : (
          filtered.map(v => (
            <div key={v.id} className={`vocab-card ${v.level?.toLowerCase()}`}>
              <div className="vocab-header">
                <div className="vocab-title">
                  <button className="speak-btn" onClick={() => speak(v.kanji || v.reading)} title="読む">🔊</button>
                  <h3 className="kanji">
                    {v.kanji ? (
                      <FuriganaText text={v.kanji} reading={v.reading} mode={readingMode} />
                    ) : (
                      v.reading
                    )}
                  </h3>
                  {v.kanji && readingMode === 'off' && <span className="reading">{v.reading}</span>}
                </div>
                <div className="vocab-badges">
                  <button
                    type="button"
                    className={savedIds.includes(v.id) ? 'save-btn is-saved' : 'save-btn'}
                    onClick={() => onToggleSave?.(v.id)}
                    aria-pressed={savedIds.includes(v.id)}
                    title={savedIds.includes(v.id) ? '保存済み' : '保存する'}
                  >
                    {savedIds.includes(v.id) ? '★ 保存済み' : '☆ 保存'}
                  </button>
                  <span className={`level-badge ${v.level?.toLowerCase()}`}>{v.level}</span>
                  {v.pos && <span className="pos-badge">{POS_LABELS[v.pos] || v.pos}</span>}
                </div>
              </div>

              <div className="vocab-meanings">
                <div className="meaning-item">
                  <span className="label">中文</span>
                  <span className="content">{v.meaning_zh}</span>
                </div>
                <div className="meaning-item">
                  <span className="label">English</span>
                  <span className="content">{v.meaning_en}</span>
                </div>
              </div>

              {v.example_ja && (
                <div className="vocab-example">
                  <div className="example-header">
                    <p className="example-ja">
                      {v.example_reading ? (
                        <FuriganaText text={v.example_ja} reading={v.example_reading} mode={readingMode} />
                      ) : (
                        v.example_ja
                      )}
                    </p>
                    <button className="speak-btn" onClick={() => speak(v.example_ja)} title="読む">🔊</button>
                  </div>
                  <p className="example-zh">{v.example_zh}</p>
                </div>
              )}

              {v.synonyms?.length > 0 && (
                <div className="vocab-tags">
                  <span className="tag-label">類義語：</span>
                  {v.synonyms.map((s, i) => <span key={i} className="tag synonym">{s}</span>)}
                </div>
              )}

              {v.collocations?.length > 0 && (
                <div className="vocab-tags">
                  <span className="tag-label">搭配：</span>
                  {v.collocations.slice(0, 3).map((c, i) => <span key={i} className="tag collocation">{c}</span>)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

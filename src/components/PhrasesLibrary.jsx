import { useState, useMemo, useEffect } from 'react'
import { supabase } from '../supabase'
import { speak } from '../utils/speech'
import FuriganaText from './FuriganaText'
import { fallbackPhrases } from '../data/phrases'
import './PhrasesLibrary.css'

const CATEGORIES = ['全部', '問候', '購物', '問路', '餐廳', '就醫', '職場', '情感', '交通', '住宿', '標示']

export default function PhrasesLibrary({ initialCategory = '全部', readingMode = 'furigana', savedIds = [], onToggleSave }) {
  const [data, setData] = useState(fallbackPhrases)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('全部')

  useEffect(() => {
    setFilterCategory(initialCategory || '全部')
  }, [initialCategory])

  useEffect(() => {
    loadPhrases()
  }, [])

  const loadPhrases = async () => {
    try {
      const { data: rows, error } = await supabase.from('phrases').select('*').order('id')
      if (error) throw error
      if (rows && rows.length > 0) {
        setData(rows)
      } else {
        setData(fallbackPhrases)
      }
    } catch (error) {
      console.error(error)
      setData(fallbackPhrases)
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    let result = data
    if (filterCategory !== '全部') result = result.filter(p => p.category === filterCategory)
    if (searchTerm) {
      result = result.filter(p =>
        (p.phrase_ja || '').includes(searchTerm) ||
        (p.reading || '').includes(searchTerm) ||
        (p.meaning_zh || '').includes(searchTerm) ||
        (p.context || '').includes(searchTerm) ||
        (p.example || '').includes(searchTerm)
      )
    }
    return result
  }, [data, searchTerm, filterCategory])

  if (loading) return <div className="loading">読み込み中...</div>

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
                <h3 className="phrase-ja">
                  <FuriganaText text={p.phrase_ja} reading={p.reading} mode={readingMode} />
                </h3>
              </div>
              <div className="phrase-badges">
                <button
                  type="button"
                  className={savedIds.includes(p.id) ? 'save-btn is-saved' : 'save-btn'}
                  onClick={() => onToggleSave?.(p.id)}
                  aria-pressed={savedIds.includes(p.id)}
                  title={savedIds.includes(p.id) ? '保存済み' : '保存する'}
                >
                  {savedIds.includes(p.id) ? '★ 保存済み' : '☆ 保存'}
                </button>
                <span className="category-badge">{p.category}</span>
              </div>
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
                  <p className="example-ja">
                    <FuriganaText text={p.example} reading={p.example_reading} mode={readingMode} />
                  </p>
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

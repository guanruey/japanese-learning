import { useState, useMemo } from 'react'
import './GrammarBrowser.css'

export default function GrammarBrowser({ data }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState('all')

  const filtered = useMemo(() => {
    let result = data || []

    if (filterLevel !== 'all') {
      result = result.filter(g => g.level === filterLevel)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(g =>
        (g.pattern || '').toLowerCase().includes(term) ||
        (g.meaning_zh || '').toLowerCase().includes(term) ||
        (g.example_ja || '').includes(searchTerm)
      )
    }

    return result
  }, [data, searchTerm, filterLevel])

  return (
    <div className="grammar-browser">
      <div className="browser-controls">
        <input
          type="text"
          placeholder="文法を検索（例：～ます、～ている）"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterLevel === 'all' ? 'active' : ''}`}
            onClick={() => setFilterLevel('all')}
          >
            すべて
          </button>
          <button
            className={`filter-btn ${filterLevel === 'N5' ? 'active' : ''}`}
            onClick={() => setFilterLevel('N5')}
          >
            N5 のみ
          </button>
          <button
            className={`filter-btn ${filterLevel === 'N4' ? 'active' : ''}`}
            onClick={() => setFilterLevel('N4')}
          >
            N4 のみ
          </button>
        </div>
      </div>

      <div className="results-info">
        <p>{filtered.length} 件見つかりました</p>
      </div>

      <div className="grammar-cards">
        {filtered.length === 0 ? (
          <div className="no-results">検索結果がありません</div>
        ) : (
          filtered.map((grammar) => (
            <div key={grammar.id} className={`grammar-card ${grammar.level?.toLowerCase()}`}>
              <div className="card-header">
                <h3 className="pattern">{grammar.pattern}</h3>
                <span className={`level-badge ${grammar.level?.toLowerCase()}`}>
                  {grammar.level}
                </span>
              </div>

              <div className="card-meanings">
                <div className="meaning">
                  <span className="label">中文</span>
                  <span className="content">{grammar.meaning_zh}</span>
                </div>
                <div className="meaning">
                  <span className="label">英文</span>
                  <span className="content">{grammar.meaning_en}</span>
                </div>
              </div>

              <div className="card-example">
                <p className="example-ja">{grammar.example_ja}</p>
                <p className="example-zh">{grammar.example_zh}</p>
              </div>

              {grammar.explanation && (
                <div className="card-explanation">
                  💡 {grammar.explanation}
                </div>
              )}

              {grammar.common_mistakes && grammar.common_mistakes.length > 0 && (
                <div className="card-mistakes">
                  <strong>⚠ 常見錯誤</strong>
                  <ul>
                    {grammar.common_mistakes.slice(0, 2).map((mistake, i) => (
                      <li key={i}>{mistake}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

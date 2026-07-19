import { useEffect, useMemo, useState } from 'react'
import './EnglishExpressionsBrowser.css'

const FILTER_ALL = 'All'

function collectOptions(items, key) {
  return [FILTER_ALL, ...new Set(items.map((item) => item[key]).filter(Boolean))]
}

export default function EnglishExpressionsBrowser({ data = [], savedIds = [], onToggleSave }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(FILTER_ALL)
  const [fn, setFn] = useState(FILTER_ALL)
  const [register, setRegister] = useState(FILTER_ALL)
  const [activeId, setActiveId] = useState(data[0]?.id || null)

  useEffect(() => {
    if (!data.some((item) => item.id === activeId)) {
      setActiveId(data[0]?.id || null)
    }
  }, [activeId, data])

  const categories = useMemo(() => collectOptions(data, 'category'), [data])
  const functions = useMemo(() => collectOptions(data, 'function'), [data])
  const registers = useMemo(() => collectOptions(data, 'register'), [data])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return data.filter((item) => {
      if (category !== FILTER_ALL && item.category !== category) return false
      if (fn !== FILTER_ALL && item.function !== fn) return false
      if (register !== FILTER_ALL && item.register !== register) return false

      if (!normalized) return true

      const haystacks = [
        item.pattern,
        item.explanationZh,
        item.exampleSentence,
        item.exampleZh,
        item.function,
        item.category,
        item.register,
        item.usageNote,
        ...(item.tags || []),
      ]

      return haystacks.some((value) => (value || '').toLowerCase().includes(normalized))
    })
  }, [category, data, fn, query, register])

  const activeItem = filtered.find((item) => item.id === activeId) || filtered[0] || null

  useEffect(() => {
    if (activeItem && activeItem.id !== activeId) {
      setActiveId(activeItem.id)
    }
  }, [activeId, activeItem])

  return (
    <section className="english-expressions">
      <div className="english-expressions__header">
        <div>
          <p className="english-expressions__eyebrow">Live Module</p>
          <h2>Expressions Studio</h2>
          <p className="english-expressions__description">
            Study reusable patterns for argument, interpretation, and formal response. The goal is not just to understand
            the pattern, but to know when it sounds mature and when it sounds overdone.
          </p>
        </div>
        <div className="english-expressions__metrics">
          <span>{filtered.length} patterns</span>
          <span>{categories.length - 1} categories</span>
          <span>{registers.length - 1} registers</span>
        </div>
      </div>

      <div className="english-expressions__controls">
        <input
          type="text"
          className="english-expressions__search"
          placeholder="Search by pattern, function, tone, or 中文說明"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <div className="english-expressions__filters">
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((option) => (
              <option key={option} value={option}>
                Category: {option}
              </option>
            ))}
          </select>

          <select value={fn} onChange={(event) => setFn(event.target.value)}>
            {functions.map((option) => (
              <option key={option} value={option}>
                Function: {option}
              </option>
            ))}
          </select>

          <select value={register} onChange={(event) => setRegister(event.target.value)}>
            {registers.map((option) => (
              <option key={option} value={option}>
                Register: {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="english-expressions__layout">
        <aside className="english-expressions__list">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`english-expression-card ${activeItem?.id === item.id ? 'is-active' : ''}`}
            >
              <button className="english-expression-card__body" onClick={() => setActiveId(item.id)}>
                <div className="english-expression-card__meta">
                  <span>{item.category}</span>
                  <span>{item.register}</span>
                </div>
                <h3>{item.pattern}</h3>
                <p>{item.function}</p>
              </button>
              {onToggleSave && (
                <button
                  className={`english-save-btn ${savedIds.includes(item.id) ? 'is-saved' : ''}`}
                  onClick={() => onToggleSave(item.id)}
                  title={savedIds.includes(item.id) ? '取消儲存' : '儲存'}
                >
                  {savedIds.includes(item.id) ? '★' : '☆'}
                </button>
              )}
            </div>
          ))}

          {filtered.length === 0 && <div className="english-expressions__empty">No matching expressions yet.</div>}
        </aside>

        <article className="english-expressions__detail">
          {activeItem ? (
            <>
              <div className="english-expressions__detail-header">
                <div>
                  <p className="english-expressions__eyebrow">Pattern Focus</p>
                  <h3>{activeItem.pattern}</h3>
                </div>
                <div className="english-expressions__badges">
                  <span>{activeItem.category}</span>
                  <span>{activeItem.function}</span>
                  <span>{activeItem.register}</span>
                  {onToggleSave && (
                    <button
                      className={`english-save-btn english-save-btn--detail ${savedIds.includes(activeItem.id) ? 'is-saved' : ''}`}
                      onClick={() => onToggleSave(activeItem.id)}
                      title={savedIds.includes(activeItem.id) ? '取消儲存' : '儲存此表達'}
                    >
                      {savedIds.includes(activeItem.id) ? '★ 已儲存' : '☆ 儲存'}
                    </button>
                  )}
                </div>
              </div>

              <div className="english-expressions__detail-grid">
                <section className="english-expressions__panel">
                  <h4>How it works</h4>
                  <p>{activeItem.explanationZh}</p>
                  <p className="english-expressions__usage-note">{activeItem.usageNote}</p>
                </section>

                <section className="english-expressions__panel">
                  <h4>Model sentence</h4>
                  <blockquote>{activeItem.exampleSentence}</blockquote>
                  <p>{activeItem.exampleZh}</p>
                </section>
              </div>

              <section className="english-expressions__panel">
                <h4>Common errors to avoid</h4>
                <ul className="english-expressions__list-bullets">
                  {activeItem.commonErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </section>

              <section className="english-expressions__panel">
                <h4>Useful tags</h4>
                <div className="english-expressions__tags">
                  {activeItem.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="english-expressions__empty">Pick a pattern to inspect the usage notes and model sentence.</div>
          )}
        </article>
      </div>
    </section>
  )
}

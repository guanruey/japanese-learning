import { useEffect, useMemo, useState } from 'react'
import './EnglishVocabularyBrowser.css'

const FILTER_ALL = 'All'

function collectOptions(items, key) {
  return [FILTER_ALL, ...new Set(items.map((item) => item[key]).filter(Boolean))]
}

export default function EnglishVocabularyBrowser({ data = [], savedIds = [], onToggleSave }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(FILTER_ALL)
  const [focus, setFocus] = useState(FILTER_ALL)
  const [register, setRegister] = useState(FILTER_ALL)
  const [activeId, setActiveId] = useState(data[0]?.id || null)

  useEffect(() => {
    if (!data.some((item) => item.id === activeId)) {
      setActiveId(data[0]?.id || null)
    }
  }, [activeId, data])

  const categories = useMemo(() => collectOptions(data, 'category'), [data])
  const focuses = useMemo(() => collectOptions(data, 'focus'), [data])
  const registers = useMemo(() => collectOptions(data, 'register'), [data])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return data.filter((item) => {
      if (category !== FILTER_ALL && item.category !== category) return false
      if (focus !== FILTER_ALL && item.focus !== focus) return false
      if (register !== FILTER_ALL && item.register !== register) return false
      if (!normalized) return true

      const haystacks = [
        item.headword,
        item.meaningZh,
        item.nuanceNote,
        item.coachingTip,
        item.category,
        item.focus,
        item.register,
        ...(item.examples || []),
        ...(item.collocations || []),
        ...(item.confusables || []),
        ...(item.tags || []),
      ]

      return haystacks.some((value) => (value || '').toLowerCase().includes(normalized))
    })
  }, [category, data, focus, query, register])

  const activeItem = filtered.find((item) => item.id === activeId) || filtered[0] || null

  useEffect(() => {
    if (activeItem && activeItem.id !== activeId) {
      setActiveId(activeItem.id)
    }
  }, [activeId, activeItem])

  return (
    <section className="english-vocabulary">
      <div className="english-vocabulary__header">
        <div>
          <p className="english-vocabulary__eyebrow">Live Module</p>
          <h2>Vocabulary Precision Lab</h2>
          <p className="english-vocabulary__description">
            This module trains word choice by comparing near-synonyms, collocations, and register. The point is not to
            memorize isolated words, but to know which wording fits the sentence best.
          </p>
        </div>
        <div className="english-vocabulary__metrics">
          <span>{filtered.length} sets</span>
          <span>{categories.length - 1} categories</span>
          <span>{focuses.length - 1} focus types</span>
        </div>
      </div>

      <div className="english-vocabulary__controls">
        <input
          type="text"
          className="english-vocabulary__search"
          placeholder="Search by word set, nuance, collocation, or 中文說明"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <div className="english-vocabulary__filters">
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((option) => (
              <option key={option} value={option}>
                Category: {option}
              </option>
            ))}
          </select>

          <select value={focus} onChange={(event) => setFocus(event.target.value)}>
            {focuses.map((option) => (
              <option key={option} value={option}>
                Focus: {option}
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

      <div className="english-vocabulary__layout">
        <aside className="english-vocabulary__list">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`english-vocabulary-card ${activeItem?.id === item.id ? 'is-active' : ''}`}
            >
              <button className="english-vocabulary-card__body" onClick={() => setActiveId(item.id)}>
                <div className="english-vocabulary-card__meta">
                  <span>{item.category}</span>
                  <span>{item.register}</span>
                </div>
                <h3>{item.headword}</h3>
                <p>{item.focus}</p>
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

          {filtered.length === 0 && <div className="english-vocabulary__empty">No matching vocabulary sets yet.</div>}
        </aside>

        <article className="english-vocabulary__detail">
          {activeItem ? (
            <>
              <div className="english-vocabulary__detail-header">
                <div>
                  <p className="english-vocabulary__eyebrow">Set Focus</p>
                  <h3>{activeItem.headword}</h3>
                </div>
                <div className="english-vocabulary__badges">
                  <span>{activeItem.category}</span>
                  <span>{activeItem.focus}</span>
                  <span>{activeItem.register}</span>
                  {onToggleSave && (
                    <button
                      className={`english-save-btn english-save-btn--detail ${savedIds.includes(activeItem.id) ? 'is-saved' : ''}`}
                      onClick={() => onToggleSave(activeItem.id)}
                      title={savedIds.includes(activeItem.id) ? '取消儲存' : '儲存此詞組'}
                    >
                      {savedIds.includes(activeItem.id) ? '★ 已儲存' : '☆ 儲存'}
                    </button>
                  )}
                </div>
              </div>

              <section className="english-vocabulary__panel">
                <h4>Nuance note</h4>
                <p>{activeItem.meaningZh}</p>
                <p className="english-vocabulary__note">{activeItem.nuanceNote}</p>
              </section>

              <div className="english-vocabulary__detail-grid">
                <section className="english-vocabulary__panel">
                  <h4>Model sentences</h4>
                  <ul className="english-vocabulary__examples">
                    {activeItem.examples.map((sentence, index) => (
                      <li key={sentence}>
                        <strong>{sentence}</strong>
                        <span>{activeItem.exampleZh[index]}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="english-vocabulary__panel">
                  <h4>High-value collocations</h4>
                  <div className="english-vocabulary__tags">
                    {activeItem.collocations.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <h4 className="english-vocabulary__subhead">Common weaker choices</h4>
                  <div className="english-vocabulary__tags english-vocabulary__tags--muted">
                    {activeItem.confusables.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </section>
              </div>

              <section className="english-vocabulary__panel">
                <h4>Coaching tip</h4>
                <p>{activeItem.coachingTip}</p>
              </section>

              <section className="english-vocabulary__panel">
                <h4>Useful tags</h4>
                <div className="english-vocabulary__tags">
                  {activeItem.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="english-vocabulary__empty">Pick a vocabulary set to compare nuance and collocations.</div>
          )}
        </article>
      </div>
    </section>
  )
}

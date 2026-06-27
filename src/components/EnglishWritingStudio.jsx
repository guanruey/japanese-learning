import { useEffect, useMemo, useState } from 'react'
import './EnglishWritingStudio.css'

const FILTER_ALL = 'All'

function collectOptions(items, key) {
  return [FILTER_ALL, ...new Set(items.map((item) => item[key]).filter(Boolean))]
}

export default function EnglishWritingStudio({ data = [] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(FILTER_ALL)
  const [tone, setTone] = useState(FILTER_ALL)
  const [activeId, setActiveId] = useState(data[0]?.id || null)
  const [showUpgrade, setShowUpgrade] = useState(false)

  useEffect(() => {
    if (!data.some((item) => item.id === activeId)) {
      setActiveId(data[0]?.id || null)
    }
  }, [activeId, data])

  const categories = useMemo(() => collectOptions(data, 'category'), [data])
  const tones = useMemo(() => collectOptions(data, 'tone'), [data])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return data.filter((item) => {
      if (category !== FILTER_ALL && item.category !== category) return false
      if (tone !== FILTER_ALL && item.tone !== tone) return false
      if (!normalized) return true

      const haystacks = [
        item.weakSentence,
        item.betterSentence,
        item.bestSentence,
        item.explanationZh,
        item.errorType,
        item.category,
        item.coachingTip,
        ...(item.tags || []),
      ]

      return haystacks.some((value) => (value || '').toLowerCase().includes(normalized))
    })
  }, [category, data, query, tone])

  const activeItem = filtered.find((item) => item.id === activeId) || filtered[0] || null

  useEffect(() => {
    if (activeItem && activeItem.id !== activeId) {
      setActiveId(activeItem.id)
    }
  }, [activeId, activeItem])

  useEffect(() => {
    setShowUpgrade(false)
  }, [activeId])

  return (
    <section className="english-writing">
      <div className="english-writing__header">
        <div>
          <p className="english-writing__eyebrow">Live Module</p>
          <h2>Writing Upgrade Studio</h2>
          <p className="english-writing__description">
            Start from a weak learner sentence, repair the core problem, and then push it one level higher. This mirrors
            how upper-intermediate learners usually improve fastest.
          </p>
        </div>
        <div className="english-writing__metrics">
          <span>{filtered.length} revision points</span>
          <span>{categories.length - 1} categories</span>
          <span>{tones.length - 1} tones</span>
        </div>
      </div>

      <div className="english-writing__controls">
        <input
          type="text"
          className="english-writing__search"
          placeholder="Search by error type, tone, sentence, or 中文說明"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <div className="english-writing__filters">
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((option) => (
              <option key={option} value={option}>
                Category: {option}
              </option>
            ))}
          </select>

          <select value={tone} onChange={(event) => setTone(event.target.value)}>
            {tones.map((option) => (
              <option key={option} value={option}>
                Tone: {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="english-writing__layout">
        <aside className="english-writing__list">
          {filtered.map((item) => (
            <button
              key={item.id}
              className={`english-writing-card ${activeItem?.id === item.id ? 'is-active' : ''}`}
              onClick={() => setActiveId(item.id)}
            >
              <div className="english-writing-card__meta">
                <span>{item.category}</span>
                <span>{item.tone}</span>
              </div>
              <h3>{item.errorType}</h3>
              <p>{item.weakSentence}</p>
            </button>
          ))}

          {filtered.length === 0 && <div className="english-writing__empty">No matching writing points yet.</div>}
        </aside>

        <article className="english-writing__detail">
          {activeItem ? (
            <>
              <div className="english-writing__detail-header">
                <div>
                  <p className="english-writing__eyebrow">Revision Focus</p>
                  <h3>{activeItem.errorType}</h3>
                </div>
                <div className="english-writing__badges">
                  <span>{activeItem.category}</span>
                  <span>{activeItem.tone}</span>
                </div>
              </div>

              <section className="english-writing__panel english-writing__panel--weak">
                <h4>Original sentence</h4>
                <blockquote>{activeItem.weakSentence}</blockquote>
              </section>

              <div className="english-writing__detail-grid">
                <section className="english-writing__panel">
                  <h4>Cleaner version</h4>
                  <blockquote>{activeItem.betterSentence}</blockquote>
                  {activeItem.betterSentenceZh && <p className="english-writing__translation">{activeItem.betterSentenceZh}</p>}
                </section>

                <section className="english-writing__panel">
                  <div className="english-writing__panel-head">
                    <h4>Upgraded version</h4>
                    <button className="english-writing__reveal" onClick={() => setShowUpgrade((value) => !value)}>
                      {showUpgrade ? 'Hide Upgrade' : 'Reveal Upgrade'}
                    </button>
                  </div>
                  <blockquote className={showUpgrade ? '' : 'is-hidden'}>
                    {showUpgrade ? activeItem.bestSentence : 'Use the cleaner version first, then try to improve tone, precision, or cohesion before revealing this line.'}
                  </blockquote>
                  {showUpgrade && activeItem.bestSentenceZh && (
                    <p className="english-writing__translation">{activeItem.bestSentenceZh}</p>
                  )}
                </section>
              </div>

              <section className="english-writing__panel">
                <h4>Why this works</h4>
                <p>{activeItem.explanationZh}</p>
                <p className="english-writing__tip">{activeItem.coachingTip}</p>
              </section>

              <section className="english-writing__panel">
                <h4>Useful tags</h4>
                <div className="english-writing__tags">
                  {activeItem.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="english-writing__empty">Pick a writing point to inspect the repair and upgrade path.</div>
          )}
        </article>
      </div>
    </section>
  )
}

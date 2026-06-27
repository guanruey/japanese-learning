import { useEffect, useMemo, useState } from 'react'
import './EnglishReadingStudio.css'

const FILTER_ALL = 'All'

function collectOptions(items, key) {
  return [FILTER_ALL, ...new Set(items.map((item) => item[key]).filter(Boolean))]
}

export default function EnglishReadingStudio({ data = [] }) {
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState(FILTER_ALL)
  const [focus, setFocus] = useState(FILTER_ALL)
  const [activeId, setActiveId] = useState(data[0]?.id || null)
  const [revealedAnswers, setRevealedAnswers] = useState({})

  useEffect(() => {
    if (!data.some((item) => item.id === activeId)) {
      setActiveId(data[0]?.id || null)
    }
  }, [activeId, data])

  const topics = useMemo(() => collectOptions(data, 'topic'), [data])
  const focuses = useMemo(() => collectOptions(data, 'questionFocus'), [data])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return data.filter((item) => {
      if (topic !== FILTER_ALL && item.topic !== topic) return false
      if (focus !== FILTER_ALL && item.questionFocus !== focus) return false
      if (!normalized) return true

      const haystacks = [
        item.title,
        item.topic,
        item.questionFocus,
        item.summaryZh,
        item.passage,
        ...item.glossary.map((entry) => `${entry.word} ${entry.zh}`),
        ...item.questions.map((question) => `${question.question} ${question.choices.join(' ')}`),
      ]

      return haystacks.some((value) => (value || '').toLowerCase().includes(normalized))
    })
  }, [data, focus, query, topic])

  const activeItem = filtered.find((item) => item.id === activeId) || filtered[0] || null

  useEffect(() => {
    if (activeItem && activeItem.id !== activeId) {
      setActiveId(activeItem.id)
    }
  }, [activeId, activeItem])

  useEffect(() => {
    setRevealedAnswers({})
  }, [activeId])

  const toggleReveal = (index) => {
    setRevealedAnswers((current) => ({
      ...current,
      [index]: !current[index],
    }))
  }

  return (
    <section className="english-reading">
      <div className="english-reading__header">
        <div>
          <p className="english-reading__eyebrow">Live Module</p>
          <h2>Reading Interpretation Studio</h2>
          <p className="english-reading__description">
            Read medium-length passages, then work through question types that matter at this level: main idea, inference,
            tone, reference, and paraphrase.
          </p>
        </div>
        <div className="english-reading__metrics">
          <span>{filtered.length} passages</span>
          <span>{topics.length - 1} topics</span>
          <span>{focuses.length - 1} focus types</span>
        </div>
      </div>

      <div className="english-reading__controls">
        <input
          type="text"
          className="english-reading__search"
          placeholder="Search by title, topic, question focus, or passage text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <div className="english-reading__filters">
          <select value={topic} onChange={(event) => setTopic(event.target.value)}>
            {topics.map((option) => (
              <option key={option} value={option}>
                Topic: {option}
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
        </div>
      </div>

      <div className="english-reading__layout">
        <aside className="english-reading__list">
          {filtered.map((item) => (
            <button
              key={item.id}
              className={`english-reading-card ${activeItem?.id === item.id ? 'is-active' : ''}`}
              onClick={() => setActiveId(item.id)}
            >
              <div className="english-reading-card__meta">
                <span>{item.topic}</span>
                <span>{item.questionFocus}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.difficulty}</p>
            </button>
          ))}

          {filtered.length === 0 && <div className="english-reading__empty">No matching passages yet.</div>}
        </aside>

        <article className="english-reading__detail">
          {activeItem ? (
            <>
              <div className="english-reading__detail-header">
                <div>
                  <p className="english-reading__eyebrow">Passage Focus</p>
                  <h3>{activeItem.title}</h3>
                </div>
                <div className="english-reading__badges">
                  <span>{activeItem.topic}</span>
                  <span>{activeItem.questionFocus}</span>
                  <span>{activeItem.difficulty}</span>
                </div>
              </div>

              <section className="english-reading__panel">
                <h4>Passage</h4>
                <p className="english-reading__passage">{activeItem.passage}</p>
                <p className="english-reading__summary">{activeItem.summaryZh}</p>
              </section>

              <section className="english-reading__panel">
                <h4>Glossary</h4>
                <div className="english-reading__glossary">
                  {activeItem.glossary.map((entry) => (
                    <span key={entry.word}>
                      <strong>{entry.word}</strong> {entry.zh}
                    </span>
                  ))}
                </div>
              </section>

              <section className="english-reading__questions">
                <h4>Questions</h4>
                {activeItem.questions.map((question, index) => {
                  const isRevealed = Boolean(revealedAnswers[index])
                  return (
                    <article key={question.question} className="english-reading__question-card">
                      <p className="english-reading__question-title">
                        {index + 1}. {question.question}
                      </p>
                      <ol className="english-reading__choices">
                        {question.choices.map((choice, choiceIndex) => (
                          <li
                            key={choice}
                            className={isRevealed && choiceIndex === question.answer ? 'is-correct' : ''}
                          >
                            {choice}
                          </li>
                        ))}
                      </ol>
                      <button className="english-reading__reveal" onClick={() => toggleReveal(index)}>
                        {isRevealed ? 'Hide Answer' : 'Reveal Answer'}
                      </button>
                      {isRevealed && <p className="english-reading__explanation">{question.explanation}</p>}
                    </article>
                  )
                })}
              </section>
            </>
          ) : (
            <div className="english-reading__empty">Pick a passage to start reading and answer the question set.</div>
          )}
        </article>
      </div>
    </section>
  )
}

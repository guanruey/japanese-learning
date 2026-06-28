import { useMemo, useState, useEffect } from 'react'
import { scenarioCategories, scenarioModules, scenarioTracks } from '../data/scenarioContent'
import { speak } from '../utils/speech'
import './ScenarioStudio.css'

const SPEECH_LANG = {
  japanese: 'ja-JP',
  english: 'en-US',
}

function SpeakButton({ text, language }) {
  return (
    <button
      type="button"
      className="scenario-speak-btn"
      onClick={() => speak(text, SPEECH_LANG[language])}
      title="Play pronunciation"
      aria-label={`Play pronunciation for ${text}`}
    >
      🔊
    </button>
  )
}

function PracticeMode({ steps, responseBank, language, onExit }) {
  const [idx, setIdx] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore] = useState(0)

  const done = idx >= steps.length
  const step = steps[idx]

  const choices = useMemo(() => {
    if (!step) return []
    const pool = [
      ...steps.filter((_, i) => i !== idx).map(s => s.learnerLine),
      ...(responseBank || []),
    ].filter(d => d !== step.learnerLine)

    const halfLen = Math.max(1, Math.floor(pool.length / 2))
    const d1 = pool[idx % pool.length] ?? ''
    const d2 = pool[(idx + halfLen) % pool.length] ?? ''
    const unique = [step.learnerLine, d1, d2].filter((v, i, a) => a.indexOf(v) === i)
    // Place correct answer at position (idx % 3) by rotating
    const pos = idx % Math.min(3, unique.length)
    const withoutCorrect = unique.filter(v => v !== step.learnerLine)
    withoutCorrect.splice(pos, 0, step.learnerLine)
    return withoutCorrect.slice(0, 3)
  }, [idx, step, steps, responseBank])

  const advance = () => { setIdx(i => i + 1); setChosen(null) }
  const restart = () => { setIdx(0); setChosen(null); setScore(0) }

  if (done) {
    return (
      <div className="practice-done">
        <p className="practice-done__score">{score} / {steps.length}</p>
        <p className="practice-done__label">
          {score === steps.length ? '全部答對！' : score >= steps.length / 2 ? '不錯，再練一次更熟練。' : '繼續練習，你可以的。'}
        </p>
        <div className="practice-done__actions">
          <button className="practice-btn practice-btn--primary" onClick={restart}>再練一次</button>
          <button className="practice-btn" onClick={onExit}>返回閱讀模式</button>
        </div>
      </div>
    )
  }

  const isAnswered = chosen !== null
  const correct = step.learnerLine

  return (
    <div className="practice-view">
      <div className="practice-progress">
        <span>步驟 {idx + 1} / {steps.length}</span>
        <span className="practice-score-label">答對 {score} 題</span>
      </div>

      <h3 className="practice-step-title">{step.title}</h3>
      {step.coachNote && <p className="practice-coach">{step.coachNote}</p>}

      <p className="practice-prompt">你會怎麼說？</p>

      <div className="practice-choices">
        {choices.map((c, i) => {
          let cls = 'practice-choice'
          if (isAnswered) {
            if (c === correct) cls += ' is-correct'
            else if (i === chosen) cls += ' is-wrong'
          }
          return (
            <div key={i} className={cls}>
              <SpeakButton text={c} language={language} />
              <button
                className="practice-choice__text"
                disabled={isAnswered}
                onClick={() => {
                  setChosen(i)
                  if (c === correct) setScore(s => s + 1)
                }}
              >
                {c}
              </button>
            </div>
          )
        })}
      </div>

      {isAnswered && (
        <div className="practice-reveal">
          <p className={`practice-verdict ${chosen !== null && choices[chosen] === correct ? 'is-correct' : 'is-wrong'}`}>
            {choices[chosen] === correct ? '✓ 正確！' : `✗ 正確答案：${correct}`}
          </p>
          <div className="scenario-step__block">
            <p className="scenario-step__label">對方可能回應</p>
            <ul>
              {step.branches.map(b => (
                <li key={b} className="scenario-step__reply">
                  <span>{b}</span>
                  <SpeakButton text={b} language={language} />
                </li>
              ))}
            </ul>
          </div>
          <button
            className="practice-btn practice-btn--primary practice-next"
            onClick={advance}
          >
            {idx < steps.length - 1 ? '下一步 →' : '查看結果'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function ScenarioStudio({
  language: controlledLanguage,
  activeCategory: controlledCategory,
  onLanguageChange,
  onCategoryChange,
}) {
  const [internalLanguage, setInternalLanguage] = useState('japanese')
  const [internalCategory, setInternalCategory] = useState('daily')
  const [scenarioId, setScenarioId] = useState(
    () => scenarioModules.find((item) => item.category === 'daily')?.id || scenarioModules[0]?.id || null
  )
  const [mode, setMode] = useState('review') // 'review' | 'practice'

  const language = controlledLanguage || internalLanguage
  const activeCategory = controlledCategory || internalCategory

  const setLanguage = (nextLanguage) => {
    if (onLanguageChange) { onLanguageChange(nextLanguage); return }
    setInternalLanguage(nextLanguage)
  }

  const setActiveCategory = (nextCategory) => {
    if (onCategoryChange) { onCategoryChange(nextCategory); return }
    setInternalCategory(nextCategory)
  }

  // Reset practice mode when scenario or language changes
  useEffect(() => { setMode('review') }, [scenarioId, language])

  const categoryModules = useMemo(
    () => scenarioModules.filter((item) => item.category === activeCategory),
    [activeCategory]
  )

  const safeScenarioId = categoryModules.some((item) => item.id === scenarioId)
    ? scenarioId
    : categoryModules[0]?.id || null

  const activeScenario = useMemo(
    () => categoryModules.find((item) => item.id === safeScenarioId) || categoryModules[0] || scenarioModules[0],
    [categoryModules, safeScenarioId]
  )

  const content = activeScenario.languages[language]
  const hasSteps = content.steps.length > 0

  return (
    <section className="scenario-studio">
      <div className="scenario-studio__hero">
        <div>
          <p className="scenario-studio__eyebrow">Scenario Mode</p>
          <h2>Learn through task-based real-world situations</h2>
          <p className="scenario-studio__description">
            Instead of studying isolated phrases, you move through a concrete situation with a goal, likely branch
            responses, and repair points. This makes restaurant, station, hotel, and service scenarios much more usable.
          </p>
        </div>
        <div className="scenario-studio__hero-card">
          <p>Why this mode works</p>
          <ul>
            <li>Starts from a real task, not random sentences</li>
            <li>Shows likely replies from the other side</li>
            <li>Trains clarification and recovery, not just first lines</li>
          </ul>
        </div>
      </div>

      <div className="scenario-studio__toolbar">
        <div className="scenario-studio__categories">
          {Object.entries(scenarioCategories).map(([key, label]) => (
            <button
              key={key}
              className={activeCategory === key ? 'is-active' : ''}
              onClick={() => {
                setActiveCategory(key)
                const nextScenario = scenarioModules.find((item) => item.category === key)
                if (nextScenario) setScenarioId(nextScenario.id)
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="scenario-studio__toggle">
          {Object.entries(scenarioTracks).map(([key, label]) => (
            <button
              key={key}
              className={language === key ? 'is-active' : ''}
              onClick={() => setLanguage(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="scenario-studio__scenarios">
          {categoryModules.map((scenario) => (
            <button
              key={scenario.id}
              className={safeScenarioId === scenario.id ? 'is-active' : ''}
              onClick={() => setScenarioId(scenario.id)}
            >
              {scenario.label}
            </button>
          ))}
        </div>
      </div>

      <div className="scenario-studio__overview">
        <article className="scenario-studio__card scenario-studio__card--primary">
          <p className="scenario-studio__label">Mission</p>
          <h3>{activeScenario.label}</h3>
          <p>{content.mission}</p>
          <div className="scenario-studio__meta">
            <span>{activeScenario.setting}</span>
            <span>{activeScenario.difficulty}</span>
            <span>{activeScenario.goal}</span>
          </div>
        </article>

        <article className="scenario-studio__card">
          <p className="scenario-studio__label">Core language</p>
          <div className="scenario-studio__chips">
            {content.keyPatterns.map((pattern) => (
              <span key={pattern} className="scenario-chip scenario-chip--speakable">
                <span>{pattern}</span>
                <SpeakButton text={pattern} language={language} />
              </span>
            ))}
          </div>
        </article>

        <article className="scenario-studio__card">
          <p className="scenario-studio__label">Keywords</p>
          <div className="scenario-studio__chips scenario-studio__chips--muted">
            {content.keyVocabulary.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>
        </article>
      </div>

      <section className="scenario-studio__card">
        <p className="scenario-studio__label">Extra example lines</p>
        <div className="scenario-studio__examples">
          {content.exampleSets?.map((group) => (
            <article key={group.title} className="scenario-example-group">
              <h3>{group.title}</h3>
              <ul>
                {group.lines.map((line) => (
                  <li key={line} className="scenario-step__reply">
                    <span>{line}</span>
                    <SpeakButton text={line} language={language} />
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="scenario-studio__card">
        <div className="scenario-flow__header">
          <p className="scenario-studio__label">Scenario flow</p>
          {hasSteps && (
            <div className="scenario-mode-toggle">
              <button
                className={mode === 'review' ? 'is-active' : ''}
                onClick={() => setMode('review')}
              >
                閱讀
              </button>
              <button
                className={mode === 'practice' ? 'is-active' : ''}
                onClick={() => setMode('practice')}
              >
                練習
              </button>
            </div>
          )}
        </div>

        {mode === 'practice' && hasSteps ? (
          <PracticeMode
            key={`${safeScenarioId}-${language}`}
            steps={content.steps}
            responseBank={content.responseBank}
            language={language}
            onExit={() => setMode('review')}
          />
        ) : (
          <>
            <p className="scenario-studio__opener">{content.opener}</p>
            <div className="scenario-studio__steps">
              {content.steps.length > 0 ? (
                content.steps.map((step, index) => (
                  <article key={step.title} className="scenario-step">
                    <div className="scenario-step__index">{index + 1}</div>
                    <div className="scenario-step__body">
                      <h3>{step.title}</h3>
                      <div className="scenario-step__block">
                        <p className="scenario-step__label">Your line</p>
                        <div className="scenario-step__quote-row">
                          <blockquote>{step.learnerLine}</blockquote>
                          <SpeakButton text={step.learnerLine} language={language} />
                        </div>
                      </div>
                      <div className="scenario-step__block">
                        <p className="scenario-step__label">Likely replies</p>
                        <ul>
                          {step.branches.map((branch) => (
                            <li key={branch} className="scenario-step__reply">
                              <span>{branch}</span>
                              <SpeakButton text={branch} language={language} />
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="scenario-step__note">{step.coachNote}</p>
                    </div>
                  </article>
                ))
              ) : (
                <div className="scenario-studio__empty">This scenario shell is ready. Next we can fill in the full step chain like the restaurant demo.</div>
              )}
            </div>
          </>
        )}
      </section>

      <section className="scenario-studio__card">
        <p className="scenario-studio__label">Response bank</p>
        <div className="scenario-studio__repairs">
          {content.responseBank?.map((line) => (
            <article key={line} className="scenario-repair scenario-repair--neutral">
              <div className="scenario-repair__row">
                <p className="scenario-repair__better">{line}</p>
                <SpeakButton text={line} language={language} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="scenario-studio__card">
        <p className="scenario-studio__label">Repair points</p>
        <div className="scenario-studio__repairs">
          {content.repairPoints.length > 0 ? (
            content.repairPoints.map((item) => (
              <article key={item.weak} className="scenario-repair">
                <div className="scenario-repair__row">
                  <p className="scenario-repair__weak">{item.weak}</p>
                  <SpeakButton text={item.weak} language={language} />
                </div>
                <div className="scenario-repair__row">
                  <p className="scenario-repair__better">{item.better}</p>
                  <SpeakButton text={item.better} language={language} />
                </div>
                <p className="scenario-repair__why">{item.why}</p>
              </article>
            ))
          ) : (
            <div className="scenario-studio__empty">Repair examples can be added once this scenario gets a full lesson build.</div>
          )}
        </div>
      </section>
    </section>
  )
}

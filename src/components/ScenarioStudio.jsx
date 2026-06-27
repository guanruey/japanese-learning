import { useMemo, useState } from 'react'
import { scenarioModules, scenarioTracks } from '../data/scenarioContent'
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

export default function ScenarioStudio() {
  const [language, setLanguage] = useState('japanese')
  const [scenarioId, setScenarioId] = useState(scenarioModules[0]?.id || null)

  const activeScenario = useMemo(
    () => scenarioModules.find((item) => item.id === scenarioId) || scenarioModules[0],
    [scenarioId]
  )

  const content = activeScenario.languages[language]

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
          {scenarioModules.map((scenario) => (
            <button
              key={scenario.id}
              className={scenarioId === scenario.id ? 'is-active' : ''}
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
        <p className="scenario-studio__label">Scenario flow</p>
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

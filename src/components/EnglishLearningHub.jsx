import './EnglishLearningHub.css'
import EnglishExpressionsBrowser from './EnglishExpressionsBrowser'
import EnglishReadingStudio from './EnglishReadingStudio'
import EnglishVocabularyBrowser from './EnglishVocabularyBrowser'
import EnglishWritingStudio from './EnglishWritingStudio'

function SummaryList({ items }) {
  return (
    <div className="english-summary-list">
      {items.map((item) => (
        <span key={item} className="english-chip">
          {item}
        </span>
      ))}
    </div>
  )
}

export default function EnglishLearningHub({
  activeTab,
  tabs,
  overviewCards,
  moduleSummaries,
  expressionsData,
  readingData,
  vocabularyData,
  writingData,
  onSelectTab,
  savedExpressionIds = [],
  savedVocabIds = [],
  onToggleExpressionSave,
  onToggleVocabSave,
}) {
  const current = moduleSummaries[activeTab]

  if (activeTab === 'reading') {
    return (
      <div className="english-hub">
        <section className="english-hero">
          <div className="english-hero__copy">
            <p className="english-hero__eyebrow">GEPT Upper-Intermediate Track</p>
            <h2>Refine academic and professional English with focused training</h2>
            <p className="english-hero__description">
              This track is designed for learners who already know basic English and want stronger control over nuance,
              structure, reading precision, and writing quality.
            </p>
          </div>
          <div className="english-hero__panel">
            <p className="english-hero__panel-label">Reading with interpretation</p>
            <SummaryList items={['Main idea', 'Inference', 'Tone and paraphrase']} />
            <p className="english-hero__panel-note">
              Stronger reading at this level means interpreting stance and implication, not just understanding individual words.
            </p>
          </div>
        </section>

        <nav className="english-tab-navigation">
          {Object.entries(tabs).map(([key, label]) => (
            <button
              key={key}
              className={`english-tab-btn ${activeTab === key ? 'active' : ''}`}
              onClick={() => onSelectTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>

        <EnglishReadingStudio data={readingData} />
      </div>
    )
  }

  if (activeTab === 'vocabulary') {
    return (
      <div className="english-hub">
        <section className="english-hero">
          <div className="english-hero__copy">
            <p className="english-hero__eyebrow">GEPT Upper-Intermediate Track</p>
            <h2>Refine academic and professional English with focused training</h2>
            <p className="english-hero__description">
              This track is designed for learners who already know basic English and want stronger control over nuance,
              structure, reading precision, and writing quality.
            </p>
          </div>
          <div className="english-hero__panel">
            <p className="english-hero__panel-label">Vocabulary with judgment</p>
            <SummaryList items={['Synonym nuance', 'Collocations', 'Register choice']} />
            <p className="english-hero__panel-note">
              The goal here is not to collect more words. It is to choose sharper words when several options all seem possible.
            </p>
          </div>
        </section>

        <nav className="english-tab-navigation">
          {Object.entries(tabs).map(([key, label]) => (
            <button
              key={key}
              className={`english-tab-btn ${activeTab === key ? 'active' : ''}`}
              onClick={() => onSelectTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>

        <EnglishVocabularyBrowser data={vocabularyData} savedIds={savedVocabIds} onToggleSave={onToggleVocabSave} />
      </div>
    )
  }

  if (activeTab === 'expressions') {
    return (
      <div className="english-hub">
        <section className="english-hero">
          <div className="english-hero__copy">
            <p className="english-hero__eyebrow">GEPT Upper-Intermediate Track</p>
            <h2>Refine academic and professional English with focused training</h2>
            <p className="english-hero__description">
              This track is designed for learners who already know basic English and want stronger control over nuance,
              structure, reading precision, and writing quality.
            </p>
          </div>
          <div className="english-hero__panel">
            <p className="english-hero__panel-label">Expressions first</p>
            <SummaryList items={['Formal tone', 'Argument flow', 'Evidence-based wording']} />
            <p className="english-hero__panel-note">
              This is the first live English module. It gives the site a real training surface instead of only a roadmap.
            </p>
          </div>
        </section>

        <nav className="english-tab-navigation">
          {Object.entries(tabs).map(([key, label]) => (
            <button
              key={key}
              className={`english-tab-btn ${activeTab === key ? 'active' : ''}`}
              onClick={() => onSelectTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>

        <EnglishExpressionsBrowser data={expressionsData} savedIds={savedExpressionIds} onToggleSave={onToggleExpressionSave} />
      </div>
    )
  }

  if (activeTab === 'writing') {
    return (
      <div className="english-hub">
        <section className="english-hero">
          <div className="english-hero__copy">
            <p className="english-hero__eyebrow">GEPT Upper-Intermediate Track</p>
            <h2>Refine academic and professional English with focused training</h2>
            <p className="english-hero__description">
              This track is designed for learners who already know basic English and want stronger control over nuance,
              structure, reading precision, and writing quality.
            </p>
          </div>
          <div className="english-hero__panel">
            <p className="english-hero__panel-label">Revision matters</p>
            <SummaryList items={['Sentence repair', 'Tone upgrade', 'Cohesion']} />
            <p className="english-hero__panel-note">
              Writing improvement often comes from learning how to revise weak sentences, not from writing more of the same thing.
            </p>
          </div>
        </section>

        <nav className="english-tab-navigation">
          {Object.entries(tabs).map(([key, label]) => (
            <button
              key={key}
              className={`english-tab-btn ${activeTab === key ? 'active' : ''}`}
              onClick={() => onSelectTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>

        <EnglishWritingStudio data={writingData} />
      </div>
    )
  }

  return (
    <div className="english-hub">
      <section className="english-hero">
        <div className="english-hero__copy">
          <p className="english-hero__eyebrow">GEPT Upper-Intermediate Track</p>
          <h2>Refine academic and professional English with focused training</h2>
          <p className="english-hero__description">
            This track is designed for learners who already know basic English and want stronger control over nuance,
            structure, reading precision, and writing quality.
          </p>
        </div>
        <div className="english-hero__panel">
          <p className="english-hero__panel-label">Recommended first build</p>
          <SummaryList items={['Expressions', 'Writing', 'Vocabulary', 'Reading']} />
          <p className="english-hero__panel-note">
            Start with reusable patterns and revision tasks first. They create the clearest jump in exam and real-world performance.
          </p>
        </div>
      </section>

      <section className="english-overview-grid">
        {overviewCards.map((card) => (
          <article key={card.id} className={`english-overview-card ${activeTab === card.id ? 'is-active' : ''}`}>
            <p className="english-overview-card__eyebrow">{card.eyebrow}</p>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <SummaryList items={card.highlights} />
            <button className="english-overview-card__button" onClick={() => onSelectTab(card.id)}>
              Open {tabs[card.id]}
            </button>
          </article>
        ))}
      </section>

      <nav className="english-tab-navigation">
        {Object.entries(tabs).map(([key, label]) => (
          <button
            key={key}
            className={`english-tab-btn ${activeTab === key ? 'active' : ''}`}
            onClick={() => onSelectTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      <section className="english-module">
        <div className="english-module__header">
          <div>
            <p className="english-module__eyebrow">Module Blueprint</p>
            <h3>{current.title}</h3>
          </div>
          <button className="english-module__jump" onClick={() => onSelectTab(activeTab)}>
            Current focus
          </button>
        </div>

        <p className="english-module__description">{current.description}</p>

        <div className="english-module__grid">
          <article className="english-module__card">
            <h4>Starter sets</h4>
            <SummaryList items={current.starterSets} />
          </article>

          <article className="english-module__card">
            <h4>Sample items</h4>
            <ul className="english-module__list">
              {current.sampleItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="english-module__card">
            <h4>Build next</h4>
            <ul className="english-module__list">
              <li>Connect this module to a dedicated Supabase table.</li>
              <li>Add saved items and filters after core content is stable.</li>
              <li>Keep explanations bilingual where clarity matters.</li>
            </ul>
          </article>
        </div>
      </section>
    </div>
  )
}

import './SiteMap.css'

const SECTIONS = [
  {
    track: 'japanese',
    title: '日語學習',
    icon: '🇯🇵',
    desc: 'JLPT N5 / N4 系統性學習',
    items: [
      { label: '文法', sub: 'N5・N4 型句，含例句與變體', tab: 'grammar' },
      { label: '語彙', sub: '300+ 詞彙，按詞性分類', tab: 'vocabulary' },
      { label: '会話フレーズ', sub: '52 句日常場景用語', tab: 'phrases' },
    ],
  },
  {
    track: 'english',
    title: 'English Lab',
    icon: '📖',
    desc: '英文中高級訓練',
    items: [
      { label: 'Expressions', sub: '成熟表達與語感', tab: 'expressions' },
      { label: 'Vocabulary', sub: '搭配詞與語境用法', tab: 'vocabulary' },
      { label: 'Reading', sub: '精讀理解訓練', tab: 'reading' },
      { label: 'Writing', sub: '升級寫作結構', tab: 'writing' },
    ],
  },
  {
    track: 'scenario',
    title: 'Scenario Studio',
    icon: '🎭',
    desc: '任務式情境對話練習',
    items: [
      { label: '餐廳・車站・飯店', sub: '日語日常場景', tab: null },
      { label: '商務情境', sub: '職場日語與英語', tab: null },
      { label: '修正練習', sub: '錯誤回應與修補點', tab: null },
    ],
  },
]

export default function SiteMap({ onNavigate }) {
  return (
    <section className="sitemap">
      <h2 className="sitemap__title">網站全覽</h2>
      <p className="sitemap__sub">三個學習軌道，各自獨立，可依需求切換</p>
      <div className="sitemap__grid">
        {SECTIONS.map(sec => (
          <div key={sec.track} className="sitemap__card">
            <div className="sitemap__card-header">
              <span className="sitemap__icon">{sec.icon}</span>
              <div>
                <h3 className="sitemap__card-title">{sec.title}</h3>
                <p className="sitemap__card-desc">{sec.desc}</p>
              </div>
            </div>
            <ul className="sitemap__items">
              {sec.items.map(item => (
                <li key={item.label} className="sitemap__item">
                  <button
                    className="sitemap__item-btn"
                    onClick={() => onNavigate?.(sec.track, item.tab)}
                  >
                    <span className="sitemap__item-label">{item.label}</span>
                    <span className="sitemap__item-sub">{item.sub}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

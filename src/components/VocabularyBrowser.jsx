import { useState } from 'react'
import './VocabularyBrowser.css'

export default function VocabularyBrowser() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="vocabulary-browser">
      <div className="browser-controls">
        <input
          type="text"
          placeholder="単語を検索（例：学生、食べる、美しい）"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="vocabulary-content">
        <div className="coming-soon">
          <h2>📖 語彙ブラウザ</h2>
          <p>近日公開予定</p>
          <p>N5/N4 の全単語と詳細な使用例</p>
        </div>
      </div>
    </div>
  )
}

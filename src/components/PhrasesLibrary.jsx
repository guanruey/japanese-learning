import { useState } from 'react'
import './PhrasesLibrary.css'

export default function PhrasesLibrary() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="phrases-library">
      <div className="browser-controls">
        <input
          type="text"
          placeholder="フレーズを検索"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="phrases-content">
        <div className="coming-soon">
          <h2>💬 会話フレーズ</h2>
          <p>近日公開予定</p>
          <p>日常会話で使える実用的なフレーズ集</p>
        </div>
      </div>
    </div>
  )
}

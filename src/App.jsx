import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import GrammarBrowser from './components/GrammarBrowser'
import VocabularyBrowser from './components/VocabularyBrowser'
import PhrasesLibrary from './components/PhrasesLibrary'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('grammar')
  const [grammarData, setGrammarData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
    loadGrammarData()
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const loadGrammarData = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('grammar')
        .select('*')
        .order('level, id')

      if (error) throw error
      setGrammarData(data || [])
    } catch (error) {
      console.error('Error loading grammar:', error)
      // 使用本地備用資料
      setGrammarData([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <button className="theme-toggle" onClick={toggleTheme} title="テーマ切り替え">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <div className="header-content">
          <h1>📚 日本語学習プラットフォーム</h1>
          <p>JLPT N5 / N4 インタラクティブ学習ガイド</p>
        </div>
      </header>

      <nav className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'grammar' ? 'active' : ''}`}
          onClick={() => setActiveTab('grammar')}
        >
          📝 文法
        </button>
        <button
          className={`tab-btn ${activeTab === 'vocabulary' ? 'active' : ''}`}
          onClick={() => setActiveTab('vocabulary')}
        >
          📖 語彙
        </button>
        <button
          className={`tab-btn ${activeTab === 'phrases' ? 'active' : ''}`}
          onClick={() => setActiveTab('phrases')}
        >
          💬 会話フレーズ
        </button>
      </nav>

      <main className="app-main">
        {loading && <div className="loading">読み込み中...</div>}

        {!loading && activeTab === 'grammar' && (
          <GrammarBrowser data={grammarData} />
        )}

        {!loading && activeTab === 'vocabulary' && (
          <VocabularyBrowser />
        )}

        {!loading && activeTab === 'phrases' && (
          <PhrasesLibrary />
        )}
      </main>

      <footer className="app-footer">
        <p>💡 会話学習に最適化 | 深く、速く、効率よく</p>
        <p className="author-info">
          作者：<strong>Grant, K. J. Huang, Ph.D. 黃冠叡</strong>
          {' '}
          <a href="mailto:guanruey@gmail.com">📧 聯絡</a>
        </p>
        <p className="copyright">
          © 2025-2026 日本語学習プラットフォーム. All rights reserved.
          <br />
          版權所有，保留所有權利。此網站內容可免費用於學習，禁止未經授權的商業或其他使用。
        </p>
      </footer>
    </div>
  )
}

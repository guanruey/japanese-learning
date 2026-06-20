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
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
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
      </footer>
    </div>
  )
}

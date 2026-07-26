import React from 'react'
import { useSubscription } from '../context/SubscriptionContext'
import { useLocale } from '../context/LocaleContext'
import { useTheme } from '../context/ThemeContext'
import {
  Compass,
  MapPin,
  Sparkles,
  Bot,
  BarChart3,
  User,
  Settings,
  X,
  Sun,
  Moon,
  Globe,
  BookOpen,
  BrainCircuit,
  Bookmark
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { id: 'dashboard', label: '首頁', icon: Compass },
  { id: 'path', label: '地圖', icon: MapPin },
  { id: 'aitutor', label: 'AI導師', icon: Bot },
  { id: 'stats', label: '數據', icon: BarChart3 },
  { id: 'profile', label: '設定', icon: Settings },
]

export default function Navigation({
  activeTab,
  setActiveTab,
  readingMode = 'furigana',
  cycleReadingGuide,
  dueCount = 0,
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { isPro, openPaywall, toggleProMock } = useSubscription()
  const { nativeLang, setNativeLang, targetLang, setTargetLang, availableTargetLangs, t } = useLocale()
  const { colorTheme, selectTheme } = useTheme()

  // Theme cycle for quick access: amethyst → kyoto → matcha → amethyst
  const cycleTheme = () => {
    const order = ['amethyst', 'kyoto', 'matcha']
    const idx = order.indexOf(colorTheme)
    selectTheme(order[(idx + 1) % order.length])
  }
  const themeEmoji = colorTheme === 'kyoto' ? '🌸' : colorTheme === 'matcha' ? '🌿' : '🟣'

  const isJapanese = targetLang === 'ja'
  const langLogo = targetLang ? targetLang.substring(0, 2).toUpperCase() : 'AI'

  const handleNavClick = (id) => {
    setActiveTab(id)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] shrink-0 bg-[var(--surface)] border-r border-[var(--border)] h-screen sticky top-0 p-5 z-30 overflow-y-auto theme-text">
        <div className="space-y-4 pb-4 mb-4 border-b border-[var(--border)] px-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center text-[var(--surface)] font-extrabold text-lg shadow-[var(--shadow-xs)] transition-all bg-[var(--primary)]`}
              >
                {langLogo}
              </div>
              <div>
                <h1 className="font-extrabold text-[var(--ink)] text-base leading-tight">
                  {t('appName')}
                </h1>
                <p className="text-xs text-[var(--ink-3)] font-semibold capitalize">
                  Learning: {targetLang}
                </p>
              </div>
            </div>
          </div>

          {/* 🌐 Tri-Native Language Selector Bar */}
          <div className="p-3 rounded-2xl bg-[var(--input-bg)] border border-[var(--input-border)] space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-[var(--ink-2)]">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>{t('nativeLangLabel')}:</span>
              </span>
              <select
                value={nativeLang}
                onChange={(e) => setNativeLang(e.target.value)}
                className="bg-[var(--surface)] text-[var(--ink)] font-bold px-2 py-0.5 rounded-lg border border-[var(--border)] cursor-pointer focus:outline-none"
              >
                <option value="zh">繁體中文</option>
                <option value="ja">日本語</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="flex items-center justify-between font-bold text-[var(--ink-2)]">
              <span className="flex items-center gap-1">
                <span>➔ {t('targetLangLabel')}:</span>
              </span>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-[var(--surface)] text-[var(--ink)] font-bold px-2 py-0.5 rounded-lg border border-[var(--border)] cursor-pointer focus:outline-none"
              >
                {(availableTargetLangs || []).map((lang) => (
                  <option key={lang} value={lang}>
                    {lang === 'zh' ? '中國語 (Chinese)' : lang === 'ja' ? '日本語 (Japanese)' : 'English'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[var(--badge-bg)] text-[var(--ink)] shadow-[var(--shadow-xs)]'
                    : 'text-[var(--ink-2)] hover:bg-[var(--badge-bg)] hover:text-[var(--ink)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[var(--primary)]' : 'text-[var(--ink-3)]'}`} />
                  <span>{item.label}</span>
                </div>
                {isJapanese && item.id === 'srs' && dueCount > 0 && (
                  <span
                    className={`px-2 py-0.5 text-xs font-extrabold rounded-full animate-pulse bg-[var(--danger)] text-white`}
                  >
                    {dueCount}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-[var(--border)] px-2 space-y-3">
          {/* PRO VIP Status Badge & Button */}
          {isPro ? (
            <div className="bg-[var(--primary-light)] border border-[var(--primary-dim)] p-3 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[var(--primary)] font-extrabold text-base">👑</span>
                <div>
                  <div className="font-bold text-[var(--primary)]">VIP 會員</div>
                  <div className="text-[10px] text-[var(--ink-2)]">全內容已解鎖</div>
                </div>
              </div>
              <button
                onClick={toggleProMock}
                className="text-[10px] text-[var(--ink-3)] underline hover:text-[var(--ink)]"
                title="切換測試模式"
              >
                Mock
              </button>
            </div>
          ) : (
            <button
              onClick={openPaywall}
              className="w-full bg-[var(--ink)] text-[var(--surface)] hover:bg-[var(--ink-2)] transition-colors text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="text-[var(--surface)]">✨</span>
              <span>Upgrade to VIP</span>
            </button>
          )}

          <div className="flex items-center justify-between text-[11px] text-[var(--ink-3)]">
            <p>© 2026 AI Learning Hub</p>
            <button onClick={toggleProMock} className="hover:underline text-[10px] text-[var(--ink-3)]">
              {isPro ? '切為免費' : '測試VIP'}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar — Midnight Amethyst Glassmorphism with iOS Safe Area support */}
      <div className="md:hidden fixed top-0 left-0 right-0 mobile-top-bar bg-[var(--surface)]/80 backdrop-blur-xl border-b border-[var(--border)] px-4 z-40 flex items-center justify-between transition-colors duration-500">
        {/* Left: logo + name */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--primary)] text-white font-extrabold text-xs flex items-center justify-center shadow-[var(--shadow-xs)]">
            {langLogo}
          </div>
          <span className="text-sm font-extrabold text-white tracking-tight">
            {t('appName')}
          </span>
          <span className="text-[11px] font-extrabold text-[var(--primary)] bg-[var(--primary-light)] px-2 py-0.5 rounded-full flex items-center gap-1">
            🔥 5天
          </span>
        </div>

        {/* Right: settings */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-[var(--ink-2)] hover:bg-[var(--badge-bg)] transition active:scale-95"
            title="設定"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Apple Slide-up Settings Bottom Sheet Modal (Secondary Actions) */}
      {isSettingsOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg theme-card rounded-b-none rounded-t-[32px] p-6 space-y-6 border-t border-[var(--border)] shadow-2xl animate-slideUp">
            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <h3 className="type-title text-[var(--ink)] flex items-center gap-2">
                <Settings className="w-5 h-5 text-[var(--primary)]" />
                <span>次要功能與偏好設定</span>
              </h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-2 rounded-full bg-[var(--badge-bg)] text-[var(--ink-3)] hover:text-[var(--ink)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Track Switcher Removed */}
            
            {/* 2. Language Matrix Selectors */}
            <div className="space-y-2">
              <label className="type-body text-[var(--ink-3)] block">多語系切換 (母語 ➔ 目標語)</label>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--input-bg)] text-xs font-bold border border-[var(--input-border)]">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[var(--primary)]" />
                  <span className="text-[var(--ink-2)]">母語:</span>
                  <select
                    value={nativeLang}
                    onChange={(e) => setNativeLang(e.target.value)}
                    className="bg-[var(--surface)] px-2 py-1 rounded-lg text-[var(--ink)] font-extrabold focus:outline-none border border-[var(--border)]"
                  >
                    <option value="zh">繁體中文</option>
                    <option value="ja">日本語</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[var(--ink-2)]">學習:</span>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="theme-btn-primary px-2 py-1 rounded-lg font-extrabold focus:outline-none"
                  >
                    {(availableTargetLangs || []).map((lang) => (
                      <option key={lang} value={lang}>
                        {lang === 'zh' ? '中文' : lang === 'ja' ? '日語' : 'English'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Reading Guide Switcher */}
            {isJapanese && cycleReadingGuide && (
              <div className="space-y-2">
                <label className="type-body text-[var(--ink-3)] block">日語發音標註</label>
                <button
                  onClick={cycleReadingGuide}
                  className="w-full p-3.5 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] font-extrabold text-xs border border-[var(--primary-dim)] flex items-center justify-between"
                >
                  <span>標註模式</span>
                  <span className="px-3 py-1 rounded-xl bg-[var(--primary)] text-[var(--surface)] text-xs">
                    {readingMode === 'furigana' ? '振假名 (ふりがな)' : readingMode === 'romaji' ? '羅馬字 (ローマ字)' : '關閉 (OFF)'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation — Floating Pill */}
      <div 
        className="md:hidden fixed bottom-6 left-4 right-4 bg-[var(--surface)]/80 backdrop-blur-2xl border border-[var(--border)] rounded-3xl p-1.5 z-40 flex justify-around items-center transition-colors duration-500"
        style={{ boxShadow: 'var(--shadow-float)' }}
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-1 py-1 rounded-2xl transition-all active:scale-95 touch-manipulation ${
                isActive
                  ? 'text-[var(--primary)] bg-[var(--primary-light)]'
                  : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[var(--primary)] text-[var(--primary)]' : ''}`} />
                {isJapanese && item.id === 'srs' && dueCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-0.5 text-[9px] font-bold rounded-full bg-[var(--danger)] text-white flex items-center justify-center shadow-[var(--shadow-xs)]">
                    {dueCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] leading-none mt-1 font-bold ${isActive ? 'text-[var(--primary)]' : ''}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </>
  )
}


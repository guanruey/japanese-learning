import React from 'react'
import { Inbox, RefreshCw, WifiOff, AlertCircle, CheckCircle, Sparkles } from 'lucide-react'

/**
 * EmptyState — 3 個「醜狀態」設計之一
 * 原則：空狀態不是終點，是引導到下一步的入口
 * 每個空狀態都有 1 個明確的行動按鈕
 */
export function EmptyState({
  type = 'srs',       // 'srs' | 'saved' | 'grammar' | 'vocab' | 'search'
  onAction,
  actionLabel,
}) {
  const configs = {
    srs: {
      emoji: '🎉',
      title: '今天的複習全部完成了！',
      sub: '記憶鞏固中，明天會帶來新題目',
      cta: '👉 學一個新句型',
      accentColor: 'emerald',
    },
    saved: {
      emoji: '🔖',
      title: '還沒有收藏任何內容',
      sub: '在單字、文法頁看到好的，點愛心就能收藏',
      cta: '去瀏覽單字庫',
      accentColor: 'amber',
    },
    grammar: {
      emoji: '📚',
      title: '搜尋不到相關文法',
      sub: '換個關鍵字，或用日文 / 漢字搜尋',
      cta: null,
      accentColor: 'blue',
    },
    vocab: {
      emoji: '📖',
      title: '沒有符合條件的單字',
      sub: '試試調整篩選條件',
      cta: '清除篩選',
      accentColor: 'indigo',
    },
    search: {
      emoji: '🔍',
      title: '找不到結果',
      sub: '試試用平假名或羅馬字搜尋',
      cta: null,
      accentColor: 'slate',
    },
  }

  const config = configs[type] || configs.srs
  const colors = {
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', btn: 'bg-emerald-500 hover:bg-emerald-600' },
    amber:   { bg: 'bg-amber-500/10', text: 'text-amber-600', btn: 'bg-amber-500 hover:bg-amber-600' },
    blue:    { bg: 'bg-blue-500/10', text: 'text-blue-600', btn: 'bg-blue-500 hover:bg-blue-600' },
    indigo:  { bg: 'bg-indigo-500/10', text: 'text-indigo-600', btn: 'bg-indigo-500 hover:bg-indigo-600' },
    slate:   { bg: 'bg-slate-500/10', text: 'text-slate-500', btn: 'bg-slate-500' },
  }
  const c = colors[config.accentColor]

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 gap-4 animate-fadeIn">
      <div className={`w-16 h-16 rounded-3xl ${c.bg} flex items-center justify-center text-3xl`}>
        {config.emoji}
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-extrabold text-[var(--ink)]">{config.title}</h3>
        <p className="text-sm text-[var(--ink-3)] max-w-[260px] leading-relaxed">{config.sub}</p>
      </div>
      {(config.cta || actionLabel) && onAction && (
        <button
          onClick={onAction}
          className={`mt-2 px-5 py-2.5 rounded-full text-white text-sm font-extrabold transition active:scale-95 ${c.btn}`}
        >
          {actionLabel || config.cta}
        </button>
      )}
    </div>
  )
}

/**
 * LoadingState — 載入中狀態
 * 比 spinner 更有情境感
 */
export function LoadingState({ message = '載入中...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fadeIn">
      {/* Animated dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
          />
        ))}
      </div>
      <p className="text-sm text-[var(--ink-3)] font-medium">{message}</p>
    </div>
  )
}

/**
 * ErrorState — 錯誤狀態
 * 包含重試按鈕，不讓用戶困在白畫面
 */
export function ErrorState({
  title = '無法載入資料',
  message = '請確認網路連線後再試',
  isOffline = false,
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 gap-4 animate-fadeIn">
      <div className="w-16 h-16 rounded-3xl bg-rose-500/10 flex items-center justify-center">
        {isOffline
          ? <WifiOff className="w-7 h-7 text-rose-400" />
          : <AlertCircle className="w-7 h-7 text-rose-400" />
        }
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-extrabold text-[var(--ink)]">{title}</h3>
        <p className="text-sm text-[var(--ink-3)] max-w-[260px] leading-relaxed">{message}</p>
        {isOffline && (
          <p className="text-xs text-amber-500 font-bold mt-1">
            💡 離線模式：已儲存的內容仍可瀏覽
          </p>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--primary)] text-white text-sm font-extrabold hover:opacity-90 transition active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          重新嘗試
        </button>
      )}
    </div>
  )
}

/**
 * SuccessToast — 成功反饋（疊加式，不打斷操作）
 */
export function SuccessToast({ message, visible }) {
  if (!visible) return null
  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[var(--surface)] border border-emerald-400/30 shadow-xl transition-all duration-300 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <CheckCircle className="w-4 h-4 text-emerald-500" />
      <span className="text-sm font-bold text-[var(--ink)]">{message}</span>
    </div>
  )
}

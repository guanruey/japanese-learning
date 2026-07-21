import React from 'react'
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  MessageSquareQuote,
  BrainCircuit,
  Bookmark,
  Sun,
  Moon
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: '儀表板', icon: LayoutDashboard },
  { id: 'grammar', label: '文法學習', icon: BookOpen },
  { id: 'vocabulary', label: '核心單字', icon: Sparkles },
  { id: 'phrases', label: '生活片語', icon: MessageSquareQuote },
  { id: 'srs', label: '卡片測驗', icon: BrainCircuit },
  { id: 'saved', label: '我的收藏', icon: Bookmark },
]

export default function Navigation({ activeTab, setActiveTab, theme, toggleTheme, dueCount = 0 }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-screen sticky top-0 p-4 z-30 shadow-sm overflow-y-auto">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 dark:border-slate-700 px-2">

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200 dark:shadow-none">
              日
            </div>
            <div>
              <h1 className="font-bold text-slate-800 dark:text-slate-100 text-base leading-tight">日語學習平台</h1>
              <p className="text-xs text-slate-400 font-medium">JLPT N5 / N4 Pro</p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            title="切換主題"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'srs' && dueCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white animate-pulse">
                    {dueCount}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 px-2 text-xs text-slate-400">
          <p>© 2026 Japanese Learning</p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 px-2 py-2 z-40 flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-medium transition ${
                isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.id === 'srs' && dueCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 text-[10px] font-bold rounded-full bg-rose-500 text-white flex items-center justify-center">
                    {dueCount}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}

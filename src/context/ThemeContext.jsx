import { createContext, useContext, useState, useEffect } from 'react'

// 3 精品淺色主題 — 無暗色系
export const THEMES = {
  amethyst: 'amethyst',  // 🟣 紫水晶 (預設) — Linear / Apple 風格
  kyoto:    'kyoto',     // 🌸 京都春日 — Craft / Bear App 日式溫暖
  matcha:   'matcha',    // 🌿 翡翠抹茶 — Duolingo / Things 3 清爽
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [colorTheme, setColorTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('app_design_theme')
      return Object.values(THEMES).includes(stored) ? stored : 'amethyst'
    }
    return 'amethyst'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const html = document.documentElement
    // Always light — remove dark class if it was ever set
    html.classList.remove('dark')
    html.setAttribute('data-theme', colorTheme)
    if (window.localStorage) {
      localStorage.setItem('app_design_theme', colorTheme)
      // Clear old dark mode flag
      localStorage.removeItem('app_dark_mode')
    }
  }, [colorTheme])

  const selectTheme = (theme) => {
    if (Object.values(THEMES).includes(theme)) setColorTheme(theme)
  }

  return (
    <ThemeContext.Provider value={{ colorTheme, selectTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) return { colorTheme: 'amethyst', selectTheme: () => {} }
  return ctx
}

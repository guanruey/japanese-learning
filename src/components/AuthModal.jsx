import React, { useState } from 'react'
import { Mail, Lock, X, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AuthModal({ isOpen, onClose }) {
  const { signUp, signInWithEmail } = useAuth()
  
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (mode === 'signup') {
        await signUp(email, password)
        // Signup usually auto-logs in if email confirmation is disabled, or requires confirmation
        onClose()
      } else {
        await signInWithEmail(email, password)
        onClose()
      }
    } catch (err) {
      setError(err.message || '發生錯誤，請稍後再試')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[var(--surface)] rounded-3xl shadow-xl border border-[var(--nav-border)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--nav-border)]">
          <h2 className="text-lg font-bold text-[var(--ink)]">
            {mode === 'login' ? '登入帳號' : '建立新帳號'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors rounded-full hover:bg-[var(--canvas)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[var(--ink-2)] text-sm mb-6">
            {mode === 'login' 
              ? '登入以跨裝置同步您的學習進度與收藏。' 
              : '建立帳號即可永久保存您目前的學習進度。'}
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-sm flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--ink)] ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ink-3)]" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[var(--input-bg)] border border-transparent rounded-xl text-[var(--ink)] placeholder-[var(--ink-3)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--ink)] ml-1">密碼</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ink-3)]" />
                <input 
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[var(--input-bg)] border border-transparent rounded-xl text-[var(--ink)] placeholder-[var(--ink-3)] focus:border-[var(--primary)] focus:outline-none transition-colors"
                  placeholder="至少 6 個字元"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 bg-[var(--primary)] text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                mode === 'login' ? '登入' : '註冊'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[var(--canvas)] text-center text-sm">
          <span className="text-[var(--ink-2)]">
            {mode === 'login' ? '還沒有帳號嗎？' : '已經有帳號了？'}
          </span>
          <button 
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login')
              setError('')
            }}
            className="ml-2 font-bold text-[var(--primary)] hover:underline"
          >
            {mode === 'login' ? '立即註冊' : '登入現有帳號'}
          </button>
        </div>
      </div>
    </div>
  )
}

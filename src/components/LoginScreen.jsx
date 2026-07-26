import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bot, Sparkles } from 'lucide-react';
import { useHaptics } from '../hooks/useHaptics';

export default function LoginScreen() {
  const { signInWithGoogle, signInWithApple, signInWithEmail, signUp } = useAuth();
  const { hapticSelection, hapticError } = useHaptics();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    hapticSelection();
    
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (error) {
      setErrorMsg(error.message);
      hapticError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--canvas)] flex flex-col items-center justify-center p-6 animate-fadeIn">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Logo Area */}
        <div className="bg-[var(--primary)] text-white p-4 rounded-3xl mb-6 shadow-sm">
          <Bot className="w-12 h-12" />
        </div>
        
        <h1 className="type-32 text-center mb-2">開始您的學習旅程</h1>
        <p className="type-16 text-center text-[var(--ink-2)] mb-8">
          登入以同步您的記憶進度與 AI 教練紀錄
        </p>

        {/* OAuth Buttons */}
        <div className="w-full flex flex-col gap-3 mb-8">
          <button
            onClick={() => { hapticSelection(); signInWithGoogle(); }}
            className="w-full h-12 bg-white border border-gray-200 text-gray-800 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google 登入
          </button>
          
          <button
            onClick={() => { hapticSelection(); signInWithApple(); }}
            className="w-full h-12 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M16.365 1.43c0 0-3.328-.198-5.32 1.83-2.016 2.05-1.986 5.388-1.986 5.388s3.473-.028 5.418-2.06c1.932-2.014 1.888-5.158 1.888-5.158zM17.155 9.07c-2.314-.055-4.437 1.353-5.59 1.353-1.155 0-2.858-1.127-4.783-1.1-2.52.028-4.838 1.463-6.136 3.717-2.637 4.565-.674 11.328 1.892 15.034 1.25 1.815 2.723 3.82 4.673 3.746 1.874-.083 2.585-1.22 4.85-1.22 2.25 0 2.887 1.22 4.877 1.182 2.046-.037 3.284-1.842 4.52-3.66 1.432-2.094 2.02-4.128 2.045-4.237-.046-.018-3.966-1.52-3.994-6.074-.028-3.808 3.12-5.485 3.265-5.57-1.782-2.604-4.547-2.955-5.62-3.036z" />
            </svg>
            Apple 登入
          </button>
        </div>

        <div className="w-full flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-[var(--border)]"></div>
          <span className="text-xs font-bold text-[var(--ink-3)] uppercase">或使用信箱</span>
          <div className="flex-1 h-px bg-[var(--border)]"></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="w-full flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="電子郵件"
            className="w-full h-12 px-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] focus:outline-none focus:border-[var(--primary)]"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密碼 (至少 6 字元)"
            className="w-full h-12 px-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] focus:outline-none focus:border-[var(--primary)]"
            required
            minLength={6}
          />

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-100 text-rose-600 text-sm font-bold text-center">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full h-12 bg-[var(--primary)] text-white rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : (isLogin ? '登入' : '註冊帳號')}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 text-[var(--primary)] text-sm font-bold active:scale-95 transition-all"
        >
          {isLogin ? '還沒有帳號？點此註冊' : '已經有帳號了？點此登入'}
        </button>
      </div>
    </div>
  );
}

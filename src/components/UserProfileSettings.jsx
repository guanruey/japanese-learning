import React, { useState } from 'react'
import { User, Settings, Globe, Crown, BookOpen, ChevronRight, Award, Flame, Sparkles, ShieldCheck, HelpCircle, Wand2, ChevronDown, Cpu, Lock, X, MessageSquare, Headphones } from 'lucide-react'
import { useSubscription } from '../context/SubscriptionContext'
import { useLocale } from '../context/LocaleContext'
import { useTheme } from '../context/ThemeContext'
import { usePersona, PERSONAS } from '../context/PersonaContext'
import MethodologyView from './MethodologyView'
import ApiKeySetupModal from './ApiKeySetupModal'
import AuthModal from './AuthModal'
import { useAppShellStore } from '../stores/appShellStore'
import { useAuth } from '../context/AuthContext'
import { useAchievementStore, ACHIEVEMENTS } from '../stores/achievementStore'
import { useBuddyStore } from '../stores/buddyStore'
import LegalDocumentsView from './LegalDocumentsView'

function FaqModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[var(--surface)] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-scaleUp">
        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
          <h2 className="text-xl font-black text-[var(--ink)] flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[var(--primary)]" />
            常見問題 (FAQ)
          </h2>
          <button onClick={onClose} className="p-2 bg-[var(--input-bg)] text-[var(--ink-2)] rounded-full hover:text-[var(--ink)] transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto flex flex-col gap-6">
          
          <div>
            <h3 className="font-bold text-[var(--ink)] mb-2">Q: 為什麼有些功能無法使用？</h3>
            <p className="text-[var(--ink-2)] text-sm">A: 我們的 AI 語音與家教功能需要配置您的自帶金鑰 (BYOK) 才能啟動，或者您需要升級到 VIP 方案。</p>
          </div>
          
          <div>
            <h3 className="font-bold text-[var(--ink)] mb-2">Q: SRS 間隔複習是什麼？</h3>
            <p className="text-[var(--ink-2)] text-sm">A: SRS (Spaced Repetition System) 是一種基於遺忘曲線的學習法。當你剛學會一個單字時，系統會在一天後考你；如果你答對了，下次可能是三天後、一週後。這能確保你用最少的時間，把短期記憶轉化為長期記憶。</p>
          </div>
          
          <div>
            <h3 className="font-bold text-[var(--ink)] mb-2">Q: 我可以取消訂閱嗎？</h3>
            <p className="text-[var(--ink-2)] text-sm">A: 當然可以。如果您是透過 App Store 訂閱，請至 iOS 設定的「訂閱項目」中取消。若是透過網頁版，請至付費管理介面取消。</p>
          </div>

          <div>
            <h3 className="font-bold text-[var(--ink)] mb-2">Q: 有問題如何聯繫客服？</h3>
            <p className="text-[var(--ink-2)] text-sm">A: 我們是由兩人組成的獨立開發團隊，可能無法像大公司一樣提供即時回覆。請透過下方的 Discord 群組或是意見回饋表單與我們聯繫，我們保證會在 3-5 個工作天內詳細回覆您的問題！</p>
          </div>

        </div>
        <div className="p-4 border-t border-[var(--border)] bg-[var(--card)]">
          <button onClick={onClose} className="w-full py-3 bg-[var(--primary)] text-white font-bold rounded-xl hover:opacity-90 transition">
            了解！
          </button>
        </div>
      </div>
    </div>
  )
}

export default function UserProfileSettings() {
  const { readingMode, cycleReadingGuide } = useAppShellStore()
  const { unlockedBadges } = useAchievementStore()
  const { buddyId, buddyName, buddyStreak, hasSentInvite, inviteCode, inviteBuddy, simulateBuddyAccept, removeBuddy } = useBuddyStore()
  const { user, signOut } = useAuth()
  const { colorTheme, selectTheme } = useTheme()
  const { isPro, hasByokLicense, sakuraBalance, openPaywall, unlockByokLicense, toggleProMock, consumeGems } = useSubscription()
  const { nativeLang, setNativeLang, targetLang, setTargetLang, availableTargetLangs } = useLocale()
  const { currentPersona, setPersona, personaData, unlockedPersonas, unlockPersona } = usePersona()
  const [showMethodology, setShowMethodology] = useState(false)
  const [showLegalDocuments, setShowLegalDocuments] = useState(false)
  
  const [certScore, setCertScore] = useState('Auto')
  const [speakingConfidence, setSpeakingConfidence] = useState('Auto')

  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isThemeOpen, setIsThemeOpen] = useState(false)
  const [isPersonaOpen, setIsPersonaOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [isCertOpen, setIsCertOpen] = useState(false)
  const [isPrefOpen, setIsPrefOpen] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [isApiModalOpen, setIsApiModalOpen] = useState(false)
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false)

  // Force re-render of key status when modal closes
  const [hasApiKey, setHasApiKey] = useState(false)
  
  React.useEffect(() => {
    const provider = localStorage.getItem('USER_AI_PROVIDER') || 'openai'
    setHasApiKey(!!localStorage.getItem(`USER_${provider.toUpperCase()}_API_KEY`))
  }, [isApiModalOpen])

  const isJapanese = targetLang === 'ja'

  const handlePersonaClick = (p) => {
    const isUnlocked = isPro || unlockedPersonas.includes(p.id) || p.price === 0
    if (isUnlocked) {
      setPersona(p.id)
    } else {
      if (window.confirm(`解鎖 ${p.name} 需要 ${p.price} 顆櫻花石。您目前有 ${sakuraBalance} 顆。確定解鎖嗎？`)) {
        if (consumeGems(p.price)) {
          unlockPersona(p.id)
          setPersona(p.id)
        } else {
          alert('櫻花石不足！請升級 VIP 或儲值。')
          openPaywall()
        }
      }
    }
  }

  if (showMethodology) {
    return <MethodologyView onBack={() => setShowMethodology(false)} />
  }
  
  if (showLegalDocuments) {
    return <LegalDocumentsView onBack={() => setShowLegalDocuments(false)} />
  }

  return (
    <div className="min-h-full flex flex-col max-w-md mx-auto w-full gap-6 animate-fadeIn pb-12 text-[var(--ink)]">
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* 🔐 Account Status Card */}
      <div className="qp-card p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-[rgba(108,92,231,0.1)] flex items-center justify-center text-[#6C5CE7]">
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[var(--ink)] text-lg truncate">
              {user?.is_anonymous ? '訪客模式' : (user?.email || '已登入用戶')}
            </h3>
            <p className="text-sm text-[var(--ink-2)]">
              {user?.is_anonymous ? '進度僅保存在此裝置' : '進度已安全同步至雲端'}
            </p>
          </div>
        </div>
        
        {user?.is_anonymous ? (
          <button 
            onClick={() => setIsAuthOpen(true)}
            className="w-full py-3 bg-[var(--primary)] text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            註冊 / 登入以永久保存進度
          </button>
        ) : (
          <button 
            onClick={signOut}
            className="w-full py-3 bg-[var(--input-bg)] text-[var(--ink-2)] font-bold rounded-xl hover:bg-[var(--nav-bg)] transition-colors"
          >
            登出
          </button>
        )}
      </div>
      {/* 🎨 0. 精品主題選擇器 — 3 款淺色系 */}
      <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] flex flex-col gap-4">
        <button
          onClick={() => setIsThemeOpen(!isThemeOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-xs uppercase tracking-widest text-[var(--ink-3)] font-extrabold flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: 'var(--primary)' }} />
            <span className="font-bold text-[var(--ink)]">主題風格</span>
          </h3>
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
            >
              即時切換
            </span>
            <ChevronDown className={`w-4 h-4 text-[var(--ink-3)] transition-transform ${isThemeOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        <div className={`overflow-hidden transition-all duration-300 ${isThemeOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
          <div className="flex flex-col gap-2.5 pt-2">
          {[
            {
              id: 'amethyst',
              name: '🟣 紫水晶 Amethyst',
              desc: '精準 · 科技感 · Linear 風格',
              swatch: 'linear-gradient(135deg, #7C3AED, #4F46E5, #0EA5E9)',
            },
            {
              id: 'kyoto',
              name: '🌸 京都春日 Kyoto',
              desc: '溫暖 · 手感 · Craft 日式美學',
              swatch: 'linear-gradient(135deg, #BE123C, #D97706, #B45309)',
            },
            {
              id: 'matcha',
              name: '🌿 翡翠抹茶 Matcha',
              desc: '清爽 · 自然 · Duolingo 活力感',
              swatch: 'linear-gradient(135deg, #059669, #0D9488, #0284C7)',
            },
          ].map((t) => {
            const isSelected = (colorTheme || 'amethyst') === t.id
            return (
              <button
                key={t.id}
                onClick={() => selectTheme(t.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-4 active:scale-[0.99] ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary-light)] shadow-[var(--shadow-primary)] scale-[1.01]'
                    : 'border-[var(--border)] bg-[var(--input-bg)] hover:border-[var(--primary-dim)] hover:bg-[var(--surface)]'
                }`}
              >
                {/* Color Swatch */}
                <div
                  className="w-10 h-10 rounded-xl shrink-0 shadow-sm"
                  style={{ background: t.swatch }}
                />

                {/* Info */}
                <div className="flex-1 flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-[var(--ink)]">{t.name}</span>
                    {isSelected && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full text-white font-black"
                        style={{ background: 'var(--primary)' }}
                      >
                        使用中
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[var(--ink-3)] font-medium">{t.desc}</span>
                </div>

                {/* Check */}
                {isSelected && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'var(--primary)' }}
                  >
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </button>
            )
          })}
          </div>
        </div>
      </div>
      {/* 🌟 1. Profile Hero Card — uses theme CSS variables */}
      <div
        className="relative overflow-hidden rounded-[28px] p-6 text-[var(--ink)] shadow-[var(--shadow-card)] border border-[var(--border)] bg-[var(--surface-2)]"
      >
        {/* Background Decorative Glow Circle */}
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-[var(--surface)] blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-36 h-36 rounded-full bg-[var(--surface)] blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-5">
          {/* Top Row: Avatar + Title & Streak */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] font-extrabold text-3xl flex items-center justify-center shadow-sm">
                  {personaData.icon}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#D97706] flex items-center justify-center text-xs shadow-md border-2 border-[var(--surface-2)]" title="VIP 驗證標章">
                  <Crown className="w-3.5 h-3.5 text-white fill-white" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-extrabold tracking-tight text-[var(--ink)] flex items-center gap-2 capitalize">
                  <span>{targetLang} {personaData.name}</span>
                </h2>
                <div className="flex items-center gap-2 text-xs font-medium text-[var(--ink-2)]">
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--primary-light)] border border-[var(--primary-dim)] flex items-center gap-1 font-extrabold text-[var(--primary)]">
                    <Wand2 className="w-3 h-3 text-[var(--primary)]" />
                    <span>難度機制：{speakingConfidence === 'Auto' ? '🤖 AI 自動校準 (i+1)' : `CEFR ${speakingConfidence}`}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Streak Counter Pill */}
            <div className="flex flex-col items-end gap-1">
              <div className="px-3 py-1.5 rounded-2xl bg-[#D97706]/10 border border-[#D97706]/20 flex items-center gap-1.5 shadow-sm">
                <Flame className="w-4 h-4 text-[#D97706] fill-[#D97706] animate-pulse" />
                <span className="text-sm font-extrabold text-[#D97706]">5 天</span>
              </div>
              <span className="text-[10px] text-[var(--ink-3)] font-medium">連續鍛鍊中</span>
            </div>
          </div>

          {/* Membership CTA Banner */}
          {isPro ? (
            <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--primary-dim)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">👑</span>
                <div className="flex flex-col">
                  <div className="text-sm font-bold text-[var(--primary)]">VIP 會員</div>
                  <div className="text-[11px] text-[var(--ink-3)]">全情境 TBLT 與 AI 音訊已無限解鎖</div>
                </div>
              </div>
              <button 
                onClick={toggleProMock}
                className="px-2.5 py-1 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--badge-bg)] text-[var(--ink-2)] text-[11px] font-bold transition active:scale-95 border border-[var(--border)]"
              >
                升級 VIP 支援我們
              </button>
            </div>
          ) : (
            <button
              onClick={openPaywall}
              className="w-full py-3.5 px-4 rounded-2xl bg-[var(--primary)] text-white font-extrabold text-sm shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Crown className="w-4.5 h-4.5 text-white fill-white" />
              <span>✨ 開啟全領域語感極限 (7天免費體驗)</span>
            </button>
          )}
        </div>
      </div>

      {/* 👯 Buddy System Section */}
      <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] flex flex-col gap-4">
        <h3 className="text-xs uppercase tracking-widest text-[var(--ink-3)] font-extrabold flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-500" />
          <span className="font-bold text-[var(--ink)]">學習搭檔 (7日共學)</span>
        </h3>
        
        {buddyId ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-3 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl">
                  👩‍💻
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[var(--ink)] text-sm">{buddyName}</span>
                  <span className="text-[10px] text-[var(--ink-3)] font-semibold">共同學習中</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-black text-emerald-600 flex items-center gap-1">
                  <Flame className="w-4 h-4 fill-emerald-500 text-emerald-500" /> {buddyStreak}/7
                </span>
              </div>
            </div>
            <button 
              onClick={removeBuddy}
              className="text-xs text-[var(--ink-3)] hover:text-[var(--ink)] font-semibold text-center w-full py-2"
            >
              解除搭檔關係
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-[var(--ink-2)] font-medium leading-relaxed">
              邀請好友成為學習搭檔，完成 7 日共學任務即可解鎖特殊徽章與 100 顆櫻花石！
            </p>
            {!hasSentInvite ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="font-mono font-bold text-[var(--ink)] tracking-wider">{inviteCode}</span>
                </div>
                <button 
                  onClick={inviteBuddy}
                  className="bg-[var(--primary)] text-white px-4 py-3 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all whitespace-nowrap shadow-[var(--shadow-primary)]"
                >
                  發送邀請
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="bg-[var(--primary-light)] border border-[var(--primary-dim)] text-[var(--primary)] p-3 rounded-xl text-center text-sm font-bold animate-pulse">
                  邀請已發送，等待對方確認中...
                </div>
                <button 
                  onClick={simulateBuddyAccept}
                  className="text-xs text-[var(--ink-3)] hover:text-[var(--ink)] font-semibold flex items-center justify-center gap-1 p-2"
                >
                  <Sparkles className="w-3 h-3" /> (開發用) 模擬對方接受邀請
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🏆 Achievements Section */}
      <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] flex flex-col gap-4">
        <h3 className="text-xs uppercase tracking-widest text-[var(--ink-3)] font-extrabold flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span className="font-bold text-[var(--ink)]">成就與徽章</span>
        </h3>
        
        <div className="grid grid-cols-4 gap-3">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = unlockedBadges.includes(ach.id)
            return (
              <div 
                key={ach.id} 
                className={`flex flex-col items-center gap-2 ${isUnlocked ? 'opacity-100' : 'opacity-40 grayscale'} transition-all`}
                title={ach.description}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-inner border-2 ${isUnlocked ? 'bg-amber-50 border-amber-300' : 'bg-[var(--input-bg)] border-[var(--border)]'}`}>
                  {ach.icon}
                </div>
                <div className="text-[10px] font-bold text-center leading-tight h-6 flex items-start justify-center text-[var(--ink-2)]">
                  {ach.title}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 🎭 1.5 角色人設選擇器 (Persona Engine) */}
      <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] flex flex-col gap-4">
        <button
          onClick={() => setIsPersonaOpen(!isPersonaOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-xs uppercase tracking-widest text-[var(--ink-3)] font-extrabold flex items-center gap-2">
            <User className="w-4 h-4 text-[#D97706]" />
            <span className="font-bold text-[var(--ink)]">AI 教練人設</span>
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
              {personaData.name}
            </span>
            <ChevronDown className={`w-4 h-4 text-[var(--ink-3)] transition-transform ${isPersonaOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        <div className={`overflow-hidden transition-all duration-300 ${isPersonaOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {Object.values(PERSONAS).map((p) => {
              const isSelected = currentPersona === p.id
              const isUnlocked = isPro || unlockedPersonas.includes(p.id) || p.price === 0

              return (
                <button
                  key={p.id}
                  onClick={() => handlePersonaClick(p)}
                  className={`relative p-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-4 active:scale-[0.99] ${
                    isSelected
                      ? 'border-[#D97706] bg-amber-50 shadow-sm scale-[1.01]'
                      : 'border-[var(--border)] bg-[var(--input-bg)] hover:border-amber-200 hover:bg-[var(--surface)]'
                  } ${!isUnlocked ? 'opacity-80' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-white border border-amber-100 flex items-center justify-center text-xl shrink-0 ${!isUnlocked ? 'grayscale' : ''}`}>
                    {p.icon}
                  </div>
                  <div className="flex-1 flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[var(--ink)]">{p.name}</span>
                      {!isUnlocked && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded-md">
                          <Lock className="w-3 h-3" /> {p.price} 石
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[var(--ink-3)] font-medium leading-tight">{p.description}</span>
                  </div>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-[#D97706] shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 📚 2. 學術實證與方法論 (Methodology Entry) */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs uppercase tracking-wider text-[var(--ink-3)] font-extrabold px-1">
          科學學習體系
        </span>

        <button
          onClick={() => setShowMethodology(true)}
          className="qp-card flex items-center justify-between p-4 min-h-[52px] text-left border border-[var(--border)] bg-[var(--surface)] transition active:scale-[0.99] group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="type-16 text-[var(--ink)] font-bold transition">
                我們的學習方法論 (Evidence-Based SLA)
              </span>
              <span className="text-xs text-[var(--ink-3)] font-medium">
                結合 Input Hypothesis (i+1) 與 FSRS 記憶算法
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition" />
        </button>
      </div>

      {/* 🤖 2.5 BYOK 極客專區 (Multi-LLM) */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs uppercase tracking-wider text-[var(--ink-3)] font-extrabold px-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#D97706]" />
            極客專區 (BYOK Multi-LLM)
          </div>
          {hasByokLicense && <span className="text-[#D97706] text-[10px] font-black">BYOK License Active</span>}
        </span>

        <button
          onClick={() => hasByokLicense ? setIsApiModalOpen(true) : unlockByokLicense()}
          className="qp-card flex items-center justify-between p-4 min-h-[52px] text-left border border-[var(--primary-dim)] bg-[var(--primary-light)] transition active:scale-[0.99] group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="type-16 text-[var(--primary)] font-extrabold transition flex items-center gap-2">
                自帶金鑰 (Bring Your Own Key)
                {hasByokLicense && hasApiKey && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black tracking-widest">
                    已綁定
                  </span>
                )}
              </span>
              <span className="text-xs text-[var(--ink-2)] font-medium">
                {hasByokLicense 
                  ? '切換 OpenAI / Anthropic 等原廠模型' 
                  : '支付 $19.99 永久解鎖進階面板 (Mock Unlock)'}
              </span>
            </div>
          </div>
          {!hasApiKey && (
            <ChevronRight className="w-5 h-5 text-[var(--primary)] opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
          )}
        </button>
      </div>

      {/* 💳 2.8 櫻花石商店與 VIP 訂閱 */}
      <div className="qp-card p-5 sm:p-6 flex flex-col gap-4 border border-[var(--border)] bg-pink-50/50">
        <h3 className="type-13 uppercase text-[var(--ink-3)] font-extrabold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-500" />
          <span className="font-bold text-[var(--ink)]">櫻花石商店與 VIP 方案</span>
        </h3>

        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-200 shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-extrabold text-[var(--ink)]">
                目前狀態：{isPro ? 'VIP 會員' : '免費體驗版'}
              </span>
              <span className="text-xs text-[var(--ink-3)] font-medium">
                櫻花石餘額：<span className="text-pink-600 font-bold">{isPro ? '無限' : sakuraBalance} 顆</span>
              </span>
            </div>
            {isPro ? (
              <span className="px-2.5 py-1 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-black tracking-wider shadow-sm">
                ACTIVE
              </span>
            ) : (
              <button 
                onClick={openPaywall}
                className="px-3 py-1.5 rounded-xl bg-pink-100 text-pink-700 text-xs font-black transition active:scale-95"
              >
                儲值櫻花石
              </button>
            )}
          </div>

          <button
            onClick={openPaywall}
            className="w-full py-3.5 rounded-2xl font-extrabold text-sm transition active:scale-[0.98] border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--badge-bg)] text-[var(--ink)] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[var(--primary)]" />
            {isPro ? '檢視 VIP 專屬權益清單' : '查看免費與 VIP 方案差異'}
          </button>
        </div>
      </div>

      {/* 🌐 3. 多語系矩陣設定 (Apple Segmented Control Style) */}
      <div className="qp-card p-5 sm:p-6 flex flex-col gap-4">
        <button
          onClick={() => setIsLangOpen(!isLangOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="type-13 uppercase text-[var(--ink-3)] font-extrabold flex items-center gap-2">
            <Globe className="w-4 h-4 text-[var(--primary)]" />
            <span className="font-bold text-[var(--ink)]">多語系對照矩陣</span>
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[var(--primary)] bg-[var(--primary-light)] px-2 py-0.5 rounded-full">
              獨立存檔中
            </span>
            <ChevronDown className={`w-4 h-4 text-[var(--ink-3)] transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        <div className={`overflow-hidden transition-all duration-300 ${isLangOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
          <div className="flex flex-col gap-4 pt-2">
          {/* 母語對照 */}
          <div className="flex flex-col gap-2">
            <span className="type-13 text-[var(--ink-2)] font-bold ml-1">我的母語 (Base Language)</span>
            <div className="flex items-center p-1 bg-[var(--input-bg)] rounded-2xl h-[48px] border border-[var(--input-border)]">
              {[
                { id: 'zh', label: '繁體中文 🇹🇼' },
                { id: 'ja', label: '日本語 🇯🇵' },
                { id: 'en', label: 'English 🇺🇸' }
              ].map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setNativeLang(lang.id)}
                  className={`flex-1 h-full rounded-[14px] type-13 font-extrabold transition-all duration-200 flex items-center justify-center ${
                    nativeLang === lang.id 
                      ? 'bg-[var(--surface)] text-[var(--ink)] shadow-md border border-[var(--border)] scale-[1.02]' 
                      : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* 學習目標 */}
          <div className="flex flex-col gap-2">
            <span className="type-13 text-[var(--ink-2)] font-bold ml-1">學習目標 (Target Language)</span>
            
            {/* Free Text Input for Omni-Language */}
            <input 
              type="text"
              placeholder="輸入你想學的任何語言 (e.g. 法文, Spanish, Elvish)"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[var(--canvas)] border border-[var(--border)] text-sm font-bold focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition"
            />
            
            {/* Quick Select Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-1">
              {(availableTargetLangs || []).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setTargetLang(lang)}
                  className={`px-4 py-2 shrink-0 rounded-[14px] type-13 font-extrabold transition-all duration-200 border ${
                    targetLang === lang 
                      ? 'bg-[var(--primary-light)] border-[var(--primary)] text-[var(--primary)] scale-[1.02]' 
                      : 'bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--ink-3)] hover:text-[var(--ink)]'
                  }`}
                >
                  {lang === 'zh' ? '中文' : lang === 'ja' ? '日本語' : lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : lang === 'ko' ? '한국어' : lang}
                </button>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* 🏆 4. 檢定對照與 CEFR 動態校準 (不需輸入等級的零摩擦設計) */}
      <div className="qp-card p-5 sm:p-6 flex flex-col gap-4 border border-[var(--border)]">
        <button
          onClick={() => setIsCertOpen(!isCertOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="type-13 uppercase text-[var(--ink-3)] font-extrabold flex items-center gap-2">
            <Award className="w-4 h-4 text-[var(--primary)]" />
            <span className="font-bold text-[var(--ink)]">程度與難度安排 (Placement & Difficulty)</span>
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold text-[var(--primary)] bg-[var(--primary-light)] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Wand2 className="w-3 h-3" />
              AI 自動感應
            </span>
            <ChevronDown className={`w-4 h-4 text-[var(--ink-3)] transition-transform ${isCertOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        <div className={`overflow-hidden transition-all duration-300 ${isCertOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
          <div className="flex flex-col gap-5 pt-2">
            {/* 🤖 Zero-Friction Option: "I Don't Know My Level" Banner */}
            <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center font-extrabold shadow-sm">
                    🤖
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-[var(--ink)]">
                      我不確定等級？讓 AI 為我自動校準！
                    </span>
                    <span className="text-xs text-[var(--ink-3)] font-medium">
                  零摩擦入門，從基礎情境開始，AI 依對話實力逐步增強難度
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setCertScore('Auto')
              setSpeakingConfidence('Auto')
            }}
            className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 ${
              speakingConfidence === 'Auto'
                ? 'theme-btn-primary'
                : 'bg-[var(--input-bg)] text-[var(--ink-2)] border border-[var(--input-border)] hover:bg-[var(--badge-bg)]'
            }`}
          >
            <Wand2 className="w-4 h-4 text-amber-300" />
            <span>{speakingConfidence === 'Auto' ? '✓ 已開啟 AI 動態漸進難度模式 (推薦)' : '啟動 AI 自動漸進難度模式'}</span>
          </button>
        </div>

        {/* Optional Manual Override Section */}
        <div className="flex flex-col gap-4 pt-2 border-t border-[var(--border)]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--ink-3)] font-bold">或手動設定特定檢定目標 (選填)：</span>
            {speakingConfidence !== 'Auto' && (
              <button 
                onClick={() => { setCertScore('Auto'); setSpeakingConfidence('Auto'); }}
                className="text-xs text-[var(--primary)] font-bold hover:underline"
              >
                重設為 AI 自動
              </button>
            )}
          </div>

          {/* Manual JLPT / Score buttons */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {targetLang === 'ja' ? (
                ['Auto', 'N5', 'N4', 'N3', 'N2', 'N1'].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setCertScore(lvl)}
                    className={`flex-1 min-w-[50px] py-2 rounded-xl font-extrabold text-xs transition border ${
                      certScore === lvl
                        ? 'theme-btn-primary px-0'
                        : 'bg-[var(--input-bg)] text-[var(--ink-2)] border-transparent hover:bg-[var(--badge-bg)]'
                    }`}
                  >
                    {lvl === 'Auto' ? '🤖 自動' : lvl}
                  </button>
                ))
              ) : (
                <input
                  type="text"
                  placeholder={`例如：${targetLang === 'en' ? '800 分' : 'HSK 4 級'}`}
                  value={certScore === 'Auto' ? '' : certScore}
                  onChange={(e) => setCertScore(e.target.value)}
                  className="w-full bg-[var(--input-bg)] rounded-2xl px-4 min-h-[44px] text-xs text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition border border-[var(--input-border)]"
                />
              )}
            </div>

            {/* Speaking Confidence Manual Selector */}
            <div className="grid grid-cols-7 gap-1">
              {['Auto', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSpeakingConfidence(level)}
                  className={`py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center border ${
                    speakingConfidence === level 
                      ? 'theme-btn-primary px-0 shadow-sm' 
                      : 'bg-[var(--input-bg)] text-[var(--ink-2)] border-transparent hover:bg-[var(--badge-bg)]'
                  }`}
                >
                  {level === 'Auto' ? '🤖' : level}
                </button>
              ))}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* ⚙️ 5. 偏好設定 (Preferences & Theme) */}
      <div className="qp-card p-5 sm:p-6 flex flex-col gap-4">
        <button
          onClick={() => setIsPrefOpen(!isPrefOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="type-13 uppercase text-[var(--ink-3)] font-extrabold flex items-center gap-2">
            <Settings className="w-4 h-4 text-[var(--primary)]" />
            <span className="font-bold text-[var(--ink)]">介面與閱讀偏好</span>
          </h3>
          <ChevronDown className={`w-4 h-4 text-[var(--ink-3)] transition-transform ${isPrefOpen ? 'rotate-180' : ''}`} />
        </button>

        <div className={`overflow-hidden transition-all duration-300 ${isPrefOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
          <div className="flex flex-col gap-3 pt-2">
            {isJapanese && cycleReadingGuide && (
              <button
                onClick={cycleReadingGuide}
                className="qp-card w-full p-4 min-h-[50px] text-[var(--ink)] type-16 font-bold flex items-center justify-between bg-[var(--surface)] hover:bg-[var(--badge-bg)] border border-[var(--border)] transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">⛩️</span>
                  <span>日語發音標註模式</span>
                </div>
                <span className="px-3 py-1 rounded-xl bg-[var(--primary)] text-white type-13 font-extrabold shadow-sm">
                  {readingMode === 'furigana' ? '振假名 (ふりがな)' : readingMode === 'romaji' ? '羅馬字 (ローマ字)' : '關閉標註'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 🤝 6. 支援與社群 (Support & Community) */}
      <div className="qp-card p-5 sm:p-6 flex flex-col gap-4">
        <button
          onClick={() => setIsSupportOpen(!isSupportOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="type-13 uppercase text-[var(--ink-3)] font-extrabold flex items-center gap-2">
            <Headphones className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-[var(--ink)]">支援與社群</span>
          </h3>
          <ChevronDown className={`w-4 h-4 text-[var(--ink-3)] transition-transform ${isSupportOpen ? 'rotate-180' : ''}`} />
        </button>

        <div className={`overflow-hidden transition-all duration-300 ${isSupportOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
          <div className="flex flex-col gap-3 pt-2">
            
            {/* Disclaimer */}
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl mb-2">
              <p className="text-xs text-blue-800 font-bold flex items-center gap-1.5 mb-1">
                <Globe className="w-3.5 h-3.5" /> 獨立開發團隊聲明
              </p>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                我們是由兩位熱愛日語的開發者打造的獨立產品，可能無法像大企業提供即時 24 小時客服。如果您遇到任何問題，請透過下方的管道聯絡我們，我們承諾會在 3-5 個工作日內回覆。感謝您的包容與支持！
              </p>
            </div>

            <button
              onClick={() => setIsFaqModalOpen(true)}
              className="qp-card w-full p-4 min-h-[50px] text-[var(--ink)] type-16 font-bold flex items-center justify-between bg-[var(--surface)] hover:bg-[var(--badge-bg)] border border-[var(--border)] transition"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-5 h-5 text-indigo-500" />
                <span>常見問題 (FAQ)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--ink-3)]" />
            </button>

            <button
              onClick={() => alert('即將開啟 Discord 群組...')}
              className="qp-card w-full p-4 min-h-[50px] text-[var(--ink)] type-16 font-bold flex items-center justify-between bg-[var(--surface)] hover:bg-[#5865F2]/10 border border-[var(--border)] hover:border-[#5865F2]/30 transition"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-[#5865F2]" />
                <span className="text-[#5865F2]">加入 Discord 討論群</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5865F2]/50" />
            </button>

            <button
              onClick={() => alert('即將開啟意見回饋表單...')}
              className="qp-card w-full p-4 min-h-[50px] text-[var(--ink)] type-16 font-bold flex items-center justify-between bg-[var(--surface)] hover:bg-[var(--badge-bg)] border border-[var(--border)] transition"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">📝</span>
                <span>回報問題與建議 (Feedback)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--ink-3)]" />
            </button>

            <button
              onClick={() => setShowLegalDocuments(true)}
              className="qp-card w-full p-4 min-h-[50px] text-[var(--ink-2)] type-16 font-bold flex items-center justify-between bg-[var(--input-bg)] border border-[var(--border)] transition hover:text-[var(--ink)] mt-2"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5" />
                <span>隱私權政策與服務條款</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <ApiKeySetupModal 
        isOpen={isApiModalOpen} 
        onClose={() => setIsApiModalOpen(false)} 
        onSaveSuccess={() => setHasApiKey(true)}
      />
      
      <FaqModal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
      />
    </div>
  )
}

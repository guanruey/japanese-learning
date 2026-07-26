import React, { useState } from 'react'
import { Trophy, Flame, BrainCircuit, Award, Zap, Info, X, Microscope, Activity, BookOpen, ChevronDown, Sparkles, Mic } from 'lucide-react'
import MemoryAnalyticsChart from './MemoryAnalyticsChart'
import { useLearnerModelStore } from '../stores/learnerModelStore'
import { generateWeaknessPrescriptions } from '../services/weaknessEngine'

export default function StatsDashboard({
  vocabList = [],
  grammarList = [],
  dueCount = 0,
  streakDays = 5,
}) {
  const badges = [
    { id: 1, name: '初露鋒芒', desc: '完成首次 5 分鐘測驗', icon: '🌟', unlocked: true },
    { id: 2, name: '五日連勝', desc: '連續 5 天完成學習目標', icon: '🔥', unlocked: true },
    { id: 3, name: 'N5 文法大師', desc: '掌握 60 個 N5 核心文法', icon: '🏆', unlocked: true },
    { id: 4, name: '單字百人斬', desc: '精通 100 個基礎單字', icon: '⚡', unlocked: false },
  ]

  const [showFsrsInfo, setShowFsrsInfo] = useState(false)
  const [isCefrOpen, setIsCefrOpen] = useState(false)
  const [isFsrsOpen, setIsFsrsOpen] = useState(false)
  const [isSlaOpen, setIsSlaOpen] = useState(false)
  const [isBadgesOpen, setIsBadgesOpen] = useState(false)
  const [isWeaknessOpen, setIsWeaknessOpen] = useState(true)

  const { weaknessScores, weaknessStats } = useLearnerModelStore()
  const userGoal = localStorage.getItem('app_user_goal') || 'travel'
  
  const prescriptions = React.useMemo(() => {
    return generateWeaknessPrescriptions(weaknessScores, weaknessStats, userGoal);
  }, [weaknessScores, weaknessStats, userGoal]);

  return (
    <div className="min-h-full flex flex-col max-w-md mx-auto w-full gap-6 animate-fadeIn theme-text">
      {/* Quiet Premium Stats Card — Option A Glassmorphism */}
      <div className="p-6 rounded-3xl theme-surface border border-[var(--border)] shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-[var(--ink)] flex items-center gap-2">
            <Trophy className="w-7 h-7 text-[var(--progress-text)]" />
            <span>個人數據</span>
          </h2>
          <span className="text-xs font-bold text-[var(--ink-3)]">FSRS 記憶模型</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center flex flex-col gap-1">
            <div className="flex items-center justify-center gap-1 text-amber-500 text-2xl font-black">
              <Flame className="w-6 h-6 fill-amber-400" />
              <span>{streakDays} 天</span>
            </div>
            <div className="text-xs font-bold text-[var(--ink-3)]">連勝紀錄</div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--primary-light)] border border-[var(--primary-dim)] text-center flex flex-col gap-1">
            <div className="flex items-center justify-center gap-1 text-[var(--primary)] text-2xl font-black">
              <Zap className="w-6 h-6" style={{ fill: 'var(--primary)' }} />
              <span>1,450 XP</span>
            </div>
            <div className="text-xs font-bold text-[var(--ink-3)]">累積經驗</div>
          </div>
        </div>

        {/* CEFR Progress */}
        <div className="flex flex-col gap-2 mt-1">
          <button
            onClick={() => setIsCefrOpen(!isCefrOpen)}
            className="w-full flex items-center justify-between py-1 text-left"
          >
            <span className="text-xs text-[var(--ink-3)] font-bold">目前 CEFR 等級</span>
            <ChevronDown className={`w-4 h-4 text-[var(--ink-3)] transition-transform ${isCefrOpen ? 'rotate-180' : ''}`} />
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${isCefrOpen ? 'max-h-[600px]' : 'max-h-0'}`}>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-[var(--ink)] font-black">A2 (相當於 JLPT N4)</span>
              <span className="text-xs text-[var(--primary)] font-extrabold">65% 往 B1</span>
            </div>
            <div className="w-full h-2.5 bg-[var(--input-bg)] rounded-full overflow-hidden border border-[var(--input-border)]">
              <div className="h-full bg-[var(--primary)] rounded-full shadow-sm" style={{ width: '65%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* FSRS Metrics */}
      <div className="p-6 rounded-3xl theme-surface border border-[var(--border)] shadow-2xl flex flex-col gap-4">
        <button
          onClick={() => setIsFsrsOpen(!isFsrsOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-xl font-black text-[var(--ink)] flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-[var(--primary)]" />
            <span>FSRS 記憶健康度</span>
          </h3>
          <ChevronDown className={`w-5 h-5 text-[var(--ink-3)] transition-transform ${isFsrsOpen ? 'rotate-180' : ''}`} />
        </button>
        
        <div className={`flex flex-col gap-4 overflow-hidden transition-all duration-300 ${isFsrsOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setShowFsrsInfo(true)}
              className="flex flex-col gap-1 p-4 rounded-2xl border border-[var(--border)] bg-[var(--canvas)] text-left hover:bg-[var(--surface)] transition relative"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-[var(--ink-2)] font-bold">提取率 (R)</span>
                <Info className="w-3.5 h-3.5 text-[var(--ink-3)]" />
              </div>
              <span className="text-2xl font-black text-emerald-600">92%</span>
              <span className="text-[11px] text-[var(--ink-3)]">平均機率成功回憶</span>
            </button>
            
            <button 
              onClick={() => setShowFsrsInfo(true)}
              className="flex flex-col gap-1 p-4 rounded-2xl border border-[var(--border)] bg-[var(--canvas)] text-left hover:bg-[var(--surface)] transition relative"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-[var(--ink-2)] font-bold">穩定度 (S)</span>
                <Info className="w-3.5 h-3.5 text-[var(--ink-3)]" />
              </div>
              <span className="text-2xl font-black text-[var(--primary)]">14.5天</span>
              <span className="text-[11px] text-[var(--ink-3)]">平均遺忘半衰期</span>
            </button>
          </div>

          {showFsrsInfo && (
            <div className="mt-2 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] relative animate-fadeIn">
              <button onClick={() => setShowFsrsInfo(false)} className="absolute top-3 right-3 p-1 text-[var(--ink-3)] hover:text-[var(--ink)] transition">
                <X className="w-4 h-4" />
              </button>
              <h4 className="text-xs font-black text-[var(--ink)] mb-2">關於 FSRS 記憶模型</h4>
              <ul className="text-xs text-[var(--ink-2)] flex flex-col gap-2">
                <li><strong className="text-emerald-600">提取率 (R)</strong>: 代表您「現在」能想起該單字的機率。92% 代表您極有可能無痛回憶。</li>
                <li><strong className="text-[var(--primary)]">穩定度 (S)</strong>: 代表您的記憶能撐多久。14.5 天代表提取率降到 90% 需要花費的時間。當您在 AI 對話中成功使用單字，S 值就會自動延長！</li>
              </ul>
            </div>
          )}
          
          <MemoryAnalyticsChart vocabList={vocabList} grammarList={grammarList} dueCount={dueCount} />
        </div>
      </div>

      {/* Learner Model: Weakness Analysis v1 (Prescriptions) */}
      <div className="p-6 rounded-3xl theme-surface border border-[var(--border)] shadow-2xl flex flex-col gap-4">
        <button
          onClick={() => setIsWeaknessOpen(!isWeaknessOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="type-14 font-extrabold flex items-center gap-2">
            <Microscope className="w-5 h-5 text-amber-500" />
            <span className="text-[var(--ink)]">個人化弱點處方</span>
          </h3>
          <ChevronDown className={`w-4 h-4 text-[var(--ink-3)] transition-transform ${isWeaknessOpen ? 'rotate-180' : ''}`} />
        </button>

        <div className={`overflow-hidden transition-all duration-300 flex flex-col gap-4 ${isWeaknessOpen ? 'max-h-[2000px]' : 'max-h-0'}`}>
          
          <div className="flex flex-col gap-4">
            {prescriptions.length === 0 ? (
              <div className="text-center p-5 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] flex flex-col gap-2">
                <Sparkles className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-sm font-bold text-[var(--ink)]">目前沒有需要優先修補的模式！</p>
                <p className="text-xs text-[var(--ink-3)]">繼續完成今天的複習與情境任務，系統會持續幫你找出最值得投入的下一步。</p>
              </div>
            ) : (
              prescriptions.map((w, idx) => (
                <div key={idx} className="flex flex-col gap-3 p-5 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-[10px] font-black tracking-widest border border-amber-200">ACTIONABLE</span>
                    <span className="font-black text-sm text-[var(--ink)]">{w.title}</span>
                  </div>
                  
                  <p className="text-xs font-semibold text-[var(--ink-2)] leading-relaxed">
                    {w.supporting_message}
                  </p>
                  
                  <div className="bg-[var(--surface)] p-3 rounded-xl border border-[var(--input-border)]">
                    <div className="flex gap-2 items-start">
                      <Info className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                      <p className="text-[11px] text-[var(--ink-3)] font-medium leading-relaxed">{w.why_it_matters}</p>
                    </div>
                  </div>

                  <button className="w-full mt-1 h-10 bg-amber-500 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-amber-600 transition shadow-sm">
                    <Mic className="w-4 h-4" />
                    {w.recommended_activity.duration_minutes} 分鐘 • {w.recommended_activity.title}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SLA Core Fluency Dashboard */}
      <div className="p-6 rounded-3xl theme-surface border border-[var(--border)] shadow-2xl flex flex-col gap-4">
        <button
          onClick={() => setIsSlaOpen(!isSlaOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-xl font-black text-[var(--ink)] flex items-center gap-2">
            <Microscope className="w-6 h-6 text-[var(--primary)]" />
            <span>核心流暢度指標</span>
          </h3>
          <ChevronDown className={`w-5 h-5 text-[var(--ink-3)] transition-transform ${isSlaOpen ? 'rotate-180' : ''}`} />
        </button>
        
        <div className={`flex flex-col gap-3 overflow-hidden transition-all duration-300 ${isSlaOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
          <div className="p-4 rounded-2xl bg-[var(--input-bg)] border border-[var(--border)] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-dim)]">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[var(--ink)]">自動化提取率 (Automated Extraction)</span>
                  <span className="text-[11px] text-[var(--ink-3)]">語句生成的直覺與流暢程度</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xl font-black text-[var(--primary)]">87%</span>
                <span className="text-[10px] px-2.5 py-0.5 mt-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)] font-extrabold border border-[var(--primary-dim)]">自然直覺 🚀</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-[var(--input-border)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: '87%' }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--input-bg)] border border-[var(--border)] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-dim)]">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[var(--ink)]">語用適切性 (Pragmatic Appropriateness)</span>
                  <span className="text-[11px] text-[var(--ink-3)]">情境對話中的社會語用自然度</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xl font-black text-[var(--primary)]">92/100</span>
                <span className="text-[10px] px-2.5 py-0.5 mt-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)] font-extrabold border border-[var(--primary-dim)]">Native-Level Fluency 🔥</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-[var(--input-border)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: '92%' }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--input-bg)] border border-[var(--border)] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-dim)]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[var(--ink)]">FSRS 檢索詞彙量</span>
                  <span className="text-[11px] text-[var(--ink-3)]">穩定記憶中的主動使用詞彙數量</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xl font-black text-[var(--primary)]">1,240</span>
                <span className="text-[10px] px-2.5 py-0.5 mt-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)] font-extrabold border border-[var(--primary-dim)]">語彙達人 🌟</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-[var(--input-border)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: '75%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Badges Wall */}
      <div className="p-6 rounded-3xl theme-surface border border-[var(--border)] shadow-2xl flex flex-col gap-4">
        <button
          onClick={() => setIsBadgesOpen(!isBadgesOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center justify-between flex-1 pr-4">
            <h3 className="text-xl font-black text-[var(--ink)] flex items-center gap-2">
              <Award className="w-6 h-6 text-[var(--progress-text)]" />
              <span>成就徽章</span>
            </h3>
            <span className="text-xs font-bold text-[var(--ink-3)]">3/4 已解鎖</span>
          </div>
          <ChevronDown className={`w-5 h-5 text-[var(--ink-3)] transition-transform ${isBadgesOpen ? 'rotate-180' : ''}`} />
        </button>

        <div className={`grid grid-cols-2 gap-3 overflow-hidden transition-all duration-300 ${isBadgesOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition flex flex-col gap-1 ${
                b.unlocked
                  ? 'bg-[var(--input-bg)] border-[var(--border)] text-[var(--ink)]'
                  : 'bg-[var(--surface)] border-dashed border-[var(--border)] opacity-40 text-[var(--ink-3)]'
              }`}
            >
              <div className="text-xl">{b.icon}</div>
              <div className="text-sm font-bold">{b.name}</div>
              <div className="text-xs text-[var(--ink-3)]">{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

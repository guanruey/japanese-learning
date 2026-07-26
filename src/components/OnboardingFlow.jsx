import { useState, useEffect } from 'react'
import { ChevronRight, X, CheckCircle2, Flame, BrainCircuit } from 'lucide-react'
import { useAppShellStore } from '../stores/appShellStore'
import { trackLearningEvent } from '../services/eventTracker'

const GOALS = [
  { id: 'travel',    emoji: '✈️', label: '旅遊自助', sub: '去日本能獨立溝通' },
  { id: 'anime',     emoji: '🎌', label: '動漫聽懂', sub: '不靠字幕看懂原版' },
  { id: 'work',      emoji: '💼', label: '職場商務', sub: '工作或留學需要' },
  { id: 'exam',      emoji: '📋', label: '考 JLPT', sub: '準備 N5 ～ N1 考試' },
]

const DAILY_GOALS = [
  { id: 5,  label: '輕鬆學習', sub: '每天 5 分鐘', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 10, label: '穩定進步', sub: '每天 10 分鐘', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 15, label: '認真衝刺', sub: '每天 15 分鐘', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 20, label: '狂熱菁英', sub: '每天 20 分鐘', color: 'bg-rose-100 text-rose-700 border-rose-200' },
]

const PLACEMENT_QUESTIONS = [
  {
    id: 'q1',
    question: '請問「あ」的發音是？',
    options: ['A', 'I', 'U', 'E'],
    correct: 0
  },
  {
    id: 'q2',
    question: '請問「水」的意思是？',
    options: ['火 (Fire)', '水 (Water)', '風 (Wind)', '土 (Earth)'],
    correct: 1
  },
  {
    id: 'q3',
    question: '請問哪一句是正確的「請給我咖啡」？',
    options: [
      'コーヒーを ひとつ します。',
      'コーヒーを ひとつ あります。',
      'コーヒーを ひとつ ください。',
      'コーヒーを ひとつ です。'
    ],
    correct: 2
  }
]

export default function OnboardingFlow({ onComplete }) {
  const { setDailyGoal } = useAppShellStore()
  
  const [step, setStep] = useState(0) // 0: Goal, 1: Time, 2-4: Test, 5: Result
  const [goal, setGoal] = useState(null)
  const [dailyMinutes, setDailyMinutes] = useState(null)
  const [answers, setAnswers] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)

  const handleNextStep = () => {
    if (step === 0 && !goal) return
    if (step === 1 && !dailyMinutes) return
    
    // For test questions
    if (step >= 2 && step <= 4) {
      if (selectedOption === null) return
      setAnswers([...answers, selectedOption])
      setSelectedOption(null)
    }

    setStep(prev => prev + 1)
  }

  const finish = () => {
    const score = answers.reduce((acc, ans, idx) => acc + (ans === PLACEMENT_QUESTIONS[idx].correct ? 1 : 0), 0)
    let assignedLevel = 'zero'
    if (score === 3) assignedLevel = 'n5' // If they get all 3 right, bump them to N5
    
    localStorage.setItem('app_onboarding_done', 'true')
    localStorage.setItem('app_user_level', assignedLevel)
    localStorage.setItem('app_user_goal', goal || 'travel')
    if (dailyMinutes) {
      setDailyGoal(dailyMinutes * 20) // Roughly 20 XP per minute
    }

    // MVP Event Tracking
    trackLearningEvent({
      eventType: 'track.created',
      sourceSurface: 'OnboardingFlow',
      payload: {
        goal_type: goal || 'travel',
        daily_minutes: dailyMinutes
      }
    });

    trackLearningEvent({
      eventType: 'placement.completed',
      sourceSurface: 'OnboardingFlow',
      evidenceStrength: 'observational',
      payload: {
        raw_score: score,
        calibrated_level: assignedLevel
      }
    });

    onComplete?.()
  }

  // --- Render Steps ---

  const renderStep0 = () => (
    <div className="w-full max-w-sm flex flex-col gap-6 my-auto">
      <div className="text-center">
        <h2 className="text-2xl font-black text-[var(--ink)] leading-tight">
          你學日文<br/>是為了什麼？
        </h2>
        <p className="text-sm text-[var(--ink-3)] mt-2">我們會幫你排最適合的課程</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {GOALS.map(g => (
          <button
            key={g.id}
            onClick={() => setGoal(g.id)}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 text-center transition-all active:scale-[0.97] ${
              goal === g.id
                ? 'border-[var(--primary)] bg-[var(--primary-light)] scale-[1.02]'
                : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary-dim)]'
            }`}
          >
            <span className="text-3xl">{g.emoji}</span>
            <div className="font-extrabold text-[var(--ink)] text-sm">{g.label}</div>
            <div className="text-[10px] text-[var(--ink-3)] leading-tight">{g.sub}</div>
          </button>
        ))}
      </div>
    </div>
  )

  const renderStep1 = () => (
    <div className="w-full max-w-sm flex flex-col gap-6 my-auto">
      <div className="text-center">
        <h2 className="text-2xl font-black text-[var(--ink)] leading-tight">
          你每天想花<br/>多少時間學習？
        </h2>
        <p className="text-sm text-[var(--ink-3)] mt-2">穩定的習慣是成功的關鍵</p>
      </div>
      <div className="flex flex-col gap-3">
        {DAILY_GOALS.map(dg => (
          <button
            key={dg.id}
            onClick={() => setDailyMinutes(dg.id)}
            className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all active:scale-[0.98] ${
              dailyMinutes === dg.id
                ? `${dg.color} border-2 scale-[1.01]`
                : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary-dim)] text-[var(--ink)]'
            }`}
          >
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-sm">{dg.label}</span>
              <span className="text-xs opacity-70">{dg.sub}</span>
            </div>
            {dailyMinutes === dg.id && <CheckCircle2 className="w-5 h-5" />}
          </button>
        ))}
      </div>
    </div>
  )

  const renderTestStep = (qIndex) => {
    const question = PLACEMENT_QUESTIONS[qIndex]
    return (
      <div className="w-full max-w-sm flex flex-col gap-6 my-auto">
        <div className="text-center">
          <p className="text-xs font-extrabold text-[var(--primary)] tracking-widest uppercase mb-2">快速分級測驗 {qIndex + 1}/3</p>
          <h2 className="text-xl font-bold text-[var(--ink)] leading-tight bg-[var(--input-bg)] p-6 rounded-3xl">
            {question.question}
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedOption(idx)}
              className={`p-4 rounded-2xl border-2 text-left font-bold transition-all active:scale-[0.98] ${
                selectedOption === idx
                  ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--primary-dim)]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderResult = () => {
    const score = answers.reduce((acc, ans, idx) => acc + (ans === PLACEMENT_QUESTIONS[idx].correct ? 1 : 0), 0)
    const levelText = score === 3 ? 'N5 入門' : '零基礎'
    
    return (
      <div className="w-full max-w-sm flex flex-col items-center gap-6 my-auto text-center">
        <div className="w-24 h-24 bg-[var(--primary-light)] text-[var(--primary)] rounded-full flex items-center justify-center animate-bounce-soft">
          <BrainCircuit className="w-12 h-12" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[var(--ink)] mb-2">測驗完成！</h2>
          <p className="text-[var(--ink-2)]">根據你的作答，我們建議你從</p>
          <div className="inline-block mt-3 px-6 py-2 bg-[var(--input-bg)] text-[var(--ink)] font-black text-xl rounded-full border-2 border-[var(--border)]">
            {levelText}
          </div>
          <p className="text-[var(--ink-2)] mt-3">開始你的日語旅程。</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[200] bg-[var(--canvas)] flex flex-col items-center justify-between p-6 animate-fadeIn">
      
      {/* Header */}
      <div className="w-full max-w-sm flex items-center justify-between pt-4">
        <div className="flex gap-1 flex-1">
          {[0,1,2,3,4].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${
              i < step ? 'bg-[var(--primary)] flex-1' : i === step ? 'bg-[var(--primary)] w-8' : 'bg-[var(--border)] flex-1'
            }`} />
          ))}
        </div>
        <button onClick={finish} className="ml-4 text-xs font-bold text-[var(--ink-3)]">跳過</button>
      </div>

      {/* Content */}
      {step === 0 && renderStep0()}
      {step === 1 && renderStep1()}
      {step >= 2 && step <= 4 && renderTestStep(step - 2)}
      {step === 5 && renderResult()}

      {/* Footer */}
      <div className="w-full max-w-sm pb-8 pt-4">
        {step < 5 ? (
          <button
            onClick={handleNextStep}
            disabled={(step === 0 && !goal) || (step === 1 && !dailyMinutes) || (step >= 2 && selectedOption === null)}
            className="w-full py-4 bg-[var(--ink)] text-[var(--surface)] font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[var(--ink-2)] transition active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            繼續 <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={finish}
            className="w-full py-4 bg-[var(--primary)] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition active:scale-[0.98]"
          >
            開始學習 <Flame className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}

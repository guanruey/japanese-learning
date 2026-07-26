import React from 'react'
import { usePersona, PERSONAS } from '../context/PersonaContext'
import { useSubscription } from '../context/SubscriptionContext'
import { Sparkles, CheckCircle2, Lock, UserCheck } from 'lucide-react'

export default function PersonaStore({ onClose }) {
  const { currentPersona, setPersona, unlockedPersonas, unlockPersona } = usePersona()
  const { sakuraBalance, consumeGems, openPaywall } = useSubscription()

  const handleSelect = (id) => {
    const persona = PERSONAS[id]
    if (unlockedPersonas.includes(id)) {
      setPersona(id)
    } else {
      // Need to unlock
      if (sakuraBalance >= persona.price) {
        consumeGems(persona.price)
        unlockPersona(id)
        setPersona(id)
      } else {
        openPaywall() // Not enough gems
      }
    }
  }

  return (
    <div className="flex flex-col h-full bg-[var(--page-bg)] absolute inset-0 z-50 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-[var(--border)] shrink-0 flex justify-between items-center bg-white sticky top-0 z-10 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[var(--ink-1)]">教練休息室 (Tutor Lounge)</h2>
          <p className="text-sm text-[var(--ink-2)] mt-1">選擇你要指派上陣的專屬 AI 教練</p>
        </div>
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
        >
          返回任務
        </button>
      </div>

      <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(PERSONAS).map(p => {
            const isUnlocked = unlockedPersonas.includes(p.id)
            const isCurrent = currentPersona === p.id

            return (
              <div 
                key={p.id} 
                onClick={() => handleSelect(p.id)}
                className={`p-5 rounded-2xl border-2 transition cursor-pointer relative overflow-hidden flex flex-col
                  ${isCurrent ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-slate-200 bg-white hover:border-slate-300'}
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                      {p.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{p.name}</h3>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                        <Sparkles size={10} className={p.voice === 'nova' || p.voice === 'shimmer' || p.voice === 'alloy' ? 'text-pink-500' : 'text-blue-500'} />
                        Voice: {p.voice || 'nova'}
                      </div>
                    </div>
                  </div>
                  {isCurrent && (
                    <div className="bg-[var(--primary)] text-white p-1 rounded-full shadow-sm">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-slate-600 leading-relaxed flex-1 mt-2">
                  {p.description}
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  {isUnlocked ? (
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                      <UserCheck size={16} /> 已解鎖
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-slate-500 flex items-center gap-1">
                      <Lock size={16} /> 未解鎖
                    </span>
                  )}
                  
                  {!isUnlocked && (
                    <button className="px-4 py-2 bg-rose-50 text-rose-600 font-bold rounded-xl text-sm hover:bg-rose-100 transition flex items-center gap-1">
                      💎 {p.price} 解鎖
                    </button>
                  )}
                  {isUnlocked && !isCurrent && (
                    <button className="px-4 py-2 bg-indigo-50 text-[var(--primary)] font-bold rounded-xl text-sm hover:bg-indigo-100 transition">
                      指派上陣
                    </button>
                  )}
                  {isCurrent && (
                    <span className="px-4 py-2 text-[var(--primary)] font-bold rounded-xl text-sm opacity-80">
                      上陣中
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

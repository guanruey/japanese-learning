import React, { useState, useRef, useEffect } from 'react'
import { Bot, Mic, Send, CheckCircle2, Zap, Compass } from 'lucide-react'
import TBLTTaskFlow from './TBLTTaskFlow'
import VoicePipelineConsole from './VoicePipelineConsole'
import SlaBadge from './SlaBadge'
import PersonaStore from './PersonaStore'
import { tbltScenarios } from '../data/tblt_scenarios'
import { useLocale } from '../context/LocaleContext'
import { SkeletonBubble } from './SkeletonLoader'

export default function AiTutorHub({ readingMode = 'furigana', onNavigate = () => {} }) {
  const { targetLang } = useLocale()
  const isJapanese = targetLang === 'ja'
  const [subView, setSubView] = useState('tblt') // 'tblt' | 'console' | 'free'
  const [selectedScenario, setSelectedScenario] = useState('cafe')
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: isJapanese ? 'いらっしゃいませ！ご注文は決まりましたか？' : 'Welcome! Are you ready to order?',
      translation: isJapanese ? '歡迎光臨！請問您決定好點什麼了嗎？' : '歡迎光臨！準備好點餐了嗎？',
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  
  const wsRef = useRef(null)

  useEffect(() => {
    if (isRecording) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/ws/audio`;
      try {
        wsRef.current = new WebSocket(wsUrl);
        wsRef.current.onopen = () => console.log('WebSocket Audio connected');
        wsRef.current.onmessage = (event) => console.log('Received audio frame:', event.data);
        wsRef.current.onerror = (error) => console.error('WebSocket error:', error);
        wsRef.current.onclose = () => console.log('WebSocket disconnected');
      } catch (err) {
        console.error('Failed to connect to WebSocket', err);
      }
    } else {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    }
  }, [isRecording])

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  }

  const scenarios = tbltScenarios.map(sc => ({
    id: sc.id,
    title: isJapanese ? sc.title.ja : sc.title.en,
    level: sc.level
  }))

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const newMsg = { id: Date.now(), sender: 'user', text: inputText }
    setMessages((prev) => [...prev, newMsg])
    setInputText('')
    setIsThinking(true)

    setTimeout(() => {
      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: isJapanese ? '[Level Up 🚀] [🛡️ AI Assist Mode Activated] かしこまりました。少々お待ちくださいね！' : '[Level Up 🚀] [🛡️ AI Assist Mode Activated] Understood. Please give us a moment!',
        translation: isJapanese ? '好的，知道了。請稍等一下喔！' : '好的，請稍微稍等一下！',
        feedback: isJapanese ? '發音極佳！文法使用自然 (自然度 98%)' : 'Great grammar! Clear pronunciation.',
        slaBadge: {
          type: 'Sociopragmatics',
          explanation: isJapanese ? '分析顯示您的回答在社會語用層面上非常自然，適合咖啡廳情境。' : 'Your response shows excellent sociopragmatic appropriateness for a cafe scenario.'
        }
      }
      setMessages((prev) => [...prev, aiReply])
      setIsThinking(false)
    }, 1500)
  }

  return (
    <div className="min-h-full flex flex-col w-full max-w-md mx-auto animate-fadeIn">
      {/* Coming Soon Notice Banner */}
      <div className="mx-4 mt-2 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-start gap-3 shadow-xs">
        <Sparkles className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
        <div className="text-xs space-y-1">
          <p className="font-extrabold text-sm">✨ AI 對話與語音教練・升級維護中 (敬請期待)</p>
          <p className="opacity-90 leading-relaxed font-medium">
            AI 導師雲端服務正在進行系統優化，實時語音與情境對話功能將於近期全新上線！單字庫、文法測驗與 FSRS 記憶卡片等功能均正常運作，歡迎繼續學習。
          </p>
        </div>
      </div>

      {/* Sub-View Pill Selector */}
      <div className="flex items-center p-1 bg-[var(--surface)] border border-[var(--border)] rounded-full h-[48px] shrink-0 mx-4 mt-2 mb-4">
        <button
          onClick={() => setSubView('tblt')}
          className={`flex-1 h-full rounded-full text-xs font-extrabold transition flex items-center justify-center ${
            subView === 'tblt' ? 'theme-btn-primary' : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
          }`}
        >
          TBLT 任務
        </button>
        <button
          onClick={() => setSubView('console')}
          className={`flex-1 h-full rounded-full text-xs font-extrabold transition flex items-center justify-center ${
            subView === 'console' ? 'theme-btn-primary' : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
          }`}
        >
          &lt;300ms
        </button>
        <button
          onClick={() => setSubView('free')}
          className={`flex-1 h-full rounded-full text-xs font-extrabold transition flex items-center justify-center ${
            subView === 'free' ? 'theme-btn-primary' : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
          }`}
        >
          自由情境
        </button>
        <button
          onClick={() => setSubView('store')}
          className={`flex-1 h-full rounded-full text-xs font-extrabold transition flex items-center justify-center ${
            subView === 'store' ? 'bg-pink-500 text-white' : 'text-pink-400 hover:text-pink-600'
          }`}
        >
          換教練
        </button>
      </div>

      <div className="flex-1 flex flex-col relative">
        {subView === 'store' && <PersonaStore onClose={() => setSubView('tblt')} />}
        {subView === 'tblt' && <TBLTTaskFlow readingMode={readingMode} onNavigate={onNavigate} />}
        {subView === 'console' && <VoicePipelineConsole onStartTBLT={() => setSubView('tblt')} />}
        {subView === 'free' && (
          <div className="flex-1 flex flex-col">
            <div className="px-4 flex flex-col gap-4 flex-1 overflow-y-auto">
              {/* Scenarios Switcher Tile */}
              <div className="qp-card p-5 sm:p-6 flex flex-col gap-3 shrink-0">
                <label className="type-13 text-[#78716C] block font-semibold">選擇練習情境</label>
                <div className="grid grid-cols-3 gap-2">
                  {scenarios.map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => setSelectedScenario(sc.id)}
                      className={`p-3 rounded-2xl text-left transition ${
                        selectedScenario === sc.id
                          ? 'bg-[var(--primary)] text-white shadow-sm'
                          : 'bg-[var(--input-bg)] text-[var(--ink-2)]'
                      }`}
                    >
                      <div className="type-13 font-semibold">{sc.title}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">{sc.level}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages Feed */}
              <div className="flex flex-col gap-4 pb-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-5 rounded-[20px] flex flex-col gap-2 ${
                        msg.sender === 'user'
                          ? 'bg-[var(--primary)] text-white rounded-br-none'
                          : 'theme-card text-[var(--ink)] rounded-bl-none'
                      }`}
                    >
                      {(() => {
                        let cleanText = msg.text;
                        const hasLevelUp = cleanText.includes('[Level Up 🚀]');
                        const hasAssist = cleanText.includes('[🛡️ AI Assist Mode Activated]');

                        if (hasLevelUp) cleanText = cleanText.replace('[Level Up 🚀]', '');
                        if (hasAssist) cleanText = cleanText.replace('[🛡️ AI Assist Mode Activated]', '');

                        return (
                          <div className="flex flex-col gap-2">
                            {cleanText.trim() && <p className="type-16 leading-relaxed font-jp font-semibold">{cleanText.trim()}</p>}
                            {(hasLevelUp || hasAssist) && (
                              <div className="flex flex-wrap gap-2 mt-1">
                                {hasLevelUp && (
                                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#D97706]/10 text-[#D97706] text-xs font-bold shadow-sm animate-pulse">
                                    🚀 Level Up
                                  </div>
                                )}
                                {hasAssist && (
                                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--primary)] text-white text-xs font-bold shadow-sm">
                                    🛡️ AI Assist Mode Activated
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                      {msg.translation && (
                        <p className="type-13 text-[var(--ink-3)] border-t border-[var(--border)] pt-1.5 mt-0.5">
                          {msg.translation}
                        </p>
                      )}
                      {msg.feedback && (
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#10B981] pt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{msg.feedback}</span>
                        </div>
                      )}
                      {msg.slaBadge && (
                        <SlaBadge type={msg.slaBadge.type} explanation={msg.slaBadge.explanation} />
                      )}
                    </div>
                  </div>
                ))}
                {isThinking && (
                  <div className="flex flex-col items-start mt-2">
                    <SkeletonBubble isUser={false} />
                  </div>
                )}
              </div>
            </div>

            {/* Visualizer & Input Dock */}
            <div className="mt-auto shrink-0 bg-[var(--surface)] border-t border-[var(--border)]">
              {isRecording && (
                <div className="h-16 flex items-center justify-center gap-1 px-4 pt-2">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-[#6C5CE7] rounded-full animate-waveform"
                      style={{
                        height: `${Math.max(10, Math.random() * 40)}px`,
                        animationDelay: `${i * 0.05}s`
                      }}
                    />
                  ))}
                </div>
              )}
              <div className="p-4 flex items-center gap-2">
                <button
                  onClick={toggleRecording}
                  className={`w-[48px] h-[48px] rounded-2xl flex items-center justify-center shrink-0 transition shadow-sm ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-[var(--primary-light)] text-[var(--primary)]'
                  }`}
                  title="語音口說錄音"
                >
                  <Mic className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isRecording ? '聆聽語音中...' : '輸入對話...'}
                  className="flex-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl px-4 h-[48px] type-16 text-[var(--ink)] focus:outline-none"
                  disabled={isRecording}
                />

                <button
                  onClick={handleSendMessage}
                  disabled={isRecording || !inputText.trim()}
                  className={`w-[48px] h-[48px] rounded-2xl flex items-center justify-center shrink-0 transition ${
                    isRecording || !inputText.trim()
                      ? 'bg-[var(--badge-bg)] text-[var(--ink-3)]'
                      : 'theme-btn-primary'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

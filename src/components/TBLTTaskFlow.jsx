import React, { useState } from 'react'
import { Compass, Bot, CheckCircle2, Mic, Send, Volume2, Sparkles, AlertCircle, ArrowRight, RefreshCw, BarChart2, Home } from 'lucide-react'
import { speak } from '../utils/speech'
import { tbltScenarios } from '../data/tblt_scenarios'
import { generateTutorResponse, generateCustomScenario } from '../services/llmService'
import { useSubscription } from '../context/SubscriptionContext'
import { useLocale } from '../context/LocaleContext'
import { usePersona } from '../context/PersonaContext'
import { insertVocabulary } from '../supabase'
import { useLearnerModelStore } from '../stores/learnerModelStore'
import { getContrastiveRules } from '../data/contrastiveErrorPatterns'
import { useAuth } from '../context/AuthContext'
import { trackLearningEvent } from '../services/eventTracker'
import { SkeletonBubble } from './SkeletonLoader'

export default function TBLTTaskFlow({
  onFinishTask,
  activeTrack = 'japanese',
  readingMode = 'furigana',
  onNavigate = () => {},
}) {
  const isJapanese = activeTrack === 'japanese'
  const { isPro, hasByokLicense, sakuraBalance, consumeGems, openPaywall } = useSubscription()
  const { targetLang } = useLocale()
  const { personaData } = usePersona()
  const { weaknessScores } = useLearnerModelStore()
  const { user } = useAuth()
  const [stage, setStage] = useState('pretask') // 'pretask' | 'taskcycle' | 'posttask'

  const [customScenarios, setCustomScenarios] = useState(() => {
    try {
      const stored = localStorage.getItem('custom_scenarios')
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      return []
    }
  })
  
  const allScenarios = [...customScenarios, ...tbltScenarios]

  const [scenarioId, setScenarioId] = useState(allScenarios[0].id)
  const currentScenario = allScenarios.find(s => s.id === scenarioId) || allScenarios[0]

  const [isGeneratingTask, setIsGeneratingTask] = useState(false)

  const langCode = targetLang === 'ja' ? 'ja-JP' : targetLang === 'en' ? 'en-US' : targetLang === 'fr' ? 'fr-FR' : targetLang === 'ko' ? 'ko-KR' : 'en-US'

  // Pre-Task Scaffolding Data (i+1 Comprehensible Input)
  const taskScaffold = {
    title: isJapanese ? currentScenario.title.ja : currentScenario.title.en,
    scenario: isJapanese ? currentScenario.mission.ja : currentScenario.mission.en,
    scaffoldVocab: currentScenario.vocabulary.map(v => ({
      japanese: v.word,
      reading: v.reading,
      meaning: v.translation,
      fsrs_stability: 2.0,
      fsrs_difficulty: 5.0
    })),
  }

  // Dialogue State Machine (Multi-turn Progression)
  const [turn, setTurn] = useState(0)
  const [isSending, setIsSending] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: isJapanese ? 'こんにちは！どのようなご用件でしょうか？' : 'Hello! How can I help you today?',
      translation: isJapanese ? '你好！請問有什麼我可以幫忙的嗎？' : '你好！需要什麼協助嗎？',
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [hydratedWords, setHydratedWords] = useState([])
  const [extractedVocab, setExtractedVocab] = useState([]) // New Vocab from AI
  const messagesEndRef = React.useRef(null)

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleAiAutoSuggest = () => {
    if (isSending) return

    const phraseObj = currentScenario.phrases[turn] || currentScenario.phrases[currentScenario.phrases.length - 1]
    const suggestion = phraseObj ? phraseObj.phrase : ''
    if (suggestion) {
      setInputText(suggestion)
      speak(suggestion, langCode, () => {}, personaData.voice)
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending || turn >= 3) return

    // Energy Check
    if (!consumeGems(1)) {
      openPaywall()
      return
    }

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputText.trim(),
      translation: null,
    }

    const matchedVocab = taskScaffold.scaffoldVocab.filter(v => 
      inputText.includes(v.japanese) || inputText.includes(v.reading)
    )
    if (matchedVocab.length > 0) {
      // Simulate auto hydration
      const hydrated = matchedVocab.map(v => v.japanese)
      setHydratedWords((prev) => [...new Set([...prev, ...hydrated])])
    }

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages)
    setInputText('')
    setIsSending(true)

    const nextTurn = turn + 1

    try {
      const history = updatedMessages.map(m => ({
        role: m.sender === 'ai' ? 'assistant' : 'user',
        content: m.text
      }));

      // Generate Contrastive Rules based on user's learner model
      const nativeLang = 'zh-Hant'; // Hardcoded for this PRD phase
      const contrastiveRules = getContrastiveRules(nativeLang, targetLang, weaknessScores);
      const contrastiveSection = contrastiveRules.length > 0 
        ? `\nCRITICAL CONTRASTIVE ERROR CORRECTION RULES (Apply these specifically for this user because they struggle with these areas):\n${contrastiveRules.map(r => '- ' + r).join('\n')}` 
        : '';

      const systemPrompt = `You are a helpful language tutor roleplaying in a specific scenario.
Scenario: ${taskScaffold.scenario}
Target language: ${targetLang}
Student level: Beginner/Intermediate

Your Persona/Character: ${personaData.prompt}

PEDAGOGICAL METHODOLOGY (STRICTLY ENFORCE):
You are built upon Evidence-Based Second Language Acquisition (SLA) principles. You must:
1. Provide Comprehensible Input (i+1): Keep your vocabulary slightly above the user's level, but always understandable through context.
2. Provide Implicit Feedback: If the user makes a grammatical error, do not break character to say "You made an error". Instead, naturally recast their sentence correctly in your response (e.g., User: "I goed there", You: "Oh, you went there? That's great!").
3. Follow Task-Based Language Teaching (TBLT): Focus on whether the user achieved the communicative goal of the scenario rather than absolute grammatical perfection.
4. Scaffold the interaction: Ask guiding questions to keep the conversation flowing.

Rules:
1. Reply naturally in the target language (${targetLang}). Keep it to 1-2 short sentences.
2. Embody your Persona strictly. 
3. If this is turn ${nextTurn} and >= 3, please politely wrap up and conclude the scenario in character.
4. Output ONLY the response text in the target language. No translations or english preambles.${contrastiveSection}`;

      const aiResult = await generateTutorResponse(history, systemPrompt);

      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResult.reply || "...", 
        translation: '', 
      }

      if (aiResult.new_vocab && aiResult.new_vocab.length > 0) {
        setExtractedVocab(prev => [...prev, ...aiResult.new_vocab]);
        
        // MVP Event Tracking
        trackLearningEvent({
          eventType: 'ai.evidence_extracted',
          sourceSurface: 'TBLTTaskFlow',
          evidenceStrength: 'strong',
          confidence: 0.85,
          payload: {
            extracted_count: aiResult.new_vocab.length,
            vocab_samples: aiResult.new_vocab.map(v => v.japanese)
          }
        });
      }

      // If contrastive rules were applied and triggered feedback
      if (contrastiveRules.length > 0 && aiResult.reply?.includes('但是') || aiResult.reply?.includes('不過')) {
        trackLearningEvent({
          eventType: 'error.classified',
          sourceSurface: 'TBLTTaskFlow',
          evidenceStrength: 'medium',
          outcome: 'failure',
          payload: {
            rules_applied: contrastiveRules.length,
            was_repaired: false,
            explanation_shown: true
          }
        });
      }

      setMessages((prev) => [...prev, aiReply])
      setTurn(nextTurn)
      speak(aiReply.text, langCode, () => {}, personaData.voice)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSending(false)
    }
  }

  const finishTaskCycle = async () => {
    setStage('posttask');
    
    // MVP Event Tracking
    trackLearningEvent({
      eventType: 'tblt.task_completed',
      sourceSurface: 'TBLTTaskFlow',
      evidenceStrength: 'strong',
      outcome: 'success',
      payload: {
        scenario_id: taskScaffold.id,
        turns: turn,
        communicative_success: true
      }
    });

    if (extractedVocab.length > 0) {
      try {
        // Insert vocab to DB and initialize FSRS progress for this user
        await insertVocabulary(extractedVocab, user?.id);
      } catch (e) {
        console.error("Failed to auto-insert AI vocab to FSRS", e);
      }
    }
  }

  const handleGenerateCustomTask = async () => {
    if (isGeneratingTask) return;
    if (!consumeGems(5)) {
      openPaywall();
      return;
    }
    
    setIsGeneratingTask(true);
    try {
      const newScen = await generateCustomScenario(targetLang);
      if (newScen && newScen.id) {
        // Fallback ID if LLM didn't generate one well
        newScen.id = newScen.id.startsWith('gen_') ? newScen.id : `gen_scenario_${Date.now()}`;
        
        const updatedCustom = [newScen, ...customScenarios];
        setCustomScenarios(updatedCustom);
        localStorage.setItem('custom_scenarios', JSON.stringify(updatedCustom));
        
        setScenarioId(newScen.id);
        setTurn(0);
        setMessages([{
          id: Date.now(),
          sender: 'ai',
          text: isJapanese ? 'こんにちは！新しいミッションを始めましょう！' : 'Hello! Let us start the new mission!',
          translation: '你好！讓我們開始新的任務吧！',
        }]);
        setHydratedWords([]);
      } else {
        alert("任務生成失敗，請稍後再試。");
      }
    } catch (e) {
      console.error(e);
      alert("任務生成失敗，請稍後再試。");
    } finally {
      setIsGeneratingTask(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col w-full px-4 pb-4 animate-fadeIn gap-3">
      {/* Universal Quick-Return Breadcrumb Bar */}
      <div className="flex items-center justify-between text-xs px-3 py-2 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="text-[var(--primary)] font-extrabold flex items-center gap-1 transition active:scale-95 hover:opacity-70"
            title="回到今日學習首頁"
          >
            <Home className="w-3.5 h-3.5" />
            <span>今日首頁</span>
          </button>

          <span className="text-[var(--ink-3)] font-extrabold">/</span>

          <button
            onClick={() => onNavigate && onNavigate('path')}
            className="text-[var(--primary)] font-extrabold flex items-center gap-1 transition active:scale-95 hover:opacity-70"
            title="回到解鎖章節地圖"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>章節地圖</span>
          </button>
        </div>

        <span className="text-[11px] font-bold text-[var(--ink-3)] truncate max-w-[130px]">
          {isJapanese ? currentScenario.title.ja : currentScenario.title.en}
        </span>
      </div>

      {/* Compact Stage Step Line */}
      <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-[var(--ink-3)] shrink-0">
        <span className={stage === 'pretask' ? 'text-[var(--primary)] font-bold underline' : ''}>1. 前任務</span>
        <span className="opacity-30">/</span>
        <span className={stage === 'taskcycle' ? 'text-[var(--primary)] font-bold underline' : ''}>2. 任務環節</span>
        <span className="opacity-30">/</span>
        <span className={stage === 'posttask' ? 'text-emerald-600 font-bold underline' : ''}>3. 後任務</span>
      </div>

      {/* STAGE 1: PRE-TASK */}
      {stage === 'pretask' && (
        <div className="flex-1 flex flex-col p-6 rounded-[28px] bg-[var(--surface)] border border-[var(--border)] shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-extrabold text-[var(--primary)] uppercase tracking-wider">
                TBLT 第一階段 · 預備詞彙
              </span>
              <h2 className="text-xl font-black text-[var(--ink)] leading-snug tracking-tight">
                {taskScaffold.title}
              </h2>
              <p className="text-xs text-[var(--ink-2)] leading-relaxed font-medium">
                {taskScaffold.scenario}
              </p>
            </div>
            
            {/* Scenario Selector */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs font-extrabold text-[var(--ink)]">切換情境任務</label>
              <div className="flex gap-2">
                <select 
                  value={scenarioId}
                  onChange={(e) => {
                    setScenarioId(e.target.value)
                    // Reset state when switching scenario
                    setTurn(0)
                    setMessages([{
                      id: Date.now(),
                      sender: 'ai',
                      text: isJapanese ? 'こんにちは！どのようなご用件でしょうか？' : 'Hello! How can I help you today?',
                      translation: isJapanese ? '你好！請問有什麼我可以幫忙的嗎？' : '你好！需要什麼協助嗎？',
                    }])
                    setHydratedWords([])
                  }}
                  className="flex-1 p-3 rounded-2xl bg-[var(--canvas)] border border-[var(--border)] text-[var(--ink)] font-semibold text-sm outline-none focus:border-[var(--primary)] transition"
                >
                  {customScenarios.length > 0 && (
                    <optgroup label="AI 自訂任務">
                      {customScenarios.map(sc => (
                        <option key={sc.id} value={sc.id}>✨ {isJapanese ? sc.title.ja : sc.title.en}</option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="官方任務池">
                    {tbltScenarios.map(sc => (
                      <option key={sc.id} value={sc.id}>{isJapanese ? sc.title.ja : sc.title.en}</option>
                    ))}
                  </optgroup>
                </select>
                <button
                  onClick={handleGenerateCustomTask}
                  disabled={isGeneratingTask}
                  className="px-4 bg-[var(--primary)] text-white rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 shrink-0 transition active:scale-95 disabled:opacity-50 shadow-sm"
                  title="消耗 5 櫻花石生成專屬情境"
                >
                  <Sparkles className={`w-4 h-4 ${isGeneratingTask ? 'animate-spin' : ''}`} />
                  {isGeneratingTask ? '生成中...' : 'AI 新任務 (5💎)'}
                </button>
              </div>
            </div>

            {/* i+1 Vocabulary Scaffold */}
            <div className="flex flex-col gap-3 mt-4">
              <h3 className="text-sm font-extrabold text-[var(--ink)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                <span>預備關鍵表達</span>
              </h3>

              <div className="flex flex-col gap-2.5">
                {taskScaffold.scaffoldVocab.map((v, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[var(--canvas)] border border-[var(--border)] flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-base font-extrabold text-[var(--ink)]">
                        {v.japanese} ({v.reading})
                      </span>
                      <span className="text-xs text-[var(--ink-3)] mt-0.5">{v.meaning}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setStage('taskcycle')}
            className="w-full h-[52px] rounded-2xl bg-[var(--primary)] text-white font-extrabold text-base shadow-sm active:scale-[0.98] transition flex items-center justify-center mt-auto"
          >
            開始任務
          </button>
        </div>
      )}

      {/* STAGE 2: TASK CYCLE */}
      {stage === 'taskcycle' && (
        <div className="flex-1 flex flex-col gap-3 justify-between">
          {/* Messages Feed */}
          <div className="flex flex-col gap-4 flex-1 overflow-y-auto px-1 py-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-4 sm:p-5 rounded-[24px] flex flex-col gap-1 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-base leading-relaxed font-bold flex-1">{msg.text}</p>
                    <button
                      onClick={() => speak(msg.text, langCode)}
                      className={`p-1.5 rounded-full transition active:scale-95 shrink-0 ${
                        msg.sender === 'user' ? 'hover:bg-white/20 text-white/80' : 'hover:bg-[var(--badge-bg)] text-[var(--ink-3)]'
                      }`}
                      title="發音示範"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  {msg.translation && (
                    <p className={`text-xs pt-1.5 mt-1 font-medium border-t ${
                      msg.sender === 'user' ? 'text-white/70 border-white/20' : 'text-[var(--ink-3)] border-[var(--border)]'
                    }`}>
                      {msg.translation}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex flex-col items-start mt-2">
                <SkeletonBubble isUser={false} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Dock */}
          <div className="flex flex-col gap-2 shrink-0 pt-2 relative">
            
            {/* Energy Badge for Free Users */}
            {!isPro && !hasByokLicense && (
              <div className="absolute -top-7 right-2 px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center gap-1 shadow-sm">
                <span className="text-[10px] font-extrabold text-pink-600">🌸 櫻花石餘額: {sakuraBalance} 顆</span>
              </div>
            )}

            <div className="flex items-center justify-between px-1">
              {turn >= 3 ? (
                <button
                  onClick={() => setStage('posttask')}
                  className="w-full py-2.5 rounded-full bg-[var(--primary)] text-white text-xs font-black flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
                >
                  <span>🎉 對話已完成！點擊繼續觀看診斷報告 ➔</span>
                </button>
              ) : (
                <button
                  onClick={handleAiAutoSuggest}
                  className="px-3 py-1 rounded-full bg-[var(--primary-light)] hover:bg-[var(--primary-dim)] border border-[var(--primary-dim)] text-[var(--primary)] text-xs font-extrabold flex items-center gap-1.5 transition active:scale-95"
                >
                  <span>💡 AI 代答與跟讀示範 (Shadowing)</span>
                </button>
              )}

              {turn < 3 && inputText.trim() && (
                <button
                  onClick={() => speak(inputText, langCode)}
                  className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1 ml-2 shrink-0"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>聽示範</span>
                </button>
              )}
            </div>

            <div className="p-2 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center gap-2 shadow-sm">
              <button
                onClick={() => turn < 3 && setIsRecording(!isRecording)}
                disabled={turn >= 3}
                className={`w-[48px] h-[48px] rounded-xl flex items-center justify-center shrink-0 transition ${
                  turn >= 3
                    ? 'opacity-40 bg-[var(--canvas)] text-[var(--ink-3)]'
                    : isRecording
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-dim)]'
                }`}
                title="按住發音錄音與糾正"
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                disabled={turn >= 3}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && turn < 3 && handleSendMessage()}
                placeholder={turn >= 3 ? '✨ 對話已完成，請點擊上方按鈕繼續...' : '用語音跟我唸，或輸入文字...'}
                className="flex-1 bg-transparent px-2 py-2 text-sm font-bold text-[var(--ink)] placeholder-[var(--ink-3)] focus:outline-none disabled:opacity-50"
              />

              <button
                onClick={() => turn < 3 ? handleSendMessage() : finishTaskCycle()}
                className="w-[48px] h-[48px] rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => finishTaskCycle()}
              className="text-xs font-bold text-[var(--ink-3)] hover:text-[var(--primary)] transition py-1 text-center"
            >
              完成對話與語用診斷 ➔
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: POST-TASK */}
      {stage === 'posttask' && (
        <div className="flex-1 flex flex-col p-6 rounded-[28px] bg-[var(--surface)] border border-[var(--border)] shadow-sm gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
              第三階段診斷報告
            </span>
            <h2 className="text-2xl font-black text-[var(--ink)]">
              任務達成度：100% 滿分
            </h2>
            <p className="text-xs text-[var(--ink-2)] leading-relaxed font-medium">
              成功在低焦慮環境下完成非語言點餐與溝通目標。
            </p>
          </div>

          {/* Grammar & Pronunciation Analysis */}
          <div className="flex flex-col gap-4 mt-2">
            <h3 className="text-sm font-extrabold text-[var(--ink)] flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[var(--primary)]" />
              <span>語法亮點與 FSRS 數據</span>
            </h3>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col gap-2">
              <div className="text-sm font-extrabold text-emerald-700">
                ✨ FSRS 記憶庫已同步
              </div>
              <p className="text-xs text-emerald-600">
                自發詞彙 [{hydratedWords.join(', ') || 'おすすめ'}] 穩定度 $S$ 提升至 4.2 天。
              </p>
              {extractedVocab.length > 0 && (
                <div className="mt-2 pt-2 border-t border-emerald-200">
                  <p className="text-[10px] font-extrabold text-emerald-700 mb-1">AI 提煉生詞 (自動加入牌組):</p>
                  <div className="flex flex-wrap gap-1">
                    {extractedVocab.map((v, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {v.word} ({v.meaning})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-[var(--primary-light)] border border-[var(--primary-dim)] flex flex-col gap-2">
              <div className="text-sm font-extrabold text-[var(--primary)]">
                🗣️ 發音評分 (Accent Score)
              </div>
              <p className="text-xs text-[var(--ink-2)]">
                流利度 96% · 語速自然停頓 280ms
              </p>
            </div>
          </div>

          <button
            onClick={() => onFinishTask && onFinishTask()}
            className="w-full h-[52px] rounded-2xl bg-[var(--primary)] text-white font-extrabold text-base shadow-sm active:scale-[0.98] transition flex items-center justify-center mt-auto"
          >
            返回解鎖路線
          </button>
        </div>
      )}
    </div>
  )
}

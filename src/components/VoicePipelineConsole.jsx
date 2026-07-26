import React, { useState } from 'react'
import { Mic, Zap, CheckCircle2, RefreshCw, Volume2, ShieldCheck } from 'lucide-react'

export default function VoicePipelineConsole({ onStartTBLT }) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [latencyMetrics, setLatencyMetrics] = useState({
    stt: 110, // Deepgram Nova-2
    llm: 120, // Groq / GPT-4o
    tts: 90,  // Cartesia PCM Stream
    total: 320, // < 500ms Threshold
  })

  return (
    <div className="max-w-md mx-auto space-y-8 pb-28 pt-2 px-1 animate-fadeIn">
      {/* Low-Latency Architecture Monitor Tile */}
      <div className="quiet-card p-7 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#6C5CE7]" />
            <h2 className="type-16 text-[var(--ink)] font-bold">
              WebRTC &lt;300ms 音訊串流控制台
            </h2>
          </div>
          <span className="type-13 px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] font-semibold">
            即時傳輸中
          </span>
        </div>

        {/* Latency Pipeline Breakdown Meter */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="type-16 font-bold text-[#6C5CE7]">{latencyMetrics.stt}ms</div>
            <div className="type-13 text-[#78716C]">STT 識別</div>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="type-16 font-bold text-[#6C5CE7]">{latencyMetrics.llm}ms</div>
            <div className="type-13 text-[#78716C]">LLM 推理</div>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="type-16 font-bold text-[#6C5CE7]">{latencyMetrics.tts}ms</div>
            <div className="type-13 text-[#78716C]">TTS 音流</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20">
            <div className="type-16 font-bold text-[#10B981]">{latencyMetrics.total}ms</div>
            <div className="type-13 text-[#10B981] font-semibold">總延遲</div>
          </div>
        </div>

        <p className="type-13 text-[#78716C] leading-relaxed">
          符合自然人際停頓標準 (200ms-400ms)。零遲鈍感防禦情感過濾器 (Affective Filter)。
        </p>

        {/* Interactive Mic Test */}
        <button
          onClick={() => setIsStreaming(!isStreaming)}
          className={`w-full py-4 rounded-2xl type-16 font-bold flex items-center justify-center gap-3 transition ${
            isStreaming
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-[#6C5CE7]/10 text-[#6C5CE7] hover:bg-[#6C5CE7]/20'
          }`}
        >
          <Mic className="w-5 h-5" />
          <span>{isStreaming ? 'PCM 雙工串流傳輸中...' : '測試 WebRTC 語音對講頻道'}</span>
        </button>
      </div>

      {/* TBLT Launcher Card */}
      <div className="quiet-card p-7 space-y-4">
        <h3 className="type-16 text-[var(--ink)] font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>進入 TBLT 任務型對話學習</span>
        </h3>
        <p className="type-13 text-[#78716C]">
          結合克拉申 $i+1$ 可理解輸入與對話後復盤報告。
        </p>
        <button
          onClick={() => onStartTBLT && onStartTBLT()}
          className="w-full quiet-btn-primary flex items-center justify-center gap-2"
        >
          <span>開始情境點餐任務 (約 3 分鐘)</span>
        </button>
      </div>
    </div>
  )
}

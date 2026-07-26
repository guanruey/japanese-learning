import React from 'react'
import { BrainCircuit, Languages, Route, ArrowLeft } from 'lucide-react'

export default function MethodologyView({ onBack }) {
  return (
    <div className="min-h-full flex flex-col gap-6 max-w-md mx-auto w-full">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-full bg-[var(--surface-2)] shadow-sm text-[var(--ink-2)] hover:text-[var(--ink)] transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="type-32 text-[var(--ink)] font-bold">我們的學習方法</h2>
      </div>
      
      <p className="type-16 text-[#78716C] px-1">
        我們結合了三大認知與語言科學理論，打造最有效率的 AI 語言學習引擎。
      </p>

      <div className="flex flex-col gap-5">
        {/* FSRS */}
        <div className="qp-card p-5 sm:p-6 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-[var(--primary)]">
            <div className="w-10 h-10 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="type-16 font-bold text-[var(--ink)]">FSRS 記憶科學</h3>
          </div>
          <p className="type-13 text-[#78716C] leading-relaxed">
            我們捨棄傳統死背，利用 FSRS 3D 演算法即時追蹤您大腦對每個單字的 <strong>提取率 (R)</strong> 與 <strong>穩定度 (S)</strong>。當您在與 AI 對話時正確使用單字，系統便會自動為您延展記憶半衰期。
          </p>
        </div>

        {/* TBLT */}
        <div className="qp-card p-5 sm:p-6 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-emerald-500">
            <div className="w-10 h-10 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="type-16 font-bold text-[var(--ink)]">TBLT 任務型教學</h3>
          </div>
          <p className="type-13 text-[#78716C] leading-relaxed">
            比起無聊的課文朗讀，大腦在「解決真實問題」時學習最快。透過咖啡店點餐、旅遊問路等真實任務，強迫啟動語言生存機制，讓您在實戰中學會應用。
          </p>
        </div>

        {/* Contrastive Linguistics */}
        <div className="qp-card p-5 sm:p-6 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-amber-500">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="type-16 font-bold text-[var(--ink)]">跨語言對比法</h3>
          </div>
          <p className="type-13 text-[#78716C] leading-relaxed">
            AI 導師深知您的「母語痛點」。例如：中文母語者學日文時，AI 會特別抓出您的「高低音調」錯誤與「同形異義漢字」，對症下藥，避免無效努力。
          </p>
        </div>
      </div>
    </div>
  )
}

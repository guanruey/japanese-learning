import React, { useState } from 'react'
import { ShieldCheck, ChevronLeft, FileText, UserX } from 'lucide-react'

export default function LegalDocumentsView({ onBack }) {
  const [activeTab, setActiveTab] = useState('privacy') // 'privacy' | 'tos'

  return (
    <div className="min-h-full flex flex-col max-w-md mx-auto w-full bg-[var(--canvas)] animate-fadeIn">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--input-bg)] transition">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-black tracking-tight text-[var(--ink)] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          合規與隱私
        </h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Tabs */}
      <div className="flex p-4 gap-2 bg-[var(--surface)]">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'privacy' ? 'bg-[var(--primary)] text-white shadow-[var(--shadow-primary)]' : 'bg-[var(--input-bg)] text-[var(--ink-2)]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          隱私權政策
        </button>
        <button
          onClick={() => setActiveTab('tos')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'tos' ? 'bg-[var(--primary)] text-white shadow-[var(--shadow-primary)]' : 'bg-[var(--input-bg)] text-[var(--ink-2)]'
          }`}
        >
          <FileText className="w-4 h-4" />
          服務條款
        </button>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 overflow-y-auto">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-sm">
          
          {activeTab === 'privacy' && (
            <div className="prose prose-sm dark:prose-invert prose-p:text-[var(--ink-2)] prose-headings:text-[var(--ink)] max-w-none">
              <h2 className="font-black text-xl mb-4 border-b border-[var(--border)] pb-2">隱私權政策 (Privacy Policy)</h2>
              <p>最後更新日期：2026年7月</p>
              
              <h3 className="font-bold text-lg mt-6 mb-2">1. 我們收集的資料</h3>
              <p>為了提供個人化的語言學習體驗與 FSRS 間隔重複演算法，我們會收集並安全地儲存：</p>
              <ul className="list-disc pl-5 mb-4 text-[var(--ink-2)]">
                <li>您的學習進度、答題正確率與錯題紀錄。</li>
                <li>您在註冊時提供的 Email 帳號（若您選擇建立雲端帳號）。</li>
              </ul>

              <h3 className="font-bold text-lg mt-6 mb-2">2. 關於 AI 對話與 API 金鑰 (BYOK)</h3>
              <p>本應用程式提供「自帶金鑰 (Bring Your Own Key)」功能。<strong>我們絕不會將您的 OpenAI 或 Anthropic API 金鑰儲存在我們的伺服器上。</strong>您的金鑰僅會加密儲存於您設備的本地儲存空間 (Local Storage) 中，並直接從您的設備向 AI 供應商發起請求。我們無法也無權存取您的 API 餘額。</p>

              <h3 className="font-bold text-lg mt-6 mb-2">3. 帳號與資料刪除權利</h3>
              <p>您擁有完全的資料控制權。如果您希望徹底刪除您的帳號與所有關聯的學習紀錄，請透過以下方式辦理：</p>
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex flex-col gap-3 my-4">
                <div className="flex items-center gap-2 text-rose-600 font-bold">
                  <UserX className="w-5 h-5" />
                  刪除帳號要求
                </div>
                <p className="text-rose-600/80 text-xs leading-relaxed">
                  請將標題為「刪除帳號要求」的電子郵件發送至 support@example.com，並附上您註冊時使用的 Email。我們將在 7 個工作天內永久清除您在我們伺服器上的所有資料。
                </p>
              </div>
            </div>
          )}

          {activeTab === 'tos' && (
            <div className="prose prose-sm dark:prose-invert prose-p:text-[var(--ink-2)] prose-headings:text-[var(--ink)] max-w-none">
              <h2 className="font-black text-xl mb-4 border-b border-[var(--border)] pb-2">服務條款 (Terms of Service)</h2>
              <p>最後更新日期：2026年7月</p>

              <h3 className="font-bold text-lg mt-6 mb-2">1. 服務內容</h3>
              <p>我們提供基於人工智慧與認知科學的語言學習輔助工具。由於 AI 生成內容具有隨機性，我們不對 AI 教練回覆的絕對正確性負法律責任，請使用者自行斟酌參考。</p>

              <h3 className="font-bold text-lg mt-6 mb-2">2. 訂閱與退款</h3>
              <p>本服務提供訂閱制 (VIP) 方案。若您透過 Apple App Store 或 Google Play 購買，退款政策將完全依照該平台的官方規定辦理。若您使用自帶金鑰 (BYOK) 模式，您必須自行承擔向 AI 供應商產生的 API 費用。</p>

              <h3 className="font-bold text-lg mt-6 mb-2">3. 使用限制</h3>
              <p>您不得利用本服務提供的 AI 介面進行任何違反當地法律、產生惡意程式碼或生成色情/暴力內容的行為。違者我們有權立即終止您的帳號。</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { useSubscription } from '../context/SubscriptionContext'
import { Crown, Check, X, Sparkles, ShieldCheck, Star, Clock, Lock, Zap } from 'lucide-react'
import './PaywallModal.css'

export default function PaywallModal() {
  const { isPaywallOpen, closePaywall, upgradeToPro } = useSubscription()
  const [selectedPlan, setSelectedPlan] = useState('yearly')
  const [loading, setLoading] = useState(false)

  if (!isPaywallOpen) return null

  const handleSubscribe = () => {
    setLoading(true)
    setTimeout(() => {
      upgradeToPro()
      setLoading(false)
      alert('🎉 恭喜升級至日語學習 VIP 會員！已全解鎖所有等級與高級功能！')
    }, 600)
  }

  return (
    <div className="paywall-overlay" onClick={closePaywall}>
      <div className="paywall-card animate-fadeIn max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="paywall-badge-glow" />
        <button className="paywall-close-btn" onClick={closePaywall} aria-label="Close">
          <X size={18} />
        </button>

        {/* Header & Social Proof */}
        <div className="paywall-header pb-2">
          <div className="paywall-crown-icon relative">
            <Crown size={36} className="text-[var(--primary)] animate-bounce" />
            <Sparkles size={16} className="text-[var(--primary)] absolute -top-1 -right-1 animate-pulse" />
          </div>

          {/* Social Proof Stars */}
          <div className="flex items-center justify-center gap-1 my-1.5 text-[var(--primary)] text-xs font-bold">
            <div className="flex text-[var(--primary)]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-[var(--primary)] text-[var(--primary)]" />
              ))}
            </div>
            <span className="text-[var(--ink)] font-extrabold ml-1">4.9</span>
            <span className="text-[var(--ink-3)] font-normal">(12,800+ 位學員 5 星推薦)</span>
          </div>

          <h2 className="text-2xl font-extrabold text-[var(--ink)]">
            解鎖全階段日語 / 英語實力
          </h2>
          <p className="text-xs text-[var(--ink-2)] mt-1 max-w-xs mx-auto">
            一次訂閱，暢享 JLPT N5~N1 完整詞庫、SRS 無限複習與 AI 情境對話
          </p>
        </div>

        {/* ⚡️ FREE VS. PRO SIDE-BY-SIDE COMPARISON TABLE */}
        <div className="px-5 my-4">
          <div className="text-xs font-extrabold text-[var(--primary)] uppercase tracking-wider mb-2.5 flex items-center gap-1.5 justify-center">
            <Zap size={14} className="text-[var(--primary)] fill-[var(--primary)]" />
            <span>櫻花石計次方案 vs. VIP 會員 權益差異</span>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden text-xs">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_80px_80px] gap-2 p-3 font-extrabold bg-[var(--canvas)] border-b border-[var(--border)]">
              <div className="text-left text-[var(--ink-2)]">權益功能</div>
              <div className="text-[var(--ink-2)]">🌸 櫻花石計次</div>
              <div className="text-[var(--primary)] flex items-center justify-center gap-0.5">
                <Crown size={12} /> VIP
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[var(--border)]">
              {/* Row 1 */}
              <div className="grid grid-cols-3 p-2.5 items-center text-center">
                <div className="text-left font-bold text-[var(--ink)]">JLPT / 詞庫解鎖</div>
                <div className="text-[var(--ink-3)]">僅限 N5 基礎</div>
                <div className="font-extrabold text-[var(--primary)] bg-[var(--primary-light)] py-1 rounded-lg">N5~N1 + 多益全開</div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-3 p-2.5 items-center text-center">
                <div className="text-left font-bold text-[var(--ink)]">FSRS 智能記憶</div>
                <div className="text-[var(--ink-3)]">每日限 5 單字</div>
                <div className="font-extrabold text-[var(--primary)] bg-[var(--primary-light)] py-1 rounded-lg">無限次記憶演算</div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-3 p-2.5 items-center text-center">
                <div className="text-left font-bold text-[var(--ink)]">AI 真人語音對話</div>
                <div className="text-[var(--ink-3)]">每日限 2 次</div>
                <div className="font-extrabold text-[var(--primary)] bg-[var(--primary-light)] py-1 rounded-lg">無限對話 + 即時糾錯</div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-3 p-2.5 items-center text-center">
                <div className="text-left font-bold text-[var(--ink)]">SLA 學術得體徽章</div>
                <div className="text-[var(--danger)] font-bold">❌ 無法檢視</div>
                <div className="font-extrabold text-[var(--primary)] bg-[var(--primary-light)] py-1 rounded-lg">全徽章實時解析</div>
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-3 p-2.5 items-center text-center">
                <div className="text-left font-bold text-[var(--ink)]">English Lab 雙語</div>
                <div className="text-[var(--ink-3)]">🔒 鎖定中</div>
                <div className="font-extrabold text-[var(--primary)] bg-[var(--primary-light)] py-1 rounded-lg">全館雙語雙軌特訓</div>
              </div>
            </div>
          </div>
        </div>

        {/* Plans Container with Visual Price Anchoring */}
        <div className="paywall-plans-container px-5 gap-3">
          {/* Monthly Plan */}
          <div
            className={`paywall-plan-box ${selectedPlan === 'monthly' ? 'selected' : ''}`}
            onClick={() => setSelectedPlan('monthly')}
          >
            <div className="text-xs font-bold text-[var(--ink-2)]">月度方案</div>
            <div className="text-xl font-extrabold text-[var(--ink)] mt-1">NT$ 150 <span className="text-xs font-normal text-[var(--ink-3)]">/ 月</span></div>
            <div className="text-[10px] text-[var(--ink-3)] mt-1">隨時取消，無負擔體驗</div>
          </div>

          {/* Yearly Plan (Best Value with Anchor Price) */}
          <div
            className={`paywall-plan-box relative ${selectedPlan === 'yearly' ? 'selected' : ''}`}
            onClick={() => setSelectedPlan('yearly')}
          >
            <div className="paywall-save-tag absolute -top-2.5 right-3 shadow-md">
              省 50% 👑 超值首選
            </div>
            <div className="text-xs font-bold text-[var(--primary)]">年度方案 (7天免費試用)</div>
            <div className="flex items-baseline justify-center gap-1.5 mt-1">
              <span className="text-xs text-[var(--ink-3)] line-through">NT$ 1,800</span>
              <span className="text-xl font-extrabold text-[var(--ink)]">NT$ 890</span>
              <span className="text-xs text-[var(--ink-3)]">/年</span>
            </div>
            {/* Micro-cost breakdown */}
            <div className="text-[11px] font-bold text-[#059669] mt-1 bg-[#059669]/10 py-0.5 px-2 rounded-md inline-block">
              每天僅需 NT$ 2.4 元 (不到半口飲料)
            </div>
          </div>
        </div>

        {/* 7-Day Free Trial Visual Timeline */}
        <div className="mx-5 my-3 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs">
          <div className="text-[var(--ink)] font-bold mb-2 flex items-center gap-1.5">
            <Clock size={14} className="text-[var(--primary)]" />
            <span>7 天免費試用流程 (零風險試用)</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-[var(--ink-2)]">
            <div className="p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <div className="font-bold text-[var(--primary)]">今天</div>
              <div>0 元開啟試用</div>
            </div>
            <div className="p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <div className="font-bold text-[var(--primary)]">第 5 天</div>
              <div>自動發送提醒通知</div>
            </div>
            <div className="p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <div className="font-bold text-[#059669]">第 7 天</div>
              <div>開始計費，可隨時取消</div>
            </div>
          </div>
        </div>

        {/* CTA Action Button */}
        <div className="px-5 pb-5 space-y-2">
          <button
            className="paywall-action-btn flex items-center justify-center gap-2 py-3.5 rounded-xl font-extrabold text-base transition active:scale-98"
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? (
              <span>處理中...</span>
            ) : (
              <>
                <Sparkles size={18} />
                <span>{selectedPlan === 'yearly' ? '免費試用 7 天，立即升級 VIP' : '立即解鎖 VIP 會員'}</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-[11px] text-[var(--ink-3)] pt-2 border-t border-[var(--border)]">
            <button onClick={() => alert('已成功恢復購買！')} className="hover:underline flex items-center gap-1">
              <ShieldCheck size={12} /> 恢復購買 (Restore)
            </button>
            <span className="flex items-center gap-1">
              <Lock size={10} /> Apple 官方安全加密
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

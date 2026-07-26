import { lazy, Suspense } from 'react'
import { SubscriptionProvider } from './context/SubscriptionContext'
import { LocaleProvider, useLocale } from './context/LocaleContext'
import { PersonaProvider } from './context/PersonaContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useTheme } from './context/ThemeContext'
import LoginScreen from './components/LoginScreen'
import PaywallModal from './components/PaywallModal'
import Navigation from './components/Navigation'
import SpeechSettingsPanel from './components/SpeechSettingsPanel'
import AchievementToast from './components/AchievementToast'
import { LoadingState, ErrorState } from './components/UXStates'

// Zustand stores
import { useAppShellStore } from './stores/appShellStore'
import { useLessonFlowStore } from './stores/lessonFlowStore'

import { useGrammarQuery } from './queries/useGrammarQuery'
import { useVocabularyQuery } from './queries/useVocabularyQuery'
import { useDueReviewsQuery } from './queries/useDueReviewsQuery'

// Router
import MainContentRouter from './components/MainContentRouter'

// Dynamic imports for overlays
const OnboardingFlow = lazy(() => import('./components/OnboardingFlow'))
const LessonSession = lazy(() => import('./components/LessonSession'))
const LessonComplete = lazy(() => import('./components/LessonComplete'))

function ComponentLoader() {
  return <LoadingState message="載入模組中..." />
}

function AppContent() {
  const { targetLang } = useLocale()
  const { colorTheme, selectTheme } = useTheme()
  const { user } = useAuth()
  
  // Zustand States
  const { activeTab, setActiveTab, readingMode, cycleReadingGuide, showOnboarding, completeOnboarding } = useAppShellStore()
  const { activeLesson, lessonResult, completeLesson, exitLesson } = useLessonFlowStore()

  // TanStack Query for remote data
  const { data: grammarData, isLoading: isGrammarLoading, isError: isGrammarError, refetch: refetchGrammar } = useGrammarQuery()
  const { data: vocabData, isLoading: isVocabLoading, isError: isVocabError, refetch: refetchVocab } = useVocabularyQuery()
  const { data: srsDueItems, isLoading: isDueLoading, isError: isDueError, refetch: refetchDue } = useDueReviewsQuery()

  const isLoading = isGrammarLoading || isVocabLoading || isDueLoading
  const isError = isGrammarError || isVocabError || isDueError
  
  const handleRetry = () => {
    if (isGrammarError) refetchGrammar()
    if (isVocabError) refetchVocab()
    if (isDueError) refetchDue()
  }

  if (!user) {
    return <LoginScreen />
  }

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] flex flex-col md:flex-row transition-colors duration-500">
      <AchievementToast />
      <Suspense fallback={<ComponentLoader />}>
        {/* Onboarding overlay */}
        {showOnboarding && (
          <OnboardingFlow onComplete={completeOnboarding} />
        )}
        
        {/* Lesson overlays */}
        {activeLesson && (
          <LessonSession
            node={activeLesson}
            onComplete={completeLesson}
            onExit={exitLesson}
          />
        )}
        {lessonResult && (
          <LessonComplete
            node={activeLesson || {}}
            xpEarned={lessonResult.xpEarned}
            streakDays={lessonResult.streakDays}
            totalXP={lessonResult.totalXP}
            onContinue={() => { exitLesson(); setActiveTab('path') }}
            onHome={() => { exitLesson(); setActiveTab('path') }}
          />
        )}
      </Suspense>

      {/* Navigation Sidebar & Bottom Bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        readingMode={readingMode}
        cycleReadingGuide={cycleReadingGuide}
        dueCount={srsDueItems?.length || 0}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Desktop-Only Secondary Header Bar */}
        <header className="hidden md:flex sticky top-0 z-20 mb-4 rounded-2xl bg-[var(--nav-bg)] border border-[var(--nav-border)] px-6 py-4 items-center justify-between shadow-sm transition-colors duration-500 mt-4 mx-8">
          <div className="flex items-center gap-3">
            <button
              onClick={cycleReadingGuide}
              className="px-3.5 py-2.5 min-h-[48px] rounded-2xl bg-[rgba(108,92,231,0.1)] text-[#6C5CE7] text-sm font-semibold hover:bg-[rgba(108,92,231,0.18)] transition"
            >
              {readingMode === 'furigana' ? 'ふりがな' : readingMode === 'romaji' ? 'ローマ字' : '標註 OFF'}
            </button>
          </div>
          <div className="t-caption font-bold text-[var(--primary)] capitalize">
            🎯 學習目標：{targetLang}
          </div>
        </header>

        <div className="hidden md:block px-8">
          <SpeechSettingsPanel />
        </div>

        {/* Unified Scroll Area for Desktop & Mobile */}
        <div className="flex-1 overflow-y-auto px-4 py-4 md:px-8 md:pt-4 md:pb-8">
          {isLoading && <LoadingState message="正在載入課程資料..." />}
          
          {!isLoading && isError && (
            <ErrorState isOffline={!navigator.onLine} onRetry={handleRetry} />
          )}

          {!isLoading && !isError && (
            <MainContentRouter
              vocabData={vocabData || []}
              grammarData={grammarData || []}
              srsDueItems={srsDueItems || []}
            />
          )}

          <footer className="hidden md:block py-6 mt-8 text-center t-caption space-y-0.5 opacity-60">
            <p className="font-semibold">日語學習平台 · JLPT N5 / N4 Pro</p>
            <p>© 2025-2026 Grant, K. J. Huang, Ph.D. 黃冠叡.</p>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <LocaleProvider>
        <SubscriptionProvider>
          <PersonaProvider>
            <AppContent />
            <PaywallModal />
          </PersonaProvider>
        </SubscriptionProvider>
      </LocaleProvider>
    </AuthProvider>
  )
}

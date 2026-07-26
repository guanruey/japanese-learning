import React, { Suspense, lazy } from 'react'
import { LoadingState } from './UXStates' 
import { useAppShellStore } from '../stores/appShellStore'
import { useLessonFlowStore } from '../stores/lessonFlowStore'
import { motion, AnimatePresence } from 'framer-motion'

function ComponentLoader() {
  return <LoadingState message="載入模組中..." />
}

// Lazy load all main components to keep bundle size small
const TodayDashboard = lazy(() => import('./TodayDashboard'))
const DuolingoPaths = lazy(() => import('./DuolingoPaths'))
const PracticeHub = lazy(() => import('./PracticeHub'))
const AiTutorHub = lazy(() => import('./AiTutorHub'))
const StatsDashboard = lazy(() => import('./StatsDashboard'))
const UserProfileSettings = lazy(() => import('./UserProfileSettings'))
const FlashcardStudySession = lazy(() => import('./FlashcardStudySession'))
const SavedReview = lazy(() => import('./SavedReview'))
const EnglishLearningHub = lazy(() => import('./EnglishLearningHub'))

export default function MainContentRouter({
  vocabData = [],
  grammarData = [],
  srsDueItems = []
}) {
  const { activeTab, setActiveTab } = useAppShellStore()
  const { startLesson } = useLessonFlowStore()

  return (
    <Suspense fallback={<div className="p-8 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-[var(--primary)] border-t-transparent rounded-full" /></div>}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.99 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full h-full"
        >
          {activeTab === 'dashboard' && (
            <TodayDashboard
              onStartLesson={(mode) => setActiveTab(mode || 'aitutor')}
              onSkipToReview={() => setActiveTab('srs')}
              streakDays={5} // TODO: hook this up to LessonFlowStore later if needed
              srsDueCount={srsDueItems.length}
              vocabData={vocabData}
              grammarData={grammarData}
            />
          )}

          {activeTab === 'path' && (
            <DuolingoPaths onStartLesson={startLesson} />
          )}

          {activeTab === 'practice' && (
            <PracticeHub
              vocabData={vocabData}
              grammarData={grammarData}
            />
          )}

          {activeTab === 'aitutor' && (
            <AiTutorHub onNavigate={setActiveTab} />
          )}

          {activeTab === 'stats' && (
            <StatsDashboard
              vocabList={vocabData}
              grammarList={grammarData}
              dueCount={srsDueItems.length}
            />
          )}

          {activeTab === 'profile' && (
            <UserProfileSettings />
          )}

          {activeTab === 'srs' && (
            <FlashcardStudySession
              items={srsDueItems.length > 0 ? srsDueItems : vocabData.slice(0, 10)}
              onFinish={() => setActiveTab('path')}
            />
          )}

          {activeTab === 'saved' && (
            <SavedReview
              grammarData={grammarData}
            />
          )}

          {activeTab === 'english-hub' && (
            <EnglishLearningHub onNavigate={setActiveTab} />
          )}
        </motion.div>
      </AnimatePresence>
    </Suspense>
  )
}

import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, Check, X as XIcon, Heart } from 'lucide-react';
import { addXP, addDailyXP } from '../data/lessonData';
import { useLearnerModelStore } from '../stores/learnerModelStore';
import { useAchievementStore } from '../stores/achievementStore';
import { trackLearningEvent } from '../services/eventTracker';
import { useHaptics } from '../hooks/useHaptics';
import { motion, AnimatePresence } from 'framer-motion';

export default function LessonSession({ node, onComplete, onExit }) {
  const { logMistake, logSuccess } = useLearnerModelStore();
  const { incrementProgress, unlockAchievement } = useAchievementStore();
  const { hapticSelection, hapticSuccess, hapticError } = useHaptics();
  
  const [activeQuestions, setActiveQuestions] = useState(node.questions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  
  // Mistake Review Phase
  const [mistakes, setMistakes] = useState([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showReviewIntro, setShowReviewIntro] = useState(false);
  const hasMadeMistakeRef = useRef(false);

  // Question state
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedPieces, setSelectedPieces] = useState([]);
  
  // 'idle' | 'correct' | 'wrong'
  const [answerState, setAnswerState] = useState('idle');
  const [showNoHeartsModal, setShowNoHeartsModal] = useState(false);
  
  // Mic state
  const [isRecording, setIsRecording] = useState(false);
  const recordingTimerRef = useRef(null);

  const question = activeQuestions[currentQuestionIndex];
  const totalQuestions = isReviewing ? activeQuestions.length : node.questions.length;
  // Progress is tricky during review, just max it out if reviewing
  const progress = isReviewing ? 100 : (currentQuestionIndex / totalQuestions) * 100;

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setSelectedPieces([]);
    setAnswerState('idle');
    setIsRecording(false);
  }, [currentQuestionIndex, activeQuestions]);

  const handleCheck = async () => {
    if (answerState !== 'idle') return;

    let isCorrect = false;

    if (question.type === 'mc_text' || question.type === 'translate') {
      if (!selectedOption) return;
      isCorrect = selectedOption === question.answer;
    } else if (question.type === 'arrange') {
      if (selectedPieces.length === 0) return;
      const currentAnswer = selectedPieces.join('');
      // check against answerText or joined pieces
      const expectedAnswer = question.answerText || question.answer || question.pieces.join('');
      isCorrect = currentAnswer === expectedAnswer;
    } else if (question.type === 'speak') {
      // Handled separately by mic handlers
      return;
    }

    if (isCorrect) {
      setAnswerState('correct');
      if (question.skill_key && !isReviewing) {
        logSuccess(question.skill_key);
      }
      
      trackLearningEvent({
        eventType: 'lesson.item_answered',
        sourceSurface: 'LessonSession',
        contentRef: { type: question.type, id: question.answerText || question.answer },
        skillRefs: question.skill_key ? [question.skill_key] : [],
        evidenceStrength: 'medium',
        outcome: 'success',
        payload: { is_correct: true, is_review: isReviewing }
      });
      
      hapticSuccess();
    } else {
      setAnswerState('wrong');
      hasMadeMistakeRef.current = true;
      // Record mistake if not already recorded this round
      setMistakes(prev => {
        if (!prev.find(q => q === question)) {
          if (question.skill_key) logMistake(question.skill_key);
          return [...prev, question];
        }
        return prev;
      });
      
      trackLearningEvent({
        eventType: 'lesson.item_answered',
        sourceSurface: 'LessonSession',
        contentRef: { type: question.type, id: question.answerText || question.answer },
        skillRefs: question.skill_key ? [question.skill_key] : [],
        evidenceStrength: 'medium',
        outcome: 'failure',
        payload: { is_correct: false, is_review: isReviewing }
      });

      hapticError();
      setHearts(prev => {
        const newHearts = prev - 1;
        if (newHearts <= 0) {
          setTimeout(() => setShowNoHeartsModal(true), 1000);
        }
        return newHearts;
      });
    }
  };

  const handleNext = () => {
    if (showNoHeartsModal) return;
    
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Check for mistakes
      if (mistakes.length > 0) {
        setShowReviewIntro(true);
      } else {
        // Session complete
        addXP(node.xpReward);
        addDailyXP(node.xpReward);
        
        // Check Achievements
        incrementProgress('first_blood');
        if (node.id === 'unit-1-1') unlockAchievement('n5_start');
        if (!hasMadeMistakeRef.current) unlockAchievement('perfect_session');

        trackLearningEvent({
          eventType: 'lesson.completed',
          sourceSurface: 'LessonSession',
          evidenceStrength: 'strong',
          outcome: 'success',
          payload: { node_id: node.id, xp_reward: node.xpReward, perfect: !hasMadeMistakeRef.current }
        });

        onComplete(node.xpReward);
      }
    }
  };

  const startReviewPhase = () => {
    setIsReviewing(true);
    setShowReviewIntro(false);
    setActiveQuestions([...mistakes]);
    setCurrentQuestionIndex(0);
    setMistakes([]);
  };

  // Mic simulation
  const startRecording = () => {
    if (answerState !== 'idle') return;
    setIsRecording(true);
    recordingTimerRef.current = setTimeout(() => {
      setIsRecording(false);
      setAnswerState('correct');
      incrementProgress('talkative');
      if (question.skill_key && !isReviewing) {
        logSuccess(question.skill_key);
      }
      
      trackLearningEvent({
        eventType: 'lesson.item_answered',
        sourceSurface: 'LessonSession',
        contentRef: { type: 'speak', id: question.answerText },
        skillRefs: question.skill_key ? [question.skill_key] : [],
        evidenceStrength: 'medium',
        outcome: 'success',
        payload: { is_correct: true, is_review: isReviewing }
      });
    }, 1500);
  };

  const stopRecording = () => {
    if (answerState !== 'idle') return;
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
    }
  };

  const handlePieceClick = (piece, index) => {
    if (answerState !== 'idle') return;
    hapticSelection();
    setSelectedPieces(prev => [...prev, piece]);
  };

  const handleSelectedPieceClick = (index) => {
    if (answerState !== 'idle') return;
    hapticSelection();
    setSelectedPieces(prev => prev.filter((_, i) => i !== index));
  };

  const getAvailablePieces = () => {
    if (!question.pieces) return [];
    const usedCounts = {};
    selectedPieces.forEach(p => {
      usedCounts[p] = (usedCounts[p] || 0) + 1;
    });
    
    return question.pieces.map((piece, index) => {
      if (usedCounts[piece] > 0) {
        usedCounts[piece]--;
        return { piece, used: true, index };
      }
      return { piece, used: false, index };
    });
  };

  if (!question) return null;

  if (showReviewIntro) {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--canvas)] flex flex-col items-center justify-center animate-fadeIn p-6">
        <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-6">
          <XIcon className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--ink)] mb-2">錯題回顧</h2>
        <p className="text-[var(--ink-2)] mb-8 text-center">你剛才答錯了 {mistakes.length} 題。<br/>讓我們再練習一次，直到全部答對為止！</p>
        <button 
          onClick={startReviewPhase}
          className="w-full max-w-sm py-4 bg-[var(--primary)] text-white font-bold rounded-2xl hover:opacity-90 transition"
        >
          開始重溫
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col h-full bg-[var(--canvas)] font-sans animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center p-4 gap-4 mt-safe">
        <button 
          onClick={onExit}
          className="p-2 text-[var(--ink-3)] hover:bg-[var(--surface)] rounded-full transition-colors active:scale-95"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex-1 h-4 bg-[var(--surface)] rounded-full overflow-hidden border border-[var(--border)]">
          <div 
            className="h-full bg-[var(--primary)] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center gap-1 text-rose-500 font-bold">
          <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
          <span>{hearts}</span>
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col max-w-3xl mx-auto w-full animate-fadeIn">
        <h2 className="text-xl font-bold text-[var(--ink)] mb-6">
          {question.prompt}
        </h2>

        {(question.type === 'mc_text' || question.type === 'speak') && (
          <div className="mb-8 text-center">
            <div className="text-3xl font-black text-[var(--ink)] mb-2">
              {question.japanese}
            </div>
            <div className="text-sm text-[var(--ink-3)] font-mono">
              {question.romaji}
            </div>
            {question.type === 'speak' && question.translation && (
              <div className="text-sm text-[var(--ink-2)] mt-2">
                {question.translation}
              </div>
            )}
          </div>
        )}

        {question.type === 'translate' && (
          <div className="mb-8">
            <div className="text-2xl font-bold text-[var(--ink)]">
              {question.japanese || question.sourceText}
            </div>
          </div>
        )}

        {/* Options for MC/Translate */}
        {(question.type === 'mc_text' || question.type === 'translate') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto mb-8">
            {question.options?.map((opt, i) => {
              const isSelected = selectedOption === opt;
              // Add Duolingo 3D button styling with border-b-4
              let btnClass = "border-2 border-b-4 border-[var(--border)] bg-[var(--surface)] rounded-2xl p-4 min-h-[60px] text-left font-bold text-[var(--ink)] transition-all active:scale-95 active:border-b-2 active:translate-y-[2px] ";
              
              if (isSelected) {
                btnClass = "border-2 border-b-4 border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] rounded-2xl p-4 min-h-[60px] text-left font-bold transition-all active:scale-95 active:border-b-2 active:translate-y-[2px]";
              }

              if (answerState === 'correct' && isSelected) {
                btnClass = btnClass.replace("border-[var(--primary)]", "border-emerald-500").replace("bg-[var(--primary-light)]", "bg-emerald-50 text-emerald-700");
              } else if (answerState === 'wrong' && isSelected) {
                btnClass = btnClass.replace("border-[var(--primary)]", "border-rose-500").replace("bg-[var(--primary-light)]", "bg-rose-50 text-rose-700");
              } else if (answerState === 'wrong' && opt === question.answer) {
                btnClass = "border-2 border-b-4 border-emerald-500 bg-emerald-50 text-emerald-700 rounded-2xl p-4 min-h-[60px] text-left font-bold transition-all";
              }

              return (
                <button
                  key={i}
                  className={btnClass}
                  onClick={async () => {
                    if (answerState !== 'idle') return;
                    try { await Haptics.impact({ style: ImpactStyle.Medium }); } catch(e){}
                    setSelectedOption(opt);
                  }}
                  disabled={answerState !== 'idle'}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Arrange Word Pieces */}
        {question.type === 'arrange' && (
          <div className="flex flex-col mt-4">
            <div className="min-h-[64px] border-b-2 border-dashed border-[var(--border)] mb-8 flex flex-wrap gap-2 pb-2 items-end">
              {selectedPieces.length === 0 && (
                <span className="text-[var(--ink-3)] text-sm mb-2 ml-2">點擊下方詞塊拼出正確句子</span>
              )}
              {selectedPieces.map((piece, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectedPieceClick(i)}
                  className="bg-[var(--surface)] border-2 border-b-4 border-[var(--border)] rounded-xl px-4 py-2 font-bold text-[var(--ink)] active:scale-95 active:border-b-2 active:translate-y-[2px] transition-all"
                >
                  {piece}
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {getAvailablePieces().map((item, i) => (
                <button
                  key={i}
                  onClick={() => !item.used && handlePieceClick(item.piece, item.index)}
                  disabled={item.used || answerState !== 'idle'}
                  className={`rounded-xl px-4 py-2 font-bold transition-all ${
                    item.used 
                      ? 'bg-[var(--surface-2)] border-2 border-[var(--surface-2)] text-transparent shadow-inner cursor-default' 
                      : 'bg-[var(--surface)] border-2 border-b-4 border-[var(--border)] text-[var(--ink)] active:scale-95 active:border-b-2 active:translate-y-[2px] cursor-pointer shadow-sm'
                  }`}
                >
                  {item.piece}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Speak Mic */}
        {question.type === 'speak' && (
          <div className="mt-auto mb-12 flex justify-center">
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                isRecording 
                  ? 'bg-[var(--primary)] text-white scale-110 shadow-lg shadow-[var(--primary)]' 
                  : answerState === 'correct'
                    ? 'bg-emerald-500 text-white scale-100'
                    : 'bg-[var(--surface)] border-4 border-[var(--border)] text-[var(--primary)] hover:border-[var(--primary)]'
              }`}
            >
              <Mic className={`w-12 h-12 ${isRecording ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {/* Check/Next Bottom Panel */}
      <div className="border-t-2 border-[var(--border)] bg-[var(--surface)] p-4 md:p-6">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {answerState === 'idle' && question.type !== 'speak' ? (
            <button
              onClick={handleCheck}
              disabled={
                (question.type === 'mc_text' && !selectedOption) ||
                (question.type === 'translate' && !selectedOption) ||
                (question.type === 'arrange' && selectedPieces.length === 0)
              }
              className="w-full md:w-auto md:ml-auto px-8 py-3 rounded-xl font-bold text-white bg-[var(--primary)] disabled:opacity-50 disabled:bg-[var(--border)] disabled:text-[var(--ink-3)] transition-all active:scale-95 uppercase tracking-wide"
            >
              檢查
            </button>
          ) : null}

          <AnimatePresence mode="wait">
            {answerState === 'correct' && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-full flex flex-col md:flex-row items-center justify-between text-emerald-600 bg-emerald-100 p-4 rounded-2xl"
              >
                <div className="flex items-center gap-3 mb-4 md:mb-0">
                  <div className="bg-emerald-500 p-2 rounded-full text-white">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-700 text-lg">正確！</h3>
                    {question.explanation && (
                      <p className="text-emerald-600 text-sm mt-1">{question.explanation}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleNext}
                  className="w-full md:w-auto px-8 py-3 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all active:scale-95 uppercase tracking-wide"
                >
                  繼續
                </button>
              </motion.div>
            )}

            {answerState === 'wrong' && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-full flex flex-col md:flex-row items-center justify-between text-rose-600 bg-rose-100 p-4 rounded-2xl"
              >
                <div className="flex items-center gap-3 mb-4 md:mb-0">
                  <div className="bg-rose-500 p-2 rounded-full text-white">
                    <XIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-rose-700 text-lg">正確答案是：</h3>
                    <p className="text-rose-600 mt-1 font-bold">
                      {question.answerText || question.answer || (question.pieces && question.pieces.join(''))}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleNext}
                  className="w-full md:w-auto px-8 py-3 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all active:scale-95 uppercase tracking-wide"
                >
                  繼續
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {answerState === 'idle' && question.type === 'speak' && (
            <div className="w-full text-center text-[var(--ink-3)] text-sm font-bold">
              長按麥克風來發音
            </div>
          )}

        </div>
      </div>

      {/* Out of Hearts Modal */}
      {showNoHeartsModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[var(--surface)] rounded-3xl p-8 max-w-sm w-full text-center shadow-xl">
            <Heart className="w-20 h-20 fill-rose-500 text-rose-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[var(--ink)] mb-2">愛心用光了！</h2>
            <p className="text-[var(--ink-2)] mb-8">你已經沒有愛心可以繼續這個課程。</p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setHearts(3);
                  setShowNoHeartsModal(false);
                  setAnswerState('idle');
                  setSelectedOption(null);
                  setSelectedPieces([]);
                }}
                className="w-full py-3 rounded-xl font-bold text-white bg-[var(--primary)] active:scale-95 transition-all"
              >
                再試一次 (補滿愛心)
              </button>
              <button
                onClick={onExit}
                className="w-full py-3 rounded-xl font-bold text-[var(--ink-2)] bg-[var(--canvas)] border-2 border-[var(--border)] active:scale-95 transition-all"
              >
                放棄這次
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

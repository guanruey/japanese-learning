import React, { useState, useEffect, useRef } from 'react'
import { X, Volume2, Mic, Play, RotateCw, CheckCircle2 } from 'lucide-react'
import FuriganaText from './FuriganaText'
import { speak } from '../utils/speech'

export default function PracticeSession({ mode, subType, items = [], onComplete, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  
  // For Pronunciation mode
  const [isRecording, setIsRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const isPressingRef = useRef(false)

  const currentItem = items[currentIndex]
  const isFinished = currentIndex >= items.length

  useEffect(() => {
    // Revoke old object URL to prevent memory leaks
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    // Reset state on item change
    setIsFlipped(false)
    setAudioUrl(null)
    
    // Auto-play for listening mode
    if (mode === 'listening' && currentItem && !isFinished) {
      handlePlayTTS()
    }
  }, [currentIndex, currentItem, mode, isFinished])

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [audioUrl])

  const handlePlayTTS = () => {
    if (!currentItem) return
    const text = subType === 'grammar' ? (currentItem.example_ja || currentItem.title) : currentItem.word
    const cleanText = text.replace(/\[.*?\]/g, '')
    speak(cleanText, 'ja-JP')
  }

  const startRecording = async (e) => {
    if (e) e.preventDefault() // prevent mouse events from firing after touch
    if (isRecording || isPressingRef.current) return
    isPressingRef.current = true

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // If user released the button during the permissions prompt, abort.
      if (!isPressingRef.current) {
        stream.getTracks().forEach(track => track.stop())
        return
      }

      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const mimeType = mediaRecorderRef.current.mimeType || 'audio/webm'
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(prevUrl => {
          if (prevUrl) URL.revokeObjectURL(prevUrl)
          return url
        })
        // Clean up tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (err) {
      isPressingRef.current = false
      alert('無法存取麥克風，請確認瀏覽器權限設定。')
      console.error(err)
    }
  }

  const stopRecording = (e) => {
    if (e) e.preventDefault()
    isPressingRef.current = false
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsFlipped(true) // Automatically flip to show "Next" button
    }
  }

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl)
      audio.play()
    }
  }

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setCurrentIndex(items.length) // trigger finished state
    }
  }

  if (!currentItem && !isFinished) {
    return <div className="p-8 text-center text-[var(--ink)]">載入中...</div>
  }

  if (isFinished) {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--canvas)] flex flex-col items-center justify-center animate-fadeIn p-6">
        <div className="w-20 h-20 bg-[var(--primary-light)] text-[var(--primary)] rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--ink)] mb-2">練習完成！</h2>
        <p className="text-[var(--ink-2)] mb-8">你完成了 {items.length} 個項目的 {mode} 練習。</p>
        <button 
          onClick={onComplete}
          className="w-full max-w-sm py-4 bg-[var(--primary)] text-white font-bold rounded-2xl hover:opacity-90 transition"
        >
          返回練習中心
        </button>
      </div>
    )
  }

  const renderContent = () => {
    const text = subType === 'grammar' ? (currentItem.title) : currentItem.word
    const reading = subType === 'grammar' ? null : currentItem.reading
    const meaning = subType === 'grammar' ? currentItem.meaning : currentItem.meaning

    if (mode === 'listening') {
      return (
        <div className="flex flex-col items-center gap-6">
          <button 
            onClick={handlePlayTTS}
            className="w-24 h-24 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Volume2 className="w-12 h-12" />
          </button>
          
          <div className={`transition-all duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 blur-md'}`}>
            <div className="text-center">
              <FuriganaText text={text} reading={reading} className="text-3xl font-bold mb-4" />
              <p className="text-[var(--ink-2)]">{meaning}</p>
            </div>
          </div>
        </div>
      )
    }

    if (mode === 'pronunciation') {
      return (
        <div className="flex flex-col items-center gap-8 w-full">
          <div className="text-center">
            <FuriganaText text={text} reading={reading} className="text-3xl font-bold mb-2" />
            <p className="text-[var(--ink-2)]">{meaning}</p>
          </div>

          <div className="flex flex-col w-full gap-4 mt-4">
            <button 
              onClick={handlePlayTTS}
              className="w-full py-4 rounded-2xl bg-[var(--input-bg)] text-[var(--ink)] font-bold flex items-center justify-center gap-2 hover:bg-[var(--nav-bg)] transition"
            >
              <Volume2 className="w-5 h-5" />
              <span>聽範例發音</span>
            </button>

            {!audioUrl ? (
              <button 
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                onTouchCancel={stopRecording}
                className={`w-full py-6 rounded-2xl font-bold flex flex-col items-center justify-center gap-2 transition ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-[var(--primary)] text-white hover:opacity-90'}`}
              >
                <Mic className="w-6 h-6" />
                <span>{isRecording ? '錄音中... (放開結束)' : '按住錄音'}</span>
              </button>
            ) : (
              <div className="flex gap-2 w-full">
                <button 
                  onClick={playRecording}
                  className="flex-1 py-4 rounded-2xl bg-green-500 text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition"
                >
                  <Play className="w-5 h-5" />
                  <span>聽自己的發音</span>
                </button>
                <button 
                  onClick={() => {
                    setAudioUrl(null)
                    setIsFlipped(false)
                  }}
                  className="px-4 rounded-2xl bg-[var(--input-bg)] text-[var(--ink-2)] hover:bg-[var(--nav-bg)] transition flex items-center justify-center"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )
    }

    // Default Flashcard mode
    return (
      <div className="flex flex-col items-center text-center">
        <FuriganaText text={text} reading={reading} className="text-4xl font-bold mb-6" />
        <div className={`transition-all duration-300 ${isFlipped ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
          <div className="w-12 h-1 bg-[var(--border)] mx-auto my-4 rounded-full" />
          <p className="text-xl text-[var(--ink-2)]">{meaning}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-[var(--canvas)] flex flex-col text-[var(--ink)] animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--nav-border)]">
        <button onClick={onExit} className="p-2 text-[var(--ink-3)] hover:text-[var(--ink)] transition rounded-full hover:bg-[var(--input-bg)]">
          <X className="w-6 h-6" />
        </button>
        <div className="flex-1 px-4">
          <div className="h-2 w-full bg-[var(--input-bg)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--primary)] transition-all duration-300"
              style={{ width: `${(currentIndex / items.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="text-sm font-bold text-[var(--ink-2)] w-12 text-right">
          {currentIndex + 1} / {items.length}
        </div>
      </div>

      {/* Main Card Area */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <div className="flex-1 bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] rounded-3xl p-8 flex flex-col justify-center items-center relative">
          
          {/* Top right indicator */}
          <div className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-[var(--input-bg)] text-[var(--ink-2)] uppercase">
            {mode}
          </div>

          {renderContent()}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-6 pt-0">
        {!isFlipped && mode !== 'pronunciation' ? (
          <button 
            onClick={() => setIsFlipped(true)}
            className="w-full py-4 bg-[var(--primary)] text-white font-bold rounded-2xl hover:opacity-90 transition shadow-sm"
          >
            翻開答案
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className={`w-full py-4 font-bold rounded-2xl transition shadow-sm ${mode === 'pronunciation' && !isFlipped ? 'bg-[var(--input-bg)] text-[var(--ink-3)] cursor-not-allowed' : 'bg-[var(--primary)] text-white hover:opacity-90'}`}
            disabled={mode === 'pronunciation' && !isFlipped}
          >
            下一題
          </button>
        )}
      </div>
    </div>
  )
}

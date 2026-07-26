import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TBLTTaskFlow from '../components/TBLTTaskFlow'
import AiTutorHub from '../components/AiTutorHub'
import UserProfileSettings from '../components/UserProfileSettings'
import { ThemeProvider } from '../context/ThemeContext'

// Mock SpeechSynthesis for JSdom
if (typeof window !== 'undefined') {
  window.speechSynthesis = {
    speak: vi.fn(),
    cancel: vi.fn(),
    resume: vi.fn(),
    getVoices: () => [],
  }
  window.SpeechSynthesisUtterance = vi.fn()
}

// Mock HTMLElement.prototype.scrollIntoView for JSdom
Element.prototype.scrollIntoView = vi.fn()

describe('TBLT Task Flow & Navigation Integration Tests', () => {
  it('renders TBLTTaskFlow cleanly without onNavigate prop (safe default prop fallback)', () => {
    render(<TBLTTaskFlow activeTrack="japanese" />)
    expect(screen.getByText('1. 前任務')).toBeDefined()
    expect(screen.getByText(/任務：東京澀谷咖啡館/)).toBeDefined()
  })

  it('triggers onNavigate callback when Breadcrumb buttons are clicked', () => {
    const onNavigateMock = vi.fn()
    render(<TBLTTaskFlow activeTrack="japanese" onNavigate={onNavigateMock} />)

    const homeBtn = screen.getByTitle('回到今日學習首頁')
    fireEvent.click(homeBtn)
    expect(onNavigateMock).toHaveBeenCalledWith('dashboard')

    const mapBtn = screen.getByTitle('回到解鎖章節地圖')
    fireEvent.click(mapBtn)
    expect(onNavigateMock).toHaveBeenCalledWith('path')
  })

  it('renders AiTutorHub cleanly with default props', () => {
    render(<AiTutorHub activeTrack="japanese" />)
    expect(screen.getByText('TBLT 任務')).toBeDefined()
  })

  it('triggers theme selection via ThemeProvider when a theme button is clicked in UserProfileSettings', () => {
    render(
      <ThemeProvider>
        <UserProfileSettings />
      </ThemeProvider>
    )

    // Click the kyoto theme button
    const kyotoBtn = screen.getByText(/京都春日/)
    fireEvent.click(kyotoBtn)
    expect(document.documentElement.getAttribute('data-theme')).toBe('kyoto')
  })
})

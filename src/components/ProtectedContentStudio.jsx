import { useEffect, useState } from 'react'
import ContentStudio from './ContentStudio'
import './ProtectedContentStudio.css'

const STORAGE_KEY = 'content-studio-unlocked'
const ATTEMPT_COUNT_KEY = 'content-studio-attempt-count'
const LOCK_UNTIL_KEY = 'content-studio-lock-until'
const PASSWORD_HASH = '969d8a446b000210c5648727beca834e0c1aa47cdb583880bac1449371634885'
const MAX_ATTEMPTS = 3
const LOCKOUT_MS = 15 * 60 * 1000

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

async function hashText(value) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return toHex(digest)
}

export default function ProtectedContentStudio() {
  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [lockedUntil, setLockedUntil] = useState(0)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    setUnlocked(localStorage.getItem(STORAGE_KEY) === 'true')
    setLockedUntil(Number(localStorage.getItem(LOCK_UNTIL_KEY) || 0))
  }, [])

  useEffect(() => {
    if (!lockedUntil || lockedUntil <= Date.now()) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [lockedUntil])

  const remainingMs = Math.max(0, lockedUntil - now)
  const isLocked = remainingMs > 0

  const formatRemaining = (ms) => {
    const totalSeconds = Math.ceil(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${String(seconds).padStart(2, '0')}`
  }

  const handleUnlock = async (event) => {
    event.preventDefault()
    if (isLocked) {
      setStatus(`Too many incorrect attempts. Try again in ${formatRemaining(remainingMs)}.`)
      return
    }
    setStatus('Verifying...')

    try {
      const hashed = await hashText(password)
      if (hashed === PASSWORD_HASH) {
        localStorage.setItem(STORAGE_KEY, 'true')
        localStorage.removeItem(ATTEMPT_COUNT_KEY)
        localStorage.removeItem(LOCK_UNTIL_KEY)
        setUnlocked(true)
        setPassword('')
        setLockedUntil(0)
        setStatus('')
        return
      }
      const attempts = Number(localStorage.getItem(ATTEMPT_COUNT_KEY) || 0) + 1
      localStorage.setItem(ATTEMPT_COUNT_KEY, String(attempts))

      if (attempts >= MAX_ATTEMPTS) {
        const nextLockUntil = Date.now() + LOCKOUT_MS
        localStorage.setItem(LOCK_UNTIL_KEY, String(nextLockUntil))
        localStorage.setItem(ATTEMPT_COUNT_KEY, '0')
        setLockedUntil(nextLockUntil)
        setNow(Date.now())
        setStatus(`Too many incorrect attempts. Locked for ${formatRemaining(LOCKOUT_MS)}.`)
        return
      }

      setStatus(`Password incorrect. ${MAX_ATTEMPTS - attempts} attempt(s) remaining.`)
    } catch {
      setStatus('Unable to verify password.')
    }
  }

  const handleLock = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUnlocked(false)
    setStatus('')
    setPassword('')
  }

  if (!unlocked) {
    return (
      <section className="protected-studio">
        <div className="protected-studio__card">
          <p className="protected-studio__eyebrow">Protected Area</p>
          <h2>Content Studio is locked</h2>
          <p className="protected-studio__description">
            This workspace can write lesson content into the database, so it now requires a password before opening.
          </p>

          <form className="protected-studio__form" onSubmit={handleUnlock}>
            <input
              type="password"
              value={password}
              disabled={isLocked}
              onChange={(event) => {
                setPassword(event.target.value)
                setStatus('')
              }}
              placeholder="Enter content studio password"
              autoComplete="current-password"
            />
            <button type="submit" disabled={isLocked}>
              {isLocked ? `Locked ${formatRemaining(remainingMs)}` : 'Unlock Content Studio'}
            </button>
          </form>

          {status && <p className={`protected-studio__status ${status === 'Verifying...' ? 'is-pending' : 'is-error'}`}>{status}</p>}
        </div>
      </section>
    )
  }

  return (
    <section className="protected-studio">
      <div className="protected-studio__toolbar">
        <span>Content Studio unlocked on this device</span>
        <button onClick={handleLock}>Lock</button>
      </div>
      <ContentStudio />
    </section>
  )
}

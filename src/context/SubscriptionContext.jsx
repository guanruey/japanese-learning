import React, { createContext, useContext, useState, useEffect } from 'react'

const SubscriptionContext = createContext({
  isPro: false,           // Subscribed to VIP
  hasByokLicense: false,  // Purchased the $19.99 BYOK Unlock
  sakuraBalance: 10,      // Consumable tokens for free/freemium users
  consumeGems: (amount) => false,
  addGems: (amount) => {},
  isPaywallOpen: false,
  openPaywall: () => {},
  closePaywall: () => {},
  toggleProMock: () => {},
  upgradeToPro: () => {},
  unlockByokLicense: () => {},
})

const PRO_KEY = 'japanese_learning_subscription_pro'
const BYOK_LICENSE_KEY = 'japanese_learning_byok_license'
const GEMS_KEY = 'japanese_learning_sakura_gems'

export function SubscriptionProvider({ children }) {
  const [isPro, setIsPro] = useState(() => {
    try { return localStorage.getItem(PRO_KEY) === 'true' } catch { return false }
  })
  
  const [hasByokLicense, setHasByokLicense] = useState(() => {
    try { return localStorage.getItem(BYOK_LICENSE_KEY) === 'true' } catch { return false }
  })
  
  const [sakuraBalance, setSakuraBalance] = useState(() => {
    try { 
      const stored = localStorage.getItem(GEMS_KEY)
      return stored ? parseInt(stored, 10) : 100 // Start free users with 100 gems
    } catch { 
      return 100 
    }
  })

  const [isPaywallOpen, setIsPaywallOpen] = useState(false)

  // Sync state to local storage
  useEffect(() => {
    try { localStorage.setItem(PRO_KEY, isPro ? 'true' : 'false') } catch {}
  }, [isPro])
  
  useEffect(() => {
    try { localStorage.setItem(BYOK_LICENSE_KEY, hasByokLicense ? 'true' : 'false') } catch {}
  }, [hasByokLicense])

  useEffect(() => {
    try { localStorage.setItem(GEMS_KEY, sakuraBalance.toString()) } catch {}
  }, [sakuraBalance])

  const openPaywall = () => setIsPaywallOpen(true)
  const closePaywall = () => setIsPaywallOpen(false)
  const toggleProMock = () => setIsPro((prev) => !prev)

  const upgradeToPro = () => {
    setIsPro(true)
    setIsPaywallOpen(false)
  }
  
  const unlockByokLicense = () => {
    setHasByokLicense(true)
  }
  
  const addGems = (amount) => {
    setSakuraBalance(prev => prev + amount)
  }

  const consumeGems = (amount = 1) => {
    // Check if user has an active BYOK configuration (they must have the license AND have entered a key)
    const provider = localStorage.getItem('USER_AI_PROVIDER') || 'openai'
    const hasKey = localStorage.getItem(`USER_${provider.toUpperCase()}_API_KEY`)
    
    // If they have VIP subscription or active BYOK, they don't consume gems
    if (isPro || (hasByokLicense && hasKey)) return true 
    
    if (sakuraBalance >= amount) {
      setSakuraBalance(prev => prev - amount)
      return true
    }
    return false
  }

  const value = {
    isPro,
    hasByokLicense,
    sakuraBalance,
    consumeGems,
    addGems,
    isPaywallOpen,
    openPaywall,
    closePaywall,
    toggleProMock,
    upgradeToPro,
    unlockByokLicense
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  return useContext(SubscriptionContext)
}

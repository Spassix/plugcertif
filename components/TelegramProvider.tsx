'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import Script from 'next/script'

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  MainButton: {
    show: () => void
    hide: () => void
    setText: (text: string) => void
    onClick: (callback: () => void) => void
  }
  BackButton: {
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
  }
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
  }
  initData: string
  initDataUnsafe: any
  version: string
  platform: string
  colorScheme: 'light' | 'dark'
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  openLink: (url: string) => void
}

interface TelegramContextType {
  webApp: TelegramWebApp | null
  isTelegram: boolean
  theme: 'light' | 'dark'
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  isTelegram: false,
  theme: 'dark'
})

export const useTelegram = () => useContext(TelegramContext)

export default function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)
  const [isTelegram, setIsTelegram] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    // Vérifier si on est dans Telegram
    const checkTelegram = () => {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp as TelegramWebApp
        setWebApp(tg)
        setIsTelegram(true)
        setTheme(tg.colorScheme || 'dark')
        
        // Initialiser Telegram WebApp
        tg.ready()
        tg.expand()
        
        // Appliquer les styles Telegram
        document.documentElement.classList.add('telegram-app')
        document.documentElement.setAttribute('data-theme', tg.colorScheme || 'dark')
      }
    }

    // Vérifier immédiatement et après le chargement du script
    checkTelegram()
    
    // Écouter les changements de thème Telegram
    const handleThemeChange = () => {
      if ((window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp as TelegramWebApp
        setTheme(tg.colorScheme || 'dark')
        document.documentElement.setAttribute('data-theme', tg.colorScheme || 'dark')
      }
    }

    window.addEventListener('telegram-theme-changed', handleThemeChange)
    
    return () => {
      window.removeEventListener('telegram-theme-changed', handleThemeChange)
    }
  }, [])

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
        onLoad={() => {
          if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
            const tg = (window as any).Telegram.WebApp as TelegramWebApp
            setWebApp(tg)
            setIsTelegram(true)
            setTheme(tg.colorScheme || 'dark')
            tg.ready()
            tg.expand()
            document.documentElement.classList.add('telegram-app')
            document.documentElement.setAttribute('data-theme', tg.colorScheme || 'dark')
          }
        }}
      />
      <TelegramContext.Provider value={{ webApp, isTelegram, theme }}>
        {children}
      </TelegramContext.Provider>
    </>
  )
}
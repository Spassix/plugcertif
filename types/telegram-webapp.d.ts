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

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp
  }
}
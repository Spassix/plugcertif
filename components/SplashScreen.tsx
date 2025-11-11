'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'

interface SplashScreenProps {
  onComplete: () => void
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [backgroundImage, setBackgroundImage] = useState('')
  const { data: settings } = useSWR('/api/settings', fetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: false
  })

  useEffect(() => {
    if (settings?.backgroundImage) {
      setBackgroundImage(settings.backgroundImage)
    }
  }, [settings])

  // Afficher pendant 6 secondes
  useEffect(() => {
    const timer = setTimeout(onComplete, 6000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'url(https://i.imgur.com/UqyTSrh.jpeg)',
        backgroundSize: '200px 200px',
        backgroundPosition: '0 0',
        backgroundRepeat: 'repeat'
      }}
    >
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Contenu */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
          Bienvenu(e)s sur <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">PLUGS CRTFS</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90">
          Trouvez votre plugs près de chez vous 🔌
        </p>
      </div>
    </div>
  )
}
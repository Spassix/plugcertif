'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTelegram } from './TelegramProvider'

// Version sans bouton Actualiser - Mise à jour forcée pour Vercel

interface SocialNetwork {
  id: string
  name: string
  url: string
  order: number
}

export default function MaintenancePage() {
  const [socialNetworks, setSocialNetworks] = useState<SocialNetwork[]>([])
  const [maintenanceLogo, setMaintenanceLogo] = useState<string>('')
  const [maintenanceEndTime, setMaintenanceEndTime] = useState<Date | null>(null)
  const [timeLeft, setTimeLeft] = useState<string>('')
  const { isTelegram, webApp } = useTelegram()

  useEffect(() => {
    // Récupérer les réseaux sociaux et les images depuis l'API
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.shopSocialNetworks) {
          setSocialNetworks(data.shopSocialNetworks.sort((a: SocialNetwork, b: SocialNetwork) => a.order - b.order))
        }
        if (data.maintenanceLogo) {
          setMaintenanceLogo(data.maintenanceLogo)
        }
        if (data.maintenanceEndTime) {
          setMaintenanceEndTime(new Date(data.maintenanceEndTime))
        }
      })
      .catch(err => console.error('Erreur chargement réseaux sociaux:', err))
  }, [])

  useEffect(() => {
    if (!maintenanceEndTime) return

    const updateCountdown = () => {
      const now = new Date().getTime()
      const end = new Date(maintenanceEndTime).getTime()
      const distance = end - now

      if (distance < 0) {
        setTimeLeft('')
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      
      if (days > 0) {
        setTimeLeft(`${days}j ${hours}h ${minutes}min`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}min`)
      } else {
        setTimeLeft(`${minutes}min`)
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [maintenanceEndTime])

  // Classes conditionnelles pour Telegram
  const containerClass = isTelegram 
    ? "min-h-screen flex items-center justify-center p-4"
    : "min-h-screen flex items-center justify-center px-4"
  
  const contentClass = isTelegram
    ? "max-w-sm w-full text-center relative z-10"
    : "max-w-2xl w-full text-center relative z-10"
  
  const logoSize = isTelegram ? "w-24 h-24" : "w-48 h-48"
  const titleSize = isTelegram ? "text-2xl" : "text-4xl md:text-6xl"
  const subtitleSize = isTelegram ? "text-base" : "text-xl"
  const countdownSize = isTelegram ? "text-3xl" : "text-5xl"
  const buttonPadding = isTelegram ? "px-4 py-2 text-sm" : "px-6 py-3"

  return (
    <div 
      className={containerClass}
      style={{
        backgroundImage: 'url(https://i.imgur.com/UqyTSrh.jpeg)',
        backgroundSize: '200px 200px',
        backgroundPosition: '0 0',
        backgroundRepeat: 'repeat'
      }}
    >
      {/* Overlay sombre pour la lisibilité */}
      <div className="absolute inset-0 bg-black/85" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={contentClass}
      >
        {maintenanceLogo && (
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={maintenanceLogo}
            alt="PLUGS CRTFS"
            className={`${logoSize} mx-auto mb-4 rounded-2xl object-cover`}
          />
        )}
        
        {!maintenanceLogo && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <svg className={isTelegram ? "w-16 h-16 text-blue-500" : "w-24 h-24 text-blue-500"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </motion.div>
        )}
        
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 mb-4">
          <h1 className={`${titleSize} font-bold text-white mb-3`}>
            🔧 Maintenance en cours
          </h1>
          
          <p className={`${subtitleSize} text-gray-300`}>
            Nous sommes bientôt de retour !
          </p>
        </div>
        
        {timeLeft && (
          <div className={`mb-4 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl`}>
            <p className="text-center">
              <span className={`block ${isTelegram ? 'text-xs' : 'text-sm'} text-gray-300 mb-1`}>⏱️ Temps estimé</span>
              <span className={`block ${countdownSize} font-bold text-white drop-shadow-lg`}>{timeLeft}</span>
            </p>
          </div>
        )}
        
        <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl ${isTelegram ? 'p-4 mb-4' : 'p-8 mb-8'}`}>
          <p className={`text-gray-300 ${isTelegram ? 'mb-3 text-sm' : 'mb-4'}`}>
            Pour toutes informations, rejoignez nos réseaux sociaux 👇
          </p>
          
          {socialNetworks.length > 0 && (
            <div className={`flex flex-wrap gap-2 justify-center ${isTelegram ? 'text-xs' : ''}`}>
              {socialNetworks.map((network) => (
                <a
                  key={network.id}
                  href={network.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 ${isTelegram ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all`}
                  onClick={(e) => {
                    if (isTelegram && webApp) {
                      e.preventDefault()
                      webApp.openLink(network.url)
                    }
                  }}
                >
                  {network.name}
                </a>
              ))}
            </div>
          )}
        </div>
        
        {/* Section avec seulement le bouton Bot Telegram - PAS de bouton Actualiser */}
        <div className={`flex justify-center ${isTelegram ? 'mb-4' : 'mb-8'}`}>
          <a
            href="https://t.me/PLGSCRTF_BOT"
            className={`inline-flex items-center justify-center gap-2 ${buttonPadding} bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all`}
            onClick={(e) => {
              if (isTelegram && webApp) {
                e.preventDefault()
                webApp.openLink("https://t.me/PLGSCRTF_BOT")
              }
            }}
          >
            <svg className={isTelegram ? "w-4 h-4" : "w-5 h-5"} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.248-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.122.099.155.227.17.319.015.092.034.268.019.415z"/>
            </svg>
            Notre Bot Telegram
          </a>
        </div>
        
        <p className={`${isTelegram ? 'text-xs' : 'text-sm'} text-gray-500`}>
          Cordialement,<br />
                        <span className="font-semibold">PLUGS CRTFS</span>
        </p>
      </motion.div>
    </div>
  )
}
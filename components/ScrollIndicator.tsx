'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useTelegram } from './TelegramProvider'

export default function ScrollIndicator() {
  const [showIndicator, setShowIndicator] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const { isTelegram } = useTelegram()

  useEffect(() => {
    // Ne pas afficher dans Telegram
    if (isTelegram) return

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPosition = window.scrollY
      const progress = (scrollPosition / scrollHeight) * 100
      
      setScrollProgress(progress)
      
      // Montrer l'indicateur si on n'est pas tout en bas
      if (progress < 90 && window.innerWidth < 768) {
        setShowIndicator(true)
      } else {
        setShowIndicator(false)
      }
    }

    // Vérifier au chargement
    handleScroll()
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isTelegram])

  const scrollToBottom = () => {
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    })
  }

  // Ne rien rendre dans Telegram
  if (isTelegram) return null

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-4 z-40 md:hidden"
        >
          <motion.button
            onClick={scrollToBottom}
            className="bg-primary/20 backdrop-blur-sm border border-primary/50 rounded-full p-3 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ChevronDownIcon className="w-6 h-6 text-primary" />
              </motion.div>
              
              {/* Progress ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="18"
                  stroke="rgba(139, 92, 246, 0.2)"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="18"
                  stroke="rgb(139, 92, 246)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 18}`}
                  strokeDashoffset={`${2 * Math.PI * 18 * (1 - scrollProgress / 100)}`}
                  className="transition-all duration-200"
                />
              </svg>
            </div>
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-12 right-0 bg-darker/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs text-primary whitespace-nowrap"
          >
            Plus de contenu ↓
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

import { useTelegram } from '@/components/TelegramProvider'

export default function Home() {
  const { isTelegram } = useTelegram()

  // Classes adaptées pour Telegram
  const heroTitle = isTelegram ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
  const heroSubtitle = isTelegram ? "text-base" : "text-lg sm:text-xl md:text-2xl"
  const buttonSize = isTelegram ? "text-sm px-4 py-2" : "text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
  const sectionPadding = isTelegram ? "px-3 pt-16" : "px-4 pt-20 sm:pt-24 md:pt-16"

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen">
      {/* Animated Background - Plus léger pour Telegram */}
      {!isTelegram && (
        <div className="fixed inset-0 -z-10">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 60% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
              ]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>
      )}

      {/* Hero Section avec padding top pour éviter le chevauchement */}
      <section className={`min-h-screen flex items-center justify-center ${sectionPadding}`}>
        <div className={`${isTelegram ? 'max-w-sm' : 'max-w-5xl'} w-full text-center`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={isTelegram ? "mb-6" : "mb-8"}
          >
            <h1 className={`${heroTitle} font-black mb-4 sm:mb-6 text-white drop-shadow-2xl`}>
              <span className="bg-black/50 px-4 py-2 rounded-xl inline-block">
                PLUGS <span className="gradient-text">CRTFS</span>
              </span>
            </h1>
            <p className={`${heroSubtitle} text-white font-medium max-w-3xl mx-auto px-4 drop-shadow-xl`}>
              <span className="bg-black/60 px-4 py-2 rounded-lg inline-block">
                La marketplace exclusive des vendeurs certifiés
              </span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`flex flex-col ${isTelegram ? 'gap-2' : 'sm:flex-row gap-3 sm:gap-4'} justify-center ${isTelegram ? 'mb-6' : 'mb-8 sm:mb-12'} px-4`}
          >
            <Link 
              href="/plugs" 
              className={`btn-primary ${buttonSize} flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-2xl rounded-xl font-bold text-white transition-all ${!isTelegram ? 'transform hover:scale-105' : ''} drop-shadow-xl`}
            >
              Explorer les Plugs
              <ArrowRightIcon className={isTelegram ? "w-4 h-4" : "w-4 h-4 sm:w-5 sm:h-5"} />
            </Link>
            <Link 
              href="/search" 
              className={`btn-secondary ${buttonSize} flex items-center justify-center gap-2 bg-gray-900/90 hover:bg-gray-800 border-2 border-white/30 rounded-xl font-bold text-white transition-all ${!isTelegram ? 'transform hover:scale-105' : ''} backdrop-blur-sm drop-shadow-xl`}
            >
              Recherche Avancée
            </Link>
          </motion.div>

          {/* CTA Section avec meilleur espacement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={`${isTelegram ? 'mt-12' : 'mt-16 sm:mt-20 md:mt-24'} px-4`}
          >
            <div className={`bg-black/80 backdrop-blur-md rounded-2xl ${isTelegram ? 'p-6' : 'p-6 sm:p-8 md:p-10'} border-2 border-white/20 max-w-3xl mx-auto shadow-2xl`}>
              <h2 className={`${isTelegram ? 'text-xl' : 'text-2xl sm:text-3xl md:text-4xl'} font-bold mb-3 sm:mb-4 text-white drop-shadow-xl`}>
                Prêt à rejoindre l'aventure ?
              </h2>
              <p className={`${isTelegram ? 'text-sm' : 'text-base sm:text-lg md:text-xl'} text-white/90 mb-4 sm:mb-6 drop-shadow-lg`}>
                Découvrez les meilleurs vendeurs certifiés de votre région
              </p>
              <Link 
                href="/plugs" 
                className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white ${isTelegram ? 'px-4 py-2 text-sm' : 'px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg'} rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all ${!isTelegram ? 'transform hover:scale-105' : ''} shadow-xl`}
              >
                Commencer maintenant
                <ArrowRightIcon className={isTelegram ? "w-4 h-4" : "w-4 h-4 sm:w-5 sm:h-5"} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      </motion.div>
  )
}
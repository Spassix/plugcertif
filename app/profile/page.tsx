'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTelegram } from '@/components/TelegramProvider'
import { 
  UserIcon, 
  PaperAirplaneIcon, 
  GlobeAltIcon, 
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface UserData {
  user: {
    telegramId: string
    username?: string
    firstName?: string
    lastName?: string
    photoUrl?: string
    languageCode: string
    isPremium: boolean
    joinedAt: string
  }
  stats: {
    points: number
    level: number
    battlesWon: number
    battlesLost: number
  }
  badges: any[]
  preferences: any
}

function getCountryFlag(languageCode: string): string {
  const flags: { [key: string]: string } = {
    'fr': '🇫🇷',
    'en': '🇬🇧',
    'es': '🇪🇸',
    'it': '🇮🇹',
    'de': '🇩🇪',
    'pt': '🇵🇹',
    'nl': '🇳🇱',
    'be': '🇧🇪',
    'ch': '🇨🇭',
  }
  return flags[languageCode.toLowerCase()] || '🌍'
}

function getLanguageName(languageCode: string): string {
  const names: { [key: string]: string } = {
    'fr': 'Français',
    'en': 'English',
    'es': 'Español',
    'it': 'Italiano',
    'de': 'Deutsch',
    'pt': 'Português',
    'nl': 'Nederlands',
    'be': 'België',
    'ch': 'Schweiz',
  }
  return names[languageCode.toLowerCase()] || languageCode.toUpperCase()
}

export default function ProfilePage() {
  const { webApp, isTelegram } = useTelegram()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        
        let telegramId: string | null = null
        
        // Récupérer l'ID Telegram depuis l'API Telegram WebApp
        if (webApp?.initDataUnsafe?.user) {
          telegramId = webApp.initDataUnsafe.user.id.toString()
        } else if (isTelegram && webApp) {
          // Essayer de parser initData
          const initData = webApp.initData
          if (initData) {
            const params = new URLSearchParams(initData)
            const userParam = params.get('user')
            if (userParam) {
              try {
                const userObj = JSON.parse(decodeURIComponent(userParam))
                telegramId = userObj.id?.toString()
              } catch (e) {
                console.error('Error parsing user data:', e)
              }
            }
          }
        }
        
        if (!telegramId) {
          setError('Impossible de récupérer les informations utilisateur')
          setLoading(false)
          return
        }
        
        const response = await fetch(`/api/users/me?telegramId=${telegramId}`)
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données')
        }
        
        const data = await response.json()
        setUserData(data)
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    if (webApp || !isTelegram) {
      fetchUserData()
    }
  }, [webApp, isTelegram])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/80">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-24 px-4">
        <div className="text-center bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 max-w-md">
          <XMarkIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Erreur</h2>
          <p className="text-gray-400">{error || 'Impossible de charger le profil'}</p>
        </div>
      </div>
    )
  }

  const { user, stats } = userData
  const displayName = user.firstName || user.username || `User ${user.telegramId}`
  const username = user.username ? `@${user.username}` : 'Non renseigné'
  const lastName = user.lastName || 'Non renseigné'
  const languageCode = user.languageCode || 'fr'

  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header avec photo de profil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-blue-500/50 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl">
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserIcon className="w-16 h-16 text-gray-500" />
                </div>
              )}
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 drop-shadow-2xl">
            {displayName}
          </h1>
          
          <div className="flex items-center justify-center gap-2 text-gray-300">
            <PaperAirplaneIcon className="w-4 h-4 text-blue-400" />
            <span className="text-sm md:text-base">{username}</span>
          </div>
        </motion.div>

        {/* Informations Utilisateur */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-xl rounded-2xl p-6 mb-6 border-2 border-blue-500/30 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Informations Utilisateur</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-white">
              <PaperAirplaneIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div>
                <span className="text-sm text-gray-400">ID Telegram:</span>
                <span className="ml-2 font-semibold">{user.telegramId}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-white">
              <UserIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div>
                <span className="text-sm text-gray-400">Prénom:</span>
                <span className="ml-2 font-semibold">{user.firstName || 'Non renseigné'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-white">
              <UserIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div>
                <span className="text-sm text-gray-400">Nom:</span>
                <span className="ml-2 font-semibold">{lastName}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-white">
              <PaperAirplaneIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div>
                <span className="text-sm text-gray-400">Nom d'utilisateur:</span>
                <span className="ml-2 font-semibold">{username}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-white">
              <GlobeAltIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div>
                <span className="text-sm text-gray-400">Langue:</span>
                <span className="ml-2 font-semibold">
                  {getLanguageName(languageCode)} {getCountryFlag(languageCode)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-white">
              <SparklesIcon className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <div>
                <span className="text-sm text-gray-400">Telegram Premium:</span>
                <span className={`ml-2 font-semibold ${user.isPremium ? 'text-yellow-400' : 'text-red-400'}`}>
                  {user.isPremium ? 'Activé' : 'Non activé'}
                </span>
                {!user.isPremium && (
                  <XMarkIcon className="w-4 h-4 text-red-400 inline-block ml-1" />
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statut Plug */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-xl rounded-2xl p-6 border-2 border-blue-500/30 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <span className="text-2xl">🔌</span>
            </div>
            <h2 className="text-xl font-bold text-white">Statut Plug</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-white">
              <span className="text-sm text-gray-400">Points:</span>
              <span className="font-bold text-blue-400">{stats.points}</span>
            </div>
            
            <div className="flex items-center justify-between text-white">
              <span className="text-sm text-gray-400">Niveau:</span>
              <span className="font-bold text-purple-400">{stats.level}</span>
            </div>
            
            <div className="flex items-center justify-between text-white">
              <span className="text-sm text-gray-400">Batailles gagnées:</span>
              <span className="font-bold text-green-400">{stats.battlesWon}</span>
            </div>
            
            <div className="flex items-center justify-between text-white">
              <span className="text-sm text-gray-400">Batailles perdues:</span>
              <span className="font-bold text-red-400">{stats.battlesLost}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}


'use client'

import { motion } from 'framer-motion'
import { HeartIcon, MapPinIcon, TruckIcon, CubeIcon, UserGroupIcon } from '@heroicons/react/24/solid'

interface PlugCardProps {
  plug: any
  onClick: () => void
}

export default function PlugCard({ plug, onClick }: PlugCardProps) {
  // Fonction pour obtenir le drapeau du pays
  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'FR': '🇫🇷',
      'BE': '🇧🇪',
      'CH': '🇨🇭',
      'CA': '🇨🇦',
      'LU': '🇱🇺',
      'MC': '🇲🇨'
    }
    return flags[country] || '🌍'
  }

  // Fonction pour formater la localisation
  const formatLocation = () => {
    const parts = []
    
    if (plug.location?.country || plug.country) {
      const country = plug.location?.country || plug.country
      const flag = plug.countryFlag || getCountryFlag(country)
      parts.push(`${flag} ${country}`)
    }
    
    // Afficher tous les pays sélectionnés
    if (plug.countries && plug.countries.length > 0) {
      plug.countries.forEach((countryCode: string) => {
        const flag = getCountryFlag(countryCode)
        parts.push(`${flag} ${countryCode}`)
      })
    }
    
    return parts.join(' • ')
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative cursor-pointer group"
      onClick={onClick}
    >
      {/* Card content */}
      <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-amber-500/20 rounded-2xl overflow-hidden hover:from-gray-700/50 hover:to-gray-800/50 transition-all shadow-xl hover:shadow-amber-500/20">
        {/* Header with image */}
        <div className="relative h-48 md:h-56 overflow-hidden bg-gray-900">
          {plug.photo ? (
            <div className="relative w-full h-full flex items-center justify-center p-2">
              <img
                src={plug.photo}
                alt={plug.name}
                className="max-w-full max-h-full object-contain"
              />
              {/* Gradient overlay léger seulement en bas */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <span className="text-6xl opacity-50">🔌</span>
            </div>
          )}
          
          {/* Badges positionnés en dehors de l'image */}
          <div className="absolute top-2 left-2 right-2 flex justify-between items-start pointer-events-none">
            {/* Rank badge if in top 3 */}
            {plug.rank && plug.rank <= 3 && (
              <div className="bg-gradient-to-r from-amber-600/90 to-yellow-600/90 backdrop-blur-sm rounded-full px-2 py-1 border border-amber-400/50 shadow-lg">
                <span className="text-lg">
                  {plug.rank === 1 && '🥇'}
                  {plug.rank === 2 && '🥈'}
                  {plug.rank === 3 && '🥉'}
                </span>
              </div>
            )}
            
            {/* Like count */}
            <div className="bg-gradient-to-r from-red-600/90 to-pink-600/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 border border-red-400/50 ml-auto shadow-lg">
              <HeartIcon className="w-3 h-3 text-white" />
              <span className="text-xs font-bold text-white">{plug.likes}</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-3 md:p-5 space-y-2 md:space-y-3">
          <h3 className="text-base md:text-xl font-bold text-white bg-gradient-to-r from-gray-800/60 to-gray-700/60 backdrop-blur-sm rounded-lg px-2 md:px-3 py-1 md:py-2 inline-block shadow-lg">
            {plug.name}
          </h3>
          
          {/* Location */}
          <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/30 backdrop-blur-sm rounded-lg px-2 md:px-3 py-1.5 md:py-2 border border-gray-600/20">
            <div className="flex items-center gap-1 md:gap-2 text-white text-xs md:text-sm">
              <MapPinIcon className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0 text-amber-400" />
              <span className="truncate font-semibold">{formatLocation()}</span>
            </div>
          </div>
          
          {/* Départements et pays configurés */}
          <div className="space-y-1">
            {/* Départements de livraison */}
            {plug.deliveryDepartments && plug.deliveryDepartments.length > 0 && (
              <div className="bg-gradient-to-r from-amber-600/20 to-yellow-600/20 backdrop-blur-sm rounded-lg px-2 md:px-3 py-1 md:py-1.5 border border-amber-500/30">
                <div className="text-[10px] md:text-xs text-white font-medium">
                  <span className="font-bold">🚚 Livraison : </span>
                  {plug.deliveryDepartments.length > 3 
                    ? `${plug.deliveryDepartments.slice(0, 3).join(', ')} +${plug.deliveryDepartments.length - 3}`
                    : plug.deliveryDepartments.join(', ')
                  }
                </div>
              </div>
            )}
            
            {/* Pays d'envoi postal */}
            {plug.shippingCountries && plug.shippingCountries.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 backdrop-blur-sm rounded-lg px-2 md:px-3 py-1 md:py-1.5 border border-emerald-500/30">
                <div className="text-[10px] md:text-xs text-white font-medium">
                  <span className="font-bold">📮 Envoi : </span>
                  {plug.shippingCountries.map((code: string) => {
                    const flag = getCountryFlag(code)
                    return `${flag} ${code}`
                  }).join(', ')}
                </div>
              </div>
            )}
            
            {/* Départements de meetup */}
            {plug.meetupDepartments && plug.meetupDepartments.length > 0 && (
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-lg px-2 md:px-3 py-1 md:py-1.5 border border-purple-500/30">
                <div className="text-[10px] md:text-xs text-white font-medium">
                  <span className="font-bold">🤝 Meetup : </span>
                  {plug.meetupDepartments.length > 3 
                    ? `${plug.meetupDepartments.slice(0, 3).join(', ')} +${plug.meetupDepartments.length - 3}`
                    : plug.meetupDepartments.join(', ')
                  }
                </div>
              </div>
            )}
          </div>
          
          {/* Methods */}
          <div className="flex flex-wrap gap-1 md:gap-2">
            {plug.methods?.delivery && (
              <div className="bg-gradient-to-r from-blue-600/40 to-blue-500/40 backdrop-blur-sm text-white px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg text-[10px] md:text-xs flex items-center gap-1 md:gap-1.5 border border-blue-400/40 font-semibold shadow-sm">
                <TruckIcon className="w-3 md:w-3.5 h-3 md:h-3.5" />
                <span className="hidden sm:inline">Livraison</span>
                <span className="sm:hidden">Liv.</span>
              </div>
            )}
            {plug.methods?.shipping && (
              <div className="bg-gradient-to-r from-green-600/40 to-green-500/40 backdrop-blur-sm text-white px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg text-[10px] md:text-xs flex items-center gap-1 md:gap-1.5 border border-green-400/40 font-semibold shadow-sm">
                <CubeIcon className="w-3 md:w-3.5 h-3 md:h-3.5" />
                <span className="hidden sm:inline">Envoi</span>
                <span className="sm:hidden">Env.</span>
              </div>
            )}
            {plug.methods?.meetup && (
              <div className="bg-gradient-to-r from-purple-600/40 to-purple-500/40 backdrop-blur-sm text-white px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg text-[10px] md:text-xs flex items-center gap-1 md:gap-1.5 border border-purple-400/40 font-semibold shadow-sm">
                <UserGroupIcon className="w-3 md:w-3.5 h-3 md:h-3.5" />
                <span className="hidden sm:inline">Meetup</span>
                <span className="sm:hidden">Meet</span>
              </div>
            )}
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-between pt-2 md:pt-3 border-t border-amber-500/20">
            <div className="bg-gradient-to-r from-amber-600/30 to-yellow-600/30 backdrop-blur-sm rounded-md md:rounded-lg px-2 md:px-3 py-1 md:py-1.5 border border-amber-500/20">
              <span className="text-[10px] md:text-sm text-white font-semibold">
                🔗 {plug.referralCount || 0}
              </span>
            </div>
            
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-amber-400 hover:text-amber-300 text-xs md:text-sm font-bold cursor-pointer"
            >
              <span className="hidden sm:inline">Voir plus →</span>
              <span className="sm:hidden">→</span>
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  MapPinIcon, 
  StarIcon, 
  InformationCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { 
  HomeIcon as HomeIconSolid, 
  MapPinIcon as MapPinIconSolid, 
  StarIcon as StarIconSolid, 
  InformationCircleIcon as InformationCircleIconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/react/24/solid'
import { useTelegram } from './TelegramProvider'

export default function BottomNav() {
  const pathname = usePathname()
  const { isTelegram } = useTelegram()
  
  // Ne pas afficher sur la page config
  if (pathname?.startsWith('/config')) {
    return null
  }

  const navItems = [
    {
      href: '/',
      label: 'Accueil',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
    },
    {
      href: '/map',
      label: 'Carte',
      icon: MapPinIcon,
      iconSolid: MapPinIconSolid,
    },
    {
      href: '/plugs',
      label: 'Top',
      icon: StarIcon,
      iconSolid: StarIconSolid,
    },
    {
      href: '/about',
      label: 'Infos',
      icon: InformationCircleIcon,
      iconSolid: InformationCircleIconSolid,
    },
    {
      href: '/profile',
      label: 'Profil',
      icon: UserIcon,
      iconSolid: UserIconSolid,
    },
  ]

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-t border-gray-700/50 shadow-2xl ${isTelegram ? 'pb-safe' : ''}`}>
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/plugs' && pathname?.startsWith('/plugs'))
            const Icon = isActive ? item.iconSolid : item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 min-w-[60px] ${
                  isActive
                    ? 'text-blue-400 bg-blue-500/20 scale-105'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'drop-shadow-lg' : ''}`} />
                <span className={`text-xs font-semibold ${isActive ? 'text-blue-400' : 'text-gray-400'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}


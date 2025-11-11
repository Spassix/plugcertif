'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import { useTelegram } from './TelegramProvider'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const { isTelegram } = useTelegram()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.querySelector('nav')
      if (nav && !nav.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  // Fermer le menu quand on change de page
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Navigation unifiée pour tous les appareils
  const navItems = [
    { href: '/', label: 'Accueil' },
    { href: '/plugs', label: 'Plugs' },
    { href: '/products', label: 'Produits' },
    { href: '/search', label: 'Rechercher' },
    { href: '/about', label: 'À propos' },
    { href: '/social', label: 'Réseaux' },
  ]

  // Classes adaptées pour Telegram
  const navHeight = isTelegram ? 'h-12' : 'h-14 sm:h-16'
  const logoSize = isTelegram ? 'text-base' : 'text-lg sm:text-xl'
  const navPadding = isTelegram ? 'px-3' : 'px-4 sm:px-6 lg:px-8'

  return (
    <nav className={`fixed top-0 w-full z-50 bg-black/95 backdrop-blur-xl border-b border-white/20 shadow-2xl ${isTelegram ? 'navbar' : ''}`}>
      <div className={`max-w-7xl mx-auto ${navPadding}`}>
        <div className={`flex items-center justify-between ${navHeight}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div
              className={`${logoSize} font-bold navbar-title ${
                isHomePage && !scrolled 
                  ? 'text-white/80 drop-shadow-xl' 
                  : 'text-white drop-shadow-xl'
              }`}
            >
              PLUGS CRTFS
            </div>
          </Link>

          {/* Desktop Navigation - caché sur Telegram pour plus d'espace */}
          {!isTelegram && (
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={`flex items-center gap-1 px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base font-medium transition-all ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Mobile menu button - toujours visible sur Telegram */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`${isTelegram ? '' : 'md:hidden'} p-2 rounded-lg text-white hover:bg-white/10`}
          >
            {isOpen ? (
              <XMarkIcon className={isTelegram ? "h-5 w-5" : "h-5 w-5 sm:h-6 sm:w-6"} />
            ) : (
              <Bars3Icon className={isTelegram ? "h-5 w-5" : "h-5 w-5 sm:h-6 sm:w-6"} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          className={`${isTelegram ? '' : 'md:hidden'} absolute top-full left-0 right-0 bg-black border-t border-white/10 shadow-2xl z-50`}
        >
            <div className={`${isTelegram ? 'px-3 py-2' : 'px-4 py-3'} space-y-1`}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 ${isTelegram ? 'px-3 py-2 text-sm' : 'px-4 py-3 text-base'} rounded-lg font-medium transition-all ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
    </nav>
  )
}
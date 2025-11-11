'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url)
    if (!res.ok) {
      // Si erreur, retourner des valeurs par défaut au lieu de throw
      console.warn('[BackgroundProvider] Failed to fetch:', res.status, '- Using defaults')
      return { backgroundImage: null, logoImage: null }
    }
    return res.json()
  } catch (error) {
    console.warn('[BackgroundProvider] Fetch error:', error, '- Using defaults')
    return { backgroundImage: null, logoImage: null }
  }
}

export default function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const { data: settings, error } = useSWR('/api/settings/background', fetcher, {
    refreshInterval: 30000, // Rafraîchir toutes les 30 secondes
    revalidateOnFocus: true,
    revalidateOnReconnect: true
  })
  
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (error) {
      console.error('[BackgroundProvider] Error loading background:', error)
    }
    
    if (mounted && settings?.backgroundImage) {
      console.log('[BackgroundProvider] Applying background image:', settings.backgroundImage)
      
      // Appliquer l'image de fond au body en mode mosaïque
      document.body.style.backgroundImage = `url(${settings.backgroundImage})`
      document.body.style.backgroundSize = '200px 200px' // Taille des tuiles
      document.body.style.backgroundPosition = '0 0'
      document.body.style.backgroundAttachment = 'fixed'
      document.body.style.backgroundRepeat = 'repeat' // Mode mosaïque
      document.body.style.backgroundColor = '#000000'
      document.body.style.minHeight = '100vh'
      
      // Ajouter un overlay sombre pour la lisibilité
      const existingOverlay = document.getElementById('bg-overlay')
      if (!existingOverlay) {
        const overlay = document.createElement('div')
        overlay.id = 'bg-overlay'
        overlay.style.position = 'fixed'
        overlay.style.top = '0'
        overlay.style.left = '0'
        overlay.style.right = '0'
        overlay.style.bottom = '0'
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)'
        overlay.style.zIndex = '-1'
        overlay.style.pointerEvents = 'none'
        document.body.appendChild(overlay)
      }
    } else if (mounted && !settings?.backgroundImage) {
      console.log('[BackgroundProvider] No background image, cleaning up')
      
      // Retirer le background si pas d'image
      document.body.style.backgroundImage = ''
      document.body.style.backgroundColor = ''
      document.body.style.minHeight = ''
      const overlay = document.getElementById('bg-overlay')
      if (overlay) {
        overlay.remove()
      }
    }

    return () => {
      // Cleanup
      document.body.style.backgroundImage = ''
      document.body.style.backgroundColor = ''
      document.body.style.minHeight = ''
      const overlay = document.getElementById('bg-overlay')
      if (overlay) {
        overlay.remove()
      }
    }
  }, [mounted, settings?.backgroundImage, error])

  return <>{children}</>
}
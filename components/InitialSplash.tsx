'use client'

import { useEffect, useState } from 'react'
import CbdSmokeLoader from './CbdSmokeLoader'

export default function InitialSplash() {
  const [showSplash, setShowSplash] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà visité
    const hasVisited = document.cookie
      .split('; ')
      .find(row => row.startsWith('hasVisited='))
      ?.split('=')[1]
    
    const forceSplash = document.cookie
      .split('; ')
      .find(row => row.startsWith('forceSplash='))
      ?.split('=')[1]

    // Afficher le splash si c'est la première visite ou si on force
    if (!hasVisited || forceSplash === 'true') {
      setShowSplash(true)
      
      // Marquer comme visité après 10 secondes pour laisser le temps de voir le GIF
      setTimeout(() => {
        document.cookie = 'hasVisited=true; path=/; max-age=86400'
        // Supprimer le cookie forceSplash s'il existe
        if (forceSplash) {
          document.cookie = 'forceSplash=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
      }, 10000)
    }
  }, [])

  if (!showSplash) return null

  return <CbdSmokeLoader />
}
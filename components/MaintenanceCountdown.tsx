'use client'

import { useEffect, useState } from 'react'

interface MaintenanceCountdownProps {
  endTime: Date
}

export default function MaintenanceCountdown({ endTime }: MaintenanceCountdownProps) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime()
      const end = new Date(endTime).getTime()
      const distance = end - now

      if (distance < 0) {
        setTimeLeft('Maintenance terminée')
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(`${days}j ${hours}h ${minutes}m ${seconds}s`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [endTime])

  return (
    <div className="mt-4 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
      <h4 className="text-sm font-semibold text-gray-300 mb-3 text-center">⏱️ Temps restant</h4>
      <p className="text-3xl font-mono font-bold text-white text-center drop-shadow-lg">{timeLeft}</p>
      <p className="text-xs text-gray-400 mt-3 text-center">
        Fin prévue : {new Date(endTime).toLocaleString('fr-FR')}
      </p>
    </div>
  )
}
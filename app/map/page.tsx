'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { MapPinIcon } from '@heroicons/react/24/outline'
import PlugModal from '@/components/PlugModal'
import dynamic from 'next/dynamic'

const fetcher = (url: string) => fetch(url).then(res => res.json())

// Charger LeafletMap dynamiquement pour éviter les erreurs SSR
const MapComponent = dynamic(() => import('@/components/LeafletMap'), { ssr: false })

export default function MapPage() {
  const { data: plugs, error, isLoading } = useSWR('/api/plugs', fetcher)
  const [selectedPlug, setSelectedPlug] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Compter les plugs avec localisation
  const plugsWithLocation = plugs?.filter((plug: any) => 
    plug.location?.latitude && plug.location?.longitude
  ) || []

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-24 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Erreur de chargement</h2>
          <p className="text-gray-400">Impossible de charger la carte</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-24">
      {/* Header */}
      <div className="px-4 py-6 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black mb-2 text-white drop-shadow-2xl">
            📍 Carte des <span className="gradient-text">Plugs</span>
          </h1>
          <p className="text-white/80 text-sm md:text-base">
            {plugsWithLocation.length} plug{plugsWithLocation.length > 1 ? 's' : ''} avec localisation
          </p>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[calc(100vh-200px)]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white/80">Chargement de la carte...</p>
            </div>
          </div>
        ) : plugsWithLocation.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm z-10">
            <div className="text-center bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 max-w-md mx-4">
              <MapPinIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Aucune localisation disponible</h3>
              <p className="text-gray-400 text-sm">
                Les plugs n'ont pas encore de coordonnées GPS configurées.
              </p>
            </div>
          </div>
        ) : (
          <MapComponent 
            plugs={plugs || []} 
            onMarkerClick={(plug: any) => {
              setSelectedPlug(plug)
              setIsModalOpen(true)
            }}
          />
        )}
      </div>

      {/* Liste des plugs avec localisation */}
      {plugsWithLocation.length > 0 && (
        <div className="px-4 py-6 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-t border-gray-700/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-4">Plugs sur la carte</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {plugsWithLocation.slice(0, 8).map((plug: any) => (
                <motion.button
                  key={plug._id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedPlug(plug)
                    setIsModalOpen(true)
                  }}
                  className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md border border-gray-700/50 rounded-xl p-3 text-left hover:border-blue-500/50 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {plug.photo && (
                      <img
                        src={plug.photo}
                        alt={plug.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                    )}
                    <h3 className="text-sm font-bold text-white truncate">{plug.name}</h3>
                  </div>
                  <p className="text-xs text-gray-400">
                    {plug.location?.department && `${plug.location.department} - `}
                    {plug.location?.postalCode}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <PlugModal
        plug={selectedPlug}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedPlug(null)
        }}
      />
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface SocialNetwork {
  id: string
  name: string
  emoji: string
  link: string
}

export default function SocialPage() {
  const [socialNetworks, setSocialNetworks] = useState<SocialNetwork[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSocialNetworks()
  }, [])

  const fetchSocialNetworks = async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      
      if (data.shopSocialNetworks) {
        setSocialNetworks(data.shopSocialNetworks)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réseaux sociaux:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = (network: SocialNetwork) => {
    // Ouvrir le lien dans un nouvel onglet
    window.open(network.link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Nos Réseaux Sociaux
          </h1>
          <p className="text-center text-gray-400 mb-12">
            Rejoignez-nous sur nos différentes plateformes
          </p>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : socialNetworks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun réseau social configuré pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {socialNetworks.map((network, index) => (
                <motion.div
                  key={network.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <button
                    onClick={() => handleClick(network)}
                    className="w-full p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 group"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                        {network.emoji}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {network.name}
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Cliquez pour nous rejoindre
                    </p>
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Bouton retour */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à l'accueil
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
'use client'

import { motion } from 'framer-motion'
import { ShieldCheckIcon, BoltIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
                          Pourquoi choisir <span className="gradient-text">PLUGS CRTFS</span> ?
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez ce qui fait de nous la référence en matière de marketplace certifiée
          </p>
        </motion.div>

        {/* Features Grid - 2 per row on all devices */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8 max-w-4xl mx-auto mb-20">
          {/* Vendeurs Certifiés */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm border-2 border-blue-600/30 rounded-3xl p-8 hover:border-blue-600/50 transition-all group"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheckIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Vendeurs Certifiés</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Tous nos vendeurs sont vérifiés et certifiés pour garantir la qualité et la sécurité
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-green-500">✓</span>
                <span>Vérification d'identité</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-green-500">✓</span>
                <span>Contrôle qualité régulier</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-green-500">✓</span>
                <span>Notation par les clients</span>
              </div>
            </div>
          </motion.div>

          {/* Livraison Rapide */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-sm border-2 border-green-600/30 rounded-3xl p-8 hover:border-green-600/50 transition-all group"
          >
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BoltIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Livraison Rapide</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Options de livraison, shipping et meetup disponibles selon vos besoins
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-2xl">🚚</span>
                <span>Livraison express</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-2xl">📦</span>
                <span>Envoi postal sécurisé</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-2xl">🤝</span>
                                          <span>Meetup en personne</span>
              </div>
            </div>
          </motion.div>

          {/* Communauté Active */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 backdrop-blur-sm border-2 border-pink-600/30 rounded-3xl p-8 hover:border-pink-600/50 transition-all group"
          >
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <SparklesIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Communauté Active</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Rejoignez une communauté dynamique avec système de parrainage et récompenses
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-2xl">🎁</span>
                <span>Récompenses fidélité</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-2xl">👥</span>
                <span>Programme de parrainage</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-2xl">🏆</span>
                <span>Classement des meilleurs</span>
              </div>
            </div>
          </motion.div>

          {/* Support Premium */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 backdrop-blur-sm border-2 border-amber-600/30 rounded-3xl p-8 hover:border-amber-600/50 transition-all group"
          >
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Support Premium</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Une équipe dédiée pour vous accompagner dans toutes vos transactions
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-2xl">💬</span>
                <span>Support 24/7</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-2xl">⚡</span>
                <span>Réponse rapide</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <span className="text-2xl">🔒</span>
                <span>Confidentialité garantie</span>
              </div>
            </div>
          </motion.div>
        </div>



        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Convaincu ? Rejoignez-nous maintenant !
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://t.me/PLGSCRTF_BOT"
              target="_blank"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <span className="text-2xl">🤖</span>
              Commencer sur Telegram
            </Link>
            <Link
              href="/plugs"
              className="inline-flex items-center gap-3 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all border-2 border-gray-700"
            >
              Découvrir les plugs
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
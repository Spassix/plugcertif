'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import { ArrowLeftIcon, ShoppingBagIcon, PlayIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useTelegram } from '@/components/TelegramProvider'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const { webApp, isTelegram } = useTelegram()
  
  const { data: product, error, isLoading } = useSWR(
    `/api/products/${params.id}`,
    fetcher
  )
  
  const { data: plug } = useSWR(
    product ? `/api/plugs/${product.plugId}` : null,
    fetcher
  )

  useEffect(() => {
    if (product) {
      // Increment views
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'view', productId: product._id })
      })
    }
  }, [product])

  const handleBuyClick = (plugId: string) => {
    const telegramUrl = `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}?start=plug_${plugId}`
    
    if (isTelegram && webApp) {
      // Dans Telegram, utiliser openLink pour ouvrir le lien
      webApp.openLink(telegramUrl)
      
      // Attendre un peu puis fermer la mini application
      setTimeout(() => {
        webApp.close()
      }, 1000)
    } else {
      // En dehors de Telegram, ouvrir dans un nouvel onglet
      window.open(telegramUrl, '_blank', 'noopener,noreferrer')
    }
  }



  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Produit introuvable</p>
          <button
            onClick={() => router.push('/products')}
            className="btn-secondary"
          >
            Retour aux produits
          </button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Produit introuvable</p>
          <button
            onClick={() => router.push('/products')}
            className="btn-secondary"
          >
            Retour aux produits
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Retour
        </motion.button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Media Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {product.videos && product.videos.length > 0 ? (
              <div>
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-4">
                  <video
                    src={product.videos[currentVideoIndex]?.url || product.videos[currentVideoIndex]}
                    controls
                    className="w-full h-full"
                    poster={product.videos[currentVideoIndex]?.thumbnail}
                    preload="metadata"
                    onError={(e) => {
                      console.error('Erreur de chargement vidéo:', e);
                      console.log('Structure vidéo:', product.videos[currentVideoIndex]);
                    }}
                    onLoadStart={() => {
                      console.log('Chargement vidéo démarré:', product.videos[currentVideoIndex]);
                    }}
                  >
                    Votre navigateur ne supporte pas la lecture de vidéos.
                  </video>
                </div>
                
                {/* Video Thumbnails */}
                {product.videos.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.videos.map((video: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentVideoIndex(index)}
                        className={`relative flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden ${
                          currentVideoIndex === index ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        <img
                          src={video?.thumbnail || video}
                          alt={`Video ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <PlayIcon className="w-8 h-8 text-white" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : product.images && product.images.length > 0 ? (
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full rounded-xl"
              />
            ) : (
              <div className="aspect-video bg-darker rounded-xl flex items-center justify-center">
                <PlayIcon className="w-16 h-16 text-gray-600" />
              </div>
            )}
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl font-black mb-4 bg-black/70 text-white px-4 py-3 rounded-lg backdrop-blur-sm inline-block">{product.name}</h1>

            {/* Description */}
            <div className="glass-card p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Description</h3>
              <p className="text-gray-400 whitespace-pre-wrap">{product.description}</p>
            </div>

            {/* Social Networks */}
            {product.socialNetworks && Object.keys(product.socialNetworks).some(k => product.socialNetworks[k]) && (
              <div className="glass-card p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">Réseaux du produit</h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(product.socialNetworks).map(([network, value]) => {
                    if (!value || typeof value !== 'string') return null;
                    const getSocialUrl = (network: string, value: string) => {
                      switch (network.toLowerCase()) {
                        case 'instagram':
                          return `https://instagram.com/${value}`;
                        case 'twitter':
                          return `https://twitter.com/${value}`;
                        case 'tiktok':
                          return `https://tiktok.com/@${value}`;
                        case 'snapchat':
                          return `https://snapchat.com/add/${value}`;
                        case 'telegram':
                          return `https://t.me/${value}`;
                        case 'whatsapp':
                          return `https://wa.me/${value}`;
                        default:
                          return `https://${network}.com/${value}`;
                      }
                    };
                    return (
                      <a
                        key={network}
                        href={getSocialUrl(network, value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors font-medium"
                      >
                        {network.charAt(0).toUpperCase() + network.slice(1)}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Shop Info & Buy Button */}
            {plug && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-4">Vendu par</h3>
                <div className="flex items-center gap-4 mb-6">
                  {plug.photo && (
                    <img
                      src={plug.photo}
                      alt={plug.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  )}
                  <div>
                    <h4 className="font-bold text-xl">{plug.name}</h4>
                    <p className="text-gray-400">
                      {plug.location?.department} • {plug.likes} likes
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleBuyClick(plug._id)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <ShoppingBagIcon className="w-5 h-5" />
                  Acheter chez {plug.name}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
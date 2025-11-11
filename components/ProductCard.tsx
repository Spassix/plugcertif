'use client'

import { motion } from 'framer-motion'
import { PlayIcon, ShoppingCartIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import Image from 'next/image'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  images?: string[]
  videos?: Array<{ thumbnail?: string }>
}

interface ProductCardProps {
  product: Product
  onClick: () => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)

  if (!product || !product._id) {
    return null
  }

  const handleClick = () => {
    try {
      onClick()
    } catch (error) {
      console.error('Error in ProductCard onClick:', error)
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="glass-card overflow-hidden cursor-pointer hover:border-primary/50 transition-all"
      onClick={handleClick}
    >
      {/* Video/Image Preview */}
      <div className="relative h-48 md:h-64 bg-darker rounded-t-xl overflow-hidden">
        {product.videos && product.videos.length > 0 && product.videos[0]?.thumbnail ? (
          <>
            <Image
              src={product.videos[0].thumbnail}
              alt={product.name || 'Video thumbnail'}
              width={400}
              height={256}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <PlayIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              VIDÉO
            </div>
          </>
        ) : product.images && product.images.length > 0 && !imageError ? (
          <Image
            src={product.images[0]}
            alt={product.name || 'Product image'}
            width={400}
            height={256}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-darker">
            <ShoppingCartIcon className="w-12 h-12 text-gray-600" />
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-primary px-3 py-1 rounded-full">
          <span className="font-bold text-black">
            {typeof product.price === 'number' ? product.price : '0'}€
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-2 bg-black/70 text-white px-3 py-2 rounded-lg backdrop-blur-sm">{product.name || 'Produit sans nom'}</h3>
        <p className="text-gray-400 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">
          {product.description || 'Aucune description disponible'}
        </p>

        {/* Category */}
        <div className="mt-3 md:mt-4">
          <span className="inline-block px-2 py-1 bg-primary/20 text-primary rounded-full text-xs">
            {product.category || 'Non catégorisé'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
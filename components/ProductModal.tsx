import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import MultiImageUpload from './MultiImageUpload'
import MultiVideoUpload from './MultiVideoUpload'
import toast from 'react-hot-toast'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product?: any
  onSuccess: () => void
}

export default function ProductModal({ isOpen, onClose, product, onSuccess }: ProductModalProps) {
  const [plugs, setPlugs] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'electronics',
    plugId: '',
    images: [] as string[],
    videos: [] as Array<{url: string, thumbnail: string}>,
    inStock: true,
    featured: false,
    socialNetworks: {} as Record<string, string>
  })
  const [newSocialKey, setNewSocialKey] = useState('')
  const [newSocialValue, setNewSocialValue] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Charger les plugs
    fetch('/api/plugs?all=true')
      .then(res => res.json())
      .then(data => setPlugs(data || []))
      .catch(err => console.error('Erreur chargement plugs:', err))
      
    // Charger les catégories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        console.log('Catégories chargées dans ProductModal:', data)
        setCategories(data || [])
      })
      .catch(err => console.error('Erreur chargement catégories:', err))
  }, [isOpen]) // Recharger à chaque ouverture du modal

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || 'electronics',
        plugId: product.plugId || '',
        images: product.images || [],
        videos: product.videos || [],
        inStock: product.inStock !== undefined ? product.inStock : true,
        featured: product.featured || false,
        socialNetworks: product.socialNetworks || {}
      })
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'electronics',
        plugId: '',
        images: [],
        videos: [],
        inStock: true,
        featured: false,
        socialNetworks: {}
      })
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || !formData.category) {
      toast.error('Veuillez remplir tous les champs obligatoires, y compris la catégorie')
      return
    }

    setLoading(true)
    try {
      const url = product ? `/api/products/${product._id}` : '/api/products'
      const method = product ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(product ? 'Produit modifié avec succès' : 'Produit créé avec succès')
        onSuccess()
        onClose()
      } else {
        throw new Error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde du produit')
    } finally {
      setLoading(false)
    }
  }

  const addSocialNetwork = () => {
    if (newSocialKey && newSocialValue) {
      setFormData({
        ...formData,
        socialNetworks: {
          ...formData.socialNetworks,
          [newSocialKey]: newSocialValue
        }
      })
      setNewSocialKey('')
      setNewSocialValue('')
    }
  }

  const removeSocialNetwork = (key: string) => {
    const newSocials = { ...formData.socialNetworks }
    delete newSocials[key]
    setFormData({ ...formData, socialNetworks: newSocials })
  }

  const handleVideosChange = (videos: Array<{url: string, thumbnail: string}>) => {
    setFormData({
      ...formData,
      videos
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {product ? 'Modifier le produit' : 'Ajouter un produit'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nom du produit *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary focus:outline-none"
              rows={4}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Catégorie
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary focus:outline-none"
            >
              <option value="">Sélectionner une catégorie ({categories.length} disponibles)</option>
              {categories.map((category: any) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Vous pouvez gérer les catégories dans la section "Catégories" du panel admin
            </p>
            {categories.length === 0 && (
              <p className="text-xs text-yellow-500 mt-1">
                ⚠️ Aucune catégorie trouvée. Créez d'abord des catégories dans la section "Catégories".
              </p>
            )}
          </div>

          {/* Plug associé (pour les badges) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Plug associé (pour recevoir des badges)
            </label>
            <select
              value={formData.plugId}
              onChange={(e) => setFormData({ ...formData, plugId: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary focus:outline-none"
            >
              <option value="">Aucun plug associé</option>
              {plugs.map((plug: any) => (
                <option key={plug._id} value={plug._id}>
                  {plug.name} (@{plug.username})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Si associé, ce produit pourra recevoir des badges via le bot Telegram
            </p>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Images du produit
            </label>
            <MultiImageUpload
              images={formData.images}
              onImagesChange={(images) => setFormData({ ...formData, images })}
              maxImages={5}
            />
          </div>

          {/* Videos */}
          <div>
            <MultiVideoUpload
              videos={formData.videos}
              onVideosChange={handleVideosChange}
              maxVideos={3}
              label="Vidéos du produit"
            />
          </div>

          {/* Social Networks */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Réseaux sociaux
            </label>
            <div className="space-y-2 mb-4">
              {Object.entries(formData.socialNetworks).map(([network, value]) => (
                <div key={network} className="flex items-center gap-2">
                  <span className="flex-1 px-3 py-2 bg-gray-800 rounded-lg text-white">
                    {network}: {value}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSocialNetwork(network)}
                    className="px-3 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Réseau (ex: instagram, twitter)"
                value={newSocialKey}
                onChange={(e) => setNewSocialKey(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={newSocialValue}
                onChange={(e) => setNewSocialValue(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
              <button
                type="button"
                onClick={addSocialNetwork}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Stock and Featured */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-4 h-4 text-primary"
              />
              <span className="text-white">En stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-primary"
              />
              <span className="text-white">Produit vedette</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-6 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : (product ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
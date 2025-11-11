import { redisHelpers } from '../redis'

const PRODUCT_PREFIX = 'product:'
const PRODUCT_INDEX = 'products:index'
const PRODUCT_CATEGORY_INDEX = 'products:category:'
const PRODUCT_FEATURED_INDEX = 'products:featured:index'

export interface Product {
  _id?: string
  name: string
  description?: string
  price: number
  category?: string
  images?: string[]
  inStock?: boolean
  featured?: boolean
  specifications?: { [key: string]: any }
  plugId?: string
  createdAt?: Date
  updatedAt?: Date
}

// Générer un ID unique
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

// Obtenir la clé Redis pour un produit
function getKey(id: string): string {
  return `${PRODUCT_PREFIX}${id}`
}

export const ProductModel = {
  // Créer un nouveau produit
  async create(data: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const id = generateId()
    const now = new Date()
    
    const product: Product = {
      ...data,
      _id: id,
      price: data.price || 0,
      inStock: data.inStock !== undefined ? data.inStock : true,
      featured: data.featured || false,
      images: data.images || [],
      createdAt: now,
      updatedAt: now,
    }

    await redisHelpers.set(getKey(id), JSON.stringify(product))
    await redisHelpers.sadd(PRODUCT_INDEX, id)
    
    if (product.category) {
      await redisHelpers.sadd(`${PRODUCT_CATEGORY_INDEX}${product.category}`, id)
    }
    
    if (product.featured) {
      await redisHelpers.sadd(PRODUCT_FEATURED_INDEX, id)
    }

    return product
  },

  // Trouver un produit par ID
  async findById(id: string): Promise<Product | null> {
    const data = await redisHelpers.get<string>(getKey(id))
    if (!data) return null
    return JSON.parse(data)
  },

  // Trouver tous les produits
  async find(filter: { category?: string; featured?: boolean } = {}): Promise<Product[]> {
    try {
      let ids: string[] = []
      
      if (filter.featured) {
        ids = await redisHelpers.smembers(PRODUCT_FEATURED_INDEX)
      } else if (filter.category) {
        ids = await redisHelpers.smembers(`${PRODUCT_CATEGORY_INDEX}${filter.category}`)
      } else {
        ids = await redisHelpers.smembers(PRODUCT_INDEX)
      }
      
      if (!Array.isArray(ids) || ids.length === 0) return []

      const keys = ids.map(id => getKey(id))
      const data = await redisHelpers.mget<string>(keys)
      
      if (!Array.isArray(data)) return []
      
      const products = data
        .filter((d): d is string => d !== null && typeof d === 'string')
        .map(d => {
          try {
            return JSON.parse(d)
          } catch (e) {
            console.error('Error parsing product data:', e)
            return null
          }
        })
        .filter((product): product is Product => product !== null)
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA // Plus récent en premier
        })

      // Filtrer par catégorie si nécessaire (déjà fait via l'index, mais double vérification)
      if (filter.category) {
        return products.filter(p => p.category === filter.category)
      }

      return products
    } catch (error) {
      console.error('ProductModel.find error:', error)
      return []
    }
  },

  // Mettre à jour un produit
  async findByIdAndUpdate(id: string, data: Partial<Product>): Promise<Product | null> {
    const existing = await this.findById(id)
    if (!existing) return null

    const updated: Product = {
      ...existing,
      ...data,
      _id: id,
      updatedAt: new Date(),
    }

    await redisHelpers.set(getKey(id), JSON.stringify(updated))

    // Mettre à jour les index
    if (data.category && data.category !== existing.category) {
      if (existing.category) {
        await redisHelpers.srem(`${PRODUCT_CATEGORY_INDEX}${existing.category}`, id)
      }
      await redisHelpers.sadd(`${PRODUCT_CATEGORY_INDEX}${data.category}`, id)
    }

    if (data.featured !== undefined && data.featured !== existing.featured) {
      if (data.featured) {
        await redisHelpers.sadd(PRODUCT_FEATURED_INDEX, id)
      } else {
        await redisHelpers.srem(PRODUCT_FEATURED_INDEX, id)
      }
    }

    return updated
  },

  // Supprimer un produit
  async findByIdAndDelete(id: string): Promise<Product | null> {
    const product = await this.findById(id)
    if (!product) return null

    await redisHelpers.del(getKey(id))
    await redisHelpers.srem(PRODUCT_INDEX, id)
    
    if (product.category) {
      await redisHelpers.srem(`${PRODUCT_CATEGORY_INDEX}${product.category}`, id)
    }
    
    if (product.featured) {
      await redisHelpers.srem(PRODUCT_FEATURED_INDEX, id)
    }

    return product
  },
}


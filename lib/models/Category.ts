import { redisHelpers } from '../redis'

const CATEGORY_PREFIX = 'category:'
const CATEGORY_INDEX = 'categories:index'

export interface Category {
  _id?: string
  name: string
  description?: string
  createdAt?: Date
}

// Générer un ID unique
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

// Obtenir la clé Redis pour une catégorie
function getKey(id: string): string {
  return `${CATEGORY_PREFIX}${id}`
}

// Obtenir la clé par nom (pour les recherches)
function getNameKey(name: string): string {
  return `category:name:${name.toLowerCase()}`
}

export const CategoryModel = {
  // Créer une nouvelle catégorie
  async create(data: Omit<Category, '_id' | 'createdAt'>): Promise<Category> {
    const id = generateId()
    const now = new Date()
    
    const category: Category = {
      ...data,
      _id: id,
      name: data.name.trim(),
      createdAt: now,
    }

    await redisHelpers.set(getKey(id), JSON.stringify(category))
    await redisHelpers.set(getNameKey(category.name), id) // Index par nom
    await redisHelpers.sadd(CATEGORY_INDEX, id)

    return category
  },

  // Trouver une catégorie par ID
  async findById(id: string): Promise<Category | null> {
    const data = await redisHelpers.get<string>(getKey(id))
    if (!data) return null
    return JSON.parse(data)
  },

  // Trouver une catégorie par nom
  async findOne(filter: { name?: string }): Promise<Category | null> {
    if (filter.name) {
      const nameKey = getNameKey(filter.name)
      const id = await redisHelpers.get<string>(nameKey)
      if (!id) return null
      return this.findById(id)
    }
    return null
  },

  // Trouver toutes les catégories
  async find(): Promise<Category[]> {
    try {
      const ids = await redisHelpers.smembers(CATEGORY_INDEX)
      
      if (!Array.isArray(ids) || ids.length === 0) return []

      const keys = ids.map(id => getKey(id))
      const data = await redisHelpers.mget<string>(keys)
      
      if (!Array.isArray(data)) return []
      
      return data
        .filter((d): d is string => d !== null && typeof d === 'string')
        .map(d => {
          try {
            return JSON.parse(d)
          } catch (e) {
            console.error('Error parsing category data:', e)
            return null
          }
        })
        .filter((category): category is Category => category !== null)
        .sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
      console.error('CategoryModel.find error:', error)
      return []
    }
  },

  // Mettre à jour une catégorie
  async findByIdAndUpdate(id: string, data: Partial<Category>): Promise<Category | null> {
    const existing = await this.findById(id)
    if (!existing) return null

    const updated: Category = {
      ...existing,
      ...data,
      _id: id,
    }

    // Si le nom change, mettre à jour l'index
    if (data.name && data.name !== existing.name) {
      await redisHelpers.del(getNameKey(existing.name))
      await redisHelpers.set(getNameKey(data.name.trim()), id)
      updated.name = data.name.trim()
    }

    await redisHelpers.set(getKey(id), JSON.stringify(updated))

    return updated
  },

  // Supprimer une catégorie
  async findByIdAndDelete(id: string): Promise<Category | null> {
    const category = await this.findById(id)
    if (!category) return null

    await redisHelpers.del(getKey(id))
    await redisHelpers.del(getNameKey(category.name))
    await redisHelpers.srem(CATEGORY_INDEX, id)

    return category
  },
}


import { redisHelpers } from '../redis'

const PLUG_PREFIX = 'plug:'
const PLUG_INDEX = 'plugs:index'
const PLUG_ACTIVE_INDEX = 'plugs:active:index'

export interface Plug {
  _id?: string
  name: string
  photo?: string
  description?: string
  methods?: {
    delivery: boolean
    shipping: boolean
    meetup: boolean
  }
  deliveryDepartments?: string[]
  deliveryPostalCodes?: string[]
  meetupDepartments?: string[]
  meetupPostalCodes?: string[]
  socialNetworks?: any
  customNetworks?: any[]
  location?: {
    country: string
    department: string
    postalCode: string
    latitude?: number
    longitude?: number
  }
  countries?: string[]
  shippingCountries?: string[]
  country?: string
  countryFlag?: string
  department?: string
  postalCode?: string
  likes?: number
  referralCount?: number
  referralLink?: string
  isActive?: boolean
  isExample?: boolean
  createdAt?: Date
  updatedAt?: Date
}

// Générer un ID unique
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

// Obtenir la clé Redis pour un plug
function getKey(id: string): string {
  return `${PLUG_PREFIX}${id}`
}

export const PlugModel = {
  // Créer un nouveau plug
  async create(data: Omit<Plug, '_id' | 'createdAt' | 'updatedAt'>): Promise<Plug> {
    const id = generateId()
    const now = new Date()
    
    const plug: Plug = {
      ...data,
      _id: id,
      likes: data.likes || 0,
      referralCount: data.referralCount || 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: now,
      updatedAt: now,
    }

    await redisHelpers.set(getKey(id), JSON.stringify(plug))
    await redisHelpers.sadd(PLUG_INDEX, id)
    
    if (plug.isActive) {
      await redisHelpers.sadd(PLUG_ACTIVE_INDEX, id)
    }

    return plug
  },

  // Trouver un plug par ID
  async findById(id: string): Promise<Plug | null> {
    const data = await redisHelpers.get<string>(getKey(id))
    if (!data) return null
    return JSON.parse(data)
  },

  // Trouver tous les plugs
  async find(filter: { isActive?: boolean; all?: boolean } = {}): Promise<Plug[]> {
    try {
      const index = filter.all ? PLUG_INDEX : PLUG_ACTIVE_INDEX
      const ids = await redisHelpers.smembers(index)
      
      // S'assurer que ids est un tableau
      if (!Array.isArray(ids) || ids.length === 0) return []

      const keys = ids.map(id => getKey(id))
      const data = await redisHelpers.mget<string>(keys)
      
      // S'assurer que data est un tableau
      if (!Array.isArray(data)) return []
      
      return data
        .filter((d): d is string => d !== null && typeof d === 'string')
        .map(d => {
          try {
            return JSON.parse(d)
          } catch (e) {
            console.error('Error parsing plug data:', e)
            return null
          }
        })
        .filter((plug): plug is Plug => plug !== null)
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    } catch (error) {
      console.error('PlugModel.find error:', error)
      return []
    }
  },

  // Mettre à jour un plug
  async update(id: string, data: Partial<Plug>): Promise<Plug | null> {
    const existing = await this.findById(id)
    if (!existing) return null

    const updated: Plug = {
      ...existing,
      ...data,
      _id: id,
      updatedAt: new Date(),
    }

    await redisHelpers.set(getKey(id), JSON.stringify(updated))

    // Mettre à jour les index si isActive a changé
    if (data.isActive !== undefined && data.isActive !== existing.isActive) {
      if (data.isActive) {
        await redisHelpers.sadd(PLUG_ACTIVE_INDEX, id)
      } else {
        await redisHelpers.del(PLUG_ACTIVE_INDEX)
        const activeIds = await redisHelpers.smembers(PLUG_ACTIVE_INDEX)
        const filtered = activeIds.filter(activeId => activeId !== id)
        await redisHelpers.del(PLUG_ACTIVE_INDEX)
        if (filtered.length > 0) {
          await redisHelpers.sadd(PLUG_ACTIVE_INDEX, ...filtered)
        }
      }
    }

    return updated
  },

  // Supprimer un plug
  async delete(id: string): Promise<boolean> {
    const exists = await this.findById(id)
    if (!exists) return false

    await redisHelpers.del(getKey(id))
    await redisHelpers.del(PLUG_INDEX)
    const allIds = await redisHelpers.smembers(PLUG_INDEX)
    const filtered = allIds.filter(plugId => plugId !== id)
    await redisHelpers.del(PLUG_INDEX)
    if (filtered.length > 0) {
      await redisHelpers.sadd(PLUG_INDEX, ...filtered)
    }

    return true
  },

  // Trouver et supprimer un plug (alias pour compatibilité)
  async findByIdAndDelete(id: string): Promise<Plug | null> {
    const plug = await this.findById(id)
    if (!plug) return null
    await this.delete(id)
    return plug
  },

  // Trouver et mettre à jour un plug (alias pour compatibilité)
  async findByIdAndUpdate(id: string, data: Partial<Plug>): Promise<Plug | null> {
    return this.update(id, data)
  },

  // Incrémenter les likes
  async incrementLikes(id: string, amount: number = 1): Promise<number> {
    const plug = await this.findById(id)
    if (!plug) throw new Error('Plug not found')

    const newLikes = (plug.likes || 0) + amount
    await this.update(id, { likes: newLikes })
    return newLikes
  },
}


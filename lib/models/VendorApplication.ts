import { redisHelpers } from '../redis'

const VENDOR_APP_PREFIX = 'vendorapp:'
const VENDOR_APP_INDEX = 'vendorapps:index'
const VENDOR_APP_PENDING_INDEX = 'vendorapps:pending:index'

export interface VendorApplication {
  _id: string
  userId?: string
  telegramId: string | number
  username?: string
  socialNetworks?: {
    primary?: string[]
    links?: { [key: string]: string }
    others?: string
  }
  methods?: {
    delivery?: boolean
    shipping?: boolean
    meetup?: boolean
  }
  deliveryZones?: string
  shippingZones?: string
  meetupZones?: string
  country?: string
  department?: string
  postalCode?: string
  photo?: string
  shopPhoto?: string
  description?: string
  location?: {
    country?: string
    department?: string
    postalCode?: string
  }
  status?: 'pending' | 'approved' | 'rejected'
  createdAt?: Date
  submittedAt?: Date
  reviewedAt?: Date
  reviewedBy?: string
}

// Générer un ID unique
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

// Obtenir la clé Redis pour une application
function getKey(id: string): string {
  return `${VENDOR_APP_PREFIX}${id}`
}

export const VendorApplicationModel = {
  // Créer une nouvelle application
  async create(data: Omit<VendorApplication, '_id' | 'createdAt' | 'submittedAt'>): Promise<VendorApplication> {
    const id = generateId()
    const now = new Date()
    
    const application: VendorApplication = {
      ...data,
      _id: id,
      status: data.status || 'pending',
      createdAt: now,
      submittedAt: now,
    }

    await redisHelpers.set(getKey(id), JSON.stringify(application))
    await redisHelpers.sadd(VENDOR_APP_INDEX, id)
    
    if (application.status === 'pending') {
      await redisHelpers.sadd(VENDOR_APP_PENDING_INDEX, id)
    }

    return application
  },

  // Trouver une application par ID
  async findById(id: string): Promise<VendorApplication | null> {
    const data = await redisHelpers.get<string>(getKey(id))
    if (!data) return null
    return JSON.parse(data)
  },

  // Trouver toutes les applications
  async find(filter: { status?: string } = {}): Promise<VendorApplication[]> {
    try {
      const index = filter.status === 'pending' 
        ? VENDOR_APP_PENDING_INDEX 
        : VENDOR_APP_INDEX
      
      const ids = await redisHelpers.smembers(index)
      
      if (!Array.isArray(ids) || ids.length === 0) return []

      const keys = ids.map(id => getKey(id))
      const data = await redisHelpers.mget<string>(keys)
      
      if (!Array.isArray(data)) return []
      
      const applications = data
        .filter((d): d is string => d !== null && typeof d === 'string')
        .map(d => {
          try {
            return JSON.parse(d)
          } catch (e) {
            console.error('Error parsing vendor application data:', e)
            return null
          }
        })
        .filter((app): app is VendorApplication => app !== null)
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA // Plus récent en premier
        })

      // Filtrer par statut si nécessaire
      if (filter.status && filter.status !== 'pending') {
        return applications.filter(app => app.status === filter.status)
      }

      return applications
    } catch (error) {
      console.error('VendorApplicationModel.find error:', error)
      return []
    }
  },

  // Mettre à jour une application
  async findByIdAndUpdate(
    id: string, 
    data: Partial<VendorApplication>,
    options?: { new?: boolean }
  ): Promise<VendorApplication | null> {
    const existing = await this.findById(id)
    if (!existing) return null

    const updated: VendorApplication = {
      ...existing,
      ...data,
      _id: id,
      reviewedAt: data.status && data.status !== 'pending' ? new Date() : existing.reviewedAt,
    }

    await redisHelpers.set(getKey(id), JSON.stringify(updated))

    // Mettre à jour les index selon le statut
    if (updated.status === 'pending') {
      await redisHelpers.sadd(VENDOR_APP_PENDING_INDEX, id)
    } else {
      await redisHelpers.srem(VENDOR_APP_PENDING_INDEX, id)
    }

    return updated
  },

  // Supprimer une application
  async findByIdAndDelete(id: string): Promise<VendorApplication | null> {
    const application = await this.findById(id)
    if (!application) return null

    await redisHelpers.del(getKey(id))
    await redisHelpers.srem(VENDOR_APP_INDEX, id)
    await redisHelpers.srem(VENDOR_APP_PENDING_INDEX, id)

    return application
  },
}


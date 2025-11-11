import { redisHelpers } from '../redis'

const USER_PREFIX = 'user:'
const USER_BY_TELEGRAM_ID = 'user:telegram:'
const USER_INDEX = 'users:index'

export interface User {
  _id?: string
  telegramId: string
  username?: string
  firstName?: string
  lastName?: string
  photoUrl?: string
  languageCode?: string
  isPremium?: boolean
  joinedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

function getKey(id: string): string {
  return `${USER_PREFIX}${id}`
}

function getTelegramKey(telegramId: string): string {
  return `${USER_BY_TELEGRAM_ID}${telegramId}`
}

export const UserModel = {
  // Créer un utilisateur
  async create(data: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = generateId()
    const now = new Date()
    
    const user: User = {
      ...data,
      _id: id,
      joinedAt: data.joinedAt || now,
      createdAt: now,
      updatedAt: now,
    }

    await redisHelpers.set(getKey(id), JSON.stringify(user))
    await redisHelpers.set(getTelegramKey(data.telegramId), id)
    await redisHelpers.sadd(USER_INDEX, id)

    return user
  },

  // Trouver par ID
  async findById(id: string): Promise<User | null> {
    const data = await redisHelpers.get<string>(getKey(id))
    if (!data) return null
    return JSON.parse(data)
  },

  // Trouver par Telegram ID
  async findByTelegramId(telegramId: string): Promise<User | null> {
    const userId = await redisHelpers.get<string>(getTelegramKey(telegramId))
    if (!userId) return null
    return this.findById(userId)
  },

  // Trouver ou créer par Telegram ID
  async findOneAndUpdate(filter: { telegramId: string }, data: Partial<User>): Promise<User> {
    let user = await this.findByTelegramId(filter.telegramId)
    
    if (!user) {
      user = await this.create({
        telegramId: filter.telegramId,
        ...data,
      } as any)
    } else {
      user = await this.update(user._id!, data)
    }

    return user!
  },

  // Trouver tous les utilisateurs
  async find(): Promise<User[]> {
    const ids = await redisHelpers.smembers(USER_INDEX)
    if (ids.length === 0) return []

    const keys = ids.map(id => getKey(id))
    const data = await redisHelpers.mget<string>(keys)
    
    return data
      .filter((d): d is string => d !== null)
      .map(d => JSON.parse(d))
      .sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bDate - aDate
      })
  },

  // Mettre à jour un utilisateur
  async update(id: string, data: Partial<User>): Promise<User | null> {
    const existing = await this.findById(id)
    if (!existing) return null

    const updated: User = {
      ...existing,
      ...data,
      _id: id,
      updatedAt: new Date(),
    }

    await redisHelpers.set(getKey(id), JSON.stringify(updated))
    return updated
  },

  // Supprimer un utilisateur
  async delete(id: string): Promise<boolean> {
    const user = await this.findById(id)
    if (!user) return false

    await redisHelpers.del(getKey(id))
    await redisHelpers.del(getTelegramKey(user.telegramId))
    await redisHelpers.del(USER_INDEX)
    const allIds = await redisHelpers.smembers(USER_INDEX)
    const filtered = allIds.filter(userId => userId !== id)
    await redisHelpers.del(USER_INDEX)
    if (filtered.length > 0) {
      await redisHelpers.sadd(USER_INDEX, ...filtered)
    }

    return true
  },
}


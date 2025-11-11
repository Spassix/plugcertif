import { Redis } from '@upstash/redis'

// Initialiser Redis avec les variables d'environnement Upstash
// Supporte à la fois UPSTASH_KV_* (KV) et UPSTASH_REDIS_* (Redis standard)
const redis = new Redis({
  url: process.env.UPSTASH_KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

// Vérifier la connexion
export async function connectToRedis() {
  try {
    const url = process.env.UPSTASH_KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
    
    if (!url || !token) {
      throw new Error('UPSTASH_KV_REST_API_URL and UPSTASH_KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN) must be set')
    }
    // Test de connexion
    await redis.ping()
    return redis
  } catch (error) {
    console.error('Redis connection error:', error)
    throw error
  }
}

// Helper functions pour les opérations courantes
export const redisHelpers = {
  // Obtenir une valeur
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key)
      return value as T | null
    } catch (error) {
      console.error(`Redis GET error for key ${key}:`, error)
      return null
    }
  },

  // Définir une valeur
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await redis.set(key, value, { ex: ttl })
      } else {
        await redis.set(key, value)
      }
    } catch (error) {
      console.error(`Redis SET error for key ${key}:`, error)
      throw error
    }
  },

  // Supprimer une clé
  async del(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
      console.error(`Redis DEL error for key ${key}:`, error)
      throw error
    }
  },

  // Obtenir toutes les clés correspondant à un pattern
  async keys(pattern: string): Promise<string[]> {
    try {
      return await redis.keys(pattern)
    } catch (error) {
      console.error(`Redis KEYS error for pattern ${pattern}:`, error)
      return []
    }
  },

  // Obtenir plusieurs valeurs
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      if (keys.length === 0) return []
      const values = await redis.mget(...keys)
      // S'assurer de toujours retourner un tableau
      return Array.isArray(values) ? (values as (T | null)[]) : []
    } catch (error) {
      console.error(`Redis MGET error:`, error)
      return []
    }
  },

  // Définir plusieurs valeurs
  async mset(keyValues: Record<string, any>): Promise<void> {
    try {
      const entries = Object.entries(keyValues).flat()
      await redis.mset(...entries)
    } catch (error) {
      console.error(`Redis MSET error:`, error)
      throw error
    }
  },

  // Incrémenter une valeur
  async incr(key: string, by: number = 1): Promise<number> {
    try {
      return await redis.incrby(key, by)
    } catch (error) {
      console.error(`Redis INCR error for key ${key}:`, error)
      throw error
    }
  },

  // Ajouter à une liste
  async lpush(key: string, ...values: any[]): Promise<number> {
    try {
      return await redis.lpush(key, ...values)
    } catch (error) {
      console.error(`Redis LPUSH error for key ${key}:`, error)
      throw error
    }
  },

  // Obtenir une liste
  async lrange(key: string, start: number = 0, stop: number = -1): Promise<any[]> {
    try {
      return await redis.lrange(key, start, stop)
    } catch (error) {
      console.error(`Redis LRANGE error for key ${key}:`, error)
      return []
    }
  },

  // Ajouter à un set
  async sadd(key: string, ...members: any[]): Promise<number> {
    try {
      return await redis.sadd(key, ...members)
    } catch (error) {
      console.error(`Redis SADD error for key ${key}:`, error)
      throw error
    }
  },

  // Obtenir tous les membres d'un set
  async smembers(key: string): Promise<any[]> {
    try {
      const result = await redis.smembers(key)
      // S'assurer de toujours retourner un tableau
      return Array.isArray(result) ? result : []
    } catch (error) {
      console.error(`Redis SMEMBERS error for key ${key}:`, error)
      return []
    }
  },
}

export default redis


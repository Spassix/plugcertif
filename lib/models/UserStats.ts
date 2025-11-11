import { redisHelpers } from '../redis'

const USER_STATS_PREFIX = 'userstats:'

export interface UserStats {
  userId: string
  points?: number
  level?: number
  battlesWon?: number
  battlesLost?: number
  updatedAt?: Date
}

function getKey(userId: string): string {
  return `${USER_STATS_PREFIX}${userId}`
}

export const UserStatsModel = {
  async findOne(filter: { userId: string }): Promise<UserStats | null> {
    const data = await redisHelpers.get<string>(getKey(filter.userId))
    if (!data) return null
    return JSON.parse(data)
  },

  async findOneAndUpdate(filter: { userId: string }, data: Partial<UserStats>): Promise<UserStats> {
    const existing = await this.findOne(filter)
    
    const stats: UserStats = {
      userId: filter.userId,
      points: data.points ?? existing?.points ?? 0,
      level: data.level ?? existing?.level ?? 1,
      battlesWon: data.battlesWon ?? existing?.battlesWon ?? 0,
      battlesLost: data.battlesLost ?? existing?.battlesLost ?? 0,
      updatedAt: new Date(),
    }

    await redisHelpers.set(getKey(filter.userId), JSON.stringify(stats))
    return stats
  },

  async incrementPoints(userId: string, amount: number): Promise<number> {
    const stats = await this.findOneAndUpdate({ userId }, {})
    const newPoints = (stats.points || 0) + amount
    await this.findOneAndUpdate({ userId }, { points: newPoints })
    return newPoints
  },

  async incrementLevel(userId: string, amount: number = 1): Promise<number> {
    const stats = await this.findOneAndUpdate({ userId }, {})
    const newLevel = (stats.level || 1) + amount
    await this.findOneAndUpdate({ userId }, { level: newLevel })
    return newLevel
  },
}


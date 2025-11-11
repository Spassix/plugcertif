import { NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { PlugModel } from '@/lib/models/Plug'
import { UserModel } from '@/lib/models/User'
import { UserStatsModel } from '@/lib/models/UserStats'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    await connectToRedis()
    
    const plugs = await PlugModel.find({ all: true })
    const users = await UserModel.find()
    
    // Calculer les stats
    const totalPlugs = plugs.length
    const activePlugs = plugs.filter(p => p.isActive).length
    const totalLikes = plugs.reduce((sum, p) => sum + (p.likes || 0), 0)
    const totalUsers = users.length
    
    // Calculer les stats des utilisateurs avec points
    let totalPoints = 0
    for (const user of users) {
      const stats = await UserStatsModel.findOne({ userId: user.telegramId })
      totalPoints += stats?.points || 0
    }
    
    return NextResponse.json({
      totalPlugs,
      activePlugs,
      totalLikes,
      totalUsers,
      totalPoints,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

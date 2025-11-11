import { NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { UserModel } from '@/lib/models/User'
import { UserStatsModel } from '@/lib/models/UserStats'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    await connectToRedis()
    
    // Récupérer tous les utilisateurs
    const users = await UserModel.find()
    
    // Récupérer les stats pour tous les utilisateurs
    const usersWithPoints = await Promise.all(
      users.map(async (user) => {
        const stats = await UserStatsModel.findOne({ userId: user.telegramId })
        return {
          _id: user._id,
          username: user.username,
          firstName: user.firstName,
          telegramId: user.telegramId,
          createdAt: user.createdAt,
          points: stats?.points || 0
        }
      })
    )
    
    return NextResponse.json(usersWithPoints)
    
  } catch (error) {
    console.error('Erreur API users:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des utilisateurs',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
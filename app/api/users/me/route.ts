import { NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { UserModel } from '@/lib/models/User'
import { UserStatsModel } from '@/lib/models/UserStats'
import { redisHelpers } from '@/lib/redis'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    await connectToRedis()
    
    const url = new URL(request.url)
    const telegramId = url.searchParams.get('telegramId')
    
    if (!telegramId) {
      return NextResponse.json(
        { error: 'Telegram ID is required' },
        { status: 400 }
      )
    }
    
    // Récupérer l'utilisateur
    const user = await UserModel.findByTelegramId(telegramId)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Récupérer les stats de l'utilisateur
    const userStats = await UserStatsModel.findOne({ userId: telegramId })
    
    // Récupérer les badges de l'utilisateur (depuis Redis)
    const badgesKey = `userbadges:${telegramId}`
    const userBadges = await redisHelpers.lrange(badgesKey) || []
    
    // Récupérer les préférences
    const preferencesKey = `userpreferences:${telegramId}`
    const userPreferences = await redisHelpers.get(preferencesKey) || {}
    
    return NextResponse.json({
      user: {
        _id: user._id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        photoUrl: user.photoUrl,
        languageCode: user.languageCode || 'fr',
        isPremium: user.isPremium || false,
        joinedAt: user.joinedAt || user.createdAt,
      },
      stats: {
        points: userStats?.points || 0,
        level: userStats?.level || 1,
        battlesWon: userStats?.battlesWon || 0,
        battlesLost: userStats?.battlesLost || 0,
      },
      badges: userBadges || [],
      preferences: userPreferences || {}
    })
    
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


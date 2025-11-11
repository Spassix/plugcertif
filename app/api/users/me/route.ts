import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import mongoose from 'mongoose'

export async function GET(request: Request) {
  try {
    await connectToDatabase()
    
    // Récupérer les données Telegram depuis les headers ou query params
    const url = new URL(request.url)
    const telegramId = url.searchParams.get('telegramId')
    
    if (!telegramId) {
      return NextResponse.json(
        { error: 'Telegram ID is required' },
        { status: 400 }
      )
    }
    
    const db = mongoose.connection.db
    if (!db) {
      throw new Error('Database connection not established')
    }
    
    // Récupérer l'utilisateur
    const user = await db.collection('users').findOne({ telegramId: telegramId })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Récupérer les stats de l'utilisateur
    const userStats = await db.collection('userstats').findOne({ userId: user.telegramId })
    
    // Récupérer les badges de l'utilisateur
    const userBadges = await db.collection('userbadges').find({ userId: user.telegramId }).toArray()
    
    // Récupérer les préférences
    const userPreferences = await db.collection('userpreferences').findOne({ userId: user.telegramId })
    
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


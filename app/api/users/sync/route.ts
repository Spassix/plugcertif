import { NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { UserModel } from '@/lib/models/User'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    await connectToRedis()
    
    const userData = await request.json()
    
    // Vérifier la clé secrète pour sécuriser l'endpoint
    const authHeader = request.headers.get('authorization')
    const secretKey = process.env.SYNC_SECRET_KEY || 'default-sync-key'
    
    if (authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Créer ou mettre à jour l'utilisateur
    const user = await UserModel.findOneAndUpdate(
      { telegramId: userData.telegramId },
      {
        telegramId: userData.telegramId,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        photoUrl: userData.photoUrl,
        languageCode: userData.languageCode,
        isPremium: userData.isPremium,
        joinedAt: userData.joinedAt ? new Date(userData.joinedAt) : undefined,
      }
    )
    
    return NextResponse.json({ 
      success: true,
      user: {
        _id: user._id,
        telegramId: user.telegramId,
        username: user.username
      }
    })
    
  } catch (error) {
    console.error('User sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    )
  }
}

// Route pour supprimer un utilisateur
export async function DELETE(request: Request) {
  try {
    await connectToRedis()
    
    const { telegramId } = await request.json()
    
    // Vérifier la clé secrète
    const authHeader = request.headers.get('authorization')
    const secretKey = process.env.SYNC_SECRET_KEY || 'default-sync-key'
    
    if (authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = await UserModel.findByTelegramId(telegramId)
    if (user && user._id) {
      await UserModel.delete(user._id)
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('User delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
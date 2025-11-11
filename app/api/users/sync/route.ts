import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    
    const userData = await request.json()
    
    // Vérifier la clé secrète pour sécuriser l'endpoint
    const authHeader = request.headers.get('authorization')
    const secretKey = process.env.SYNC_SECRET_KEY || 'default-sync-key'
    
    if (authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Créer ou mettre à jour l'utilisateur
    const user = await User.findOneAndUpdate(
      { telegramId: userData.telegramId },
      {
        telegramId: userData.telegramId,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        referredBy: userData.referredBy,
        hasBeenCountedAsReferral: userData.hasBeenCountedAsReferral,
        lastLikeAt: userData.lastLikeAt,
        likedPlugs: userData.likedPlugs,
        joinedAt: userData.joinedAt,
        isAdmin: userData.isAdmin
      },
      { 
        upsert: true, 
        new: true,
        runValidators: true
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
    await connectToDatabase()
    
    const { telegramId } = await request.json()
    
    // Vérifier la clé secrète
    const authHeader = request.headers.get('authorization')
    const secretKey = process.env.SYNC_SECRET_KEY || 'default-sync-key'
    
    if (authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    await User.findOneAndDelete({ telegramId })
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('User delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
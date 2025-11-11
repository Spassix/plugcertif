import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Forcer une nouvelle connexion
    await connectToDatabase()
    
    // Compter directement sans cache
    const userCount = await User.countDocuments({})
    
    // Obtenir aussi les 5 derniers utilisateurs pour vérification
    const recentUsers = await User.find()
      .sort({ joinedAt: -1 })
      .limit(5)
      .select('telegramId username firstName joinedAt')
    
    // Revalider les chemins qui utilisent le comptage
    try {
      revalidatePath('/api/users/count')
      revalidatePath('/api/stats')
      revalidatePath('/')
    } catch (e) {
      console.log('Revalidation paths:', e)
    }
    
    return NextResponse.json({
      count: userCount,
      recentUsers: recentUsers.map(u => ({
        telegramId: u.telegramId,
        username: u.username,
        firstName: u.firstName,
        joinedAt: u.joinedAt
      })),
      timestamp: new Date().toISOString(),
      success: true
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
        'X-Vercel-Cache': 'MISS'
      }
    })
  } catch (error) {
    console.error('User refresh count API error:', error)
    return NextResponse.json(
      { error: 'Failed to refresh user count', success: false },
      { status: 500 }
    )
  }
}
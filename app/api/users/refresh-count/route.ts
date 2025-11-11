import { NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { UserModel } from '@/lib/models/User'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0

export async function GET() {
  try {
    await connectToRedis()
    
    // Compter directement sans cache
    const userCount = await UserModel.count()
    
    // Obtenir aussi les 5 derniers utilisateurs pour vérification
    const allUsers = await UserModel.find()
    const recentUsers = allUsers
      .sort((a, b) => {
        const dateA = a.joinedAt ? new Date(a.joinedAt).getTime() : 0
        const dateB = b.joinedAt ? new Date(b.joinedAt).getTime() : 0
        return dateB - dateA
      })
      .slice(0, 5)
      .map(u => ({
        telegramId: u.telegramId,
        username: u.username,
        firstName: u.firstName,
        joinedAt: u.joinedAt
      }))
    
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
      recentUsers,
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
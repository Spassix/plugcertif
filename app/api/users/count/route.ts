import { NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { UserModel } from '@/lib/models/User'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    await connectToRedis()
    
    const userCount = await UserModel.count()
    
    return NextResponse.json({
      count: userCount,
      success: true
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('User count API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user count', success: false },
      { status: 500 }
    )
  }
}
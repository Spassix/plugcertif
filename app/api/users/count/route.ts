import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'

export async function GET() {
  try {
    await connectToDatabase()
    
    const userCount = await User.countDocuments()
    
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
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import Plug from '@/models/Plug'

export async function GET() {
  try {
    await connectToDatabase()
    
    const userCount = await User.countDocuments()
    const plugCount = await Plug.countDocuments()
    
    return NextResponse.json({
      userCount,
      plugCount
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
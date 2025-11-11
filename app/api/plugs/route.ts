import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Plug from '@/models/Plug'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const showAll = searchParams.get('all') === 'true'
    
    const query = showAll ? {} : { isActive: true }
    
    const plugs = await Plug.find(query)
      .sort({ likes: -1, referralCount: -1 })
      .limit(100)
    
    return NextResponse.json(plugs)
  } catch (error) {
    console.error('Plugs API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch plugs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, plugId } = body
    
    if (action === 'like') {
      await connectToDatabase()
      
      const plug = await Plug.findByIdAndUpdate(
        plugId,
        { $inc: { likes: 1 } },
        { new: true }
      )
      
      if (!plug) {
        return NextResponse.json(
          { error: 'Plug not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ success: true, likes: plug.likes })
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Plugs POST error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
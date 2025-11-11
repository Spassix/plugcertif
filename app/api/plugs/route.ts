import { NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { PlugModel } from '@/lib/models/Plug'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    await connectToRedis()
    
    const url = new URL(request.url)
    const all = url.searchParams.get('all') === 'true'
    
    const plugs = await PlugModel.find({ all, isActive: !all })
    
    return NextResponse.json(plugs)
  } catch (error) {
    console.error('Error fetching plugs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

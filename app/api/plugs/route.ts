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
    
    // S'assurer de toujours retourner un tableau
    return NextResponse.json(Array.isArray(plugs) ? plugs : [])
  } catch (error) {
    console.error('Error fetching plugs:', error)
    // Retourner un tableau vide au lieu d'une erreur pour éviter les crashes côté client
    return NextResponse.json([])
  }
}

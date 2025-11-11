import { NextRequest, NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { PlugModel } from '@/lib/models/Plug'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const authHeader = request.headers.get('authorization')
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectToRedis()
    
    const body = await request.json()
    const { likesToAdd = 50 } = body
    
    // Récupérer tous les plugs
    const plugs = await PlugModel.find({ all: true })
    
    // Mettre à jour chaque plug
    const updatePromises = plugs.map(plug => {
      if (!plug._id) return null
      return PlugModel.findByIdAndUpdate(plug._id, {
        likes: (plug.likes || 0) + likesToAdd
      })
    })
    
    const updatedPlugs = (await Promise.all(updatePromises)).filter(p => p !== null)
    
    return NextResponse.json({
      success: true,
      message: `Ajouté ${likesToAdd} likes à ${updatedPlugs.length} plugs`,
      plugs: updatedPlugs.map(plug => ({
        id: plug!._id,
        name: plug!.name,
        likes: plug!.likes
      }))
    })
  } catch (error) {
    console.error('Add likes error:', error)
    return NextResponse.json(
      { error: 'Failed to add likes' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Plug from '@/models/Plug'

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

    await connectToDatabase()
    
    const body = await request.json()
    const { likesToAdd = 50 } = body
    
    // Récupérer tous les plugs
    const plugs = await Plug.find({})
    
    // Mettre à jour chaque plug
    const updatePromises = plugs.map(plug => 
      Plug.findByIdAndUpdate(
        plug._id,
        { $inc: { likes: likesToAdd } },
        { new: true }
      )
    )
    
    const updatedPlugs = await Promise.all(updatePromises)
    
    return NextResponse.json({
      success: true,
      message: `Ajouté ${likesToAdd} likes à ${updatedPlugs.length} plugs`,
      plugs: updatedPlugs.map(plug => ({
        id: plug._id,
        name: plug.name,
        likes: plug.likes
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
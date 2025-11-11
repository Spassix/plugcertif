import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// Forcer la route à être dynamique
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET() {
  try {
    await connectToDatabase()
    
    // Import lazy du modèle pour éviter les problèmes de build
    const Settings = (await import('@/models/Settings')).default
    
    const settings = await Settings.findOne()
    if (!settings) {
      // Image de fond par défaut en mosaïque
      return NextResponse.json({ 
        backgroundImage: 'https://i.imgur.com/UqyTSrh.jpeg', 
        logoImage: null 
      })
    }
    
    return NextResponse.json({
      backgroundImage: settings.backgroundImage || null,
      logoImage: settings.logoImage || null
    })
  } catch (error) {
    console.error('Background GET error:', error)
    // Retourner une réponse par défaut au lieu d'une erreur 500
    return NextResponse.json({ 
      backgroundImage: 'https://i.imgur.com/UqyTSrh.jpeg', 
      logoImage: null 
    })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    await connectToDatabase()
    
    // Import lazy du modèle pour éviter les problèmes de build
    const Settings = (await import('@/models/Settings')).default
    
    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings()
    }
    
    if (data.backgroundImage !== undefined) {
      settings.backgroundImage = data.backgroundImage
    }
    if (data.logoImage !== undefined) {
      settings.logoImage = data.logoImage
    }
    
    await settings.save()
    
    return NextResponse.json({
      backgroundImage: settings.backgroundImage || null,
      logoImage: settings.logoImage || null
    })
  } catch (error) {
    console.error('Background POST error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
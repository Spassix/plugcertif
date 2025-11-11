import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Settings from '@/models/Settings'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET() {
  try {
    await connectToDatabase()
    
    const settings = await Settings.findOne()
    if (!settings) {
      // Image de fond par défaut en mosaïque
      return NextResponse.json({ 
        backgroundImage: 'https://i.imgur.com/UqyTSrh.jpeg', 
        logoImage: null 
      })
    }
    
    return NextResponse.json({
      backgroundImage: settings.backgroundImage,
      logoImage: settings.logoImage
    })
  } catch (error) {
    console.error('Background GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    await connectToDatabase()
    
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
      backgroundImage: settings.backgroundImage,
      logoImage: settings.logoImage
    })
  } catch (error) {
    console.error('Background POST error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
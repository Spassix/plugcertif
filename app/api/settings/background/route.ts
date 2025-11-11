import { NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { SettingsModel } from '@/lib/models/Settings'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET() {
  try {
    await connectToRedis()
    const Settings = SettingsModel
    
    const settings = await Settings.findOne()
    
    // Gérer le cas où settings est null
    if (!settings) {
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
    await connectToRedis()
    
    const settings = await SettingsModel.update({
      backgroundImage: data.backgroundImage,
      logoImage: data.logoImage,
    })
    
    return NextResponse.json({
      backgroundImage: settings.backgroundImage || null,
      logoImage: settings.logoImage || null
    })
  } catch (error) {
    console.error('Background POST error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

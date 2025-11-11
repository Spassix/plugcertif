import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Settings from '@/models/Settings'

export async function GET() {
  try {
    await connectToDatabase()
    
    const settings = await Settings.findOne()
    
    // Réseaux sociaux par défaut si non configurés
    const defaultSocial = {
      telegram: '@PLGSCRTF',
      instagram: '@plugscrtfs',
      snapchat: 'plugscrtfs',
      twitter: '@plugscrtfs'
    }
    
    return NextResponse.json({
      social: settings?.creatorSocial || defaultSocial
    })
  } catch (error) {
    console.error('Social API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social networks' },
      { status: 500 }
    )
  }
}
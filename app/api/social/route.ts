import { NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { SettingsModel } from '@/lib/models/Settings'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    await connectToRedis()
    
    const settings = await SettingsModel.findOne()
    
    // Réseaux sociaux par défaut si non configurés
    const defaultSocial = {
      telegram: '@PLGSCRTF',
      instagram: '@plugscrtfs',
      snapchat: 'plugscrtfs',
      twitter: '@plugscrtfs'
    }
    
    return NextResponse.json({
      social: (settings as any)?.creatorSocial || defaultSocial
    })
  } catch (error) {
    console.error('Social API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social networks' },
      { status: 500 }
    )
  }
}
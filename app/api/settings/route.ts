import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Settings from '@/models/Settings'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET() {
  try {
    await connectToDatabase()
    let settings = await Settings.findOne()
    
    if (!settings) {
      settings = new Settings()
      await settings.save()
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const data = await request.json()
    
    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings()
    }
    
    // Mettre à jour les champs
    if (data.welcomeMessage !== undefined) settings.welcomeMessage = data.welcomeMessage
    if (data.welcomeImage !== undefined) settings.welcomeImage = data.welcomeImage
    if (data.infoText !== undefined) settings.infoText = data.infoText
    if (data.miniAppButtonText !== undefined) settings.miniAppButtonText = data.miniAppButtonText
    if (data.backgroundImage !== undefined) settings.backgroundImage = data.backgroundImage
    if (data.socialNetworks !== undefined) settings.socialNetworks = data.socialNetworks
    if (data.botSocialNetworks !== undefined) settings.botSocialNetworks = data.botSocialNetworks
    if (data.shopSocialNetworks !== undefined) settings.shopSocialNetworks = data.shopSocialNetworks
    if (data.countries !== undefined) settings.countries = data.countries
    if (data.postalCodes !== undefined) settings.postalCodes = data.postalCodes
    if (data.telegramChannelLink !== undefined) settings.telegramChannelLink = data.telegramChannelLink
    if (data.telegramChannelId !== undefined) settings.telegramChannelId = data.telegramChannelId
    if (data.maintenanceMode !== undefined) settings.maintenanceMode = data.maintenanceMode
    if (data.maintenanceBackgroundImage !== undefined) settings.maintenanceBackgroundImage = data.maintenanceBackgroundImage
    if (data.maintenanceLogo !== undefined) settings.maintenanceLogo = data.maintenanceLogo
    if (data.maintenanceEndTime !== undefined) settings.maintenanceEndTime = data.maintenanceEndTime
    if (data.tutoVideoUrl !== undefined) settings.tutoVideoUrl = data.tutoVideoUrl
    if (data.tutoText !== undefined) settings.tutoText = data.tutoText
    
    await settings.save()
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
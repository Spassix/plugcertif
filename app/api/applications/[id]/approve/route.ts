import { NextRequest, NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { VendorApplicationModel } from '@/lib/models/VendorApplication'
import { PlugModel } from '@/lib/models/Plug'
import { sendTelegramMessage } from '@/lib/telegram'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToRedis()
    
    const application = await VendorApplicationModel.findById(params.id)
    
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }
    
    // Créer le plug à partir de la candidature
    const newPlug = await PlugModel.create({
      name: application.username || 'Nouveau Plug',
      socialNetworks: application.socialNetworks || {},
      methods: application.methods || {
        delivery: false,
        shipping: false,
        meetup: false
      },
      location: application.location || {
        country: application.country || 'FR',
        department: application.department || '',
        postalCode: application.postalCode || ''
      },
      countries: application.country ? [application.country] : ['FR'],
      photo: application.photo || application.shopPhoto,
      description: application.description,
      isActive: true,
      likes: 0,
      referralCount: 0
    })
    
    // Mettre à jour le statut de la candidature
    await VendorApplicationModel.findByIdAndUpdate(params.id, {
      status: 'approved',
      reviewedAt: new Date()
    })
    
    // Envoyer un message Telegram au candidat
    if (application.telegramId) {
      const message = `✅ <b>Félicitations !</b>\n\n` +
        `Votre candidature a été approuvée ! 🎉\n\n` +
                  `Vous êtes maintenant un vendeur certifié PLUGS CRTFS.\n` +
        `Les utilisateurs peuvent désormais vous trouver dans la liste des plugs.\n\n` +
        `Bienvenue dans la communauté ! 🔌`
      
      await sendTelegramMessage(String(application.telegramId), message)
    }
    
    return NextResponse.json({ 
      success: true, 
      plug: newPlug 
    })
  } catch (error) {
    console.error('Approve application error:', error)
    return NextResponse.json(
      { error: 'Failed to approve application' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import VendorApplication from '@/models/VendorApplication'
import Plug from '@/models/Plug'
import { sendTelegramMessage } from '@/lib/telegram'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    
    const application = await VendorApplication.findById(params.id)
    
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }
    
    // Créer le plug à partir de la candidature
    const newPlug = new Plug({
      name: application.username,
      telegramId: application.telegramId,
      socialNetworks: application.socialNetworks,
      methods: application.methods,
      location: application.location || {
        country: application.country,
        department: application.department,
        postalCode: application.postalCode
      },
      country: application.country,
      department: application.department,
      postalCode: application.postalCode,
      deliveryZones: application.deliveryZones,
      shippingZones: application.shippingZones,
      meetupZones: application.meetupZones,
      photo: application.photo || application.shopPhoto,
      description: application.description,
      isActive: true,
      likes: 0,
      referralCount: 0
    })
    
    await newPlug.save()
    
    // Mettre à jour le statut de la candidature
    application.status = 'approved'
    application.reviewedAt = new Date()
    await application.save()
    
    // Envoyer un message Telegram au candidat
    if (application.telegramId) {
      const message = `✅ <b>Félicitations !</b>\n\n` +
        `Votre candidature a été approuvée ! 🎉\n\n` +
                  `Vous êtes maintenant un vendeur certifié PLUGS CRTFS.\n` +
        `Les utilisateurs peuvent désormais vous trouver dans la liste des plugs.\n\n` +
        `Bienvenue dans la communauté ! 🔌`
      
      await sendTelegramMessage(application.telegramId, message)
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
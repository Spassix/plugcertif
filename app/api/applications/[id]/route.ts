import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import VendorApplication from '@/models/VendorApplication'
import { sendTelegramMessage } from '@/lib/telegram'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    
    const data = await request.json()
    
    const application = await VendorApplication.findByIdAndUpdate(
      params.id,
      data,
      { new: true }
    )
    
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }
    
    // Envoyer un message Telegram au candidat si la candidature est toujours en attente
    if (application.status === 'pending' && application.telegramId) {
      const message = `📝 <b>Mise à jour de votre candidature</b>\n\n` +
        `Un administrateur a modifié votre candidature.\n` +
        `Elle est toujours en cours d'examen.\n\n` +
        `Vous serez notifié dès qu'une décision sera prise.`
      
      await sendTelegramMessage(application.telegramId, message)
    }
    
    return NextResponse.json(application)
  } catch (error) {
    console.error('Update application error:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}
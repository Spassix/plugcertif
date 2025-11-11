import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import VendorApplication from '@/models/VendorApplication'
import { sendTelegramMessage } from '@/lib/telegram'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    
    const application = await VendorApplication.findByIdAndUpdate(
      params.id,
      { 
        status: 'rejected',
        reviewedAt: new Date()
      },
      { new: true }
    )
    
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }
    
    // Envoyer un message Telegram au candidat
    if (application.telegramId) {
      const message = `❌ <b>Candidature refusée</b>\n\n` +
        `Malheureusement, votre candidature n'a pas été acceptée.\n\n` +
        `Cela peut être dû à :\n` +
        `• Informations incomplètes\n` +
        `• Non-respect des critères\n` +
        `• Zones de service limitées\n\n` +
        `Vous pouvez soumettre une nouvelle candidature avec des informations complètes.`
      
      await sendTelegramMessage(application.telegramId, message)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reject application error:', error)
    return NextResponse.json(
      { error: 'Failed to reject application' },
      { status: 500 }
    )
  }
}
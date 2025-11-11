import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Plug from '@/models/Plug'

async function notifyBot(type: string, action: string, data: any) {
  try {
    const botUrl = process.env.BOT_API_URL || 'http://localhost:3000'
    const response = await fetch(`${botUrl}/api/webhook/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.BOT_API_KEY || ''
      },
      body: JSON.stringify({ type, action, data })
    })
    
    if (!response.ok) {
      console.error('Failed to notify bot:', await response.text())
    }
  } catch (error) {
    console.error('Error notifying bot:', error)
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    await connectToDatabase()
    
    // Ajouter isActive par défaut
    const plugData = {
      ...data,
      isActive: true,
      likes: 0,
      referralCount: 0,
      createdAt: new Date()
    }
    
    const plug = new Plug(plugData)
    await plug.save()
    
    // Notifier le bot
    await notifyBot('plug', 'create', {
      name: plug.name,
      countryFlag: plug.countryFlag,
      department: plug.department
    })
    
    return NextResponse.json(plug, { status: 201 })
  } catch (error) {
    console.error('Error creating plug:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
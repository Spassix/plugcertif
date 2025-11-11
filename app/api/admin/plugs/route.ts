import { NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { PlugModel } from '@/lib/models/Plug'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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
    await connectToRedis()
    
    // Créer le plug
    const plug = await PlugModel.create({
      name: data.name,
      photo: data.photo,
      description: data.description,
      methods: data.methods || { delivery: false, shipping: false, meetup: false },
      deliveryDepartments: data.deliveryDepartments || [],
      deliveryPostalCodes: data.deliveryPostalCodes || [],
      meetupDepartments: data.meetupDepartments || [],
      meetupPostalCodes: data.meetupPostalCodes || [],
      socialNetworks: data.socialNetworks || {},
      customNetworks: data.customNetworks || [],
      location: data.location || { country: 'FR', department: '', postalCode: '' },
      countries: data.countries || ['FR'],
      shippingCountries: data.shippingCountries || [],
      country: data.country,
      countryFlag: data.countryFlag,
      department: data.department,
      postalCode: data.postalCode,
      likes: data.likes || 0,
      referralCount: data.referralCount || 0,
      referralLink: data.referralLink,
      isActive: data.isActive !== undefined ? data.isActive : true,
      isExample: data.isExample || false,
    })
    
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

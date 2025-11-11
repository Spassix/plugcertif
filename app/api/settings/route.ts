import { NextRequest, NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { SettingsModel } from '@/lib/models/Settings'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    await connectToRedis()
    const settings = await SettingsModel.findOne()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToRedis()
    const data = await request.json()
    const settings = await SettingsModel.update(data)
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

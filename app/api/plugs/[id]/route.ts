import { NextRequest, NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { PlugModel } from '@/lib/models/Plug'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToRedis()
    const plug = await PlugModel.findById(params.id)
    
    if (!plug) {
      return NextResponse.json({ error: 'Plug not found' }, { status: 404 })
    }
    
    return NextResponse.json(plug)
  } catch (error) {
    console.error('Error fetching plug:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToRedis()
    const data = await request.json()
    
    const plug = await PlugModel.update(params.id, data)
    
    if (!plug) {
      return NextResponse.json({ error: 'Plug not found' }, { status: 404 })
    }
    
    return NextResponse.json(plug)
  } catch (error) {
    console.error('Error updating plug:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToRedis()
    const deleted = await PlugModel.delete(params.id)
    
    if (!deleted) {
      return NextResponse.json({ error: 'Plug not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting plug:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

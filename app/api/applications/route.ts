import { NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { VendorApplicationModel } from '@/lib/models/VendorApplication'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    await connectToRedis()
    
    console.log('Fetching vendor applications...')
    const applications = await VendorApplicationModel.find()
    
    console.log(`Found ${applications.length} applications`)
    
    // Normaliser les données pour gérer les anciennes et nouvelles structures
    const normalizedApplications = applications.map((app: any) => ({
      ...app,
      // Utiliser les champs directs ou les anciens champs imbriqués
      country: app.country || app.location?.country || '',
      department: app.department || app.location?.department || '',
      postalCode: app.postalCode || app.location?.postalCode || '',
      photo: app.photo || app.shopPhoto || null,
      // S'assurer que les objets existent
      socialNetworks: {
        primary: app.socialNetworks?.primary || [],
        links: app.socialNetworks?.links || {},
        others: app.socialNetworks?.others || ''
      },
      methods: app.methods || {}
    }))
    
    return NextResponse.json(normalizedApplications)
  } catch (error) {
    console.error('Applications API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
import { NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { PlugModel } from '@/lib/models/Plug'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    await connectToRedis()
    
    // Récupérer tous les plugs actifs
    const plugs = await PlugModel.find({ isActive: true })
    
    // Extraire les pays et départements uniques
    const locations = new Map<string, Set<string>>()
    
    plugs.forEach(plug => {
      const country = plug.location?.country || plug.country || 'FR'
      const department = plug.location?.department || plug.department
      
      if (!locations.has(country)) {
        locations.set(country, new Set())
      }
      
      if (department) {
        locations.get(country)!.add(department)
      }
    })
    
    // Convertir en format utilisable
    const result = {
      countries: Array.from(locations.keys()).map(country => ({
        code: country,
        name: getCountryName(country),
        flag: getCountryFlag(country),
        departments: Array.from(locations.get(country) || []).sort()
      }))
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getCountryName(code: string): string {
  const names: { [key: string]: string } = {
    'FR': 'France',
    'BE': 'Belgique',
    'CH': 'Suisse',
    'CA': 'Canada',
    'LU': 'Luxembourg',
    'MC': 'Monaco'
  }
  return names[code] || code
}

function getCountryFlag(code: string): string {
  const flags: { [key: string]: string } = {
    'FR': '🇫🇷',
    'BE': '🇧🇪',
    'CH': '🇨🇭',
    'CA': '🇨🇦',
    'LU': '🇱🇺',
    'MC': '🇲🇨'
  }
  return flags[code] || '🌍'
}
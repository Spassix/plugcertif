import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'force') {
      // Forcer l'affichage du splash screen
      const response = NextResponse.json({ success: true })
      response.cookies.set('forceSplash', 'true', { 
        path: '/', 
        maxAge: 60 * 60 * 24 // 24 heures
      })
      return response
    } else if (action === 'reset') {
      // Réinitialiser le splash screen
      const response = NextResponse.json({ success: true })
      response.cookies.delete('hasVisited')
      response.cookies.delete('forceSplash')
      return response
    }
    
    return NextResponse.json({ error: 'Action invalide' }, { status: 400 })
  } catch (error) {
    console.error('Error managing splash screen:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la gestion du splash screen' },
      { status: 500 }
    )
  }
}
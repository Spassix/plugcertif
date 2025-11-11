import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import mongoose from 'mongoose'

export async function GET() {
  try {
    await connectToDatabase()
    
    // Accès direct à la base de données sans modèles
    const db = mongoose.connection.db
    if (!db) {
      throw new Error('Database connection not established')
    }
    
    // Récupérer directement depuis la collection users
    const users = await db.collection('users')
      .find({})
      .project({ username: 1, firstName: 1, telegramId: 1, createdAt: 1, _id: 1 })
      .sort({ createdAt: -1 })
      .toArray()
    
    // Récupérer tous les UserStats en une seule requête
    const userStats = await db.collection('userstats')
      .find({})
      .toArray()
    
    // Créer un map pour un accès rapide aux stats
    const statsMap = new Map()
    userStats.forEach(stat => {
      statsMap.set(stat.userId.toString(), stat.points || 0)
    })
    
    // Combiner les données
    const usersWithPoints = users.map(user => ({
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      telegramId: user.telegramId,
      createdAt: user.createdAt,
      points: statsMap.get(user.telegramId) || 0
    }))
    
    return NextResponse.json(usersWithPoints)
    
  } catch (error) {
    console.error('Erreur API users:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des utilisateurs',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
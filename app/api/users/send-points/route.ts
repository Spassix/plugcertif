import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import mongoose from 'mongoose'

// Définir le schéma UserStats directement ici pour éviter les problèmes d'import
const userStatsSchema = new mongoose.Schema({
  userId: {
    type: Number, // C'est le telegramId de l'utilisateur
    required: true,
    unique: true,
    index: true
  },
  username: String,
  points: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  badgePoints: {
    type: Number,
    default: 0
  }
}, { strict: false })

const UserStats = mongoose.models.UserStats || mongoose.model('UserStats', userStatsSchema)

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    
    const { userId, points, levels, message, adminName } = await request.json()
    
    if (!userId || ((!points || points <= 0) && (!levels || levels <= 0))) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      )
    }
    
    // Trouver l'utilisateur
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }
    
    // Trouver ou créer les stats de l'utilisateur
    // UserStats utilise telegramId comme userId
    const telegramIdNumber = Number(user.telegramId)
    let userStats = await UserStats.findOne({ userId: telegramIdNumber })
    console.log('UserStats avant modification:', userStats)
    
    if (!userStats) {
      console.log('Création de nouvelles stats pour telegramId:', telegramIdNumber)
      userStats = new UserStats({
        userId: telegramIdNumber,
        username: user.username || user.firstName,
        points: 0,
        level: 1,
        badgePoints: 0
      })
    }
    
    // Ajouter les points et niveaux
    const oldPoints = userStats.points || 0
    const oldLevel = userStats.level || 1
    
    if (points && points > 0) {
      userStats.points = oldPoints + points
      userStats.badgePoints = (userStats.badgePoints || 0) + points
    }
    
    if (levels && levels > 0) {
      userStats.level = oldLevel + levels
    }
    
    // Sauvegarder
    const savedStats = await userStats.save()
    console.log('UserStats après sauvegarde:', savedStats)
    
    // Logs pour debug
    console.log('User found:', {
      id: user._id,
      username: user.username,
      telegramId: user.telegramId
    })
    console.log('UserStats updated:', {
      userId: userStats.userId,
      oldPoints: oldPoints,
      newPoints: userStats.points,
      oldLevel: oldLevel,
      newLevel: userStats.level,
      newBadgePoints: userStats.badgePoints
    })
    
    // Envoyer la notification Telegram si l'utilisateur a un telegramId
    if (user.telegramId) {
      try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN
        console.log('Bot token exists:', !!botToken)
        
        let defaultMessage = ''
        if (points > 0 && levels > 0) {
          defaultMessage = `🎁 <b>${adminName || 'L\'administrateur'} vous a envoyé ${points} points et ${levels} niveau${levels > 1 ? 'x' : ''} !</b>\n\n💎 Ces points vous permettent d'acheter des badges exclusifs.\n🎖️ Vous êtes maintenant niveau ${userStats.level} !\n\n⭐ Total: <b>${userStats.points} points</b>\n\n📱 Faites /start pour voir les mises à jour !`
        } else if (points > 0) {
          defaultMessage = `🎁 <b>${adminName || 'L\'administrateur'} vous a envoyé ${points} points pour votre fidélité !</b>\n\n💎 Ces points vous permettent d'acheter des badges exclusifs dans la boutique.\n\n⭐ Vous avez maintenant <b>${userStats.points} points</b> au total !\n\n📱 Faites /start pour voir les mises à jour et découvrir les nouveautés !`
        } else if (levels > 0) {
          defaultMessage = `🎖️ <b>${adminName || 'L\'administrateur'} vous a fait monter de ${levels} niveau${levels > 1 ? 'x' : ''} !</b>\n\n🆙 Vous êtes maintenant niveau ${userStats.level} !\n🔓 De nouveaux badges sont maintenant disponibles dans la boutique.\n\n📱 Faites /start pour voir les mises à jour !`
        }
        
        const response = await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: user.telegramId,
              text: message || defaultMessage,
              parse_mode: 'HTML'
            })
          }
        )
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Erreur envoi notification Telegram:', errorText)
        } else {
          console.log('Telegram notification sent successfully to:', user.telegramId)
        }
      } catch (error) {
        console.error('Erreur notification Telegram:', error)
        // On continue même si la notification échoue
      }
    }
    
    return NextResponse.json({
      success: true,
      newTotal: userStats.points,
      newLevel: userStats.level,
      message: 'Envoi réussi'
    })
    
  } catch (error) {
    console.error('Erreur send points:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
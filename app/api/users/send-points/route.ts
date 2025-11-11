import { NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { UserModel } from '@/lib/models/User'
import { UserStatsModel } from '@/lib/models/UserStats'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    await connectToRedis()
    
    const { userId, points, levels, message, adminName } = await request.json()
    
    if (!userId || ((!points || points <= 0) && (!levels || levels <= 0))) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      )
    }
    
    // Trouver l'utilisateur
    const user = await UserModel.findById(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }
    
    // Trouver ou créer les stats de l'utilisateur
    let userStats = await UserStatsModel.findOne({ userId: user.telegramId })
    
    if (!userStats) {
      userStats = await UserStatsModel.findOneAndUpdate(
        { userId: user.telegramId },
        {
          points: 0,
          level: 1,
          battlesWon: 0,
          battlesLost: 0,
        }
      )
    }
    
    // Ajouter les points et niveaux
    const oldPoints = userStats.points || 0
    const oldLevel = userStats.level || 1
    
    let newPoints = oldPoints
    let newLevel = oldLevel
    
    if (points && points > 0) {
      newPoints = await UserStatsModel.incrementPoints(user.telegramId, points)
    }
    
    if (levels && levels > 0) {
      newLevel = await UserStatsModel.incrementLevel(user.telegramId, levels)
    }
    
    const savedStats = await UserStatsModel.findOne({ userId: user.telegramId })
    console.log('UserStats après sauvegarde:', savedStats)
    
    // Logs pour debug
    console.log('User found:', {
      id: user._id,
      username: user.username,
      telegramId: user.telegramId
    })
    console.log('UserStats updated:', {
      userId: user.telegramId,
      oldPoints: oldPoints,
      newPoints: savedStats?.points,
      oldLevel: oldLevel,
      newLevel: savedStats?.level,
    })
    
    // Envoyer la notification Telegram si l'utilisateur a un telegramId
    if (user.telegramId) {
      try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN
        console.log('Bot token exists:', !!botToken)
        
        const finalPoints = savedStats?.points || newPoints
        const finalLevel = savedStats?.level || newLevel
        
        let defaultMessage = ''
        if (points > 0 && levels > 0) {
          defaultMessage = `🎁 <b>${adminName || 'L\'administrateur'} vous a envoyé ${points} points et ${levels} niveau${levels > 1 ? 'x' : ''} !</b>\n\n💎 Ces points vous permettent d'acheter des badges exclusifs.\n🎖️ Vous êtes maintenant niveau ${finalLevel} !\n\n⭐ Total: <b>${finalPoints} points</b>\n\n📱 Faites /start pour voir les mises à jour !`
        } else if (points > 0) {
          defaultMessage = `🎁 <b>${adminName || 'L\'administrateur'} vous a envoyé ${points} points pour votre fidélité !</b>\n\n💎 Ces points vous permettent d'acheter des badges exclusifs dans la boutique.\n\n⭐ Vous avez maintenant <b>${finalPoints} points</b> au total !\n\n📱 Faites /start pour voir les mises à jour et découvrir les nouveautés !`
        } else if (levels > 0) {
          defaultMessage = `🎖️ <b>${adminName || 'L\'administrateur'} vous a fait monter de ${levels} niveau${levels > 1 ? 'x' : ''} !</b>\n\n🆙 Vous êtes maintenant niveau ${finalLevel} !\n🔓 De nouveaux badges sont maintenant disponibles dans la boutique.\n\n📱 Faites /start pour voir les mises à jour !`
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
      newTotal: savedStats?.points || newPoints,
      newLevel: savedStats?.level || newLevel,
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
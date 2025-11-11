export async function sendTelegramMessage(chatId: string | number, message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    })
    
    const data = await response.json()
    
    if (!data.ok) {
      console.error('Failed to send Telegram message:', data)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error sending Telegram message:', error)
    return false
  }
}
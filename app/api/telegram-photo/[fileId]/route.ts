import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const fileId = params.fileId
    
    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      )
    }
    
    console.log(`📸 Fetching Telegram photo with ID: ${fileId}`)
    
    // Récupérer le lien du fichier depuis l'API Telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      console.error('❌ TELEGRAM_BOT_TOKEN not configured')
      return NextResponse.json(
        { error: 'Bot token not configured' },
        { status: 500 }
      )
    }
    
    const getFileUrl = `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
    
    const fileResponse = await fetch(getFileUrl)
    const fileData = await fileResponse.json()
    
    console.log('📸 Telegram API response:', JSON.stringify(fileData))
    
    if (!fileData.ok) {
      console.error('❌ Telegram API error:', fileData.description)
      return NextResponse.json(
        { error: fileData.description || 'Failed to get file from Telegram' },
        { status: 400 }
      )
    }
    
    if (!fileData.result?.file_path) {
      console.error('❌ No file_path in response')
      return NextResponse.json(
        { error: 'No file path returned by Telegram' },
        { status: 500 }
      )
    }
    
    // Construire l'URL de téléchargement
    const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`
    
    // Récupérer l'image
    const imageResponse = await fetch(downloadUrl)
    
    if (!imageResponse.ok) {
      console.error('❌ Failed to download image:', imageResponse.status)
      return NextResponse.json(
        { error: 'Failed to download image from Telegram' },
        { status: imageResponse.status }
      )
    }
    
    const imageBuffer = await imageResponse.arrayBuffer()
    
    // Déterminer le type MIME basé sur l'extension
    const fileExtension = fileData.result.file_path.split('.').pop()?.toLowerCase()
    const contentType = fileExtension === 'png' ? 'image/png' : 'image/jpeg'
    
    console.log('✅ Successfully fetched photo')
    
    // Retourner l'image avec les bons headers
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    })
  } catch (error) {
    console.error('❌ Error fetching Telegram photo:', error)
    return NextResponse.json(
      { error: 'Failed to fetch photo', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
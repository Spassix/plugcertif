import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Vérifier le type de fichier
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Le fichier doit être une image ou une vidéo' },
        { status: 400 }
      )
    }
    


    // Convertir en buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Option 1: Utiliser un service d'upload gratuit (imgur)
    try {
      const base64 = buffer.toString('base64')
      
      const imgurResponse = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          'Authorization': 'Client-ID 8c79a66d9e83d1f', // Client ID public pour test
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
          type: 'base64'
        })
      })
      
      const imgurData = await imgurResponse.json()
      
      if (imgurResponse.ok && imgurData.success) {
        return NextResponse.json({ url: imgurData.data.link })
      }
    } catch (error) {
      console.error('[API Upload] Imgur error:', error)
    }
    
    // Option 2: Essayer Cloudinary sans preset (configuration publique)
    try {
      const CLOUDINARY_CLOUD_NAME = 'demo' // Compte demo public de Cloudinary
      
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`
      
      const cloudinaryFormData = new FormData()
      cloudinaryFormData.append('file', base64)
      cloudinaryFormData.append('upload_preset', 'ml_default')
      cloudinaryFormData.append('unsigned', 'true')
      cloudinaryFormData.append('cloud_name', CLOUDINARY_CLOUD_NAME)
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: cloudinaryFormData
        }
      )
      
      const data = await response.json()
      
      if (response.ok) {
        return NextResponse.json({ url: data.secure_url })
      }
    } catch (error) {
      console.error('[API Upload] Cloudinary demo error:', error)
    }
    
    // Option 3: Retourner une URL base64 locale (stockage temporaire)
    const base64Url = `data:${file.type};base64,${buffer.toString('base64')}`
    
    // Pour une solution permanente, vous devez configurer Cloudinary correctement
    console.warn('[API Upload] Utilisation d\'une URL base64 temporaire. Configurez Cloudinary pour une solution permanente.')
    
    return NextResponse.json({ 
      url: base64Url,
      warning: 'Image stockée temporairement. Configurez Cloudinary pour un stockage permanent.'
    })
    
  } catch (error) {
    console.error('[API Upload] Error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'upload' },
      { status: 500 }
    )
  }
}
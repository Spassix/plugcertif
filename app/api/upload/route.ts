import { NextRequest, NextResponse } from 'next/server'
import { uploadToBlob, generateBlobFilename } from '@/lib/blob'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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

    // Upload vers Vercel Blob
    const folder = isVideo ? 'videos' : 'images'
    const filename = generateBlobFilename(file.name, folder)
    const url = await uploadToBlob(file, filename)

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload' },
      { status: 500 }
    )
  }
}

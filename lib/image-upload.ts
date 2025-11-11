// Migration vers Vercel Blob
import { uploadToBlob, generateBlobFilename } from './blob'

// Upload d'image - utilise maintenant Vercel Blob
export const uploadImage = async (file: File): Promise<string> => {
  console.log('[Upload] Starting image upload to Vercel Blob...', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type
  })

  try {
    const filename = generateBlobFilename(file.name, 'images')
    const url = await uploadToBlob(file, filename)
    console.log('[Upload] Success! URL:', url)
    return url
  } catch (error) {
    console.error('[Upload] Blob upload error:', error)
    throw new Error('Erreur lors de l\'upload. Veuillez réessayer.')
  }
}

// Upload de vidéo
export const uploadVideo = async (file: File): Promise<string> => {
  console.log('[Upload] Starting video upload to Vercel Blob...', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type
  })

  try {
    const filename = generateBlobFilename(file.name, 'videos')
    const url = await uploadToBlob(file, filename)
    console.log('[Upload] Success! URL:', url)
    return url
  } catch (error) {
    console.error('[Upload] Blob upload error:', error)
    throw new Error('Erreur lors de l\'upload. Veuillez réessayer.')
  }
}

// Upload générique (image ou vidéo)
export const uploadFile = async (file: File): Promise<string> => {
  const isVideo = file.type.startsWith('video/')
  if (isVideo) {
    return uploadVideo(file)
  }
  return uploadImage(file)
}

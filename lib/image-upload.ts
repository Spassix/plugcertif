// Import de la fonction Cloudinary qui fonctionnait
import { uploadToCloudinary } from './cloudinary'
import { uploadWithFallback } from './cloudinary-fallback'

// Upload d'image - utilise la fonction qui marchait avant
export const uploadImage = async (file: File): Promise<string> => {
  console.log('[Upload] Starting image upload...', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type
  })
  


  // Vérifier le type de fichier
  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')
  
  if (!isImage && !isVideo) {
    throw new Error('Le fichier doit être une image ou une vidéo')
  }

  try {
    // Utiliser la fonction uploadToCloudinary du fichier cloudinary.ts
    const url = await uploadToCloudinary(file)
    console.log('[Upload] Success! URL:', url)
    return url
    
  } catch (error) {
    console.error('[Upload] Cloudinary error:', error)
    
    // Essayer avec les configurations de fallback
    try {
      console.log('[Upload] Trying fallback configurations...')
      const url = await uploadWithFallback(file)
      console.log('[Upload] Fallback success! URL:', url)
      return url
    } catch (fallbackError) {
      console.error('[Upload] Fallback error:', fallbackError)
    }
    
    // Si tout échoue, essayer via notre API
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || `Erreur upload: ${response.status}`)
      }
      
      return data.url
    } catch (apiError) {
      console.error('[Upload] API error:', apiError)
      
      if (error instanceof Error) {
        throw error
      }
      
      throw new Error('Erreur lors de l\'upload. Veuillez réessayer.')
    }
  }
}

// Upload direct vers Cloudinary (fallback)
export const uploadDirectToCloudinary = async (file: File): Promise<string> => {
  const CLOUDINARY_CLOUD_NAME = 'dg1cfd3ld'
  const CLOUDINARY_UPLOAD_PRESET = 'ml_default'
  
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  )
  
  const data = await response.json()
  
  if (!response.ok) {
    console.error('[Upload] Direct Cloudinary error:', data)
    throw new Error(data.error?.message || 'Erreur Cloudinary')
  }
  
  return data.secure_url
}

// Configuration alternative si tout échoue
export const createBase64Url = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}
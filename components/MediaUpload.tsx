'use client'

import { useState } from 'react'
import { uploadImage } from '@/lib/image-upload'
import toast from 'react-hot-toast'
import { PhotoIcon, VideoCameraIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'

interface MediaUploadProps {
  onUpload: (url: string, type: 'image' | 'video') => void
  currentMedia?: string
  currentType?: 'image' | 'video'
  label?: string
  acceptVideo?: boolean
}

export default function MediaUpload({ 
  onUpload, 
  currentMedia, 
  currentType = 'image',
  label = 'Choisir une image ou vidéo',
  acceptVideo = true 
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentMedia || null)
  const [mediaType, setMediaType] = useState<'image' | 'video'>(currentType)
  const [progress, setProgress] = useState(0)

  const acceptedFormats = acceptVideo 
    ? 'image/*,video/mp4,video/webm,video/quicktime' 
    : 'image/*'
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Déterminer le type
    const isVideo = file.type.startsWith('video/')
    const isImage = file.type.startsWith('image/')

    if (!isImage && !isVideo) {
      toast.error('Veuillez sélectionner une image ou une vidéo')
      return
    }

    if (!acceptVideo && isVideo) {
      toast.error('Seules les images sont acceptées')
      return
    }

    // Mettre à jour le type
    setMediaType(isVideo ? 'video' : 'image')

    // Afficher la prévisualisation
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    setUploading(true)
    setProgress(10)
    
    let progressInterval: NodeJS.Timeout | null = null
    
    try {
      // Progression
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev
          if (prev >= 70) return prev + 2
          if (prev >= 50) return prev + 5
          return prev + 10
        })
      }, isVideo ? 1000 : 500) // Plus lent pour les vidéos

      // Timeout très long pour les gros fichiers (5 minutes)
      const timeout = 300000 // 5 minutes
      const uploadPromise = uploadImage(file)
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(`Upload trop long. Veuillez réessayer.`)), timeout)
      )

      const url = await Promise.race([uploadPromise, timeoutPromise])
      
      // Upload réussi
      if (progressInterval) clearInterval(progressInterval)
      setProgress(100)
      
      onUpload(url, isVideo ? 'video' : 'image')
      toast.success(`${isVideo ? 'Vidéo' : 'Image'} uploadée avec succès !`)
      
      // Reset progress
      setTimeout(() => setProgress(0), 500)
      
    } catch (error: any) {
      console.error('Upload error:', error)
      
      if (progressInterval) clearInterval(progressInterval)
      
      let errorMessage = 'Erreur lors de l\'upload'
      if (error.message?.includes('trop long')) {
        errorMessage = error.message
      } else if (error.message?.includes('Network')) {
        errorMessage = 'Erreur de connexion. Vérifiez votre internet.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
      setPreview(currentMedia || null)
      setProgress(0)
    } finally {
      setUploading(false)
      if (progressInterval) clearInterval(progressInterval)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      
      <div className="relative">
        {preview ? (
          <div className="relative rounded-lg overflow-hidden bg-gray-800 border-2 border-gray-700">
            {mediaType === 'video' ? (
              <video 
                src={preview} 
                controls
                className="w-full h-48 object-cover"
              />
            ) : (
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-48 object-cover"
              />
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                <CloudArrowUpIcon className="w-12 h-12 text-white mb-2 animate-pulse" />
                <div className="w-48 bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-white text-sm">Upload en cours... {progress}%</span>
                {progress >= 90 && (
                  <span className="text-xs text-gray-400 mt-1">Finalisation...</span>
                )}
              </div>
            )}
          </div>
        ) : (
          <label className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-gray-600 transition-colors cursor-pointer block">
            <input
              type="file"
              accept={acceptedFormats}
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
            <div className="flex justify-center gap-4 mb-2">
              <PhotoIcon className="h-12 w-12 text-gray-400" />
              {acceptVideo && <VideoCameraIcon className="h-12 w-12 text-gray-400" />}
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Cliquez ou glissez {acceptVideo ? 'une image ou vidéo' : 'une image'} ici
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {acceptVideo 
                ? 'JPG, PNG, GIF, MP4, WEBM'
                : 'JPG, PNG, GIF'
              }
            </p>
          </label>
        )}
        
        {preview && !uploading && (
          <label className="absolute inset-0 w-full h-full cursor-pointer group">
            <input
              type="file"
              accept={acceptedFormats}
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-medium">Changer le média</span>
            </div>
          </label>
        )}
      </div>
      
      {currentMedia && !preview && (
        <p className="text-xs text-gray-500">Média actuel sauvegardé</p>
      )}
    </div>
  )
}
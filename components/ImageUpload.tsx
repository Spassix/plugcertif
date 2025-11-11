'use client'

import { useState } from 'react'
import { uploadImage } from '@/lib/image-upload'
import toast from 'react-hot-toast'
import { PhotoIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'

interface ImageUploadProps {
  onUpload: (url: string) => void
  currentImage?: string
  label?: string
}

export default function ImageUpload({ onUpload, currentImage, label = 'Choisir une image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [progress, setProgress] = useState(0)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier que c'est une image
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image')
      return
    }



    // Afficher la prévisualisation immédiatement
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload vers le service
    setUploading(true)
    setProgress(10)
    
    let progressInterval: NodeJS.Timeout | null = null
    
    try {
      // Progression plus réaliste
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev
          if (prev >= 70) return prev + 2
          if (prev >= 50) return prev + 5
          return prev + 10
        })
      }, 500)

      // Timeout de 5 minutes pour les gros fichiers
      const uploadPromise = uploadImage(file)
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Upload trop long. Veuillez réessayer.')), 300000)
      )

      const url = await Promise.race([uploadPromise, timeoutPromise])
      
      // Upload réussi
      if (progressInterval) clearInterval(progressInterval)
      setProgress(100)
      
      onUpload(url)
      toast.success('Image uploadée avec succès !')
      
      // Reset progress après succès
      setTimeout(() => setProgress(0), 500)
      
    } catch (error: any) {
      console.error('Upload error:', error)
      
      // Clear interval en cas d'erreur
      if (progressInterval) clearInterval(progressInterval)
      
      // Message d'erreur plus spécifique
      let errorMessage = 'Erreur lors de l\'upload'
      if (error.message?.includes('trop long')) {
        errorMessage = error.message
      } else if (error.message?.includes('Network')) {
        errorMessage = 'Erreur de connexion. Vérifiez votre internet.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
      setPreview(currentImage || null)
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
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-48 object-cover"
            />
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
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-400">
              Cliquez ou glissez une image ici
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG, GIF
            </p>
          </label>
        )}
        
        {preview && !uploading && (
          <label className="absolute inset-0 w-full h-full cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-medium">Changer l'image</span>
            </div>
          </label>
        )}
      </div>
      
      {currentImage && !preview && (
        <p className="text-xs text-gray-500">Image actuelle sauvegardée</p>
      )}
    </div>
  )
}
'use client'

import { useState } from 'react'
import { uploadImage } from '@/lib/image-upload'
import toast from 'react-hot-toast'
import { PhotoIcon, CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface MultiImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  label?: string
}

export default function MultiImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 5, 
  label = 'Images du produit' 
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Vérifier le nombre maximum d'images
    if (images.length + files.length > maxImages) {
      toast.error(`Vous ne pouvez ajouter que ${maxImages} images maximum`)
      return
    }

    // Vérifier que ce sont des images
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} n'est pas une image`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setUploading(true)
    setProgress(10)
    
    let progressInterval: NodeJS.Timeout | null = null
    const uploadedUrls: string[] = []
    
    try {
      // Progression
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev
          if (prev >= 70) return prev + 2
          if (prev >= 50) return prev + 5
          return prev + 10
        })
      }, 500)

      // Upload toutes les images
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        try {
          const url = await uploadImage(file)
          uploadedUrls.push(url)
          setProgress(Math.min(90, ((i + 1) / validFiles.length) * 100))
        } catch (error) {
          console.error(`Erreur upload ${file.name}:`, error)
          toast.error(`Erreur lors de l'upload de ${file.name}`)
        }
      }
      
      if (progressInterval) clearInterval(progressInterval)
      setProgress(100)
      
      // Ajouter les nouvelles images
      if (uploadedUrls.length > 0) {
        onImagesChange([...images, ...uploadedUrls])
        toast.success(`${uploadedUrls.length} image(s) uploadée(s) avec succès !`)
      }
      
      setTimeout(() => setProgress(0), 500)
      
    } catch (error: any) {
      console.error('Upload error:', error)
      if (progressInterval) clearInterval(progressInterval)
      toast.error('Erreur lors de l\'upload des images')
      setProgress(0)
    } finally {
      setUploading(false)
      if (progressInterval) clearInterval(progressInterval)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
    toast.success('Image supprimée')
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      
      {/* Grille d'images existantes */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img 
                src={image} 
                alt={`Image ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Zone d'upload */}
      {images.length < maxImages && (
        <div className="relative">
          <label className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-gray-600 transition-colors cursor-pointer block">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? (
              <div className="flex flex-col items-center">
                <CloudArrowUpIcon className="w-12 h-12 text-white mb-2 animate-pulse" />
                <div className="w-48 bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-white text-sm">Upload en cours... {progress}%</span>
              </div>
            ) : (
              <>
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-400">
                  Cliquez ou glissez des images ici
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {images.length}/{maxImages} images • JPG, PNG, GIF
                </p>
              </>
            )}
          </label>
        </div>
      )}
    </div>
  )
}
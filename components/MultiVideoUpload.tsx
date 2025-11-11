'use client'

import { useState } from 'react'
import { uploadImage } from '@/lib/image-upload'
import toast from 'react-hot-toast'
import { VideoCameraIcon, CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface VideoData {
  url: string
  thumbnail: string
}

interface MultiVideoUploadProps {
  videos: VideoData[]
  onVideosChange: (videos: VideoData[]) => void
  maxVideos?: number
  label?: string
}

export default function MultiVideoUpload({ 
  videos, 
  onVideosChange, 
  maxVideos = 3, 
  label = 'Vidéos du produit' 
}: MultiVideoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Vérifier le nombre maximum de vidéos
    if (videos.length + files.length > maxVideos) {
      toast.error(`Vous ne pouvez ajouter que ${maxVideos} vidéos maximum`)
      return
    }

    // Vérifier que ce sont des vidéos
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('video/')) {
        toast.error(`${file.name} n'est pas une vidéo`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setUploading(true)
    setProgress(10)
    
    let progressInterval: NodeJS.Timeout | null = null
    const uploadedVideos: VideoData[] = []
    
    try {
      // Progression
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev
          if (prev >= 70) return prev + 2
          if (prev >= 50) return prev + 5
          return prev + 10
        })
      }, 1000) // Plus lent pour les vidéos

      // Upload toutes les vidéos
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        try {
          const url = await uploadImage(file) // La fonction uploadImage gère aussi les vidéos
          uploadedVideos.push({ url, thumbnail: '' }) // Pas de thumbnail pour l'instant
          setProgress(Math.min(90, ((i + 1) / validFiles.length) * 100))
        } catch (error) {
          console.error(`Erreur upload ${file.name}:`, error)
          toast.error(`Erreur lors de l'upload de ${file.name}`)
        }
      }
      
      if (progressInterval) clearInterval(progressInterval)
      setProgress(100)
      
      // Ajouter les nouvelles vidéos
      if (uploadedVideos.length > 0) {
        onVideosChange([...videos, ...uploadedVideos])
        toast.success(`${uploadedVideos.length} vidéo(s) uploadée(s) avec succès !`)
      }
      
      setTimeout(() => setProgress(0), 500)
      
    } catch (error: any) {
      console.error('Upload error:', error)
      if (progressInterval) clearInterval(progressInterval)
      toast.error('Erreur lors de l\'upload des vidéos')
      setProgress(0)
    } finally {
      setUploading(false)
      if (progressInterval) clearInterval(progressInterval)
    }
  }

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index)
    onVideosChange(newVideos)
    toast.success('Vidéo supprimée')
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      
      {/* Grille de vidéos existantes */}
      {videos.length > 0 && (
        <div className="grid grid-cols-1 gap-2 mb-4">
          {videos.map((video, index) => (
            <div key={index} className="relative group">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <video 
                    src={video.url} 
                    className="w-16 h-12 object-cover rounded"
                    controls
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">Vidéo {index + 1}</div>
                    <div className="text-xs text-gray-400 truncate">{video.url}</div>
                    {video.thumbnail && (
                      <div className="text-xs text-gray-500">Miniature: {video.thumbnail}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Zone d'upload */}
      {videos.length < maxVideos && (
        <div className="relative">
          <label className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-gray-600 transition-colors cursor-pointer block">
            <input
              type="file"
              accept="video/*"
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
                {progress >= 90 && (
                  <span className="text-xs text-gray-400 mt-1">Finalisation...</span>
                )}
              </div>
            ) : (
              <>
                <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-400">
                  Cliquez ou glissez des vidéos ici
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {videos.length}/{maxVideos} vidéos • MP4, WEBM, MOV
                </p>
              </>
            )}
          </label>
        </div>
      )}
    </div>
  )
}
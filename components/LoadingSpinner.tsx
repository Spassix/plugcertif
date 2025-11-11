'use client'

interface LoadingSpinnerProps {
  message?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({ message = "Chargement...", fullScreen = true }: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-dark"
        style={{
          backgroundImage: 'url(https://i.imgur.com/UqyTSrh.jpeg)',
          backgroundSize: '200px 200px',
          backgroundPosition: '0 0',
          backgroundRepeat: 'repeat'
        }}
      >
        {/* Overlay sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-gray-400 text-sm">{message}</p>
      </div>
    </div>
  )
}
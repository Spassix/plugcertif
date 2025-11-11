"use client";
import { useEffect, useState } from "react";

export default function CbdSmokeLoader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Barre de progression qui se remplit en 10 secondes
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setVisible(false);
          return 100;
        }
        return newProgress;
      });
    }, 100); // Mise à jour toutes les 100ms pour une progression fluide

    return () => clearInterval(progressInterval);
  }, []);

  if (!visible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] grid place-items-center bg-neutral-900"
      style={{
        backgroundImage: 'url(https://i.imgur.com/UqyTSrh.jpeg)',
        backgroundSize: '200px 200px',
        backgroundPosition: '0 0',
        backgroundRepeat: 'repeat'
      }}
    >
      {/* Overlay sombre pour la lisibilité */}
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10 flex flex-col items-center px-4">
        {/* Animation GIF du joint CBD */}
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg flex items-center justify-center">
          <img 
            src="/joint-animation.gif" 
            alt="Joint CBD Animation"
            className="w-full h-auto max-h-[50vh] object-contain"
            style={{ 
              maxWidth: 'min(400px, 80vw)', 
              maxHeight: 'min(400px, 50vh)',
              width: 'auto',
              height: 'auto'
            }}
          />
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-white mb-2">
            CONFIGURATION DE VOS PLUGS
          </p>
          <p className="text-sm text-white/70 mb-4">
            PLGSCRTF 📱
          </p>
          
          {/* Barre de progression */}
          <div className="w-full max-w-64 bg-white/20 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-white/60">
            Chargement... {progress}%
          </p>
        </div>
      </div>
    </div>
  );
}
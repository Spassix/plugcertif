'use client'

import { useState } from 'react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface PostalCodeManagerProps {
  postalCodes: string[]
  onChange: (codes: string[]) => void
  placeholder?: string
}

export default function PostalCodeManager({ 
  postalCodes = [], 
  onChange,
  placeholder = "Code postal"
}: PostalCodeManagerProps) {
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')

  const addPostalCode = () => {
    const trimmed = inputValue.trim()
    
    // Validation basique du code postal
    if (!trimmed) {
      setError('Entrez un code postal')
      return
    }
    
    // Vérifier le format (5 chiffres pour la France, adapter selon les pays)
    if (!/^\d{4,6}$/.test(trimmed)) {
      setError('Format invalide (4-6 chiffres)')
      return
    }
    
    // Vérifier les doublons
    if (postalCodes.includes(trimmed)) {
      setError('Code postal déjà ajouté')
      return
    }
    
    onChange([...postalCodes, trimmed])
    setInputValue('')
    setError('')
  }

  const removePostalCode = (code: string) => {
    onChange(postalCodes.filter(c => c !== code))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addPostalCode()
    }
  }

  return (
    <div className="space-y-3">
      {/* Input pour ajouter */}
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setError('')
            }}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:border-primary focus:outline-none transition-colors"
          />
          {error && (
            <p className="text-red-400 text-xs mt-1">{error}</p>
          )}
        </div>
        <button
          type="button"
          onClick={addPostalCode}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {/* Liste des codes postaux */}
      {postalCodes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {postalCodes.map((code) => (
            <span
              key={code}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-700 text-white rounded-full text-sm"
            >
              {code}
              <button
                type="button"
                onClick={() => removePostalCode(code)}
                className="p-0.5 hover:bg-gray-600 rounded-full transition-colors"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      
      {postalCodes.length === 0 && (
        <p className="text-gray-500 text-sm">Aucun code postal ajouté</p>
      )}
    </div>
  )
}
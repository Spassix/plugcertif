'use client'

import { useState } from 'react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface CustomDepartmentManagerProps {
  departments: string[]
  onChange: (departments: string[]) => void
  placeholder?: string
}

export default function CustomDepartmentManager({ 
  departments = [], 
  onChange,
  placeholder = "Nom du département/région"
}: CustomDepartmentManagerProps) {
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')

  const addDepartment = () => {
    const trimmed = inputValue.trim()
    
    if (!trimmed) {
      setError('Entrez un nom de département')
      return
    }
    
    // Vérifier les doublons
    if (departments.includes(trimmed)) {
      setError('Département déjà ajouté')
      return
    }
    
    onChange([...departments, trimmed])
    setInputValue('')
    setError('')
  }

  const removeDepartment = (dept: string) => {
    onChange(departments.filter(d => d !== dept))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addDepartment()
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
          onClick={addDepartment}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {/* Liste des départements */}
      {departments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {departments.map((dept) => (
            <span
              key={dept}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full text-sm"
            >
              {dept}
              <button
                type="button"
                onClick={() => removeDepartment(dept)}
                className="p-0.5 hover:bg-blue-600/30 rounded-full transition-colors"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      
      {departments.length === 0 && (
        <p className="text-gray-500 text-sm">Aucun département ajouté</p>
      )}
    </div>
  )
}
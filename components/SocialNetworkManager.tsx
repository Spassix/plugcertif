'use client'

import { useState } from 'react'
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline'

interface SocialNetwork {
  id: string
  name: string
  emoji: string
  link: string
}

interface SocialNetworkManagerProps {
  networks: SocialNetwork[]
  onChange: (networks: SocialNetwork[]) => void
}

export default function SocialNetworkManager({ networks = [], onChange }: SocialNetworkManagerProps) {
  console.log('SocialNetworkManager - networks reçus:', networks)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newNetwork, setNewNetwork] = useState({ name: '', emoji: '', link: '' })

  const handleAdd = () => {
    if (newNetwork.name && newNetwork.emoji && newNetwork.link) {
      const network: SocialNetwork = {
        id: Date.now().toString(),
        ...newNetwork
      }
      onChange([...networks, network])
      setNewNetwork({ name: '', emoji: '', link: '' })
      setIsAdding(false)
    }
  }

  const handleUpdate = (id: string, updates: Partial<SocialNetwork>) => {
    onChange(networks.map(n => n.id === id ? { ...n, ...updates } : n))
  }

  const handleDelete = (id: string) => {
    onChange(networks.filter(n => n.id !== id))
  }

  const defaultEmojis = ['👻', '📷', '💬', '✈️', '🔒', '🔐', '🥔', '🎵', '📱', '💻', '🌐', '📧']

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Réseaux sociaux</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        )}
      </div>

      {/* Liste des réseaux existants */}
      <div className="space-y-2">
        {networks.map((network) => (
          <div key={network.id} className="bg-gray-800 border border-gray-700 rounded-lg p-3">
            {editingId === network.id ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={network.emoji}
                    onChange={(e) => handleUpdate(network.id, { emoji: e.target.value })}
                    className="w-14 h-14 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-center text-2xl"
                    placeholder="😀"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={network.name}
                      onChange={(e) => handleUpdate(network.id, { name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      placeholder="Nom du réseau"
                    />
                    <input
                      type="text"
                      value={network.link}
                      onChange={(e) => handleUpdate(network.id, { link: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      placeholder="@username ou lien"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                  >
                    Valider
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{network.emoji}</span>
                  <div>
                    <div className="font-medium text-white">{network.name}</div>
                    <div className="text-sm text-gray-400">{network.link}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(network.id)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <PencilIcon className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(network.id)}
                    className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Formulaire d'ajout */}
      {isAdding && (
        <div className="bg-gray-800 border-2 border-blue-600 rounded-lg p-4 space-y-4">
          {/* Section Emoji */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">1. Choisissez un emoji</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newNetwork.emoji}
                onChange={(e) => setNewNetwork({ ...newNetwork, emoji: e.target.value })}
                className="w-16 h-16 px-2 py-2 bg-gray-700 border border-gray-600 rounded text-center text-3xl"
                placeholder="😀"
              />
              <div className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {defaultEmojis.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setNewNetwork({ ...newNetwork, emoji })}
                      className="text-2xl hover:bg-gray-700 p-2 rounded transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">2. Nom du réseau</label>
            <input
              type="text"
              value={newNetwork.name}
              onChange={(e) => setNewNetwork({ ...newNetwork, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-base"
              placeholder="Ex: Instagram, WhatsApp, Telegram..."
            />
          </div>

          {/* Section Lien */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">3. Lien ou username</label>
            <input
              type="text"
              value={newNetwork.link}
              onChange={(e) => setNewNetwork({ ...newNetwork, link: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-base"
              placeholder="Ex: @username, +33612345678, https://..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Entrez un username, numéro de téléphone ou lien complet
            </p>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setIsAdding(false)
                setNewNetwork({ name: '', emoji: '', link: '' })
              }}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAdd}
              disabled={!newNetwork.name || !newNetwork.emoji || !newNetwork.link}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
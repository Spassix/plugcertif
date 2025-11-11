import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Category {
  _id: string
  name: string
  description: string
  createdAt: string
}

interface CategoryManagerProps {
  onCategorySelect?: (category: string) => void
  selectedCategory?: string
}

export default function CategoryManager({ onCategorySelect, selectedCategory }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Erreur lors du chargement des catégories')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Le nom de la catégorie est requis')
      return
    }

    try {
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories'
      const method = editingCategory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(editingCategory ? 'Catégorie modifiée avec succès' : 'Catégorie créée avec succès')
        setShowAddForm(false)
        setEditingCategory(null)
        setFormData({ name: '', description: '' })
        fetchCategories()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde de la catégorie')
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      return
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Catégorie supprimée avec succès')
        fetchCategories()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression de la catégorie')
    }
  }

  const startEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description
    })
    setShowAddForm(true)
  }

  const cancelEdit = () => {
    setShowAddForm(false)
    setEditingCategory(null)
    setFormData({ name: '', description: '' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestion des catégories</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Ajouter une catégorie
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom de la catégorie *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-primary focus:outline-none"
                placeholder="Ex: Électronique, Mode, Maison..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description (optionnel)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-primary focus:outline-none"
                rows={3}
                placeholder="Description de la catégorie..."
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {editingCategory ? 'Modifier' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="grid gap-4">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Aucune catégorie trouvée
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category._id}
              className={`bg-gray-800 rounded-lg p-4 flex items-center justify-between ${
                selectedCategory === category.name ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                {category.description && (
                  <p className="text-gray-400 text-sm mt-1">{category.description}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {onCategorySelect && (
                  <button
                    onClick={() => onCategorySelect(category.name)}
                    className={`px-3 py-1 rounded text-sm ${
                      selectedCategory === category.name
                        ? 'bg-primary text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {selectedCategory === category.name ? 'Sélectionnée' : 'Sélectionner'}
                  </button>
                )}
                
                <button
                  onClick={() => startEdit(category)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleDelete(category._id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
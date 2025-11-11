import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  createdAt: { type: Date, default: Date.now }
})

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema)

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'ID de catégorie invalide' },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    const { name, description } = body
    
    if (!name) {
      return NextResponse.json(
        { error: 'Le nom de la catégorie est requis' },
        { status: 400 }
      )
    }
    
    // Vérifier si une autre catégorie avec ce nom existe
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: params.id }
    })
    
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Cette catégorie existe déjà' },
        { status: 400 }
      )
    }
    
    const category = await Category.findByIdAndUpdate(
      params.id,
      { 
        name: name.trim(),
        description: description?.trim() || ''
      },
      { new: true, runValidators: true }
    )
    
    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la catégorie' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'ID de catégorie invalide' },
        { status: 400 }
      )
    }
    
    // Vérifier si des produits utilisent cette catégorie
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}))
    const productsUsingCategory = await Product.countDocuments({ category: params.id })
    
    if (productsUsingCategory > 0) {
      return NextResponse.json(
        { error: `Impossible de supprimer cette catégorie car ${productsUsingCategory} produit(s) l'utilisent` },
        { status: 400 }
      )
    }
    
    const category = await Category.findByIdAndDelete(params.id)
    
    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Catégorie supprimée avec succès' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la catégorie' },
      { status: 500 }
    )
  }
}
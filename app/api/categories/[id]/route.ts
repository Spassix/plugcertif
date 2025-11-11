import { NextRequest, NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { CategoryModel } from '@/lib/models/Category'
import { ProductModel } from '@/lib/models/Product'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToRedis()
    
    if (!params.id) {
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
    const existingCategory = await CategoryModel.findOne({ name: name.trim() })
    if (existingCategory && existingCategory._id !== params.id) {
      return NextResponse.json(
        { error: 'Cette catégorie existe déjà' },
        { status: 400 }
      )
    }
    
    const category = await CategoryModel.findByIdAndUpdate(params.id, {
      name: name.trim(),
      description: description?.trim() || ''
    })
    
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
    await connectToRedis()
    
    if (!params.id) {
      return NextResponse.json(
        { error: 'ID de catégorie invalide' },
        { status: 400 }
      )
    }
    
    // Vérifier si des produits utilisent cette catégorie
    const category = await CategoryModel.findById(params.id)
    if (category) {
      const products = await ProductModel.find({ category: category.name })
      if (products.length > 0) {
        return NextResponse.json(
          { error: `Impossible de supprimer cette catégorie car ${products.length} produit(s) l'utilisent` },
          { status: 400 }
        )
      }
    }
    
    const deletedCategory = await CategoryModel.findByIdAndDelete(params.id)
    
    if (!deletedCategory) {
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
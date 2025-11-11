import { NextRequest, NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { ProductModel } from '@/lib/models/Product'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToRedis()
    
    if (!params.id) {
      return NextResponse.json(
        { error: 'ID de produit invalide' },
        { status: 400 }
      )
    }
    
    const product = await ProductModel.findById(params.id)
    
    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }
    
    // Sanitiser les données du produit
    const sanitizedProduct = {
      _id: product._id || '',
      name: product.name || 'Produit sans nom',
      description: product.description || '',
      category: product.category || 'other',
      images: Array.isArray(product.images) ? product.images : [],
      videos: [], // Pas encore implémenté dans le modèle Redis
      inStock: typeof product.inStock === 'boolean' ? product.inStock : true,
      socialNetworks: {},
      likes: 0,
      views: 0,
      plugId: product.plugId || null,
      badgeCount: 0,
      badges: [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }
    
    return NextResponse.json(sanitizedProduct)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du produit' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToRedis()
    
    const body = await request.json()
    const product = await ProductModel.findByIdAndUpdate(params.id, body)
    
    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du produit' },
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
    
    const product = await ProductModel.findByIdAndDelete(params.id)
    
    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Produit supprimé avec succès' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du produit' },
      { status: 500 }
    )
  }
}

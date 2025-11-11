import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Product from '@/models/Product'
import mongoose from 'mongoose'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    
    if (!params.id || !mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'ID de produit invalide' },
        { status: 400 }
      )
    }
    
    const product = await Product.findById(params.id).lean() as any
    
    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }
    
    // Si le produit a un plugId, récupérer les badges
    let badgeCount = 0
    let badges: any[] = []
    if (product && product.plugId) {
      try {
        const db = mongoose.connection.db
        if (db) {
          const plugBadges = await db.collection('plugbadges').findOne({ plugId: product.plugId })
          if (plugBadges) {
            badgeCount = plugBadges.totalBadges || 0
            badges = plugBadges.badges || []
          }
        }
      } catch (badgeError) {
        console.warn('Error fetching badges:', badgeError)
        // Continue sans les badges en cas d'erreur
      }
    }
    
    // Sanitiser les données du produit
    const sanitizedProduct = {
      _id: product._id?.toString() || '',
      name: product.name || 'Produit sans nom',
      description: product.description || '',
      category: product.category || 'other',
      images: Array.isArray(product.images) ? product.images : [],
      videos: Array.isArray(product.videos) ? product.videos : [],
      inStock: typeof product.inStock === 'boolean' ? product.inStock : true,
      socialNetworks: product.socialNetworks || {},
      likes: product.likes || 0,
      views: product.views || 0,
      plugId: product.plugId?.toString() || null,
      badgeCount,
      badges: badges.slice(-5), // Les 5 derniers badges offerts
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
    await connectToDatabase()
    
    const body = await request.json()
    const product = await Product.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    ).lean() as any
    
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
    await connectToDatabase()
    
    const product = await Product.findByIdAndDelete(params.id).lean() as any
    
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

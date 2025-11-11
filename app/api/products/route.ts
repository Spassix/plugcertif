import { NextRequest, NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { ProductModel } from '@/lib/models/Product'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    await connectToRedis()
    
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    
    const filter: { category?: string; featured?: boolean } = {}
    if (category) filter.category = category
    if (featured === 'true') filter.featured = true
    
    const products = await ProductModel.find(filter)
    
    // Assurer que tous les produits ont les champs requis
    const sanitizedProducts = products.map(product => ({
      _id: product._id || '',
      name: product.name || 'Produit sans nom',
      description: product.description || '',
      price: typeof product.price === 'number' ? product.price : 0,
      category: product.category || 'other',
      images: Array.isArray(product.images) ? product.images : [],
      inStock: typeof product.inStock === 'boolean' ? product.inStock : true,
      featured: typeof product.featured === 'boolean' ? product.featured : false,
      specifications: product.specifications || {},
      plugId: product.plugId || null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }))
    
    return NextResponse.json(sanitizedProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToRedis()
    
    const body = await request.json()
    const product = await ProductModel.create(body)
    
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    
    let query: any = {}
    if (category) query.category = category
    if (featured === 'true') query.featured = true
    
    const products = await Product.find(query).sort({ createdAt: -1 }).lean() as any[]
    
    // Assurer que tous les produits ont les champs requis
    const sanitizedProducts = products.map(product => ({
      _id: product._id?.toString() || '',
      name: product.name || 'Produit sans nom',
      description: product.description || '',
      price: typeof product.price === 'number' ? product.price : 0,
      category: product.category || 'other',
      images: Array.isArray(product.images) ? product.images : [],
      inStock: typeof product.inStock === 'boolean' ? product.inStock : true,
      featured: typeof product.featured === 'boolean' ? product.featured : false,
      specifications: product.specifications || {},
      plugId: product.plugId?.toString() || null,
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
    await connectToDatabase()
    
    const body = await request.json()
    const product = await Product.create(body)
    
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    )
  }
}

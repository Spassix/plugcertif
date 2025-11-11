import { NextRequest, NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { CategoryModel } from '@/lib/models/Category'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    await connectToRedis()
    
    const categories = await CategoryModel.find()
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToRedis()
    
    const body = await request.json()
    const { name, description } = body
    
    if (!name) {
      return NextResponse.json(
        { error: 'Le nom de la catégorie est requis' },
        { status: 400 }
      )
    }
    
    // Vérifier si la catégorie existe déjà (insensible à la casse)
    const existingCategory = await CategoryModel.findOne({ name: name.trim() })
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Cette catégorie existe déjà' },
        { status: 400 }
      )
    }
    
    const category = await CategoryModel.create({
      name: name.trim(),
      description: description?.trim() || ''
    })
    
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    )
  }
}
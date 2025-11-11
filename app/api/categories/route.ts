import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import mongoose from 'mongoose'

// Modèle simple pour les catégories
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  createdAt: { type: Date, default: Date.now }
})

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema)

export async function GET() {
  try {
    await connectToDatabase()
    
    const categories = await Category.find({}).sort({ name: 1 }).lean()
    
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
    await connectToDatabase()
    
    const body = await request.json()
    const { name, description } = body
    
    if (!name) {
      return NextResponse.json(
        { error: 'Le nom de la catégorie est requis' },
        { status: 400 }
      )
    }
    
    // Vérifier si la catégorie existe déjà
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Cette catégorie existe déjà' },
        { status: 400 }
      )
    }
    
    const category = new Category({
      name: name.trim(),
      description: description?.trim() || ''
    })
    
    await category.save()
    
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    )
  }
}
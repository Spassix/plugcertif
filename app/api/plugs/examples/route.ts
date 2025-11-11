import { NextResponse } from 'next/server'
import { connectToRedis } from '@/lib/redis'
import { PlugModel } from '@/lib/models/Plug'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST() {
  try {
    await connectToRedis()
    
    // Supprimer les exemples existants
    const existingPlugs = await PlugModel.find({ all: true })
    const existingExamples = existingPlugs.filter(p => p.isExample)
    for (const plug of existingExamples) {
      if (plug._id) {
        await PlugModel.findByIdAndDelete(plug._id)
      }
    }
    
    const examplePlugsData = [
      {
        name: "PlugsParis",
        photo: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400",
        description: "Le meilleur service de Paris, livraison rapide dans tout l'Île-de-France. Service premium avec garantie satisfaction.",
        country: "FR",
        countryFlag: "🇫🇷",
        department: "75",
        postalCode: "75001",
        location: { country: "FR", department: "75", postalCode: "75001" },
        methods: { delivery: true, shipping: true, meetup: true },
        deliveryDepartments: ["75", "92", "93", "94", "77", "78", "91", "95"],
        socialNetworks: {
          snap: "plugsparis",
          instagram: "@plugsparis",
          telegram: "@plugsparis75",
          whatsapp: "+33 6 12 34 56 78"
        },
        likes: 245,
        referralCount: 89,
        isActive: true,
        isExample: true
      },
      {
        name: "PlugsMarseille",
        photo: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400",
        description: "Service de confiance sur Marseille et environs. Qualité garantie, prix compétitifs.",
        country: "FR",
        countryFlag: "🇫🇷",
        department: "13",
        postalCode: "13001",
        location: { country: "FR", department: "13", postalCode: "13001" },
        methods: { delivery: true, shipping: false, meetup: true },
        deliveryDepartments: ["13", "83", "84"],
        socialNetworks: {
          snap: "plugs13",
          instagram: "@plugsmarseille",
          signal: "+33 6 98 76 54 32"
        },
        likes: 189,
        referralCount: 67,
        isActive: true,
        isExample: true
      },
      {
        name: "PlugsBruxelles",
        photo: "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=400",
        description: "Premier service belge certifié. Livraison dans toute la Belgique.",
        country: "BE",
        countryFlag: "🇧🇪",
        department: "BRU",
        postalCode: "1000",
        location: { country: "BE", department: "BRU", postalCode: "1000" },
        methods: { delivery: true, shipping: true, meetup: false },
        deliveryDepartments: ["BRU", "ANT", "LIE", "NAM"],
        socialNetworks: {
          telegram: "@plugsbe",
          whatsapp: "+32 4 12 34 56 78",
          threema: "PLUGSBE1"
        },
        likes: 156,
        referralCount: 45,
        isActive: true,
        isExample: true
      },
      {
        name: "PlugsGenève",
        photo: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400",
        description: "Service suisse de haute qualité. Discrétion et professionnalisme garantis.",
        country: "CH",
        countryFlag: "🇨🇭",
        department: "GE",
        postalCode: "1201",
        location: { country: "CH", department: "GE", postalCode: "1201" },
        methods: { delivery: false, shipping: true, meetup: true },
        deliveryDepartments: ["GE", "VD", "VS"],
        socialNetworks: {
          signal: "+41 79 123 45 67",
          threema: "PLUGSCH1",
          telegram: "@plugsgeneve"
        },
        likes: 203,
        referralCount: 78,
        isActive: true,
        isExample: true
      },
      {
        name: "PlugsLyon",
        photo: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400",
        description: "Service lyonnais rapide et fiable. Spécialiste de la région Rhône-Alpes.",
        country: "FR",
        countryFlag: "🇫🇷",
        department: "69",
        postalCode: "69001",
        location: { country: "FR", department: "69", postalCode: "69001" },
        methods: { delivery: true, shipping: true, meetup: true },
        deliveryDepartments: ["69", "42", "01", "38", "73", "74"],
        socialNetworks: {
          snap: "plugslyon69",
          instagram: "@plugslyon",
          whatsapp: "+33 6 45 67 89 01"
        },
        likes: 178,
        referralCount: 56,
        isActive: true,
        isExample: true
      },
      {
        name: "PlugsMontréal",
        photo: "https://images.unsplash.com/photo-1519178614-68673b201f36?w=400",
        description: "Le meilleur service du Québec. Livraison rapide à Montréal et environs.",
        country: "CA",
        countryFlag: "🇨🇦",
        department: "QC",
        postalCode: "H2X 1Y4",
        location: { country: "CA", department: "QC", postalCode: "H2X 1Y4" },
        methods: { delivery: true, shipping: false, meetup: true },
        deliveryDepartments: ["MTL", "LAV", "LNG"],
        socialNetworks: {
          telegram: "@plugsmtl",
          signal: "+1 514 123 4567",
          instagram: "@plugsmontreal"
        },
        likes: 134,
        referralCount: 42,
        isActive: true,
        isExample: true
      },
      {
        name: "PlugsLuxembourg",
        photo: "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?w=400",
        description: "Service premium au Luxembourg. Qualité et discrétion assurées.",
        country: "LU",
        countryFlag: "🇱🇺",
        department: "LUX",
        postalCode: "1111",
        location: { country: "LU", department: "LUX", postalCode: "1111" },
        methods: { delivery: true, shipping: true, meetup: true },
        deliveryDepartments: ["LUX", "ECH", "DIF"],
        socialNetworks: {
          threema: "PLUGSLUX",
          signal: "+352 123 456",
          telegram: "@plugslux"
        },
        likes: 167,
        referralCount: 51,
        isActive: true,
        isExample: true
      },
      {
        name: "PlugsNice",
        photo: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400",
        description: "Service de la Côte d'Azur. Livraison express sur Nice et Monaco.",
        country: "FR",
        countryFlag: "🇫🇷",
        department: "06",
        postalCode: "06000",
        location: { country: "FR", department: "06", postalCode: "06000" },
        methods: { delivery: true, shipping: true, meetup: true },
        deliveryDepartments: ["06", "83", "MC"],
        socialNetworks: {
          snap: "plugsnice06",
          instagram: "@plugsnice",
          whatsapp: "+33 6 22 33 44 55",
          telegram: "@plugs06"
        },
        likes: 212,
        referralCount: 73,
        isActive: true,
        isExample: true
      }
    ]
    
    // Créer les plugs exemples
    for (const plugData of examplePlugsData) {
      await PlugModel.create(plugData)
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `${examplePlugsData.length} exemples de plugs ajoutés` 
    })
  } catch (error) {
    console.error('Error adding example plugs:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout des exemples' },
      { status: 500 }
    )
  }
}